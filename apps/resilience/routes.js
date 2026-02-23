const crypto = require("crypto");
const db = require("../../shared/db");
const auth = require("../../shared/auth");
const RssParser = require("rss-parser");

const rssParser = new RssParser({ timeout: 15000 });

// ---------------------------------------------------------------------------
// Unified feed parser (RSS/Atom via rss-parser, JSON Feed via fetch)
// ---------------------------------------------------------------------------
async function parseFeedURL(url) {
  // Try RSS/Atom first
  try {
    const parsed = await rssParser.parseURL(url);
    return {
      title: parsed.title || "",
      items: (parsed.items || []).map((item) => ({
        guid: item.guid || item.id || item.link || item.title || "",
        title: (item.title || "").slice(0, 500),
        link: (item.link || "").slice(0, 2000),
        description: (item.contentSnippet || "").slice(0, 1000),
        content: item.content || item.contentSnippet || "",
        pub_date: item.isoDate || item.pubDate || null,
      })),
    };
  } catch {
    // Not RSS/Atom — try JSON Feed
  }

  // Try JSON Feed (https://jsonfeed.org/version/1.1/)
  const resp = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: { Accept: "application/feed+json, application/json" },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

  const text = await resp.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Not a valid feed (neither RSS/Atom nor JSON Feed)");
  }

  if (!json.version || !json.version.startsWith("https://jsonfeed.org/")) {
    throw new Error("Not a valid feed (neither RSS/Atom nor JSON Feed)");
  }

  return {
    title: json.title || "",
    items: (json.items || []).map((item) => ({
      guid: (item.id || item.url || item.title || "").slice(0, 2000),
      title: (item.title || "").slice(0, 500),
      link: (item.url || item.external_url || "").slice(0, 2000),
      description: (item.content_text || stripHtml(item.content_html) || item.summary || "").slice(0, 1000),
      content: item.content_html || item.content_text || item.summary || "",
      pub_date: item.date_published || item.date_modified || null,
    })),
  };
}

/** Strip HTML tags for plain-text description */
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------------------
// DB init
// ---------------------------------------------------------------------------
async function initResilienceTables() {
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_settings (
    user_id         TEXT PRIMARY KEY,
    retention_days  INTEGER NOT NULL DEFAULT 30,
    refresh_minutes INTEGER NOT NULL DEFAULT 60,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS resilience_feeds (
    feed_id         TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL,
    url             TEXT NOT NULL,
    title           TEXT NOT NULL DEFAULT '',
    last_fetched_at TEXT,
    last_error      TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS resilience_feed_items (
    item_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    feed_id     TEXT NOT NULL,
    user_id     TEXT NOT NULL,
    guid        TEXT NOT NULL,
    title       TEXT NOT NULL DEFAULT '',
    link        TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    pub_date    TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(feed_id, guid),
    FOREIGN KEY (feed_id) REFERENCES resilience_feeds(feed_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Migration: add content column
  try {
    await db.run(`ALTER TABLE resilience_feed_items ADD COLUMN content TEXT NOT NULL DEFAULT ''`);
  } catch {
    // column already exists
  }

  // GDACS watched countries
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_gdacs_countries (
    country_id  TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    name        TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // GDACS stored alerts
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_gdacs_alerts (
    alert_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     TEXT NOT NULL,
    country_id  TEXT NOT NULL,
    eventid     TEXT NOT NULL,
    eventtype   TEXT NOT NULL,
    name        TEXT NOT NULL DEFAULT '',
    country     TEXT NOT NULL DEFAULT '',
    alertlevel  TEXT NOT NULL DEFAULT '',
    alertscore  REAL,
    severity    TEXT NOT NULL DEFAULT '',
    fromdate    TEXT,
    todate      TEXT,
    url         TEXT NOT NULL DEFAULT '',
    fetched_at  TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, eventid),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (country_id) REFERENCES resilience_gdacs_countries(country_id) ON DELETE CASCADE
  )`);

  // Migration: add gdacs_refresh_minutes to settings
  try {
    await db.run(`ALTER TABLE resilience_settings ADD COLUMN gdacs_refresh_minutes INTEGER NOT NULL DEFAULT 60`);
  } catch {
    // column already exists
  }

  console.log("[Resilience] Ready.");
}

// ---------------------------------------------------------------------------
// GDACS fetch helper (used by search endpoint + background refresh)
// ---------------------------------------------------------------------------
const GDACS_CAP = 100;
const MAX_GDACS_DEPTH = 5;

async function fetchGdacsRange(type, from, to, alertlevel, depth = 0) {
  const fmt = (d) => d.toISOString().slice(0, 10);
  const url = `https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=${type}&fromDate=${fmt(from)}&toDate=${fmt(to)}&alertlevel=${alertlevel}`;
  const resp = await fetch(url, {
    signal: AbortSignal.timeout(20000),
    headers: { Accept: "application/json" },
  });
  if (!resp.ok) return [];
  const data = await resp.json();
  const features = data.features || [];

  if (features.length >= GDACS_CAP && depth < MAX_GDACS_DEPTH) {
    const midMs = Math.floor((from.getTime() + to.getTime()) / 2);
    const mid = new Date(midMs);
    if (fmt(from) !== fmt(mid) && fmt(mid) !== fmt(to)) {
      const [left, right] = await Promise.all([
        fetchGdacsRange(type, from, mid, alertlevel, depth + 1),
        fetchGdacsRange(type, mid, to, alertlevel, depth + 1),
      ]);
      return [...left, ...right];
    }
  }

  return features;
}

/** Parse GDACS features into flat event objects */
function parseGdacsFeatures(features) {
  const seen = new Set();
  const events = [];
  for (const f of features) {
    const p = f.properties || {};
    const key = `${p.eventtype}_${p.eventid}`;
    if (seen.has(key)) continue;
    seen.add(key);
    events.push({
      eventid: String(p.eventid || ""),
      eventtype: p.eventtype || "",
      name: p.name || "",
      country: p.country || "",
      iso3: p.iso3 || "",
      alertlevel: p.alertlevel || "",
      alertscore: p.alertscore ?? null,
      severity: p.severitydata?.severity
        ? `${p.severitydata.severity} ${p.severitydata.severityunit || ""}`.trim()
        : p.severitytext || "",
      fromdate: p.fromdate || "",
      todate: p.todate || "",
      url: p.url?.report || p.url?.details || "",
    });
  }
  return events;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
function mountRoutes(router) {
  // ── Settings ────────────────────────────────────────────────────
  router.get("/api/settings", auth.requireAuth, async (req, res) => {
    try {
      const settings = await db.get(
        "SELECT retention_days, refresh_minutes, gdacs_refresh_minutes FROM resilience_settings WHERE user_id = ?",
        [req.user.id]
      );
      const feeds = await db.all(
        "SELECT feed_id, url, title, last_fetched_at, last_error FROM resilience_feeds WHERE user_id = ? ORDER BY created_at ASC",
        [req.user.id]
      );
      const gdacsCountries = await db.all(
        "SELECT country_id, name, created_at FROM resilience_gdacs_countries WHERE user_id = ? ORDER BY created_at ASC",
        [req.user.id]
      );
      res.json({
        retention_days: settings?.retention_days ?? 30,
        refresh_minutes: settings?.refresh_minutes ?? 60,
        gdacs_refresh_minutes: settings?.gdacs_refresh_minutes ?? 60,
        feeds,
        gdacs_countries: gdacsCountries,
      });
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.put("/api/settings", auth.requireAuth, async (req, res) => {
    try {
      const body = req.body || {};
      // Ensure row exists
      await db.run("INSERT OR IGNORE INTO resilience_settings (user_id) VALUES (?)", [req.user.id]);
      // Partial update — only update fields that are provided
      if (body.retention_days !== undefined) {
        await db.run("UPDATE resilience_settings SET retention_days = ? WHERE user_id = ?",
          [parseInt(body.retention_days) || 30, req.user.id]);
      }
      if (body.refresh_minutes !== undefined) {
        await db.run("UPDATE resilience_settings SET refresh_minutes = ? WHERE user_id = ?",
          [parseInt(body.refresh_minutes) || 60, req.user.id]);
      }
      if (body.gdacs_refresh_minutes !== undefined) {
        await db.run("UPDATE resilience_settings SET gdacs_refresh_minutes = ? WHERE user_id = ?",
          [parseInt(body.gdacs_refresh_minutes) || 60, req.user.id]);
      }
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "SAVE_FAILED" });
    }
  });

  // ── Feeds CRUD ──────────────────────────────────────────────────
  router.post("/api/feeds", auth.requireAuth, async (req, res) => {
    try {
      const { url } = req.body || {};
      if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "INVALID_URL" });
      }

      // Validate URL format
      let parsedUrl;
      try {
        parsedUrl = new URL(url.trim());
      } catch {
        return res.status(400).json({ error: "INVALID_URL" });
      }
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return res.status(400).json({ error: "INVALID_URL" });
      }

      // Check duplicate
      const existing = await db.get(
        "SELECT feed_id FROM resilience_feeds WHERE user_id = ? AND url = ?",
        [req.user.id, parsedUrl.href]
      );
      if (existing) {
        return res.status(409).json({ error: "FEED_EXISTS" });
      }

      // Probe-parse to get title (RSS/Atom or JSON Feed)
      let feedTitle = "";
      try {
        const parsed = await parseFeedURL(parsedUrl.href);
        feedTitle = parsed.title;
      } catch {
        return res.status(400).json({ error: "FEED_PARSE_FAILED" });
      }

      const feedId = crypto.randomUUID();
      await db.run(
        "INSERT INTO resilience_feeds (feed_id, user_id, url, title) VALUES (?, ?, ?, ?)",
        [feedId, req.user.id, parsedUrl.href, feedTitle]
      );

      res.json({ feed_id: feedId, url: parsedUrl.href, title: feedTitle });
    } catch {
      res.status(500).json({ error: "ADD_FAILED" });
    }
  });

  router.delete("/api/feeds/:feedId", auth.requireAuth, async (req, res) => {
    try {
      const { feedId } = req.params;
      const feed = await db.get(
        "SELECT feed_id FROM resilience_feeds WHERE feed_id = ? AND user_id = ?",
        [feedId, req.user.id]
      );
      if (!feed) return res.status(404).json({ error: "NOT_FOUND" });

      // Items cascade-deleted via FK
      await db.run("DELETE FROM resilience_feeds WHERE feed_id = ?", [feedId]);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // ── Manual refresh ───────────────────────────────────────────────
  router.post("/api/feeds/refresh", auth.requireAuth, async (req, res) => {
    try {
      await refreshUserFeeds(req.user.id);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "REFRESH_FAILED" });
    }
  });

  // ── News items ──────────────────────────────────────────────────
  router.get("/api/news", auth.requireAuth, async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 30, 100);
      const offset = parseInt(req.query.offset) || 0;

      const items = await db.all(
        `SELECT i.item_id, i.guid, i.title, i.link, i.pub_date, i.created_at, f.title AS feed_title
         FROM resilience_feed_items i
         JOIN resilience_feeds f ON f.feed_id = i.feed_id
         WHERE i.user_id = ?
         ORDER BY i.pub_date DESC, i.item_id DESC
         LIMIT ? OFFSET ?`,
        [req.user.id, limit, offset]
      );

      const countRow = await db.get(
        "SELECT COUNT(*) AS total FROM resilience_feed_items WHERE user_id = ?",
        [req.user.id]
      );

      res.json({ items, total: countRow.total });
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // ── Purge all news items ────────────────────────────────────────
  router.delete("/api/news", auth.requireAuth, async (req, res) => {
    try {
      await db.run("DELETE FROM resilience_feed_items WHERE user_id = ?", [req.user.id]);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // ── GDACS search ────────────────────────────────────────────────
  router.get("/api/gdacs/search", auth.requireAuth, async (req, res) => {
    try {
      const days = Math.min(Math.max(parseInt(req.query.days) || 30, 1), 365);
      const eventlist = req.query.eventlist || "EQ,TC,FL,VO,WF,DR";
      const alertlevel = req.query.alertlevel || "Green;Orange;Red";
      const country = (req.query.country || "").trim().toLowerCase();

      const toDate = new Date();
      const fromDate = new Date(toDate.getTime() - days * 24 * 60 * 60 * 1000);
      const types = eventlist.split(",").filter(Boolean);

      const fetches = types.map((type) => fetchGdacsRange(type, fromDate, toDate, alertlevel));
      const results = await Promise.all(fetches);
      let events = parseGdacsFeatures(results.flat());

      // Filter out events that started before the search window
      const fromMs = fromDate.getTime();
      events = events.filter((e) => !e.fromdate || new Date(e.fromdate).getTime() >= fromMs);

      // Server-side country filter
      if (country) {
        events = events.filter(
          (e) => e.country.toLowerCase().includes(country) || e.iso3.toLowerCase() === country
        );
      }

      // Sort by fromdate DESC
      events.sort((a, b) => new Date(b.fromdate || 0).getTime() - new Date(a.fromdate || 0).getTime());

      res.json({ events, total: events.length });
    } catch (err) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        return res.status(504).json({ error: "GDACS_TIMEOUT" });
      }
      res.status(500).json({ error: "GDACS_FAILED" });
    }
  });

  // ── GDACS watched countries ───────────────────────────────────
  router.get("/api/gdacs/countries", auth.requireAuth, async (req, res) => {
    try {
      const countries = await db.all(
        "SELECT country_id, name, created_at FROM resilience_gdacs_countries WHERE user_id = ? ORDER BY created_at ASC",
        [req.user.id]
      );
      res.json({ countries });
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.post("/api/gdacs/countries", auth.requireAuth, async (req, res) => {
    try {
      const name = ((req.body || {}).name || "").trim();
      if (!name || name.length > 100) {
        return res.status(400).json({ error: "INVALID_NAME" });
      }
      // Check duplicate (case-insensitive)
      const existing = await db.get(
        "SELECT country_id FROM resilience_gdacs_countries WHERE user_id = ? AND LOWER(name) = LOWER(?)",
        [req.user.id, name]
      );
      if (existing) return res.status(409).json({ error: "COUNTRY_EXISTS" });

      const countryId = crypto.randomUUID();
      await db.run(
        "INSERT INTO resilience_gdacs_countries (country_id, user_id, name) VALUES (?, ?, ?)",
        [countryId, req.user.id, name]
      );
      res.json({ country_id: countryId, name });
    } catch {
      res.status(500).json({ error: "ADD_FAILED" });
    }
  });

  router.delete("/api/gdacs/countries/:countryId", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get(
        "SELECT country_id FROM resilience_gdacs_countries WHERE country_id = ? AND user_id = ?",
        [req.params.countryId, req.user.id]
      );
      if (!row) return res.status(404).json({ error: "NOT_FOUND" });
      await db.run("DELETE FROM resilience_gdacs_countries WHERE country_id = ?", [req.params.countryId]);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // ── GDACS stored alerts ───────────────────────────────────────
  router.get("/api/gdacs/alerts", auth.requireAuth, async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 30, 200);
      const offset = parseInt(req.query.offset) || 0;
      const countryId = req.query.country_id || "";

      let where = "a.user_id = ?";
      const params = [req.user.id];
      if (countryId) {
        where += " AND a.country_id = ?";
        params.push(countryId);
      }

      const items = await db.all(
        `SELECT a.alert_id, a.eventid, a.eventtype, a.name, a.country, a.alertlevel,
                a.alertscore, a.severity, a.fromdate, a.todate, a.url, a.fetched_at,
                c.name AS country_name, c.country_id
         FROM resilience_gdacs_alerts a
         JOIN resilience_gdacs_countries c ON c.country_id = a.country_id
         WHERE ${where}
         ORDER BY a.fromdate DESC, a.alert_id DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      const countRow = await db.get(
        `SELECT COUNT(*) AS total FROM resilience_gdacs_alerts a WHERE ${where}`,
        params
      );

      res.json({ items, total: countRow.total });
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.post("/api/gdacs/alerts/refresh", auth.requireAuth, async (req, res) => {
    try {
      await refreshUserGdacsAlerts(req.user.id);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "REFRESH_FAILED" });
    }
  });

  router.delete("/api/gdacs/alerts", auth.requireAuth, async (req, res) => {
    try {
      await db.run("DELETE FROM resilience_gdacs_alerts WHERE user_id = ?", [req.user.id]);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // ── Single news item detail ────────────────────────────────────
  router.get("/api/news/:itemId", auth.requireAuth, async (req, res) => {
    try {
      const item = await db.get(
        `SELECT i.item_id, i.title, i.link, i.description, i.content, i.pub_date, i.created_at, i.guid,
                f.title AS feed_title, f.url AS feed_url
         FROM resilience_feed_items i
         JOIN resilience_feeds f ON f.feed_id = i.feed_id
         WHERE i.item_id = ? AND i.user_id = ?`,
        [req.params.itemId, req.user.id]
      );
      if (!item) return res.status(404).json({ error: "NOT_FOUND" });
      res.json(item);
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });
}

// ---------------------------------------------------------------------------
// Feed fetch helper (single feed)
// ---------------------------------------------------------------------------
async function fetchSingleFeed(feed) {
  try {
    const parsed = await parseFeedURL(feed.url);

    for (const item of parsed.items) {
      if (!item.guid) continue;
      try {
        await db.run(
          `INSERT OR IGNORE INTO resilience_feed_items
           (feed_id, user_id, guid, title, link, description, content, pub_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [feed.feed_id, feed.user_id, item.guid, item.title, item.link, item.description, item.content, item.pub_date]
        );
      } catch {
        // skip individual item errors
      }
    }

    await db.run(
      "UPDATE resilience_feeds SET last_fetched_at = datetime('now'), last_error = NULL, title = ? WHERE feed_id = ?",
      [parsed.title, feed.feed_id]
    );
  } catch (err) {
    await db.run(
      "UPDATE resilience_feeds SET last_fetched_at = datetime('now'), last_error = ? WHERE feed_id = ?",
      [(err.message || "Unknown error").slice(0, 500), feed.feed_id]
    );
  }
}

// ---------------------------------------------------------------------------
// Manual refresh: single user (ignores interval)
// ---------------------------------------------------------------------------
async function refreshUserFeeds(userId) {
  const feeds = await db.all(
    "SELECT feed_id, user_id, url FROM resilience_feeds WHERE user_id = ?",
    [userId]
  );
  for (const feed of feeds) {
    await fetchSingleFeed(feed);
  }
}

// ---------------------------------------------------------------------------
// Background: refresh all feeds (respects interval)
// ---------------------------------------------------------------------------
async function refreshAllFeeds() {
  const feeds = await db.all(
    `SELECT f.feed_id, f.user_id, f.url, f.last_fetched_at,
            COALESCE(s.refresh_minutes, 60) AS refresh_minutes
     FROM resilience_feeds f
     LEFT JOIN resilience_settings s ON s.user_id = f.user_id`
  );

  const now = Date.now();

  for (const feed of feeds) {
    if (feed.last_fetched_at) {
      const lastMs = new Date(feed.last_fetched_at + "Z").getTime();
      if (now - lastMs < feed.refresh_minutes * 60 * 1000) continue;
    }
    await fetchSingleFeed(feed);
  }
}

// ---------------------------------------------------------------------------
// Background: cleanup expired items
// ---------------------------------------------------------------------------
async function cleanupExpiredItems() {
  // Group by user settings
  const users = await db.all(
    `SELECT DISTINCT f.user_id, COALESCE(s.retention_days, 30) AS retention_days
     FROM resilience_feeds f
     LEFT JOIN resilience_settings s ON s.user_id = f.user_id`
  );

  for (const u of users) {
    await db.run(
      `DELETE FROM resilience_feed_items
       WHERE user_id = ? AND created_at < datetime('now', '-' || ? || ' days')`,
      [u.user_id, u.retention_days]
    );
  }
}

// ---------------------------------------------------------------------------
// Manual refresh: single user GDACS alerts
// ---------------------------------------------------------------------------
async function refreshUserGdacsAlerts(userId) {
  const countries = await db.all(
    "SELECT country_id, name FROM resilience_gdacs_countries WHERE user_id = ?",
    [userId]
  );
  const toDate = new Date();
  const fromDate = new Date(toDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const types = ["EQ", "TC", "FL", "VO", "WF", "DR"];

  for (const c of countries) {
    try {
      const fetches = types.map((type) => fetchGdacsRange(type, fromDate, toDate, "Green;Orange;Red"));
      const results = await Promise.all(fetches);
      const events = parseGdacsFeatures(results.flat());
      const countryLower = c.name.toLowerCase();

      for (const ev of events) {
        if (!ev.country.toLowerCase().includes(countryLower) && ev.iso3.toLowerCase() !== countryLower) continue;
        if (ev.fromdate && new Date(ev.fromdate).getTime() < fromDate.getTime()) continue;
        try {
          await db.run(
            `INSERT OR IGNORE INTO resilience_gdacs_alerts
             (user_id, country_id, eventid, eventtype, name, country, alertlevel, alertscore, severity, fromdate, todate, url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, c.country_id, ev.eventid, ev.eventtype, ev.name, ev.country, ev.alertlevel, ev.alertscore, ev.severity, ev.fromdate, ev.todate, ev.url]
          );
        } catch { /* skip duplicates */ }
      }
    } catch { /* skip country on error */ }
  }
}

// ---------------------------------------------------------------------------
// Background: refresh all GDACS alerts (respects interval)
// ---------------------------------------------------------------------------
async function refreshAllGdacsAlerts() {
  const users = await db.all(
    `SELECT DISTINCT c.user_id, COALESCE(s.gdacs_refresh_minutes, 60) AS gdacs_refresh_minutes
     FROM resilience_gdacs_countries c
     LEFT JOIN resilience_settings s ON s.user_id = c.user_id`
  );

  for (const u of users) {
    // Check last alert fetch time for this user (use most recent fetched_at)
    const lastRow = await db.get(
      "SELECT MAX(fetched_at) AS last_fetched FROM resilience_gdacs_alerts WHERE user_id = ?",
      [u.user_id]
    );
    if (lastRow?.last_fetched) {
      const lastMs = new Date(lastRow.last_fetched + "Z").getTime();
      if (Date.now() - lastMs < u.gdacs_refresh_minutes * 60 * 1000) continue;
    }
    try {
      await refreshUserGdacsAlerts(u.user_id);
    } catch { /* ignore */ }
  }
}

// ---------------------------------------------------------------------------
// Background: cleanup GDACS alerts older than 7 days
// ---------------------------------------------------------------------------
async function cleanupGdacsAlerts() {
  await db.run(`DELETE FROM resilience_gdacs_alerts WHERE fetched_at < datetime('now', '-7 days')`);
}

module.exports = { initResilienceTables, mountRoutes, refreshAllFeeds, cleanupExpiredItems, refreshAllGdacsAlerts, cleanupGdacsAlerts };
