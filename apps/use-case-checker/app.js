/* === Use Case Checker — Frontend === */

// ---------------------------------------------------------------------------
// i18n
// ---------------------------------------------------------------------------
const I18N = {
  de: {
    brandText: "Use Case Checker",
    overview: "Übersicht",
    sources: "AAS Quellen",
    sectionConfig: "Konfiguration",
    overviewTitle: "AAS Übersicht",
    overviewDesc: "Alle AAS aus allen Quellen auf einen Blick.",
    colAasId: "AAS ID",
    colSource: "Quelle",
    colStatus: "Status",
    colLastEval: "Letzte Auswertung",
    colActions: "Aktionen",
    statusPending: "Ausstehend",
    statusPass: "Bestanden",
    statusPartial: "Teilweise",
    statusFail: "Nicht bestanden",
    statusError: "Nicht erreichbar",
    evaluate: "Auswerten",
    evaluateAll: "Alle auswerten",
    overviewEmpty: "Keine AAS registriert. Lege zuerst Quellen an.",
    sourcesTitle: "AAS Quellen",
    sourcesDesc: "Definiere AAS-Repository-Endpunkte und deren AAS IDs.",
    addSource: "Quelle hinzufügen",
    editSource: "Bearbeiten",
    sourceName: "Name",
    sourceUrl: "Basis-URL",
    noSources: "Noch keine Quellen vorhanden.",
    noAasIds: "Noch keine AAS IDs für diese Quelle.",
    addAasIds: "AAS IDs hinzufügen",
    aasIdPlaceholder: "Eine AAS ID pro Zeile",
    confirmDeleteSource: "Quelle wirklich löschen? Alle zugehörigen AAS IDs werden ebenfalls entfernt.",
    useCasesTitle: "Use Cases",
    useCasesDesc: "Definiere Use Cases mit erforderlichen Submodellen.",
    addUseCase: "Use Case hinzufügen",
    editUseCase: "Use Case bearbeiten",
    caseName: "Name",
    caseDesc: "Beschreibung",
    requiredSubmodels: "Erforderliche Submodelle",
    semanticId: "Semantic ID",
    idShort: "idShort",
    addSubmodel: "Submodell hinzufügen",
    noUseCases: "Noch keine Use Cases vorhanden.",
    confirmDeleteCase: "Use Case wirklich löschen?",
    evalTitle: "Auswertung",
    evalStep1: "Shell herunterladen...",
    evalStep2: "Submodelle herunterladen",
    evalStep3: "Auswertung...",
    evalResults: "Ergebnisse",
    evalPassed: "Bestanden",
    evalFailed: "Nicht bestanden",
    evalFound: "Vorhanden",
    evalMissing: "Fehlt",
    evalNoUseCases: "Keine Use Cases definiert.",
    evalError: "Fehler beim Herunterladen",
    viewEval: "Details anzeigen",
    aasMeta: "AAS Informationen",
    aasIdShort: "idShort",
    assetId: "Asset ID",
    aasDescription: "Beschreibung",
    submodelDetails: "Submodelle",
    save: "Speichern",
    cancel: "Abbrechen",
    close: "Schließen",
    delete: "Löschen",
    add: "Hinzufügen",
    logout: "Logout",
  },
  en: {
    brandText: "Use Case Checker",
    overview: "Overview",
    sources: "AAS Sources",
    sectionConfig: "Configuration",
    overviewTitle: "AAS Overview",
    overviewDesc: "All AAS from all sources at a glance.",
    colAasId: "AAS ID",
    colSource: "Source",
    colStatus: "Status",
    colLastEval: "Last Evaluation",
    colActions: "Actions",
    statusPending: "Pending",
    statusPass: "Passed",
    statusPartial: "Partial",
    statusFail: "Failed",
    statusError: "Unreachable",
    evaluate: "Evaluate",
    evaluateAll: "Evaluate all",
    overviewEmpty: "No AAS registered. Create sources first.",
    sourcesTitle: "AAS Sources",
    sourcesDesc: "Define AAS repository endpoints and their AAS IDs.",
    addSource: "Add source",
    editSource: "Edit",
    sourceName: "Name",
    sourceUrl: "Base URL",
    noSources: "No sources yet.",
    noAasIds: "No AAS IDs for this source.",
    addAasIds: "Add AAS IDs",
    aasIdPlaceholder: "One AAS ID per line",
    confirmDeleteSource: "Really delete this source? All associated AAS IDs will be removed.",
    useCasesTitle: "Use Cases",
    useCasesDesc: "Define use cases with required submodels.",
    addUseCase: "Add use case",
    editUseCase: "Edit use case",
    caseName: "Name",
    caseDesc: "Description",
    requiredSubmodels: "Required Submodels",
    semanticId: "Semantic ID",
    idShort: "idShort",
    addSubmodel: "Add submodel",
    noUseCases: "No use cases yet.",
    confirmDeleteCase: "Really delete this use case?",
    evalTitle: "Evaluation",
    evalStep1: "Downloading shell...",
    evalStep2: "Downloading submodels",
    evalStep3: "Evaluating...",
    evalResults: "Results",
    evalPassed: "Passed",
    evalFailed: "Failed",
    evalFound: "Found",
    evalMissing: "Missing",
    evalNoUseCases: "No use cases defined.",
    evalError: "Download error",
    viewEval: "View details",
    aasMeta: "AAS Information",
    aasIdShort: "idShort",
    assetId: "Asset ID",
    aasDescription: "Description",
    submodelDetails: "Submodels",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    delete: "Delete",
    add: "Add",
    logout: "Logout",
  },
};

let locale = localStorage.getItem("kanban-locale") || "de";
function t(key) { return (I18N[locale] && I18N[locale][key]) || I18N.de[key] || key; }

// ---------------------------------------------------------------------------
// DOM refs
// ---------------------------------------------------------------------------
const brandText = document.getElementById("brand-text");
const userMenuToggle = document.getElementById("user-menu-toggle");
const userMenu = document.getElementById("user-menu");
const userInitials = document.getElementById("user-initials");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");
const localeDeBtn = document.getElementById("locale-de-btn");
const localeEnBtn = document.getElementById("locale-en-btn");
const sidebarNav = document.getElementById("sidebar-nav");
const sidebarToggle = document.getElementById("sidebar-toggle");

// Overview
const overviewTbody = document.getElementById("overview-tbody");
const overviewEmpty = document.getElementById("overview-empty");
const overviewTable = document.getElementById("overview-table");
const ovTotalCount = document.getElementById("ov-total-count");
const evaluateAllBtn = document.getElementById("evaluate-all-btn");

// Sources
const sourcesList = document.getElementById("sources-list");
const sourcesEmpty = document.getElementById("sources-empty");
const addSourceBtn = document.getElementById("add-source-btn");

// Use Cases
const useCasesList = document.getElementById("use-cases-list");
const useCasesEmpty = document.getElementById("use-cases-empty");
const addUseCaseBtn = document.getElementById("add-use-case-btn");

// Source Dialog
const sourceDialog = document.getElementById("source-dialog");
const sourceDialogTitle = document.getElementById("source-dialog-title");
const sourceNameInput = document.getElementById("source-name-input");
const sourceUrlInput = document.getElementById("source-url-input");
const sourceSaveBtn = document.getElementById("source-save-btn");
const sourceCancelBtn = document.getElementById("source-cancel-btn");

// AAS IDs Dialog
const aasIdsDialog = document.getElementById("aas-ids-dialog");
const aasIdsDialogTitle = document.getElementById("aas-ids-dialog-title");
const aasIdsSourceInfo = document.getElementById("aas-ids-source-info");
const aasIdsList = document.getElementById("aas-ids-list");
const aasIdsEmpty = document.getElementById("aas-ids-empty");
const aasIdsTextarea = document.getElementById("aas-ids-textarea");
const aasIdsAddBtn = document.getElementById("aas-ids-add-btn");
const aasIdsCloseBtn = document.getElementById("aas-ids-close-btn");

// Use Case Dialog
const useCaseDialog = document.getElementById("use-case-dialog");
const useCaseDialogTitle = document.getElementById("use-case-dialog-title");
const caseNameInput = document.getElementById("case-name-input");
const caseDescInput = document.getElementById("case-desc-input");
const caseSubmodelsList = document.getElementById("case-submodels-list");
const caseAddSubmodelBtn = document.getElementById("case-add-submodel-btn");
const caseSaveBtn = document.getElementById("case-save-btn");
const caseCancelBtn = document.getElementById("case-cancel-btn");

// Eval Dialog
const evalDialog = document.getElementById("eval-dialog");
const evalAasId = document.getElementById("eval-aas-id");
const evalStep1 = document.getElementById("eval-step-1");
const evalStep2 = document.getElementById("eval-step-2");
const evalStep3 = document.getElementById("eval-step-3");
const evalStep1Label = document.getElementById("eval-step-1-label");
const evalStep2Label = document.getElementById("eval-step-2-label");
const evalStep3Label = document.getElementById("eval-step-3-label");
const evalResults = document.getElementById("eval-results");
const evalResultsList = document.getElementById("eval-results-list");
const evalCloseBtn = document.getElementById("eval-close-btn");

// Confirm Dialog
const confirmDialog = document.getElementById("confirm-dialog");
const confirmTitle = document.getElementById("confirm-title");
const confirmMessage = document.getElementById("confirm-message");
const confirmOkBtn = document.getElementById("confirm-ok-btn");
const confirmCancelBtn = document.getElementById("confirm-cancel-btn");

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let currentUser = null;
let activePage = "overview";
let editingSourceId = null;
let editingCaseId = null;
let currentAasIdsSourceId = null;
let pendingConfirmAction = null;

// ---------------------------------------------------------------------------
// API helper
// ---------------------------------------------------------------------------
async function api(path, options = {}) {
  const { method = "GET", body } = options;
  try {
    const response = await fetch("/apps/use-case-checker" + path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    let payload = null;
    const ct = response.headers.get("content-type") || "";
    if (ct.includes("application/json")) payload = await response.json();
    if (response.status === 401) { window.location.href = "/"; return { ok: false, status: 401, payload }; }
    return { ok: response.ok, status: response.status, payload };
  } catch (error) {
    return { ok: false, status: 0, payload: null, error };
  }
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str || "";
  return d.innerHTML;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
function navigateTo(page) {
  activePage = page;
  sidebarNav.querySelectorAll(".sidebar-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
  document.querySelectorAll(".page-section").forEach(sec => {
    const match = sec.id === `page-${page}`;
    sec.classList.toggle("active", match);
    sec.hidden = !match;
  });
  if (page === "overview") loadOverview();
  else if (page === "sources") loadSources();
  else if (page === "use-cases") loadUseCases();
}

sidebarNav.addEventListener("click", (e) => {
  const btn = e.target.closest(".sidebar-item");
  if (!btn || !btn.dataset.page) return;
  navigateTo(btn.dataset.page);
});

sidebarToggle.addEventListener("click", () => {
  document.body.classList.toggle("sidebar-collapsed");
});

// ---------------------------------------------------------------------------
// Locale
// ---------------------------------------------------------------------------
function setLocale(lang) {
  locale = lang;
  localStorage.setItem("kanban-locale", lang);
  document.documentElement.lang = lang;
  localeDeBtn.classList.toggle("active", lang === "de");
  localeEnBtn.classList.toggle("active", lang === "en");
  localeDeBtn.setAttribute("aria-checked", String(lang === "de"));
  localeEnBtn.setAttribute("aria-checked", String(lang === "en"));
  applyLocaleToUI();
}

function applyLocaleToUI() {
  brandText.textContent = t("brandText");
  logoutBtn.textContent = t("logout");
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  // Re-render active page
  if (activePage === "overview") loadOverview();
  else if (activePage === "sources") loadSources();
  else if (activePage === "use-cases") loadUseCases();
}

localeDeBtn.addEventListener("click", () => setLocale("de"));
localeEnBtn.addEventListener("click", () => setLocale("en"));

// ---------------------------------------------------------------------------
// User menu
// ---------------------------------------------------------------------------
userMenuToggle.addEventListener("click", () => {
  const isHidden = userMenu.hidden;
  userMenu.hidden = !isHidden;
  userMenuToggle.setAttribute("aria-expanded", String(!isHidden));
});
document.addEventListener("click", (e) => {
  if (!userMenuToggle.contains(e.target) && !userMenu.contains(e.target)) {
    userMenu.hidden = true;
    userMenuToggle.setAttribute("aria-expanded", "false");
  }
});
logoutBtn.addEventListener("click", async () => {
  await fetch("/auth/logout", { method: "POST" });
  window.location.href = "/";
});

// ---------------------------------------------------------------------------
// OVERVIEW
// ---------------------------------------------------------------------------
async function loadOverview() {
  const res = await api("/api/overview");
  if (!res.ok) return;
  const items = res.payload.items || [];

  ovTotalCount.textContent = items.length;

  if (!items.length) {
    overviewTable.hidden = true;
    overviewEmpty.hidden = false;
    return;
  }
  overviewTable.hidden = false;
  overviewEmpty.hidden = true;

  overviewTbody.innerHTML = "";
  for (const item of items) {
    const tr = document.createElement("tr");
    const statusLabel = t("status" + item.status.charAt(0).toUpperCase() + item.status.slice(1));
    const statusInfo = item.status === "error" ? "" : (item.pass_count !== null ? ` (${item.pass_count}/${item.total_count})` : "");
    const statusTitle = item.error ? ` title="${esc(item.error)}"` : "";
    const hasEval = !!item.last_evaluated;
    tr.innerHTML = `
      <td class="td-aas-id" title="${esc(item.aas_id)}">${esc(item.aas_id)}</td>
      <td class="td-source">${esc(item.source_name)}</td>
      <td><span class="status-badge status-${item.status}"${statusTitle}>${esc(statusLabel)}${statusInfo}</span></td>
      <td class="td-eval-date">
        ${hasEval ? `<span class="eval-date-wrap">${item.last_evaluated.replace("T", " ").slice(0, 16)}
          <button class="btn-sm-icon view-eval-btn" title="${t("viewEval")}" data-aas="${esc(item.aas_id)}" data-source="${esc(item.source_id)}">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button></span>` : "—"}
      </td>
      <td class="td-actions">
        <button class="btn btn-sm btn-accent eval-btn" data-source="${esc(item.source_id)}" data-aas="${esc(item.aas_id)}">${t("evaluate")}</button>
      </td>
    `;
    overviewTbody.appendChild(tr);
  }
}

overviewTbody.addEventListener("click", (e) => {
  const evalBtn = e.target.closest(".eval-btn");
  if (evalBtn) {
    evaluateAas(evalBtn.dataset.source, evalBtn.dataset.aas);
    return;
  }
  const viewBtn = e.target.closest(".view-eval-btn");
  if (viewBtn) {
    viewCachedEval(viewBtn.dataset.source, viewBtn.dataset.aas);
    return;
  }
});

evaluateAllBtn.addEventListener("click", async () => {
  const res = await api("/api/overview");
  if (!res.ok) return;
  const items = res.payload.items || [];
  for (const item of items) {
    await evaluateAas(item.source_id, item.aas_id);
  }
});

// ---------------------------------------------------------------------------
// SOURCES
// ---------------------------------------------------------------------------
async function loadSources() {
  const res = await api("/api/sources");
  if (!res.ok) return;
  const sources = res.payload.sources || [];

  if (!sources.length) {
    sourcesList.innerHTML = "";
    sourcesList.hidden = true;
    sourcesEmpty.hidden = false;
    return;
  }
  sourcesList.hidden = false;
  sourcesEmpty.hidden = true;

  sourcesList.innerHTML = "";
  for (const s of sources) {
    const card = document.createElement("div");
    card.className = "source-card";
    card.innerHTML = `
      <div class="card-header">
        <div class="card-icon">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
          </svg>
        </div>
        <div class="card-info">
          <div class="card-name">${esc(s.name)}</div>
          <div class="card-meta">${esc(s.base_url)}</div>
        </div>
        <span class="card-badge">${s.aas_count} AAS</span>
        <div class="card-actions">
          <button class="btn-sm-icon" title="AAS IDs" data-action="aas-ids" data-id="${s.source_id}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </button>
          <button class="btn-sm-icon" title="${t("editSource")}" data-action="edit-source" data-id="${s.source_id}" data-name="${esc(s.name)}" data-url="${esc(s.base_url)}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-sm-icon danger" title="${t("delete")}" data-action="delete-source" data-id="${s.source_id}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
    sourcesList.appendChild(card);
  }
}

sourcesList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === "edit-source") {
    editingSourceId = btn.dataset.id;
    sourceDialogTitle.textContent = t("editSource");
    sourceNameInput.value = btn.dataset.name;
    sourceUrlInput.value = btn.dataset.url;
    sourceDialog.showModal();
  } else if (action === "delete-source") {
    showConfirm(t("delete"), t("confirmDeleteSource"), async () => {
      await api(`/api/sources/${btn.dataset.id}`, { method: "DELETE" });
      loadSources();
    });
  } else if (action === "aas-ids") {
    openAasIdsDialog(btn.dataset.id);
  }
});

addSourceBtn.addEventListener("click", () => {
  editingSourceId = null;
  sourceDialogTitle.textContent = t("addSource");
  sourceNameInput.value = "";
  sourceUrlInput.value = "";
  sourceDialog.showModal();
});

sourceSaveBtn.addEventListener("click", async () => {
  const name = sourceNameInput.value.trim();
  const base_url = sourceUrlInput.value.trim();
  if (!name || !base_url) return;
  if (editingSourceId) {
    await api(`/api/sources/${editingSourceId}`, { method: "PUT", body: { name, base_url } });
  } else {
    await api("/api/sources", { method: "POST", body: { name, base_url } });
  }
  sourceDialog.close();
  loadSources();
});

sourceCancelBtn.addEventListener("click", () => sourceDialog.close());

// ---------------------------------------------------------------------------
// AAS IDs Dialog
// ---------------------------------------------------------------------------
async function openAasIdsDialog(sourceId) {
  currentAasIdsSourceId = sourceId;
  aasIdsTextarea.value = "";
  const res = await api(`/api/sources/${sourceId}/aas`);
  if (!res.ok) return;
  const { source, ids } = res.payload;
  aasIdsDialogTitle.textContent = `AAS IDs — ${source.name}`;
  aasIdsSourceInfo.textContent = source.base_url;
  renderAasIdsChips(ids);
  aasIdsDialog.showModal();
}

function renderAasIdsChips(ids) {
  aasIdsList.innerHTML = "";
  if (!ids.length) {
    aasIdsList.hidden = true;
    aasIdsEmpty.hidden = false;
    return;
  }
  aasIdsList.hidden = false;
  aasIdsEmpty.hidden = true;
  for (const entry of ids) {
    const chip = document.createElement("span");
    chip.className = "aas-chip";
    chip.innerHTML = `
      <span class="aas-chip-id" title="${esc(entry.aas_id)}">${esc(entry.aas_id)}</span>
      <button class="aas-chip-remove" data-entry="${entry.entry_id}" title="${t("delete")}">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    aasIdsList.appendChild(chip);
  }
}

aasIdsList.addEventListener("click", async (e) => {
  const btn = e.target.closest(".aas-chip-remove");
  if (!btn) return;
  await api(`/api/sources/${currentAasIdsSourceId}/aas/${btn.dataset.entry}`, { method: "DELETE" });
  openAasIdsDialog(currentAasIdsSourceId);
  loadSources();
});

aasIdsAddBtn.addEventListener("click", async () => {
  const text = aasIdsTextarea.value.trim();
  if (!text) return;
  const aas_ids = text.split("\n").map(s => s.trim()).filter(Boolean);
  if (!aas_ids.length) return;
  await api(`/api/sources/${currentAasIdsSourceId}/aas`, { method: "POST", body: { aas_ids } });
  aasIdsTextarea.value = "";
  openAasIdsDialog(currentAasIdsSourceId);
  loadSources();
});

aasIdsCloseBtn.addEventListener("click", () => aasIdsDialog.close());

// ---------------------------------------------------------------------------
// USE CASES
// ---------------------------------------------------------------------------
async function loadUseCases() {
  const res = await api("/api/use-cases");
  if (!res.ok) return;
  const cases = res.payload.use_cases || [];

  if (!cases.length) {
    useCasesList.innerHTML = "";
    useCasesList.hidden = true;
    useCasesEmpty.hidden = false;
    return;
  }
  useCasesList.hidden = false;
  useCasesEmpty.hidden = true;

  useCasesList.innerHTML = "";
  for (const uc of cases) {
    const card = document.createElement("div");
    card.className = "use-case-card";
    const smChips = (uc.submodels || []).map(sm =>
      `<span class="sm-chip"><span class="sm-chip-short">${esc(sm.id_short || "?")}</span><span class="sm-chip-sem" title="${esc(sm.semantic_id)}">${esc(sm.semantic_id)}</span></span>`
    ).join("");
    card.innerHTML = `
      <div class="card-header">
        <div class="card-icon">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </div>
        <div class="card-info">
          <div class="card-name">${esc(uc.name)}</div>
          ${uc.description ? `<p class="use-case-desc">${esc(uc.description)}</p>` : ""}
        </div>
        <span class="card-badge">${(uc.submodels || []).length} SM</span>
        <div class="card-actions">
          <button class="btn-sm-icon" title="${t("editUseCase")}" data-action="edit-case" data-id="${uc.case_id}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-sm-icon danger" title="${t("delete")}" data-action="delete-case" data-id="${uc.case_id}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
      ${smChips ? `<div class="submodel-chips">${smChips}</div>` : ""}
    `;
    useCasesList.appendChild(card);
  }
}

// Store loaded use cases for edit
let loadedUseCases = [];
useCasesList.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  if (btn.dataset.action === "edit-case") {
    // Load fresh data
    const res = await api("/api/use-cases");
    if (!res.ok) return;
    loadedUseCases = res.payload.use_cases || [];
    const uc = loadedUseCases.find(c => c.case_id === btn.dataset.id);
    if (!uc) return;
    editingCaseId = uc.case_id;
    useCaseDialogTitle.textContent = t("editUseCase");
    caseNameInput.value = uc.name;
    caseDescInput.value = uc.description;
    renderSubmodelEditRows(uc.submodels || []);
    useCaseDialog.showModal();
  } else if (btn.dataset.action === "delete-case") {
    showConfirm(t("delete"), t("confirmDeleteCase"), async () => {
      await api(`/api/use-cases/${btn.dataset.id}`, { method: "DELETE" });
      loadUseCases();
    });
  }
});

addUseCaseBtn.addEventListener("click", () => {
  editingCaseId = null;
  useCaseDialogTitle.textContent = t("addUseCase");
  caseNameInput.value = "";
  caseDescInput.value = "";
  renderSubmodelEditRows([]);
  useCaseDialog.showModal();
});

function renderSubmodelEditRows(submodels) {
  caseSubmodelsList.innerHTML = "";
  for (const sm of submodels) {
    addSubmodelRow(sm.semantic_id, sm.id_short);
  }
}

function addSubmodelRow(semanticId = "", idShort = "") {
  const row = document.createElement("div");
  row.className = "submodel-edit-row";
  row.innerHTML = `
    <input type="text" class="sm-sem-input" placeholder="${t("semanticId")}" value="${esc(semanticId)}" />
    <input type="text" class="sm-short-input" placeholder="${t("idShort")}" value="${esc(idShort)}" />
    <button class="submodel-remove-btn" type="button" title="${t("delete")}">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;
  row.querySelector(".submodel-remove-btn").addEventListener("click", () => row.remove());
  caseSubmodelsList.appendChild(row);
}

caseAddSubmodelBtn.addEventListener("click", () => addSubmodelRow());

caseSaveBtn.addEventListener("click", async () => {
  const name = caseNameInput.value.trim();
  if (!name) return;
  const description = caseDescInput.value.trim();
  const rows = caseSubmodelsList.querySelectorAll(".submodel-edit-row");
  const submodels = [];
  rows.forEach(row => {
    const semantic_id = row.querySelector(".sm-sem-input").value.trim();
    const id_short = row.querySelector(".sm-short-input").value.trim();
    if (semantic_id) submodels.push({ semantic_id, id_short });
  });
  if (editingCaseId) {
    await api(`/api/use-cases/${editingCaseId}`, { method: "PUT", body: { name, description, submodels } });
  } else {
    await api("/api/use-cases", { method: "POST", body: { name, description, submodels } });
  }
  useCaseDialog.close();
  loadUseCases();
});

caseCancelBtn.addEventListener("click", () => useCaseDialog.close());

// ---------------------------------------------------------------------------
// EVALUATION
// ---------------------------------------------------------------------------
async function evaluateAas(sourceId, aasId) {
  // Reset steps
  [evalStep1, evalStep2, evalStep3].forEach(s => s.className = "eval-step");
  evalResults.hidden = true;
  evalResultsList.innerHTML = "";
  evalAasId.textContent = aasId;
  evalStep1Label.textContent = t("evalStep1");
  evalStep2Label.textContent = t("evalStep2") + "...";
  evalStep3Label.textContent = t("evalStep3");
  evalCloseBtn.textContent = t("close");

  evalDialog.showModal();

  // Step 1: active
  evalStep1.classList.add("active");

  const res = await api(`/api/evaluate/${encodeURIComponent(sourceId)}/${encodeURIComponent(aasId)}`, { method: "POST" });

  if (!res.ok) {
    evalStep1.classList.remove("active");
    evalStep1.classList.add("error");
    evalStep1Label.textContent = t("evalError") + (res.payload?.error ? ` (${res.payload.error})` : "");
    if (activePage === "overview") loadOverview();
    return;
  }

  const data = res.payload;

  // Shell unreachable but saved as error evaluation
  if (data.status === "error" || data.error) {
    evalStep1.classList.remove("active");
    evalStep1.classList.add("error");
    evalStep1Label.textContent = t("statusError") + ` (${data.error})`;
    if (activePage === "overview") loadOverview();
    return;
  }

  // Animate step 1 done
  evalStep1.classList.remove("active");
  evalStep1.classList.add("done");

  // Animate step 2
  await sleep(300);
  evalStep2.classList.add("active");
  evalStep2Label.textContent = `${t("evalStep2")} (${data.submodel_count})...`;
  await sleep(400);
  evalStep2.classList.remove("active");
  evalStep2.classList.add("done");
  evalStep2Label.textContent = `${t("evalStep2")} (${data.submodel_count})`;

  // Animate step 3
  await sleep(300);
  evalStep3.classList.add("active");
  await sleep(500);
  evalStep3.classList.remove("active");
  evalStep3.classList.add("done");

  // Show results
  await sleep(200);
  renderEvalResults(data);
  evalResults.hidden = false;

  // Refresh overview if on that page
  if (activePage === "overview") loadOverview();
}

async function viewCachedEval(sourceId, aasId) {
  // Reset dialog to show results directly (no animation steps)
  [evalStep1, evalStep2, evalStep3].forEach(s => s.className = "eval-step done");
  evalAasId.textContent = aasId;
  evalStep1Label.textContent = t("evalStep1").replace("...", "");
  evalStep2Label.textContent = t("evalStep2");
  evalStep3Label.textContent = t("evalStep3").replace("...", "");
  evalCloseBtn.textContent = t("close");
  evalResults.hidden = true;
  evalResultsList.innerHTML = "";

  evalDialog.showModal();

  const res = await api(`/api/evaluation/${encodeURIComponent(sourceId)}/${encodeURIComponent(aasId)}`);
  if (!res.ok) {
    evalResultsList.innerHTML = `<div class="eval-no-cases">${t("evalError")}</div>`;
    evalResults.hidden = false;
    return;
  }

  renderEvalResults(res.payload);
  evalResults.hidden = false;
}

function renderEvalResults(data) {
  evalResultsList.innerHTML = "";

  // AAS Meta info
  const meta = data.aas_meta;
  if (meta && (meta.idShort || meta.id || meta.assetId)) {
    const rows = [];
    if (meta.idShort) rows.push(`<div class="meta-row"><span class="meta-label">${t("aasIdShort")}</span><span class="meta-value">${esc(meta.idShort)}</span></div>`);
    if (meta.id) rows.push(`<div class="meta-row"><span class="meta-label">ID</span><span class="meta-value mono">${esc(meta.id)}</span></div>`);
    if (meta.assetId) rows.push(`<div class="meta-row"><span class="meta-label">${t("assetId")}</span><span class="meta-value mono">${esc(meta.assetId)}</span></div>`);
    if (meta.description) rows.push(`<div class="meta-row"><span class="meta-label">${t("aasDescription")}</span><span class="meta-value">${esc(meta.description)}</span></div>`);
    evalResultsList.insertAdjacentHTML("beforeend", `
      <div class="eval-meta-section">
        <h5>${t("aasMeta")}</h5>
        <div class="eval-meta-grid">${rows.join("")}</div>
      </div>
    `);
  }

  // Submodel details table
  const smDetails = data.submodel_details;
  if (smDetails && smDetails.length) {
    const smRows = smDetails.map(sm => `
      <tr>
        <td>${esc(sm.idShort || "—")}</td>
        <td class="mono sm-sem-cell" title="${esc(sm.semanticId)}">${esc(sm.semanticId || "—")}</td>
      </tr>
    `).join("");
    evalResultsList.insertAdjacentHTML("beforeend", `
      <div class="eval-sm-section">
        <h5>${t("submodelDetails")} (${smDetails.length})</h5>
        <div class="eval-sm-table-wrap">
          <table class="eval-sm-table">
            <thead><tr><th>idShort</th><th>Semantic ID</th></tr></thead>
            <tbody>${smRows}</tbody>
          </table>
        </div>
      </div>
    `);
  }

  // Use case results
  const results = data.results || [];
  if (!results.length) {
    evalResultsList.insertAdjacentHTML("beforeend", `<div class="eval-no-cases">${t("evalNoUseCases")}</div>`);
    return;
  }

  evalResultsList.insertAdjacentHTML("beforeend", `<h5 class="eval-uc-heading">${t("evalResults")}</h5>`);

  for (const r of results) {
    const card = document.createElement("div");
    card.className = `eval-result-card ${r.passed ? "pass" : "fail"}`;
    const detailsHtml = r.details.map(d => `
      <div class="eval-sm-row">
        <span class="eval-sm-icon ${d.found ? "found" : "missing"}">
          ${d.found
            ? '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>'
            : '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>'}
        </span>
        <span class="eval-sm-short">${esc(d.id_short || "?")}</span>
        <span class="eval-sm-sem" title="${esc(d.semantic_id)}">${esc(d.semantic_id)}</span>
      </div>
    `).join("");
    card.innerHTML = `
      <div class="eval-result-header">
        <span class="eval-result-name">${esc(r.name)}</span>
        <span class="eval-badge ${r.passed ? "badge-pass" : "badge-fail"}">
          ${r.passed ? t("evalPassed") : t("evalFailed")}
        </span>
      </div>
      <div class="eval-result-details">${detailsHtml}</div>
    `;
    evalResultsList.appendChild(card);
  }
}

evalCloseBtn.addEventListener("click", () => evalDialog.close());

// ---------------------------------------------------------------------------
// CONFIRM DIALOG
// ---------------------------------------------------------------------------
function showConfirm(title, message, onConfirm) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  pendingConfirmAction = onConfirm;
  confirmDialog.showModal();
}

confirmOkBtn.addEventListener("click", async () => {
  confirmDialog.close();
  if (pendingConfirmAction) {
    await pendingConfirmAction();
    pendingConfirmAction = null;
  }
});
confirmCancelBtn.addEventListener("click", () => {
  confirmDialog.close();
  pendingConfirmAction = null;
});

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
async function init() {
  const userRes = await fetch("/api/me").then(r => r.json()).catch(() => null);
  if (userRes) {
    currentUser = userRes;
    const name = currentUser.name || "";
    const parts = name.trim().split(/\s+/);
    userInitials.textContent = parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase() || "?";
    userInfo.textContent = name || currentUser.email || "";
  }
  setLocale(locale);
  navigateTo("overview");
}

init();
