const crypto = require("crypto");
const db = require("../../shared/db");
const auth = require("../../shared/auth");

// ---------------------------------------------------------------------------
// DB Init
// ---------------------------------------------------------------------------
async function initUccTables() {
  await db.run(`CREATE TABLE IF NOT EXISTS ucc_sources (
    source_id  TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL,
    name       TEXT NOT NULL,
    base_url   TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS ucc_source_aas (
    entry_id   TEXT PRIMARY KEY,
    source_id  TEXT NOT NULL,
    user_id    TEXT NOT NULL,
    aas_id     TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(source_id, aas_id),
    FOREIGN KEY (source_id) REFERENCES ucc_sources(source_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS ucc_use_cases (
    case_id     TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    name        TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS ucc_required_submodels (
    req_id      TEXT PRIMARY KEY,
    case_id     TEXT NOT NULL,
    semantic_id TEXT NOT NULL,
    id_short    TEXT NOT NULL DEFAULT '',
    UNIQUE(case_id, semantic_id),
    FOREIGN KEY (case_id) REFERENCES ucc_use_cases(case_id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS ucc_evaluations (
    eval_id      TEXT PRIMARY KEY,
    user_id      TEXT NOT NULL,
    aas_id       TEXT NOT NULL,
    source_id    TEXT NOT NULL,
    shell_data   TEXT,
    results_json TEXT,
    evaluated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, aas_id, source_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (source_id) REFERENCES ucc_sources(source_id) ON DELETE CASCADE
  )`);

  // Migration: fix UNIQUE constraint to include source_id (allows same aas_id from different servers)
  const tableInfo = await db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='ucc_evaluations'");
  if (tableInfo?.sql && tableInfo.sql.includes("UNIQUE(user_id, aas_id)") && !tableInfo.sql.includes("UNIQUE(user_id, aas_id, source_id)")) {
    console.log("[UCC] Migrating ucc_evaluations: adding source_id to UNIQUE constraint…");
    await db.run("ALTER TABLE ucc_evaluations RENAME TO ucc_evaluations_old");
    await db.run(`CREATE TABLE ucc_evaluations (
      eval_id      TEXT PRIMARY KEY,
      user_id      TEXT NOT NULL,
      aas_id       TEXT NOT NULL,
      source_id    TEXT NOT NULL,
      shell_data   TEXT,
      results_json TEXT,
      evaluated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, aas_id, source_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (source_id) REFERENCES ucc_sources(source_id) ON DELETE CASCADE
    )`);
    await db.run("INSERT INTO ucc_evaluations SELECT * FROM ucc_evaluations_old");
    await db.run("DROP TABLE ucc_evaluations_old");
    console.log("[UCC] Migration done.");
  }

  console.log("[UCC] Tables ready.");
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function uid() { return crypto.randomUUID(); }

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
// Routes
// ---------------------------------------------------------------------------
function mountRoutes(router) {

  // ==================== SOURCES CRUD ====================

  router.get("/api/sources", auth.requireAuth, async (req, res) => {
    try {
      const rows = await db.all(
        `SELECT s.source_id, s.name, s.base_url, s.created_at,
                (SELECT COUNT(*) FROM ucc_source_aas a WHERE a.source_id = s.source_id) AS aas_count
         FROM ucc_sources s WHERE s.user_id = ? ORDER BY s.created_at ASC`,
        [req.user.id]
      );
      res.json({ sources: rows });
    } catch (err) {
      console.error("GET /api/sources error:", err);
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.post("/api/sources", auth.requireAuth, async (req, res) => {
    try {
      const { name, base_url } = req.body || {};
      if (!name || !base_url) return res.status(400).json({ error: "MISSING_FIELDS" });
      const source_id = uid();
      await db.run(
        "INSERT INTO ucc_sources (source_id, user_id, name, base_url) VALUES (?, ?, ?, ?)",
        [source_id, req.user.id, name.trim(), base_url.trim().replace(/\/+$/, "")]
      );
      res.json({ source_id });
    } catch (err) {
      console.error("POST /api/sources error:", err);
      res.status(500).json({ error: "CREATE_FAILED" });
    }
  });

  router.put("/api/sources/:sourceId", auth.requireAuth, async (req, res) => {
    try {
      const { name, base_url } = req.body || {};
      if (!name || !base_url) return res.status(400).json({ error: "MISSING_FIELDS" });
      const r = await db.run(
        "UPDATE ucc_sources SET name = ?, base_url = ? WHERE source_id = ? AND user_id = ?",
        [name.trim(), base_url.trim().replace(/\/+$/, ""), req.params.sourceId, req.user.id]
      );
      if (r.changes === 0) return res.status(404).json({ error: "NOT_FOUND" });
      res.json({ ok: true });
    } catch (err) {
      console.error("PUT /api/sources error:", err);
      res.status(500).json({ error: "UPDATE_FAILED" });
    }
  });

  router.delete("/api/sources/:sourceId", auth.requireAuth, async (req, res) => {
    try {
      await db.run(
        "DELETE FROM ucc_sources WHERE source_id = ? AND user_id = ?",
        [req.params.sourceId, req.user.id]
      );
      res.json({ ok: true });
    } catch (err) {
      console.error("DELETE /api/sources error:", err);
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // ==================== AAS IDS PER SOURCE ====================

  router.get("/api/sources/:sourceId/aas", auth.requireAuth, async (req, res) => {
    try {
      const source = await db.get(
        "SELECT source_id, name, base_url FROM ucc_sources WHERE source_id = ? AND user_id = ?",
        [req.params.sourceId, req.user.id]
      );
      if (!source) return res.status(404).json({ error: "NOT_FOUND" });
      const ids = await db.all(
        "SELECT entry_id, aas_id, created_at FROM ucc_source_aas WHERE source_id = ? ORDER BY created_at ASC",
        [req.params.sourceId]
      );
      res.json({ source, ids });
    } catch (err) {
      console.error("GET /api/sources/:id/aas error:", err);
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.post("/api/sources/:sourceId/aas", auth.requireAuth, async (req, res) => {
    try {
      const source = await db.get(
        "SELECT source_id FROM ucc_sources WHERE source_id = ? AND user_id = ?",
        [req.params.sourceId, req.user.id]
      );
      if (!source) return res.status(404).json({ error: "NOT_FOUND" });

      const { aas_ids } = req.body || {};
      if (!Array.isArray(aas_ids) || !aas_ids.length) return res.status(400).json({ error: "MISSING_IDS" });

      let added = 0, duplicates = 0;
      for (const raw of aas_ids) {
        const id = (raw || "").trim();
        if (!id) continue;
        try {
          await db.run(
            "INSERT INTO ucc_source_aas (entry_id, source_id, user_id, aas_id) VALUES (?, ?, ?, ?)",
            [uid(), req.params.sourceId, req.user.id, id]
          );
          added++;
        } catch (e) {
          if (e.message && e.message.includes("UNIQUE")) duplicates++;
          else throw e;
        }
      }
      res.json({ added, duplicates });
    } catch (err) {
      console.error("POST /api/sources/:id/aas error:", err);
      res.status(500).json({ error: "ADD_FAILED" });
    }
  });

  router.delete("/api/sources/:sourceId/aas/:entryId", auth.requireAuth, async (req, res) => {
    try {
      await db.run(
        `DELETE FROM ucc_source_aas WHERE entry_id = ? AND source_id = ?
         AND source_id IN (SELECT source_id FROM ucc_sources WHERE user_id = ?)`,
        [req.params.entryId, req.params.sourceId, req.user.id]
      );
      res.json({ ok: true });
    } catch (err) {
      console.error("DELETE /api/sources/:id/aas/:eid error:", err);
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // ==================== USE CASES CRUD ====================

  router.get("/api/use-cases", auth.requireAuth, async (req, res) => {
    try {
      const cases = await db.all(
        "SELECT case_id, name, description, created_at FROM ucc_use_cases WHERE user_id = ? ORDER BY created_at ASC",
        [req.user.id]
      );
      for (const c of cases) {
        c.submodels = await db.all(
          "SELECT req_id, semantic_id, id_short FROM ucc_required_submodels WHERE case_id = ? ORDER BY rowid ASC",
          [c.case_id]
        );
      }
      res.json({ use_cases: cases });
    } catch (err) {
      console.error("GET /api/use-cases error:", err);
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  router.post("/api/use-cases", auth.requireAuth, async (req, res) => {
    try {
      const { name, description, submodels } = req.body || {};
      if (!name) return res.status(400).json({ error: "MISSING_NAME" });
      const case_id = uid();
      await db.run(
        "INSERT INTO ucc_use_cases (case_id, user_id, name, description) VALUES (?, ?, ?, ?)",
        [case_id, req.user.id, name.trim(), (description || "").trim()]
      );
      if (Array.isArray(submodels)) {
        for (const sm of submodels) {
          if (!sm.semantic_id) continue;
          await db.run(
            "INSERT OR IGNORE INTO ucc_required_submodels (req_id, case_id, semantic_id, id_short) VALUES (?, ?, ?, ?)",
            [uid(), case_id, sm.semantic_id.trim(), (sm.id_short || "").trim()]
          );
        }
      }
      res.json({ case_id });
    } catch (err) {
      console.error("POST /api/use-cases error:", err);
      res.status(500).json({ error: "CREATE_FAILED" });
    }
  });

  router.put("/api/use-cases/:caseId", auth.requireAuth, async (req, res) => {
    try {
      const { name, description, submodels } = req.body || {};
      if (!name) return res.status(400).json({ error: "MISSING_NAME" });
      const existing = await db.get(
        "SELECT case_id FROM ucc_use_cases WHERE case_id = ? AND user_id = ?",
        [req.params.caseId, req.user.id]
      );
      if (!existing) return res.status(404).json({ error: "NOT_FOUND" });

      await db.run(
        "UPDATE ucc_use_cases SET name = ?, description = ? WHERE case_id = ?",
        [name.trim(), (description || "").trim(), req.params.caseId]
      );
      // Replace submodels
      await db.run("DELETE FROM ucc_required_submodels WHERE case_id = ?", [req.params.caseId]);
      if (Array.isArray(submodels)) {
        for (const sm of submodels) {
          if (!sm.semantic_id) continue;
          await db.run(
            "INSERT OR IGNORE INTO ucc_required_submodels (req_id, case_id, semantic_id, id_short) VALUES (?, ?, ?, ?)",
            [uid(), req.params.caseId, sm.semantic_id.trim(), (sm.id_short || "").trim()]
          );
        }
      }
      res.json({ ok: true });
    } catch (err) {
      console.error("PUT /api/use-cases error:", err);
      res.status(500).json({ error: "UPDATE_FAILED" });
    }
  });

  router.delete("/api/use-cases/:caseId", auth.requireAuth, async (req, res) => {
    try {
      await db.run(
        "DELETE FROM ucc_use_cases WHERE case_id = ? AND user_id = ?",
        [req.params.caseId, req.user.id]
      );
      res.json({ ok: true });
    } catch (err) {
      console.error("DELETE /api/use-cases error:", err);
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // ==================== OVERVIEW ====================

  router.get("/api/overview", auth.requireAuth, async (req, res) => {
    try {
      const rows = await db.all(
        `SELECT a.entry_id, a.aas_id, a.source_id, s.name AS source_name, s.base_url,
                e.evaluated_at, e.results_json
         FROM ucc_source_aas a
         JOIN ucc_sources s ON s.source_id = a.source_id
         LEFT JOIN ucc_evaluations e ON e.aas_id = a.aas_id AND e.user_id = a.user_id AND e.source_id = a.source_id
         WHERE a.user_id = ?
         ORDER BY s.name ASC, a.aas_id ASC`,
        [req.user.id]
      );
      const items = rows.map(r => {
        let status = "pending", pass_count = null, total_count = null;
        if (r.results_json) {
          try {
            const parsed = JSON.parse(r.results_json);
            const results = Array.isArray(parsed) ? parsed : (parsed.results || []);
            total_count = results.length;
            pass_count = results.filter(x => x.passed).length;
            if (total_count === 0) status = "pending";
            else if (pass_count === total_count) status = "pass";
            else if (pass_count === 0) status = "fail";
            else status = "partial";
          } catch { /* keep pending */ }
        }
        return {
          entry_id: r.entry_id, aas_id: r.aas_id, source_id: r.source_id,
          source_name: r.source_name, base_url: r.base_url,
          last_evaluated: r.evaluated_at || null,
          pass_count, total_count, status
        };
      });
      res.json({ items });
    } catch (err) {
      console.error("GET /api/overview error:", err);
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // ==================== CACHED EVALUATION ====================

  router.get("/api/evaluation/:sourceId/:aasId", auth.requireAuth, async (req, res) => {
    try {
      const { sourceId } = req.params;
      const aasId = decodeURIComponent(req.params.aasId);
      const row = await db.get(
        "SELECT results_json, evaluated_at FROM ucc_evaluations WHERE aas_id = ? AND user_id = ? AND source_id = ?",
        [aasId, req.user.id, sourceId]
      );
      if (!row) return res.status(404).json({ error: "NOT_FOUND" });
      const data = JSON.parse(row.results_json || "{}");
      res.json({ ...data, evaluated_at: row.evaluated_at });
    } catch (err) {
      console.error("GET /api/evaluation error:", err);
      res.status(500).json({ error: "LOAD_FAILED" });
    }
  });

  // ==================== EVALUATION ====================

  router.post("/api/evaluate/:sourceId/:aasId", auth.requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { sourceId } = req.params;
      const aasId = decodeURIComponent(req.params.aasId);

      // Verify source belongs to user
      const source = await db.get(
        "SELECT source_id, base_url FROM ucc_sources WHERE source_id = ? AND user_id = ?",
        [sourceId, userId]
      );
      if (!source) return res.status(404).json({ error: "SOURCE_NOT_FOUND" });

      const baseUrl = source.base_url.replace(/\/+$/, "");
      const encoded = toBase64Url(aasId);

      // 1. Fetch shell
      const shellResp = await fetch(`${baseUrl}/shells/${encoded}`, {
        signal: AbortSignal.timeout(15000),
        headers: { Accept: "application/json" },
      });
      if (!shellResp.ok) {
        return res.status(502).json({ error: "SHELL_FETCH_FAILED", status: shellResp.status });
      }
      const shellData = await shellResp.json();

      // 2. Fetch submodels
      const submodelRefs = shellData.submodels || [];
      const submodels = [];
      for (const ref of submodelRefs) {
        const smId = ref.keys?.[0]?.value;
        if (!smId) continue;
        try {
          const smEncoded = toBase64Url(smId);
          const smResp = await fetch(`${baseUrl}/submodels/${smEncoded}`, {
            signal: AbortSignal.timeout(15000),
            headers: { Accept: "application/json" },
          });
          if (smResp.ok) submodels.push(await smResp.json());
        } catch { /* skip failed submodel */ }
      }

      // 3. Collect semantic IDs + submodel details
      const foundSemanticIds = new Set();
      const submodelDetails = [];
      for (const sm of submodels) {
        const semId = sm.semanticId?.keys?.[0]?.value || "";
        if (semId) foundSemanticIds.add(semId);
        submodelDetails.push({
          id: sm.id || "",
          idShort: sm.idShort || "",
          semanticId: semId
        });
      }

      // 4. AAS meta info
      const aasMeta = {
        id: shellData.id || "",
        idShort: shellData.idShort || "",
        assetId: shellData.assetInformation?.globalAssetId || "",
        description: (shellData.description || []).map(d => d.text).join("; ") || ""
      };

      // 5. Load use cases + evaluate
      const useCases = await db.all(
        "SELECT case_id, name, description FROM ucc_use_cases WHERE user_id = ? ORDER BY created_at ASC",
        [userId]
      );
      const results = [];
      for (const uc of useCases) {
        const reqSms = await db.all(
          "SELECT semantic_id, id_short FROM ucc_required_submodels WHERE case_id = ? ORDER BY rowid ASC",
          [uc.case_id]
        );
        const details = reqSms.map(r => ({
          semantic_id: r.semantic_id,
          id_short: r.id_short,
          found: foundSemanticIds.has(r.semantic_id)
        }));
        const passed = details.length > 0 && details.every(d => d.found);
        results.push({
          case_id: uc.case_id, name: uc.name, description: uc.description,
          passed, details
        });
      }

      // 6. Build full evaluation data
      const evalData = {
        aas_id: aasId,
        aas_meta: aasMeta,
        submodel_count: submodels.length,
        submodel_details: submodelDetails,
        results
      };

      // 7. Cache result
      const now = new Date().toISOString().replace("T", " ").slice(0, 19);
      await db.run(
        `INSERT INTO ucc_evaluations (eval_id, user_id, aas_id, source_id, shell_data, results_json, evaluated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, aas_id, source_id) DO UPDATE SET
           shell_data=excluded.shell_data,
           results_json=excluded.results_json, evaluated_at=excluded.evaluated_at`,
        [uid(), userId, aasId, sourceId, JSON.stringify(shellData), JSON.stringify(evalData), now]
      );

      res.json({ ...evalData, evaluated_at: now });
    } catch (err) {
      console.error("POST /api/evaluate error:", err);
      res.status(500).json({ error: "EVAL_FAILED" });
    }
  });
}

module.exports = { initUccTables, mountRoutes };
