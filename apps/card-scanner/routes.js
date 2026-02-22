const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const db = require("../../shared/db");
const auth = require("../../shared/auth");

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateCardId() {
  const bytes = crypto.randomBytes(10);
  let id = "";
  for (let i = 0; i < 10; i++) id += CHARSET[bytes[i] % CHARSET.length];
  return id;
}

const UPLOADS_DIR = path.join(__dirname, "..", "..", "data", "dti-files");

// ---------------------------------------------------------------------------
// DB init
// ---------------------------------------------------------------------------
async function initCardScannerTables() {
  await db.run(`CREATE TABLE IF NOT EXISTS card_scans (
    scan_id    TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL,
    name       TEXT DEFAULT '',
    company    TEXT DEFAULT '',
    position   TEXT DEFAULT '',
    phone      TEXT DEFAULT '',
    email      TEXT DEFAULT '',
    website    TEXT DEFAULT '',
    address    TEXT DEFAULT '',
    raw_text   TEXT DEFAULT '',
    image      TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Migration: add image column if missing (existing DBs)
  const cols = await db.all("PRAGMA table_info(card_scans)");
  if (!cols.find((c) => c.name === "image")) {
    await db.run("ALTER TABLE card_scans ADD COLUMN image TEXT DEFAULT ''");
  }

  // Settings table (per-user key-value)
  // Migration: drop old table if it has legacy column names
  const settingsCols = await db.all("PRAGMA table_info(card_scanner_settings)").catch(() => []);
  if (settingsCols.length && settingsCols.find((c) => c.name === "key")) {
    await db.run("DROP TABLE card_scanner_settings");
  }
  await db.run(`CREATE TABLE IF NOT EXISTS card_scanner_settings (
    user_id      TEXT NOT NULL,
    setting_key  TEXT NOT NULL,
    setting_value TEXT DEFAULT '',
    PRIMARY KEY (user_id, setting_key),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Migration: add card_id column
  if (!cols.find((c) => c.name === "card_id")) {
    await db.run("ALTER TABLE card_scans ADD COLUMN card_id TEXT DEFAULT ''");
    const rows = await db.all("SELECT scan_id FROM card_scans WHERE card_id = '' OR card_id IS NULL");
    for (const row of rows) {
      await db.run("UPDATE card_scans SET card_id = ? WHERE scan_id = ?", [generateCardId(), row.scan_id]);
    }
  }
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
function mountRoutes(router) {

  // --- List cards (without full image blob for performance) ---
  router.get("/api/cards", auth.requireAuth, async (req, res) => {
    try {
      const rows = await db.all(
        `SELECT scan_id, user_id, name, company, position, phone, email, website, address, raw_text,
                CASE WHEN image != '' THEN 1 ELSE 0 END AS has_image,
                card_id, created_at
         FROM card_scans WHERE user_id = ? ORDER BY created_at DESC`,
        [req.user.id]
      );
      res.json({ cards: rows });
    } catch {
      res.status(500).json({ error: "LOAD_CARDS_FAILED" });
    }
  });

  // --- Get card image ---
  router.get("/api/cards/:scanId/image", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get(
        "SELECT image FROM card_scans WHERE scan_id = ? AND user_id = ?",
        [req.params.scanId, req.user.id]
      );
      if (!row || !row.image) return res.status(404).json({ error: "NO_IMAGE" });
      res.json({ image: row.image });
    } catch {
      res.status(500).json({ error: "LOAD_IMAGE_FAILED" });
    }
  });

  // --- Create card ---
  router.post("/api/cards", auth.requireAuth, async (req, res) => {
    try {
      const { name, company, position, phone, email, website, address, raw_text, image } = req.body || {};
      const scanId = crypto.randomUUID();
      const cardId = generateCardId();
      await db.run(
        `INSERT INTO card_scans (scan_id, user_id, name, company, position, phone, email, website, address, raw_text, image, card_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [scanId, req.user.id, name || "", company || "", position || "", phone || "", email || "", website || "", address || "", raw_text || "", image || "", cardId]
      );
      res.json({ ok: true, scan_id: scanId, card_id: cardId });
    } catch {
      res.status(500).json({ error: "CREATE_CARD_FAILED" });
    }
  });

  // --- Update card ---
  router.put("/api/cards/:scanId", auth.requireAuth, async (req, res) => {
    try {
      const { scanId } = req.params;
      const card = await db.get(
        "SELECT scan_id FROM card_scans WHERE scan_id = ? AND user_id = ?",
        [scanId, req.user.id]
      );
      if (!card) return res.status(404).json({ error: "NOT_FOUND" });

      const { name, company, position, phone, email, website, address } = req.body || {};
      await db.run(
        `UPDATE card_scans SET name = ?, company = ?, position = ?, phone = ?, email = ?, website = ?, address = ?
         WHERE scan_id = ?`,
        [name || "", company || "", position || "", phone || "", email || "", website || "", address || "", scanId]
      );
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "UPDATE_CARD_FAILED" });
    }
  });

  // --- Delete card ---
  router.delete("/api/cards/:scanId", auth.requireAuth, async (req, res) => {
    try {
      const { scanId } = req.params;
      const card = await db.get(
        "SELECT scan_id FROM card_scans WHERE scan_id = ? AND user_id = ?",
        [scanId, req.user.id]
      );
      if (!card) return res.status(404).json({ error: "NOT_FOUND" });

      await db.run("DELETE FROM card_scans WHERE scan_id = ?", [scanId]);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "DELETE_CARD_FAILED" });
    }
  });

  // --- QR base URL (get) ---
  router.get("/api/cards/settings/qr-base-url", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get(
        "SELECT setting_value FROM card_scanner_settings WHERE user_id = ? AND setting_key = 'qr_base_url'",
        [req.user.id]
      );
      res.json({ qr_base_url: row ? row.setting_value : null });
    } catch (e) {
      console.error("[CardScanner] Load QR URL error:", e);
      res.status(500).json({ error: "LOAD_SETTING_FAILED" });
    }
  });

  // --- QR base URL (set) ---
  router.put("/api/cards/settings/qr-base-url", auth.requireAuth, async (req, res) => {
    try {
      const { qr_base_url } = req.body || {};
      if (qr_base_url) {
        await db.run(
          "INSERT OR REPLACE INTO card_scanner_settings (user_id, setting_key, setting_value) VALUES (?, 'qr_base_url', ?)",
          [req.user.id, qr_base_url]
        );
      } else {
        await db.run(
          "DELETE FROM card_scanner_settings WHERE user_id = ? AND setting_key = 'qr_base_url'",
          [req.user.id]
        );
      }
      res.json({ ok: true });
    } catch (e) {
      console.error("[CardScanner] Save QR URL error:", e);
      res.status(500).json({ error: "SAVE_SETTING_FAILED" });
    }
  });

  // --- Auto-Sync (get) ---
  router.get("/api/cards/settings/auto-sync", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get(
        "SELECT setting_value FROM card_scanner_settings WHERE user_id = ? AND setting_key = 'auto_sync'",
        [req.user.id]
      );
      res.json({ auto_sync: row ? row.setting_value === "true" : false });
    } catch (e) {
      console.error("[CardScanner] Load auto-sync error:", e);
      res.status(500).json({ error: "LOAD_SETTING_FAILED" });
    }
  });

  // --- Auto-Sync (set) ---
  router.put("/api/cards/settings/auto-sync", auth.requireAuth, async (req, res) => {
    try {
      const { auto_sync } = req.body || {};
      await db.run(
        "INSERT OR REPLACE INTO card_scanner_settings (user_id, setting_key, setting_value) VALUES (?, 'auto_sync', ?)",
        [req.user.id, auto_sync ? "true" : "false"]
      );
      res.json({ ok: true });
    } catch (e) {
      console.error("[CardScanner] Save auto-sync error:", e);
      res.status(500).json({ error: "SAVE_SETTING_FAILED" });
    }
  });

  // --- DTI Connector status ---
  router.get("/api/cards/dti-connector-status", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get(
        "SELECT connector_id, api_key FROM dti_connectors WHERE user_id = ? AND type = 'card-scanner'",
        [req.user.id]
      );
      if (row) {
        res.json({ exists: true, connector_id: row.connector_id, api_key: row.api_key });
      } else {
        res.json({ exists: false });
      }
    } catch {
      res.status(500).json({ error: "STATUS_CHECK_FAILED" });
    }
  });

  // --- Create DTI Connector for Card Scanner ---
  router.post("/api/cards/create-dti-connector", auth.requireAuth, async (req, res) => {
    try {
      // Check if already exists
      const existing = await db.get(
        "SELECT connector_id FROM dti_connectors WHERE user_id = ? AND type = 'card-scanner'",
        [req.user.id]
      );
      if (existing) return res.status(409).json({ error: "ALREADY_EXISTS" });

      // Check DTI Connector app access
      const access = await db.get(
        "SELECT 1 FROM user_app_access WHERE user_id = ? AND app_id = 'dti-connector'",
        [req.user.id]
      );
      if (!access) return res.status(403).json({ error: "NO_DTI_ACCESS" });

      const connectorId = crypto.randomUUID();
      const apiKey = crypto.randomUUID();

      await db.run(
        "INSERT INTO dti_connectors (connector_id, user_id, name, api_key, type) VALUES (?, ?, 'CardScanner', ?, 'card-scanner')",
        [connectorId, req.user.id, apiKey]
      );
      await db.run(
        "INSERT INTO connector_members (connector_id, user_id, role) VALUES (?, ?, 'owner')",
        [connectorId, req.user.id]
      );

      // Fixed hierarchy: one level "Asset"
      await db.run(
        "INSERT INTO dti_hierarchy_levels (connector_id, level, name) VALUES (?, 1, 'Asset')",
        [connectorId]
      );

      // Fixed model datapoints
      const datapoints = [
        { id: "name", name: "Name", type: 0 },
        { id: "company", name: "Company", type: 0 },
        { id: "position", name: "Position", type: 0 },
        { id: "phone", name: "Phone", type: 0 },
        { id: "email", name: "Email", type: 0 },
        { id: "website", name: "Website", type: 0 },
        { id: "address", name: "Address", type: 0 },
        { id: "image", name: "Image", type: 1 },
      ];
      for (let i = 0; i < datapoints.length; i++) {
        const dp = datapoints[i];
        await db.run(
          "INSERT INTO dti_model_datapoints (connector_id, dp_id, name, type, sort_order) VALUES (?, ?, ?, ?, ?)",
          [connectorId, dp.id, dp.name, dp.type, i]
        );
      }

      res.json({ ok: true, connector_id: connectorId, api_key: apiKey });
    } catch (e) {
      res.status(500).json({ error: "CREATE_CONNECTOR_FAILED" });
    }
  });

  // --- Sync cards to DTI Connector ---
  router.post("/api/cards/sync-dti", auth.requireAuth, async (req, res) => {
    try {
      const conn = await db.get(
        "SELECT connector_id FROM dti_connectors WHERE user_id = ? AND type = 'card-scanner'",
        [req.user.id]
      );
      if (!conn) return res.status(404).json({ error: "NO_CONNECTOR" });
      const cid = conn.connector_id;

      const cards = await db.all(
        "SELECT scan_id, card_id, name, company, position, phone, email, website, address, image FROM card_scans WHERE user_id = ?",
        [req.user.id]
      );

      let synced = 0;
      const connDir = path.join(UPLOADS_DIR, req.user.id, cid);
      fs.mkdirSync(connDir, { recursive: true });

      for (const card of cards) {
        if (!card.card_id) continue;
        const assetId = card.card_id;
        const fileId = "dt_" + card.card_id;

        // Ensure asset exists
        const existingAsset = await db.get(
          "SELECT asset_id FROM dti_assets WHERE connector_id = ? AND asset_id = ?",
          [cid, assetId]
        );
        if (!existingAsset) {
          await db.run("INSERT INTO dti_assets (connector_id, asset_id) VALUES (?, ?)", [cid, assetId]);
        }

        // Set asset values (delete + reinsert)
        await db.run("DELETE FROM dti_asset_values WHERE connector_id = ? AND asset_id = ?", [cid, assetId]);
        const values = [
          { key: "Asset", value: "Card" },
          { key: "name", value: card.name || "" },
          { key: "company", value: card.company || "" },
          { key: "position", value: card.position || "" },
          { key: "phone", value: card.phone || "" },
          { key: "email", value: card.email || "" },
          { key: "website", value: card.website || "" },
          { key: "address", value: card.address || "" },
          { key: "image", value: card.image ? fileId : "" },
        ];
        for (const v of values) {
          await db.run(
            "INSERT INTO dti_asset_values (connector_id, asset_id, key, lang, value) VALUES (?, ?, ?, 'en', ?)",
            [cid, assetId, v.key, v.value]
          );
        }

        // Handle file (image)
        if (card.image) {
          // Parse base64 data URL
          const match = card.image.match(/^data:image\/([\w+]+);base64,(.+)$/);
          if (match) {
            const ext = "." + match[1].replace("jpeg", "jpg");
            const buffer = Buffer.from(match[2], "base64");
            const filePath = path.join(connDir, fileId + "_en" + ext);

            // Remove old file if exists with different extension
            const existingFile = await db.get(
              "SELECT original_name FROM dti_files WHERE connector_id = ? AND file_id = ? AND lang = 'en'",
              [cid, fileId]
            );
            if (existingFile) {
              const oldExt = path.extname(existingFile.original_name);
              const oldPath = path.join(connDir, fileId + "_en" + oldExt);
              try { fs.unlinkSync(oldPath); } catch {}
              await db.run("DELETE FROM dti_files WHERE connector_id = ? AND file_id = ? AND lang = 'en'", [cid, fileId]);
            }

            fs.writeFileSync(filePath, buffer);
            await db.run(
              "INSERT INTO dti_files (connector_id, file_id, lang, original_name, size, mime_type) VALUES (?, ?, 'en', ?, ?, ?)",
              [cid, fileId, "image" + ext, buffer.length, "image/" + match[1]]
            );
          }
        }

        synced++;
      }

      res.json({ ok: true, synced });
    } catch (e) {
      console.error("[CardScanner] Sync error:", e);
      res.status(500).json({ error: "SYNC_FAILED" });
    }
  });
}

module.exports = { initCardScannerTables, mountRoutes };
