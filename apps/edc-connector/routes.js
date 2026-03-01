const db = require("../../shared/db");
const auth = require("../../shared/auth");
const dockerManager = require("./docker-manager");

// ── DB Init ─────────────────────────────────────────────────
async function initEdcTables() {
  // Migration: drop old workspace-based tables
  const wsTable = await db.get(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='edc_workspaces'"
  );
  if (wsTable) {
    await db.run("DROP TABLE IF EXISTS edc_comm_log");
    await db.run("DROP TABLE IF EXISTS edc_saved_objects");
    await db.run("DROP TABLE IF EXISTS edc_workspaces");
    console.log("[EDC Connector] Migrated: dropped old workspace-based tables.");
  }

  await db.run(`CREATE TABLE IF NOT EXISTS edc_comm_log (
    log_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       TEXT NOT NULL,
    side          TEXT NOT NULL,
    direction     TEXT NOT NULL,
    method        TEXT NOT NULL DEFAULT 'POST',
    endpoint      TEXT NOT NULL DEFAULT '',
    status_code   INTEGER,
    body_json     TEXT NOT NULL DEFAULT '{}',
    duration_ms   INTEGER,
    error         TEXT,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS edc_saved_objects (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       TEXT NOT NULL,
    side          TEXT NOT NULL,
    obj_type      TEXT NOT NULL,
    obj_id        TEXT NOT NULL,
    obj_json      TEXT NOT NULL DEFAULT '{}',
    status        TEXT NOT NULL DEFAULT '',
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  console.log("[EDC Connector] Tables ready.");
}

// ── Routes ──────────────────────────────────────────────────
function mountRoutes(router) {

  // ── Docker Container Management ─────────────────────────

  router.get("/api/edc/status", auth.requireAuth, async (req, res) => {
    try {
      const status = await dockerManager.getStatus();
      const config = dockerManager.getEdcConfig();
      res.json({ status, config });
    } catch (err) {
      res.status(500).json({ error: "STATUS_CHECK_FAILED", message: err.message });
    }
  });

  router.post("/api/edc/start", auth.requireAuth, async (req, res) => {
    try {
      const status = await dockerManager.startContainers();
      res.json({ ok: true, status });
    } catch (err) {
      res.status(500).json({ error: "START_FAILED", message: err.message });
    }
  });

  router.post("/api/edc/stop", auth.requireAuth, async (req, res) => {
    try {
      const status = await dockerManager.stopContainers();
      res.json({ ok: true, status });
    } catch (err) {
      res.status(500).json({ error: "STOP_FAILED", message: err.message });
    }
  });

  router.post("/api/edc/restart", auth.requireAuth, async (req, res) => {
    try {
      const status = await dockerManager.restartContainers();
      res.json({ ok: true, status });
    } catch (err) {
      res.status(500).json({ error: "RESTART_FAILED", message: err.message });
    }
  });

  // ── EDC Proxy ───────────────────────────────────────────

  router.post("/api/proxy", auth.requireAuth, async (req, res) => {
    const { side, method, path: edcPath, body: edcBody } = req.body;

    if (!side || !["provider", "consumer"].includes(side)) {
      return res.status(400).json({ error: "INVALID_SIDE" });
    }
    if (!method || !["GET", "POST", "PUT", "DELETE"].includes(method.toUpperCase())) {
      return res.status(400).json({ error: "INVALID_METHOD" });
    }
    if (!edcPath) {
      return res.status(400).json({ error: "MISSING_PATH" });
    }

    const config = dockerManager.EDC_CONFIG[side];
    const baseUrl = config.managementUrl;
    const apiKey = config.apiKey;
    const fullUrl = `${baseUrl.replace(/\/+$/, "")}${edcPath}`;
    const httpMethod = method.toUpperCase();

    // Log request
    const reqBodyJson = edcBody ? JSON.stringify(edcBody) : "{}";
    await db.run(
      "INSERT INTO edc_comm_log (user_id, side, direction, method, endpoint, body_json) VALUES (?, ?, 'request', ?, ?, ?)",
      [req.user.id, side, httpMethod, edcPath, reqBodyJson]
    );

    const startTime = Date.now();
    try {
      const fetchOpts = {
        method: httpMethod,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        signal: AbortSignal.timeout(30000),
      };
      if (apiKey) fetchOpts.headers["X-Api-Key"] = apiKey;
      if (edcBody && (httpMethod === "POST" || httpMethod === "PUT")) {
        fetchOpts.body = JSON.stringify(edcBody);
      }

      const resp = await fetch(fullUrl, fetchOpts);
      const duration = Date.now() - startTime;
      let respBody;
      const ct = resp.headers.get("content-type") || "";
      if (ct.includes("json")) {
        respBody = await resp.json();
      } else {
        const text = await resp.text();
        respBody = text ? { _raw: text } : {};
      }

      // Log response
      await db.run(
        "INSERT INTO edc_comm_log (user_id, side, direction, method, endpoint, status_code, body_json, duration_ms) VALUES (?, ?, 'response', ?, ?, ?, ?, ?)",
        [req.user.id, side, httpMethod, edcPath, resp.status, JSON.stringify(respBody), duration]
      );

      res.json({ status: resp.status, body: respBody, duration });
    } catch (err) {
      const duration = Date.now() - startTime;
      await db.run(
        "INSERT INTO edc_comm_log (user_id, side, direction, method, endpoint, error, duration_ms) VALUES (?, ?, 'response', ?, ?, ?, ?)",
        [req.user.id, side, httpMethod, edcPath, err.message, duration]
      );
      res.json({ status: 0, body: null, error: err.message, duration });
    }
  });

  // ── Fetch transferred data via EDR ─────────────────────
  router.post("/api/fetch-data", auth.requireAuth, async (req, res) => {
    const { endpoint, authorization } = req.body;
    if (!endpoint) return res.status(400).json({ error: "MISSING_ENDPOINT" });
    try {
      // Rewrite EDC-internal hostnames to reachable addresses
      const pHost = dockerManager.EDC_CONFIG.provider.publicUrl.replace("/public", "");
      const cHost = dockerManager.EDC_CONFIG.consumer.publicUrl.replace("/public", "");
      const resolvedEndpoint = endpoint
        .replace(/http:\/\/provider:19291/, pHost)
        .replace(/http:\/\/consumer:29291/, cHost);
      const headers = { "Accept": "application/json" };
      if (authorization) headers["Authorization"] = authorization;
      const startTime = Date.now();
      const resp = await fetch(resolvedEndpoint, { headers, signal: AbortSignal.timeout(30000) });
      const duration = Date.now() - startTime;
      const ct = resp.headers.get("content-type") || "";
      let body;
      if (ct.includes("json")) {
        body = await resp.json();
      } else {
        body = { _raw: await resp.text() };
      }

      // Log the data fetch
      await db.run(
        "INSERT INTO edc_comm_log (user_id, side, direction, method, endpoint, body_json) VALUES (?, 'consumer', 'request', 'GET', ?, ?)",
        [req.user.id, "EDR → " + endpoint, "{}"]
      );
      await db.run(
        "INSERT INTO edc_comm_log (user_id, side, direction, method, endpoint, status_code, body_json, duration_ms) VALUES (?, 'consumer', 'response', 'GET', ?, ?, ?, ?)",
        [req.user.id, "EDR → " + endpoint, resp.status, JSON.stringify(body), duration]
      );

      res.json({ status: resp.status, body, duration });
    } catch (err) {
      res.json({ status: 0, body: null, error: err.message });
    }
  });

  // ── Communication Log ───────────────────────────────────

  router.get("/api/log", auth.requireAuth, async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 100, 500);
      const offset = parseInt(req.query.offset) || 0;
      const side = req.query.side;
      let sql = "SELECT * FROM edc_comm_log WHERE user_id = ?";
      const params = [req.user.id];
      if (side && ["provider", "consumer"].includes(side)) {
        sql += " AND side = ?";
        params.push(side);
      }
      sql += " ORDER BY log_id DESC LIMIT ? OFFSET ?";
      params.push(limit, offset);
      const rows = await db.all(sql, params);
      const countRow = await db.get(
        "SELECT COUNT(*) AS total FROM edc_comm_log WHERE user_id = ?",
        [req.user.id]
      );
      res.json({ entries: rows.reverse(), total: countRow?.total || 0 });
    } catch {
      res.status(500).json({ error: "LOG_FAILED" });
    }
  });

  router.delete("/api/log", auth.requireAuth, async (req, res) => {
    try {
      await db.run("DELETE FROM edc_comm_log WHERE user_id = ?", [req.user.id]);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "CLEAR_LOG_FAILED" });
    }
  });

  // ── Saved Objects ───────────────────────────────────────

  router.get("/api/objects", auth.requireAuth, async (req, res) => {
    try {
      let sql = "SELECT * FROM edc_saved_objects WHERE user_id = ?";
      const params = [req.user.id];
      if (req.query.side) { sql += " AND side = ?"; params.push(req.query.side); }
      if (req.query.type) { sql += " AND obj_type = ?"; params.push(req.query.type); }
      sql += " ORDER BY created_at DESC";
      const rows = await db.all(sql, params);
      res.json({ objects: rows });
    } catch {
      res.status(500).json({ error: "LIST_OBJECTS_FAILED" });
    }
  });

  router.post("/api/objects", auth.requireAuth, async (req, res) => {
    try {
      const { side, obj_type, obj_id, obj_json, status } = req.body;
      if (!side || !obj_type || !obj_id) return res.status(400).json({ error: "MISSING_FIELDS" });
      const existing = await db.get(
        "SELECT id FROM edc_saved_objects WHERE user_id = ? AND side = ? AND obj_type = ? AND obj_id = ?",
        [req.user.id, side, obj_type, obj_id]
      );
      if (existing) {
        await db.run(
          "UPDATE edc_saved_objects SET obj_json = ?, status = ?, updated_at = datetime('now') WHERE id = ?",
          [JSON.stringify(obj_json || {}), status || "", existing.id]
        );
        res.json({ ok: true, id: existing.id });
      } else {
        await db.run(
          "INSERT INTO edc_saved_objects (user_id, side, obj_type, obj_id, obj_json, status) VALUES (?, ?, ?, ?, ?, ?)",
          [req.user.id, side, obj_type, obj_id, JSON.stringify(obj_json || {}), status || ""]
        );
        res.json({ ok: true });
      }
    } catch {
      res.status(500).json({ error: "SAVE_OBJECT_FAILED" });
    }
  });

  router.put("/api/objects/:objId", auth.requireAuth, async (req, res) => {
    try {
      const { obj_json, status } = req.body;
      const updates = [];
      const params = [];
      if (obj_json !== undefined) { updates.push("obj_json = ?"); params.push(JSON.stringify(obj_json)); }
      if (status !== undefined) { updates.push("status = ?"); params.push(status); }
      if (!updates.length) return res.status(400).json({ error: "NOTHING_TO_UPDATE" });
      updates.push("updated_at = datetime('now')");
      params.push(req.params.objId, req.user.id);
      await db.run(`UPDATE edc_saved_objects SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`, params);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "UPDATE_OBJECT_FAILED" });
    }
  });

  router.delete("/api/objects/:objId", auth.requireAuth, async (req, res) => {
    try {
      await db.run(
        "DELETE FROM edc_saved_objects WHERE id = ? AND user_id = ?",
        [req.params.objId, req.user.id]
      );
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "DELETE_OBJECT_FAILED" });
    }
  });
}

module.exports = { initEdcTables, mountRoutes };
