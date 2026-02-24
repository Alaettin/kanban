const crypto = require("crypto");
const db = require("../../shared/db");
const auth = require("../../shared/auth");
const RssParser = require("rss-parser");
const ISO_COUNTRIES = require("./iso-countries");

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

  // Migration: add gdacs_retention_days to settings
  try {
    await db.run(`ALTER TABLE resilience_settings ADD COLUMN gdacs_retention_days INTEGER NOT NULL DEFAULT 30`);
  } catch {
    // column already exists
  }

  // Migration: add import_interval_hours to settings
  try {
    await db.run(`ALTER TABLE resilience_settings ADD COLUMN import_interval_hours INTEGER NOT NULL DEFAULT 0`);
  } catch {
    // column already exists
  }

  // Migration: add gdacs_aas_group_id + gdacs_aas_path to settings
  try {
    await db.run(`ALTER TABLE resilience_settings ADD COLUMN gdacs_aas_group_id TEXT NOT NULL DEFAULT ''`);
  } catch {
    // column already exists
  }
  try {
    await db.run(`ALTER TABLE resilience_settings ADD COLUMN gdacs_aas_path TEXT NOT NULL DEFAULT ''`);
  } catch {
    // column already exists
  }

  // Migration: add gdacs_aas_columns to settings
  try {
    await db.run(`ALTER TABLE resilience_settings ADD COLUMN gdacs_aas_columns TEXT NOT NULL DEFAULT '[]'`);
  } catch {
    // column already exists
  }

  // GDACS AAS mapping cache
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_gdacs_aas_map (
    user_id       TEXT NOT NULL,
    aas_id        TEXT NOT NULL,
    country_value TEXT NOT NULL DEFAULT '',
    iso_code      TEXT NOT NULL DEFAULT '',
    columns_data  TEXT NOT NULL DEFAULT '{}',
    updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, aas_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Migration: add columns_data to gdacs_aas_map
  try {
    await db.run(`ALTER TABLE resilience_gdacs_aas_map ADD COLUMN columns_data TEXT NOT NULL DEFAULT '{}'`);
  } catch {
    // column already exists
  }

  // Indicator classes (user-defined categories)
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_indicator_classes (
    class_id    TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    name        TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Indicators
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_indicators (
    indicator_id  TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL,
    name          TEXT NOT NULL,
    class_id      TEXT,
    input_type    TEXT NOT NULL DEFAULT 'number',
    input_label   TEXT NOT NULL DEFAULT '',
    default_label TEXT NOT NULL DEFAULT '',
    default_color TEXT NOT NULL DEFAULT '#9ca3af',
    default_score REAL DEFAULT 0,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES resilience_indicator_classes(class_id) ON DELETE SET NULL
  )`);

  // Indicator rule groups (OR-linked, evaluated top to bottom)
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_indicator_groups (
    group_id      TEXT PRIMARY KEY,
    indicator_id  TEXT NOT NULL,
    user_id       TEXT NOT NULL,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    output_label  TEXT NOT NULL DEFAULT '',
    output_color  TEXT NOT NULL DEFAULT '#9ca3af',
    output_score  REAL DEFAULT 0,
    FOREIGN KEY (indicator_id) REFERENCES resilience_indicators(indicator_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Conditions within a group (AND-linked)
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_indicator_conditions (
    condition_id  TEXT PRIMARY KEY,
    group_id      TEXT NOT NULL,
    indicator_id  TEXT NOT NULL,
    user_id       TEXT NOT NULL,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    operator      TEXT NOT NULL DEFAULT '>=',
    value         TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (group_id) REFERENCES resilience_indicator_groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (indicator_id) REFERENCES resilience_indicators(indicator_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // AAS-Quellen (Repository-Server)
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_aas_sources (
    source_id    TEXT PRIMARY KEY,
    user_id      TEXT NOT NULL,
    name         TEXT NOT NULL,
    base_url     TEXT NOT NULL,
    item_prefix  TEXT NOT NULL DEFAULT '',
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  try { await db.run("ALTER TABLE resilience_aas_sources ADD COLUMN item_prefix TEXT NOT NULL DEFAULT ''"); } catch { /* exists */ }

  // AAS IDs pro Quelle (verfügbare Shells)
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_aas_source_ids (
    entry_id    TEXT PRIMARY KEY,
    source_id   TEXT NOT NULL,
    user_id     TEXT NOT NULL,
    aas_id      TEXT NOT NULL,
    entry_type  TEXT NOT NULL DEFAULT 'aas',
    item_id     TEXT NOT NULL DEFAULT '',
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(source_id, aas_id),
    FOREIGN KEY (source_id) REFERENCES resilience_aas_sources(source_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  try { await db.run("ALTER TABLE resilience_aas_source_ids ADD COLUMN entry_type TEXT NOT NULL DEFAULT 'aas'"); } catch { /* exists */ }
  try { await db.run("ALTER TABLE resilience_aas_source_ids ADD COLUMN item_id TEXT NOT NULL DEFAULT ''"); } catch { /* exists */ }

  // Asset groups
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_asset_groups (
    group_id   TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL,
    name       TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_asset_group_members (
    group_id   TEXT NOT NULL,
    aas_id     TEXT NOT NULL,
    source_id  TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (group_id, aas_id),
    FOREIGN KEY (group_id) REFERENCES resilience_asset_groups(group_id) ON DELETE CASCADE
  )`);

  // AAS imports (persisted shell + submodel snapshots)
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_aas_imports (
    aas_id          TEXT NOT NULL,
    user_id         TEXT NOT NULL,
    source_id       TEXT NOT NULL,
    shell_data      TEXT,
    submodels_data  TEXT,
    imported_at     TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, aas_id)
  )`);

  // Country code mappings (per-user, seeded lazily)
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_country_mappings (
    iso_code    TEXT NOT NULL,
    user_id     TEXT NOT NULL,
    alpha3      TEXT NOT NULL DEFAULT '',
    numeric     TEXT NOT NULL DEFAULT '',
    aas_names   TEXT NOT NULL DEFAULT '',
    gdacs_names TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (user_id, iso_code),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Migration: add alpha3/numeric columns
  try { await db.run("ALTER TABLE resilience_country_mappings ADD COLUMN alpha3 TEXT NOT NULL DEFAULT ''"); } catch { /* exists */ }
  try { await db.run("ALTER TABLE resilience_country_mappings ADD COLUMN numeric TEXT NOT NULL DEFAULT ''"); } catch { /* exists */ }

  console.log("[Resilience] Ready.");
}

async function seedCountryMappings(userId) {
  const row = await db.get(
    "SELECT 1 FROM resilience_country_mappings WHERE user_id = ? LIMIT 1",
    [userId]
  );
  if (row) return;
  const stmt = "INSERT OR IGNORE INTO resilience_country_mappings (iso_code, user_id, alpha3, numeric, gdacs_names) VALUES (?, ?, ?, ?, ?)";
  for (const [code, name, alpha3, num] of ISO_COUNTRIES) {
    await db.run(stmt, [code, userId, alpha3, num, name]);
  }
}

// ---------------------------------------------------------------------------
// GDACS fetch helper (used by search endpoint + background refresh)
// ---------------------------------------------------------------------------
const GDACS_CAP = 100;
const MAX_GDACS_DEPTH = 3;

async function fetchGdacsRange(type, from, to, alertlevel, depth = 0) {
  const fmt = (d) => d.toISOString().slice(0, 10);
  const url = `https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=${type}&fromDate=${fmt(from)}&toDate=${fmt(to)}&alertlevel=${alertlevel}`;
  try {
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
  } catch (err) {
    console.error(`[GDACS] fetchGdacsRange ${type} ${fmt(from)}..${fmt(to)} depth=${depth}:`, err.message);
    return [];
  }
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
// Base64-URL encode AAS/Submodel IDs for AAS V3 API path parameters
// ---------------------------------------------------------------------------
function toBase64Url(str) {
  if (str.includes("://") || str.startsWith("urn:")) {
    return encodeURIComponent(Buffer.from(str, "utf-8").toString("base64"));
  }
  try {
    const unescaped = decodeURIComponent(str);
    const decoded = Buffer.from(unescaped, "base64").toString("utf-8");
    if (decoded.includes("://") || decoded.startsWith("urn:")) return str;
  } catch { /* not base64 */ }
  return encodeURIComponent(Buffer.from(str, "utf-8").toString("base64"));
}

// ---------------------------------------------------------------------------
// AAS Import: server-side background job
// ---------------------------------------------------------------------------
const importJobs = {}; // { userId: { total, done, errors, running } }
const importTimers = {}; // { userId: timerId }

async function runImportJob(userId) {
  if (importJobs[userId]?.running) return;

  const entries = await db.all(
    `SELECT i.aas_id, s.source_id, s.base_url
     FROM resilience_aas_source_ids i
     JOIN resilience_aas_sources s ON s.source_id = i.source_id
     WHERE s.user_id = ?`,
    [userId]
  );
  if (entries.length === 0) return;

  const job = { total: entries.length, done: 0, errors: 0, running: true };
  importJobs[userId] = job;

  for (const entry of entries) {
    try {
      const baseUrl = entry.base_url.replace(/\/+$/, "");
      const encoded = toBase64Url(entry.aas_id);
      const shellResp = await fetch(`${baseUrl}/shells/${encoded}`, {
        signal: AbortSignal.timeout(15000),
        headers: { Accept: "application/json" },
      });
      if (!shellResp.ok) { job.errors++; job.done++; continue; }
      const shellData = await shellResp.json();

      const submodelRefs = shellData.submodels || [];
      const submodels = [];
      for (const ref of submodelRefs) {
        const smId = ref.keys?.[0]?.value;
        if (!smId) continue;
        try {
          const smEncoded = toBase64Url(smId);
          const smResp = await fetch(`${baseUrl}/shells/${encoded}/submodels/${smEncoded}`, {
            signal: AbortSignal.timeout(15000),
            headers: { Accept: "application/json" },
          });
          if (smResp.ok) submodels.push(await smResp.json());
        } catch { /* skip */ }
      }

      const now = new Date().toISOString().replace("T", " ").slice(0, 19);
      await db.run(
        `INSERT INTO resilience_aas_imports (aas_id, user_id, source_id, shell_data, submodels_data, imported_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, aas_id) DO UPDATE SET
           source_id=excluded.source_id, shell_data=excluded.shell_data,
           submodels_data=excluded.submodels_data, imported_at=excluded.imported_at`,
        [entry.aas_id, userId, entry.source_id, JSON.stringify(shellData), JSON.stringify(submodels), now]
      );
    } catch { job.errors++; }
    job.done++;
  }
  job.running = false;
}

function scheduleUserImport(userId, hours) {
  if (importTimers[userId]) clearInterval(importTimers[userId]);
  if (!hours || hours <= 0) { delete importTimers[userId]; return; }
  const ms = hours * 60 * 60 * 1000;
  importTimers[userId] = setInterval(() => runImportJob(userId), ms);
  console.log(`[Resilience] Scheduled import for user ${userId} every ${hours}h`);
}

async function scheduleImports() {
  try {
    const users = await db.all(
      "SELECT user_id, import_interval_hours FROM resilience_settings WHERE import_interval_hours > 0"
    );
    for (const u of users) scheduleUserImport(u.user_id, u.import_interval_hours);
  } catch { /* table may not have column yet */ }
}

// ---------------------------------------------------------------------------
// Shared helper: walk AAS submodel element tree
// ---------------------------------------------------------------------------
function walkElements(elements, segments, depth, values) {
  for (const el of elements) {
    if (el.idShort !== segments[depth]) continue;
    if (depth === segments.length - 1) {
      if (el.modelType === "Property" && el.value != null) values.add(String(el.value));
      if (el.modelType === "MultiLanguageProperty") {
        for (const l of (el.value || [])) { if (l.text) values.add(l.text); }
      }
    } else {
      const children = el.value || el.statements || [];
      if (Array.isArray(children)) walkElements(children, segments, depth + 1, values);
    }
  }
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
function mountRoutes(router) {
  // ── Settings ────────────────────────────────────────────────────
  router.get("/api/settings", auth.requireAuth, async (req, res) => {
    try {
      const settings = await db.get(
        "SELECT retention_days, refresh_minutes, gdacs_refresh_minutes, gdacs_retention_days, import_interval_hours, gdacs_aas_group_id, gdacs_aas_path, gdacs_aas_columns FROM resilience_settings WHERE user_id = ?",
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
        gdacs_retention_days: settings?.gdacs_retention_days ?? 30,
        import_interval_hours: settings?.import_interval_hours ?? 0,
        gdacs_aas_group_id: settings?.gdacs_aas_group_id ?? "",
        gdacs_aas_path: settings?.gdacs_aas_path ?? "",
        gdacs_aas_columns: JSON.parse(settings?.gdacs_aas_columns || "[]"),
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
      if (body.gdacs_retention_days !== undefined) {
        await db.run("UPDATE resilience_settings SET gdacs_retention_days = ? WHERE user_id = ?",
          [parseInt(body.gdacs_retention_days) || 30, req.user.id]);
      }
      if (body.import_interval_hours !== undefined) {
        const hours = parseInt(body.import_interval_hours) || 0;
        await db.run("UPDATE resilience_settings SET import_interval_hours = ? WHERE user_id = ?",
          [hours, req.user.id]);
        scheduleUserImport(req.user.id, hours);
      }
      if (body.gdacs_aas_group_id !== undefined) {
        await db.run("UPDATE resilience_settings SET gdacs_aas_group_id = ? WHERE user_id = ?",
          [String(body.gdacs_aas_group_id), req.user.id]);
      }
      if (body.gdacs_aas_path !== undefined) {
        await db.run("UPDATE resilience_settings SET gdacs_aas_path = ? WHERE user_id = ?",
          [String(body.gdacs_aas_path), req.user.id]);
      }
      if (body.gdacs_aas_columns !== undefined) {
        await db.run("UPDATE resilience_settings SET gdacs_aas_columns = ? WHERE user_id = ?",
          [JSON.stringify(body.gdacs_aas_columns), req.user.id]);
        // Re-compute mapping so columns_data reflects the new column paths
        try { await refreshGdacsAasMapping(req.user.id); } catch { /* ignore */ }
      }
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "SAVE_FAILED" });
    }
  });

  // ── Country Mappings ───────────────────────────────────────────
  router.get("/api/country-mappings", auth.requireAuth, async (req, res) => {
    try {
      await seedCountryMappings(req.user.id);
      const limit = Math.min(parseInt(req.query.limit) || 30, 300);
      const offset = parseInt(req.query.offset) || 0;
      const q = (req.query.q || "").trim();
      let where = "user_id = ?";
      const params = [req.user.id];
      if (q) {
        where += " AND (iso_code LIKE ? OR aas_names LIKE ? OR gdacs_names LIKE ?)";
        const like = `%${q}%`;
        params.push(like, like, like);
      }
      const total = (await db.get(`SELECT COUNT(*) AS c FROM resilience_country_mappings WHERE ${where}`, params)).c;
      const items = await db.all(
        `SELECT iso_code, alpha3, numeric, aas_names, gdacs_names FROM resilience_country_mappings WHERE ${where} ORDER BY iso_code ASC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );
      res.json({ items, total });
    } catch (err) {
      console.error("GET /api/country-mappings error:", err);
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.put("/api/country-mappings/:isoCode", auth.requireAuth, async (req, res) => {
    try {
      const { isoCode } = req.params;
      const { aas_names, gdacs_names } = req.body || {};
      const row = await db.get(
        "SELECT 1 FROM resilience_country_mappings WHERE user_id = ? AND iso_code = ?",
        [req.user.id, isoCode]
      );
      if (!row) return res.status(404).json({ error: "NOT_FOUND" });
      await db.run(
        "UPDATE resilience_country_mappings SET aas_names = ?, gdacs_names = ? WHERE user_id = ? AND iso_code = ?",
        [String(aas_names ?? ""), String(gdacs_names ?? ""), req.user.id, isoCode]
      );
      res.json({ ok: true });
    } catch (err) {
      console.error("PUT /api/country-mappings error:", err);
      res.status(500).json({ error: "SAVE_FAILED" });
    }
  });

  router.post("/api/country-mappings/reset", auth.requireAuth, async (req, res) => {
    try {
      await db.run("DELETE FROM resilience_country_mappings WHERE user_id = ?", [req.user.id]);
      const stmt = "INSERT OR IGNORE INTO resilience_country_mappings (iso_code, user_id, alpha3, numeric, gdacs_names) VALUES (?, ?, ?, ?, ?)";
      for (const [code, name, alpha3, num] of ISO_COUNTRIES) {
        await db.run(stmt, [code, req.user.id, alpha3, num, name]);
      }
      res.json({ ok: true });
    } catch (err) {
      console.error("POST /api/country-mappings/reset error:", err);
      res.status(500).json({ error: "RESET_FAILED" });
    }
  });

  router.get("/api/country-mappings/export", auth.requireAuth, async (req, res) => {
    try {
      await seedCountryMappings(req.user.id);
      const rows = await db.all(
        "SELECT iso_code, alpha3, numeric, aas_names, gdacs_names FROM resilience_country_mappings WHERE user_id = ? ORDER BY iso_code ASC",
        [req.user.id]
      );
      res.setHeader("Content-Disposition", 'attachment; filename="country-mappings.json"');
      res.json(rows);
    } catch (err) {
      console.error("GET /api/country-mappings/export error:", err);
      res.status(500).json({ error: "EXPORT_FAILED" });
    }
  });

  router.get("/api/country-mappings/aas-countries", auth.requireAuth, async (req, res) => {
    try {
      await seedCountryMappings(req.user.id);
      const rows = await db.all(
        "SELECT gdacs_names FROM resilience_country_mappings WHERE user_id = ? AND TRIM(aas_names) != ''",
        [req.user.id]
      );
      const names = rows.map(r => r.gdacs_names).filter(Boolean);
      res.json({ names });
    } catch (err) {
      console.error("GET /api/country-mappings/aas-countries error:", err);
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.post("/api/country-mappings/import", auth.requireAuth, async (req, res) => {
    try {
      const items = req.body;
      if (!Array.isArray(items)) return res.status(400).json({ error: "INVALID_FORMAT" });
      await seedCountryMappings(req.user.id);
      let updated = 0;
      for (const item of items) {
        const code = (item.iso_code || "").trim().toUpperCase();
        if (!code) continue;
        const row = await db.get(
          "SELECT 1 FROM resilience_country_mappings WHERE user_id = ? AND iso_code = ?",
          [req.user.id, code]
        );
        if (!row) continue;
        await db.run(
          "UPDATE resilience_country_mappings SET aas_names = ?, gdacs_names = ? WHERE user_id = ? AND iso_code = ?",
          [String(item.aas_names ?? ""), String(item.gdacs_names ?? ""), req.user.id, code]
        );
        updated++;
      }
      res.json({ ok: true, updated });
    } catch (err) {
      console.error("POST /api/country-mappings/import error:", err);
      res.status(500).json({ error: "IMPORT_FAILED" });
    }
  });

  // ── AAS Country-Mapping Resolve ────────────────────────────────

  // walkElements is defined at module level (shared with refreshGdacsAasMapping)

  router.post("/api/country-mappings/aas-extract", auth.requireAuth, async (req, res) => {
    try {
      const { group_id, id_short_path } = req.body || {};
      if (!group_id || !id_short_path) return res.status(400).json({ error: "MISSING_PARAMS" });
      const members = await db.all(
        "SELECT aas_id FROM resilience_asset_group_members WHERE group_id = ?",
        [group_id]
      );
      const segments = id_short_path.split(".");
      const values = new Set();
      for (const m of members) {
        const imp = await db.get(
          "SELECT submodels_data FROM resilience_aas_imports WHERE aas_id = ? AND user_id = ?",
          [m.aas_id, req.user.id]
        );
        if (!imp || !imp.submodels_data) continue;
        try {
          const submodels = JSON.parse(imp.submodels_data);
          for (const sm of submodels) {
            if (sm.idShort !== segments[0] && segments.length > 1) continue;
            const els = sm.submodelElements || [];
            if (segments.length === 1 && sm.idShort === segments[0]) {
              // Edge: property is a direct submodel element
              continue;
            }
            walkElements(els, segments, sm.idShort === segments[0] ? 1 : 0, values);
          }
        } catch { /* skip bad JSON */ }
      }
      res.json({ values: [...values].filter(Boolean) });
    } catch (err) {
      console.error("POST /api/country-mappings/aas-extract error:", err);
      res.status(500).json({ error: "EXTRACT_FAILED" });
    }
  });

  router.post("/api/country-mappings/aas-match", auth.requireAuth, async (req, res) => {
    try {
      const { values } = req.body || {};
      if (!Array.isArray(values)) return res.status(400).json({ error: "INVALID_FORMAT" });
      const rows = await db.all(
        "SELECT iso_code, alpha3, numeric, aas_names, gdacs_names FROM resilience_country_mappings WHERE user_id = ?",
        [req.user.id]
      );
      const matched = [];
      const unmatched = [];
      for (const v of values) {
        const vl = v.trim().toLowerCase();
        let found = null;
        for (const r of rows) {
          if (r.iso_code.toLowerCase() === vl) { found = r.iso_code; break; }
          if (r.alpha3 && r.alpha3.toLowerCase() === vl) { found = r.iso_code; break; }
          if (r.numeric === vl) { found = r.iso_code; break; }
          const gdTokens = (r.gdacs_names || "").split(",").map(s => s.trim().toLowerCase());
          if (gdTokens.includes(vl)) { found = r.iso_code; break; }
          const aasTokens = (r.aas_names || "").split(",").map(s => s.trim().toLowerCase());
          if (aasTokens.includes(vl)) { found = r.iso_code; break; }
        }
        if (found) matched.push({ value: v, iso_code: found });
        else unmatched.push(v);
      }
      res.json({ matched, unmatched });
    } catch (err) {
      console.error("POST /api/country-mappings/aas-match error:", err);
      res.status(500).json({ error: "MATCH_FAILED" });
    }
  });

  router.post("/api/country-mappings/aas-ai-match", auth.requireAuth, async (req, res) => {
    try {
      const { values } = req.body || {};
      if (!Array.isArray(values) || values.length === 0) return res.status(400).json({ error: "INVALID_FORMAT" });
      const settings = await db.get(
        "SELECT provider, model, api_key FROM aas_chat_settings WHERE user_id = ?",
        [req.user.id]
      );
      if (!settings || !settings.api_key) {
        return res.json({ ai_unavailable: true, matched: [], unmatched: values });
      }
      const prompt = `Map the following values to ISO 3166-1 alpha-2 country codes.\nReturn ONLY a JSON array: [{"value":"...","iso_code":"XX"}]\nIf a value cannot be mapped, use "iso_code": null.\nValues: ${JSON.stringify(values)}`;

      let replyText = "";
      if (settings.provider === "gemini") {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.api_key}`;
        const r = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0, maxOutputTokens: 4096 }
          }),
          signal: AbortSignal.timeout(30000)
        });
        const data = await r.json();
        replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } else {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${settings.api_key}` },
          body: JSON.stringify({
            model: settings.model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0
          }),
          signal: AbortSignal.timeout(30000)
        });
        const data = await r.json();
        replyText = data?.choices?.[0]?.message?.content || "";
      }

      // Extract JSON array from response
      const jsonMatch = replyText.match(/\[[\s\S]*?\]/);
      let suggestions = [];
      if (jsonMatch) {
        try { suggestions = JSON.parse(jsonMatch[0]); } catch { /* ignore */ }
      }

      // Validate iso_codes against DB
      const validCodes = new Set(
        (await db.all("SELECT iso_code FROM resilience_country_mappings WHERE user_id = ?", [req.user.id]))
          .map(r => r.iso_code)
      );
      const matched = [];
      const unmatched = [];
      for (const s of suggestions) {
        if (s.iso_code && validCodes.has(s.iso_code.toUpperCase())) {
          matched.push({ value: s.value, iso_code: s.iso_code.toUpperCase() });
        } else {
          unmatched.push(s.value);
        }
      }
      // Any original values not in suggestions at all → unmatched
      const handled = new Set(suggestions.map(s => s.value));
      for (const v of values) {
        if (!handled.has(v)) unmatched.push(v);
      }
      res.json({ ai_unavailable: false, matched, unmatched });
    } catch (err) {
      console.error("POST /api/country-mappings/aas-ai-match error:", err);
      res.status(500).json({ error: "AI_MATCH_FAILED" });
    }
  });

  router.post("/api/country-mappings/aas-apply", auth.requireAuth, async (req, res) => {
    try {
      const { mappings } = req.body || {};
      if (!Array.isArray(mappings)) return res.status(400).json({ error: "INVALID_FORMAT" });
      let updated = 0;
      for (const m of mappings) {
        if (!m.value || !m.iso_code) continue;
        const row = await db.get(
          "SELECT aas_names FROM resilience_country_mappings WHERE user_id = ? AND iso_code = ?",
          [req.user.id, m.iso_code]
        );
        if (!row) continue;
        const existing = (row.aas_names || "").split(",").map(s => s.trim()).filter(Boolean);
        if (existing.some(e => e.toLowerCase() === m.value.trim().toLowerCase())) continue;
        existing.push(m.value.trim());
        await db.run(
          "UPDATE resilience_country_mappings SET aas_names = ? WHERE user_id = ? AND iso_code = ?",
          [existing.join(", "), req.user.id, m.iso_code]
        );
        updated++;
      }
      res.json({ ok: true, updated });
    } catch (err) {
      console.error("POST /api/country-mappings/aas-apply error:", err);
      res.status(500).json({ error: "APPLY_FAILED" });
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
      const q = (req.query.q || "").trim();

      let where = "i.user_id = ?";
      const params = [req.user.id];
      if (q) {
        where += " AND (i.title LIKE ? OR i.guid LIKE ?)";
        const like = `%${q}%`;
        params.push(like, like);
      }

      const items = await db.all(
        `SELECT i.item_id, i.guid, i.title, i.link, i.pub_date, i.created_at, f.title AS feed_title
         FROM resilience_feed_items i
         JOIN resilience_feeds f ON f.feed_id = i.feed_id
         WHERE ${where}
         ORDER BY i.created_at DESC, i.item_id DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      const countRow = await db.get(
        `SELECT COUNT(*) AS total FROM resilience_feed_items i WHERE ${where}`,
        params
      );

      res.json({ items, total: countRow.total });
    } catch (err) {
      console.error("GET /api/news error:", err);
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

      const settings = await db.get(
        "SELECT gdacs_retention_days FROM resilience_settings WHERE user_id = ?",
        [req.user.id]
      );
      const retDays = settings?.gdacs_retention_days ?? 30;

      let where = "a.user_id = ? AND a.fetched_at >= datetime('now', '-' || ? || ' days')";
      const params = [req.user.id, retDays];
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

  // ── GDACS AAS Overview (dashboard tile) ──────────────────────
  router.get("/api/gdacs/aas-overview", auth.requireAuth, async (req, res) => {
    try {
      let mapRows = await db.all(
        "SELECT aas_id, country_value, iso_code, columns_data, updated_at FROM resilience_gdacs_aas_map WHERE user_id = ? ORDER BY aas_id ASC",
        [req.user.id]
      );

      // If empty but mapping is configured, compute on first access
      if (!mapRows.length) {
        try { await refreshGdacsAasMapping(req.user.id); } catch { /* ignore */ }
        mapRows = await db.all(
          "SELECT aas_id, country_value, iso_code, columns_data, updated_at FROM resilience_gdacs_aas_map WHERE user_id = ? ORDER BY aas_id ASC",
          [req.user.id]
        );
      }
      if (!mapRows.length) return res.json({ items: [], updated_at: null });

      // Get country mappings for gdacs_names lookup
      const cmRows = await db.all(
        "SELECT iso_code, gdacs_names FROM resilience_country_mappings WHERE user_id = ?",
        [req.user.id]
      );
      const isoToGdacs = {};
      for (const r of cmRows) isoToGdacs[r.iso_code] = r.gdacs_names || "";

      // Get all GDACS countries for this user
      const gdacsCountries = await db.all(
        "SELECT country_id, name FROM resilience_gdacs_countries WHERE user_id = ?",
        [req.user.id]
      );

      // Build iso → country_ids mapping
      const isoToCountryIds = {};
      for (const row of mapRows) {
        if (!row.iso_code) continue;
        const gdacsNames = isoToGdacs[row.iso_code] || "";
        const tokens = gdacsNames.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
        const ids = [];
        for (const gc of gdacsCountries) {
          if (tokens.includes(gc.name.toLowerCase())) ids.push(gc.country_id);
        }
        isoToCountryIds[row.iso_code] = ids;
      }

      // Fetch alerts for all relevant country_ids
      const allCountryIds = [...new Set(Object.values(isoToCountryIds).flat())];
      let alertsByCountryId = {};
      if (allCountryIds.length) {
        const ph = allCountryIds.map(() => "?").join(",");
        const alerts = await db.all(
          `SELECT alert_id, country_id, eventtype, alertlevel, name, fromdate, url
           FROM resilience_gdacs_alerts WHERE user_id = ? AND country_id IN (${ph})
           ORDER BY fromdate DESC`,
          [req.user.id, ...allCountryIds]
        );
        for (const a of alerts) {
          if (!alertsByCountryId[a.country_id]) alertsByCountryId[a.country_id] = [];
          alertsByCountryId[a.country_id].push(a);
        }
      }

      // Get column definitions from settings
      const colSettings = await db.get(
        "SELECT gdacs_aas_columns FROM resilience_settings WHERE user_id = ?",
        [req.user.id]
      );
      const columns = JSON.parse(colSettings?.gdacs_aas_columns || "[]");

      // Build response items — only include rows that have alerts
      const allItems = [];
      for (const row of mapRows) {
        const countryIds = isoToCountryIds[row.iso_code] || [];
        const alerts = countryIds.flatMap(cid => alertsByCountryId[cid] || []);
        if (!alerts.length) continue;
        allItems.push({
          aas_id: row.aas_id,
          country_value: row.country_value,
          iso_code: row.iso_code,
          columns_data: JSON.parse(row.columns_data || "{}"),
          alerts,
        });
      }

      // Sorting by column path
      const sortBy = req.query.sort || "";
      const sortDir = req.query.sort_dir === "desc" ? -1 : 1;
      if (sortBy && columns.includes(sortBy)) {
        allItems.sort((a, b) => {
          const va = (a.columns_data[sortBy] || "").toLowerCase();
          const vb = (b.columns_data[sortBy] || "").toLowerCase();
          return va < vb ? -sortDir : va > vb ? sortDir : 0;
        });
      }

      // Pagination
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const offset = parseInt(req.query.offset) || 0;
      const items = allItems.slice(offset, offset + limit);

      const updatedAt = mapRows[0]?.updated_at || null;
      res.json({ items, total: allItems.length, columns, updated_at: updatedAt });
    } catch (err) {
      console.error("GET /api/gdacs/aas-overview error:", err);
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // ── Indicator classes ─────────────────────────────────────────
  router.get("/api/indicator-classes", auth.requireAuth, async (req, res) => {
    try {
      const classes = await db.all(
        "SELECT class_id, name, created_at FROM resilience_indicator_classes WHERE user_id = ? ORDER BY created_at ASC",
        [req.user.id]
      );
      res.json({ classes });
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.post("/api/indicator-classes", auth.requireAuth, async (req, res) => {
    try {
      const name = ((req.body || {}).name || "").trim();
      if (!name || name.length > 100) {
        return res.status(400).json({ error: "INVALID_NAME" });
      }
      const existing = await db.get(
        "SELECT class_id FROM resilience_indicator_classes WHERE user_id = ? AND LOWER(name) = LOWER(?)",
        [req.user.id, name]
      );
      if (existing) return res.status(409).json({ error: "CLASS_EXISTS" });

      const classId = crypto.randomUUID();
      await db.run(
        "INSERT INTO resilience_indicator_classes (class_id, user_id, name) VALUES (?, ?, ?)",
        [classId, req.user.id, name]
      );
      res.json({ class_id: classId, name });
    } catch {
      res.status(500).json({ error: "ADD_FAILED" });
    }
  });

  router.delete("/api/indicator-classes/:classId", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get(
        "SELECT class_id FROM resilience_indicator_classes WHERE class_id = ? AND user_id = ?",
        [req.params.classId, req.user.id]
      );
      if (!row) return res.status(404).json({ error: "NOT_FOUND" });
      await db.run("DELETE FROM resilience_indicator_classes WHERE class_id = ?", [req.params.classId]);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // ── Indicators CRUD ─────────────────────────────────────────────
  const VALID_OPERATORS = new Set([">", "<", ">=", "<=", "==", "!="]);
  const VALID_INPUT_TYPES = new Set(["number", "text", "boolean"]);

  router.get("/api/indicators", auth.requireAuth, async (req, res) => {
    try {
      const indicators = await db.all(
        `SELECT i.indicator_id, i.name, i.class_id, i.input_type, i.input_label, i.created_at,
                c.name AS class_name,
                (SELECT COUNT(*) FROM resilience_indicator_groups g WHERE g.indicator_id = i.indicator_id) AS group_count
         FROM resilience_indicators i
         LEFT JOIN resilience_indicator_classes c ON c.class_id = i.class_id
         WHERE i.user_id = ?
         ORDER BY i.created_at ASC`,
        [req.user.id]
      );
      res.json({ indicators });
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.get("/api/indicators/:indicatorId", auth.requireAuth, async (req, res) => {
    try {
      const ind = await db.get(
        `SELECT i.*, c.name AS class_name
         FROM resilience_indicators i
         LEFT JOIN resilience_indicator_classes c ON c.class_id = i.class_id
         WHERE i.indicator_id = ? AND i.user_id = ?`,
        [req.params.indicatorId, req.user.id]
      );
      if (!ind) return res.status(404).json({ error: "NOT_FOUND" });

      const groups = await db.all(
        "SELECT * FROM resilience_indicator_groups WHERE indicator_id = ? ORDER BY sort_order ASC",
        [ind.indicator_id]
      );
      for (const g of groups) {
        g.conditions = await db.all(
          "SELECT * FROM resilience_indicator_conditions WHERE group_id = ? ORDER BY sort_order ASC",
          [g.group_id]
        );
      }
      res.json({ ...ind, groups });
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.post("/api/indicators", auth.requireAuth, async (req, res) => {
    try {
      const b = req.body || {};
      const name = (b.name || "").trim();
      if (!name) return res.status(400).json({ error: "INVALID_NAME" });
      const inputType = VALID_INPUT_TYPES.has(b.input_type) ? b.input_type : "number";

      const indicatorId = crypto.randomUUID();
      await db.run(
        `INSERT INTO resilience_indicators (indicator_id, user_id, name, class_id, input_type, input_label, default_label, default_color, default_score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [indicatorId, req.user.id, name, b.class_id || null, inputType,
         (b.input_label || "").trim(), (b.default_label || "").trim(),
         b.default_color || "#9ca3af", parseFloat(b.default_score) || 0]
      );

      // Insert groups + conditions
      const groups = Array.isArray(b.groups) ? b.groups : [];
      for (let gi = 0; gi < groups.length; gi++) {
        const g = groups[gi];
        const groupId = crypto.randomUUID();
        await db.run(
          `INSERT INTO resilience_indicator_groups (group_id, indicator_id, user_id, sort_order, output_label, output_color, output_score)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [groupId, indicatorId, req.user.id, gi, (g.output_label || "").trim(),
           g.output_color || "#9ca3af", parseFloat(g.output_score) || 0]
        );
        const conds = Array.isArray(g.conditions) ? g.conditions : [];
        for (let ci = 0; ci < conds.length; ci++) {
          const c = conds[ci];
          const op = VALID_OPERATORS.has(c.operator) ? c.operator : ">=";
          await db.run(
            `INSERT INTO resilience_indicator_conditions (condition_id, group_id, indicator_id, user_id, sort_order, operator, value)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), groupId, indicatorId, req.user.id, ci, op, String(c.value ?? "")]
          );
        }
      }

      res.json({ indicator_id: indicatorId });
    } catch {
      res.status(500).json({ error: "CREATE_FAILED" });
    }
  });

  router.put("/api/indicators/:indicatorId", auth.requireAuth, async (req, res) => {
    try {
      const ind = await db.get(
        "SELECT indicator_id FROM resilience_indicators WHERE indicator_id = ? AND user_id = ?",
        [req.params.indicatorId, req.user.id]
      );
      if (!ind) return res.status(404).json({ error: "NOT_FOUND" });

      const b = req.body || {};
      const name = (b.name || "").trim();
      if (!name) return res.status(400).json({ error: "INVALID_NAME" });
      const inputType = VALID_INPUT_TYPES.has(b.input_type) ? b.input_type : "number";

      await db.run(
        `UPDATE resilience_indicators SET name = ?, class_id = ?, input_type = ?, input_label = ?,
         default_label = ?, default_color = ?, default_score = ? WHERE indicator_id = ?`,
        [name, b.class_id || null, inputType, (b.input_label || "").trim(),
         (b.default_label || "").trim(), b.default_color || "#9ca3af",
         parseFloat(b.default_score) || 0, ind.indicator_id]
      );

      // Replace all groups + conditions
      await db.run("DELETE FROM resilience_indicator_conditions WHERE indicator_id = ?", [ind.indicator_id]);
      await db.run("DELETE FROM resilience_indicator_groups WHERE indicator_id = ?", [ind.indicator_id]);

      const groups = Array.isArray(b.groups) ? b.groups : [];
      for (let gi = 0; gi < groups.length; gi++) {
        const g = groups[gi];
        const groupId = crypto.randomUUID();
        await db.run(
          `INSERT INTO resilience_indicator_groups (group_id, indicator_id, user_id, sort_order, output_label, output_color, output_score)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [groupId, ind.indicator_id, req.user.id, gi, (g.output_label || "").trim(),
           g.output_color || "#9ca3af", parseFloat(g.output_score) || 0]
        );
        const conds = Array.isArray(g.conditions) ? g.conditions : [];
        for (let ci = 0; ci < conds.length; ci++) {
          const c = conds[ci];
          const op = VALID_OPERATORS.has(c.operator) ? c.operator : ">=";
          await db.run(
            `INSERT INTO resilience_indicator_conditions (condition_id, group_id, indicator_id, user_id, sort_order, operator, value)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), groupId, ind.indicator_id, req.user.id, ci, op, String(c.value ?? "")]
          );
        }
      }

      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "UPDATE_FAILED" });
    }
  });

  router.delete("/api/indicators/:indicatorId", auth.requireAuth, async (req, res) => {
    try {
      const ind = await db.get(
        "SELECT indicator_id FROM resilience_indicators WHERE indicator_id = ? AND user_id = ?",
        [req.params.indicatorId, req.user.id]
      );
      if (!ind) return res.status(404).json({ error: "NOT_FOUND" });
      // Cascade deletes handle groups + conditions via FK
      await db.run("DELETE FROM resilience_indicator_conditions WHERE indicator_id = ?", [ind.indicator_id]);
      await db.run("DELETE FROM resilience_indicator_groups WHERE indicator_id = ?", [ind.indicator_id]);
      await db.run("DELETE FROM resilience_indicators WHERE indicator_id = ?", [ind.indicator_id]);
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

  // ── AAS Sources ──────────────────────────────────────────────

  // GET all sources (with ID count)
  router.get("/api/aas-sources", auth.requireAuth, async (req, res) => {
    try {
      const sources = await db.all(
        `SELECT s.source_id, s.name, s.base_url, s.created_at,
                (SELECT COUNT(*) FROM resilience_aas_source_ids i WHERE i.source_id = s.source_id) AS id_count
         FROM resilience_aas_sources s
         WHERE s.user_id = ?
         ORDER BY s.created_at ASC`,
        [req.user.id]
      );
      res.json({ sources });
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // POST create source
  router.post("/api/aas-sources", auth.requireAuth, async (req, res) => {
    try {
      const { name, base_url, item_prefix } = req.body;
      if (!name || !base_url) return res.status(400).json({ error: "MISSING_FIELDS" });
      const sourceId = crypto.randomUUID();
      await db.run(
        "INSERT INTO resilience_aas_sources (source_id, user_id, name, base_url, item_prefix) VALUES (?, ?, ?, ?, ?)",
        [sourceId, req.user.id, name.trim(), base_url.trim(), (item_prefix || "").trim()]
      );
      res.json({ source_id: sourceId });
    } catch {
      res.status(500).json({ error: "CREATE_FAILED" });
    }
  });

  // GET single source with IDs
  router.get("/api/aas-sources/:sourceId", auth.requireAuth, async (req, res) => {
    try {
      const source = await db.get(
        "SELECT source_id, name, base_url, item_prefix, created_at FROM resilience_aas_sources WHERE source_id = ? AND user_id = ?",
        [req.params.sourceId, req.user.id]
      );
      if (!source) return res.status(404).json({ error: "NOT_FOUND" });
      const ids = await db.all(
        "SELECT entry_id, aas_id, entry_type, item_id, created_at FROM resilience_aas_source_ids WHERE source_id = ? ORDER BY created_at ASC",
        [req.params.sourceId]
      );
      res.json({ ...source, ids });
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // PUT update source metadata
  router.put("/api/aas-sources/:sourceId", auth.requireAuth, async (req, res) => {
    try {
      const { name, base_url, item_prefix } = req.body;
      if (!name || !base_url) return res.status(400).json({ error: "MISSING_FIELDS" });
      const existing = await db.get(
        "SELECT source_id FROM resilience_aas_sources WHERE source_id = ? AND user_id = ?",
        [req.params.sourceId, req.user.id]
      );
      if (!existing) return res.status(404).json({ error: "NOT_FOUND" });
      await db.run(
        "UPDATE resilience_aas_sources SET name = ?, base_url = ?, item_prefix = ? WHERE source_id = ?",
        [name.trim(), base_url.trim(), (item_prefix || "").trim(), req.params.sourceId]
      );
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "UPDATE_FAILED" });
    }
  });

  // DELETE source (cascade IDs)
  router.delete("/api/aas-sources/:sourceId", auth.requireAuth, async (req, res) => {
    try {
      await db.run(
        "DELETE FROM resilience_aas_sources WHERE source_id = ? AND user_id = ?",
        [req.params.sourceId, req.user.id]
      );
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // POST add AAS ID to source
  router.post("/api/aas-sources/:sourceId/ids", auth.requireAuth, async (req, res) => {
    try {
      const { aas_id, entry_type, item_id } = req.body;
      const source = await db.get(
        "SELECT source_id, item_prefix FROM resilience_aas_sources WHERE source_id = ? AND user_id = ?",
        [req.params.sourceId, req.user.id]
      );
      if (!source) return res.status(404).json({ error: "NOT_FOUND" });

      let finalAasId, finalItemId = "", finalType = "aas";
      if (entry_type === "item") {
        if (!item_id) return res.status(400).json({ error: "MISSING_FIELDS" });
        finalType = "item";
        finalItemId = item_id.trim();
        finalAasId = (source.item_prefix || "") + finalItemId;
      } else {
        if (!aas_id) return res.status(400).json({ error: "MISSING_FIELDS" });
        finalAasId = aas_id.trim();
      }

      const entryId = crypto.randomUUID();
      await db.run(
        "INSERT INTO resilience_aas_source_ids (entry_id, source_id, user_id, aas_id, entry_type, item_id) VALUES (?, ?, ?, ?, ?, ?)",
        [entryId, req.params.sourceId, req.user.id, finalAasId, finalType, finalItemId]
      );
      res.json({ entry_id: entryId, aas_id: finalAasId });
    } catch (err) {
      if (err && err.message && err.message.includes("UNIQUE")) {
        return res.status(409).json({ error: "DUPLICATE" });
      }
      res.status(500).json({ error: "CREATE_FAILED" });
    }
  });

  // DELETE AAS ID from source
  router.delete("/api/aas-sources/:sourceId/ids/:entryId", auth.requireAuth, async (req, res) => {
    try {
      await db.run(
        "DELETE FROM resilience_aas_source_ids WHERE entry_id = ? AND source_id = ? AND user_id = ?",
        [req.params.entryId, req.params.sourceId, req.user.id]
      );
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // DELETE all IDs from source
  router.delete("/api/aas-sources/:sourceId/ids", auth.requireAuth, async (req, res) => {
    try {
      const source = await db.get(
        "SELECT source_id FROM resilience_aas_sources WHERE source_id = ? AND user_id = ?",
        [req.params.sourceId, req.user.id]
      );
      if (!source) return res.status(404).json({ error: "NOT_FOUND" });
      const { changes } = await db.run(
        "DELETE FROM resilience_aas_source_ids WHERE source_id = ? AND user_id = ?",
        [req.params.sourceId, req.user.id]
      );
      res.json({ ok: true, deleted: changes || 0 });
    } catch {
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // POST import item IDs from external endpoint
  router.post("/api/aas-sources/:sourceId/ids/import", auth.requireAuth, async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: "MISSING_URL" });

      const source = await db.get(
        "SELECT source_id, item_prefix FROM resilience_aas_sources WHERE source_id = ? AND user_id = ?",
        [req.params.sourceId, req.user.id]
      );
      if (!source) return res.status(404).json({ error: "NOT_FOUND" });

      // Fetch external endpoint
      const resp = await fetch(url.trim(), {
        signal: AbortSignal.timeout(15000),
        headers: { Accept: "application/json" },
      });
      if (!resp.ok) return res.status(502).json({ error: `IMPORT_HTTP_${resp.status}` });
      const data = await resp.json();

      if (!Array.isArray(data)) return res.status(400).json({ error: "INVALID_FORMAT" });

      let added = 0;
      let duplicates = 0;
      const prefix = source.item_prefix || "";

      for (const raw of data) {
        const itemId = String(raw).trim();
        if (!itemId) continue;
        const aasId = prefix + itemId;
        try {
          await db.run(
            "INSERT INTO resilience_aas_source_ids (entry_id, source_id, user_id, aas_id, entry_type, item_id) VALUES (?, ?, ?, ?, 'item', ?)",
            [crypto.randomUUID(), req.params.sourceId, req.user.id, aasId, itemId]
          );
          added++;
        } catch (err) {
          if (err && err.message && err.message.includes("UNIQUE")) {
            duplicates++;
          }
        }
      }

      res.json({ ok: true, added, duplicates, total: data.length });
    } catch (err) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        return res.status(504).json({ error: "IMPORT_TIMEOUT" });
      }
      res.status(500).json({ error: "IMPORT_FAILED" });
    }
  });

  // ── AAS Overview (all AAS IDs across all sources) ─────────────
  router.get("/api/aas-overview", auth.requireAuth, async (req, res) => {
    try {
      const rows = await db.all(
        `SELECT i.entry_id, i.aas_id, i.entry_type, i.item_id,
                s.source_id, s.name AS source_name, s.base_url,
                g.group_id, g.name AS group_name,
                imp.imported_at
         FROM resilience_aas_source_ids i
         JOIN resilience_aas_sources s ON s.source_id = i.source_id
         LEFT JOIN resilience_asset_group_members m ON m.aas_id = i.aas_id
         LEFT JOIN resilience_asset_groups g ON g.group_id = m.group_id AND g.user_id = ?
         LEFT JOIN resilience_aas_imports imp ON imp.aas_id = i.aas_id AND imp.user_id = ?
         WHERE s.user_id = ?
         ORDER BY s.name ASC, i.aas_id ASC`,
        [req.user.id, req.user.id, req.user.id]
      );
      res.json({ entries: rows });
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // ── AAS Import: start server-side bulk import ──────────────────
  router.post("/api/aas-import", auth.requireAuth, async (req, res) => {
    const userId = req.user.id;
    if (importJobs[userId]?.running) return res.json({ ok: true, already: true });
    res.json({ ok: true });
    runImportJob(userId);
  });

  // ── AAS Import: poll status ──────────────────────────────────
  router.get("/api/aas-import-status", auth.requireAuth, (req, res) => {
    const job = importJobs[req.user.id];
    if (!job) return res.json({ running: false });
    res.json({ running: job.running, total: job.total, done: job.done, errors: job.errors });
  });

  // ── AAS Import: get persisted data from DB ────────────────────
  router.get("/api/aas-import/:aasId", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get(
        "SELECT shell_data, submodels_data, imported_at FROM resilience_aas_imports WHERE aas_id = ? AND user_id = ?",
        [req.params.aasId, req.user.id]
      );
      if (!row) return res.status(404).json({ error: "NOT_IMPORTED" });
      res.json({
        shell: JSON.parse(row.shell_data),
        submodels: JSON.parse(row.submodels_data),
        imported_at: row.imported_at,
      });
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // ── AAS Proxy: get shell (query params to avoid %2F routing issues) ──
  router.get("/api/aas-proxy/shell", auth.requireAuth, async (req, res) => {
    try {
      const { source_id, aas_id } = req.query;
      if (!source_id || !aas_id) return res.status(400).json({ error: "MISSING_PARAMS" });

      const source = await db.get(
        "SELECT source_id, base_url FROM resilience_aas_sources WHERE source_id = ? AND user_id = ?",
        [source_id, req.user.id]
      );
      if (!source) return res.status(404).json({ error: "SOURCE_NOT_FOUND" });

      const encoded = toBase64Url(aas_id);
      const url = `${source.base_url.replace(/\/+$/, "")}/shells/${encoded}`;
      const resp = await fetch(url, {
        signal: AbortSignal.timeout(15000),
        headers: { Accept: "application/json" },
      });
      if (!resp.ok) return res.status(resp.status).json({ error: `AAS_HTTP_${resp.status}` });
      const data = await resp.json();
      res.json(data);
    } catch (err) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        return res.status(504).json({ error: "AAS_TIMEOUT" });
      }
      res.status(502).json({ error: "AAS_PROXY_FAILED" });
    }
  });

  // ── AAS Proxy: get submodel (query params) ────────────────────
  router.get("/api/aas-proxy/submodel", auth.requireAuth, async (req, res) => {
    try {
      const { source_id, aas_id, submodel_id } = req.query;
      if (!source_id || !aas_id || !submodel_id) return res.status(400).json({ error: "MISSING_PARAMS" });

      const source = await db.get(
        "SELECT source_id, base_url FROM resilience_aas_sources WHERE source_id = ? AND user_id = ?",
        [source_id, req.user.id]
      );
      if (!source) return res.status(404).json({ error: "SOURCE_NOT_FOUND" });

      const encodedAas = toBase64Url(aas_id);
      const encodedSm = toBase64Url(submodel_id);
      const url = `${source.base_url.replace(/\/+$/, "")}/shells/${encodedAas}/submodels/${encodedSm}`;
      const resp = await fetch(url, {
        signal: AbortSignal.timeout(15000),
        headers: { Accept: "application/json" },
      });
      if (!resp.ok) return res.status(resp.status).json({ error: `AAS_HTTP_${resp.status}` });
      const data = await resp.json();
      res.json(data);
    } catch (err) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        return res.status(504).json({ error: "AAS_TIMEOUT" });
      }
      res.status(502).json({ error: "AAS_PROXY_FAILED" });
    }
  });

  // ── Asset Groups ─────────────────────────────────────────────────

  // List groups with member count
  router.get("/api/asset-groups", auth.requireAuth, async (req, res) => {
    try {
      const rows = await db.all(
        `SELECT g.group_id, g.name, g.created_at,
                (SELECT COUNT(*) FROM resilience_asset_group_members m WHERE m.group_id = g.group_id) AS member_count
         FROM resilience_asset_groups g
         WHERE g.user_id = ?
         ORDER BY g.name ASC`,
        [req.user.id]
      );
      res.json({ groups: rows });
    } catch (err) {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // Create group
  router.post("/api/asset-groups", auth.requireAuth, async (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: "MISSING_NAME" });
    try {
      const groupId = crypto.randomUUID();
      await db.run(
        "INSERT INTO resilience_asset_groups (group_id, user_id, name) VALUES (?, ?, ?)",
        [groupId, req.user.id, name.trim()]
      );
      res.json({ group_id: groupId });
    } catch (err) {
      res.status(500).json({ error: "CREATE_FAILED" });
    }
  });

  // Get group with members
  router.get("/api/asset-groups/:groupId", auth.requireAuth, async (req, res) => {
    try {
      const group = await db.get(
        "SELECT group_id, name, created_at FROM resilience_asset_groups WHERE group_id = ? AND user_id = ?",
        [req.params.groupId, req.user.id]
      );
      if (!group) return res.status(404).json({ error: "NOT_FOUND" });
      const members = await db.all(
        "SELECT aas_id, source_id FROM resilience_asset_group_members WHERE group_id = ? ORDER BY aas_id ASC",
        [req.params.groupId]
      );
      res.json({ ...group, members });
    } catch (err) {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // Update group (name + members bulk replace)
  router.put("/api/asset-groups/:groupId", auth.requireAuth, async (req, res) => {
    const { name, members } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: "MISSING_NAME" });
    try {
      const group = await db.get(
        "SELECT group_id FROM resilience_asset_groups WHERE group_id = ? AND user_id = ?",
        [req.params.groupId, req.user.id]
      );
      if (!group) return res.status(404).json({ error: "NOT_FOUND" });
      await db.run("UPDATE resilience_asset_groups SET name = ? WHERE group_id = ?", [name.trim(), req.params.groupId]);
      await db.run("DELETE FROM resilience_asset_group_members WHERE group_id = ?", [req.params.groupId]);
      if (Array.isArray(members)) {
        for (const m of members) {
          if (!m.aas_id) continue;
          try {
            await db.run(
              "INSERT INTO resilience_asset_group_members (group_id, aas_id, source_id) VALUES (?, ?, ?)",
              [req.params.groupId, m.aas_id, m.source_id || null]
            );
          } catch { /* skip duplicates */ }
        }
      }
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "UPDATE_FAILED" });
    }
  });

  // Delete group
  router.delete("/api/asset-groups/:groupId", auth.requireAuth, async (req, res) => {
    try {
      await db.run(
        "DELETE FROM resilience_asset_groups WHERE group_id = ? AND user_id = ?",
        [req.params.groupId, req.user.id]
      );
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "DELETE_FAILED" });
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

  // Also refresh AAS country mapping cache
  try { await refreshGdacsAasMapping(userId); } catch { /* ignore */ }
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

  const refreshedUsers = new Set();
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
      refreshedUsers.add(u.user_id);
    } catch { /* ignore */ }
  }

  // Also refresh AAS mapping for users who have it configured but no GDACS countries
  try {
    const mapUsers = await db.all(
      `SELECT user_id FROM resilience_settings WHERE gdacs_aas_group_id != '' AND gdacs_aas_path != ''`
    );
    for (const mu of mapUsers) {
      if (refreshedUsers.has(mu.user_id)) continue;
      try { await refreshGdacsAasMapping(mu.user_id); } catch { /* ignore */ }
    }
  } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------
// Background: cleanup GDACS alerts older than 7 days
// ---------------------------------------------------------------------------
async function cleanupGdacsAlerts() {
  const users = await db.all(
    `SELECT DISTINCT a.user_id, COALESCE(s.gdacs_retention_days, 30) AS gdacs_retention_days
     FROM resilience_gdacs_alerts a
     LEFT JOIN resilience_settings s ON s.user_id = a.user_id`
  );
  for (const u of users) {
    await db.run(
      `DELETE FROM resilience_gdacs_alerts WHERE user_id = ? AND fetched_at < datetime('now', '-' || ? || ' days')`,
      [u.user_id, u.gdacs_retention_days]
    );
  }
}

// ---------------------------------------------------------------------------
// Background: refresh GDACS AAS country mapping cache
// ---------------------------------------------------------------------------
function matchCountryValue(value, mappingRows) {
  const vl = value.trim().toLowerCase();
  for (const r of mappingRows) {
    if (r.iso_code.toLowerCase() === vl) return r.iso_code;
    if (r.alpha3 && r.alpha3.toLowerCase() === vl) return r.iso_code;
    if (r.numeric === vl) return r.iso_code;
    const gdTokens = (r.gdacs_names || "").split(",").map(s => s.trim().toLowerCase());
    if (gdTokens.includes(vl)) return r.iso_code;
    const aasTokens = (r.aas_names || "").split(",").map(s => s.trim().toLowerCase());
    if (aasTokens.includes(vl)) return r.iso_code;
  }
  return "";
}

function extractFirstValue(submodels, pathStr) {
  const segments = pathStr.split(".");
  const values = new Set();
  for (const sm of submodels) {
    if (sm.idShort !== segments[0] && segments.length > 1) continue;
    const els = sm.submodelElements || [];
    if (segments.length === 1 && sm.idShort === segments[0]) continue;
    walkElements(els, segments, sm.idShort === segments[0] ? 1 : 0, values);
  }
  return [...values].find(Boolean) || "";
}

async function refreshGdacsAasMapping(userId) {
  const settings = await db.get(
    "SELECT gdacs_aas_group_id, gdacs_aas_path, gdacs_aas_columns FROM resilience_settings WHERE user_id = ?",
    [userId]
  );
  const groupId = settings?.gdacs_aas_group_id;
  const aasPath = settings?.gdacs_aas_path;
  if (!groupId || !aasPath) return;

  const columnPaths = JSON.parse(settings?.gdacs_aas_columns || "[]");

  const members = await db.all(
    "SELECT aas_id FROM resilience_asset_group_members WHERE group_id = ?",
    [groupId]
  );
  if (!members.length) return;

  const mappingRows = await db.all(
    "SELECT iso_code, alpha3, numeric, aas_names, gdacs_names FROM resilience_country_mappings WHERE user_id = ?",
    [userId]
  );

  const validIds = new Set();
  for (const m of members) {
    validIds.add(m.aas_id);
    const imp = await db.get(
      "SELECT submodels_data FROM resilience_aas_imports WHERE aas_id = ? AND user_id = ?",
      [m.aas_id, userId]
    );
    let countryValue = "";
    let isoCode = "";
    const colData = {};
    if (imp?.submodels_data) {
      try {
        const submodels = JSON.parse(imp.submodels_data);
        countryValue = extractFirstValue(submodels, aasPath);
        if (countryValue) isoCode = matchCountryValue(countryValue, mappingRows);
        for (const cp of columnPaths) {
          colData[cp] = extractFirstValue(submodels, cp);
        }
      } catch { /* skip bad JSON */ }
    }
    await db.run(
      `INSERT OR REPLACE INTO resilience_gdacs_aas_map (user_id, aas_id, country_value, iso_code, columns_data, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      [userId, m.aas_id, countryValue, isoCode, JSON.stringify(colData)]
    );
  }

  // Remove stale entries
  const placeholders = [...validIds].map(() => "?").join(",");
  await db.run(
    `DELETE FROM resilience_gdacs_aas_map WHERE user_id = ? AND aas_id NOT IN (${placeholders})`,
    [userId, ...validIds]
  );
}

module.exports = { initResilienceTables, mountRoutes, refreshAllFeeds, cleanupExpiredItems, refreshAllGdacsAlerts, cleanupGdacsAlerts, refreshGdacsAasMapping, scheduleImports };
