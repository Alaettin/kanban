const { run, get, all } = require("../../shared/db");
const { randomId, requireAuth } = require("../../shared/auth");

const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

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
  const state = { id: projectId, name: normalized.name, columns: normalized.columns };
  await run(
    "INSERT INTO projects (id, name, owner_id, state_json, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
    [projectId, normalized.name, ownerId, JSON.stringify(state)]
  );
  await run("INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, 'owner')", [projectId, ownerId]);
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
    `SELECT p.id, p.name, p.owner_id, p.state_json, p.updated_at, m.role
     FROM projects p JOIN project_members m ON m.project_id = p.id
     WHERE p.id = ? AND m.user_id = ?`,
    [projectId, userId]
  );
  if (!row) return null;
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

async function logProjectActivity(projectId, actorUserId, action, entityType = "", entityName = "", meta = {}) {
  try {
    await run(
      `INSERT INTO project_activities (project_id, actor_user_id, action, entity_type, entity_name, meta_json)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [projectId, actorUserId, action, entityType, entityName, JSON.stringify(meta || {})]
    );
  } catch {
    // activity logging must not break primary flow
  }
}

async function initKanbanTables() {
  await run(`
    CREATE TABLE IF NOT EXISTS app_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      state_json TEXT NOT NULL,
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
    CREATE TABLE IF NOT EXISTS project_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL,
      actor_user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL DEFAULT '',
      entity_name TEXT NOT NULL DEFAULT '',
      meta_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  await run("CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id)");
  await run("CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id)");
  await run("CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at)");
  await run("CREATE INDEX IF NOT EXISTS idx_project_invites_expires_at ON project_invites(expires_at)");
  await run("CREATE INDEX IF NOT EXISTS idx_project_invites_project_id ON project_invites(project_id)");
  await run("CREATE INDEX IF NOT EXISTS idx_project_activities_project_id ON project_activities(project_id)");
  await run("CREATE INDEX IF NOT EXISTS idx_project_activities_created_at ON project_activities(created_at)");
}

function mountRoutes(router) {
  router.get("/api/projects", requireAuth, async (req, res) => {
    try {
      await ensureUserProjects(req.user.id);
      const rows = await all(
        `SELECT p.id, p.name, p.owner_id, p.state_json, p.updated_at, m.role
         FROM projects p JOIN project_members m ON m.project_id = p.id
         WHERE m.user_id = ? ORDER BY p.updated_at DESC`,
        [req.user.id]
      );
      res.json({ projects: rows.map(parseProjectRow) });
    } catch {
      res.status(500).json({ error: "PROJECT_LIST_FAILED" });
    }
  });

  router.get("/api/projects/summary", requireAuth, async (req, res) => {
    try {
      await ensureUserProjects(req.user.id);
      const rows = await all(
        `SELECT p.id, p.name, p.updated_at, m.role
         FROM projects p JOIN project_members m ON m.project_id = p.id
         WHERE m.user_id = ? ORDER BY p.updated_at DESC`,
        [req.user.id]
      );
      res.json({
        projects: rows.map((row) => ({
          id: row.id,
          name: row.name,
          updatedAt: row.updated_at,
          role: row.role,
        })),
      });
    } catch {
      res.status(500).json({ error: "PROJECT_SUMMARY_FAILED" });
    }
  });

  router.post("/api/projects", requireAuth, async (req, res) => {
    const { name } = req.body || {};
    const cleanName = typeof name === "string" && name.trim() ? name.trim() : "Neues Projekt";
    try {
      const projectId = await createProjectForOwner(req.user.id, {
        name: cleanName,
        columns: createDefaultColumns(),
      });
      await logProjectActivity(projectId, req.user.id, "project_created", "project", cleanName);
      const project = await getProjectForUser(projectId, req.user.id);
      res.status(201).json({ project });
    } catch {
      res.status(500).json({ error: "PROJECT_CREATE_FAILED" });
    }
  });

  router.get("/api/projects/:projectId", requireAuth, async (req, res) => {
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

  router.patch("/api/projects/:projectId", requireAuth, async (req, res) => {
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
      await run("UPDATE projects SET name = ?, state_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
        cleanName,
        JSON.stringify(nextState),
        project.id,
      ]);
      await logProjectActivity(project.id, req.user.id, "project_renamed", "project", cleanName, {
        previousName: project.name,
      });
      const updated = await getProjectForUser(project.id, req.user.id);
      res.json({ ok: true, project: updated });
    } catch {
      res.status(500).json({ error: "PROJECT_RENAME_FAILED" });
    }
  });

  router.put("/api/projects/:projectId/state", requireAuth, async (req, res) => {
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
      const nextState = { id: project.id, name: normalized.name, columns: normalized.columns };
      await run("UPDATE projects SET name = ?, state_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
        normalized.name,
        JSON.stringify(nextState),
        project.id,
      ]);
      const updated = await getProjectForUser(project.id, req.user.id);
      res.json({ ok: true, updatedAt: updated?.updatedAt || null, project: updated });
    } catch {
      res.status(500).json({ error: "PROJECT_STATE_WRITE_FAILED" });
    }
  });

  router.delete("/api/projects/:projectId", requireAuth, async (req, res) => {
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

  router.post("/api/projects/:projectId/invites", requireAuth, async (req, res) => {
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
        `INSERT INTO project_invites (token, project_id, email, role, created_by, expires_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [token, project.id, null, role, req.user.id, expiresAt]
      );
      const inviteUrl = `${getBaseUrl(req)}/apps/kanban?invite=${token}`;
      await logProjectActivity(project.id, req.user.id, "invite_created", "invite", role);
      res.status(201).json({ ok: true, inviteUrl, expiresAt, role });
    } catch {
      res.status(500).json({ error: "INVITE_CREATE_FAILED" });
    }
  });

  router.get("/api/projects/:projectId/activities", requireAuth, async (req, res) => {
    const requestedLimit = Number.parseInt(String(req.query?.limit || "60"), 10);
    const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(requestedLimit, 200)) : 60;
    try {
      const project = await getProjectForUser(req.params.projectId, req.user.id);
      if (!project) {
        res.status(404).json({ error: "PROJECT_NOT_FOUND" });
        return;
      }
      const rows = await all(
        `SELECT a.id, a.action, a.entity_type, a.entity_name, a.meta_json, a.created_at,
                u.id AS actor_id, u.name AS actor_name, u.email AS actor_email
         FROM project_activities a JOIN users u ON u.id = a.actor_user_id
         WHERE a.project_id = ? ORDER BY a.id DESC LIMIT ?`,
        [project.id, limit]
      );
      res.json({
        activities: rows.map((row) => {
          let meta = {};
          try {
            meta = JSON.parse(row.meta_json || "{}");
          } catch {
            meta = {};
          }
          return {
            id: row.id,
            action: row.action,
            entityType: row.entity_type,
            entityName: row.entity_name,
            createdAt: row.created_at,
            actor: {
              id: row.actor_id,
              name: row.actor_name || row.actor_email || "Unknown",
              email: row.actor_email || "",
            },
            meta,
          };
        }),
      });
    } catch {
      res.status(500).json({ error: "ACTIVITY_READ_FAILED" });
    }
  });

  router.post("/api/projects/:projectId/activities", requireAuth, async (req, res) => {
    const action = typeof req.body?.action === "string" && req.body.action.trim() ? req.body.action.trim() : "";
    const entityType = typeof req.body?.entityType === "string" ? req.body.entityType.trim() : "";
    const entityName = typeof req.body?.entityName === "string" ? req.body.entityName.trim() : "";
    const meta = req.body?.meta && typeof req.body.meta === "object" ? req.body.meta : {};
    if (!action) {
      res.status(400).json({ error: "INVALID_ACTIVITY_ACTION" });
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
      await logProjectActivity(project.id, req.user.id, action, entityType, entityName, meta);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "ACTIVITY_WRITE_FAILED" });
    }
  });

  router.get("/api/projects/:projectId/members", requireAuth, async (req, res) => {
    try {
      const project = await getProjectForUser(req.params.projectId, req.user.id);
      if (!project) {
        res.status(404).json({ error: "PROJECT_NOT_FOUND" });
        return;
      }
      const rows = await all(
        `SELECT m.user_id, m.role, u.name, u.email, u.picture
         FROM project_members m JOIN users u ON u.id = m.user_id
         WHERE m.project_id = ?
         ORDER BY CASE m.role WHEN 'owner' THEN 0 WHEN 'editor' THEN 1 ELSE 2 END, u.name COLLATE NOCASE`,
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

  router.patch("/api/projects/:projectId/members/:userId", requireAuth, async (req, res) => {
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
      const target = await get("SELECT role FROM project_members WHERE project_id = ? AND user_id = ?", [
        project.id,
        req.params.userId,
      ]);
      if (!target) {
        res.status(404).json({ error: "MEMBER_NOT_FOUND" });
        return;
      }
      if (target.role === "owner") {
        res.status(400).json({ error: "OWNER_ROLE_IMMUTABLE" });
        return;
      }
      await run("UPDATE project_members SET role = ? WHERE project_id = ? AND user_id = ?", [
        nextRole,
        project.id,
        req.params.userId,
      ]);
      await logProjectActivity(project.id, req.user.id, "member_role_updated", "member", req.params.userId, {
        previousRole: target.role,
        nextRole,
      });
      const updated = await get(
        `SELECT m.user_id, m.role, u.name, u.email, u.picture
         FROM project_members m JOIN users u ON u.id = m.user_id
         WHERE m.project_id = ? AND m.user_id = ?`,
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

  router.delete("/api/projects/:projectId/members/:userId", requireAuth, async (req, res) => {
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
      const target = await get("SELECT role FROM project_members WHERE project_id = ? AND user_id = ?", [
        project.id,
        req.params.userId,
      ]);
      if (!target) {
        res.status(404).json({ error: "MEMBER_NOT_FOUND" });
        return;
      }
      if (target.role === "owner") {
        res.status(400).json({ error: "OWNER_CANNOT_BE_REMOVED" });
        return;
      }
      await run("DELETE FROM project_members WHERE project_id = ? AND user_id = ?", [
        project.id,
        req.params.userId,
      ]);
      await logProjectActivity(project.id, req.user.id, "member_removed", "member", req.params.userId);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "MEMBER_REMOVE_FAILED" });
    }
  });

  router.post("/api/invites/:token/accept", requireAuth, async (req, res) => {
    try {
      await cleanupInviteTable();
      const invite = await get(
        "SELECT token, project_id, email, role, expires_at FROM project_invites WHERE token = ?",
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
        await run("INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)", [
          invite.project_id,
          req.user.id,
          invite.role,
        ]);
        await logProjectActivity(invite.project_id, req.user.id, "invite_accepted", "member", req.user.id, {
          role: invite.role,
        });
      }
      await run("DELETE FROM project_invites WHERE token = ?", [invite.token]);
      res.json({ ok: true, projectId: invite.project_id });
    } catch {
      res.status(500).json({ error: "INVITE_ACCEPT_FAILED" });
    }
  });
}

module.exports = { initKanbanTables, mountRoutes, cleanupInviteTable };
