const express = require("express");
const path = require("path");
const fs = require("fs");

// Load .env file (no external dependency needed)
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const db = require("./shared/db");
const auth = require("./shared/auth");
const registry = require("./shared/app-registry");
const kanbanRoutes = require("./apps/kanban/routes");
const dtiRoutes = require("./apps/dti-connector/routes");
const cardScannerRoutes = require("./apps/card-scanner/routes");
const aasChatRoutes = require("./apps/aas-chat/routes");
const kbRoutes = require("./apps/knowledge-base/routes");

const app = express();
const dtiDir = path.join(__dirname, "apps", "dti-connector");
const cardScannerDir = path.join(__dirname, "apps", "card-scanner");
const aasChatDir = path.join(__dirname, "apps", "aas-chat");
const kbDir = path.join(__dirname, "apps", "knowledge-base");
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "platform.db");

// Paths
const platformDir = path.join(__dirname, "platform");
const kanbanDir = path.join(__dirname, "apps", "kanban");

// --- Register Apps ---
registry.register({
  id: "kanban",
  name: "Kanban Board",
  description: "Projekte und Tasks verwalten",
  icon: "kanban",
  path: "/apps/kanban",
  color: "#2563eb",
});

registry.register({
  id: "dti-connector",
  name: "DTI Connector",
  description: "Daten erstellen und bereitstellen",
  icon: "dti-connector",
  path: "/apps/dti-connector",
  color: "#0891b2",
});

registry.register({
  id: "card-scanner",
  name: "Card Scanner",
  description: "Visitenkarten scannen und verwalten",
  icon: "card-scanner",
  path: "/apps/card-scanner",
  color: "#7c3aed",
});

registry.register({
  id: "aas-chat",
  name: "AAS Chat",
  description: "KI-Chat für Verwaltungsschalen",
  icon: "aas-chat",
  path: "/apps/aas-chat",
  color: "#059669",
});

registry.register({
  id: "knowledge-base",
  name: "Knowledge Base",
  description: "Dokumente hochladen und als Wissensquelle nutzen",
  icon: "knowledge-base",
  path: "/apps/knowledge-base",
  color: "#f59e0b",
});

// --- Middleware ---
app.use(express.json({ limit: "5mb" }));

// --- Platform static assets ---
app.get("/dashboard.css", (req, res) => {
  res.sendFile(path.join(platformDir, "dashboard.css"));
});

app.get("/dashboard.js", (req, res) => {
  res.sendFile(path.join(platformDir, "dashboard.js"));
});

// --- Auth routes ---
auth.mountAuthRoutes(app);

// --- Page routes ---
app.get("/", async (req, res) => {
  try {
    const user = await auth.getSessionUser(req);
    if (user) {
      res.redirect("/dashboard");
      return;
    }
    res.sendFile(path.join(platformDir, "login.html"));
  } catch {
    res.sendFile(path.join(platformDir, "login.html"));
  }
});

app.get("/dashboard", auth.requireAuthPage, (req, res) => {
  res.sendFile(path.join(platformDir, "dashboard.html"));
});

// --- App access guard ---
function requireAppAccess(appId) {
  return async (req, res, next) => {
    if (req.user.isSuperadmin) return next();
    const row = await db.get(
      "SELECT 1 FROM user_app_access WHERE user_id = ? AND app_id = ?",
      [req.user.id, appId]
    );
    if (row) return next();
    res.redirect("/dashboard");
  };
}

// --- Central API ---
app.get("/api/me", auth.requireAuth, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    picture: req.user.picture,
    role: req.user.role,
    isAdmin: req.user.isAdmin,
  });
});

app.get("/api/apps", auth.requireAuth, async (req, res) => {
  const allApps = registry.getApps();
  if (req.user.isSuperadmin) {
    return res.json({ apps: allApps });
  }
  const rows = await db.all(
    "SELECT app_id FROM user_app_access WHERE user_id = ?",
    [req.user.id]
  );
  const allowed = new Set(rows.map((r) => r.app_id));
  res.json({ apps: allApps.filter((a) => allowed.has(a.id)) });
});

// --- Kanban App ---

// Kanban static files
app.get("/apps/kanban/styles.css", (req, res) => {
  res.sendFile(path.join(kanbanDir, "styles.css"));
});

app.get("/apps/kanban/app.js", (req, res) => {
  res.sendFile(path.join(kanbanDir, "app.js"));
});

// Kanban page
app.get("/apps/kanban", auth.requireAuthPage, requireAppAccess("kanban"), (req, res) => {
  res.sendFile(path.join(kanbanDir, "index.html"));
});

// Legacy invite redirect
app.get("/invite/:token", auth.requireAuthPage, (req, res) => {
  res.redirect(`/apps/kanban?invite=${encodeURIComponent(req.params.token || "")}`);
});

// Kanban API routes (mounted under /apps/kanban)
const kanbanRouter = express.Router();
kanbanRoutes.mountRoutes(kanbanRouter);
app.use("/apps/kanban", kanbanRouter);

// --- DTI Connector App ---

app.get("/apps/dti-connector/styles.css", (req, res) => {
  res.sendFile(path.join(dtiDir, "styles.css"));
});

app.get("/apps/dti-connector/app.js", (req, res) => {
  res.sendFile(path.join(dtiDir, "app.js"));
});

app.get("/apps/dti-connector", auth.requireAuthPage, requireAppAccess("dti-connector"), (req, res) => {
  res.sendFile(path.join(dtiDir, "index.html"));
});

app.get("/apps/dti-connector/docs", auth.requireAuthPage, requireAppAccess("dti-connector"), (req, res) => {
  res.sendFile(path.join(dtiDir, "docs.html"));
});

// DTI API routes (mounted under /apps/dti-connector)
const dtiRouter = express.Router();
dtiRoutes.mountRoutes(dtiRouter);
app.use("/apps/dti-connector", dtiRouter);

// --- Card Scanner App ---

app.get("/apps/card-scanner/styles.css", (req, res) => {
  res.sendFile(path.join(cardScannerDir, "styles.css"));
});

app.get("/apps/card-scanner/app.js", (req, res) => {
  res.sendFile(path.join(cardScannerDir, "app.js"));
});

app.get("/apps/card-scanner", auth.requireAuthPage, requireAppAccess("card-scanner"), (req, res) => {
  res.sendFile(path.join(cardScannerDir, "index.html"));
});

// Card Scanner API routes (mounted under /apps/card-scanner)
const cardScannerRouter = express.Router();
cardScannerRoutes.mountRoutes(cardScannerRouter);
app.use("/apps/card-scanner", cardScannerRouter);

// --- AAS Chat App ---

app.get("/apps/aas-chat/styles.css", (req, res) => {
  res.sendFile(path.join(aasChatDir, "styles.css"));
});

app.get("/apps/aas-chat/app.js", (req, res) => {
  res.sendFile(path.join(aasChatDir, "app.js"));
});

app.get("/apps/aas-chat", auth.requireAuthPage, requireAppAccess("aas-chat"), (req, res) => {
  res.sendFile(path.join(aasChatDir, "index.html"));
});

// AAS Chat API routes (mounted under /apps/aas-chat)
const aasChatRouter = express.Router();
aasChatRoutes.mountRoutes(aasChatRouter);
app.use("/apps/aas-chat", aasChatRouter);

// --- Knowledge Base App ---

app.get("/apps/knowledge-base/styles.css", (req, res) => {
  res.sendFile(path.join(kbDir, "styles.css"));
});

app.get("/apps/knowledge-base/app.js", (req, res) => {
  res.sendFile(path.join(kbDir, "app.js"));
});

app.get("/apps/knowledge-base", auth.requireAuthPage, requireAppAccess("knowledge-base"), (req, res) => {
  res.sendFile(path.join(kbDir, "index.html"));
});

// Knowledge Base API routes (mounted under /apps/knowledge-base)
const kbRouter = express.Router();
kbRoutes.mountRoutes(kbRouter);
app.use("/apps/knowledge-base", kbRouter);

// --- Admin ---
const adminDir = path.join(platformDir, "admin");

app.get("/admin/admin.css", (req, res) => {
  res.sendFile(path.join(adminDir, "admin.css"));
});

app.get("/admin/admin.js", (req, res) => {
  res.sendFile(path.join(adminDir, "admin.js"));
});

app.get("/admin", auth.requireAdminPage, (req, res) => {
  res.sendFile(path.join(adminDir, "admin.html"));
});

// Admin API
app.get("/api/admin/users", auth.requireAdmin, async (req, res) => {
  try {
    const users = await db.all(
      `SELECT u.id, u.email, u.name, u.picture, u.created_at,
              COALESCE(ur.role, 'user') AS role
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       ORDER BY u.created_at ASC`
    );
    const access = await db.all("SELECT user_id, app_id FROM user_app_access");
    const accessMap = {};
    for (const a of access) {
      if (!accessMap[a.user_id]) accessMap[a.user_id] = [];
      accessMap[a.user_id].push(a.app_id);
    }
    const result = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      picture: u.picture,
      createdAt: u.created_at,
      role: u.email === auth.SUPERADMIN_EMAIL ? "superadmin" : u.role,
      isSuperadmin: u.email === auth.SUPERADMIN_EMAIL,
      apps: accessMap[u.id] || [],
    }));
    res.json({ users: result });
  } catch (err) {
    res.status(500).json({ error: "LOAD_USERS_FAILED" });
  }
});

app.put("/api/admin/users/:userId/role", auth.requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body || {};
    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "INVALID_ROLE" });
    }
    // Cannot edit superadmin
    const target = await db.get("SELECT email FROM users WHERE id = ?", [userId]);
    if (!target) return res.status(404).json({ error: "USER_NOT_FOUND" });
    if (target.email === auth.SUPERADMIN_EMAIL) {
      return res.status(403).json({ error: "CANNOT_EDIT_SUPERADMIN" });
    }
    await db.run(
      `INSERT INTO user_roles (user_id, role) VALUES (?, ?)
       ON CONFLICT(user_id) DO UPDATE SET role = excluded.role`,
      [userId, role]
    );
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "UPDATE_ROLE_FAILED" });
  }
});

app.put("/api/admin/users/:userId/access", auth.requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { appId, granted } = req.body || {};
    if (!appId || typeof granted !== "boolean") {
      return res.status(400).json({ error: "INVALID_PARAMS" });
    }
    const target = await db.get("SELECT email FROM users WHERE id = ?", [userId]);
    if (!target) return res.status(404).json({ error: "USER_NOT_FOUND" });
    if (target.email === auth.SUPERADMIN_EMAIL) {
      return res.status(403).json({ error: "CANNOT_EDIT_SUPERADMIN" });
    }
    if (granted) {
      await db.run(
        "INSERT OR IGNORE INTO user_app_access (user_id, app_id) VALUES (?, ?)",
        [userId, appId]
      );
    } else {
      await db.run(
        "DELETE FROM user_app_access WHERE user_id = ? AND app_id = ?",
        [userId, appId]
      );
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "UPDATE_ACCESS_FAILED" });
  }
});

app.delete("/api/admin/users/:userId", auth.requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const target = await db.get("SELECT email FROM users WHERE id = ?", [userId]);
    if (!target) return res.status(404).json({ error: "USER_NOT_FOUND" });
    if (target.email === auth.SUPERADMIN_EMAIL) {
      return res.status(403).json({ error: "CANNOT_DELETE_SUPERADMIN" });
    }
    if (userId === req.user.id) {
      return res.status(403).json({ error: "CANNOT_DELETE_SELF" });
    }
    // 1. Delete physical files
    const userFilesDir = path.join(dataDir, "dti-files", userId);
    if (fs.existsSync(userFilesDir)) {
      fs.rmSync(userFilesDir, { recursive: true, force: true });
    }
    const userKbDir = path.join(dataDir, "kb-files", userId);
    if (fs.existsSync(userKbDir)) {
      fs.rmSync(userKbDir, { recursive: true, force: true });
    }
    // 2. Delete DTI connectors (CASCADE handles all data tables)
    await db.run("DELETE FROM dti_connectors WHERE user_id = ?", [userId]);
    // 2b. Delete KB documents
    await db.run("DELETE FROM kb_documents WHERE user_id = ?", [userId]);
    await db.run("DELETE FROM kb_settings WHERE user_id = ?", [userId]);
    // 3. Delete platform access tables
    await db.run("DELETE FROM user_app_access WHERE user_id = ?", [userId]);
    await db.run("DELETE FROM user_roles WHERE user_id = ?", [userId]);
    // 4. Delete user (CASCADE: sessions, user_state, projects, project_members, project_invites, project_activities)
    await db.run("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "DELETE_USER_FAILED" });
  }
});

// --- 404 fallback ---
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// --- Start ---
async function start() {
  db.open(dbPath);
  await auth.initAuthTables();
  await kanbanRoutes.initKanbanTables();
  await dtiRoutes.initDtiTables();
  await cardScannerRoutes.initCardScannerTables();
  await aasChatRoutes.initAasChatTables();
  await kbRoutes.initKnowledgeBaseTables();
  auth.startMaintenanceJobs();

  // Also run invite cleanup periodically
  setInterval(async () => {
    try {
      await kanbanRoutes.cleanupInviteTable();
    } catch {
      // ignore
    }
  }, 5 * 60 * 1000);

  app.listen(PORT, () => {
    console.log(`Workspace server laeuft auf http://localhost:${PORT}`);
    if (!auth.oauthConfigured()) {
      console.warn("Google OAuth nicht konfiguriert. Setze GOOGLE_CLIENT_ID und GOOGLE_CLIENT_SECRET.");
    }
  });
}

start().catch((error) => {
  console.error("Server-Start fehlgeschlagen", error);
  process.exit(1);
});
