const crypto = require("crypto");
const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "kanban.db");
const boardPath = path.join(__dirname, "index.html");
const loginPath = path.join(__dirname, "login.html");
const appJsPath = path.join(__dirname, "app.js");
const stylesPath = path.join(__dirname, "styles.css");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL || `http://localhost:${PORT}/auth/google/callback`;

const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;
const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);
db.run("PRAGMA foreign_keys = ON");

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

async function initDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS app_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      state_json TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT,
      name TEXT,
      picture TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS user_state (
      user_id TEXT PRIMARY KEY,
      state_json TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      state_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS project_members (
      project_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (project_id, user_id),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS project_invites (
      token TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      email TEXT,
      role TEXT NOT NULL CHECK (role IN ('editor', 'viewer')),
      created_by TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS oauth_states (
      state TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run("CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)");
  await run("CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)");
  await run("CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id)");
  await run("CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id)");
  await run("CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at)");
  await run("CREATE INDEX IF NOT EXISTS idx_project_invites_expires_at ON project_invites(expires_at)");
  await run("CREATE INDEX IF NOT EXISTS idx_project_invites_project_id ON project_invites(project_id)");
}

function randomId(size = 32) {
  return crypto.randomBytes(size).toString("hex");
}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) {
    return cookies;
  }

  cookieHeader.split(";").forEach((part) => {
    const idx = part.indexOf("=");
    if (idx <= 0) {
      return;
    }
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    cookies[key] = decodeURIComponent(value);
  });

  return cookies;
}

function serializeCookie(name, value, options = {}) {
  const segments = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) {
    segments.push(`Max-Age=${Math.floor(options.maxAge)}`);
  }
  if (options.httpOnly) {
    segments.push("HttpOnly");
  }
  if (options.sameSite) {
    segments.push(`SameSite=${options.sameSite}`);
  }
  if (options.secure) {
    segments.push("Secure");
  }
  if (options.path) {
    segments.push(`Path=${options.path}`);
  }

  return segments.join("; ");
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function setCookie(res, name, value, options = {}) {
  const header = serializeCookie(name, value, options);
  const previous = res.getHeader("Set-Cookie");
  if (!previous) {
    res.setHeader("Set-Cookie", [header]);
    return;
  }
  const arr = Array.isArray(previous) ? previous : [String(previous)];
  arr.push(header);
  res.setHeader("Set-Cookie", arr);
}

function clearCookie(res, name) {
  setCookie(res, name, "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "Lax",
    secure: isProduction(),
  });
}

async function cleanupAuthTables() {
  const now = Date.now();
  await run("DELETE FROM oauth_states WHERE expires_at < ?", [now]);
  await run("DELETE FROM sessions WHERE expires_at < ?", [now]);
}

function startMaintenanceJobs() {
  const intervalMs = 5 * 60 * 1000;
  setInterval(async () => {
    try {
      await cleanupAuthTables();
      await cleanupInviteTable();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Wartungsjob fehlgeschlagen", error?.message || error);
    }
  }, intervalMs);
}

async function createSession(userId) {
  const sid = randomId(24);
  const expiresAt = Date.now() + SESSION_TTL_MS;
  await run("INSERT INTO sessions (sid, user_id, expires_at) VALUES (?, ?, ?)", [
    sid,
    userId,
    expiresAt,
  ]);
  return { sid, expiresAt };
}

async function getSessionUser(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  const sid = cookies.sid;
  if (!sid) {
    return null;
  }

  const row = await get(
    `
      SELECT sessions.sid, sessions.expires_at, users.id, users.email, users.name, users.picture
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.sid = ?
    `,
    [sid]
  );

  if (!row) {
    return null;
  }

  if (row.expires_at < Date.now()) {
    await run("DELETE FROM sessions WHERE sid = ?", [sid]);
    return null;
  }

  return {
    sid: row.sid,
    expiresAt: row.expires_at,
    id: row.id,
    email: row.email,
    name: row.name,
    picture: row.picture,
  };
}

async function requireAuth(req, res, next) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      res.status(401).json({ error: "UNAUTHORIZED" });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(500).json({ error: "AUTH_CHECK_FAILED" });
  }
}

async function requireAuthPage(req, res, next) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      res.redirect("/");
      return;
    }
    req.user = user;
    next();
  } catch {
    res.redirect("/");
  }
}

async function upsertUserFromGoogle(profile) {
  await run(
    `
      INSERT INTO users (id, email, name, picture, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        email = excluded.email,
        name = excluded.name,
        picture = excluded.picture,
        updated_at = CURRENT_TIMESTAMP
    `,
    [profile.sub, profile.email || "", profile.name || "", profile.picture || ""]
  );
}

function oauthConfigured() {
  return Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
}

function createDefaultColumns() {
  return ["Backlog", "In Arbeit", "Review", "Erledigt"].map((title) => ({
    id: randomId(8),
    title,
    cards: [],
  }));
}

function normalizeProjectCandidate(candidate = {}) {
  const name =
    typeof candidate?.name === "string" && candidate.name.trim() ? candidate.name.trim() : "Standardprojekt";
  const columns = Array.isArray(candidate?.columns) ? candidate.columns : createDefaultColumns();
  return { name, columns };
}

function extractLegacyProjects(legacyState) {
  if (!legacyState || typeof legacyState !== "object") {
    return [];
  }

  if (Array.isArray(legacyState.projects)) {
    return legacyState.projects
      .map((project) => normalizeProjectCandidate(project))
      .filter((project) => Array.isArray(project.columns));
  }

  if (Array.isArray(legacyState.columns)) {
    return [normalizeProjectCandidate({ name: "Standardprojekt", columns: legacyState.columns })];
  }

  return [];
}

async function createProjectForOwner(ownerId, candidate = {}) {
  const projectId = randomId(12);
  const normalized = normalizeProjectCandidate(candidate);
  const state = {
    id: projectId,
    name: normalized.name,
    columns: normalized.columns,
  };

  await run(
    "INSERT INTO projects (id, name, owner_id, state_json, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
    [projectId, normalized.name, ownerId, JSON.stringify(state)]
  );
  await run(
    "INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, 'owner')",
    [projectId, ownerId]
  );

  return projectId;
}

async function ensureUserProjects(userId) {
  const countRow = await get("SELECT COUNT(*) AS count FROM project_members WHERE user_id = ?", [userId]);
  if ((countRow?.count || 0) > 0) {
    return;
  }

  let legacyState = null;
  const legacyRow = await get("SELECT state_json FROM user_state WHERE user_id = ?", [userId]);
  if (legacyRow?.state_json) {
    try {
      legacyState = JSON.parse(legacyRow.state_json);
    } catch {
      legacyState = null;
    }
  }

  const projects = extractLegacyProjects(legacyState);
  if (!projects.length) {
    projects.push({ name: "Standardprojekt", columns: createDefaultColumns() });
  }

  for (const project of projects) {
    await createProjectForOwner(userId, project);
  }
}

function parseProjectRow(row) {
  let parsed = null;
  try {
    parsed = JSON.parse(row.state_json);
  } catch {
    parsed = null;
  }

  const project = normalizeProjectCandidate(parsed || { name: row.name, columns: createDefaultColumns() });
  project.id = row.id;
  project.name =
    typeof project.name === "string" && project.name.trim() ? project.name.trim() : row.name || "Standardprojekt";

  return {
    id: row.id,
    name: project.name,
    columns: project.columns,
    role: row.role,
    ownerId: row.owner_id,
    updatedAt: row.updated_at,
  };
}

async function getProjectForUser(projectId, userId) {
  const row = await get(
    `
      SELECT p.id, p.name, p.owner_id, p.state_json, p.updated_at, m.role
      FROM projects p
      JOIN project_members m ON m.project_id = p.id
      WHERE p.id = ? AND m.user_id = ?
    `,
    [projectId, userId]
  );

  if (!row) {
    return null;
  }
  return parseProjectRow(row);
}

function canWriteProject(role) {
  return role === "owner" || role === "editor";
}

function canManageProjectMembers(role) {
  return role === "owner";
}

function getBaseUrl(req) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = typeof forwardedProto === "string" ? forwardedProto.split(",")[0].trim() : req.protocol;
  return `${protocol}://${req.get("host")}`;
}

async function cleanupInviteTable() {
  await run("DELETE FROM project_invites WHERE expires_at < ?", [Date.now()]);
}

app.use(express.json({ limit: "2mb" }));

app.get("/styles.css", (req, res) => {
  res.sendFile(stylesPath);
});

app.get("/app.js", (req, res) => {
  res.sendFile(appJsPath);
});

app.get("/", async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (user) {
      res.redirect("/board");
      return;
    }
    res.sendFile(loginPath);
  } catch {
    res.sendFile(loginPath);
  }
});

app.get("/board", requireAuthPage, (req, res) => {
  res.sendFile(boardPath);
});

app.get("/invite/:token", requireAuthPage, (req, res) => {
  res.redirect(`/board?invite=${encodeURIComponent(req.params.token || "")}`);
});

app.get("/auth/google", async (req, res) => {
  if (!oauthConfigured()) {
    res.status(500).send("Google OAuth ist nicht konfiguriert.");
    return;
  }

  try {
    await cleanupAuthTables();

    const state = randomId(18);
    const expiresAt = Date.now() + OAUTH_STATE_TTL_MS;
    await run("INSERT INTO oauth_states (state, expires_at) VALUES (?, ?)", [state, expiresAt]);

    setCookie(res, "oauth_state", state, {
      path: "/",
      maxAge: Math.floor(OAUTH_STATE_TTL_MS / 1000),
      httpOnly: true,
      sameSite: "Lax",
      secure: isProduction(),
    });

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", GOOGLE_CALLBACK_URL);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("prompt", "select_account");

    res.redirect(authUrl.toString());
  } catch {
    res.status(500).send("Login-Start fehlgeschlagen.");
  }
});

app.get("/auth/google/callback", async (req, res) => {
  if (!oauthConfigured()) {
    res.status(500).send("Google OAuth ist nicht konfiguriert.");
    return;
  }

  const { code, state } = req.query || {};
  if (!code || !state || typeof code !== "string" || typeof state !== "string") {
    res.status(400).send("Ungueltige OAuth-Antwort.");
    return;
  }

  const cookies = parseCookies(req.headers.cookie || "");
  const cookieState = cookies.oauth_state;
  if (!cookieState || cookieState !== state) {
    res.status(400).send("OAuth-Status ungueltig.");
    return;
  }

  try {
    const row = await get("SELECT state, expires_at FROM oauth_states WHERE state = ?", [state]);
    await run("DELETE FROM oauth_states WHERE state = ?", [state]);
    clearCookie(res, "oauth_state");

    if (!row || row.expires_at < Date.now()) {
      res.status(400).send("OAuth-Status abgelaufen.");
      return;
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      res.status(401).send("Google-Token konnte nicht geladen werden.");
      return;
    }

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      res.status(401).send("Google-Token fehlt.");
      return;
    }

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!profileResponse.ok) {
      res.status(401).send("Google-Profil konnte nicht geladen werden.");
      return;
    }

    const profile = await profileResponse.json();
    if (!profile.sub) {
      res.status(401).send("Google-Profil ist ungueltig.");
      return;
    }

    await upsertUserFromGoogle(profile);
    await cleanupAuthTables();
    const session = await createSession(profile.sub);

    setCookie(res, "sid", session.sid, {
      path: "/",
      maxAge: Math.floor(SESSION_TTL_MS / 1000),
      httpOnly: true,
      sameSite: "Lax",
      secure: isProduction(),
    });

    res.redirect("/board");
  } catch {
    res.status(500).send("Login fehlgeschlagen.");
  }
});

app.post("/auth/logout", requireAuth, async (req, res) => {
  try {
    await run("DELETE FROM sessions WHERE sid = ?", [req.user.sid]);
    clearCookie(res, "sid");
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "LOGOUT_FAILED" });
  }
});

app.get("/api/me", requireAuth, async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    picture: req.user.picture,
  });
});

app.get("/api/projects", requireAuth, async (req, res) => {
  try {
    await ensureUserProjects(req.user.id);

    const rows = await all(
      `
        SELECT p.id, p.name, p.owner_id, p.state_json, p.updated_at, m.role
        FROM projects p
        JOIN project_members m ON m.project_id = p.id
        WHERE m.user_id = ?
        ORDER BY p.updated_at DESC
      `,
      [req.user.id]
    );

    res.json({ projects: rows.map(parseProjectRow) });
  } catch {
    res.status(500).json({ error: "PROJECT_LIST_FAILED" });
  }
});

app.post("/api/projects", requireAuth, async (req, res) => {
  const { name } = req.body || {};
  const cleanName = typeof name === "string" && name.trim() ? name.trim() : "Neues Projekt";

  try {
    const projectId = await createProjectForOwner(req.user.id, {
      name: cleanName,
      columns: createDefaultColumns(),
    });
    const project = await getProjectForUser(projectId, req.user.id);
    res.status(201).json({ project });
  } catch {
    res.status(500).json({ error: "PROJECT_CREATE_FAILED" });
  }
});

app.get("/api/projects/:projectId", requireAuth, async (req, res) => {
  try {
    const project = await getProjectForUser(req.params.projectId, req.user.id);
    if (!project) {
      res.status(404).json({ error: "PROJECT_NOT_FOUND" });
      return;
    }
    res.json({ project });
  } catch {
    res.status(500).json({ error: "PROJECT_READ_FAILED" });
  }
});

app.patch("/api/projects/:projectId", requireAuth, async (req, res) => {
  const { name } = req.body || {};
  const cleanName = typeof name === "string" && name.trim() ? name.trim() : "";
  if (!cleanName) {
    res.status(400).json({ error: "INVALID_PROJECT_NAME" });
    return;
  }

  try {
    const project = await getProjectForUser(req.params.projectId, req.user.id);
    if (!project) {
      res.status(404).json({ error: "PROJECT_NOT_FOUND" });
      return;
    }
    if (!canWriteProject(project.role)) {
      res.status(403).json({ error: "PROJECT_READ_ONLY" });
      return;
    }

    const nextState = {
      id: project.id,
      name: cleanName,
      columns: Array.isArray(project.columns) ? project.columns : createDefaultColumns(),
    };

    await run(
      "UPDATE projects SET name = ?, state_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [cleanName, JSON.stringify(nextState), project.id]
    );

    const updated = await getProjectForUser(project.id, req.user.id);
    res.json({ ok: true, project: updated });
  } catch {
    res.status(500).json({ error: "PROJECT_RENAME_FAILED" });
  }
});

app.put("/api/projects/:projectId/state", requireAuth, async (req, res) => {
  const payload = req.body?.project;
  if (!payload || typeof payload !== "object") {
    res.status(400).json({ error: "INVALID_PROJECT_PAYLOAD" });
    return;
  }

  try {
    const project = await getProjectForUser(req.params.projectId, req.user.id);
    if (!project) {
      res.status(404).json({ error: "PROJECT_NOT_FOUND" });
      return;
    }
    if (!canWriteProject(project.role)) {
      res.status(403).json({ error: "PROJECT_READ_ONLY" });
      return;
    }

    const normalized = normalizeProjectCandidate({
      name: payload.name || project.name,
      columns: payload.columns,
    });
    const nextState = {
      id: project.id,
      name: normalized.name,
      columns: normalized.columns,
    };

    await run(
      "UPDATE projects SET name = ?, state_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [normalized.name, JSON.stringify(nextState), project.id]
    );

    const updated = await getProjectForUser(project.id, req.user.id);
    res.json({ ok: true, updatedAt: updated?.updatedAt || null, project: updated });
  } catch {
    res.status(500).json({ error: "PROJECT_STATE_WRITE_FAILED" });
  }
});

app.delete("/api/projects/:projectId", requireAuth, async (req, res) => {
  try {
    const project = await getProjectForUser(req.params.projectId, req.user.id);
    if (!project) {
      res.status(404).json({ error: "PROJECT_NOT_FOUND" });
      return;
    }
    if (project.role !== "owner") {
      res.status(403).json({ error: "ONLY_OWNER_CAN_DELETE_PROJECT" });
      return;
    }

    await run("DELETE FROM projects WHERE id = ?", [project.id]);
    await ensureUserProjects(req.user.id);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "PROJECT_DELETE_FAILED" });
  }
});

app.post("/api/projects/:projectId/invites", requireAuth, async (req, res) => {
  const role = req.body?.role === "viewer" ? "viewer" : "editor";

  try {
    await cleanupInviteTable();
    const project = await getProjectForUser(req.params.projectId, req.user.id);
    if (!project) {
      res.status(404).json({ error: "PROJECT_NOT_FOUND" });
      return;
    }
    if (!canWriteProject(project.role)) {
      res.status(403).json({ error: "PROJECT_READ_ONLY" });
      return;
    }

    const token = randomId(20);
    const expiresAt = Date.now() + INVITE_TTL_MS;
    await run(
      `
        INSERT INTO project_invites (token, project_id, email, role, created_by, expires_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [token, project.id, null, role, req.user.id, expiresAt]
    );

    const inviteUrl = `${getBaseUrl(req)}/invite/${token}`;

    res.status(201).json({ ok: true, inviteUrl, expiresAt, role });
  } catch {
    res.status(500).json({ error: "INVITE_CREATE_FAILED" });
  }
});

app.get("/api/projects/:projectId/members", requireAuth, async (req, res) => {
  try {
    const project = await getProjectForUser(req.params.projectId, req.user.id);
    if (!project) {
      res.status(404).json({ error: "PROJECT_NOT_FOUND" });
      return;
    }

    const rows = await all(
      `
        SELECT m.user_id, m.role, u.name, u.email, u.picture
        FROM project_members m
        JOIN users u ON u.id = m.user_id
        WHERE m.project_id = ?
        ORDER BY CASE m.role WHEN 'owner' THEN 0 WHEN 'editor' THEN 1 ELSE 2 END, u.name COLLATE NOCASE
      `,
      [project.id]
    );

    res.json({
      members: rows.map((row) => ({
        userId: row.user_id,
        role: row.role,
        name: row.name || row.email || "Unbekannt",
        email: row.email || "",
        picture: row.picture || "",
      })),
      canManage: canManageProjectMembers(project.role),
      currentUserId: req.user.id,
    });
  } catch {
    res.status(500).json({ error: "MEMBER_LIST_FAILED" });
  }
});

app.patch("/api/projects/:projectId/members/:userId", requireAuth, async (req, res) => {
  const nextRole = req.body?.role === "viewer" ? "viewer" : req.body?.role === "editor" ? "editor" : null;
  if (!nextRole) {
    res.status(400).json({ error: "INVALID_MEMBER_ROLE" });
    return;
  }

  try {
    const project = await getProjectForUser(req.params.projectId, req.user.id);
    if (!project) {
      res.status(404).json({ error: "PROJECT_NOT_FOUND" });
      return;
    }
    if (!canManageProjectMembers(project.role)) {
      res.status(403).json({ error: "ONLY_OWNER_CAN_MANAGE_MEMBERS" });
      return;
    }

    const target = await get(
      "SELECT role FROM project_members WHERE project_id = ? AND user_id = ?",
      [project.id, req.params.userId]
    );
    if (!target) {
      res.status(404).json({ error: "MEMBER_NOT_FOUND" });
      return;
    }
    if (target.role === "owner") {
      res.status(400).json({ error: "OWNER_ROLE_IMMUTABLE" });
      return;
    }

    await run(
      "UPDATE project_members SET role = ? WHERE project_id = ? AND user_id = ?",
      [nextRole, project.id, req.params.userId]
    );

    const updated = await get(
      `
        SELECT m.user_id, m.role, u.name, u.email, u.picture
        FROM project_members m
        JOIN users u ON u.id = m.user_id
        WHERE m.project_id = ? AND m.user_id = ?
      `,
      [project.id, req.params.userId]
    );

    res.json({
      ok: true,
      member: {
        userId: updated.user_id,
        role: updated.role,
        name: updated.name || updated.email || "Unbekannt",
        email: updated.email || "",
        picture: updated.picture || "",
      },
    });
  } catch {
    res.status(500).json({ error: "MEMBER_ROLE_UPDATE_FAILED" });
  }
});

app.delete("/api/projects/:projectId/members/:userId", requireAuth, async (req, res) => {
  try {
    const project = await getProjectForUser(req.params.projectId, req.user.id);
    if (!project) {
      res.status(404).json({ error: "PROJECT_NOT_FOUND" });
      return;
    }
    if (!canManageProjectMembers(project.role)) {
      res.status(403).json({ error: "ONLY_OWNER_CAN_MANAGE_MEMBERS" });
      return;
    }

    const target = await get(
      "SELECT role FROM project_members WHERE project_id = ? AND user_id = ?",
      [project.id, req.params.userId]
    );
    if (!target) {
      res.status(404).json({ error: "MEMBER_NOT_FOUND" });
      return;
    }
    if (target.role === "owner") {
      res.status(400).json({ error: "OWNER_CANNOT_BE_REMOVED" });
      return;
    }

    await run(
      "DELETE FROM project_members WHERE project_id = ? AND user_id = ?",
      [project.id, req.params.userId]
    );

    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "MEMBER_REMOVE_FAILED" });
  }
});

app.post("/api/invites/:token/accept", requireAuth, async (req, res) => {
  try {
    await cleanupInviteTable();

    const invite = await get(
      `
        SELECT token, project_id, email, role, expires_at
        FROM project_invites
        WHERE token = ?
      `,
      [req.params.token]
    );

    if (!invite) {
      res.status(404).json({ error: "INVITE_NOT_FOUND" });
      return;
    }
    if (invite.expires_at < Date.now()) {
      await run("DELETE FROM project_invites WHERE token = ?", [invite.token]);
      res.status(410).json({ error: "INVITE_EXPIRED" });
      return;
    }
    if (invite.email && (!req.user.email || invite.email.toLowerCase() !== req.user.email.toLowerCase())) {
      res.status(403).json({ error: "INVITE_EMAIL_MISMATCH" });
      return;
    }

    const existingMember = await get(
      "SELECT role FROM project_members WHERE project_id = ? AND user_id = ?",
      [invite.project_id, req.user.id]
    );

    if (!existingMember) {
      await run(
        "INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)",
        [invite.project_id, req.user.id, invite.role]
      );
    }

    await run("DELETE FROM project_invites WHERE token = ?", [invite.token]);
    res.json({ ok: true, projectId: invite.project_id });
  } catch {
    res.status(500).json({ error: "INVITE_ACCEPT_FAILED" });
  }
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

initDatabase()
  .then(() => {
    startMaintenanceJobs();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Kanban server laeuft auf http://localhost:${PORT}`);
      if (!oauthConfigured()) {
        // eslint-disable-next-line no-console
        console.warn("Google OAuth nicht konfiguriert. Setze GOOGLE_CLIENT_ID und GOOGLE_CLIENT_SECRET.");
      }
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Datenbank-Initialisierung fehlgeschlagen", error);
    process.exit(1);
  });
