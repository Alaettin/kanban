const DEFAULT_COLUMNS = ["Backlog", "In Arbeit", "Review", "Erledigt"];
const STORAGE_KEY = "kanban-v2";

const board = document.getElementById("board");
const projectTabs = document.getElementById("project-tabs");
const addProjectBtn = document.getElementById("add-project-btn");
const deleteProjectBtn = document.getElementById("delete-project-btn");
const addColumnBtn = document.getElementById("add-column-btn");
const shareProjectBtn = document.getElementById("share-project-btn");
const manageMembersBtn = document.getElementById("manage-members-btn");
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");
const importFileInput = document.getElementById("import-file");
const columnTemplate = document.getElementById("column-template");
const cardTemplate = document.getElementById("card-template");
const userMenuToggle = document.getElementById("user-menu-toggle");
const userMenu = document.getElementById("user-menu");
const userInitials = document.getElementById("user-initials");
const logoutBtn = document.getElementById("logout-btn");
const syncStatus = document.getElementById("sync-status");
const boardFilterInput = document.getElementById("board-filter-input");
const boardFilterClearBtn = document.getElementById("board-filter-clear-btn");

const itemModal = document.getElementById("item-modal");
const itemForm = document.getElementById("item-form");
const itemModalTitle = document.getElementById("item-modal-title");
const itemTitleInput = document.getElementById("item-title");
const itemDescriptionInput = document.getElementById("item-description");
const itemPriorityInput = document.getElementById("item-priority");
const itemDateInput = document.getElementById("item-date");
const itemPrimaryBtn = document.getElementById("item-primary-btn");
const itemSecondaryBtn = document.getElementById("item-secondary-btn");
const itemAssigneeInput = document.getElementById("item-assignee");
const itemTagsInput = document.getElementById("item-tags");
const itemProgressInput = document.getElementById("item-progress");
const checklistItemsWrap = document.getElementById("checklist-items");
const addChecklistItemBtn = document.getElementById("add-checklist-item-btn");
const confirmModal = document.getElementById("confirm-modal");
const confirmForm = document.getElementById("confirm-form");
const confirmTitle = document.getElementById("confirm-title");
const confirmMessage = document.getElementById("confirm-message");
const confirmOkBtn = document.getElementById("confirm-ok-btn");
const confirmInputWrap = document.getElementById("confirm-input-wrap");
const confirmInputLabel = document.getElementById("confirm-input-label");
const confirmInput = document.getElementById("confirm-input");
const shareModal = document.getElementById("share-modal");
const shareForm = document.getElementById("share-form");
const shareRoleInput = document.getElementById("share-role");
const shareLinkInput = document.getElementById("share-link");
const shareCreateBtn = document.getElementById("share-create-btn");
const shareCopyBtn = document.getElementById("share-copy-btn");
const shareCloseBtn = document.getElementById("share-close-btn");
const membersModal = document.getElementById("members-modal");
const membersForm = document.getElementById("members-form");
const membersList = document.getElementById("members-list");
const membersCloseBtn = document.getElementById("members-close-btn");
const membersApplyBtn = document.getElementById("members-apply-btn");

let state = createDefaultState();
let dragCardId = null;
let dragColumnId = null;
let modalContext = null;
let saveTimeoutId = null;
let saveInFlight = false;
let pendingStatePayload = null;
let currentUser = null;
let confirmResolver = null;
let shareProjectId = null;
let membersProjectId = null;
let membersCanManage = false;
let activeFilterQuery = "";
let syncTimerId = null;
let syncInFlight = false;
let syncFailCount = 0;
let lastUserInteractionAt = Date.now();
let renderQueued = false;
const projectUpdatedAtMap = {};
const projectRoleMap = {};
const savedProjectFingerprintMap = {};
const pendingMemberRoleChanges = {};
const columnSortStates = {}; // { [columnId]: { field: "name"|"priority"|"date"|null, dir: "asc"|"desc" } }
const columnExpandedStates = {}; // { [columnId]: true } means all cards expanded
const cardExpandedStates = {}; // { [cardId]: true } means expanded

render();
setupUserMenu();
setupConfirmModal();
setupShareModal();
setupMembersModal();
setupSearchFilter();
setupActivityTracking();
init();

addProjectBtn.addEventListener("click", async () => {
  const name = prompt("Projektname:", `Projekt ${state.projects.length + 1}`);
  if (name === null) {
    return;
  }
  const cleanName = name.trim() || `Projekt ${state.projects.length + 1}`;
  setButtonBusy(addProjectBtn, true);
  try {
    const created = await createProjectOnServer(cleanName);
    if (!created) {
      notifyError("Projekt konnte nicht erstellt werden.");
      return;
    }
    await refreshProjectsFromServer(created.id, true);
  } finally {
    setButtonBusy(addProjectBtn, false);
  }
});

deleteProjectBtn.addEventListener("click", async () => {
  const active = getActiveProject();
  if (!active) {
    return;
  }
  if (projectRoleMap[active.id] !== "owner") {
    alert("Nur der Projekt-Owner kann dieses Projekt löschen.");
    return;
  }
  if (state.projects.length === 1) {
    alert("Mindestens ein Projekt muss bestehen bleiben.");
    return;
  }
  const shouldDelete = await confirmAction({
    title: "Projekt löschen",
    message: `Projekt "${active.name}" wirklich entfernen?`,
    confirmText: "Löschen",
    requireText: active.name,
    requireTextLabel: `Bitte den Projektnamen zur Bestätigung eingeben: "${active.name}"`,
  });
  if (!shouldDelete) {
    return;
  }
  setButtonBusy(deleteProjectBtn, true);
  try {
    const result = await apiRequest(`/api/projects/${encodeURIComponent(active.id)}`, {
      method: "DELETE",
      retries: 1,
    });
    if (!result.ok) {
      notifyError("Projekt konnte nicht gelöscht werden.");
      return;
    }
    await refreshProjectsFromServer(null, true);
  } finally {
    setButtonBusy(deleteProjectBtn, false);
  }
});

addColumnBtn.addEventListener("click", () => {
  if (!canEditActiveProject()) {
    alert("Dieses Projekt ist schreibgeschützt.");
    return;
  }
  const project = getActiveProject();
  if (!project) {
    return;
  }
  project.columns.push({
    id: crypto.randomUUID(),
    title: `Neue Spalte ${project.columns.length + 1}`,
    cards: [],
  });
  saveAndRender();
});

shareProjectBtn?.addEventListener("click", async () => {
  const project = getActiveProject();
  if (!project) {
    return;
  }
  if (!canEditProject(project.id)) {
    alert("Dieses Projekt ist schreibgeschützt.");
    return;
  }
  if (!shareModal) {
    return;
  }
  shareProjectId = project.id;
  if (shareRoleInput) {
    shareRoleInput.value = "editor";
  }
  if (shareLinkInput) {
    shareLinkInput.value = "";
  }
  if (shareCopyBtn) {
    shareCopyBtn.disabled = true;
  }
  if (shareCreateBtn) {
    shareCreateBtn.disabled = false;
    shareCreateBtn.textContent = "Link erstellen";
  }
  shareModal.showModal();
});

manageMembersBtn?.addEventListener("click", async () => {
  const project = getActiveProject();
  if (!project) {
    return;
  }
  if (projectRoleMap[project.id] !== "owner") {
    alert("Nur der Projekt-Owner kann Rechte verwalten.");
    return;
  }
  await openMembersModal(project.id);
});

exportBtn.addEventListener("click", () => {
  const exportState = JSON.stringify(state, null, 2);
  const blob = new Blob([exportState], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-");
  link.href = url;
  link.download = `kanban-export-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

importBtn.addEventListener("click", () => {
  importFileInput.value = "";
  importFileInput.click();
});

importFileInput.addEventListener("change", async () => {
  const [file] = importFileInput.files;
  if (!file) {
    return;
  }
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const normalized = normalizeState(parsed);
    const sourceProject = normalized.projects[0];
    const active = getActiveProject();
    if (!sourceProject || !active) {
      throw new Error("INVALID_IMPORT_DATA");
    }
    active.name = sourceProject.name;
    active.columns = normalizeColumns(sourceProject.columns);
    saveAndRender();
  } catch {
    alert("Import fehlgeschlagen. Bitte eine gueltige Export-Datei auswaehlen.");
  }
});

itemSecondaryBtn.addEventListener("click", () => {
  itemModal.close();
});

addChecklistItemBtn?.addEventListener("click", () => {
  const row = appendChecklistEditorRow();
  const textInput = row.querySelector(".checklist-editor-text");
  if (textInput) {
    textInput.focus();
  }
});

itemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!canEditActiveProject()) {
    alert("Dieses Projekt ist schreibgeschützt.");
    itemModal.close();
    return;
  }
  if (!modalContext) {
    return;
  }

  const project = state.projects.find((entry) => entry.id === modalContext.projectId);
  if (!project) {
    itemModal.close();
    return;
  }
  const column = project.columns.find((entry) => entry.id === modalContext.columnId);
  if (!column) {
    itemModal.close();
    return;
  }

  const payload = {
    title: itemTitleInput.value.trim(),
    description: itemDescriptionInput.value.trim(),
    priority: sanitizePriority(itemPriorityInput.value),
    dueDate: sanitizeDate(itemDateInput.value),
    assignee: itemAssigneeInput.value.trim(),
    tags: parseTags(itemTagsInput.value),
    progress: Math.max(0, Math.min(100, parseInt(itemProgressInput.value, 10) || 0)),
    checklist: getChecklistDraftValues(),
  };

  if (!payload.title) {
    itemTitleInput.focus();
    return;
  }

  if (modalContext.mode === "add") {
    column.cards.push({ id: crypto.randomUUID(), ...payload });
  } else {
    const card = column.cards.find((entry) => entry.id === modalContext.cardId);
    if (card) {
      Object.assign(card, payload);
    }
  }

  itemModal.close();
  modalContext = null;
  saveAndRender();
});

itemModal.addEventListener("close", () => {
  modalContext = null;
});

function createDefaultColumns() {
  return DEFAULT_COLUMNS.map((title) => ({
    id: crypto.randomUUID(),
    title,
    cards: [],
  }));
}

function createDefaultState() {
  const firstProjectId = crypto.randomUUID();
  return {
    activeProjectId: firstProjectId,
    projects: [
      {
        id: firstProjectId,
        name: "Standardprojekt",
        columns: createDefaultColumns(),
      },
    ],
  };
}

function loadLocalState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultState();
    }
    return normalizeState(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}

function normalizeState(candidate) {
  if (candidate && Array.isArray(candidate.columns)) {
    const migrated = createDefaultState();
    migrated.projects[0].columns = normalizeColumns(candidate.columns);
    return migrated;
  }

  const projects = Array.isArray(candidate?.projects)
    ? candidate.projects
        .map((project) => ({
          id: typeof project?.id === "string" && project.id ? project.id : crypto.randomUUID(),
          name: typeof project?.name === "string" && project.name.trim() ? project.name.trim() : "Projekt",
          columns: normalizeColumns(project?.columns),
        }))
        .filter((project) => project.columns.length > 0)
    : [];

  if (!projects.length) {
    return createDefaultState();
  }

  const activeProjectExists = projects.some((project) => project.id === candidate?.activeProjectId);
  return {
    activeProjectId: activeProjectExists ? candidate.activeProjectId : projects[0].id,
    projects,
  };
}

function normalizeColumns(columns) {
  const normalized = Array.isArray(columns)
    ? columns
        .map((column) => ({
          id: typeof column?.id === "string" && column.id ? column.id : crypto.randomUUID(),
          title: typeof column?.title === "string" && column.title.trim() ? column.title.trim() : "Ohne Titel",
          cards: normalizeCards(column?.cards),
        }))
        .filter((column) => column.title)
    : [];

  return normalized.length ? normalized : createDefaultColumns();
}

function normalizeCards(cards) {
  if (!Array.isArray(cards)) {
    return [];
  }

  return cards
    .map((card) => {
      const legacyText = typeof card?.text === "string" ? card.text.trim() : "";
      const titleValue = typeof card?.title === "string" ? card.title.trim() : legacyText;
      if (!titleValue) {
        return null;
      }

      return {
        id: typeof card?.id === "string" && card.id ? card.id : crypto.randomUUID(),
        title: titleValue,
        description: typeof card?.description === "string" ? card.description.trim() : "",
        priority: sanitizePriority(card?.priority),
        dueDate: sanitizeDate(card?.dueDate),
        assignee: typeof card?.assignee === "string" ? card.assignee.trim() : "",
        tags: parseTags(card?.tags),
        progress: typeof card?.progress === "number" ? Math.max(0, Math.min(100, card.progress)) : 0,
        checklist: normalizeChecklist(card?.checklist),
      };
    })
    .filter(Boolean);
}

function normalizeChecklist(checklist) {
  if (!Array.isArray(checklist)) {
    return [];
  }

  return checklist
    .map((item) => {
      const text =
        typeof item === "string" ? item.trim() : typeof item?.text === "string" ? item.text.trim() : "";
      if (!text) {
        return null;
      }

      return {
        id: typeof item?.id === "string" && item.id ? item.id : crypto.randomUUID(),
        text,
        done: Boolean(item?.done),
      };
    })
    .filter(Boolean);
}

function sanitizePriority(priority) {
  const allowed = ["low", "medium", "high"];
  return allowed.includes(priority) ? priority : "medium";
}

function sanitizeDate(date) {
  if (typeof date !== "string" || !date) {
    return "";
  }
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
}

function getActiveProject() {
  return state.projects.find((project) => project.id === state.activeProjectId) || null;
}

function canEditProject(projectId) {
  const role = projectRoleMap[projectId] || "owner";
  return role === "owner" || role === "editor";
}

function canEditActiveProject() {
  const project = getActiveProject();
  return !!project && canEditProject(project.id);
}

function persistLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function queueRender() {
  if (renderQueued) {
    return;
  }
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    render();
  });
}

function setSyncStatus(mode, detail = "") {
  if (!syncStatus) {
    return;
  }
  const labels = {
    idle: "Bereit",
    syncing: "Synchronisiere...",
    synced: "Synchron",
    saving: "Speichere...",
    offline: "Offline",
    error: "Sync-Fehler",
  };
  const nextText = detail || labels[mode] || "Bereit";
  if (syncStatus.dataset.mode === mode && syncStatus.title === nextText) {
    return;
  }
  syncStatus.dataset.mode = mode;
  syncStatus.title = nextText;
  syncStatus.setAttribute("aria-label", `Synchronstatus: ${nextText}`);
}

function notifyError(message) {
  setSyncStatus("error", message);
  setTimeout(() => {
    if (syncStatus?.dataset.mode === "error") {
      setSyncStatus("idle");
    }
  }, 3000);
}

function setButtonBusy(button, busy) {
  if (!button) {
    return;
  }
  button.disabled = busy;
  button.dataset.busy = busy ? "true" : "false";
}

function getProjectFingerprint(projectLike) {
  return JSON.stringify({
    id: projectLike?.id || "",
    name: projectLike?.name || "",
    columns: Array.isArray(projectLike?.columns) ? projectLike.columns : [],
  });
}

function getAdaptiveSyncDelay() {
  const now = Date.now();
  const idleMs = now - lastUserInteractionAt;
  if (document.hidden) {
    return 8000;
  }
  if (idleMs > 45000) {
    return 3000;
  }
  return 1200;
}

async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    cache,
    retries = 0,
    retryBaseMs = 250,
  } = options;

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetch(path, {
        method,
        headers: { "Content-Type": "application/json" },
        cache,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      let payload = null;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        payload = await response.json();
      }
      return { ok: response.ok, status: response.status, payload, response };
    } catch (error) {
      if (attempt >= retries) {
        return { ok: false, status: 0, payload: null, error };
      }
      const backoff = retryBaseMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
    attempt += 1;
  }

  return { ok: false, status: 0, payload: null };
}

function scheduleNextSync(delay = getAdaptiveSyncDelay()) {
  if (syncTimerId) {
    clearTimeout(syncTimerId);
  }
  syncTimerId = setTimeout(async () => {
    await syncActiveProjectFromServer();
    scheduleNextSync(getAdaptiveSyncDelay());
  }, delay);
}

function saveAndRender() {
  persistLocalState();
  scheduleProjectSave();
  queueRender();
}

async function init() {
  setSyncStatus("syncing", "Initialisiere...");
  currentUser = await loadCurrentUser();
  if (!currentUser) {
    redirectToLogin();
    return;
  }
  userInitials.textContent = getUserInitials(currentUser.name || currentUser.email || "User");

  const acceptedProjectId = await handleInviteFromUrl();
  await refreshProjectsFromServer(acceptedProjectId, true);
  startSyncLoop();
  setSyncStatus("synced");
}

async function refreshProjectsFromServer(preferredProjectId = null, shouldRender = false) {
  const result = await apiRequest("/api/projects", {
    cache: "no-store",
    retries: 2,
  });

  try {
    if (result.status === 401) {
      redirectToLogin();
      return;
    }
    if (!result.ok) {
      syncFailCount += 1;
      setSyncStatus("offline");
      return;
    }
    syncFailCount = 0;

    const payload = result.payload;
    const remoteProjects = Array.isArray(payload?.projects) ? payload.projects : [];

    Object.keys(projectUpdatedAtMap).forEach((key) => delete projectUpdatedAtMap[key]);
    Object.keys(projectRoleMap).forEach((key) => delete projectRoleMap[key]);
    Object.keys(savedProjectFingerprintMap).forEach((key) => delete savedProjectFingerprintMap[key]);
    remoteProjects.forEach((project) => {
      projectUpdatedAtMap[project.id] = project.updatedAt || null;
      projectRoleMap[project.id] = project.role || "viewer";
      savedProjectFingerprintMap[project.id] = getProjectFingerprint(project);
    });

    const localActiveId = loadLocalState()?.activeProjectId || null;
    const candidateActiveId = preferredProjectId || state.activeProjectId || localActiveId;
    const normalized = normalizeState({
      activeProjectId: candidateActiveId,
      projects: remoteProjects.map((project) => ({
        id: project.id,
        name: project.name,
        columns: project.columns,
      })),
    });
    state = normalized;
    persistLocalState();
    if (shouldRender) {
      queueRender();
    }
    setSyncStatus("synced");
  } catch {
    syncFailCount += 1;
    setSyncStatus("offline");
  }
}

function scheduleProjectSave(immediate = false) {
  const project = getActiveProject();
  if (!project || !canEditProject(project.id)) {
    return;
  }
  const payload = {
    id: project.id,
    name: project.name,
    columns: project.columns,
  };
  const payloadFingerprint = getProjectFingerprint(payload);
  if (savedProjectFingerprintMap[project.id] === payloadFingerprint && !immediate) {
    return;
  }

  pendingStatePayload = {
    projectId: project.id,
    payload,
    fingerprint: payloadFingerprint,
  };

  if (saveTimeoutId) {
    clearTimeout(saveTimeoutId);
  }

  if (immediate) {
    flushProjectSave();
    return;
  }

  saveTimeoutId = setTimeout(() => {
    saveTimeoutId = null;
    flushProjectSave();
  }, 500);
}

async function flushProjectSave() {
  if (!pendingStatePayload || saveInFlight) {
    return;
  }

  const saveRequest = pendingStatePayload;
  pendingStatePayload = null;
  saveInFlight = true;
  let saveFailed = false;
  setSyncStatus("saving");

  try {
    const result = await apiRequest(`/api/projects/${encodeURIComponent(saveRequest.projectId)}/state`, {
      method: "PUT",
      body: { project: saveRequest.payload },
      retries: 1,
    });
    if (result.status === 401) {
      redirectToLogin();
      return;
    }
    if (result.status === 403) {
      await refreshProjectsFromServer(saveRequest.projectId, true);
      return;
    }
    if (!result.ok) {
      throw new Error("STATE_WRITE_FAILED");
    }
    const payload = result.payload;
    const updatedProject = payload?.project;
    if (updatedProject?.id) {
      projectUpdatedAtMap[updatedProject.id] = updatedProject.updatedAt || null;
      projectRoleMap[updatedProject.id] = updatedProject.role || projectRoleMap[updatedProject.id] || "editor";
      savedProjectFingerprintMap[updatedProject.id] = saveRequest.fingerprint;
    }
    setSyncStatus("synced");
  } catch {
    pendingStatePayload = saveRequest;
    saveFailed = true;
    setSyncStatus("offline");
  } finally {
    saveInFlight = false;
    if (pendingStatePayload && !saveFailed) {
      scheduleProjectSave(true);
    }
  }
}

async function createProjectOnServer(name) {
  const result = await apiRequest("/api/projects", {
    method: "POST",
    body: { name },
    retries: 1,
  });
  if (!result.ok) {
    return null;
  }
  return result.payload?.project || null;
}

async function createInviteForProject(projectId, { role }) {
  const result = await apiRequest(`/api/projects/${encodeURIComponent(projectId)}/invites`, {
    method: "POST",
    body: { role },
    retries: 1,
  });
  if (!result.ok) {
    return null;
  }
  return result.payload;
}

async function loadProjectMembers(projectId) {
  const result = await apiRequest(`/api/projects/${encodeURIComponent(projectId)}/members`, {
    cache: "no-store",
    retries: 1,
  });
  if (!result.ok) {
    return null;
  }
  return result.payload;
}

async function updateProjectMemberRole(projectId, userId, role) {
  const result = await apiRequest(
    `/api/projects/${encodeURIComponent(projectId)}/members/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      body: { role },
      retries: 1,
    }
  );
  if (!result.ok) {
    return null;
  }
  return result.payload;
}

async function removeProjectMember(projectId, userId) {
  const result = await apiRequest(
    `/api/projects/${encodeURIComponent(projectId)}/members/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
      retries: 1,
    }
  );
  if (!result.ok) {
    return null;
  }
  return result.payload;
}

function getInviteTokenFromUrl() {
  const url = new URL(window.location.href);
  return url.searchParams.get("invite");
}

function clearInviteTokenFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("invite");
  window.history.replaceState({}, "", url.pathname + url.search);
}

async function handleInviteFromUrl() {
  const token = getInviteTokenFromUrl();
  if (!token) {
    return null;
  }

  try {
    const response = await apiRequest(`/api/invites/${encodeURIComponent(token)}/accept`, {
      method: "POST",
      retries: 1,
    });
    clearInviteTokenFromUrl();
    if (!response.ok) {
      notifyError("Einladung konnte nicht angenommen werden.");
      return null;
    }
    return response.payload?.projectId || null;
  } catch {
    clearInviteTokenFromUrl();
    return null;
  }
}

function startSyncLoop() {
  scheduleNextSync(getAdaptiveSyncDelay());
}

async function syncActiveProjectFromServer() {
  if (!currentUser) {
    return;
  }
  if (syncInFlight) {
    return;
  }
  const activeProject = getActiveProject();
  if (!activeProject) {
    return;
  }
  if (saveInFlight) {
    return;
  }
  if (pendingStatePayload && pendingStatePayload.projectId === activeProject.id) {
    return;
  }

  syncInFlight = true;
  try {
    const response = await apiRequest(`/api/projects/${encodeURIComponent(activeProject.id)}`, {
      cache: "no-store",
      retries: Math.min(2, syncFailCount),
    });
    if (response.status === 401) {
      redirectToLogin();
      return;
    }
    if (response.status === 404) {
      await refreshProjectsFromServer(null, true);
      return;
    }
    if (!response.ok) {
      syncFailCount += 1;
      setSyncStatus("offline");
      return;
    }
    syncFailCount = 0;

    const project = response.payload?.project;
    if (!project?.id) {
      return;
    }

    const previousRole = projectRoleMap[project.id] || "";
    const nextRole = project.role || previousRole || "viewer";
    const remoteFingerprint = getProjectFingerprint(project);
    const localFingerprint = getProjectFingerprint(activeProject);
    if (remoteFingerprint === localFingerprint) {
      projectUpdatedAtMap[project.id] = project.updatedAt || null;
      projectRoleMap[project.id] = nextRole;
      savedProjectFingerprintMap[project.id] = remoteFingerprint;
      if (previousRole !== nextRole) {
        queueRender();
      }
      setSyncStatus("synced");
      return;
    }

    const index = state.projects.findIndex((entry) => entry.id === project.id);
    if (index >= 0) {
      state.projects[index] = {
        id: project.id,
        name: project.name,
        columns: normalizeColumns(project.columns),
      };
      projectUpdatedAtMap[project.id] = project.updatedAt || null;
      projectRoleMap[project.id] = nextRole;
      savedProjectFingerprintMap[project.id] = remoteFingerprint;
      persistLocalState();
      queueRender();
      setSyncStatus("synced");
    } else {
      await refreshProjectsFromServer(project.id, true);
    }
  } catch {
    syncFailCount += 1;
    setSyncStatus("offline");
  } finally {
    syncInFlight = false;
  }
}

function render() {
  renderProjectTabs();
  syncToolbarPermissions();
  renderBoard();
}

function syncToolbarPermissions() {
  const canEdit = canEditActiveProject();
  const activeProject = getActiveProject();
  const canDeleteProject = !!activeProject && projectRoleMap[activeProject.id] === "owner";
  if (deleteProjectBtn) {
    deleteProjectBtn.disabled = !canDeleteProject;
  }
  if (addColumnBtn) {
    addColumnBtn.disabled = !canEdit;
  }
  if (importBtn) {
    importBtn.disabled = !canEdit;
  }
  if (shareProjectBtn) {
    shareProjectBtn.disabled = !canEdit;
  }
  if (manageMembersBtn) {
    manageMembersBtn.disabled = !canDeleteProject;
  }
}

function renderProjectTabs() {
  projectTabs.replaceChildren();

  state.projects.forEach((project) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "project-tab";
    if (project.id === state.activeProjectId) {
      tab.classList.add("active");
    }
    tab.textContent = project.name;
    tab.addEventListener("click", () => {
      state.activeProjectId = project.id;
      persistLocalState();
      queueRender();
    });
    tab.addEventListener("dblclick", async () => {
      if (!canEditProject(project.id)) {
        alert("Dieses Projekt ist schreibgeschützt.");
        return;
      }
      const name = prompt("Projektname aendern:", project.name);
      if (name === null) {
        return;
      }
      const cleanName = name.trim();
      if (!cleanName || cleanName === project.name) {
        return;
      }

      const response = await apiRequest(`/api/projects/${encodeURIComponent(project.id)}`, {
        method: "PATCH",
        body: { name: cleanName },
        retries: 1,
      });
      if (!response.ok) {
        notifyError("Projektname konnte nicht geändert werden.");
        return;
      }
      const updated = response.payload?.project;
      project.name = updated?.name || cleanName;
      projectUpdatedAtMap[project.id] = updated?.updatedAt || projectUpdatedAtMap[project.id] || null;
      queueRender();
    });
    projectTabs.appendChild(tab);
  });
}

function renderBoard() {
  board.replaceChildren();
  const project = getActiveProject();
  if (!project) {
    return;
  }
  const canEdit = canEditProject(project.id);
  const filterQuery = normalizeFilterQuery(activeFilterQuery);

  project.columns.forEach((column) => {
    const visibleCards = filterQuery
      ? getSortedCards(column).filter((card) => cardMatchesFilter(card, filterQuery))
      : getSortedCards(column);

    const node = columnTemplate.content.firstElementChild.cloneNode(true);
    const titleInput = node.querySelector(".column-title");
    const cardsWrap = node.querySelector(".cards");
    const deleteColBtn = node.querySelector(".delete-column");
    const addItemBtn = node.querySelector(".add-item-btn");
    const columnDragHandle = node.querySelector(".column-drag");
    const countBadge = node.querySelector(".column-count");
    const collapseAllBtn = node.querySelector(".collapse-all-btn");

    const allExpanded = !!columnExpandedStates[column.id];
    collapseAllBtn.classList.toggle("expanded", allExpanded);
    collapseAllBtn.title = allExpanded ? "Alle einklappen" : "Alle ausklappen";

    collapseAllBtn.addEventListener("click", () => {
      columnExpandedStates[column.id] = !columnExpandedStates[column.id];
      render();
    });

    titleInput.value = column.title;
    titleInput.disabled = !canEdit;
    titleInput.addEventListener("change", () => {
      if (!canEdit) {
        return;
      }
      column.title = titleInput.value.trim() || "Ohne Titel";
      saveAndRender();
    });

    if (!canEdit) {
      deleteColBtn.disabled = true;
      addItemBtn.disabled = true;
      columnDragHandle.draggable = false;
      columnDragHandle.disabled = true;
    }

    deleteColBtn.addEventListener("click", async () => {
      if (!canEdit) {
        return;
      }
      if (project.columns.length === 1) {
        alert("Mindestens eine Spalte muss bestehen bleiben.");
        return;
      }
      const shouldDelete = await confirmAction({
        title: "Spalte löschen",
        message: `Spalte "${column.title}" wirklich entfernen?`,
        confirmText: "Löschen",
        requireText: null,
      });
      if (!shouldDelete) {
        return;
      }
      project.columns = project.columns.filter((entry) => entry.id !== column.id);
      saveAndRender();
    });

    addItemBtn.addEventListener("click", () => {
      if (!canEdit) {
        return;
      }
      openItemModal({ mode: "add", projectId: project.id, columnId: column.id });
    });

    cardsWrap.addEventListener("dragover", (event) => {
      if (!dragCardId) {
        return;
      }
      event.preventDefault();
      cardsWrap.classList.add("drag-over-card");
    });

    cardsWrap.addEventListener("dragleave", () => {
      cardsWrap.classList.remove("drag-over-card");
    });

    cardsWrap.addEventListener("drop", (event) => {
      if (!canEdit) {
        return;
      }
      if (!dragCardId) {
        return;
      }
      event.preventDefault();
      cardsWrap.classList.remove("drag-over-card");
      const moved = removeCardById(dragCardId, project);
      if (!moved) {
        return;
      }
      column.cards.push(moved);
      dragCardId = null;
      saveAndRender();
    });

    columnDragHandle.addEventListener("dragstart", () => {
      if (!canEdit) {
        return;
      }
      dragColumnId = column.id;
    });

    columnDragHandle.addEventListener("dragend", () => {
      dragColumnId = null;
      clearColumnDropStyles();
    });

    node.addEventListener("dragover", (event) => {
      if (!dragColumnId || dragColumnId === column.id) {
        return;
      }
      event.preventDefault();
      node.classList.add("drag-over-column");
    });

    node.addEventListener("dragleave", () => {
      node.classList.remove("drag-over-column");
    });

    node.addEventListener("drop", (event) => {
      if (!canEdit) {
        return;
      }
      if (!dragColumnId || dragColumnId === column.id) {
        return;
      }
      event.preventDefault();
      moveColumn(project, dragColumnId, column.id);
      dragColumnId = null;
      saveAndRender();
    });

    // Sort buttons
    const currentSort = columnSortStates[column.id] || { field: null, dir: "asc" };
    node.querySelectorAll(".sort-btn").forEach((btn) => {
      const field = btn.dataset.field;
      btn.classList.toggle("active", currentSort.field === field);
      if (currentSort.field === field) {
        btn.querySelector(".sort-icon").textContent = currentSort.dir === "asc" ? " ↑" : " ↓";
      } else {
        btn.querySelector(".sort-icon").textContent = "";
      }
      btn.addEventListener("click", () => {
        const s = columnSortStates[column.id] || { field: null, dir: "asc" };
        if (s.field !== field) {
      columnSortStates[column.id] = { field, dir: "asc" };
    } else if (s.dir === "asc") {
      columnSortStates[column.id] = { field, dir: "desc" };
    } else {
      columnSortStates[column.id] = { field: null, dir: "asc" };
    }
    queueRender();
  });
    });

    visibleCards.forEach((card) => {
      const cardNode = cardTemplate.content.firstElementChild.cloneNode(true);
      const titleNode = cardNode.querySelector(".card-title");
      const editCardBtn = cardNode.querySelector(".edit-card");
      const deleteCardBtn = cardNode.querySelector(".delete-card");
      const descNode = cardNode.querySelector(".card-desc");
      const priorityBadge = cardNode.querySelector(".card-priority-badge");
      const dateNode = cardNode.querySelector(".card-date");
      const assigneeRow = cardNode.querySelector(".card-assignee-row");
      const assigneeAvatar = cardNode.querySelector(".card-assignee-avatar");
      const assigneeNameEl = cardNode.querySelector(".card-assignee-name");
      const cardTagsEl = cardNode.querySelector(".card-tags");
      const checklistEl = cardNode.querySelector(".card-checklist");
      const progressWrap = cardNode.querySelector(".card-progress-wrap");
      const progressFill = cardNode.querySelector(".card-progress-fill");

      const shouldCollapse = !columnExpandedStates[column.id] && !cardExpandedStates[card.id];
      if (shouldCollapse) {
        cardNode.classList.add("collapsed");
      }

      titleNode.textContent = card.title;
      const priority = sanitizePriority(card.priority);
      cardNode.classList.add(`priority-${priority}`);

      if (descNode && card.description) {
        descNode.textContent = card.description;
      }
      if (priorityBadge) {
        const labels = { low: "Low", medium: "Medium", high: "High" };
        priorityBadge.textContent = labels[priority];
        priorityBadge.className = `card-priority-badge priority-badge-${priority}`;
      }
      if (dateNode && card.dueDate) {
        const d = new Date(card.dueDate + "T12:00:00");
        dateNode.textContent = d.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
        if (new Date(card.dueDate + "T23:59:59") < new Date()) {
          dateNode.classList.add("overdue");
        }
      }

      if (card.assignee && assigneeRow) {
        assigneeAvatar.textContent = card.assignee.charAt(0).toUpperCase();
        assigneeNameEl.textContent = card.assignee;
        assigneeRow.hidden = false;
      }

      if (card.tags && card.tags.length > 0 && cardTagsEl) {
        cardTagsEl.hidden = false;
        card.tags.forEach((tag) => {
          const chip = document.createElement("span");
          chip.className = "card-tag";
          chip.textContent = tag;
          cardTagsEl.appendChild(chip);
        });
      }

      if (card.checklist && card.checklist.length > 0 && checklistEl) {
        checklistEl.hidden = false;
        const doneCount = card.checklist.filter((item) => item.done).length;

        const summary = document.createElement("div");
        summary.className = "card-checklist-summary";
        summary.textContent = `Checkliste: ${doneCount}/${card.checklist.length}`;
        checklistEl.appendChild(summary);

        card.checklist.forEach((item) => {
          const row = document.createElement("label");
          row.className = "card-checklist-item";

          const check = document.createElement("input");
          check.type = "checkbox";
          check.checked = Boolean(item.done);
          check.disabled = !canEdit;
          check.addEventListener("click", (event) => event.stopPropagation());
          check.addEventListener("change", (event) => {
            if (!canEdit) {
              return;
            }
            event.stopPropagation();
            item.done = check.checked;
            saveAndRender();
          });

          const text = document.createElement("span");
          text.textContent = item.text;
          if (item.done) {
            text.classList.add("done");
          }

          row.appendChild(check);
          row.appendChild(text);
          checklistEl.appendChild(row);
        });
      }

      if (card.progress > 0 && progressWrap) {
        progressWrap.hidden = false;
        progressFill.style.width = card.progress + "%";
      }

      cardNode.addEventListener("dragstart", () => {
        dragCardId = card.id;
      });

      cardNode.addEventListener("dragend", () => {
        dragCardId = null;
      });

      cardNode.addEventListener("click", () => {
        const collapsed = cardNode.classList.toggle("collapsed");
        cardExpandedStates[card.id] = !collapsed;
      });

      editCardBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        if (!canEdit) {
          return;
        }
        openItemModal({ mode: "edit", projectId: project.id, columnId: column.id, cardId: card.id });
      });

      deleteCardBtn.addEventListener("click", async (event) => {
        event.stopPropagation();
        if (!canEdit) {
          return;
        }
        const shouldDelete = await confirmAction({
          title: "Task löschen",
          message: `Task "${card.title}" wirklich löschen?`,
          confirmText: "Löschen",
          requireText: null,
        });
        if (!shouldDelete) {
          return;
        }
        column.cards = column.cards.filter((entry) => entry.id !== card.id);
        saveAndRender();
      });

      cardsWrap.appendChild(cardNode);

      if (!canEdit) {
        editCardBtn.disabled = true;
        deleteCardBtn.disabled = true;
        cardNode.draggable = false;
      }
    });

    if (countBadge) {
      countBadge.textContent = filterQuery ? `${visibleCards.length}/${column.cards.length}` : column.cards.length;
    }
    board.appendChild(node);
  });
}

function openItemModal(context) {
  modalContext = context;
  const project = state.projects.find((entry) => entry.id === context.projectId);
  const column = project?.columns.find((entry) => entry.id === context.columnId);
  const card = column?.cards.find((entry) => entry.id === context.cardId);

  if (context.mode === "add") {
    itemModalTitle.textContent = "Neuer Task";
    itemPrimaryBtn.textContent = "Hinzufügen";
    itemSecondaryBtn.textContent = "Abbrechen";
    itemTitleInput.value = "";
    itemDescriptionInput.value = "";
    itemPriorityInput.value = "medium";
    itemDateInput.value = "";
    itemAssigneeInput.value = "";
    itemTagsInput.value = "";
    itemProgressInput.value = "0";
    document.getElementById("progress-display").textContent = "0";
    resetChecklistEditor([]);
  } else {
    itemModalTitle.textContent = "Task bearbeiten";
    itemPrimaryBtn.textContent = "Speichern";
    itemSecondaryBtn.textContent = "Schließen";
    itemTitleInput.value = card?.title || "";
    itemDescriptionInput.value = card?.description || "";
    itemPriorityInput.value = sanitizePriority(card?.priority);
    itemDateInput.value = sanitizeDate(card?.dueDate);
    itemAssigneeInput.value = card?.assignee || "";
    itemTagsInput.value = (card?.tags || []).join(", ");
    itemProgressInput.value = String(card?.progress ?? 0);
    document.getElementById("progress-display").textContent = String(card?.progress ?? 0);
    resetChecklistEditor(card?.checklist || []);
  }

  itemModal.showModal();
  itemTitleInput.focus();
}

function removeCardById(cardId, project) {
  for (const column of project.columns) {
    const index = column.cards.findIndex((card) => card.id === cardId);
    if (index >= 0) {
      return column.cards.splice(index, 1)[0];
    }
  }
  return null;
}

function moveColumn(project, sourceId, targetId) {
  const sourceIndex = project.columns.findIndex((column) => column.id === sourceId);
  const targetIndex = project.columns.findIndex((column) => column.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) {
    return;
  }

  const [sourceColumn] = project.columns.splice(sourceIndex, 1);
  project.columns.splice(targetIndex, 0, sourceColumn);
}

function clearColumnDropStyles() {
  board.querySelectorAll(".column.drag-over-column").forEach((column) => {
    column.classList.remove("drag-over-column");
  });
}

function parseTags(value) {
  if (Array.isArray(value)) return value.map((t) => String(t).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
}

function appendChecklistEditorRow(item = null) {
  if (!checklistItemsWrap) {
    return document.createElement("div");
  }

  const row = document.createElement("div");
  row.className = "checklist-editor-row";
  row.dataset.itemId = typeof item?.id === "string" && item.id ? item.id : crypto.randomUUID();

  const done = document.createElement("input");
  done.type = "checkbox";
  done.className = "checklist-editor-done";
  done.checked = Boolean(item?.done);

  const text = document.createElement("input");
  text.type = "text";
  text.className = "checklist-editor-text";
  text.placeholder = "Beschreibung...";
  text.maxLength = 240;
  text.value = typeof item?.text === "string" ? item.text : "";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "checklist-editor-remove";
  removeBtn.textContent = "×";
  removeBtn.title = "Checklistenpunkt entfernen";
  removeBtn.setAttribute("aria-label", "Checklistenpunkt entfernen");
  removeBtn.addEventListener("click", () => {
    row.remove();
  });

  row.appendChild(done);
  row.appendChild(text);
  row.appendChild(removeBtn);
  checklistItemsWrap.appendChild(row);

  return row;
}

function resetChecklistEditor(items) {
  if (!checklistItemsWrap) {
    return;
  }
  checklistItemsWrap.replaceChildren();
  const safeItems = Array.isArray(items) ? items : [];
  safeItems.forEach((item) => {
    appendChecklistEditorRow(item);
  });
}

function getChecklistDraftValues() {
  if (!checklistItemsWrap) {
    return [];
  }

  return Array.from(checklistItemsWrap.querySelectorAll(".checklist-editor-row"))
    .map((row) => {
      const textInput = row.querySelector(".checklist-editor-text");
      const doneInput = row.querySelector(".checklist-editor-done");
      const text = textInput?.value?.trim() || "";
      if (!text) {
        return null;
      }
      return {
        id: row.dataset.itemId || crypto.randomUUID(),
        text,
        done: Boolean(doneInput?.checked),
      };
    })
    .filter(Boolean);
}

function getSortedCards(column) {
  const sort = columnSortStates[column.id];
  if (!sort || !sort.field) return [...column.cards];

  const cards = [...column.cards];
  const mult = sort.dir === "asc" ? 1 : -1;

  cards.sort((a, b) => {
    if (sort.field === "name") {
      return mult * a.title.localeCompare(b.title, "de");
    }
    if (sort.field === "priority") {
      const order = { high: 0, medium: 1, low: 2 };
      return mult * ((order[sanitizePriority(a.priority)] ?? 1) - (order[sanitizePriority(b.priority)] ?? 1));
    }
    if (sort.field === "date") {
      const da = a.dueDate || "9999-99-99";
      const db = b.dueDate || "9999-99-99";
      return mult * da.localeCompare(db);
    }
    return 0;
  });

  return cards;
}

function setupConfirmModal() {
  if (!confirmModal) {
    return;
  }

  const syncConfirmButton = () => {
    if (!confirmOkBtn || !confirmInputWrap || !confirmInput) {
      return;
    }

    if (confirmInputWrap.hidden) {
      confirmOkBtn.disabled = false;
      return;
    }

    const expected = normalizeConfirmValue(confirmInput.dataset.expectedText || "");
    const typed = normalizeConfirmValue(confirmInput.value);
    confirmOkBtn.disabled = typed !== expected;
  };

  confirmInput?.addEventListener("input", syncConfirmButton);

  confirmForm?.addEventListener("submit", (event) => {
    if (!confirmOkBtn || !confirmInputWrap || confirmInputWrap.hidden) {
      return;
    }

    const submitter = event.submitter;
    if (submitter === confirmOkBtn && confirmOkBtn.disabled) {
      event.preventDefault();
    }
  });

  confirmModal.addEventListener("close", () => {
    if (confirmInput) {
      confirmInput.value = "";
      confirmInput.dataset.expectedText = "";
    }
    if (confirmInputWrap) {
      confirmInputWrap.hidden = true;
    }
    if (confirmInputLabel) {
      confirmInputLabel.textContent = "Zur Bestätigung Namen eingeben";
    }
    if (confirmOkBtn) {
      confirmOkBtn.disabled = false;
    }

    if (!confirmResolver) {
      return;
    }
    const resolve = confirmResolver;
    confirmResolver = null;
    resolve(confirmModal.returnValue === "confirm");
  });
}

function setupShareModal() {
  if (!shareModal || !shareForm || !shareRoleInput || !shareLinkInput || !shareCreateBtn || !shareCopyBtn) {
    return;
  }

  shareCreateBtn.addEventListener("click", async () => {
    const activeProject = getActiveProject();
    const projectId = shareProjectId || activeProject?.id;
    if (!projectId) {
      return;
    }
    if (!canEditProject(projectId)) {
      alert("Dieses Projekt ist schreibgeschützt.");
      return;
    }

    shareCreateBtn.disabled = true;
    shareCreateBtn.textContent = "Erstelle...";
    const role = shareRoleInput.value === "viewer" ? "viewer" : "editor";
    const invite = await createInviteForProject(projectId, { role });
    shareCreateBtn.disabled = false;
    shareCreateBtn.textContent = "Link erstellen";

    if (!invite?.inviteUrl) {
      alert("Einladungslink konnte nicht erstellt werden.");
      return;
    }

    shareLinkInput.value = invite.inviteUrl;
    shareCopyBtn.disabled = false;
    shareLinkInput.focus();
    shareLinkInput.select();
  });

  shareCopyBtn.addEventListener("click", async () => {
    if (!shareLinkInput.value) {
      return;
    }
    try {
      await navigator.clipboard.writeText(shareLinkInput.value);
      shareCopyBtn.textContent = "Kopiert";
      setTimeout(() => {
        shareCopyBtn.textContent = "Kopieren";
      }, 1200);
    } catch {
      shareLinkInput.focus();
      shareLinkInput.select();
      alert("Konnte nicht automatisch kopieren. Bitte Link manuell kopieren.");
    }
  });

  shareCloseBtn?.addEventListener("click", () => {
    shareModal.close();
  });

  shareModal.addEventListener("close", () => {
    shareProjectId = null;
    shareLinkInput.value = "";
    shareCopyBtn.disabled = true;
    shareCreateBtn.disabled = false;
    shareCreateBtn.textContent = "Link erstellen";
    shareCopyBtn.textContent = "Kopieren";
  });

  shareForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

async function openMembersModal(projectId) {
  if (!membersModal) {
    return;
  }
  membersProjectId = projectId;
  membersCanManage = false;
  Object.keys(pendingMemberRoleChanges).forEach((key) => delete pendingMemberRoleChanges[key]);
  syncMembersApplyButton();
  membersModal.showModal();
  await refreshMembersModal();
}

async function refreshMembersModal() {
  if (!membersProjectId) {
    return;
  }
  if (membersList) {
    membersList.innerHTML = '<div class="member-row"><div class="member-meta"><div class="member-name">Lade Mitglieder...</div></div></div>';
  }

  const payload = await loadProjectMembers(membersProjectId);
  if (!payload) {
    notifyError("Mitglieder konnten nicht geladen werden.");
    if (membersList) {
      membersList.innerHTML =
        '<div class="member-row"><div class="member-meta"><div class="member-name">Fehler beim Laden.</div></div></div>';
    }
    return;
  }

  membersCanManage = Boolean(payload.canManage);
  renderMembersList(membersProjectId, payload.members || [], membersCanManage, payload.currentUserId || "");
  syncMembersApplyButton();
}

function renderMembersList(projectId, members, canManage, currentUserId) {
  if (!membersList) {
    return;
  }
  membersList.replaceChildren();

  if (!members.length) {
    const empty = document.createElement("div");
    empty.className = "member-row";
    empty.innerHTML = '<div class="member-meta"><div class="member-name">Keine Mitglieder gefunden.</div></div>';
    membersList.appendChild(empty);
    return;
  }

  members.forEach((member) => {
    const row = document.createElement("div");
    row.className = "member-row";

    const avatar = document.createElement("div");
    avatar.className = "member-avatar";
    avatar.textContent = getUserInitials(member.name || member.email || "U");

    const meta = document.createElement("div");
    meta.className = "member-meta";

    const nameEl = document.createElement("div");
    nameEl.className = "member-name";
    nameEl.textContent = member.name || member.email || "Unbekannt";
    if (member.userId === currentUserId) {
      nameEl.textContent += " (Du)";
    }

    const emailEl = document.createElement("div");
    emailEl.className = "member-email";
    emailEl.textContent = member.email || "";

    meta.appendChild(nameEl);
    meta.appendChild(emailEl);

    const roleControl = document.createElement("select");
    roleControl.className = "member-role-select";

    [
      { value: "owner", label: "Owner" },
      { value: "editor", label: "Editor" },
      { value: "viewer", label: "Viewer" },
      { value: "remove", label: "Entfernen" },
    ].forEach((entry) => {
      const option = document.createElement("option");
      option.value = entry.value;
      option.textContent = entry.label;
      option.disabled = entry.value === "owner";
      roleControl.appendChild(option);
    });

    const originalRole = member.role || "viewer";
    roleControl.value = pendingMemberRoleChanges[member.userId] || originalRole;
    const isOwnerRow = member.role === "owner";
    roleControl.disabled = !canManage || isOwnerRow;

    roleControl.addEventListener("change", () => {
      const nextRole =
        roleControl.value === "remove" ? "remove" : roleControl.value === "viewer" ? "viewer" : "editor";
      if (nextRole === originalRole) {
        delete pendingMemberRoleChanges[member.userId];
      } else {
        pendingMemberRoleChanges[member.userId] = nextRole;
      }
      syncMembersApplyButton();
    });

    row.appendChild(avatar);
    row.appendChild(meta);
    row.appendChild(roleControl);
    membersList.appendChild(row);
  });
}

function setupMembersModal() {
  membersCloseBtn?.addEventListener("click", () => {
    membersModal?.close();
  });

  membersApplyBtn?.addEventListener("click", async () => {
    if (!membersProjectId || !membersCanManage) {
      return;
    }
    const changes = Object.entries(pendingMemberRoleChanges);
    if (!changes.length) {
      return;
    }

    setButtonBusy(membersApplyBtn, true);
    let failed = false;
    for (const [userId, role] of changes) {
      const result =
        role === "remove"
          ? await removeProjectMember(membersProjectId, userId)
          : await updateProjectMemberRole(membersProjectId, userId, role);
      if (!result?.ok) {
        failed = true;
        break;
      }
    }
    setButtonBusy(membersApplyBtn, false);

    if (failed) {
      notifyError("Mindestens eine Rollenänderung ist fehlgeschlagen.");
      return;
    }

    Object.keys(pendingMemberRoleChanges).forEach((key) => delete pendingMemberRoleChanges[key]);
    await refreshProjectsFromServer(state.activeProjectId, true);
    membersModal?.close();
  });

  membersForm?.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  membersModal?.addEventListener("close", () => {
    membersProjectId = null;
    membersCanManage = false;
    Object.keys(pendingMemberRoleChanges).forEach((key) => delete pendingMemberRoleChanges[key]);
    syncMembersApplyButton();
  });
}

function syncMembersApplyButton() {
  if (!membersApplyBtn) {
    return;
  }
  const hasChanges = Object.keys(pendingMemberRoleChanges).length > 0;
  membersApplyBtn.disabled = !hasChanges || !membersCanManage;
}

function confirmAction({
  title,
  message,
  confirmText = "Löschen",
  requireText = null,
  requireTextLabel = "Zur Bestätigung Namen eingeben",
}) {
  if (!confirmModal || !confirmTitle || !confirmMessage || !confirmOkBtn) {
    return Promise.resolve(confirm(message));
  }

  confirmTitle.textContent = title || "Bitte bestaetigen";
  confirmMessage.textContent = message || "";
  confirmOkBtn.textContent = confirmText;

  const needsTypedConfirmation = typeof requireText === "string" && requireText.trim().length > 0;

  if (confirmInput && confirmInputWrap && confirmInputLabel && needsTypedConfirmation) {
    confirmInputWrap.hidden = false;
    confirmInputLabel.textContent = requireTextLabel;
    confirmInput.value = "";
    confirmInput.dataset.expectedText = requireText;
    confirmOkBtn.disabled = true;
  } else if (confirmInputWrap) {
    confirmInputWrap.hidden = true;
    if (confirmInput) {
      confirmInput.value = "";
      confirmInput.dataset.expectedText = "";
    }
    confirmOkBtn.disabled = false;
  }

  return new Promise((resolve) => {
    confirmResolver = resolve;
    confirmModal.showModal();
    if (confirmInput && confirmInputWrap && !confirmInputWrap.hidden) {
      confirmInput.focus();
    }
  });
}

function normalizeConfirmValue(value) {
  return String(value || "").trim();
}

function setupSearchFilter() {
  if (!boardFilterInput || !boardFilterClearBtn) {
    return;
  }

  const syncClearButton = () => {
    const hasText = normalizeFilterQuery(boardFilterInput.value).length > 0;
    boardFilterClearBtn.hidden = !hasText;
  };

  boardFilterInput.addEventListener("input", () => {
    activeFilterQuery = boardFilterInput.value || "";
    syncClearButton();
    queueRender();
  });

  boardFilterClearBtn.addEventListener("click", () => {
    boardFilterInput.value = "";
    activeFilterQuery = "";
    syncClearButton();
    boardFilterInput.focus();
    queueRender();
  });

  syncClearButton();
}

function normalizeFilterQuery(value) {
  return String(value || "").trim().toLowerCase();
}

function cardMatchesFilter(card, query) {
  if (!query) {
    return true;
  }

  const priorityLabel = sanitizePriority(card.priority);
  const haystack = [
    card.title,
    card.description,
    card.assignee,
    Array.isArray(card.tags) ? card.tags.join(" ") : "",
    Array.isArray(card.checklist) ? card.checklist.map((item) => item?.text || "").join(" ") : "",
    priorityLabel,
    card.dueDate,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function setupActivityTracking() {
  const markActive = () => {
    lastUserInteractionAt = Date.now();
    if (!document.hidden) {
      scheduleNextSync(300);
    }
  };

  ["pointerdown", "keydown", "dragstart", "drop", "input"].forEach((eventName) => {
    document.addEventListener(eventName, markActive, { passive: true });
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      scheduleNextSync(250);
    } else {
      scheduleNextSync(getAdaptiveSyncDelay());
    }
  });
}

function setupUserMenu() {
  if (!userMenuToggle || !userMenu || !logoutBtn) {
    return;
  }

  userMenuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isHidden = userMenu.hidden;
    userMenu.hidden = !isHidden;
    userMenuToggle.setAttribute("aria-expanded", isHidden ? "true" : "false");
  });

  document.addEventListener("click", (event) => {
    if (!userMenu.hidden && !userMenu.contains(event.target) && !userMenuToggle.contains(event.target)) {
      userMenu.hidden = true;
      userMenuToggle.setAttribute("aria-expanded", "false");
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
        retries: 1,
      });
    } catch {
      // no-op
    }
    redirectToLogin();
  });
}

async function loadCurrentUser() {
  const response = await apiRequest("/api/me", { cache: "no-store", retries: 1 });
  if (response.status === 401 || !response.ok) {
    return null;
  }
  return response.payload;
}

function getUserInitials(value) {
  const parts = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function redirectToLogin() {
  window.location.href = "/";
}
