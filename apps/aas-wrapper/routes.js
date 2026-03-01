const crypto = require("crypto");
const db = require("../../shared/db");
const auth = require("../../shared/auth");

// ── Base64-URL encoding (AAS V3 spec) ──────────────────────
function toBase64Url(str) {
  return Buffer.from(str, "utf-8").toString("base64url");
}

// ── Concurrency-limited parallel fetch ──────────────────────
async function parallelFetch(items, fn, concurrency = 5) {
  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      try { results[i] = await fn(items[i]); } catch (err) { results[i] = { __error: err.message }; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

// ── Building-State (in-memory, transient) ───────────────────
const buildingSet = new Set();   // proxyIds currently building

// ── DB-backed cache helpers ─────────────────────────────────

async function getCacheStatus(proxyId) {
  const row = await db.get(
    "SELECT cache_last_refresh, cache_total_items, cache_errors FROM aas_proxies WHERE proxy_id = ?",
    [proxyId]
  );
  const shellCount = await db.get(
    "SELECT COUNT(*) AS cnt FROM aas_proxy_shells WHERE proxy_id = ?",
    [proxyId]
  );
  const errors = row?.cache_errors ? JSON.parse(row.cache_errors) : [];
  return {
    shellCount: shellCount?.cnt || 0,
    building: buildingSet.has(proxyId),
    lastRefresh: row?.cache_last_refresh || null,
    totalItems: row?.cache_total_items || 0,
    errorCount: errors.length,
    errors: errors.slice(0, 100),
  };
}

async function getShellsList(proxyId) {
  const rows = await db.all(
    "SELECT shell_json FROM aas_proxy_shells WHERE proxy_id = ?",
    [proxyId]
  );
  return {
    paging_metadata: { cursor: "" },
    result: rows.map(r => JSON.parse(r.shell_json)),
  };
}

function deleteCache(proxyId) {
  // DB rows cascade-deleted via FK; clean up timers
  if (autoRefreshTimers.has(proxyId)) {
    clearInterval(autoRefreshTimers.get(proxyId));
    autoRefreshTimers.delete(proxyId);
  }
}

// ── Cache Build ─────────────────────────────────────────────
async function buildCache(proxyId) {
  if (buildingSet.has(proxyId)) return;

  const config = await db.get(
    "SELECT * FROM aas_proxies WHERE proxy_id = ?",
    [proxyId]
  );
  if (!config?.aas_base_url || !config?.items_endpoint) return;

  buildingSet.add(proxyId);
  const errors = [];
  let totalItems = 0;

  try {
    const itemsUrl = config.items_endpoint.startsWith("http")
      ? config.items_endpoint
      : `${config.aas_base_url.replace(/\/+$/, "")}${config.items_endpoint}`;

    const itemsResp = await fetch(itemsUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(30000),
    });
    if (!itemsResp.ok) throw new Error(`Items endpoint HTTP ${itemsResp.status}`);
    const itemsData = await itemsResp.json();

    let itemIds;
    if (Array.isArray(itemsData)) itemIds = itemsData.map(String);
    else if (Array.isArray(itemsData.result)) itemIds = itemsData.result.map(String);
    else if (Array.isArray(itemsData.items)) itemIds = itemsData.items.map(String);
    else throw new Error("Unexpected items format");

    totalItems = itemIds.length;
    const baseUrl = config.aas_base_url.replace(/\/+$/, "");

    const results = await parallelFetch(itemIds, async (itemId) => {
      const encoded = toBase64Url(itemId);
      const resp = await fetch(`${baseUrl}/shells/${encoded}`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    }, 5);

    // Write shells to DB in a transaction
    await db.run("DELETE FROM aas_proxy_shells WHERE proxy_id = ?", [proxyId]);
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (r && r.__error) {
        errors.push({ itemId: itemIds[i], error: r.__error });
      } else if (r) {
        const aasId = r.id || itemIds[i];
        await db.run(
          "INSERT OR REPLACE INTO aas_proxy_shells (proxy_id, aas_id, shell_json) VALUES (?, ?, ?)",
          [proxyId, String(aasId), JSON.stringify(r)]
        );
      }
    }
  } catch (err) {
    errors.push({ itemId: "(items-endpoint)", error: err.message });
  }

  // Update status in DB
  const lastRefresh = new Date().toISOString();
  await db.run(
    "UPDATE aas_proxies SET cache_last_refresh = ?, cache_total_items = ?, cache_errors = ? WHERE proxy_id = ?",
    [lastRefresh, totalItems, JSON.stringify(errors), proxyId]
  );

  buildingSet.delete(proxyId);
  const shellCount = await db.get("SELECT COUNT(*) AS cnt FROM aas_proxy_shells WHERE proxy_id = ?", [proxyId]);
  console.log(`[AAS Proxy] Cache built for proxy ${proxyId}: ${shellCount?.cnt || 0} shells, ${errors.length} errors`);

  setupAutoRefresh(proxyId, config.auto_refresh_min);
}

// ── Auto-Refresh Timer ──────────────────────────────────────
const autoRefreshTimers = new Map();

function setupAutoRefresh(proxyId, minutes) {
  if (autoRefreshTimers.has(proxyId)) {
    clearInterval(autoRefreshTimers.get(proxyId));
    autoRefreshTimers.delete(proxyId);
  }
  if (minutes > 0) {
    const timer = setInterval(() => buildCache(proxyId), minutes * 60000);
    autoRefreshTimers.set(proxyId, timer);
  }
}

// ── DB Init ─────────────────────────────────────────────────
async function initAasWrapperTables() {
  await db.run(`CREATE TABLE IF NOT EXISTS aas_proxies (
    proxy_id           TEXT PRIMARY KEY,
    user_id            TEXT NOT NULL,
    name               TEXT NOT NULL DEFAULT 'Default',
    aas_base_url       TEXT NOT NULL DEFAULT '',
    items_endpoint     TEXT NOT NULL DEFAULT '',
    auto_refresh_min   INTEGER NOT NULL DEFAULT 0,
    cache_last_refresh TEXT,
    cache_total_items  INTEGER NOT NULL DEFAULT 0,
    cache_errors       TEXT NOT NULL DEFAULT '[]',
    created_at         TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS aas_proxy_shells (
    proxy_id   TEXT NOT NULL,
    aas_id     TEXT NOT NULL,
    shell_json TEXT NOT NULL,
    PRIMARY KEY (proxy_id, aas_id),
    FOREIGN KEY (proxy_id) REFERENCES aas_proxies(proxy_id) ON DELETE CASCADE
  )`);

  // Migrate: add cache columns if missing (existing DBs)
  const cols = await db.all("PRAGMA table_info(aas_proxies)");
  const colNames = cols.map(c => c.name);
  if (!colNames.includes("cache_last_refresh")) {
    await db.run("ALTER TABLE aas_proxies ADD COLUMN cache_last_refresh TEXT");
  }
  if (!colNames.includes("cache_total_items")) {
    await db.run("ALTER TABLE aas_proxies ADD COLUMN cache_total_items INTEGER NOT NULL DEFAULT 0");
  }
  if (!colNames.includes("cache_errors")) {
    await db.run("ALTER TABLE aas_proxies ADD COLUMN cache_errors TEXT NOT NULL DEFAULT '[]'");
  }

  // Start auto-refresh timers + immediate build for configured proxies
  const configs = await db.all(
    "SELECT proxy_id, auto_refresh_min FROM aas_proxies WHERE auto_refresh_min > 0"
  );
  for (const cfg of configs) {
    setupAutoRefresh(cfg.proxy_id, cfg.auto_refresh_min);
    buildCache(cfg.proxy_id);  // rebuild immediately on startup
    console.log(`[AAS Proxy] Auto-refresh for proxy ${cfg.proxy_id}: every ${cfg.auto_refresh_min} min (rebuilding now)`);
  }

  console.log("[AAS Proxy] Tables ready.");
}

// ── Middleware ───────────────────────────────────────────────
async function resolveProxy(req, res, next) {
  const proxyId = req.params.proxyId;
  if (!proxyId) return res.status(400).json({ error: "MISSING_PROXY_ID" });
  try {
    const row = await db.get(
      "SELECT * FROM aas_proxies WHERE proxy_id = ? AND user_id = ?",
      [proxyId, req.user.id]
    );
    if (!row) return res.status(404).json({ error: "PROXY_NOT_FOUND" });
    req.proxy = row;
    next();
  } catch {
    res.status(500).json({ error: "RESOLVE_FAILED" });
  }
}

// ── Routes ──────────────────────────────────────────────────
function mountRoutes(router) {

  // ── Proxy CRUD ──────────────────────────────────────────────

  // List proxies
  router.get("/api/proxies", auth.requireAuth, async (req, res) => {
    try {
      const rows = await db.all(
        "SELECT proxy_id, name, aas_base_url, auto_refresh_min, created_at FROM aas_proxies WHERE user_id = ? ORDER BY created_at",
        [req.user.id]
      );
      // Attach cache status to each proxy
      const proxies = [];
      for (const r of rows) {
        proxies.push({ ...r, ...(await getCacheStatus(r.proxy_id)) });
      }
      res.json({ proxies });
    } catch {
      res.status(500).json({ error: "LIST_FAILED" });
    }
  });

  // Create proxy
  router.post("/api/proxies", auth.requireAuth, async (req, res) => {
    try {
      const name = (req.body.name || "").trim() || "New Proxy";
      const proxyId = crypto.randomUUID();
      await db.run(
        "INSERT INTO aas_proxies (proxy_id, user_id, name) VALUES (?, ?, ?)",
        [proxyId, req.user.id, name]
      );
      res.json({ proxy_id: proxyId, name, created_at: new Date().toISOString() });
    } catch {
      res.status(500).json({ error: "CREATE_FAILED" });
    }
  });

  // Rename proxy
  router.put("/api/proxies/:proxyId", auth.requireAuth, resolveProxy, async (req, res) => {
    try {
      const name = (req.body.name || "").trim();
      if (!name) return res.status(400).json({ error: "NAME_REQUIRED" });
      await db.run("UPDATE aas_proxies SET name = ? WHERE proxy_id = ?", [name, req.proxy.proxy_id]);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "RENAME_FAILED" });
    }
  });

  // Delete proxy
  router.delete("/api/proxies/:proxyId", auth.requireAuth, resolveProxy, async (req, res) => {
    try {
      await db.run("DELETE FROM aas_proxy_shells WHERE proxy_id = ?", [req.proxy.proxy_id]);
      await db.run("DELETE FROM aas_proxies WHERE proxy_id = ?", [req.proxy.proxy_id]);
      deleteCache(req.proxy.proxy_id);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "DELETE_FAILED" });
    }
  });

  // ── Proxy Config ────────────────────────────────────────────

  // GET config
  router.get("/api/proxies/:proxyId/config", auth.requireAuth, resolveProxy, (req, res) => {
    res.json({
      aas_base_url: req.proxy.aas_base_url,
      items_endpoint: req.proxy.items_endpoint,
      auto_refresh_min: req.proxy.auto_refresh_min,
    });
  });

  // PUT config
  router.put("/api/proxies/:proxyId/config", auth.requireAuth, resolveProxy, async (req, res) => {
    try {
      const { aas_base_url, items_endpoint, auto_refresh_min } = req.body;
      const mins = parseInt(auto_refresh_min) || 0;
      await db.run(
        "UPDATE aas_proxies SET aas_base_url = ?, items_endpoint = ?, auto_refresh_min = ? WHERE proxy_id = ?",
        [aas_base_url || "", items_endpoint || "", mins, req.proxy.proxy_id]
      );
      setupAutoRefresh(req.proxy.proxy_id, mins);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "SAVE_FAILED" });
    }
  });

  // POST refresh
  router.post("/api/proxies/:proxyId/refresh", auth.requireAuth, resolveProxy, async (req, res) => {
    const status = await getCacheStatus(req.proxy.proxy_id);
    if (status.building) return res.status(409).json({ error: "BUILD_IN_PROGRESS" });
    buildCache(req.proxy.proxy_id);
    res.json({ ok: true, message: "Cache rebuild started" });
  });

  // GET status
  router.get("/api/proxies/:proxyId/status", auth.requireAuth, resolveProxy, async (req, res) => {
    res.json(await getCacheStatus(req.proxy.proxy_id));
  });

  // ── AAS V3 Standard Endpoints (per proxy) ───────────────────

  // Shared proxy handler — forwards to the real AAS repo
  async function proxyHandler(req, res) {
    try {
      if (!req.proxy?.aas_base_url) return res.status(503).json({ error: "NOT_CONFIGURED" });
      // req.path = /{proxyId}/shells/... → strip /{proxyId} to get AAS V3 path
      const aasPath = req.path.substring(1 + req.proxy.proxy_id.length);
      const qs = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
      const url = `${req.proxy.aas_base_url.replace(/\/+$/, "")}${aasPath}${qs}`;
      const resp = await fetch(url, {
        headers: { Accept: req.headers.accept || "application/json" },
        signal: AbortSignal.timeout(15000),
      });
      const ct = resp.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await resp.json();
        res.status(resp.status).json(data);
      } else {
        const buf = Buffer.from(await resp.arrayBuffer());
        res.status(resp.status).set("Content-Type", ct || "application/octet-stream").send(buf);
      }
    } catch (err) {
      res.status(502).json({ error: "PROXY_ERROR", message: err.message });
    }
  }

  // Cached shells list
  router.get("/:proxyId/shells", auth.requireAuth, resolveProxy, async (req, res) => {
    res.json(await getShellsList(req.proxy.proxy_id));
  });

  // Shell endpoints
  router.get("/:proxyId/shells/:aasId", auth.requireAuth, resolveProxy, proxyHandler);
  router.get("/:proxyId/shells/:aasId/asset-information", auth.requireAuth, resolveProxy, proxyHandler);
  router.get("/:proxyId/shells/:aasId/asset-information/thumbnail", auth.requireAuth, resolveProxy, proxyHandler);
  router.get("/:proxyId/shells/:aasId/submodel-refs", auth.requireAuth, resolveProxy, proxyHandler);
  router.get("/:proxyId/shells/:aasId/submodels/:smId", auth.requireAuth, resolveProxy, proxyHandler);

  // Submodel endpoints
  router.get("/:proxyId/submodels/:smId", auth.requireAuth, resolveProxy, proxyHandler);
  router.get("/:proxyId/submodels/:smId/submodel-elements/*", auth.requireAuth, resolveProxy, proxyHandler);

  // Utility endpoints
  router.get("/:proxyId/description", auth.requireAuth, resolveProxy, proxyHandler);
  router.get("/:proxyId/serialization", auth.requireAuth, resolveProxy, proxyHandler);
}

module.exports = { initAasWrapperTables, mountRoutes };
