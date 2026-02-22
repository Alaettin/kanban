const tbody = document.getElementById("user-tbody");
const searchInput = document.getElementById("search-input");
const deleteModal = document.getElementById("delete-modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const modalCancel = document.getElementById("modal-cancel");
const modalConfirm = document.getElementById("modal-confirm");
const localeDeBtn = document.getElementById("locale-de-btn");
const localeEnBtn = document.getElementById("locale-en-btn");
const adminTitle = document.getElementById("admin-title");
const saveBar = document.getElementById("save-bar");
const saveBarText = document.getElementById("save-bar-text");
const saveDiscard = document.getElementById("save-discard");
const saveConfirmBtn = document.getElementById("save-confirm");

const AVAILABLE_APPS = [
  { id: "kanban", name: "Kanban Board" },
  { id: "dti-connector", name: "DTI Connector" },
  { id: "card-scanner", name: "Card Scanner" },
  { id: "aas-chat", name: "AAS Chat" },
];

const I18N = {
  de: {
    title: "Benutzerverwaltung",
    search: "Suchen...",
    thUser: "Benutzer",
    thRole: "Rolle",
    thApps: "App-Zugang",
    thCreated: "Erstellt",
    thActions: "Aktionen",
    superadmin: "Superadmin",
    admin: "Admin",
    user: "User",
    deleteBtn: "Entfernen",
    modalTitle: "Benutzer entfernen?",
    modalText: "Alle Daten dieses Benutzers werden unwiderruflich gelöscht.",
    modalCancel: "Abbrechen",
    modalConfirm: "Entfernen",
    unsaved: "Ungespeicherte Änderungen",
    discard: "Verwerfen",
    save: "Übernehmen",
  },
  en: {
    title: "User Management",
    search: "Search...",
    thUser: "User",
    thRole: "Role",
    thApps: "App Access",
    thCreated: "Created",
    thActions: "Actions",
    superadmin: "Superadmin",
    admin: "Admin",
    user: "User",
    deleteBtn: "Remove",
    modalTitle: "Remove user?",
    modalText: "All data of this user will be permanently deleted.",
    modalCancel: "Cancel",
    modalConfirm: "Remove",
    unsaved: "Unsaved changes",
    discard: "Discard",
    save: "Save",
  },
};

let locale = localStorage.getItem("kanban-locale") || "de";
let users = [];
let deleteUserId = null;

// Pending changes: { userId: { role?: string, access?: { appId: boolean } } }
let pending = {};

function t(key) {
  return (I18N[locale] && I18N[locale][key]) || key;
}

function hasPendingChanges() {
  return Object.keys(pending).length > 0;
}

function updateSaveBar() {
  const has = hasPendingChanges();
  saveBarText.textContent = has ? t("unsaved") : "";
  saveDiscard.textContent = t("discard");
  saveConfirmBtn.textContent = t("save");
  saveDiscard.disabled = !has;
  saveConfirmBtn.disabled = !has;
}

function markPendingRole(userId, role) {
  const original = users.find((u) => u.id === userId);
  if (!pending[userId]) pending[userId] = {};
  if (original && original.role === role) {
    delete pending[userId].role;
    if (!pending[userId].role && !pending[userId].access) delete pending[userId];
  } else {
    pending[userId].role = role;
  }
  updateSaveBar();
}

function markPendingAccess(userId, appId, granted) {
  const original = users.find((u) => u.id === userId);
  if (!pending[userId]) pending[userId] = {};
  if (!pending[userId].access) pending[userId].access = {};
  const originalGranted = original ? original.apps.includes(appId) : false;
  if (granted === originalGranted) {
    delete pending[userId].access[appId];
    if (Object.keys(pending[userId].access).length === 0) delete pending[userId].access;
    if (!pending[userId].role && !pending[userId].access) delete pending[userId];
  } else {
    pending[userId].access[appId] = granted;
  }
  updateSaveBar();
}

function discardChanges() {
  pending = {};
  updateSaveBar();
  renderUsers();
}

async function saveChanges() {
  saveConfirmBtn.disabled = true;
  for (const userId of Object.keys(pending)) {
    const changes = pending[userId];
    if (changes.role) {
      await apiRequest(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        body: { role: changes.role },
      });
    }
    if (changes.access) {
      for (const appId of Object.keys(changes.access)) {
        await apiRequest(`/api/admin/users/${userId}/access`, {
          method: "PUT",
          body: { appId, granted: changes.access[appId] },
        });
      }
    }
  }
  pending = {};
  saveConfirmBtn.disabled = false;
  updateSaveBar();
  await loadUsers();
}

async function apiRequest(path, options = {}) {
  const { method = "GET", body } = options;
  try {
    const response = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    let payload = null;
    const ct = response.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      payload = await response.json();
    }
    if (response.status === 401) {
      window.location.href = "/";
      return { ok: false, status: 401, payload };
    }
    if (response.status === 403) {
      window.location.href = "/dashboard";
      return { ok: false, status: 403, payload };
    }
    return { ok: response.ok, status: response.status, payload };
  } catch (error) {
    return { ok: false, status: 0, payload: null, error };
  }
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function loadUsers() {
  const result = await apiRequest("/api/admin/users");
  if (result.ok && result.payload?.users) {
    users = result.payload.users;
    renderUsers();
  }
}

function getEffectiveRole(u) {
  if (u.isSuperadmin) return "superadmin";
  if (pending[u.id]?.role) return pending[u.id].role;
  return u.role;
}

function getEffectiveAccess(u, appId) {
  if (pending[u.id]?.access && appId in pending[u.id].access) {
    return pending[u.id].access[appId];
  }
  return u.apps.includes(appId);
}

function renderUsers() {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = query
    ? users.filter((u) => (u.name || "").toLowerCase().includes(query) || (u.email || "").toLowerCase().includes(query))
    : users;

  tbody.innerHTML = "";
  for (const u of filtered) {
    const tr = document.createElement("tr");
    const hasChange = !!pending[u.id];
    if (hasChange) tr.style.background = "rgba(37, 99, 235, 0.04)";

    // User cell
    const tdUser = document.createElement("td");
    tdUser.className = "td-user";
    tdUser.innerHTML = `
      <div class="user-cell">
        <div class="user-avatar">${getInitials(u.name)}</div>
        <div>
          <div class="user-name">${escapeHtml(u.name || "-")}</div>
          <div class="user-email">${escapeHtml(u.email || "")}</div>
        </div>
      </div>`;
    tr.appendChild(tdUser);

    // Role cell
    const tdRole = document.createElement("td");
    tdRole.className = "td-role";
    if (u.isSuperadmin) {
      tdRole.innerHTML = `<span class="role-badge role-badge-superadmin">${t("superadmin")}</span>`;
    } else {
      const effectiveRole = getEffectiveRole(u);
      const select = document.createElement("select");
      select.className = "role-select";
      select.innerHTML = `<option value="user"${effectiveRole === "user" ? " selected" : ""}>${t("user")}</option><option value="admin"${effectiveRole === "admin" ? " selected" : ""}>${t("admin")}</option>`;
      select.addEventListener("change", () => markPendingRole(u.id, select.value));
      tdRole.appendChild(select);
    }
    tr.appendChild(tdRole);

    // App access cell
    const tdApps = document.createElement("td");
    tdApps.className = "td-apps";
    if (u.isSuperadmin) {
      tdApps.innerHTML = '<span style="color:var(--muted);font-size:0.8rem">-</span>';
    } else {
      const wrap = document.createElement("div");
      wrap.className = "app-toggles";
      for (const app of AVAILABLE_APPS) {
        const label = document.createElement("label");
        label.className = "app-toggle";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = getEffectiveAccess(u, app.id);
        cb.addEventListener("change", () => markPendingAccess(u.id, app.id, cb.checked));
        const track = document.createElement("span");
        track.className = "toggle-track";
        label.appendChild(cb);
        label.appendChild(track);
        label.appendChild(document.createTextNode(app.name));
        wrap.appendChild(label);
      }
      tdApps.appendChild(wrap);
    }
    tr.appendChild(tdApps);

    // Created cell
    const tdCreated = document.createElement("td");
    tdCreated.className = "created-date td-created";
    tdCreated.textContent = formatDate(u.createdAt);
    tr.appendChild(tdCreated);

    // Actions cell
    const tdActions = document.createElement("td");
    tdActions.className = "td-actions";
    if (u.isSuperadmin) {
      tdActions.innerHTML = "";
    } else {
      const btn = document.createElement("button");
      btn.className = "btn btn-danger";
      btn.textContent = t("deleteBtn");
      btn.addEventListener("click", () => openDeleteModal(u.id, u.name || u.email));
      tdActions.appendChild(btn);
    }
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  }
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function openDeleteModal(userId, displayName) {
  deleteUserId = userId;
  modalTitle.textContent = t("modalTitle");
  modalText.textContent = `${escapeHtml(displayName)} — ${t("modalText")}`;
  deleteModal.hidden = false;
}

function closeDeleteModal() {
  deleteModal.hidden = true;
  deleteUserId = null;
}

modalCancel.addEventListener("click", closeDeleteModal);

deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) closeDeleteModal();
});

modalConfirm.addEventListener("click", async () => {
  if (!deleteUserId) return;
  await apiRequest(`/api/admin/users/${deleteUserId}`, { method: "DELETE" });
  delete pending[deleteUserId];
  closeDeleteModal();
  updateSaveBar();
  await loadUsers();
});

saveDiscard.addEventListener("click", discardChanges);
saveConfirmBtn.addEventListener("click", saveChanges);

// Locale
function setLocale(lang) {
  locale = lang;
  localStorage.setItem("kanban-locale", lang);
  document.documentElement.lang = lang;
  localeDeBtn.classList.toggle("active", lang === "de");
  localeEnBtn.classList.toggle("active", lang === "en");
  localeDeBtn.setAttribute("aria-checked", String(lang === "de"));
  localeEnBtn.setAttribute("aria-checked", String(lang === "en"));
  applyLocale();
}

function applyLocale() {
  adminTitle.textContent = t("title");
  searchInput.placeholder = t("search");
  document.getElementById("th-user").textContent = t("thUser");
  document.getElementById("th-role").textContent = t("thRole");
  document.getElementById("th-apps").textContent = t("thApps");
  document.getElementById("th-created").textContent = t("thCreated");
  document.getElementById("th-actions").textContent = t("thActions");
  modalCancel.textContent = t("modalCancel");
  modalConfirm.textContent = t("modalConfirm");
  updateSaveBar();
  renderUsers();
}

localeDeBtn.addEventListener("click", () => setLocale("de"));
localeEnBtn.addEventListener("click", () => setLocale("en"));

searchInput.addEventListener("input", () => renderUsers());

// Init
setLocale(locale);
loadUsers();
