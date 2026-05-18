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
// Mojibake fix — multer (and many HTTP stacks) decode multipart filename
// bytes as latin1, so a UTF-8 "ü" (0xC3 0xBC) arrives as "Ã¼". Detect that
// and reconstruct the original UTF-8 string.
// ---------------------------------------------------------------------------
function fixMojibake(str) {
  if (!str || typeof str !== "string") return str;
  // Cheap pre-check: only proceed if a typical mojibake lead byte appears.
  // 0xC3 ("Ã") leads ü/ä/ö/é etc., 0xC2 ("Â") leads ° §, etc.
  if (str.indexOf('Ã') < 0 && str.indexOf('Â') < 0 && !/[ÃÂ]/.test(str)) return str;
  try {
    const fixed = Buffer.from(str, "latin1").toString("utf8");
    if (fixed.indexOf('�') >= 0) return str; // replacement char → not real mojibake
    const before = (str.match(/[ÂÃ]/g) || []).length;
    const after  = (fixed.match(/[ÂÃ]/g) || []).length;
    return after < before ? fixed : str;
  } catch {
    return str;
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
    // Fix multer's latin1-decoded filename before anything downstream reads it
    file.originalname = fixMojibake(file.originalname);
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

  // Migration: add tags column (JSON array of role/topic tags)
  try {
    await db.run(`ALTER TABLE kb_documents ADD COLUMN tags TEXT NOT NULL DEFAULT '[]'`);
  } catch { /* column already exists */ }

  // Contact persons (Resilienz-Modus: Betriebsrat, BEM, Betriebsarzt, SBV, ...)
  await db.run(`CREATE TABLE IF NOT EXISTS kb_contacts (
    contact_id TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL,
    function   TEXT NOT NULL DEFAULT '',
    name       TEXT NOT NULL DEFAULT '',
    email      TEXT NOT NULL DEFAULT '',
    phone      TEXT NOT NULL DEFAULT '',
    note       TEXT NOT NULL DEFAULT '',
    role_tags  TEXT NOT NULL DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  fs.mkdirSync(KB_DIR, { recursive: true });

  // One-time repair: filenames stored with latin1-decoded UTF-8 bytes
  try {
    const rows = await db.all(
      "SELECT doc_id, title, original_name FROM kb_documents WHERE title LIKE '%Ã%' OR title LIKE '%Â%' OR original_name LIKE '%Ã%' OR original_name LIKE '%Â%'"
    );
    let repaired = 0;
    for (const r of rows) {
      const newTitle = fixMojibake(r.title);
      const newOrig = fixMojibake(r.original_name);
      if (newTitle !== r.title || newOrig !== r.original_name) {
        await db.run(
          "UPDATE kb_documents SET title = ?, original_name = ? WHERE doc_id = ?",
          [newTitle, newOrig, r.doc_id]
        );
        repaired++;
      }
    }
    if (repaired > 0) console.log(`[KB] Repaired ${repaired} mojibake filename(s).`);
  } catch (e) {
    console.warn("[KB] Mojibake repair skipped:", e.message);
  }

  console.log("[KB] Tables ready.");
}

// ---------------------------------------------------------------------------
// AI description + tag generation
// ---------------------------------------------------------------------------
const KB_ROLE_TAGS = new Set([
  "beschaeftigte-buero", "beschaeftigte-produktion",
  "fk-klein", "fk-gross", "kontaktperson", "all-roles",
]);
const KB_TOPIC_TAGS = new Set([
  "resilienz-grundlagen", "stress", "konflikt", "ueberlastung",
  "fuehrung", "team", "belastungs-ekg", "schnittstellen-workshop",
  "audit", "programme-unternehmen", "prozess-vorschlag",
]);
const KB_KNOWN_TAGS = new Set([...KB_ROLE_TAGS, ...KB_TOPIC_TAGS]);

const AI_DESC_TAGS_PROMPT =
  "Du analysierst ein hochgeladenes Dokument und lieferst zwei Dinge:\n" +
  "1) Eine aussagekraeftige Zusammenfassung in 3-5 Saetzen auf Deutsch.\n" +
  "2) Eine Liste passender Tags fuer dieses Dokument. Waehle vor allem aus diesem Vokabular:\n\n" +
  "Rollen-Tags (nur diese IDs, kein Freitext):\n" +
  "- beschaeftigte-buero       (Wissensarbeit, Bueroumfeld)\n" +
  "- beschaeftigte-produktion  (Produktion, Schicht, wenig Gestaltungsraum)\n" +
  "- fk-klein                  (Fuehrungskraft mit kleinem Team <= 10)\n" +
  "- fk-gross                  (Fuehrungskraft fuer mehrere Teams / Organisation)\n" +
  "- kontaktperson             (Betriebsrat, BEM, Sicherheitsbeauftragte, Betriebsarzt, SBV)\n" +
  "- all-roles                 (relevant fuer alle Rollen)\n\n" +
  "Topic-Tags (nur diese IDs):\n" +
  "- resilienz-grundlagen, stress, konflikt, ueberlastung, fuehrung, team,\n" +
  "  belastungs-ekg, schnittstellen-workshop, audit, programme-unternehmen, prozess-vorschlag\n\n" +
  "Du darfst zusaetzlich MAXIMAL 3 eigene Topic-Tags vorschlagen, falls das Dokument klar ein Thema ausserhalb des Vokabulars traegt (kebab-case, deutsch, kurz – z.B. \"achtsamkeit\", \"ergonomie\"). Niemals eigene Rollen-Tags erfinden.\n\n" +
  "Antworte AUSSCHLIESSLICH als gueltiges JSON, ohne Markdown-Fences, ohne Kommentar:\n" +
  "{\"description\":\"...\",\"tags\":[\"tag1\",\"tag2\",...]}\n\n" +
  "DOKUMENT:\n";

function stripJsonFences(raw) {
  if (!raw) return "";
  let s = raw.trim();
  // strip ```json ... ``` or ``` ... ```
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  return s.trim();
}

function sanitizeAiTags(rawTags) {
  if (!Array.isArray(rawTags)) return [];
  const seen = new Set();
  const vocab = [];
  const free = [];
  for (const t of rawTags) {
    if (typeof t !== "string") continue;
    const id = t.trim().toLowerCase().replace(/\s+/g, "-");
    if (!id || seen.has(id)) continue;
    seen.add(id);
    if (KB_KNOWN_TAGS.has(id)) vocab.push(id);
    else if (/^[a-z0-9][a-z0-9-]{1,30}$/.test(id)) free.push(id);
  }
  // max 3 free topic tags, hard-cap 8 total
  return [...vocab, ...free.slice(0, 3)].slice(0, 8);
}

async function generateDescriptionAI(contentText, provider, model, apiKey) {
  const truncated = contentText.slice(0, 8000);
  const prompt = AI_DESC_TAGS_PROMPT + truncated;

  let rawText = "";
  if (provider === "gemini" || provider === "google") {
    const url = `${GEMINI_BASE}/${model || "gemini-2.5-flash"}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      }),
    });
    const data = await res.json();
    rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } else {
    // Groq / OpenAI-compatible
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: model || "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });
    const data = await res.json();
    rawText = data.choices?.[0]?.message?.content || "";
  }

  const cleaned = stripJsonFences(rawText);
  try {
    const parsed = JSON.parse(cleaned);
    const description = typeof parsed?.description === "string" ? parsed.description.trim() : "";
    const tags = sanitizeAiTags(parsed?.tags);
    if (description) return { description, tags };
  } catch (e) {
    console.warn("[KB] AI JSON parse failed, falling back to raw text:", e.message);
  }
  // Fallback: parse failed → keep description, no tags
  return { description: cleaned, tags: [] };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
function mountRoutes(router) {
  // List documents
  router.get("/api/documents", auth.requireAuth, async (req, res) => {
    try {
      const docs = await db.all(
        "SELECT doc_id, title, description, original_name, mime_type, file_size, tags, created_at, updated_at FROM kb_documents WHERE user_id = ? ORDER BY updated_at DESC",
        [req.user.id]
      );
      const out = docs.map(d => ({
        ...d,
        tags: (() => { try { return JSON.parse(d.tags || "[]"); } catch { return []; } })(),
      }));
      res.json({ documents: out });
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
      const { title, description, tags } = req.body || {};
      const doc = await db.get("SELECT doc_id FROM kb_documents WHERE doc_id = ? AND user_id = ?", [req.params.docId, req.user.id]);
      if (!doc) return res.status(404).json({ error: "NOT_FOUND" });

      const tagsJson = JSON.stringify(Array.isArray(tags) ? tags.filter(t => typeof t === "string") : []);
      await db.run(
        "UPDATE kb_documents SET title = ?, description = ?, tags = ?, updated_at = datetime('now') WHERE doc_id = ?",
        [title || "", description || "", tagsJson, req.params.docId]
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

  // Batch: fill missing description and/or tags for all user's documents via AI.
  // Streams NDJSON progress so the frontend can show a live counter overlay.
  router.post("/api/documents/fill-missing-meta", auth.requireAuth, async (req, res) => {
    const settings = await db.get("SELECT provider, model, api_key FROM aas_chat_settings WHERE user_id = ?", [req.user.id]);
    if (!settings?.api_key) return res.status(400).json({ error: "NO_API_KEY" });

    const docs = await db.all(
      "SELECT doc_id, description, tags, content_text FROM kb_documents WHERE user_id = ?",
      [req.user.id]
    );

    res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    const send = (obj) => { res.write(JSON.stringify(obj) + "\n"); };

    send({ type: "start", total: docs.length });

    let processed = 0, descriptionFilled = 0, tagsFilled = 0, errors = 0;
    const skipped = { alreadyComplete: 0, noText: 0 };
    let i = 0;

    for (const d of docs) {
      i++;
      let action = "skipped-complete";
      try {
        const existingTags = (() => { try { const a = JSON.parse(d.tags || "[]"); return Array.isArray(a) ? a : []; } catch { return []; } })();
        const descMissing = !(d.description && d.description.trim());
        const tagsMissing = existingTags.length === 0;

        if (!descMissing && !tagsMissing) {
          skipped.alreadyComplete++; action = "skipped-complete";
        } else if (!d.content_text || !d.content_text.trim()) {
          skipped.noText++; action = "skipped-notext";
        } else {
          let aiResult;
          try {
            aiResult = await generateDescriptionAI(d.content_text, settings.provider, settings.model, settings.api_key);
          } catch (err) {
            console.error("[KB] fill-missing-meta AI error for", d.doc_id, err.message);
            errors++; action = "error";
            send({ type: "progress", current: i, total: docs.length, action });
            continue;
          }
          const aiDesc = (aiResult?.description || "").trim();
          const aiTags = Array.isArray(aiResult?.tags) ? aiResult.tags : [];
          const finalDesc = descMissing ? (aiDesc || d.description || "") : d.description;
          const finalTags = [...new Set([...existingTags, ...aiTags])];
          const descChanged = descMissing && aiDesc;
          const tagsChanged = finalTags.length > existingTags.length;

          if (!descChanged && !tagsChanged) {
            if (descMissing && !aiDesc) { errors++; action = "error"; }
            else { skipped.alreadyComplete++; action = "skipped-complete"; }
          } else {
            await db.run(
              "UPDATE kb_documents SET description = ?, tags = ?, updated_at = datetime('now') WHERE doc_id = ?",
              [finalDesc || "", JSON.stringify(finalTags), d.doc_id]
            );
            processed++;
            if (descChanged) descriptionFilled++;
            if (tagsChanged) tagsFilled++;
            action = "updated";
          }
        }
      } catch (loopErr) {
        console.error("[KB] fill-missing-meta loop error:", loopErr);
        errors++; action = "error";
      }
      send({ type: "progress", current: i, total: docs.length, action });
    }

    send({ type: "done", processed, descriptionFilled, tagsFilled, skipped, errors, total: docs.length });
    res.end();
  });

  // Generate AI description
  router.post("/api/documents/:docId/generate-description", auth.requireAuth, async (req, res) => {
    try {
      const doc = await db.get("SELECT content_text FROM kb_documents WHERE doc_id = ? AND user_id = ?", [req.params.docId, req.user.id]);
      if (!doc) return res.status(404).json({ error: "NOT_FOUND" });
      if (!doc.content_text) return res.status(400).json({ error: "NO_TEXT" });

      const settings = await db.get("SELECT provider, model, api_key FROM aas_chat_settings WHERE user_id = ?", [req.user.id]);
      if (!settings?.api_key) return res.status(400).json({ error: "NO_API_KEY" });

      const { description, tags } = await generateDescriptionAI(doc.content_text, settings.provider, settings.model, settings.api_key);
      res.json({ description, tags: tags || [] });
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

  // -------------------------------------------------------------------------
  // Contact persons (Resilienz-Modus)
  // -------------------------------------------------------------------------
  function parseRoleTags(raw) {
    if (Array.isArray(raw)) return raw.filter(t => typeof t === "string");
    if (typeof raw === "string") {
      try { const arr = JSON.parse(raw); return Array.isArray(arr) ? arr : []; } catch { return []; }
    }
    return [];
  }

  router.get("/api/kb-contacts", auth.requireAuth, async (req, res) => {
    try {
      const rows = await db.all(
        "SELECT contact_id, function, name, email, phone, note, role_tags, created_at, updated_at FROM kb_contacts WHERE user_id = ? ORDER BY function, name",
        [req.user.id]
      );
      const out = rows.map(r => ({ ...r, role_tags: parseRoleTags(r.role_tags) }));
      res.json({ contacts: out });
    } catch (e) {
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.post("/api/kb-contacts", auth.requireAuth, async (req, res) => {
    try {
      const { function: fn, name, email, phone, note, role_tags } = req.body || {};
      const contactId = crypto.randomUUID();
      await db.run(
        `INSERT INTO kb_contacts (contact_id, user_id, function, name, email, phone, note, role_tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [contactId, req.user.id, fn || "", name || "", email || "", phone || "", note || "", JSON.stringify(parseRoleTags(role_tags))]
      );
      res.json({ contact_id: contactId });
    } catch (e) {
      console.error("[KB] Contact create error:", e);
      res.status(500).json({ error: "CREATE_FAILED" });
    }
  });

  router.put("/api/kb-contacts/:contactId", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get("SELECT contact_id FROM kb_contacts WHERE contact_id = ? AND user_id = ?", [req.params.contactId, req.user.id]);
      if (!row) return res.status(404).json({ error: "NOT_FOUND" });
      const { function: fn, name, email, phone, note, role_tags } = req.body || {};
      await db.run(
        `UPDATE kb_contacts
         SET function = ?, name = ?, email = ?, phone = ?, note = ?, role_tags = ?, updated_at = datetime('now')
         WHERE contact_id = ?`,
        [fn || "", name || "", email || "", phone || "", note || "", JSON.stringify(parseRoleTags(role_tags)), req.params.contactId]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: "UPDATE_FAILED" });
    }
  });

  router.delete("/api/kb-contacts/:contactId", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get("SELECT contact_id FROM kb_contacts WHERE contact_id = ? AND user_id = ?", [req.params.contactId, req.user.id]);
      if (!row) return res.status(404).json({ error: "NOT_FOUND" });
      await db.run("DELETE FROM kb_contacts WHERE contact_id = ?", [req.params.contactId]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // Seed 10 test contacts for the Resilienz demo. Idempotent via "Test: " prefix.
  router.post("/api/kb-contacts/seed-test", auth.requireAuth, async (req, res) => {
    const TEST_CONTACTS = [
      { function: "Betriebsrat",                 name: "Maria Schneider",  email: "test.maria@example.com",   phone: "+49 30 1234 5601", note: "Sprechstunde Mo 9–11",          role_tags: ["kontaktperson", "beschaeftigte-buero", "beschaeftigte-produktion"] },
      { function: "BEM-Beauftragte",             name: "Thomas Bauer",     email: "test.thomas@example.com",  phone: "+49 30 1234 5602", note: "Begleitung bei Wiedereingliederung", role_tags: ["kontaktperson", "beschaeftigte-buero", "beschaeftigte-produktion"] },
      { function: "Betriebsarzt",                name: "Dr. Anna Klein",   email: "test.anna@example.com",    phone: "+49 30 1234 5603", note: "Termine über das Sekretariat",   role_tags: ["kontaktperson", "all-roles"] },
      { function: "Sicherheitsfachkraft",        name: "Stefan Wagner",    email: "test.stefan@example.com",  phone: "+49 30 1234 5604", note: "Gefährdungsbeurteilungen, Unterweisungen", role_tags: ["kontaktperson", "beschaeftigte-produktion"] },
      { function: "Schwerbehindertenvertretung", name: "Petra Lang",       email: "test.petra@example.com",   phone: "+49 30 1234 5605", note: "Vertretung schwerbehinderter Beschäftigter", role_tags: ["kontaktperson", "beschaeftigte-buero", "beschaeftigte-produktion"] },
      { function: "Gesundheitsmanagement",       name: "Julia Hoffmann",   email: "test.julia@example.com",   phone: "+49 30 1234 5606", note: "BGM-Programme, Workshops, Belastungs-EKG", role_tags: ["kontaktperson", "fk-klein", "fk-gross"] },
      { function: "HR Business Partner",         name: "Markus Becker",    email: "test.markus@example.com",  phone: "+49 30 1234 5607", note: "Personalentwicklung, Konfliktbegleitung", role_tags: ["kontaktperson", "fk-klein", "fk-gross"] },
      { function: "Coach für Führungskräfte",   name: "Sabine Vogel",     email: "test.sabine@example.com",  phone: "+49 30 1234 5608", note: "1:1-Coaching für Team- und Bereichsleitungen", role_tags: ["kontaktperson", "fk-klein", "fk-gross"] },
      { function: "Konfliktmoderation",          name: "Daniel Roth",      email: "test.daniel@example.com",  phone: "+49 30 1234 5609", note: "Moderation bei Team-Konflikten",  role_tags: ["kontaktperson", "fk-klein"] },
      { function: "Vertrauensperson",            name: "Lisa Krüger",      email: "test.lisa@example.com",    phone: "+49 30 1234 5610", note: "Anonyme erste Anlaufstelle",     role_tags: ["kontaktperson", "beschaeftigte-buero", "beschaeftigte-produktion"] },
    ];
    try {
      // One-off cleanup: remove legacy entries from earlier iteration that still carried the "Test: " prefix
      await db.run("DELETE FROM kb_contacts WHERE user_id = ? AND function LIKE 'Test: %'", [req.user.id]);

      let created = 0, skipped = 0;
      for (const c of TEST_CONTACTS) {
        // Idempotency anchor: the synthetic test email is unique per contact and cannot collide with real contacts
        const existing = await db.get(
          "SELECT contact_id FROM kb_contacts WHERE user_id = ? AND email = ?",
          [req.user.id, c.email]
        );
        if (existing) { skipped++; continue; }
        await db.run(
          `INSERT INTO kb_contacts (contact_id, user_id, function, name, email, phone, note, role_tags)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [crypto.randomUUID(), req.user.id, c.function, c.name, c.email, c.phone, c.note, JSON.stringify(c.role_tags)]
        );
        created++;
      }
      res.json({ created, skipped, total: TEST_CONTACTS.length });
    } catch (e) {
      console.error("[KB] Seed test contacts error:", e);
      res.status(500).json({ error: "SEED_FAILED" });
    }
  });
}

module.exports = { initKnowledgeBaseTables, mountRoutes };
