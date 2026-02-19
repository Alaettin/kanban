const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const db = require("../../shared/db");
const auth = require("../../shared/auth");

const UPLOADS_DIR = path.join(__dirname, "..", "..", "data", "dti-files");

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ID_PATTERN = /^[a-zA-Z0-9._]+$/;
const VALID_LANGS = ["en", "de"];
const ASSET_ID_PATTERN = /^[a-zA-Z0-9]+$/;

// ---------------------------------------------------------------------------
// Migration: old user_id-based schema → new connector_id-based schema
// ---------------------------------------------------------------------------

async function migrateToConnectors() {
  console.log("[DTI] Migrating to connector-based schema...");

  // dti_api_keys stores user_id as TEXT — reliable source of truth.
  // Data tables may store user_id as REAL (precision loss for large Google IDs).
  // We JOIN data tables with dti_api_keys using numeric coercion (+0) so both
  // sides compare as REAL inside SQLite, then take k.user_id (TEXT) as result.

  let apiKeys = [];
  try {
    apiKeys = await db.all("SELECT user_id, api_key FROM dti_api_keys");
  } catch {}

  if (apiKeys.length === 0) {
    const oldTables = ["dti_hierarchy_levels", "dti_model_datapoints", "dti_files", "dti_assets", "dti_asset_values", "dti_api_keys"];
    for (const t of oldTables) {
      try { await db.run(`DROP TABLE IF EXISTS ${t}`); } catch {}
    }
    console.log("[DTI] No data to migrate.");
    return;
  }

  // Create a connector for each user that had an API key
  const map = {}; // user_id (TEXT) → connector_id
  for (const { user_id, api_key } of apiKeys) {
    const cid = crypto.randomUUID();
    await db.run(
      "INSERT OR IGNORE INTO dti_connectors (connector_id, user_id, name, api_key) VALUES (?, ?, ?, ?)",
      [cid, user_id, "Default", api_key]
    );
    map[user_id] = cid;
  }

  // Helper: migrate a table by JOINing with dti_api_keys (+0 coercion)
  async function migrateTable(table, cols, createSql) {
    try {
      const selCols = cols.map((c) => `t.${c}`).join(", ");
      const rows = await db.all(
        `SELECT k.user_id, ${selCols} FROM ${table} t JOIN dti_api_keys k ON t.user_id + 0 = k.user_id + 0`
      );
      await db.run(`DROP TABLE ${table}`);
      await db.run(createSql);
      for (const r of rows) {
        const cid = map[r.user_id];
        if (!cid) continue;
        const vals = cols.map((c) => r[c]);
        const placeholders = cols.map(() => "?").join(", ");
        await db.run(`INSERT INTO ${table} VALUES (?, ${placeholders})`, [cid, ...vals]);
      }
    } catch (e) { console.error(`[DTI] ${table} migration:`, e.message); }
  }

  await migrateTable("dti_hierarchy_levels", ["level", "name"], `CREATE TABLE dti_hierarchy_levels (
    connector_id TEXT NOT NULL, level INTEGER NOT NULL, name TEXT NOT NULL,
    PRIMARY KEY (connector_id, level),
    FOREIGN KEY (connector_id) REFERENCES dti_connectors(connector_id) ON DELETE CASCADE
  )`);

  await migrateTable("dti_model_datapoints", ["dp_id", "name", "type", "sort_order"], `CREATE TABLE dti_model_datapoints (
    connector_id TEXT NOT NULL, dp_id TEXT NOT NULL, name TEXT NOT NULL DEFAULT '',
    type INTEGER NOT NULL DEFAULT 0, sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (connector_id, dp_id),
    FOREIGN KEY (connector_id) REFERENCES dti_connectors(connector_id) ON DELETE CASCADE
  )`);

  await migrateTable("dti_files", ["file_id", "lang", "original_name", "size", "mime_type", "created_at"], `CREATE TABLE dti_files (
    connector_id TEXT NOT NULL, file_id TEXT NOT NULL, lang TEXT NOT NULL DEFAULT 'en',
    original_name TEXT NOT NULL DEFAULT '', size INTEGER NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (connector_id, file_id, lang),
    FOREIGN KEY (connector_id) REFERENCES dti_connectors(connector_id) ON DELETE CASCADE
  )`);

  await migrateTable("dti_assets", ["asset_id"], `CREATE TABLE dti_assets (
    connector_id TEXT NOT NULL, asset_id TEXT NOT NULL,
    PRIMARY KEY (connector_id, asset_id),
    FOREIGN KEY (connector_id) REFERENCES dti_connectors(connector_id) ON DELETE CASCADE
  )`);

  await migrateTable("dti_asset_values", ["asset_id", "key", "lang", "value"], `CREATE TABLE dti_asset_values (
    connector_id TEXT NOT NULL, asset_id TEXT NOT NULL, key TEXT NOT NULL,
    lang TEXT NOT NULL DEFAULT 'en', value TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (connector_id, asset_id, key, lang),
    FOREIGN KEY (connector_id) REFERENCES dti_connectors(connector_id) ON DELETE CASCADE
  )`);

  // Move physical files into connector subdirectories
  for (const [userId, connectorId] of Object.entries(map)) {
    const userDir = path.join(UPLOADS_DIR, userId);
    if (fs.existsSync(userDir)) {
      const connDir = path.join(userDir, connectorId);
      fs.mkdirSync(connDir, { recursive: true });
      try {
        const entries = fs.readdirSync(userDir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile()) {
            fs.renameSync(path.join(userDir, entry.name), path.join(connDir, entry.name));
          }
        }
      } catch (e) { console.error("[DTI] file move error:", e.message); }
    }
  }

  try { await db.run("DROP TABLE IF EXISTS dti_api_keys"); } catch {}
  console.log("[DTI] Migration complete. Created", Object.keys(map).length, "connectors.");
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

async function initDtiTables() {
  await db.run(`
    CREATE TABLE IF NOT EXISTS dti_connectors (
      connector_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      api_key TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Check if old user_id-based tables exist
  let needsMigration = false;
  try {
    const info = await db.all("PRAGMA table_info(dti_hierarchy_levels)");
    if (info.length > 0 && info.some((c) => c.name === "user_id")) {
      needsMigration = true;
    }
  } catch {}
  if (!needsMigration) {
    try {
      const info = await db.all("PRAGMA table_info(dti_api_keys)");
      if (info.length > 0) needsMigration = true;
    } catch {}
  }
  if (needsMigration) {
    await migrateToConnectors();
  }

  // Create connector-scoped tables (idempotent)
  await db.run(`CREATE TABLE IF NOT EXISTS dti_hierarchy_levels (
    connector_id TEXT NOT NULL, level INTEGER NOT NULL, name TEXT NOT NULL,
    PRIMARY KEY (connector_id, level),
    FOREIGN KEY (connector_id) REFERENCES dti_connectors(connector_id) ON DELETE CASCADE
  )`);
  await db.run(`CREATE TABLE IF NOT EXISTS dti_model_datapoints (
    connector_id TEXT NOT NULL, dp_id TEXT NOT NULL, name TEXT NOT NULL DEFAULT '',
    type INTEGER NOT NULL DEFAULT 0, sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (connector_id, dp_id),
    FOREIGN KEY (connector_id) REFERENCES dti_connectors(connector_id) ON DELETE CASCADE
  )`);
  await db.run(`CREATE TABLE IF NOT EXISTS dti_files (
    connector_id TEXT NOT NULL, file_id TEXT NOT NULL, lang TEXT NOT NULL DEFAULT 'en',
    original_name TEXT NOT NULL DEFAULT '', size INTEGER NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (connector_id, file_id, lang),
    FOREIGN KEY (connector_id) REFERENCES dti_connectors(connector_id) ON DELETE CASCADE
  )`);
  await db.run(`CREATE TABLE IF NOT EXISTS dti_assets (
    connector_id TEXT NOT NULL, asset_id TEXT NOT NULL,
    PRIMARY KEY (connector_id, asset_id),
    FOREIGN KEY (connector_id) REFERENCES dti_connectors(connector_id) ON DELETE CASCADE
  )`);
  await db.run(`CREATE TABLE IF NOT EXISTS dti_asset_values (
    connector_id TEXT NOT NULL, asset_id TEXT NOT NULL, key TEXT NOT NULL,
    lang TEXT NOT NULL DEFAULT 'en', value TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (connector_id, asset_id, key, lang),
    FOREIGN KEY (connector_id) REFERENCES dti_connectors(connector_id) ON DELETE CASCADE
  )`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log("[DTI] Tables ready.");
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

function mountRoutes(router) {

  // --- Middleware: resolve connector + ownership check ---

  async function resolveConnector(req, res, next) {
    const connectorId = req.params.connectorId;
    if (!connectorId) return res.status(400).json({ error: "Missing connector ID" });
    try {
      const row = await db.get(
        "SELECT connector_id, user_id, name, api_key, created_at FROM dti_connectors WHERE connector_id = ? AND user_id = ?",
        [connectorId, req.user.id]
      );
      if (!row) return res.status(404).json({ error: "Connector not found" });
      req.connector = row;
      next();
    } catch {
      res.status(500).json({ error: "Failed to resolve connector" });
    }
  }

  // ======================= CONNECTOR CRUD =======================

  router.get("/api/connectors", auth.requireAuth, async (req, res) => {
    try {
      const rows = await db.all(
        "SELECT connector_id, name, api_key, created_at FROM dti_connectors WHERE user_id = ? ORDER BY created_at",
        [req.user.id]
      );
      res.json({ connectors: rows });
    } catch {
      res.status(500).json({ error: "Failed to load connectors" });
    }
  });

  router.post("/api/connectors", auth.requireAuth, async (req, res) => {
    const { name } = req.body || {};
    if (!name || typeof name !== "string" || name.trim().length === 0 || name.trim().length > 100) {
      return res.status(400).json({ error: "Invalid connector name" });
    }
    try {
      const connectorId = crypto.randomUUID();
      const apiKey = crypto.randomUUID();
      await db.run(
        "INSERT INTO dti_connectors (connector_id, user_id, name, api_key) VALUES (?, ?, ?, ?)",
        [connectorId, req.user.id, name.trim(), apiKey]
      );
      res.json({ connector_id: connectorId, name: name.trim(), api_key: apiKey, created_at: new Date().toISOString() });
    } catch {
      res.status(500).json({ error: "Failed to create connector" });
    }
  });

  router.put("/api/connectors/:connectorId", auth.requireAuth, resolveConnector, async (req, res) => {
    const { name } = req.body || {};
    if (!name || typeof name !== "string" || name.trim().length === 0 || name.trim().length > 100) {
      return res.status(400).json({ error: "Invalid connector name" });
    }
    try {
      await db.run("UPDATE dti_connectors SET name = ? WHERE connector_id = ?",
        [name.trim(), req.connector.connector_id]);
      res.json({ ok: true, name: name.trim() });
    } catch {
      res.status(500).json({ error: "Failed to update connector" });
    }
  });

  router.delete("/api/connectors/:connectorId", auth.requireAuth, resolveConnector, async (req, res) => {
    try {
      const connDir = path.join(UPLOADS_DIR, req.user.id, req.connector.connector_id);
      if (fs.existsSync(connDir)) {
        fs.rmSync(connDir, { recursive: true, force: true });
      }
      await db.run("DELETE FROM dti_connectors WHERE connector_id = ?", [req.connector.connector_id]);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "Failed to delete connector" });
    }
  });

  // ======================= CONNECTOR SETTINGS (API KEY) =======================

  router.get("/api/connectors/:connectorId/key", auth.requireAuth, resolveConnector, async (req, res) => {
    res.json({ apiKey: req.connector.api_key });
  });

  router.put("/api/connectors/:connectorId/key", auth.requireAuth, resolveConnector, async (req, res) => {
    const { apiKey } = req.body || {};
    if (!apiKey || typeof apiKey !== "string" || !UUID_PATTERN.test(apiKey)) {
      return res.status(400).json({ error: "Invalid API key format" });
    }
    try {
      await db.run("UPDATE dti_connectors SET api_key = ? WHERE connector_id = ?",
        [apiKey, req.connector.connector_id]);
      res.json({ apiKey });
    } catch (err) {
      if (err.message && err.message.includes("UNIQUE")) {
        return res.status(409).json({ error: "API key already in use" });
      }
      res.status(500).json({ error: "Failed to save API key" });
    }
  });

  // ======================= HIERARCHY (INTERNAL) =======================

  router.get("/api/connectors/:connectorId/hierarchy/levels/internal", auth.requireAuth, resolveConnector, async (req, res) => {
    try {
      const rows = await db.all(
        "SELECT level, name FROM dti_hierarchy_levels WHERE connector_id = ? ORDER BY level",
        [req.connector.connector_id]
      );
      res.json(rows);
    } catch {
      res.status(500).json({ error: "Failed to load hierarchy levels" });
    }
  });

  router.put("/api/connectors/:connectorId/hierarchy/levels", auth.requireAuth, resolveConnector, async (req, res) => {
    const cid = req.connector.connector_id;
    const levels = req.body;
    if (!Array.isArray(levels) || levels.length === 0) {
      return res.status(400).json({ error: "At least one level is required" });
    }
    const namePattern = /^[A-Za-z0-9_-]+$/;
    for (let i = 0; i < levels.length; i++) {
      const item = levels[i];
      if (!item.name || typeof item.name !== "string") {
        return res.status(400).json({ error: `Level ${i + 1}: name is required` });
      }
      if (!namePattern.test(item.name)) {
        return res.status(400).json({ error: `Level ${i + 1}: invalid characters` });
      }
      if (item.name.length > 60) {
        return res.status(400).json({ error: `Level ${i + 1}: name too long` });
      }
    }
    try {
      await db.run("DELETE FROM dti_hierarchy_levels WHERE connector_id = ?", [cid]);
      for (let i = 0; i < levels.length; i++) {
        await db.run(
          "INSERT INTO dti_hierarchy_levels (connector_id, level, name) VALUES (?, ?, ?)",
          [cid, i + 1, levels[i].name.trim()]
        );
      }
      const validKeys = levels.map((l) => l.name.trim());
      const dpIds = await db.all("SELECT dp_id FROM dti_model_datapoints WHERE connector_id = ?", [cid]);
      const keepKeys = [...validKeys, ...dpIds.map((r) => r.dp_id)];
      if (keepKeys.length > 0) {
        const ph = keepKeys.map(() => "?").join(",");
        await db.run(`DELETE FROM dti_asset_values WHERE connector_id = ? AND key NOT IN (${ph})`, [cid, ...keepKeys]);
      }
      const rows = await db.all(
        "SELECT level, name FROM dti_hierarchy_levels WHERE connector_id = ? ORDER BY level", [cid]
      );
      res.json(rows);
    } catch {
      res.status(500).json({ error: "Failed to save hierarchy levels" });
    }
  });

  // ======================= MODEL (INTERNAL) =======================

  router.get("/api/connectors/:connectorId/model/internal", auth.requireAuth, resolveConnector, async (req, res) => {
    try {
      const rows = await db.all(
        "SELECT dp_id AS id, name, type FROM dti_model_datapoints WHERE connector_id = ? ORDER BY sort_order",
        [req.connector.connector_id]
      );
      res.json(rows);
    } catch {
      res.status(500).json({ error: "Failed to load model" });
    }
  });

  router.put("/api/connectors/:connectorId/model", auth.requireAuth, resolveConnector, async (req, res) => {
    const cid = req.connector.connector_id;
    const items = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Body must be an array" });
    }
    const seenIds = new Set();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.id || typeof item.id !== "string") {
        return res.status(400).json({ error: `Row ${i + 1}: id is required` });
      }
      if (!ID_PATTERN.test(item.id)) {
        return res.status(400).json({ error: `Row ${i + 1}: id contains invalid characters` });
      }
      if (item.id.length > 120) {
        return res.status(400).json({ error: `Row ${i + 1}: id too long` });
      }
      const lowerId = item.id.toLowerCase();
      if (seenIds.has(lowerId)) {
        return res.status(400).json({ error: `Duplicate id: ${item.id}` });
      }
      seenIds.add(lowerId);
      if (item.type !== 0 && item.type !== 1) {
        return res.status(400).json({ error: `Row ${i + 1}: type must be 0 or 1` });
      }
    }
    try {
      await db.run("DELETE FROM dti_model_datapoints WHERE connector_id = ?", [cid]);
      for (let i = 0; i < items.length; i++) {
        await db.run(
          "INSERT INTO dti_model_datapoints (connector_id, dp_id, name, type, sort_order) VALUES (?, ?, ?, ?, ?)",
          [cid, items[i].id, (items[i].name || "").trim(), items[i].type, i]
        );
      }
      const dpKeys = items.map((it) => it.id);
      const hierRows = await db.all("SELECT name FROM dti_hierarchy_levels WHERE connector_id = ?", [cid]);
      const keepKeys = [...dpKeys, ...hierRows.map((r) => r.name)];
      if (keepKeys.length > 0) {
        const ph = keepKeys.map(() => "?").join(",");
        await db.run(`DELETE FROM dti_asset_values WHERE connector_id = ? AND key NOT IN (${ph})`, [cid, ...keepKeys]);
      }
      const rows = await db.all(
        "SELECT dp_id AS id, name, type FROM dti_model_datapoints WHERE connector_id = ? ORDER BY sort_order", [cid]
      );
      res.json(rows);
    } catch {
      res.status(500).json({ error: "Failed to save model" });
    }
  });

  // ======================= FILES (INTERNAL) =======================

  const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        const connDir = path.join(UPLOADS_DIR, req.user.id, req.connector.connector_id);
        fs.mkdirSync(connDir, { recursive: true });
        cb(null, connDir);
      },
      filename(req, file, cb) {
        const fileId = req.body.file_id || "";
        const lang = req.body.lang || "en";
        const ext = path.extname(file.originalname);
        cb(null, fileId + "_" + lang + ext);
      },
    }),
    limits: { fileSize: 50 * 1024 * 1024 },
  });

  router.get("/api/connectors/:connectorId/files/internal", auth.requireAuth, resolveConnector, async (req, res) => {
    try {
      const rows = await db.all(
        "SELECT file_id, lang, original_name, size, mime_type, created_at FROM dti_files WHERE connector_id = ? ORDER BY file_id, lang",
        [req.connector.connector_id]
      );
      res.json(rows);
    } catch {
      res.status(500).json({ error: "Failed to load files" });
    }
  });

  router.post("/api/connectors/:connectorId/files/upload", auth.requireAuth, resolveConnector, upload.single("file"), async (req, res) => {
    const cid = req.connector.connector_id;
    const fileId = (req.body.file_id || "").trim();
    const lang = (req.body.lang || "en").trim().toLowerCase();
    if (!fileId || !ID_PATTERN.test(fileId)) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: "Invalid file ID" });
    }
    if (fileId.length > 120) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: "File ID too long" });
    }
    if (!VALID_LANGS.includes(lang)) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: "Invalid lang (en or de)" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    try {
      const existing = await db.get(
        "SELECT file_id FROM dti_files WHERE connector_id = ? AND LOWER(file_id) = LOWER(?) AND file_id != ?",
        [cid, fileId, fileId]
      );
      if (existing) {
        fs.unlink(req.file.path, () => {});
        return res.status(409).json({ error: `ID already in use: ${existing.file_id}` });
      }
      const existingLang = await db.get(
        "SELECT original_name FROM dti_files WHERE connector_id = ? AND file_id = ? AND lang = ?",
        [cid, fileId, lang]
      );
      if (existingLang) {
        const oldExt = path.extname(existingLang.original_name);
        const oldPath = path.join(UPLOADS_DIR, req.user.id, cid, fileId + "_" + lang + oldExt);
        fs.unlink(oldPath, () => {});
        await db.run("DELETE FROM dti_files WHERE connector_id = ? AND file_id = ? AND lang = ?", [cid, fileId, lang]);
      }
      await db.run(
        "INSERT INTO dti_files (connector_id, file_id, lang, original_name, size, mime_type) VALUES (?, ?, ?, ?, ?, ?)",
        [cid, fileId, lang, req.file.originalname, req.file.size, req.file.mimetype || ""]
      );
      res.json({
        file_id: fileId, lang,
        original_name: req.file.originalname,
        size: req.file.size,
        mime_type: req.file.mimetype || "",
      });
    } catch {
      fs.unlink(req.file.path, () => {});
      res.status(500).json({ error: "Failed to save file" });
    }
  });

  router.get("/api/connectors/:connectorId/files/view/:fileId/:lang", auth.requireAuth, resolveConnector, async (req, res) => {
    const { fileId, lang } = req.params;
    const cid = req.connector.connector_id;
    if (!fileId || !ID_PATTERN.test(fileId) || !VALID_LANGS.includes(lang)) {
      return res.status(400).json({ error: "Invalid parameters" });
    }
    try {
      const row = await db.get(
        "SELECT original_name, mime_type FROM dti_files WHERE connector_id = ? AND file_id = ? AND lang = ?",
        [cid, fileId, lang]
      );
      if (!row) return res.status(404).json({ error: "File not found" });
      const ext = path.extname(row.original_name);
      const filePath = path.join(UPLOADS_DIR, req.user.id, cid, fileId + "_" + lang + ext);
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found on disk" });
      res.setHeader("Content-Type", row.mime_type || "application/octet-stream");
      res.setHeader("Content-Disposition", "inline");
      fs.createReadStream(filePath).pipe(res);
    } catch {
      res.status(500).json({ error: "Failed to serve file" });
    }
  });

  router.delete("/api/connectors/:connectorId/files/:fileId", auth.requireAuth, resolveConnector, async (req, res) => {
    const cid = req.connector.connector_id;
    const fileId = req.params.fileId;
    if (!fileId || !ID_PATTERN.test(fileId)) {
      return res.status(400).json({ error: "Invalid file ID" });
    }
    try {
      const rows = await db.all(
        "SELECT file_id, lang, original_name FROM dti_files WHERE connector_id = ? AND file_id = ?",
        [cid, fileId]
      );
      if (rows.length === 0) return res.status(404).json({ error: "File not found" });
      for (const row of rows) {
        const ext = path.extname(row.original_name);
        const filePath = path.join(UPLOADS_DIR, req.user.id, cid, row.file_id + "_" + row.lang + ext);
        fs.unlink(filePath, () => {});
      }
      await db.run("DELETE FROM dti_files WHERE connector_id = ? AND file_id = ?", [cid, fileId]);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  // ======================= ASSETS (INTERNAL) =======================

  router.get("/api/connectors/:connectorId/assets/internal", auth.requireAuth, resolveConnector, async (req, res) => {
    try {
      const rows = await db.all(
        "SELECT asset_id FROM dti_assets WHERE connector_id = ? ORDER BY asset_id",
        [req.connector.connector_id]
      );
      res.json(rows);
    } catch {
      res.status(500).json({ error: "Failed to load assets" });
    }
  });

  router.post("/api/connectors/:connectorId/assets", auth.requireAuth, resolveConnector, async (req, res) => {
    const cid = req.connector.connector_id;
    const { asset_id } = req.body || {};
    if (!asset_id || typeof asset_id !== "string" || !ASSET_ID_PATTERN.test(asset_id)) {
      return res.status(400).json({ error: "Invalid asset ID" });
    }
    if (asset_id.length > 120) {
      return res.status(400).json({ error: "Asset ID too long" });
    }
    try {
      const existing = await db.get(
        "SELECT asset_id FROM dti_assets WHERE connector_id = ? AND LOWER(asset_id) = LOWER(?)",
        [cid, asset_id]
      );
      if (existing) return res.status(409).json({ error: `ID already in use: ${existing.asset_id}` });
      await db.run("INSERT INTO dti_assets (connector_id, asset_id) VALUES (?, ?)", [cid, asset_id]);
      res.json({ asset_id });
    } catch {
      res.status(500).json({ error: "Failed to create asset" });
    }
  });

  router.put("/api/connectors/:connectorId/assets/:assetId/rename", auth.requireAuth, resolveConnector, async (req, res) => {
    const cid = req.connector.connector_id;
    const oldId = req.params.assetId;
    const { asset_id: newId } = req.body || {};
    if (!oldId || !ASSET_ID_PATTERN.test(oldId)) return res.status(400).json({ error: "Invalid asset ID" });
    if (!newId || typeof newId !== "string" || !ASSET_ID_PATTERN.test(newId)) return res.status(400).json({ error: "Invalid new asset ID" });
    if (newId.length > 120) return res.status(400).json({ error: "Asset ID too long" });
    try {
      const asset = await db.get("SELECT asset_id FROM dti_assets WHERE connector_id = ? AND asset_id = ?", [cid, oldId]);
      if (!asset) return res.status(404).json({ error: "Asset not found" });
      if (oldId !== newId) {
        const dup = await db.get(
          "SELECT asset_id FROM dti_assets WHERE connector_id = ? AND LOWER(asset_id) = LOWER(?) AND asset_id != ?",
          [cid, newId, oldId]
        );
        if (dup) return res.status(409).json({ error: `ID already in use: ${dup.asset_id}` });
        await db.run("UPDATE dti_assets SET asset_id = ? WHERE connector_id = ? AND asset_id = ?", [newId, cid, oldId]);
        await db.run("UPDATE dti_asset_values SET asset_id = ? WHERE connector_id = ? AND asset_id = ?", [newId, cid, oldId]);
      }
      res.json({ asset_id: newId });
    } catch {
      res.status(500).json({ error: "Failed to rename asset" });
    }
  });

  router.delete("/api/connectors/:connectorId/assets/:assetId", auth.requireAuth, resolveConnector, async (req, res) => {
    const cid = req.connector.connector_id;
    const assetId = req.params.assetId;
    if (!assetId || !ASSET_ID_PATTERN.test(assetId)) return res.status(400).json({ error: "Invalid asset ID" });
    try {
      const row = await db.get("SELECT asset_id FROM dti_assets WHERE connector_id = ? AND asset_id = ?", [cid, assetId]);
      if (!row) return res.status(404).json({ error: "Asset not found" });
      await db.run("DELETE FROM dti_asset_values WHERE connector_id = ? AND asset_id = ?", [cid, assetId]);
      await db.run("DELETE FROM dti_assets WHERE connector_id = ? AND asset_id = ?", [cid, assetId]);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "Failed to delete asset" });
    }
  });

  router.get("/api/connectors/:connectorId/assets/:assetId/values", auth.requireAuth, resolveConnector, async (req, res) => {
    const cid = req.connector.connector_id;
    const assetId = req.params.assetId;
    if (!assetId || !ASSET_ID_PATTERN.test(assetId)) return res.status(400).json({ error: "Invalid asset ID" });
    try {
      const asset = await db.get("SELECT asset_id FROM dti_assets WHERE connector_id = ? AND asset_id = ?", [cid, assetId]);
      if (!asset) return res.status(404).json({ error: "Asset not found" });
      const values = await db.all(
        "SELECT key, lang, value FROM dti_asset_values WHERE connector_id = ? AND asset_id = ?", [cid, assetId]
      );
      res.json({ asset_id: assetId, values });
    } catch {
      res.status(500).json({ error: "Failed to load asset values" });
    }
  });

  router.put("/api/connectors/:connectorId/assets/:assetId/values", auth.requireAuth, resolveConnector, async (req, res) => {
    const cid = req.connector.connector_id;
    const assetId = req.params.assetId;
    if (!assetId || !ASSET_ID_PATTERN.test(assetId)) return res.status(400).json({ error: "Invalid asset ID" });
    const values = req.body;
    if (!Array.isArray(values)) return res.status(400).json({ error: "Body must be an array" });
    try {
      const asset = await db.get("SELECT asset_id FROM dti_assets WHERE connector_id = ? AND asset_id = ?", [cid, assetId]);
      if (!asset) return res.status(404).json({ error: "Asset not found" });
      await db.run("DELETE FROM dti_asset_values WHERE connector_id = ? AND asset_id = ?", [cid, assetId]);
      for (const { key, lang, value } of values) {
        if (typeof key === "string" && key.length > 0) {
          const l = (lang || "en").toLowerCase();
          if (l !== "en" && l !== "de") continue;
          await db.run(
            "INSERT INTO dti_asset_values (connector_id, asset_id, key, lang, value) VALUES (?, ?, ?, ?, ?)",
            [cid, assetId, key, l, value || ""]
          );
        }
      }
      const saved = await db.all(
        "SELECT key, lang, value FROM dti_asset_values WHERE connector_id = ? AND asset_id = ?", [cid, assetId]
      );
      res.json({ asset_id: assetId, values: saved });
    } catch {
      res.status(500).json({ error: "Failed to save asset values" });
    }
  });

  // ======================= PUBLIC API =======================

  // Helper: resolve apiKey → { connector_id, user_id }
  async function resolveApiKey(apiKey) {
    if (!UUID_PATTERN.test(apiKey)) return null;
    return db.get("SELECT connector_id, user_id FROM dti_connectors WHERE api_key = ?", [apiKey]);
  }

  router.get("/api/v1/:apiKey/Product/ids", async (req, res) => {
    try {
      const conn = await resolveApiKey(req.params.apiKey);
      if (!conn) return res.status(401).json({ error: "Invalid API key" });
      const rows = await db.all(
        "SELECT asset_id FROM dti_assets WHERE connector_id = ? ORDER BY asset_id", [conn.connector_id]
      );
      res.json(rows.map((r) => r.asset_id));
    } catch {
      res.status(500).json({ error: "Failed to load product IDs" });
    }
  });

  router.get("/api/v1/:apiKey/Product/hierarchy/levels", async (req, res) => {
    try {
      const conn = await resolveApiKey(req.params.apiKey);
      if (!conn) return res.status(401).json({ error: "Invalid API key" });
      const rows = await db.all(
        "SELECT level, name FROM dti_hierarchy_levels WHERE connector_id = ? ORDER BY level", [conn.connector_id]
      );
      res.json(rows);
    } catch {
      res.status(500).json({ error: "Failed to load hierarchy levels" });
    }
  });

  router.get("/api/v1/:apiKey/Product/:itemId/hierarchy", async (req, res) => {
    try {
      const conn = await resolveApiKey(req.params.apiKey);
      if (!conn) return res.status(401).json({ error: "Invalid API key" });
      const cid = conn.connector_id;
      const itemId = req.params.itemId;
      const asset = await db.get("SELECT asset_id FROM dti_assets WHERE connector_id = ? AND asset_id = ?", [cid, itemId]);
      if (!asset) return res.status(404).json({ error: "Asset not found" });
      const levels = await db.all("SELECT level, name FROM dti_hierarchy_levels WHERE connector_id = ? ORDER BY level", [cid]);
      const values = await db.all(
        "SELECT key, value FROM dti_asset_values WHERE connector_id = ? AND asset_id = ? AND lang = 'en'", [cid, itemId]
      );
      const valMap = {};
      for (const v of values) valMap[v.key] = v.value;
      res.json(levels.map((l) => ({ level: l.level, name: valMap[l.name] || "" })));
    } catch {
      res.status(500).json({ error: "Failed to load hierarchy" });
    }
  });

  router.post("/api/v1/:apiKey/Product/:itemId/values", async (req, res) => {
    try {
      const conn = await resolveApiKey(req.params.apiKey);
      if (!conn) return res.status(401).json({ error: "Invalid API key" });
      const cid = conn.connector_id;
      const userId = conn.user_id;
      const itemId = req.params.itemId;
      const asset = await db.get("SELECT asset_id FROM dti_assets WHERE connector_id = ? AND asset_id = ?", [cid, itemId]);
      if (!asset) return res.status(404).json({ error: "Asset not found" });

      const model = await db.all("SELECT dp_id, type FROM dti_model_datapoints WHERE connector_id = ?", [cid]);
      const typeMap = {};
      const modelKeys = new Set();
      for (const m of model) { typeMap[m.dp_id] = m.type; modelKeys.add(m.dp_id); }

      function readFileBase64(fileId, lang, originalName) {
        const ext = path.extname(originalName);
        const filePath = path.join(UPLOADS_DIR, userId, cid, fileId + "_" + lang + ext);
        try { return fs.readFileSync(filePath).toString("base64"); } catch { return ""; }
      }

      const body = req.body || {};
      const withLang = body.propertiesWithLanguage || { languages: [], propertyIds: [] };
      const withoutLang = body.propertiesWithoutLanguage || { propertyIds: [] };
      const languages = Array.isArray(withLang.languages) ? withLang.languages : [];
      const withLangIds = Array.isArray(withLang.propertyIds) ? withLang.propertyIds : [];
      const withoutLangIds = Array.isArray(withoutLang.propertyIds) ? withoutLang.propertyIds : [];
      const allEmpty = languages.length === 0 && withLangIds.length === 0 && withoutLangIds.length === 0;

      const allRows = await db.all(
        "SELECT key, lang, value FROM dti_asset_values WHERE connector_id = ? AND asset_id = ?", [cid, itemId]
      );
      const byKey = {};
      for (const r of allRows) {
        if (!modelKeys.has(r.key)) continue;
        if (!byKey[r.key]) byKey[r.key] = [];
        byKey[r.key].push(r);
      }

      async function processKey(key, langFilter, result) {
        if (!byKey[key]) return;
        const isFile = typeMap[key] === 1;
        if (isFile) {
          const fileId = byKey[key][0].value;
          if (!fileId) return;
          let query = "SELECT lang, original_name, mime_type FROM dti_files WHERE connector_id = ? AND file_id = ?";
          const params = [cid, fileId];
          if (langFilter.length > 0) {
            query += " AND lang IN (" + langFilter.map(() => "?").join(",") + ")";
            params.push(...langFilter);
          }
          const files = await db.all(query, params);
          for (const f of files) {
            result.push({
              propertyId: key,
              value: readFileBase64(fileId, f.lang, f.original_name),
              mimeType: f.mime_type,
              filename: path.basename(f.original_name, path.extname(f.original_name)),
              valueLanguage: f.lang,
              needsResolve: false,
            });
          }
        } else {
          for (const r of byKey[key]) {
            if (langFilter.length > 0 && !langFilter.includes(r.lang)) continue;
            result.push({
              propertyId: key,
              value: r.value,
              valueLanguage: r.lang || "en",
              needsResolve: false,
            });
          }
        }
      }

      const result = [];
      if (allEmpty) {
        for (const key of Object.keys(byKey)) {
          await processKey(key, [], result);
        }
      } else {
        if (withLangIds.length > 0 || languages.length > 0) {
          const keys = withLangIds.length > 0 ? withLangIds : Object.keys(byKey);
          for (const key of keys) {
            await processKey(key, languages, result);
          }
        }
        for (const key of withoutLangIds) {
          await processKey(key, ["en"], result);
        }
      }
      res.json(result);
    } catch {
      res.status(500).json({ error: "Failed to load values" });
    }
  });

  router.get("/api/v1/:apiKey/model", async (req, res) => {
    try {
      const conn = await resolveApiKey(req.params.apiKey);
      if (!conn) return res.status(401).json({ error: "Invalid API key" });
      const rows = await db.all(
        "SELECT dp_id AS id, name, type FROM dti_model_datapoints WHERE connector_id = ? ORDER BY sort_order",
        [conn.connector_id]
      );
      res.json(rows);
    } catch {
      res.status(500).json({ error: "Failed to load model" });
    }
  });
}

module.exports = { initDtiTables, mountRoutes };
