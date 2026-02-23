const crypto = require("crypto");
const { run, get, all } = require("./db");

const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;
const SUPERADMIN_EMAIL = "alaettin87@gmail.com";

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

async function createSession(userId) {
  const sid = randomId(24);
  const expiresAt = Date.now() + SESSION_TTL_MS;
  await run("INSERT INTO sessions (sid, user_id, expires_at) VALUES (?, ?, ?)", [sid, userId, expiresAt]);
  return { sid, expiresAt };
}

async function getSessionUser(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  const sid = cookies.sid;
  if (!sid) {
    return null;
  }
  const row = await get(
    `SELECT sessions.sid, sessions.expires_at, users.id, users.email, users.name, users.picture,
            COALESCE(user_roles.role, 'user') AS role
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     LEFT JOIN user_roles ON user_roles.user_id = users.id
     WHERE sessions.sid = ?`,
    [sid]
  );
  if (!row) {
    return null;
  }
  if (row.expires_at < Date.now()) {
    await run("DELETE FROM sessions WHERE sid = ?", [sid]);
    return null;
  }
  const isSuperadmin = row.email === SUPERADMIN_EMAIL;
  const isAdmin = isSuperadmin || row.role === "admin";
  return {
    sid: row.sid,
    expiresAt: row.expires_at,
    id: row.id,
    email: row.email,
    name: row.name,
    picture: row.picture,
    role: isSuperadmin ? "superadmin" : row.role,
    isSuperadmin,
    isAdmin,
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

    // Record login with 30-min dedup so session-resumes are tracked
    try {
      const last = await get(
        "SELECT created_at FROM user_logins WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        [user.id]
      );
      const thirtyMin = 30 * 60 * 1000;
      if (!last || (Date.now() - new Date(last.created_at + "Z").getTime()) > thirtyMin) {
        const ip = req.headers["x-forwarded-for"]
          ? req.headers["x-forwarded-for"].split(",")[0].trim()
          : req.socket?.remoteAddress || "";
        const ua = req.headers["user-agent"] || "";
        recordLogin(user.id, ip, ua).catch(() => {});
      }
    } catch { /* don't block page load */ }

    next();
  } catch {
    res.redirect("/");
  }
}

async function requireAdmin(req, res, next) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      res.status(401).json({ error: "UNAUTHORIZED" });
      return;
    }
    if (!user.isAdmin) {
      res.status(403).json({ error: "FORBIDDEN" });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(500).json({ error: "AUTH_CHECK_FAILED" });
  }
}

async function requireAdminPage(req, res, next) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      res.redirect("/");
      return;
    }
    if (!user.isAdmin) {
      res.redirect("/dashboard");
      return;
    }
    req.user = user;
    next();
  } catch {
    res.redirect("/");
  }
}

async function recordLogin(userId, ipAddress, userAgent) {
  await run(
    "INSERT INTO user_logins (user_id, ip_address, user_agent) VALUES (?, ?, ?)",
    [userId, ipAddress || "", userAgent || ""]
  );
}

async function upsertUserFromGoogle(profile) {
  await run(
    `INSERT INTO users (id, email, name, picture, updated_at)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET
       email = excluded.email,
       name = excluded.name,
       picture = excluded.picture,
       updated_at = CURRENT_TIMESTAMP`,
    [profile.sub, profile.email || "", profile.name || "", profile.picture || ""]
  );
}

function oauthConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

async function initAuthTables() {
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
  await run(`
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id TEXT PRIMARY KEY,
      role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  await run(`
    CREATE TABLE IF NOT EXISTS user_app_access (
      user_id TEXT NOT NULL,
      app_id TEXT NOT NULL,
      PRIMARY KEY (user_id, app_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  await run(`
    CREATE TABLE IF NOT EXISTS user_logins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  await run("CREATE INDEX IF NOT EXISTS idx_user_logins_user_id ON user_logins(user_id)");
  // Migration: if user_app_access is empty but users exist, grant all existing users access to all apps
  const accessCount = await get("SELECT COUNT(*) AS cnt FROM user_app_access");
  const userCount = await get("SELECT COUNT(*) AS cnt FROM users");
  if (accessCount.cnt === 0 && userCount.cnt > 0) {
    const users = await all("SELECT id FROM users");
    const appIds = ["kanban", "dti-connector"];
    for (const u of users) {
      for (const appId of appIds) {
        await run("INSERT OR IGNORE INTO user_app_access (user_id, app_id) VALUES (?, ?)", [u.id, appId]);
      }
    }
  }
}

function mountAuthRoutes(app) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
  const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "").replace(/\/+$/, "");
  const GOOGLE_CALLBACK_URL =
    process.env.GOOGLE_CALLBACK_URL ||
    (PUBLIC_BASE_URL
      ? `${PUBLIC_BASE_URL}/auth/google/callback`
      : `http://localhost:${process.env.PORT || 3000}/auth/google/callback`);

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
      const loginIp = req.headers["x-forwarded-for"]
        ? req.headers["x-forwarded-for"].split(",")[0].trim()
        : req.socket?.remoteAddress || "";
      const loginUa = req.headers["user-agent"] || "";
      await recordLogin(profile.sub, loginIp, loginUa);
      setCookie(res, "sid", session.sid, {
        path: "/",
        maxAge: Math.floor(SESSION_TTL_MS / 1000),
        httpOnly: true,
        sameSite: "Lax",
        secure: isProduction(),
      });
      res.redirect("/dashboard");
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
}

function startMaintenanceJobs() {
  setInterval(async () => {
    try {
      await cleanupAuthTables();
    } catch (error) {
      console.warn("Wartungsjob fehlgeschlagen", error?.message || error);
    }
  }, 5 * 60 * 1000);
}

module.exports = {
  randomId,
  parseCookies,
  setCookie,
  clearCookie,
  getSessionUser,
  requireAuth,
  requireAuthPage,
  requireAdmin,
  requireAdminPage,
  upsertUserFromGoogle,
  oauthConfigured,
  initAuthTables,
  mountAuthRoutes,
  cleanupAuthTables,
  createSession,
  startMaintenanceJobs,
  isProduction,
  SESSION_TTL_MS,
  recordLogin,
  SUPERADMIN_EMAIL,
};
