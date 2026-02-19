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

const app = express();
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

// --- Middleware ---
app.use(express.json({ limit: "2mb" }));

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

// --- Central API ---
app.get("/api/me", auth.requireAuth, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    picture: req.user.picture,
  });
});

app.get("/api/apps", auth.requireAuth, (req, res) => {
  res.json({ apps: registry.getApps() });
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
app.get("/apps/kanban", auth.requireAuthPage, (req, res) => {
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

// --- 404 fallback ---
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// --- Start ---
async function start() {
  db.open(dbPath);
  await auth.initAuthTables();
  await kanbanRoutes.initKanbanTables();
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
