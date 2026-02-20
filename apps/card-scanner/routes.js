const crypto = require("crypto");
const db = require("../../shared/db");
const auth = require("../../shared/auth");

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
                created_at
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
      await db.run(
        `INSERT INTO card_scans (scan_id, user_id, name, company, position, phone, email, website, address, raw_text, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [scanId, req.user.id, name || "", company || "", position || "", phone || "", email || "", website || "", address || "", raw_text || "", image || ""]
      );
      res.json({ ok: true, scan_id: scanId });
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
}

module.exports = { initCardScannerTables, mountRoutes };
