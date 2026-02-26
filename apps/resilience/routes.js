const crypto = require("crypto");
const db = require("../../shared/db");
const auth = require("../../shared/auth");
const RssParser = require("rss-parser");
const { BigQuery } = require("@google-cloud/bigquery");
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

  // Migration: add geocoding settings
  try { await db.run(`ALTER TABLE resilience_settings ADD COLUMN geocoding_group_id TEXT NOT NULL DEFAULT ''`); } catch { /* exists */ }
  try { await db.run(`ALTER TABLE resilience_settings ADD COLUMN geocoding_country_path TEXT NOT NULL DEFAULT ''`); } catch { /* exists */ }
  try { await db.run(`ALTER TABLE resilience_settings ADD COLUMN geocoding_city_path TEXT NOT NULL DEFAULT ''`); } catch { /* exists */ }

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

  // Migration: per-condition input field
  try { await db.run(`ALTER TABLE resilience_indicator_conditions ADD COLUMN input TEXT NOT NULL DEFAULT ''`); } catch { /* already exists */ }

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

  // Migration: add geocoded_status to aas_imports (lightweight marker for overview)
  try { await db.run("ALTER TABLE resilience_aas_imports ADD COLUMN geocoded_status TEXT NOT NULL DEFAULT ''"); } catch { /* exists */ }
  // Migration: add company_status to aas_imports
  try { await db.run("ALTER TABLE resilience_aas_imports ADD COLUMN company_status TEXT NOT NULL DEFAULT ''"); } catch { /* exists */ }

  // Migration: add geo columns to gdacs_alerts
  try { await db.run("ALTER TABLE resilience_gdacs_alerts ADD COLUMN centroid_lat REAL DEFAULT NULL"); } catch { /* exists */ }
  try { await db.run("ALTER TABLE resilience_gdacs_alerts ADD COLUMN centroid_lon REAL DEFAULT NULL"); } catch { /* exists */ }
  try { await db.run("ALTER TABLE resilience_gdacs_alerts ADD COLUMN episodeid TEXT NOT NULL DEFAULT ''"); } catch { /* exists */ }
  try { await db.run("ALTER TABLE resilience_gdacs_alerts ADD COLUMN affected_countries TEXT NOT NULL DEFAULT '[]'"); } catch { /* exists */ }
  try { await db.run("ALTER TABLE resilience_gdacs_alerts ADD COLUMN polygon_fetched INTEGER NOT NULL DEFAULT 0"); } catch { /* exists */ }

  // GDACS polygons (separate table — polygon GeoJSON can be 100 KB+)
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_gdacs_polygons (
    eventid    TEXT NOT NULL,
    user_id    TEXT NOT NULL,
    geometry   TEXT NOT NULL DEFAULT '[]',
    fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, eventid),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Pre-computed AAS ↔ alert matches with quality tier
  await db.run(`CREATE TABLE IF NOT EXISTS resilience_gdacs_aas_matches (
    user_id     TEXT NOT NULL,
    aas_id      TEXT NOT NULL,
    alert_id    INTEGER NOT NULL,
    match_tier  TEXT NOT NULL DEFAULT 'country',
    distance_km REAL DEFAULT NULL,
    computed_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, aas_id, alert_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (alert_id) REFERENCES resilience_gdacs_alerts(alert_id) ON DELETE CASCADE
  )`);

  // Migration: add distance thresholds to settings
  try { await db.run(`ALTER TABLE resilience_settings ADD COLUMN gdacs_distance_thresholds TEXT NOT NULL DEFAULT '{"EQ":300,"TC":500,"FL":200,"VO":100,"WF":150,"DR":1000}'`); } catch { /* exists */ }

  // Migration: matching lat/lon paths + dash match filter
  try { await db.run(`ALTER TABLE resilience_settings ADD COLUMN matching_lat_path TEXT NOT NULL DEFAULT ''`); } catch { /* exists */ }
  try { await db.run(`ALTER TABLE resilience_settings ADD COLUMN matching_lon_path TEXT NOT NULL DEFAULT ''`); } catch { /* exists */ }
  try { await db.run(`ALTER TABLE resilience_settings ADD COLUMN dash_aas_match_filter TEXT NOT NULL DEFAULT '["polygon","distance"]'`); } catch { /* exists */ }
  // Migration: company process settings
  try { await db.run(`ALTER TABLE resilience_settings ADD COLUMN company_group_id TEXT NOT NULL DEFAULT ''`); } catch { /* exists */ }
  try { await db.run(`ALTER TABLE resilience_settings ADD COLUMN company_name_path TEXT NOT NULL DEFAULT ''`); } catch { /* exists */ }

  // Migration: GDELT BigQuery credentials
  try { await db.run(`ALTER TABLE resilience_settings ADD COLUMN bq_service_account TEXT NOT NULL DEFAULT ''`); } catch { /* exists */ }

  // Migration: indicator dashboard config
  try { await db.run(`ALTER TABLE resilience_settings ADD COLUMN indicator_dashboard_config TEXT NOT NULL DEFAULT '{}'`); } catch { /* exists */ }

  // Migration: score dashboard config
  try { await db.run(`ALTER TABLE resilience_settings ADD COLUMN score_dashboard_config TEXT NOT NULL DEFAULT '{}'`); } catch { /* exists */ }

  // Migration: city_value + direct coords on aas_map
  try { await db.run(`ALTER TABLE resilience_gdacs_aas_map ADD COLUMN city_value TEXT NOT NULL DEFAULT ''`); } catch { /* exists */ }
  try { await db.run(`ALTER TABLE resilience_gdacs_aas_map ADD COLUMN direct_lat REAL DEFAULT NULL`); } catch { /* exists */ }
  try { await db.run(`ALTER TABLE resilience_gdacs_aas_map ADD COLUMN direct_lon REAL DEFAULT NULL`); } catch { /* exists */ }

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
  } catch {
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
    const coords = f.geometry?.coordinates || [];
    events.push({
      eventid: String(p.eventid || ""),
      eventtype: p.eventtype || "",
      episodeid: String(p.episodeid || ""),
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
      centroid_lon: coords[0] ?? null,
      centroid_lat: coords[1] ?? null,
      affected_countries: JSON.stringify(p.affectedcountries || []),
    });
  }
  return events;
}

// ---------------------------------------------------------------------------
// Geo utilities (pure JS — no external dependencies)
// ---------------------------------------------------------------------------
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function pointInRing(lat, lon, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if ((yi > lat) !== (yj > lat) &&
        lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInGeoJsonGeometry(lat, lon, geometry) {
  if (geometry.type === "Polygon") {
    if (!pointInRing(lat, lon, geometry.coordinates[0])) return false;
    for (let h = 1; h < geometry.coordinates.length; h++) {
      if (pointInRing(lat, lon, geometry.coordinates[h])) return false;
    }
    return true;
  }
  if (geometry.type === "MultiPolygon") {
    for (const poly of geometry.coordinates) {
      if (!pointInRing(lat, lon, poly[0])) continue;
      let inHole = false;
      for (let h = 1; h < poly.length; h++) {
        if (pointInRing(lat, lon, poly[h])) { inHole = true; break; }
      }
      if (!inHole) return true;
    }
  }
  return false;
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
// Geocoding: server-side background job (Nominatim)
// ---------------------------------------------------------------------------
const geocodingJobs = {}; // { userId: { total, done, errors, running } }

function buildGeocodingSubmodel(cityRaw, countryIso, result) {
  const els = [
    { idShort: "CityRaw", modelType: "Property", valueType: "xs:string", value: cityRaw || "" },
    { idShort: "CountryISO", modelType: "Property", valueType: "xs:string", value: countryIso || "" },
    { idShort: "Latitude", modelType: "Property", valueType: "xs:double", value: result ? String(result.lat) : "" },
    { idShort: "Longitude", modelType: "Property", valueType: "xs:double", value: result ? String(result.lon) : "" },
    { idShort: "DisplayName", modelType: "Property", valueType: "xs:string", value: result ? (result.display_name || "") : "" },
    { idShort: "Status", modelType: "Property", valueType: "xs:string", value: result ? "ok" : "error" },
  ];
  return { idShort: "Geocoding", modelType: "Submodel", submodelElements: els };
}

async function runGeocodingJob(userId) {
  if (geocodingJobs[userId]?.running) return;

  const settings = await db.get(
    "SELECT geocoding_group_id, geocoding_country_path, geocoding_city_path FROM resilience_settings WHERE user_id = ?",
    [userId]
  );
  if (!settings?.geocoding_group_id || !settings?.geocoding_country_path || !settings?.geocoding_city_path) return;

  const members = await db.all(
    "SELECT m.aas_id FROM resilience_asset_group_members m JOIN resilience_aas_imports i ON i.aas_id = m.aas_id AND i.user_id = ? WHERE m.group_id = ?",
    [userId, settings.geocoding_group_id]
  );
  if (!members.length) return;

  const job = { total: members.length, done: 0, errors: 0, running: true };
  geocodingJobs[userId] = job;

  const mappingRows = await db.all(
    "SELECT iso_code, alpha3, numeric, aas_names, gdacs_names FROM resilience_country_mappings WHERE user_id = ?",
    [userId]
  );

  for (const m of members) {
    try {
      const imp = await db.get(
        "SELECT submodels_data FROM resilience_aas_imports WHERE aas_id = ? AND user_id = ?",
        [m.aas_id, userId]
      );
      if (!imp?.submodels_data) { job.errors++; job.done++; continue; }

      let submodels = JSON.parse(imp.submodels_data);
      const countryRaw = extractFirstValue(submodels, settings.geocoding_country_path);
      const cityRaw = extractFirstValue(submodels, settings.geocoding_city_path);
      const isoCode = countryRaw ? matchCountryValue(countryRaw, mappingRows) : "";

      let geoResult = null;
      const queryTerm = cityRaw || countryRaw;
      if (queryTerm) {
        const baseUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(queryTerm)}`;
        const fetchOpts = { signal: AbortSignal.timeout(15000), headers: { "User-Agent": "KanbanResilienceApp/1.0", Accept: "application/json" } };
        try {
          let url = isoCode ? `${baseUrl}&countrycodes=${isoCode.toLowerCase()}` : baseUrl;
          let resp = await fetch(url, fetchOpts);
          if (resp.ok) { const r = await resp.json(); if (r.length > 0) geoResult = r[0]; }
          // Retry without countrycodes if filtered query returned nothing
          if (!geoResult && isoCode) {
            await new Promise(resolve => setTimeout(resolve, 1100));
            resp = await fetch(baseUrl, fetchOpts);
            if (resp.ok) { const r = await resp.json(); if (r.length > 0) geoResult = r[0]; }
          }
        } catch { /* timeout or network error */ }
        // Rate limit: 1 request/second
        await new Promise(resolve => setTimeout(resolve, 1100));
      }

      if (!geoResult) job.errors++;

      // Inject Geocoding submodel
      submodels = submodels.filter(sm => sm.idShort !== "Geocoding");
      submodels.push(buildGeocodingSubmodel(cityRaw || countryRaw, isoCode, geoResult));
      await db.run(
        "UPDATE resilience_aas_imports SET submodels_data = ?, geocoded_status = ? WHERE aas_id = ? AND user_id = ?",
        [JSON.stringify(submodels), geoResult ? "ok" : "error", m.aas_id, userId]
      );
    } catch {
      job.errors++;
    }
    job.done++;
  }
  job.running = false;

}

// ---------------------------------------------------------------------------
// Company Process: build submodel + AI alias generation
// ---------------------------------------------------------------------------
function buildCompanySubmodel(name, alias) {
  return {
    idShort: "Company",
    modelType: "Submodel",
    submodelElements: [
      { idShort: "Name", modelType: "Property", valueType: "xs:string", value: name || "" },
      { idShort: "Alias", modelType: "Property", valueType: "xs:string", value: alias || "" },
    ],
  };
}

/**
 * Batch: generate aliases for multiple company names in ONE AI call.
 * Returns Map<companyName, aliasString>.
 */
async function generateCompanyAliases(companyNames, settings, job) {
  const result = new Map();
  if (!settings?.provider || !settings?.api_key || !companyNames.length) return result;

  // Split into batches of 50 to avoid token limits
  const BATCH_SIZE = 50;
  const batches = [];
  for (let i = 0; i < companyNames.length; i += BATCH_SIZE) {
    batches.push(companyNames.slice(i, i + BATCH_SIZE));
  }
  console.log("[CompanyAliases] Processing", companyNames.length, "names in", batches.length, "batches");
  if (job) { job.batchTotal = batches.length; job.batchDone = 0; }

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    const prompt = `For each company below, list common aliases, abbreviations, and alternative names.
Return ONLY a JSON object where keys are the numbers ("1", "2", ...) and values are comma-separated alias strings. No markdown, no code fences, just raw JSON.
Example: {"1": "Siemens, Siemens Energy, Siemens Healthineers", "2": "BMW, Bayerische Motoren Werke"}

Companies:
${batch.map((n, i) => `${i + 1}. ${n}`).join("\n")}`;

    try {
      let replyText = "";
      if (settings.provider === "gemini") {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.api_key}`;
        const r = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0, maxOutputTokens: 16384 },
          }),
          signal: AbortSignal.timeout(120000),
        });
        const data = await r.json();
        const parts = data?.candidates?.[0]?.content?.parts || [];
        const textParts = parts.filter(p => !p.thought);
        replyText = textParts.length ? textParts[textParts.length - 1].text || "" : parts[parts.length - 1]?.text || "";
      } else {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${settings.api_key}` },
          body: JSON.stringify({
            model: settings.model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
          }),
          signal: AbortSignal.timeout(120000),
        });
        const data = await r.json();
        replyText = data?.choices?.[0]?.message?.content || "";
      }
      // Strip markdown code fences if present
      replyText = replyText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
      const jsonMatch = replyText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          for (const [key, aliases] of Object.entries(parsed)) {
            const idx = parseInt(key, 10) - 1;
            if (idx >= 0 && idx < batch.length) {
              const globalIdx = b * BATCH_SIZE + idx;
              result.set(companyNames[globalIdx], String(aliases).slice(0, 1000));
            }
          }
        } catch (parseErr) { console.error("[CompanyAliases] Batch", b + 1, "JSON parse error:", parseErr.message); }
      } else {
        console.log("[CompanyAliases] Batch", b + 1, "no JSON found, reply:", replyText.slice(0, 200));
      }
      if (job) { job.batchDone = b + 1; job.aliasesSoFar = result.size; }
      console.log("[CompanyAliases] Batch", b + 1, "/", batches.length, "done — aliases so far:", result.size);
    } catch (err) { console.error("[CompanyAliases] Batch", b + 1, "error:", err.message); }
  }
  return result;
}

const companyProcessJobs = {};

async function runCompanyProcessJob(userId, groupId, companyNamePath) {
  if (companyProcessJobs[userId]?.running) return;

  console.log("[CompanyProcess] Starting batch — group:", groupId, "path:", companyNamePath);
  const members = await db.all(
    "SELECT m.aas_id FROM resilience_asset_group_members m JOIN resilience_aas_imports i ON i.aas_id = m.aas_id AND i.user_id = ? WHERE m.group_id = ?",
    [userId, groupId]
  );
  if (!members.length) { console.log("[CompanyProcess] No members found"); return; }
  console.log("[CompanyProcess] Members:", members.length);

  const job = { total: members.length, done: 0, errors: 0, running: true, phase: "extract", batchDone: 0, batchTotal: 0 };
  companyProcessJobs[userId] = job;

  // Pass 1: Extract all unique company names
  const aasNameMap = new Map(); // aas_id → { submodels, companyName }
  let extractFails = 0;
  for (const m of members) {
    try {
      const imp = await db.get(
        "SELECT submodels_data FROM resilience_aas_imports WHERE aas_id = ? AND user_id = ?",
        [m.aas_id, userId]
      );
      if (!imp?.submodels_data) { extractFails++; continue; }
      const submodels = JSON.parse(imp.submodels_data);
      const companyName = extractFirstValue(submodels, companyNamePath);
      if (companyName) aasNameMap.set(m.aas_id, { submodels, companyName });
      else extractFails++;
    } catch { extractFails++; }
  }

  const uniqueNames = [...new Set([...aasNameMap.values()].map(v => v.companyName))];
  console.log("[CompanyProcess] Pass 1 done — extracted:", aasNameMap.size, "failed:", extractFails, "unique names:", uniqueNames.length);
  if (uniqueNames.length > 0) console.log("[CompanyProcess] Sample names:", uniqueNames.slice(0, 5));

  // Pass 2: One AI call for all unique names (if AI configured)
  const aiSettings = await db.get(
    "SELECT provider, model, api_key FROM aas_chat_settings WHERE user_id = ?",
    [userId]
  );
  console.log("[CompanyProcess] AI configured:", !!(aiSettings?.provider && aiSettings?.api_key), aiSettings?.provider || "none");
  job.phase = "ai";
  const aliasMap = await generateCompanyAliases(uniqueNames, aiSettings, job);
  console.log("[CompanyProcess] Pass 2 done — aliases generated:", aliasMap.size);
  if (aliasMap.size > 0) console.log("[CompanyProcess] Sample alias:", [...aliasMap.entries()][0]);

  // Pass 3: Apply results to each AAS
  job.phase = "save";
  for (const m of members) {
    try {
      const data = aasNameMap.get(m.aas_id);
      if (!data) { job.errors++; job.done++; continue; }

      const alias = aliasMap.get(data.companyName) || "";
      let submodels = data.submodels.filter(sm => sm.idShort !== "Company");
      submodels.push(buildCompanySubmodel(data.companyName, alias));
      await db.run(
        "UPDATE resilience_aas_imports SET submodels_data = ?, company_status = ? WHERE aas_id = ? AND user_id = ?",
        [JSON.stringify(submodels), "ok", m.aas_id, userId]
      );
    } catch {
      job.errors++;
    }
    job.done++;
  }
  job.running = false;
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
        "SELECT retention_days, refresh_minutes, gdacs_refresh_minutes, gdacs_retention_days, import_interval_hours, gdacs_aas_group_id, gdacs_aas_path, gdacs_aas_columns, geocoding_group_id, geocoding_country_path, geocoding_city_path, gdacs_distance_thresholds, matching_lat_path, matching_lon_path, dash_aas_match_filter, bq_service_account FROM resilience_settings WHERE user_id = ?",
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
      // Resolve matching group name
      let matchingGroupName = "";
      const mgId = settings?.gdacs_aas_group_id ?? "";
      if (mgId) {
        const grp = await db.get("SELECT name FROM resilience_asset_groups WHERE group_id = ?", [mgId]);
        matchingGroupName = grp?.name || mgId;
      }
      res.json({
        retention_days: settings?.retention_days ?? 30,
        refresh_minutes: settings?.refresh_minutes ?? 60,
        gdacs_refresh_minutes: settings?.gdacs_refresh_minutes ?? 60,
        gdacs_retention_days: settings?.gdacs_retention_days ?? 30,
        import_interval_hours: settings?.import_interval_hours ?? 0,
        gdacs_aas_group_id: settings?.gdacs_aas_group_id ?? "",
        gdacs_aas_path: settings?.gdacs_aas_path ?? "",
        gdacs_aas_columns: JSON.parse(settings?.gdacs_aas_columns || "[]"),
        geocoding_group_id: settings?.geocoding_group_id ?? "",
        geocoding_country_path: settings?.geocoding_country_path ?? "",
        geocoding_city_path: settings?.geocoding_city_path ?? "",
        gdacs_distance_thresholds: JSON.parse(settings?.gdacs_distance_thresholds || '{"EQ":300,"TC":500,"FL":200,"VO":100,"WF":150,"DR":1000}'),
        matching_group_id: mgId,
        matching_group_name: matchingGroupName,
        matching_country_path: settings?.gdacs_aas_path ?? "",
        matching_city_path: settings?.geocoding_city_path ?? "",
        matching_lat_path: settings?.matching_lat_path ?? "",
        matching_lon_path: settings?.matching_lon_path ?? "",
        dash_aas_match_filter: JSON.parse(settings?.dash_aas_match_filter || '["polygon","distance"]'),
        bq_has_credentials: !!(settings?.bq_service_account),
        bq_project_id: (() => { try { return JSON.parse(settings?.bq_service_account || "{}").project_id || ""; } catch { return ""; } })(),
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
        // columns_data will be recomputed on-the-fly in dashboard
      }
      if (body.geocoding_group_id !== undefined) {
        await db.run("UPDATE resilience_settings SET geocoding_group_id = ? WHERE user_id = ?",
          [String(body.geocoding_group_id), req.user.id]);
      }
      if (body.geocoding_country_path !== undefined) {
        await db.run("UPDATE resilience_settings SET geocoding_country_path = ? WHERE user_id = ?",
          [String(body.geocoding_country_path), req.user.id]);
      }
      if (body.geocoding_city_path !== undefined) {
        await db.run("UPDATE resilience_settings SET geocoding_city_path = ? WHERE user_id = ?",
          [String(body.geocoding_city_path), req.user.id]);
      }
      if (body.gdacs_distance_thresholds !== undefined) {
        const th = body.gdacs_distance_thresholds;
        const valid = typeof th === "object" && ["EQ","TC","FL","VO","WF","DR"].every(
          k => typeof th[k] === "number" && th[k] > 0
        );
        if (valid) {
          await db.run("UPDATE resilience_settings SET gdacs_distance_thresholds = ? WHERE user_id = ?",
            [JSON.stringify(th), req.user.id]);
        }
      }
      if (body.matching_params) {
        const p = body.matching_params;
        await db.run(`UPDATE resilience_settings SET
          gdacs_aas_group_id=?, gdacs_aas_path=?,
          geocoding_group_id=?, geocoding_country_path=?, geocoding_city_path=?,
          matching_lat_path=?, matching_lon_path=?
          WHERE user_id=?`,
          [String(p.group_id), String(p.country_path),
           String(p.group_id), String(p.country_path), String(p.city_path),
           String(p.lat_path), String(p.lon_path), req.user.id]);
      }
      if (body.company_group_id !== undefined) {
        await db.run("UPDATE resilience_settings SET company_group_id = ? WHERE user_id = ?",
          [String(body.company_group_id), req.user.id]);
      }
      if (body.company_name_path !== undefined) {
        await db.run("UPDATE resilience_settings SET company_name_path = ? WHERE user_id = ?",
          [String(body.company_name_path), req.user.id]);
      }
      if (body.dash_aas_match_filter !== undefined) {
        const f = body.dash_aas_match_filter;
        if (Array.isArray(f)) {
          await db.run("UPDATE resilience_settings SET dash_aas_match_filter = ? WHERE user_id = ?",
            [JSON.stringify(f), req.user.id]);
        }
      }
      if (body.bq_service_account !== undefined) {
        const val = (body.bq_service_account || "").trim();
        if (val && !val.startsWith("\u2022")) {
          // New JSON — validate
          try {
            const parsed = JSON.parse(val);
            if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
              return res.status(400).json({ error: "INVALID_SERVICE_ACCOUNT" });
            }
            await db.run("UPDATE resilience_settings SET bq_service_account = ? WHERE user_id = ?", [val, req.user.id]);
          } catch {
            return res.status(400).json({ error: "INVALID_JSON" });
          }
        } else if (val === "") {
          await db.run("UPDATE resilience_settings SET bq_service_account = '' WHERE user_id = ?", [req.user.id]);
        }
        // If val starts with "•" → keep existing (do nothing)
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

  // walkElements is defined at module level (shared with buildAasAlertData)

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
                a.centroid_lat, a.centroid_lon, a.polygon_fetched,
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

  // ── GDACS Map Data (world map modal) ─────────────────────────
  router.get("/api/gdacs/map-data", auth.requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const settings = await db.get(
        "SELECT gdacs_retention_days FROM resilience_settings WHERE user_id = ?", [userId]);
      const retDays = settings?.gdacs_retention_days || 30;

      const { aasEntries, matches, columns, totalMembers } = await buildAasAlertData(userId);

      // Alerts with polygons (filtered by retention)
      const alerts = await db.all(
        `SELECT a.alert_id, a.eventid, a.eventtype, a.name, a.alertlevel,
                a.centroid_lat, a.centroid_lon, a.fromdate, a.url,
                c.name AS country_name
         FROM resilience_gdacs_alerts a
         JOIN resilience_gdacs_countries c ON c.country_id = a.country_id
         WHERE a.user_id = ? AND a.fromdate >= datetime('now', '-' || ? || ' days')
         ORDER BY a.fromdate DESC`, [userId, retDays]);

      const polys = await db.all(
        "SELECT eventid, geometry FROM resilience_gdacs_polygons WHERE user_id = ?", [userId]);
      const polyMap = {};
      for (const p of polys) polyMap[p.eventid] = JSON.parse(p.geometry || "[]");

      const alertsOut = alerts.map(a => ({ ...a, polygons: polyMap[a.eventid] || [] }));

      // AAS with coordinates
      const aasOut = aasEntries
        .filter(a => a.lat !== null && a.lon !== null)
        .map(a => ({
          aas_id: a.aas_id, direct_lat: a.lat, direct_lon: a.lon,
          city_value: a.city_value, country_value: a.country_value,
          columns_data: a.columns_data
        }));

      // Matches (only polygon + distance for map lines)
      const mapMatches = matches
        .filter(m => m.match_tier === "polygon" || m.match_tier === "distance")
        .map(m => ({ aas_id: m.aas_id, alert_id: m.alert_id, match_tier: m.match_tier, distance_km: m.distance_km }));

      res.json({ alerts: alertsOut, aas: aasOut, matches: mapMatches, columns, total_members: totalMembers });
    } catch (err) {
      console.error("GET /api/gdacs/map-data error:", err);
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // ── Debug: map stats (temporary) ─────────────────────────────
  router.get("/api/gdacs/map-debug", auth.requireAuth, async (req, res) => {
    try {
      const { aasEntries, totalMembers } = await buildAasAlertData(req.user.id);
      const withCoords = aasEntries.filter(a => a.lat !== null && a.lon !== null).length;
      const missing = aasEntries.filter(a => a.lat === null || a.lon === null)
        .map(a => ({ aas_id: a.aas_id, country: a.country_value, city: a.city_value, iso: a.iso_code }));
      res.json({ total_members: totalMembers, imported: aasEntries.length, with_coords: withCoords, not_imported: totalMembers - aasEntries.length, no_coords: missing.length, missing });
    } catch (err) { res.status(500).json({ error: String(err) }); }
  });

  // ── GDACS AAS Overview (dashboard tile) ──────────────────────
  router.get("/api/gdacs/aas-overview", auth.requireAuth, async (req, res) => {
    try {
      const { aasEntries, matches, columns } = await buildAasAlertData(req.user.id);
      if (!aasEntries.length) return res.json({ items: [], total: 0, columns: [], updated_at: null });

      const columnPaths = columns.map(c => typeof c === "string" ? c : c.path);

      // Group matches by aas_id
      const matchesByAas = {};
      for (const m of matches) {
        if (!matchesByAas[m.aas_id]) matchesByAas[m.aas_id] = [];
        matchesByAas[m.aas_id].push(m);
      }

      // Optional match_filter: comma-separated tiers (polygon,distance,country)
      const filterParam = (req.query.match_filter || "").trim();
      const tierFilter = filterParam ? new Set(filterParam.split(",").map(s => s.trim())) : null;

      // Build response items — only include rows that have matches
      const allItems = [];
      for (const entry of aasEntries) {
        let rowAlerts = matchesByAas[entry.aas_id] || [];
        if (tierFilter) rowAlerts = rowAlerts.filter(a => tierFilter.has(a.match_tier));
        if (!rowAlerts.length) continue;
        allItems.push({
          aas_id: entry.aas_id,
          country_value: entry.country_value,
          iso_code: entry.iso_code,
          city_value: entry.city_value || "",
          lat: entry.lat,
          lon: entry.lon,
          columns_data: entry.columns_data,
          alerts: rowAlerts,
        });
      }

      // Sorting by column path
      const sortBy = req.query.sort || "";
      const sortDir = req.query.sort_dir === "desc" ? -1 : 1;
      if (sortBy && columnPaths.includes(sortBy)) {
        allItems.sort((a, b) => {
          const ra = a.columns_data[sortBy] || "";
          const rb = b.columns_data[sortBy] || "";
          const na = Number(ra), nb = Number(rb);
          if (ra !== "" && rb !== "" && !isNaN(na) && !isNaN(nb)) return (na - nb) * sortDir;
          return ra.toLowerCase() < rb.toLowerCase() ? -sortDir : ra.toLowerCase() > rb.toLowerCase() ? sortDir : 0;
        });
      }

      // Pagination
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const offset = parseInt(req.query.offset) || 0;
      res.json({ items: allItems.slice(offset, offset + limit), total: allItems.length, columns, updated_at: new Date().toISOString() });
    } catch (err) {
      console.error("GET /api/gdacs/aas-overview error:", err);
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // ── Company Detail (modal) ──────────────────────────────────────
  router.get("/api/company-detail/:aasId", auth.requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const aasId = req.params.aasId;

      // All queries in parallel
      const [imp, mapRow, settings, matchedAlerts] = await Promise.all([
        db.get("SELECT shell_data, submodels_data, imported_at FROM resilience_aas_imports WHERE aas_id = ? AND user_id = ?", [aasId, userId]),
        db.get("SELECT country_value, iso_code, columns_data FROM resilience_gdacs_aas_map WHERE aas_id = ? AND user_id = ?", [aasId, userId]),
        db.get("SELECT matching_lat_path, matching_lon_path, geocoding_city_path FROM resilience_settings WHERE user_id = ?", [userId]),
        db.all(`SELECT m.match_tier, m.distance_km, a.eventid, a.eventtype, a.alertlevel, a.name, a.fromdate, a.url
                FROM resilience_gdacs_aas_matches m JOIN resilience_gdacs_alerts a ON a.alert_id = m.alert_id
                WHERE m.user_id = ? AND m.aas_id = ? ORDER BY a.fromdate DESC`, [userId, aasId]),
      ]);
      if (!imp) return res.status(404).json({ error: "NOT_IMPORTED" });

      const shell = JSON.parse(imp.shell_data || "{}");
      const submodels = JSON.parse(imp.submodels_data || "[]");

      // Use cached map data for country/columns (already computed by dashboard)
      const countryValue = mapRow?.country_value || "";
      const isoCode = mapRow?.iso_code || "";
      const colData = JSON.parse(mapRow?.columns_data || "{}");

      // Extract city + coordinates from submodels
      let cityValue = "";
      let lat = null, lon = null;
      if (settings) {
        if (settings.geocoding_city_path) cityValue = extractFirstValue(submodels, settings.geocoding_city_path);
        if (settings.matching_lat_path) { const v = parseFloat(extractFirstValue(submodels, settings.matching_lat_path)); if (!isNaN(v)) lat = v; }
        if (settings.matching_lon_path) { const v = parseFloat(extractFirstValue(submodels, settings.matching_lon_path)); if (!isNaN(v)) lon = v; }
      }
      if (lat === null) {
        const geo = submodels.find(sm => sm.idShort === "Geocoding");
        if (geo) {
          const els = geo.submodelElements || [];
          const latEl = els.find(e => e.idShort === "Latitude");
          const lonEl = els.find(e => e.idShort === "Longitude");
          if (latEl?.value) lat = parseFloat(latEl.value);
          if (lonEl?.value) lon = parseFloat(lonEl.value);
          if (isNaN(lat) || isNaN(lon)) { lat = null; lon = null; }
        }
      }

      // Submodel summary with recursive properties, exclude Geocoding
      function flattenElements(elements, prefix) {
        const result = [];
        for (const el of (elements || [])) {
          const path = prefix ? `${prefix}.${el.idShort || ""}` : (el.idShort || "");
          if (el.modelType === "Property") {
            result.push({ idShort: path, value: el.value || "", modelType: "Property" });
          } else if (el.modelType === "MultiLanguageProperty") {
            result.push({ idShort: path, value: (el.value || []).map(v => v.text).filter(Boolean).join(", "), modelType: "MLP" });
          } else if (el.modelType === "SubmodelElementCollection") {
            result.push({ idShort: path, value: "", modelType: "Collection", childCount: (el.value || []).length });
            result.push(...flattenElements(el.value || [], path));
          } else if (el.modelType === "SubmodelElementList") {
            const items = el.value || [];
            result.push({ idShort: path, value: "", modelType: "List", childCount: items.length });
            result.push(...flattenElements(items, path));
          } else {
            result.push({ idShort: path, value: el.value != null ? String(el.value) : "", modelType: el.modelType || "" });
          }
        }
        return result;
      }
      const submodelSummary = submodels
        .filter(sm => sm.idShort !== "Geocoding")
        .map(sm => ({
          idShort: sm.idShort || "", id: sm.id || "",
          semanticId: sm.semanticId?.keys?.[0]?.value || "",
          properties: flattenElements(sm.submodelElements, ""),
        }));

      res.json({
        aas_id: aasId,
        shell: {
          idShort: shell.idShort || "",
          id: shell.id || "",
          assetKind: shell.assetInformation?.assetKind || "",
          assetType: shell.assetInformation?.assetType || "",
          globalAssetId: shell.assetInformation?.globalAssetId || "",
          submodelCount: (shell.submodels || []).length,
        },
        geo: { country_value: countryValue, iso_code: isoCode, city_value: cityValue, lat, lon },
        columns_data: colData,
        alerts: matchedAlerts,
        submodels: submodelSummary,
        imported_at: imp.imported_at,
      });
    } catch (err) {
      console.error("GET /api/company-detail error:", err);
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // ── Company News (Google News RSS proxy) ──────────────────────
  const companyNewsCache = new Map();
  const COMPANY_NEWS_TTL = 30 * 60 * 1000;

  router.get("/api/company-news", auth.requireAuth, async (req, res) => {
    try {
      const q = (req.query.q || "").trim();
      if (!q) return res.status(400).json({ error: "MISSING_QUERY" });

      const cached = companyNewsCache.get(q);
      if (cached && (Date.now() - cached.fetchedAt) < COMPANY_NEWS_TTL) {
        return res.json({ items: cached.items, cached: true });
      }

      // Fetch DE + EN in parallel
      const locales = [
        { hl: "de", gl: "DE", ceid: "DE:de" },
        { hl: "en", gl: "US", ceid: "US:en" },
      ];
      const encodedQ = encodeURIComponent(q);
      const feedResults = await Promise.allSettled(
        locales.map(async ({ hl, gl, ceid }) => {
          const url = `https://news.google.com/rss/search?q=${encodedQ}+when:14d&hl=${hl}&gl=${gl}&ceid=${ceid}`;
          const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.text();
        })
      );

      // Merge results from all feeds
      const sourceMap = new Map();
      const sourceRe = /<source\s+url="([^"]+)"[^>]*>([^<]+)<\/source>/g;
      let allParsedItems = [];
      for (const result of feedResults) {
        if (result.status !== "fulfilled") continue;
        const rawXml = result.value;
        let m;
        while ((m = sourceRe.exec(rawXml)) !== null) {
          sourceMap.set(m[2].trim(), m[1]);
        }
        const parsed = await rssParser.parseString(rawXml);
        allParsedItems.push(...(parsed.items || []));
      }

      // Deduplicate by link
      const seen = new Set();
      allParsedItems = allParsedItems.filter(item => {
        const key = item.link || item.title;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // 14-day filter, sort by date desc
      const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
      const items = allParsedItems
        .filter(item => {
          const d = new Date(item.isoDate || item.pubDate);
          return !isNaN(d) && d.getTime() >= cutoff;
        })
        .sort((a, b) => new Date(b.isoDate || b.pubDate) - new Date(a.isoDate || a.pubDate))
        .slice(0, 50)
        .map(item => {
          const title = (item.title || "").slice(0, 500);
          let sourceName = item.source?.name || item.creator || "";
          if (!sourceName && title.includes(" - ")) {
            sourceName = title.slice(title.lastIndexOf(" - ") + 3);
          }
          return {
            title,
            link: (item.link || "").slice(0, 2000),
            pubDate: item.isoDate || item.pubDate || null,
            source: sourceName,
            sourceUrl: sourceMap.get(sourceName) || "",
            content: (item.contentSnippet || item.content || "").replace(/<[^>]+>/g, "").slice(0, 500),
          };
        });

      companyNewsCache.set(q, { items, fetchedAt: Date.now() });
      res.json({ items, cached: false });
    } catch (err) {
      console.error("GET /api/company-news error:", err);
      res.status(502).json({ error: "FETCH_FAILED" });
    }
  });

  // ── GDELT BigQuery ───────────────────────────────────────────
  const gdeltCache = new Map();
  const GDELT_CACHE_TTL = 30 * 60 * 1000;

  function getBigQueryClient(serviceAccountJson) {
    const sa = JSON.parse(serviceAccountJson);
    return new BigQuery({
      projectId: sa.project_id,
      credentials: { client_email: sa.client_email, private_key: sa.private_key },
    });
  }

  router.get("/api/gdelt/company", auth.requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const companyName = (req.query.name || "").trim();
      const companyAlias = (req.query.alias || "").trim();
      const country = (req.query.country || "").trim();

      if (!companyName) {
        return res.status(400).json({ error: "NO_COMPANY" });
      }

      // 1. Load credentials
      const settings = await db.get(
        "SELECT bq_service_account FROM resilience_settings WHERE user_id = ?", [userId]);
      if (!settings?.bq_service_account) {
        return res.status(400).json({ error: "NO_CREDENTIALS" });
      }

      // 2. Check cache
      const cacheKey = `${userId}:${companyName}`;
      const cached = gdeltCache.get(cacheKey);
      if (cached && (Date.now() - cached.fetchedAt) < GDELT_CACHE_TTL) {
        return res.json(cached.data);
      }

      // 3. Build search terms (only aliases with 3+ chars to avoid noise)
      const searchTerms = [companyName];
      if (companyAlias) {
        for (const a of companyAlias.split(",")) {
          const trimmed = a.trim();
          if (trimmed && trimmed.length >= 3 && trimmed.toLowerCase() !== companyName.toLowerCase()) {
            searchTerms.push(trimmed);
          }
        }
      }

      // 4. Build BigQuery query — search V2Organizations AND AllNames for broader coverage
      const orgConditions = searchTerms
        .map((_, i) => `(V2Organizations LIKE @term${i} OR AllNames LIKE @term${i})`)
        .join(" OR ");
      const params = {};
      searchTerms.forEach((term, i) => { params[`term${i}`] = `%${term}%`; });

      const sql = `
        SELECT
          SUBSTR(CAST(DATE AS STRING), 1, 8) AS day,
          DocumentIdentifier AS url,
          SourceCommonName AS source,
          V2Tone
        FROM \`gdelt-bq.gdeltv2.gkg_partitioned\`
        WHERE _PARTITIONTIME >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
          AND (${orgConditions})
        ORDER BY DATE DESC
        LIMIT 500
      `;

      // 5. Execute query
      const bq = getBigQueryClient(settings.bq_service_account);
      const [rows] = await bq.query({
        query: sql,
        params,
        location: "US",
        maximumBytesBilled: "10000000000",
      });

      // 6. Process results
      const mentions = rows.map(row => {
        const toneParts = (row.V2Tone || "").split(",");
        const tone = parseFloat(toneParts[0]) || 0;
        return {
          day: row.day || "",
          url: (row.url || "").slice(0, 2000),
          source: row.source || "",
          tone: Math.round(tone * 10) / 10,
        };
      });

      // Aggregate chart data by day
      const dayMap = new Map();
      for (const m of mentions) {
        if (!m.day) continue;
        const entry = dayMap.get(m.day) || { day: m.day, count: 0, toneSum: 0 };
        entry.count++;
        entry.toneSum += m.tone;
        dayMap.set(m.day, entry);
      }
      const chart = [...dayMap.values()]
        .map(d => ({ day: d.day, count: d.count, avgTone: Math.round((d.toneSum / d.count) * 10) / 10 }))
        .sort((a, b) => a.day.localeCompare(b.day));

      const data = { chart, mentions, total: mentions.length };
      gdeltCache.set(cacheKey, { data, fetchedAt: Date.now() });
      res.json(data);
    } catch (err) {
      console.error("[GDELT] Error:", err.message, err.errors || "");
      res.status(500).json({ error: "QUERY_FAILED", message: err.message });
    }
  });

  // ── World Bank Governance Indicators ──────────────────────────
  const worldBankCache = new Map();
  const WB_CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

  const WB_INDICATORS = [
    { id: "CC.EST", name: "Control of Corruption" },
    { id: "GE.EST", name: "Government Effectiveness" },
    { id: "PV.EST", name: "Political Stability" },
    { id: "RQ.EST", name: "Regulatory Quality" },
    { id: "RL.EST", name: "Rule of Law" },
    { id: "VA.EST", name: "Voice and Accountability" },
  ];
  const WB_LOGISTICS_ID = "LP.LPI.OVRL.XQ";

  router.get("/api/world-bank", auth.requireAuth, async (req, res) => {
    try {
      const iso = (req.query.iso || "").trim().toUpperCase();
      if (!iso || iso.length !== 2) return res.status(400).json({ error: "INVALID_ISO" });

      const cached = worldBankCache.get(iso);
      if (cached && (Date.now() - cached.fetchedAt) < WB_CACHE_TTL) {
        return res.json(cached.data);
      }

      const allIds = [...WB_INDICATORS.map(i => i.id), WB_LOGISTICS_ID];
      const results = await Promise.allSettled(allIds.map(async (indId) => {
        const url = `https://api.worldbank.org/v2/country/${encodeURIComponent(iso)}/indicator/${encodeURIComponent(indId)}?date=2018:2024&format=json`;
        const r = await fetch(url);
        if (!r.ok) return null;
        const json = await r.json();
        if (!Array.isArray(json) || !Array.isArray(json[1])) return null;
        // Find newest year with a value
        for (const entry of json[1]) {
          if (entry.value !== null) {
            return { id: indId, value: Math.round(entry.value * 100) / 100, year: parseInt(entry.date), country: entry.country?.value || "" };
          }
        }
        return null;
      }));

      let country = "";
      const governance = [];
      let logistics = null;

      for (let i = 0; i < results.length; i++) {
        const val = results[i].status === "fulfilled" ? results[i].value : null;
        if (!val) continue;
        if (!country && val.country) country = val.country;
        if (val.id === WB_LOGISTICS_ID) {
          logistics = { value: val.value, year: val.year };
        } else {
          governance.push({ id: val.id, value: val.value, year: val.year });
        }
      }

      const data = { country, iso, governance, logistics };
      worldBankCache.set(iso, { data, fetchedAt: Date.now() });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "WB_FETCH_FAILED" });
    }
  });

  // ── INFORM Risk Index ───────────────────────────────────────
  const informCache = new Map();
  const INFORM_CACHE_TTL = 24 * 60 * 60 * 1000; // 24h
  let informWorkflowId = null;
  let informWorkflowName = "";
  let informWorkflowFetchedAt = 0;
  const INFORM_WF_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

  // ISO2 → ISO3 fallback map for common countries
  const ISO2_TO_ISO3 = {
    AF:"AFG",AL:"ALB",DZ:"DZA",AD:"AND",AO:"AGO",AR:"ARG",AM:"ARM",AU:"AUS",AT:"AUT",AZ:"AZE",
    BS:"BHS",BH:"BHR",BD:"BGD",BY:"BLR",BE:"BEL",BZ:"BLZ",BJ:"BEN",BT:"BTN",BO:"BOL",BA:"BIH",
    BW:"BWA",BR:"BRA",BN:"BRN",BG:"BGR",BF:"BFA",BI:"BDI",KH:"KHM",CM:"CMR",CA:"CAN",CF:"CAF",
    TD:"TCD",CL:"CHL",CN:"CHN",CO:"COL",CG:"COG",CD:"COD",CR:"CRI",CI:"CIV",HR:"HRV",CU:"CUB",
    CY:"CYP",CZ:"CZE",DK:"DNK",DJ:"DJI",DO:"DOM",EC:"ECU",EG:"EGY",SV:"SLV",GQ:"GNQ",ER:"ERI",
    EE:"EST",ET:"ETH",FI:"FIN",FR:"FRA",GA:"GAB",GM:"GMB",GE:"GEO",DE:"DEU",GH:"GHA",GR:"GRC",
    GT:"GTM",GN:"GIN",GW:"GNB",GY:"GUY",HT:"HTI",HN:"HND",HU:"HUN",IS:"ISL",IN:"IND",ID:"IDN",
    IR:"IRN",IQ:"IRQ",IE:"IRL",IL:"ISR",IT:"ITA",JM:"JAM",JP:"JPN",JO:"JOR",KZ:"KAZ",KE:"KEN",
    KW:"KWT",KG:"KGZ",LA:"LAO",LV:"LVA",LB:"LBN",LS:"LSO",LR:"LBR",LY:"LBY",LT:"LTU",LU:"LUX",
    MG:"MDG",MW:"MWI",MY:"MYS",ML:"MLI",MT:"MLT",MR:"MRT",MU:"MUS",MX:"MEX",MD:"MDA",MN:"MNG",
    ME:"MNE",MA:"MAR",MZ:"MOZ",MM:"MMR",NA:"NAM",NP:"NPL",NL:"NLD",NZ:"NZL",NI:"NIC",NE:"NER",
    NG:"NGA",KP:"PRK",MK:"MKD",NO:"NOR",OM:"OMN",PK:"PAK",PA:"PAN",PG:"PNG",PY:"PRY",PE:"PER",
    PH:"PHL",PL:"POL",PT:"PRT",QA:"QAT",RO:"ROU",RU:"RUS",RW:"RWA",SA:"SAU",SN:"SEN",RS:"SRB",
    SL:"SLE",SG:"SGP",SK:"SVK",SI:"SVN",SO:"SOM",ZA:"ZAF",KR:"KOR",SS:"SSD",ES:"ESP",LK:"LKA",
    SD:"SDN",SR:"SUR",SZ:"SWZ",SE:"SWE",CH:"CHE",SY:"SYR",TW:"TWN",TJ:"TJK",TZ:"TZA",TH:"THA",
    TL:"TLS",TG:"TGO",TT:"TTO",TN:"TUN",TR:"TUR",TM:"TKM",UG:"UGA",UA:"UKR",AE:"ARE",GB:"GBR",
    US:"USA",UY:"URY",UZ:"UZB",VE:"VEN",VN:"VNM",YE:"YEM",ZM:"ZMB",ZW:"ZWE"
  };

  async function getInformWorkflowId() {
    if (informWorkflowId && (Date.now() - informWorkflowFetchedAt) < INFORM_WF_TTL) {
      return { id: informWorkflowId, name: informWorkflowName };
    }
    const r = await fetch("https://drmkc.jrc.ec.europa.eu/inform-index/API/InformAPI/Workflows/Default");
    if (!r.ok) throw new Error("INFORM workflow fetch failed");
    const wf = await r.json();
    informWorkflowId = wf.WorkflowId;
    informWorkflowName = wf.Name || "";
    informWorkflowFetchedAt = Date.now();
    return { id: informWorkflowId, name: informWorkflowName };
  }

  router.get("/api/inform-risk", auth.requireAuth, async (req, res) => {
    try {
      const iso = (req.query.iso || "").trim().toUpperCase();
      if (!iso || iso.length !== 2) return res.status(400).json({ error: "INVALID_ISO" });

      const cached = informCache.get(iso);
      if (cached && (Date.now() - cached.fetchedAt) < INFORM_CACHE_TTL) {
        return res.json(cached.data);
      }

      // Resolve ISO3
      let alpha3 = ISO2_TO_ISO3[iso] || "";
      if (!alpha3) {
        const row = await db.get("SELECT alpha3 FROM resilience_country_mappings WHERE iso_code = ? AND alpha3 != '' LIMIT 1", [iso]);
        if (row) alpha3 = row.alpha3;
      }
      if (!alpha3) return res.status(400).json({ error: "NO_ISO3" });

      const wf = await getInformWorkflowId();
      const indicatorIds = "INFORM,HA,VU,CC,HA.NAT,HA.HUM,VU.SEV,VU.VGR,CC.INF,CC.INS";
      const url = `https://drmkc.jrc.ec.europa.eu/inform-index/API/InformAPI/countries/Scores?WorkflowId=${wf.id}&ISO3=${encodeURIComponent(alpha3)}&IndicatorId=${indicatorIds}`;
      const r = await fetch(url);
      if (!r.ok) throw new Error("INFORM scores fetch failed");
      const scores = await r.json();

      const scoreMap = {};
      for (const s of scores) {
        scoreMap[s.IndicatorId] = Math.round((s.IndicatorScore || 0) * 10) / 10;
      }

      const data = {
        country: alpha3,
        workflowName: wf.name,
        overall: scoreMap.INFORM || 0,
        dimensions: [
          { id: "HA", name: "Hazard & Exposure", score: scoreMap.HA || 0 },
          { id: "VU", name: "Vulnerability", score: scoreMap.VU || 0 },
          { id: "CC", name: "Lack of Coping Capacity", score: scoreMap.CC || 0 },
        ],
        details: [
          { id: "HA.NAT", name: "Natural Hazards", score: scoreMap["HA.NAT"] || 0, parent: "HA" },
          { id: "HA.HUM", name: "Human Hazards", score: scoreMap["HA.HUM"] || 0, parent: "HA" },
          { id: "VU.SEV", name: "Socio-Economic", score: scoreMap["VU.SEV"] || 0, parent: "VU" },
          { id: "VU.VGR", name: "Vulnerable Groups", score: scoreMap["VU.VGR"] || 0, parent: "VU" },
          { id: "CC.INF", name: "Infrastructure", score: scoreMap["CC.INF"] || 0, parent: "CC" },
          { id: "CC.INS", name: "Institutional", score: scoreMap["CC.INS"] || 0, parent: "CC" },
        ],
      };
      informCache.set(iso, { data, fetchedAt: Date.now() });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "INFORM_FETCH_FAILED" });
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

  router.get("/api/indicators", auth.requireAuth, async (req, res) => {
    try {
      const indicators = await db.all(
        `SELECT i.indicator_id, i.name, i.class_id, i.created_at,
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

  // ── Indicator Dashboard Config (must be before :indicatorId) ──
  router.get("/api/indicators/dashboard-config", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get(
        "SELECT indicator_dashboard_config FROM resilience_settings WHERE user_id = ?",
        [req.user.id]
      );
      res.json(JSON.parse(row?.indicator_dashboard_config || "{}"));
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.put("/api/indicators/dashboard-config", auth.requireAuth, async (req, res) => {
    try {
      const config = req.body.config;
      if (config === undefined) return res.status(400).json({ error: "MISSING_CONFIG" });
      await db.run("INSERT OR IGNORE INTO resilience_settings (user_id) VALUES (?)", [req.user.id]);
      await db.run(
        "UPDATE resilience_settings SET indicator_dashboard_config = ? WHERE user_id = ?",
        [JSON.stringify(config), req.user.id]
      );
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "SAVE_FAILED" });
    }
  });

  // ── Score Dashboard Config ─────────────────────────────────────
  router.get("/api/score/dashboard-config", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get(
        "SELECT score_dashboard_config FROM resilience_settings WHERE user_id = ?",
        [req.user.id]
      );
      res.json(JSON.parse(row?.score_dashboard_config || "{}"));
    } catch {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.put("/api/score/dashboard-config", auth.requireAuth, async (req, res) => {
    try {
      const config = req.body.config;
      if (config === undefined) return res.status(400).json({ error: "MISSING_CONFIG" });
      await db.run("INSERT OR IGNORE INTO resilience_settings (user_id) VALUES (?)", [req.user.id]);
      await db.run(
        "UPDATE resilience_settings SET score_dashboard_config = ? WHERE user_id = ?",
        [JSON.stringify(config), req.user.id]
      );
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "SAVE_FAILED" });
    }
  });

  router.get("/api/score/dashboard-evaluate", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get(
        "SELECT score_dashboard_config FROM resilience_settings WHERE user_id = ?",
        [req.user.id]
      );
      const config = JSON.parse(row?.score_dashboard_config || "{}");
      if (!config.group_id || !Array.isArray(config.aas_ids) || !config.aas_ids.length || !config.label_path || !config.target_path) {
        return res.json({ items: [] });
      }
      const items = [];
      for (const aasId of config.aas_ids) {
        const imp = await db.get(
          "SELECT submodels_data FROM resilience_aas_imports WHERE aas_id = ? AND user_id = ?",
          [aasId, req.user.id]
        );
        if (!imp?.submodels_data) continue;
        let submodels;
        try { submodels = JSON.parse(imp.submodels_data); } catch { continue; }
        const label = extractFirstValue(submodels, config.label_path) || aasId;
        const target = parseFloat(extractFirstValue(submodels, config.target_path)) || 0;
        items.push({ aas_id: aasId, label, target });
      }
      const pathParts = config.target_path.split(".");
      const title = pathParts[pathParts.length - 1] || "Score";
      res.json({ items, title });
    } catch (err) {
      console.error("[Resilience] score-evaluate error:", err);
      res.status(500).json({ error: "EVALUATE_FAILED" });
    }
  });

  router.get("/api/indicators/dashboard-evaluate", auth.requireAuth, async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const offset = parseInt(req.query.offset) || 0;
      const sortBy = req.query.sort || "";
      const sortDir = req.query.sort_dir === "desc" ? -1 : 1;

      const row = await db.get(
        "SELECT indicator_dashboard_config FROM resilience_settings WHERE user_id = ?",
        [req.user.id]
      );
      const config = JSON.parse(row?.indicator_dashboard_config || "{}");
      if (!config.group_id || !Array.isArray(config.indicators) || !config.indicators.length) {
        return res.json({ items: [], total: 0 });
      }

      // Resolve group name
      const grp = await db.get("SELECT name FROM resilience_asset_groups WHERE group_id = ?", [config.group_id]);
      const groupName = grp?.name || config.group_id;

      // Get ALL group members (sort happens in-memory before pagination)
      const members = await db.all(
        "SELECT aas_id FROM resilience_asset_group_members WHERE group_id = ? ORDER BY aas_id ASC",
        [config.group_id]
      );

      // Configured columns
      const columns = Array.isArray(config.columns) ? config.columns : [];
      const columnPaths = columns.map(c => typeof c === "string" ? c : c.path);

      // Load indicator definitions (with groups + conditions)
      const indicatorDefs = new Map();
      const indicatorNames = [];
      for (const ic of config.indicators) {
        const ind = await db.get(
          "SELECT * FROM resilience_indicators WHERE indicator_id = ? AND user_id = ?",
          [ic.indicator_id, req.user.id]
        );
        if (!ind) continue;
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
        indicatorDefs.set(ic.indicator_id, { ...ind, groups, condMappings: ic.condition_mappings || {} });
        indicatorNames.push({ indicator_id: ic.indicator_id, name: ind.name });
      }

      // Evaluate each AAS item
      const allItems = [];
      for (const m of members) {
        const imp = await db.get(
          "SELECT submodels_data FROM resilience_aas_imports WHERE aas_id = ? AND user_id = ?",
          [m.aas_id, req.user.id]
        );
        if (!imp?.submodels_data) continue;
        let submodels;
        try { submodels = JSON.parse(imp.submodels_data); } catch { continue; }

        const results = {};
        for (const [indId, def] of indicatorDefs) {
          let matched = null;
          for (let gi = 0; gi < def.groups.length; gi++) {
            const g = def.groups[gi];
            let allMatch = g.conditions.length > 0;
            for (let ci = 0; ci < g.conditions.length; ci++) {
              const c = g.conditions[ci];
              const condKey = `g${gi}_c${ci}`;
              const path = def.condMappings[condKey] || "";
              const rawVal = path ? extractFirstValue(submodels, path) : "";
              if (!evalCondition(c.input, c.operator, c.value, rawVal)) {
                allMatch = false;
                break;
              }
            }
            if (allMatch) {
              matched = { label: g.output_label, color: g.output_color, score: g.output_score };
              break;
            }
          }
          results[indId] = matched || {
            label: def.default_label, color: def.default_color, score: def.default_score
          };
        }

        // Extract column values
        let columns_data = {};
        if (columns.length) {
          for (const col of columns) {
            const p = typeof col === "string" ? col : col.path;
            columns_data[p] = extractFirstValue(submodels, p);
          }
        }

        allItems.push({ aas_id: m.aas_id, results, columns_data });
      }

      // Sorting
      if (sortBy) {
        const indIds = indicatorNames.map(n => n.indicator_id);
        allItems.sort((a, b) => {
          let ra, rb;
          if (sortBy === "_aas") {
            ra = a.aas_id; rb = b.aas_id;
          } else if (indIds.includes(sortBy)) {
            // Sort by indicator score
            ra = a.results[sortBy]?.score ?? 0;
            rb = b.results[sortBy]?.score ?? 0;
            const na = Number(ra), nb = Number(rb);
            if (!isNaN(na) && !isNaN(nb)) return (na - nb) * sortDir;
          } else if (columnPaths.includes(sortBy)) {
            ra = (a.columns_data && a.columns_data[sortBy]) || "";
            rb = (b.columns_data && b.columns_data[sortBy]) || "";
          } else {
            return 0;
          }
          if (ra === undefined) ra = "";
          if (rb === undefined) rb = "";
          const na = Number(ra), nb = Number(rb);
          if (String(ra) !== "" && String(rb) !== "" && !isNaN(na) && !isNaN(nb)) return (na - nb) * sortDir;
          return String(ra).toLowerCase() < String(rb).toLowerCase() ? -sortDir : String(ra).toLowerCase() > String(rb).toLowerCase() ? sortDir : 0;
        });
      }

      const total = allItems.length;
      const items = allItems.slice(offset, offset + limit);

      res.json({ group_name: groupName, indicator_names: indicatorNames, columns, items, total });
    } catch (err) {
      console.error("[Resilience] dashboard-evaluate error:", err);
      res.status(500).json({ error: "EVALUATE_FAILED" });
    }
  });

  // ── Indicator Detail for a single AAS item ──────────────────
  router.get("/api/indicators/dashboard-detail/:aasId", auth.requireAuth, async (req, res) => {
    try {
      const aasId = req.params.aasId;
      const row = await db.get(
        "SELECT indicator_dashboard_config FROM resilience_settings WHERE user_id = ?",
        [req.user.id]
      );
      const config = JSON.parse(row?.indicator_dashboard_config || "{}");
      if (!config.group_id || !Array.isArray(config.indicators) || !config.indicators.length) {
        return res.status(404).json({ error: "NOT_CONFIGURED" });
      }

      // Load AAS submodels
      const imp = await db.get(
        "SELECT submodels_data FROM resilience_aas_imports WHERE aas_id = ? AND user_id = ?",
        [aasId, req.user.id]
      );
      if (!imp?.submodels_data) return res.status(404).json({ error: "AAS_NOT_FOUND" });
      let submodels;
      try { submodels = JSON.parse(imp.submodels_data); } catch { return res.status(500).json({ error: "PARSE_ERROR" }); }

      // Extract column values
      const columns = Array.isArray(config.columns) ? config.columns : [];
      const columns_data = {};
      for (const col of columns) {
        const p = typeof col === "string" ? col : col.path;
        columns_data[p] = extractFirstValue(submodels, p);
      }

      // Evaluate each indicator
      const indicators = [];
      for (const ic of config.indicators) {
        const ind = await db.get(
          `SELECT i.*, c.name AS class_name
           FROM resilience_indicators i
           LEFT JOIN resilience_indicator_classes c ON c.class_id = i.class_id
           WHERE i.indicator_id = ? AND i.user_id = ?`,
          [ic.indicator_id, req.user.id]
        );
        if (!ind) continue;

        const groups = await db.all(
          "SELECT * FROM resilience_indicator_groups WHERE indicator_id = ? ORDER BY sort_order ASC",
          [ind.indicator_id]
        );
        const condMappings = ic.condition_mappings || {};
        let matched = null;

        for (let gi = 0; gi < groups.length; gi++) {
          const g = groups[gi];
          const conditions = await db.all(
            "SELECT * FROM resilience_indicator_conditions WHERE group_id = ? ORDER BY sort_order ASC",
            [g.group_id]
          );
          let allMatch = conditions.length > 0;
          for (let ci = 0; ci < conditions.length; ci++) {
            const c = conditions[ci];
            const condKey = `g${gi}_c${ci}`;
            const path = condMappings[condKey] || "";
            const rawVal = path ? extractFirstValue(submodels, path) : "";
            if (!evalCondition(c.input, c.operator, c.value, rawVal)) { allMatch = false; break; }
          }
          if (allMatch) { matched = { label: g.output_label, color: g.output_color, score: g.output_score }; break; }
        }

        const result = matched || { label: ind.default_label, color: ind.default_color, score: ind.default_score };

        indicators.push({
          indicator_id: ind.indicator_id,
          name: ind.name,
          class_name: ind.class_name || null,
          result
        });
      }

      res.json({ aas_id: aasId, columns_data, indicators });
    } catch (err) {
      console.error("[Resilience] dashboard-detail error:", err);
      res.status(500).json({ error: "DETAIL_FAILED" });
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

      const indicatorId = crypto.randomUUID();
      await db.run(
        `INSERT INTO resilience_indicators (indicator_id, user_id, name, class_id, default_label, default_color, default_score)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [indicatorId, req.user.id, name, b.class_id || null,
         (b.default_label || "").trim(),
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
            `INSERT INTO resilience_indicator_conditions (condition_id, group_id, indicator_id, user_id, sort_order, input, operator, value)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), groupId, indicatorId, req.user.id, ci, (c.input || "").trim(), op, String(c.value ?? "")]
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

      await db.run(
        `UPDATE resilience_indicators SET name = ?, class_id = ?,
         default_label = ?, default_color = ?, default_score = ? WHERE indicator_id = ?`,
        [name, b.class_id || null,
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
            `INSERT INTO resilience_indicator_conditions (condition_id, group_id, indicator_id, user_id, sort_order, input, operator, value)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), groupId, ind.indicator_id, req.user.id, ci, (c.input || "").trim(), op, String(c.value ?? "")]
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
      const { url, item_prefix } = req.body;
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
      const prefix = (item_prefix !== undefined ? item_prefix : source.item_prefix) || "";

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
                grp.group_id, grp.group_name,
                imp.imported_at, imp.geocoded_status, imp.company_status
         FROM resilience_aas_source_ids i
         JOIN resilience_aas_sources s ON s.source_id = i.source_id
         LEFT JOIN (
           SELECT m.aas_id, m.group_id, g.name AS group_name
           FROM resilience_asset_group_members m
           JOIN resilience_asset_groups g ON g.group_id = m.group_id AND g.user_id = ?
           GROUP BY m.aas_id
         ) grp ON grp.aas_id = i.aas_id
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

  // ── Geocoding: start background job ──────────────────────────
  router.post("/api/geocoding/run", auth.requireAuth, async (req, res) => {
    const userId = req.user.id;
    if (geocodingJobs[userId]?.running) return res.json({ ok: true, already: true });
    res.json({ ok: true });
    runGeocodingJob(userId);
  });

  // ── Geocoding: single-AAS geocode (uses already-imported data) ──
  router.post("/api/geocoding/run-single", auth.requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { aas_id, country_path, city_path } = req.body;
    if (!aas_id) return res.status(400).json({ error: "MISSING_AAS_ID" });
    if (!country_path || !city_path) return res.status(400).json({ error: "NO_GEOCODING_PATHS" });

    try {
      // 1. Bereits importierte Daten aus DB laden
      const imp = await db.get(
        "SELECT submodels_data FROM resilience_aas_imports WHERE aas_id = ? AND user_id = ?",
        [aas_id, userId]);
      if (!imp) return res.status(400).json({ error: "NOT_IMPORTED" });

      let submodels = JSON.parse(imp.submodels_data || "[]");

      // 2. City+Country extrahieren → Nominatim
      const countryRaw = extractFirstValue(submodels, country_path);
      const cityRaw = extractFirstValue(submodels, city_path);

      const mappingRows = await db.all(
        "SELECT iso_code, alpha3, numeric, aas_names, gdacs_names FROM resilience_country_mappings WHERE user_id = ?",
        [userId]
      );
      const isoCode = countryRaw ? matchCountryValue(countryRaw, mappingRows) : "";

      let geoResult = null;
      const queryTerm = cityRaw || countryRaw;
      if (queryTerm) {
        const baseUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(queryTerm)}`;
        const fetchOpts = { signal: AbortSignal.timeout(15000), headers: { "User-Agent": "KanbanResilienceApp/1.0", Accept: "application/json" } };
        try {
          let url = isoCode ? `${baseUrl}&countrycodes=${isoCode.toLowerCase()}` : baseUrl;
          let resp = await fetch(url, fetchOpts);
          if (resp.ok) { const r = await resp.json(); if (r.length > 0) geoResult = r[0]; }
          // Retry without countrycodes if filtered query returned nothing
          if (!geoResult && isoCode) {
            resp = await fetch(baseUrl, fetchOpts);
            if (resp.ok) { const r = await resp.json(); if (r.length > 0) geoResult = r[0]; }
          }
        } catch { /* timeout or network error */ }
      }

      // 3. Geocoding-Submodel injizieren + DB-Update
      submodels = submodels.filter(sm => sm.idShort !== "Geocoding");
      submodels.push(buildGeocodingSubmodel(cityRaw || countryRaw, isoCode, geoResult));
      const geocodedStatus = geoResult ? "ok" : "error";
      await db.run(
        "UPDATE resilience_aas_imports SET submodels_data = ?, geocoded_status = ? WHERE aas_id = ? AND user_id = ?",
        [JSON.stringify(submodels), geocodedStatus, aas_id, userId]
      );

      res.json({ ok: true, geocoded_status: geocodedStatus });
    } catch (err) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        return res.status(504).json({ error: "AAS_TIMEOUT" });
      }
      console.error("POST /api/geocoding/run-single error:", err);
      res.status(500).json({ error: "GEOCODING_FAILED" });
    }
  });

  // ── AAS: single import (without geocoding) ─────────────────
  router.post("/api/aas/import-single", auth.requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { aas_id } = req.body;
    if (!aas_id) return res.status(400).json({ error: "MISSING_AAS_ID" });

    try {
      // 1. AAS-Quelle finden
      const entry = await db.get(
        `SELECT i.aas_id, i.source_id, s.base_url
         FROM resilience_aas_source_ids i
         JOIN resilience_aas_sources s ON s.source_id = i.source_id
         WHERE i.aas_id = ? AND s.user_id = ?`, [aas_id, userId]);
      if (!entry) return res.status(404).json({ error: "AAS_NOT_FOUND" });

      // 2. Altes Import löschen
      await db.run("DELETE FROM resilience_aas_imports WHERE aas_id = ? AND user_id = ?", [aas_id, userId]);

      // 3. Shell + Submodels von AAS-Quelle fetchen
      const baseUrl = entry.base_url.replace(/\/+$/, "");
      const encoded = toBase64Url(entry.aas_id);
      const shellResp = await fetch(`${baseUrl}/shells/${encoded}`, {
        signal: AbortSignal.timeout(15000),
        headers: { Accept: "application/json" },
      });
      if (!shellResp.ok) return res.status(502).json({ error: "AAS_FETCH_FAILED" });
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

      // 4. Persistieren (ohne Geocoding — geocoded_status leer)
      const now = new Date().toISOString().replace("T", " ").slice(0, 19);
      await db.run(
        `INSERT INTO resilience_aas_imports (aas_id, user_id, source_id, shell_data, submodels_data, imported_at, geocoded_status)
         VALUES (?, ?, ?, ?, ?, ?, '')`,
        [entry.aas_id, userId, entry.source_id, JSON.stringify(shellData), JSON.stringify(submodels), now]
      );

      res.json({ ok: true, imported_at: now });
    } catch (err) {
      if (err.name === "TimeoutError" || err.name === "AbortError")
        return res.status(504).json({ error: "AAS_TIMEOUT" });
      console.error("POST /api/aas/import-single error:", err);
      res.status(500).json({ error: "IMPORT_FAILED" });
    }
  });

  // ── Geocoding: poll status ──────────────────────────────────
  router.get("/api/geocoding/status", auth.requireAuth, (req, res) => {
    const job = geocodingJobs[req.user.id];
    if (!job) return res.json({ running: false });
    res.json({ running: job.running, total: job.total, done: job.done, errors: job.errors });
  });

  // ── Company Process: batch run ───────────────────────────────
  router.post("/api/company-process/run", auth.requireAuth, async (req, res) => {
    const userId = req.user.id;
    if (companyProcessJobs[userId]?.running) return res.json({ ok: true, already: true });
    const settings = await db.get(
      "SELECT company_group_id, company_name_path FROM resilience_settings WHERE user_id = ?",
      [userId]
    );
    if (!settings?.company_group_id || !settings?.company_name_path) {
      return res.status(400).json({ error: "NO_COMPANY_SETTINGS" });
    }
    res.json({ ok: true });
    runCompanyProcessJob(userId, settings.company_group_id, settings.company_name_path);
  });

  // ── Company Process: single AAS ─────────────────────────────
  router.post("/api/company-process/run-single", auth.requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { aas_id, company_name_path } = req.body;
    if (!aas_id) return res.status(400).json({ error: "MISSING_AAS_ID" });
    if (!company_name_path) return res.status(400).json({ error: "MISSING_PATH" });
    try {
      const imp = await db.get(
        "SELECT submodels_data FROM resilience_aas_imports WHERE aas_id = ? AND user_id = ?",
        [aas_id, userId]
      );
      if (!imp?.submodels_data) return res.status(404).json({ error: "NOT_IMPORTED" });

      let submodels = JSON.parse(imp.submodels_data);
      const companyName = extractFirstValue(submodels, company_name_path);
      if (!companyName) return res.json({ status: "error", reason: "EMPTY_VALUE" });

      const aiSettings = await db.get(
        "SELECT provider, model, api_key FROM aas_chat_settings WHERE user_id = ?",
        [userId]
      );
      const aliasMap = await generateCompanyAliases([companyName], aiSettings);
      const alias = aliasMap.get(companyName) || "";

      submodels = submodels.filter(sm => sm.idShort !== "Company");
      submodels.push(buildCompanySubmodel(companyName, alias));
      await db.run(
        "UPDATE resilience_aas_imports SET submodels_data = ?, company_status = ? WHERE aas_id = ? AND user_id = ?",
        [JSON.stringify(submodels), "ok", aas_id, userId]
      );
      res.json({ status: "ok", company_name: companyName, alias });
    } catch (err) {
      console.error("POST /api/company-process/run-single error:", err);
      res.status(500).json({ error: "PROCESS_FAILED" });
    }
  });

  // ── Company Process: poll status ────────────────────────────
  router.get("/api/company-process/status", auth.requireAuth, (req, res) => {
    const job = companyProcessJobs[req.user.id];
    if (!job) return res.json({ running: false });
    res.json({ running: job.running, total: job.total, done: job.done, errors: job.errors, phase: job.phase, batchDone: job.batchDone, batchTotal: job.batchTotal, aliasesSoFar: job.aliasesSoFar || 0 });
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

  // ── Delete ALL user data (factory reset) ─────────────────────────
  router.post("/api/delete-all-data", auth.requireAuth, async (req, res) => {
    try {
      const uid = req.user.id;
      // Children first (FK cascades handle some, but be explicit)
      await db.run("DELETE FROM resilience_gdacs_aas_matches WHERE user_id = ?", [uid]);
      await db.run("DELETE FROM resilience_gdacs_aas_map WHERE user_id = ?", [uid]);
      await db.run("DELETE FROM resilience_gdacs_polygons WHERE user_id = ?", [uid]);
      await db.run("DELETE FROM resilience_gdacs_alerts WHERE user_id = ?", [uid]);
      await db.run("DELETE FROM resilience_gdacs_countries WHERE user_id = ?", [uid]);
      await db.run("DELETE FROM resilience_indicator_conditions WHERE indicator_id IN (SELECT indicator_id FROM resilience_indicators WHERE user_id = ?)", [uid]);
      await db.run("DELETE FROM resilience_indicator_groups WHERE indicator_id IN (SELECT indicator_id FROM resilience_indicators WHERE user_id = ?)", [uid]);
      await db.run("DELETE FROM resilience_indicators WHERE user_id = ?", [uid]);
      await db.run("DELETE FROM resilience_indicator_classes WHERE user_id = ?", [uid]);
      await db.run("DELETE FROM resilience_feed_items WHERE user_id = ?", [uid]);
      await db.run("DELETE FROM resilience_feeds WHERE user_id = ?", [uid]);
      await db.run("DELETE FROM resilience_aas_imports WHERE user_id = ?", [uid]);
      await db.run("DELETE FROM resilience_aas_source_ids WHERE source_id IN (SELECT source_id FROM resilience_aas_sources WHERE user_id = ?)", [uid]);
      await db.run("DELETE FROM resilience_aas_sources WHERE user_id = ?", [uid]);
      await db.run("DELETE FROM resilience_asset_group_members WHERE group_id IN (SELECT group_id FROM resilience_asset_groups WHERE user_id = ?)", [uid]);
      await db.run("DELETE FROM resilience_asset_groups WHERE user_id = ?", [uid]);
      await db.run("DELETE FROM resilience_country_mappings WHERE user_id = ?", [uid]);
      await db.run("DELETE FROM resilience_settings WHERE user_id = ?", [uid]);
      res.json({ ok: true });
    } catch (err) {
      console.error("POST /api/delete-all-data error:", err);
      res.status(500).json({ error: "DELETE_ALL_FAILED" });
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
            `INSERT INTO resilience_gdacs_alerts
             (user_id, country_id, eventid, eventtype, episodeid, name, country, alertlevel, alertscore, severity, fromdate, todate, url, centroid_lat, centroid_lon, affected_countries)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(user_id, eventid) DO UPDATE SET
               alertlevel=excluded.alertlevel, alertscore=excluded.alertscore,
               severity=excluded.severity, todate=excluded.todate,
               centroid_lat=excluded.centroid_lat, centroid_lon=excluded.centroid_lon,
               episodeid=excluded.episodeid, affected_countries=excluded.affected_countries`,
            [userId, c.country_id, ev.eventid, ev.eventtype, ev.episodeid, ev.name, ev.country, ev.alertlevel, ev.alertscore, ev.severity, ev.fromdate, ev.todate, ev.url, ev.centroid_lat, ev.centroid_lon, ev.affected_countries]
          );
        } catch { /* skip errors */ }
      }
    } catch { /* skip country on error */ }
  }

  // Fire polygon fetch as background task (matching is computed on-the-fly in dashboard)
  fetchAlertPolygons(userId).catch(() => {});
}

// ---------------------------------------------------------------------------
// Background: fetch polygon geometries for alerts (async secondary pass)
// ---------------------------------------------------------------------------
async function fetchAlertPolygons(userId) {
  const alerts = await db.all(
    `SELECT alert_id, eventid, eventtype, episodeid
     FROM resilience_gdacs_alerts
     WHERE user_id = ? AND polygon_fetched = 0 AND episodeid != ''`,
    [userId]
  );
  for (const a of alerts) {
    try {
      const url = `https://www.gdacs.org/gdacsapi/api/polygons/getgeometry?eventtype=${a.eventtype}&eventid=${a.eventid}&episodeid=${a.episodeid}`;
      const resp = await fetch(url, {
        signal: AbortSignal.timeout(20000),
        headers: { Accept: "application/json" },
      });
      if (resp.ok) {
        const geoJson = await resp.json();
        const polyFeatures = (geoJson.features || []).filter(f =>
          f.geometry?.type === "Polygon" || f.geometry?.type === "MultiPolygon"
        );
        const geometries = polyFeatures.map(f => ({
          type: f.geometry.type,
          coordinates: f.geometry.coordinates,
          label: f.properties?.polygonlabel || "",
          class: f.properties?.Class || "",
        }));
        await db.run(
          `INSERT OR REPLACE INTO resilience_gdacs_polygons (eventid, user_id, geometry, fetched_at)
           VALUES (?, ?, ?, datetime('now'))`,
          [a.eventid, userId, JSON.stringify(geometries)]
        );
      }
      await db.run("UPDATE resilience_gdacs_alerts SET polygon_fetched = 1 WHERE alert_id = ?", [a.alert_id]);
      await new Promise(resolve => setTimeout(resolve, 1100));
    } catch {
      await db.run("UPDATE resilience_gdacs_alerts SET polygon_fetched = 1 WHERE alert_id = ?", [a.alert_id]).catch(() => {});
    }
  }
}

// ---------------------------------------------------------------------------
// On-the-fly: build AAS entries + alert matches from source data
// ---------------------------------------------------------------------------
async function buildAasAlertData(userId) {
  const settings = await db.get(
    `SELECT gdacs_aas_group_id, gdacs_aas_path, gdacs_aas_columns,
            geocoding_city_path, matching_lat_path, matching_lon_path,
            gdacs_distance_thresholds
     FROM resilience_settings WHERE user_id = ?`, [userId]);
  if (!settings?.gdacs_aas_group_id || !settings?.gdacs_aas_path)
    return { aasEntries: [], matches: [], columns: [] };

  const columns = JSON.parse(settings.gdacs_aas_columns || "[]");
  const columnPaths = columns.map(c => typeof c === "string" ? c : c.path);
  const thresholds = JSON.parse(settings.gdacs_distance_thresholds || '{"EQ":300,"TC":500,"FL":200,"VO":100,"WF":150,"DR":1000}');
  const cityPath = settings.geocoding_city_path || "";
  const latPath = settings.matching_lat_path || "";
  const lonPath = settings.matching_lon_path || "";

  const members = await db.all(
    "SELECT aas_id FROM resilience_asset_group_members WHERE group_id = ?",
    [settings.gdacs_aas_group_id]);
  if (!members.length) return { aasEntries: [], matches: [], columns };

  const mappingRows = await db.all(
    "SELECT iso_code, alpha3, numeric, aas_names, gdacs_names FROM resilience_country_mappings WHERE user_id = ?",
    [userId]);

  // Extract AAS data from imports
  const aasEntries = [];
  for (const m of members) {
    const imp = await db.get(
      "SELECT submodels_data FROM resilience_aas_imports WHERE aas_id = ? AND user_id = ?",
      [m.aas_id, userId]);
    if (!imp?.submodels_data) continue;

    let countryValue = "", isoCode = "", cityValue = "";
    let directLat = null, directLon = null;
    const colData = {};
    let submodels;
    try {
      submodels = JSON.parse(imp.submodels_data);
      countryValue = extractFirstValue(submodels, settings.gdacs_aas_path);
      if (countryValue) isoCode = matchCountryValue(countryValue, mappingRows);
      if (cityPath) cityValue = extractFirstValue(submodels, cityPath);
      if (latPath) { const v = parseFloat(extractFirstValue(submodels, latPath)); if (!isNaN(v)) directLat = v; }
      if (lonPath) { const v = parseFloat(extractFirstValue(submodels, lonPath)); if (!isNaN(v)) directLon = v; }
      for (const cp of columnPaths) colData[cp] = extractFirstValue(submodels, cp);
    } catch { continue; }

    // Coordinates: Prio 1 = direct paths, Prio 2 = Geocoding submodel
    let lat = directLat, lon = directLon;
    if (lat === null) {
      const geo = submodels.find(sm => sm.idShort === "Geocoding");
      if (geo) {
        const els = geo.submodelElements || [];
        const latEl = els.find(e => e.idShort === "Latitude");
        const lonEl = els.find(e => e.idShort === "Longitude");
        if (latEl?.value) lat = parseFloat(latEl.value);
        if (lonEl?.value) lon = parseFloat(lonEl.value);
        if (isNaN(lat) || isNaN(lon)) { lat = null; lon = null; }
      }
    }

    aasEntries.push({
      aas_id: m.aas_id, country_value: countryValue, iso_code: isoCode,
      city_value: cityValue, direct_lat: lat, direct_lon: lon,
      columns_data: colData, lat, lon
    });
  }

  // Load alerts + polygons
  const alerts = await db.all(
    `SELECT alert_id, eventid, eventtype, alertlevel, name, fromdate, url,
            centroid_lat, centroid_lon, country_id
     FROM resilience_gdacs_alerts WHERE user_id = ?`, [userId]);

  const polyRows = await db.all(
    "SELECT eventid, geometry FROM resilience_gdacs_polygons WHERE user_id = ?", [userId]);
  const polyMap = {};
  for (const pr of polyRows) {
    try { polyMap[pr.eventid] = JSON.parse(pr.geometry || "[]"); } catch { polyMap[pr.eventid] = []; }
  }

  // ISO → GDACS country_id mapping for Tier 3
  const gdacsCountries = await db.all(
    "SELECT country_id, name FROM resilience_gdacs_countries WHERE user_id = ?", [userId]);
  const isoToCountryIds = {};
  for (const aas of aasEntries) {
    if (!aas.iso_code || isoToCountryIds[aas.iso_code]) continue;
    const gdacsNames = (mappingRows.find(r => r.iso_code === aas.iso_code)?.gdacs_names || "")
      .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const ids = [];
    for (const gc of gdacsCountries) {
      if (gdacsNames.includes(gc.name.toLowerCase())) ids.push(gc.country_id);
    }
    isoToCountryIds[aas.iso_code] = ids;
  }

  // 3-Tier matching
  const matches = [];
  for (const aas of aasEntries) {
    for (const alert of alerts) {
      let matchTier = null, distKm = null;

      // Tier 1: Polygon
      if (aas.lat !== null && aas.lon !== null && polyMap[alert.eventid]?.length) {
        for (const geom of polyMap[alert.eventid]) {
          if (pointInGeoJsonGeometry(aas.lat, aas.lon, geom)) { matchTier = "polygon"; break; }
        }
      }
      // Tier 2: Distance
      if (!matchTier && aas.lat !== null && aas.lon !== null &&
          alert.centroid_lat != null && alert.centroid_lon != null) {
        const d = haversineKm(aas.lat, aas.lon, alert.centroid_lat, alert.centroid_lon);
        const threshold = thresholds[alert.eventtype] ?? 300;
        if (d <= threshold) { matchTier = "distance"; distKm = Math.round(d * 10) / 10; }
      }
      // Tier 3: Country
      if (!matchTier && aas.iso_code) {
        const countryIds = isoToCountryIds[aas.iso_code] || [];
        if (countryIds.includes(alert.country_id)) matchTier = "country";
      }

      if (matchTier) {
        matches.push({
          aas_id: aas.aas_id, alert_id: alert.alert_id,
          match_tier: matchTier, distance_km: distKm,
          eventtype: alert.eventtype, alertlevel: alert.alertlevel,
          name: alert.name, fromdate: alert.fromdate, url: alert.url,
          centroid_lat: alert.centroid_lat, centroid_lon: alert.centroid_lon
        });
      }
    }
  }

  return { aasEntries, matches, columns, totalMembers: members.length };
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
// Helper: match country value to ISO code
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

function evalCondition(inputType, operator, expected, actual) {
  if (actual === "" || actual === undefined || actual === null) return false;
  if (inputType === "number") {
    const a = parseFloat(actual), e = parseFloat(expected);
    if (isNaN(a) || isNaN(e)) return false;
    switch (operator) {
      case "==": return a === e;
      case "!=": return a !== e;
      case ">":  return a > e;
      case "<":  return a < e;
      case ">=": return a >= e;
      case "<=": return a <= e;
      default:   return false;
    }
  }
  if (inputType === "boolean") {
    const a = String(actual).toLowerCase() === "true";
    const e = String(expected).toLowerCase() === "true";
    return operator === "==" ? a === e : a !== e;
  }
  // text
  const a = String(actual), e = String(expected);
  return operator === "==" ? a === e : a !== e;
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

module.exports = { initResilienceTables, mountRoutes, refreshAllFeeds, cleanupExpiredItems, refreshAllGdacsAlerts, cleanupGdacsAlerts, scheduleImports };
