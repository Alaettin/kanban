/* ── AAS Repository Proxy — Frontend ──────────────────────── */
"use strict";

const APP_BASE = "/apps/aas-repo-proxy";

// ── i18n ─────────────────────────────────────────────────────
const I18N = {
  de: {
    brandText: "AAS Repository Proxy",
    sidebarTitle: "Proxies",
    newProxy: "Neuer Proxy",
    noProxies: "Noch keine Proxies.",
    emptyState: "Proxy auswählen oder erstellen",
    configTitle: "Konfiguration",
    lblBaseUrl: "AAS Base URL",
    lblItemsEndpoint: "Item ID Endpoint",
    lblAutoRefresh: "Auto-Refresh (min)",
    saveBtn: "Speichern",
    cacheTitle: "Daten",
    refreshBtn: "Daten aktualisieren",
    lblStatus: "Status",
    lblShells: "Shells",
    lblItems: "Items",
    lblLastRefresh: "Letzter Refresh",
    lblErrors: "Fehler",
    errorsTitle: "Fehler",
    statusReady: "Bereit",
    statusBuilding: "Aktualisiert…",
    statusEmpty: "Leer",
    statusError: "Fehler",
    toastSaved: "Konfiguration gespeichert",
    toastSaveErr: "Speichern fehlgeschlagen",
    toastRefreshStarted: "Aktualisierung gestartet",
    toastRefreshBusy: "Aktualisierung l\u00E4uft bereits",
    toastRefreshErr: "Aktualisierung fehlgeschlagen",
    toastCreated: "Proxy erstellt",
    toastDeleted: "Proxy gel\u00F6scht",
    toastRenamed: "Proxy umbenannt",
    logout: "Logout",
    buildProgress: "Daten werden aktualisiert…",
    deleteTitle: "Proxy l\u00F6schen?",
    deleteMsg: 'Alle Daten von \u201E{name}\u201C werden gel\u00F6scht.',
    deleteCancel: "Abbrechen",
    deleteConfirm: "Löschen",
    shellsLabel: "Shells",
  },
  en: {
    brandText: "AAS Repository Proxy",
    sidebarTitle: "Proxies",
    newProxy: "New Proxy",
    noProxies: "No proxies yet.",
    emptyState: "Select or create a proxy",
    configTitle: "Configuration",
    lblBaseUrl: "AAS Base URL",
    lblItemsEndpoint: "Item ID Endpoint",
    lblAutoRefresh: "Auto-Refresh (min)",
    saveBtn: "Save",
    cacheTitle: "Data",
    refreshBtn: "Refresh Data",
    lblStatus: "Status",
    lblShells: "Shells",
    lblItems: "Items",
    lblLastRefresh: "Last Refresh",
    lblErrors: "Errors",
    errorsTitle: "Errors",
    statusReady: "Ready",
    statusBuilding: "Refreshing…",
    statusEmpty: "Empty",
    statusError: "Error",
    toastSaved: "Configuration saved",
    toastSaveErr: "Save failed",
    toastRefreshStarted: "Refresh started",
    toastRefreshBusy: "Refresh already in progress",
    toastRefreshErr: "Refresh failed",
    toastCreated: "Proxy created",
    toastDeleted: "Proxy deleted",
    toastRenamed: "Proxy renamed",
    logout: "Logout",
    buildProgress: "Refreshing data…",
    deleteTitle: "Delete proxy?",
    deleteMsg: "All data for \"{name}\" will be deleted.",
    deleteCancel: "Cancel",
    deleteConfirm: "Delete",
    shellsLabel: "Shells",
  },
};

let locale = localStorage.getItem("kanban-locale") || "de";
function t(k) { return I18N[locale]?.[k] || I18N.de[k] || k; }

// ── DOM refs ─────────────────────────────────────────────────
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const brandText      = $("#brand-text");
const docsLink       = $("#docs-link");
const sidebarTitle   = $("#sidebar-title");
const proxyAddBtn    = $("#proxy-add-btn");
const proxyList      = $("#proxy-list");
const proxyHint      = $("#proxy-hint");
const emptyState     = $("#empty-state");
const emptyStateText = $("#empty-state-text");
const proxyDetail    = $("#proxy-detail");
const configForm     = $("#config-form");
const fBaseUrl       = $("#f-base-url");
const fItemsEp       = $("#f-items-endpoint");
const fAutoRefresh   = $("#f-auto-refresh");
const refreshBtn     = $("#refresh-btn");
const errorsCard     = $("#errors-card");
const errorsList     = $("#errors-list");
const buildProgress  = $("#build-progress");
const toastEl        = $("#aw-toast");
const baseUrlText    = $("#proxy-base-url-text");
const copyBaseUrlBtn = $("#copy-base-url-btn");
const deleteModal    = $("#delete-modal");

// ── State ────────────────────────────────────────────────────
let proxies = [];
let currentProxyId = null;
let addingProxy = false;
let deleteProxyId = null;
let deleteProxyName = "";

// ── API helper ───────────────────────────────────────────────
async function api(path, opts = {}) {
  const res = await fetch(`${APP_BASE}${path}`, {
    method: opts.method || "GET",
    headers: opts.body ? { "Content-Type": "application/json" } : {},
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (res.status === 401) { location.href = "/login"; return null; }
  return res.json();
}

// ── Toast ────────────────────────────────────────────────────
let toastTimer;
function toast(msg, isError) {
  toastEl.textContent = msg;
  toastEl.classList.toggle("error", !!isError);
  toastEl.hidden = false;
  requestAnimationFrame(() => toastEl.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
    setTimeout(() => { toastEl.hidden = true; }, 300);
  }, 2500);
}

// ── Locale ───────────────────────────────────────────────────
function applyLocale() {
  document.documentElement.lang = locale;
  brandText.textContent = t("brandText");
  sidebarTitle.textContent = t("sidebarTitle");
  emptyStateText.textContent = t("emptyState");

  if (currentProxyId) applyDetailLocale();

  $$(".locale-switch-btn").forEach(b => {
    b.classList.toggle("active", b.id === `locale-${locale}-btn`);
    b.setAttribute("aria-checked", b.id === `locale-${locale}-btn` ? "true" : "false");
  });
}

function applyDetailLocale() {
  $("#config-title").textContent = t("configTitle");
  $("#lbl-base-url").textContent = t("lblBaseUrl");
  $("#lbl-items-endpoint").textContent = t("lblItemsEndpoint");
  $("#lbl-auto-refresh").textContent = t("lblAutoRefresh");
  $("#save-btn-label").textContent = t("saveBtn");
  $("#cache-title").textContent = t("cacheTitle");
  $("#refresh-btn-label").textContent = t("refreshBtn");
  $("#lbl-status").textContent = t("lblStatus");
  $("#lbl-shells").textContent = t("lblShells");
  $("#lbl-items").textContent = t("lblItems");
  $("#lbl-last-refresh").textContent = t("lblLastRefresh");
  $("#lbl-errors").textContent = t("lblErrors");
  $("#errors-title").textContent = t("errorsTitle");
  $("#build-progress-text").textContent = t("buildProgress");
  $("#logout-btn").textContent = t("logout");
}

function setLocale(l) {
  locale = l;
  localStorage.setItem("kanban-locale", l);
  applyLocale();
  renderSidebar();
}

// ── Util ─────────────────────────────────────────────────────
function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

// ══════════════════════════════════════════════════════════════
// ── Sidebar: Proxy List ─────────────────────────────────────
// ══════════════════════════════════════════════════════════════

async function loadProxies() {
  const data = await api("/api/proxies");
  if (!data) return;
  proxies = data.proxies || [];
  renderSidebar();
}

function renderSidebar() {
  proxyList.innerHTML = "";

  if (addingProxy) {
    proxyList.appendChild(renderNewProxyRow());
  }

  if (proxies.length === 0 && !addingProxy) {
    proxyHint.textContent = t("noProxies");
    proxyHint.hidden = false;
  } else {
    proxyHint.hidden = true;
  }

  for (const p of proxies) {
    proxyList.appendChild(renderProxyItem(p));
  }
}

function renderProxyItem(p) {
  const item = document.createElement("div");
  item.className = "proxy-item" + (p.proxy_id === currentProxyId ? " selected" : "");

  const info = document.createElement("div");
  info.className = "proxy-item-info";

  const name = document.createElement("div");
  name.className = "proxy-item-name";
  name.textContent = p.name;

  const meta = document.createElement("div");
  meta.className = "proxy-item-meta";

  const status = document.createElement("span");
  status.className = "proxy-item-status";
  if (p.shellCount > 0) {
    status.classList.add("ready");
    status.textContent = `${p.shellCount} ${t("shellsLabel")}`;
  } else if (p.errorCount > 0) {
    status.classList.add("error");
    status.textContent = t("statusError");
  } else {
    status.textContent = t("statusEmpty");
  }
  meta.appendChild(status);
  info.appendChild(name);
  info.appendChild(meta);

  // Actions
  const actions = document.createElement("div");
  actions.className = "proxy-item-actions";

  const renameBtn = document.createElement("button");
  renameBtn.className = "proxy-item-btn";
  renameBtn.title = "Rename";
  renameBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  renameBtn.addEventListener("click", (e) => { e.stopPropagation(); renameProxy(p); });

  const delBtn = document.createElement("button");
  delBtn.className = "proxy-item-del";
  delBtn.title = "Delete";
  delBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
  delBtn.addEventListener("click", (e) => { e.stopPropagation(); confirmDeleteProxy(p); });

  actions.appendChild(renameBtn);
  actions.appendChild(delBtn);

  item.appendChild(info);
  item.appendChild(actions);
  item.addEventListener("click", () => selectProxy(p.proxy_id, p.name));
  return item;
}

function renderNewProxyRow() {
  const row = document.createElement("div");
  row.className = "proxy-new-row";

  const input = document.createElement("input");
  input.className = "proxy-new-input";
  input.type = "text";
  input.placeholder = "Proxy Name…";
  input.maxLength = 60;

  const confirmBtn = document.createElement("button");
  confirmBtn.className = "proxy-new-confirm";
  confirmBtn.type = "button";
  confirmBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "proxy-new-cancel";
  cancelBtn.type = "button";
  cancelBtn.innerHTML = '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  async function doCreate() {
    const name = input.value.trim();
    if (!name) return;
    const data = await api("/api/proxies", { method: "POST", body: { name } });
    if (data?.proxy_id) {
      proxies.push({ ...data, shellCount: 0, errorCount: 0, totalItems: 0 });
      toast(t("toastCreated"));
      addingProxy = false;
      renderSidebar();
      selectProxy(data.proxy_id, data.name);
    } else {
      addingProxy = false;
      renderSidebar();
    }
  }

  confirmBtn.addEventListener("click", doCreate);
  cancelBtn.addEventListener("click", () => { addingProxy = false; renderSidebar(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doCreate();
    if (e.key === "Escape") { addingProxy = false; renderSidebar(); }
  });

  row.appendChild(input);
  row.appendChild(confirmBtn);
  row.appendChild(cancelBtn);
  requestAnimationFrame(() => input.focus());
  return row;
}

// ── Rename ───────────────────────────────────────────────────
function renameProxy(p) {
  const newName = prompt("Name:", p.name);
  if (!newName || newName.trim() === p.name) return;
  api(`/api/proxies/${p.proxy_id}`, { method: "PUT", body: { name: newName.trim() } })
    .then(data => {
      if (data?.ok) {
        p.name = newName.trim();
        toast(t("toastRenamed"));
        renderSidebar();
      }
    });
}

// ── Delete ───────────────────────────────────────────────────
function confirmDeleteProxy(p) {
  deleteProxyId = p.proxy_id;
  deleteProxyName = p.name;
  $("#delete-modal-title").textContent = t("deleteTitle");
  $("#delete-modal-msg").textContent = t("deleteMsg").replace("{name}", p.name);
  $("#delete-cancel-btn").textContent = t("deleteCancel");
  $("#delete-confirm-btn").textContent = t("deleteConfirm");
  deleteModal.showModal();
}

async function doDeleteProxy() {
  if (!deleteProxyId) return;
  const data = await api(`/api/proxies/${deleteProxyId}`, { method: "DELETE" });
  if (data?.ok) {
    proxies = proxies.filter(p => p.proxy_id !== deleteProxyId);
    if (currentProxyId === deleteProxyId) deselectProxy();
    toast(t("toastDeleted"));
    renderSidebar();
  }
  deleteProxyId = null;
  deleteModal.close();
}

// ══════════════════════════════════════════════════════════════
// ── Proxy Detail (right panel) ──────────────────────────────
// ══════════════════════════════════════════════════════════════

let pollTimer = null;

function selectProxy(proxyId, proxyName) {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  currentProxyId = proxyId;

  // Update sidebar selection
  renderSidebar();

  // Show detail, hide empty state
  emptyState.hidden = true;
  proxyDetail.hidden = false;

  // Update docs link
  docsLink.href = `${APP_BASE}/docs?proxy=${proxyId}`;

  // Show base URL
  baseUrlText.textContent = `${location.origin}${APP_BASE}/${proxyId}`;

  applyDetailLocale();
  loadConfig();
  loadStatus();
}

function deselectProxy() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  currentProxyId = null;
  proxyDetail.hidden = true;
  emptyState.hidden = false;
  docsLink.href = `${APP_BASE}/docs`;
}

// ── Config ───────────────────────────────────────────────────
async function loadConfig() {
  if (!currentProxyId) return;
  const data = await api(`/api/proxies/${currentProxyId}/config`);
  if (!data) return;
  fBaseUrl.value = data.aas_base_url || "";
  fItemsEp.value = data.items_endpoint || "";
  fAutoRefresh.value = data.auto_refresh_min || 0;
}

async function saveConfig(e) {
  e.preventDefault();
  if (!currentProxyId) return;
  const data = await api(`/api/proxies/${currentProxyId}/config`, {
    method: "PUT",
    body: {
      aas_base_url: fBaseUrl.value.trim(),
      items_endpoint: fItemsEp.value.trim(),
      auto_refresh_min: parseInt(fAutoRefresh.value) || 0,
    },
  });
  if (data?.ok) toast(t("toastSaved"));
  else toast(t("toastSaveErr"), true);
}

// ── Status ───────────────────────────────────────────────────
async function loadStatus() {
  if (!currentProxyId) return;
  const data = await api(`/api/proxies/${currentProxyId}/status`);
  if (!data) return;
  renderStatus(data);
  if (data.building) {
    if (!pollTimer) pollTimer = setInterval(loadStatus, 3000);
    buildProgress.hidden = false;
    refreshBtn.disabled = true;
  } else {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    buildProgress.hidden = true;
    refreshBtn.disabled = false;
  }
}

function renderStatus(s) {
  const valStatus = $("#val-status");
  const valShells = $("#val-shells");
  const valItems = $("#val-items");
  const valRefresh = $("#val-last-refresh");
  const valErrors = $("#val-errors");

  valStatus.className = "status-value";
  if (s.building) {
    valStatus.textContent = t("statusBuilding");
    valStatus.classList.add("building");
  } else if (s.errorCount > 0 && s.shellCount === 0) {
    valStatus.textContent = t("statusError");
    valStatus.classList.add("error");
  } else if (s.shellCount > 0) {
    valStatus.textContent = t("statusReady");
    valStatus.classList.add("ready");
  } else {
    valStatus.textContent = t("statusEmpty");
  }

  valShells.textContent = s.shellCount;
  valItems.textContent = s.totalItems;

  if (s.lastRefresh) {
    const d = new Date(s.lastRefresh);
    valRefresh.textContent = d.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } else {
    valRefresh.textContent = "—";
  }

  valErrors.textContent = s.errorCount;
  valErrors.className = "status-value" + (s.errorCount > 0 ? " error" : "");

  if (s.errors && s.errors.length > 0) {
    errorsCard.hidden = false;
    errorsList.innerHTML = s.errors.map(e =>
      `<div class="error-item">
        <span class="error-item-id">${esc(e.itemId)}</span>
        <span class="error-item-msg">${esc(e.error)}</span>
      </div>`
    ).join("");
  } else {
    errorsCard.hidden = true;
  }
}

// ── Refresh ──────────────────────────────────────────────────
async function triggerRefresh() {
  if (!currentProxyId) return;
  refreshBtn.disabled = true;
  const data = await api(`/api/proxies/${currentProxyId}/refresh`, { method: "POST" });
  if (data?.ok) {
    toast(t("toastRefreshStarted"));
    buildProgress.hidden = false;
    if (!pollTimer) pollTimer = setInterval(loadStatus, 3000);
    setTimeout(loadStatus, 500);
  } else if (data?.error === "BUILD_IN_PROGRESS") {
    toast(t("toastRefreshBusy"), true);
    refreshBtn.disabled = false;
  } else {
    toast(t("toastRefreshErr"), true);
    refreshBtn.disabled = false;
  }
}

// ── Copy Base URL ────────────────────────────────────────────
function copyBaseUrl() {
  if (!currentProxyId) return;
  const url = `${location.origin}${APP_BASE}/${currentProxyId}`;
  navigator.clipboard.writeText(url).then(() => {
    copyBaseUrlBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    setTimeout(() => {
      copyBaseUrlBtn.innerHTML = '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }, 1500);
  });
}

// ── User Menu ────────────────────────────────────────────────
function initUserMenu() {
  const toggle = $("#user-menu-toggle");
  const menu = $("#user-menu");

  fetch("/api/me").then(r => r.json()).then(u => {
    if (u?.name) {
      const parts = u.name.split(" ");
      $("#user-initials").textContent = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
      $("#user-info").textContent = u.name;
    }
  }).catch(() => {});

  toggle.addEventListener("click", () => {
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".user-menu-wrap")) menu.hidden = true;
  });

  $("#locale-de-btn").addEventListener("click", () => setLocale("de"));
  $("#locale-en-btn").addEventListener("click", () => setLocale("en"));
  $("#logout-btn").addEventListener("click", () => { location.href = "/auth/logout"; });
}

// ── Init ─────────────────────────────────────────────────────
proxyAddBtn.addEventListener("click", () => { addingProxy = true; renderSidebar(); });
configForm.addEventListener("submit", saveConfig);
refreshBtn.addEventListener("click", triggerRefresh);
copyBaseUrlBtn.addEventListener("click", copyBaseUrl);
$("#delete-form").addEventListener("submit", (e) => { e.preventDefault(); doDeleteProxy(); });
$("#delete-cancel-btn").addEventListener("click", () => deleteModal.close());

initUserMenu();
applyLocale();
loadProxies();
