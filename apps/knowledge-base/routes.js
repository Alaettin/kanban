const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const db = require("../../shared/db");
const auth = require("../../shared/auth");

const KB_DIR = path.join(__dirname, "..", "..", "data", "kb-files");

const ACCEPTED_EXTS = new Set([".pdf", ".docx", ".txt", ".md", ".xlsx", ".xls", ".csv"]);

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// ---------------------------------------------------------------------------
// Text extraction
// ---------------------------------------------------------------------------
async function extractText(filePath, ext) {
  try {
    if ([".txt", ".md", ".csv"].includes(ext)) {
      return fs.readFileSync(filePath, "utf-8");
    }
    if (ext === ".pdf") {
      const pdfParse = require("pdf-parse");
      const buf = fs.readFileSync(filePath);
      const pdf = await pdfParse(buf);
      return pdf.text || "";
    }
    if (ext === ".docx") {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || "";
    }
    if ([".xlsx", ".xls"].includes(ext)) {
      const XLSX = require("xlsx");
      const workbook = XLSX.readFile(filePath);
      let text = "";
      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        text += `[${sheetName}]\n` + XLSX.utils.sheet_to_csv(sheet) + "\n\n";
      }
      return text;
    }
    return "";
  } catch (e) {
    console.error("[KB] Text extraction error:", e.message);
    return "";
  }
}

// ---------------------------------------------------------------------------
// Multer
// ---------------------------------------------------------------------------
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      const userDir = path.join(KB_DIR, req.user.id);
      fs.mkdirSync(userDir, { recursive: true });
      cb(null, userDir);
    },
    filename(req, file, cb) {
      const docId = crypto.randomUUID();
      req._kbDocId = docId;
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, docId + ext);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, ACCEPTED_EXTS.has(ext));
  },
});

// ---------------------------------------------------------------------------
// DB init
// ---------------------------------------------------------------------------
async function initKnowledgeBaseTables() {
  await db.run(`CREATE TABLE IF NOT EXISTS kb_documents (
    doc_id        TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL,
    title         TEXT NOT NULL DEFAULT '',
    description   TEXT NOT NULL DEFAULT '',
    original_name TEXT NOT NULL DEFAULT '',
    mime_type     TEXT NOT NULL DEFAULT '',
    file_size     INTEGER NOT NULL DEFAULT 0,
    content_text  TEXT NOT NULL DEFAULT '',
    created_at    TEXT DEFAULT (datetime('now')),
    updated_at    TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS kb_settings (
    user_id     TEXT PRIMARY KEY,
    base_prompt TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  fs.mkdirSync(KB_DIR, { recursive: true });
  console.log("[KB] Tables ready.");
}

// ---------------------------------------------------------------------------
// AI description generation
// ---------------------------------------------------------------------------
async function generateDescriptionAI(contentText, provider, model, apiKey) {
  const truncated = contentText.slice(0, 4000);
  const prompt = "Generate a concise 1-2 sentence description of this document. Respond only with the description, nothing else.\n\n" + truncated;

  if (provider === "gemini" || provider === "google") {
    const url = `${GEMINI_BASE}/${model || "gemini-2.5-flash"}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 256, temperature: 0.3 },
      }),
    });
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return text.trim();
  }

  // Groq / OpenAI-compatible
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: model || "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 256,
      temperature: 0.3,
    }),
  });
  const data = await res.json();
  return (data.choices?.[0]?.message?.content || "").trim();
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
function mountRoutes(router) {
  // List documents
  router.get("/api/documents", auth.requireAuth, async (req, res) => {
    try {
      const docs = await db.all(
        "SELECT doc_id, title, description, original_name, mime_type, file_size, created_at, updated_at FROM kb_documents WHERE user_id = ? ORDER BY updated_at DESC",
        [req.user.id]
      );
      res.json({ documents: docs });
    } catch (e) {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // Upload document
  router.post("/api/documents", auth.requireAuth, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "NO_FILE" });
      const docId = req._kbDocId;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const filePath = path.join(KB_DIR, req.user.id, docId + ext);
      const contentText = await extractText(filePath, ext);
      const title = path.basename(req.file.originalname, ext);

      await db.run(
        `INSERT INTO kb_documents (doc_id, user_id, title, original_name, mime_type, file_size, content_text)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [docId, req.user.id, title, req.file.originalname, req.file.mimetype, req.file.size, contentText]
      );

      res.json({
        doc_id: docId,
        title,
        original_name: req.file.originalname,
        mime_type: req.file.mimetype,
        file_size: req.file.size,
        content_length: contentText.length,
      });
    } catch (e) {
      console.error("[KB] Upload error:", e);
      res.status(500).json({ error: "UPLOAD_FAILED" });
    }
  });

  // Update document
  router.put("/api/documents/:docId", auth.requireAuth, async (req, res) => {
    try {
      const { title, description } = req.body || {};
      const doc = await db.get("SELECT doc_id FROM kb_documents WHERE doc_id = ? AND user_id = ?", [req.params.docId, req.user.id]);
      if (!doc) return res.status(404).json({ error: "NOT_FOUND" });

      await db.run(
        "UPDATE kb_documents SET title = ?, description = ?, updated_at = datetime('now') WHERE doc_id = ?",
        [title || "", description || "", req.params.docId]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: "UPDATE_FAILED" });
    }
  });

  // Delete document
  router.delete("/api/documents/:docId", auth.requireAuth, async (req, res) => {
    try {
      const doc = await db.get("SELECT doc_id, original_name FROM kb_documents WHERE doc_id = ? AND user_id = ?", [req.params.docId, req.user.id]);
      if (!doc) return res.status(404).json({ error: "NOT_FOUND" });

      const ext = path.extname(doc.original_name).toLowerCase();
      const filePath = path.join(KB_DIR, req.user.id, doc.doc_id + ext);
      try { fs.unlinkSync(filePath); } catch {}

      await db.run("DELETE FROM kb_documents WHERE doc_id = ?", [req.params.docId]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // Get extracted text
  router.get("/api/documents/:docId/content", auth.requireAuth, async (req, res) => {
    try {
      const doc = await db.get("SELECT content_text FROM kb_documents WHERE doc_id = ? AND user_id = ?", [req.params.docId, req.user.id]);
      if (!doc) return res.status(404).json({ error: "NOT_FOUND" });
      res.json({ content_text: doc.content_text });
    } catch (e) {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // Generate AI description
  router.post("/api/documents/:docId/generate-description", auth.requireAuth, async (req, res) => {
    try {
      const doc = await db.get("SELECT content_text FROM kb_documents WHERE doc_id = ? AND user_id = ?", [req.params.docId, req.user.id]);
      if (!doc) return res.status(404).json({ error: "NOT_FOUND" });
      if (!doc.content_text) return res.status(400).json({ error: "NO_TEXT" });

      const settings = await db.get("SELECT provider, model, api_key FROM aas_chat_settings WHERE user_id = ?", [req.user.id]);
      if (!settings?.api_key) return res.status(400).json({ error: "NO_API_KEY" });

      const description = await generateDescriptionAI(doc.content_text, settings.provider, settings.model, settings.api_key);
      res.json({ description });
    } catch (e) {
      console.error("[KB] AI description error:", e);
      res.status(500).json({ error: "GENERATE_FAILED" });
    }
  });

  // Get settings
  router.get("/api/settings", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get("SELECT base_prompt FROM kb_settings WHERE user_id = ?", [req.user.id]);
      res.json({
        base_prompt: row?.base_prompt || "",
        default_base_prompt: "Du hast Zugriff auf eine Wissensdatenbank mit Dokumenten. Durchsuche die verf\u00fcgbaren Ressourcen anhand ihrer Beschreibungen und lies relevante Dokumente, um Fragen zu beantworten.",
      });
    } catch (e) {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // Save settings
  router.put("/api/settings", auth.requireAuth, async (req, res) => {
    try {
      const { base_prompt } = req.body || {};
      await db.run(
        `INSERT INTO kb_settings (user_id, base_prompt) VALUES (?, ?)
         ON CONFLICT(user_id) DO UPDATE SET base_prompt = excluded.base_prompt`,
        [req.user.id, base_prompt || ""]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: "SAVE_FAILED" });
    }
  });
}

module.exports = { initKnowledgeBaseTables, mountRoutes };
