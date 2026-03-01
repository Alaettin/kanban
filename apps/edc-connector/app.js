/* ── EDC Connector – Frontend ─────────────────────────────── */
const APP_BASE = "/apps/edc-connector";

const I18N = {
  de: {
    brandText: "EDC Connector",
    provider: "Provider",
    consumer: "Consumer",
    assets: "Assets",
    policies: "Policies",
    contractDefs: "Contract Defs",
    settings: "Settings",
    catalog: "Catalog",
    negotiations: "Negotiations",
    transfers: "Transfers",
    createAsset: "Asset erstellen",
    createPolicy: "Policy erstellen",
    createContractDef: "Contract Def erstellen",
    queryCatalog: "Katalog abfragen",
    startNegotiation: "Verhandlung starten",
    startTransfer: "Transfer starten",
    testConnection: "Verbindung testen",
    connected: "Verbunden",
    notConnected: "Nicht verbunden",
    connError: "Verbindung fehlgeschlagen",
    commLog: "Kommunikationsprotokoll",
    commLogPlaceholder: "EDC-Kommunikation wird hier protokolliert",
    all: "Alle",
    cancel: "Abbrechen",
    create: "Erstellen",
    start: "Starten",
    save: "Speichern",
    refresh: "Aktualisieren",
    toastError: "Fehler aufgetreten",
    providerSettings: "Provider Settings",
    consumerSettings: "Consumer Settings",
    managementUrl: "Management API URL",
    protocolUrl: "Protocol URL",
    apiKey: "API Key",
    negotiate: "Verhandeln",
    fetchData: "Daten abrufen",
    edrEndpoint: "EDR Endpoint",
    counterPartyAddr: "Counter Party Address (Provider Protocol URL)",
    offerIdLabel: "Offer ID (aus Catalog)",
    assetIdLabel: "Asset ID",
    providerIdLabel: "Provider ID",
    agreementIdLabel: "Contract Agreement ID",
    noResults: "Keine Ergebnisse",
    logout: "Logout",
    containerRunning: "Aktiv",
    containerStopped: "Gestoppt",
    containerNotFound: "Nicht gefunden",
    startEdc: "Start",
    stopEdc: "Stop",
    restartEdc: "Restart",
    edcStarting: "EDC wird gestartet\u2026",
    edcStopping: "EDC wird gestoppt\u2026",
    edcStarted: "EDC Container gestartet",
    edcStopped: "EDC Container gestoppt",
    edcRestarted: "EDC Container neugestartet",
    landingTitle: "EDC Connector",
    landingSub: "Modus ausw\u00e4hlen",
    modeNotAvailable: "Dieser Modus ist noch nicht verf\u00fcgbar",
    loadExample: "Beispiel laden",
    edcBasics: "EDC Grundlagen",
    apiReference: "API-Referenz",
    quickStart: "Quick-Start",
    copySuccess: "In Zwischenablage kopiert",
    jsonDetails: "Details",
    phaseDocker: "Docker starten",
    phaseAsset: "Asset erstellen",
    phasePolicy: "Policy erstellen",
    phaseContractDef: "Contract Definition",
    phaseCatalog: "Katalog abfragen",
    phaseNegotiation: "Verhandlung",
    phaseTransfer: "Transfer + Daten",
    phaseDockerDesc: "EDC-Infrastruktur hochfahren",
    phaseAssetDesc: "Provider registriert Datenquelle als Asset",
    phasePolicyDesc: "Provider legt Zugriffsregeln fest",
    phaseContractDefDesc: "Provider verkn\u00fcpft Asset + Policy",
    phaseCatalogDesc: "Consumer fragt Katalog ab",
    phaseNegotiationDesc: "Consumer verhandelt Vertrag",
    phaseTransferDesc: "Consumer startet Transfer und ruft Daten ab",
    debugLog: "Debug-Log",
  },
  en: {
    brandText: "EDC Connector",
    provider: "Provider",
    consumer: "Consumer",
    assets: "Assets",
    policies: "Policies",
    contractDefs: "Contract Defs",
    settings: "Settings",
    catalog: "Catalog",
    negotiations: "Negotiations",
    transfers: "Transfers",
    createAsset: "Create Asset",
    createPolicy: "Create Policy",
    createContractDef: "Create Contract Def",
    queryCatalog: "Query Catalog",
    startNegotiation: "Start Negotiation",
    startTransfer: "Start Transfer",
    testConnection: "Test Connection",
    connected: "Connected",
    notConnected: "Not connected",
    connError: "Connection failed",
    commLog: "Communication Log",
    commLogPlaceholder: "EDC communication will be logged here",
    all: "All",
    cancel: "Cancel",
    create: "Create",
    start: "Start",
    save: "Save",
    refresh: "Refresh",
    toastError: "Error occurred",
    providerSettings: "Provider Settings",
    consumerSettings: "Consumer Settings",
    managementUrl: "Management API URL",
    protocolUrl: "Protocol URL",
    apiKey: "API Key",
    negotiate: "Negotiate",
    fetchData: "Fetch Data",
    edrEndpoint: "EDR Endpoint",
    counterPartyAddr: "Counter Party Address (Provider Protocol URL)",
    offerIdLabel: "Offer ID (from catalog)",
    assetIdLabel: "Asset ID",
    providerIdLabel: "Provider ID",
    agreementIdLabel: "Contract Agreement ID",
    noResults: "No results",
    logout: "Logout",
    containerRunning: "Running",
    containerStopped: "Stopped",
    containerNotFound: "Not found",
    startEdc: "Start",
    stopEdc: "Stop",
    restartEdc: "Restart",
    edcStarting: "Starting EDC\u2026",
    edcStopping: "Stopping EDC\u2026",
    edcStarted: "EDC containers started",
    edcStopped: "EDC containers stopped",
    edcRestarted: "EDC containers restarted",
    landingTitle: "EDC Connector",
    landingSub: "Select mode",
    modeNotAvailable: "This mode is not yet available",
    loadExample: "Load example",
    edcBasics: "EDC Basics",
    apiReference: "API Reference",
    quickStart: "Quick-Start",
    copySuccess: "Copied to clipboard",
    jsonDetails: "Details",
    phaseDocker: "Start Docker",
    phaseAsset: "Create Asset",
    phasePolicy: "Create Policy",
    phaseContractDef: "Contract Definition",
    phaseCatalog: "Query Catalog",
    phaseNegotiation: "Negotiation",
    phaseTransfer: "Transfer + Data",
    phaseDockerDesc: "Spin up EDC infrastructure",
    phaseAssetDesc: "Provider registers data source as asset",
    phasePolicyDesc: "Provider defines access rules",
    phaseContractDefDesc: "Provider links asset + policy",
    phaseCatalogDesc: "Consumer queries catalog",
    phaseNegotiationDesc: "Consumer negotiates contract",
    phaseTransferDesc: "Consumer starts transfer and fetches data",
    debugLog: "Debug Log",
  },
};

let locale = localStorage.getItem("kanban-locale") || "de";
function t(k) { return I18N[locale]?.[k] || I18N.de[k] || k; }

// ── State ──────────────────────────────────────────────────
let currentUser = null;
let edcStatus = {};
let edcConfig = {};
let commLogFilter = "all";
let commLogExpanded = false;
let commLogEntries = [];
let pollingTimers = [];
let statusPollTimer = null;
let showDebugEntries = false;
let completedPhases = new Set();
let activePhase = null;
let phaseHasError = new Map();

// ── DOM Refs ───────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const brandText = $("brand-text");
const userMenuToggle = $("user-menu-toggle");
const userMenu = $("user-menu");
const userInitials = $("user-initials");
const userInfo = $("user-info");
const logoutBtn = $("logout-btn");
const localeDeBtn = $("locale-de-btn");
const localeEnBtn = $("locale-en-btn");
const toastEl = $("edc-toast");

const commLog = $("comm-log");
const commLogBody = $("comm-log-body");
const commLogCount = $("comm-log-count");
const commLogToggle = $("comm-log-toggle");
const commLogClearBtn = $("comm-log-clear-btn");
const commLogHeader = $("comm-log-header");

// ── API Helper ─────────────────────────────────────────────
async function api(path, opts = {}) {
  const { method = "GET", body } = opts;
  try {
    const resp = await fetch(`${APP_BASE}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (resp.status === 401) { window.location.href = "/"; return { ok: false }; }
    const payload = resp.headers.get("content-type")?.includes("json") ? await resp.json() : null;
    return { ok: resp.ok, status: resp.status, payload };
  } catch (err) {
    return { ok: false, status: 0, error: err.message };
  }
}

// ── EDC Proxy ──────────────────────────────────────────────
async function edcProxy(side, method, path, body) {
  const result = await api("/api/proxy", {
    method: "POST",
    body: { side, method, path, body },
  });
  if (result.ok && result.payload) {
    refreshCommLog();
    return result.payload;
  }
  return { status: 0, body: null, error: result.error || "Proxy call failed" };
}

// ── Toast ──────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2500);
}

// ── Locale ─────────────────────────────────────────────────
function setLocale(lang) {
  locale = lang;
  localStorage.setItem("kanban-locale", lang);
  localeDeBtn.classList.toggle("active", lang === "de");
  localeEnBtn.classList.toggle("active", lang === "en");
  localeDeBtn.setAttribute("aria-checked", String(lang === "de"));
  localeEnBtn.setAttribute("aria-checked", String(lang === "en"));
  applyLocaleToUI();
}

function applyLocaleToUI() {
  brandText.textContent = t("brandText");
  $("p-assets-add-label").textContent = t("createAsset");
  $("p-policies-add-label").textContent = t("createPolicy");
  $("p-contractdefs-add-label").textContent = t("createContractDef");
  $("c-catalog-query-label").textContent = t("queryCatalog");
  $("c-negotiate-add-label").textContent = t("startNegotiation");
  $("c-transfer-add-label").textContent = t("startTransfer");
  $("provider-test-label").textContent = t("testConnection");
  $("consumer-test-label").textContent = t("testConnection");
  $("p-settings-title").textContent = t("providerSettings");
  $("c-settings-title").textContent = t("consumerSettings");
  $("lbl-p-url").textContent = t("managementUrl");
  $("lbl-p-protocol").textContent = t("protocolUrl");
  $("lbl-p-key").textContent = t("apiKey");
  $("lbl-c-url").textContent = t("managementUrl");
  $("lbl-c-protocol").textContent = t("protocolUrl");
  $("lbl-c-key").textContent = t("apiKey");
  $("comm-log-title").textContent = t("commLog");
  $("comm-log-placeholder-text").textContent = t("commLogPlaceholder");
  $("lbl-counter-party").textContent = t("counterPartyAddr");
  $("edc-start-label").textContent = t("startEdc");
  $("edc-stop-label").textContent = t("stopEdc");
  $("edc-restart-label").textContent = t("restartEdc");
  logoutBtn.textContent = t("logout");
  // Landing
  $("landing-title").textContent = t("landingTitle");
  $("landing-sub").textContent = t("landingSub");
  $("info-grundlagen-text").textContent = t("edcBasics");
  $("info-api-text").textContent = t("apiReference");
  $("info-quickstart-text").textContent = t("quickStart");
  // Example load buttons
  document.querySelectorAll(".example-load-btn").forEach(b => { b.textContent = t("loadExample"); });
}

function esc(str) { const d = document.createElement("div"); d.textContent = str || ""; return d.innerHTML; }

// ── EDC Status (Docker Containers) ─────────────────────────
async function refreshEdcStatus() {
  const res = await api("/api/edc/status");
  if (res.ok && res.payload) {
    edcStatus = res.payload.status || {};
    edcConfig = res.payload.config || {};
    renderStatusBar();
    // Show participant IDs in panel headers
    const pId = edcConfig.provider?.participantId;
    const cId = edcConfig.consumer?.participantId;
    $("provider-participant-id").textContent = pId ? `(${pId})` : "";
    $("consumer-participant-id").textContent = cId ? `(${cId})` : "";
    // Pre-fill settings (read-only)
    $("f-provider-url").value = edcConfig.provider?.managementUrl || "";
    $("f-provider-protocol").value = edcConfig.provider?.protocolUrl || "";
    $("f-provider-key").value = edcConfig.provider?.apiKey || "";
    $("f-consumer-url").value = edcConfig.consumer?.managementUrl || "";
    $("f-consumer-protocol").value = edcConfig.consumer?.protocolUrl || "";
    $("f-consumer-key").value = edcConfig.consumer?.apiKey || "";
    // Pre-fill catalog address
    if (!$("c-catalog-address").value && edcConfig.provider?.protocolUrl) {
      $("c-catalog-address").value = edcConfig.provider.protocolUrl;
    }
  }
}

function renderStatusBar() {
  const containers = [
    { key: "edc-provider", dotId: "provider-dot", statusId: "provider-status-text" },
    { key: "edc-consumer", dotId: "consumer-dot", statusId: "consumer-status-text" },
  ];
  for (const c of containers) {
    const state = edcStatus[c.key] || "not_found";
    const dot = $(c.dotId);
    const label = $(c.statusId);
    if (state === "running") {
      dot.className = "status-dot dot-running";
      label.textContent = t("containerRunning");
    } else if (state === "not_found") {
      dot.className = "status-dot dot-unknown";
      label.textContent = t("containerNotFound");
    } else {
      dot.className = "status-dot dot-stopped";
      label.textContent = t("containerStopped");
    }
  }
}

function setEdcBtnsDisabled(loading) {
  const btns = [$("edc-start-btn"), $("edc-stop-btn"), $("edc-restart-btn")];
  for (const b of btns) b.disabled = loading;
}
function showBtnSpinner(btn) {
  const svg = btn.querySelector("svg");
  if (svg) { svg.dataset.orig = "1"; svg.style.display = "none"; }
  const sp = document.createElement("span");
  sp.className = "spinner";
  btn.insertBefore(sp, btn.firstChild);
}
function hideBtnSpinner(btn) {
  const sp = btn.querySelector(".spinner");
  if (sp) sp.remove();
  const svg = btn.querySelector("svg");
  if (svg) svg.style.display = "";
}

async function startEdc() {
  setEdcBtnsDisabled(true);
  showBtnSpinner($("edc-start-btn"));
  showToast(t("edcStarting"));
  const res = await api("/api/edc/start", { method: "POST" });
  hideBtnSpinner($("edc-start-btn"));
  setEdcBtnsDisabled(false);
  if (res.ok) {
    showToast(t("edcStarted"));
    await refreshEdcStatus();
    refreshAllData();
  } else {
    showToast(t("toastError") + ": " + (res.payload?.message || ""));
  }
}

async function stopEdc() {
  setEdcBtnsDisabled(true);
  showBtnSpinner($("edc-stop-btn"));
  showToast(t("edcStopping"));
  const res = await api("/api/edc/stop", { method: "POST" });
  hideBtnSpinner($("edc-stop-btn"));
  setEdcBtnsDisabled(false);
  if (res.ok) {
    showToast(t("edcStopped"));
    await refreshEdcStatus();
    refreshAllData();
  } else {
    showToast(t("toastError"));
  }
}

async function restartEdc() {
  setEdcBtnsDisabled(true);
  showBtnSpinner($("edc-restart-btn"));
  showToast(t("edcStarting"));
  const res = await api("/api/edc/restart", { method: "POST" });
  hideBtnSpinner($("edc-restart-btn"));
  setEdcBtnsDisabled(false);
  if (res.ok) {
    showToast(t("edcRestarted"));
    await refreshEdcStatus();
    refreshAllData();
  } else {
    showToast(t("toastError"));
  }
}

function refreshAllData() {
  refreshProviderAssets();
  refreshProviderPolicies();
  refreshProviderContractDefs();
  refreshConsumerNegotiations();
  refreshConsumerTransfers();
  $("c-catalog-results").innerHTML = "";
  refreshCommLog();
}

// ── Test Connection ────────────────────────────────────────
async function testConnection(side) {
  const statusEl = $(side === "provider" ? "provider-test-status" : "consumer-test-status");
  statusEl.textContent = "...";
  statusEl.className = "connection-status";
  const result = await edcProxy(side, "POST", "/v3/assets/request", {
    "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
    "@type": "QuerySpec",
  });
  if (result.status >= 200 && result.status < 300) {
    statusEl.textContent = t("connected") + ` (${result.duration}ms)`;
    statusEl.className = "connection-status ok";
  } else {
    statusEl.textContent = t("connError") + (result.error ? `: ${result.error}` : ` (HTTP ${result.status})`);
    statusEl.className = "connection-status err";
  }
}

// ── Tab Switching ──────────────────────────────────────────
function switchProviderTab(tabId) {
  document.querySelectorAll("#provider-tabs .panel-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tabId));
  document.querySelectorAll("#provider-content .tab-section").forEach(s => s.classList.toggle("active", s.id === tabId));
}

function switchConsumerTab(tabId) {
  document.querySelectorAll("#consumer-tabs .panel-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tabId));
  document.querySelectorAll("#consumer-content .tab-section").forEach(s => s.classList.toggle("active", s.id === tabId));
}

// ── Provider: Assets ───────────────────────────────────────
async function refreshProviderAssets() {
  const result = await edcProxy("provider", "POST", "/v3/assets/request", {
    "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
    "@type": "QuerySpec",
  });
  const list = $("p-assets-list");
  list.innerHTML = "";
  if (result.status >= 200 && result.status < 300 && Array.isArray(result.body)) {
    for (const asset of result.body) {
      list.appendChild(createObjectCard(asset["@id"] || asset.id || "?", "asset", asset, "provider"));
    }
  } else if (result.error) {
    list.innerHTML = `<div class="object-card"><div class="object-card-id" style="color:var(--danger)">${esc(result.error)}</div></div>`;
  }
}

async function createProviderAsset() {
  const id = $("p-asset-id").value.trim();
  const name = $("p-asset-name").value.trim();
  const ct = $("p-asset-contenttype").value.trim();
  const baseUrl = $("p-asset-baseurl").value.trim();
  if (!id || !baseUrl) return;

  const body = {
    "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
    "@id": id,
    properties: { name: name || id, contenttype: ct || "application/json" },
    dataAddress: {
      type: "HttpData",
      baseUrl,
      proxyPath: String($("p-asset-proxypath").checked),
      proxyMethod: String($("p-asset-proxymethod").checked),
      proxyBody: String($("p-asset-proxybody").checked),
      proxyQueryParams: String($("p-asset-proxyquery").checked),
    },
  };

  const result = await edcProxy("provider", "POST", "/v3/assets", body);
  if (result.status >= 200 && result.status < 300) {
    $("p-assets-form").hidden = true;
    clearAssetForm();
    refreshProviderAssets();
  } else {
    const msg = result.error || (result.body && (result.body.message || JSON.stringify(result.body))) || `HTTP ${result.status}`;
    showToast(`Asset-Fehler: ${msg}`, "error");
  }
}

function clearAssetForm() {
  $("p-asset-id").value = "";
  $("p-asset-name").value = "";
  $("p-asset-contenttype").value = "application/json";
  $("p-asset-baseurl").value = "";
  $("p-asset-proxypath").checked = false;
  $("p-asset-proxymethod").checked = false;
  $("p-asset-proxybody").checked = false;
  $("p-asset-proxyquery").checked = false;
}

async function deleteEdcObject(side, type, id) {
  const pathMap = { asset: "/v3/assets/", policy: "/v3/policydefinitions/", contractdef: "/v3/contractdefinitions/" };
  const base = pathMap[type];
  if (!base) return;
  const result = await edcProxy(side, "DELETE", base + encodeURIComponent(id));
  if (result.status >= 200 && result.status < 300) {
    if (type === "asset") refreshProviderAssets();
    else if (type === "policy") refreshProviderPolicies();
    else if (type === "contractdef") refreshProviderContractDefs();
  } else {
    const msg = result.error || (result.body && (result.body.message || JSON.stringify(result.body))) || `HTTP ${result.status}`;
    const hint = type === "asset" ? " (Zuerst Contract Defs löschen, die dieses Asset referenzieren)" :
                 type === "policy" ? " (Zuerst Contract Defs löschen, die diese Policy referenzieren)" : "";
    showToast(`Löschen fehlgeschlagen: ${msg}${hint}`, "error");
  }
}

// ── Provider: Policies ─────────────────────────────────────
async function refreshProviderPolicies() {
  const result = await edcProxy("provider", "POST", "/v3/policydefinitions/request", {
    "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
    "@type": "QuerySpec",
  });
  const list = $("p-policies-list");
  list.innerHTML = "";
  if (result.status >= 200 && result.status < 300 && Array.isArray(result.body)) {
    for (const pol of result.body) {
      list.appendChild(createObjectCard(pol["@id"] || pol.id || "?", "policy", pol, "provider"));
    }
  }
}

async function createProviderPolicy() {
  const id = $("p-policy-id").value.trim();
  if (!id) return;
  const type = $("p-policy-type").value;

  let permission = [];
  if (type === "constrained") {
    const left = $("p-policy-left").value.trim();
    const op = $("p-policy-operator").value;
    const right = $("p-policy-right").value.trim();
    permission = [{ action: "use", constraint: { leftOperand: left, operator: op, rightOperand: right } }];
  }

  const body = {
    "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/", odrl: "http://www.w3.org/ns/odrl/2/" },
    "@id": id,
    policy: {
      "@context": "http://www.w3.org/ns/odrl.jsonld",
      "@type": "Set",
      permission,
      prohibition: [],
      obligation: [],
    },
  };

  const result = await edcProxy("provider", "POST", "/v3/policydefinitions", body);
  if (result.status >= 200 && result.status < 300) {
    $("p-policies-form").hidden = true;
    $("p-policy-id").value = "";
    refreshProviderPolicies();
  } else {
    const msg = result.error || (result.body && (result.body.message || JSON.stringify(result.body))) || `HTTP ${result.status}`;
    showToast(`Policy-Fehler: ${msg}`, "error");
  }
}

// ── Provider: Contract Definitions ─────────────────────────
async function refreshProviderContractDefs() {
  const result = await edcProxy("provider", "POST", "/v3/contractdefinitions/request", {
    "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
    "@type": "QuerySpec",
  });
  const list = $("p-contractdefs-list");
  list.innerHTML = "";
  if (result.status >= 200 && result.status < 300 && Array.isArray(result.body)) {
    for (const cd of result.body) {
      list.appendChild(createObjectCard(cd["@id"] || cd.id || "?", "contractdef", cd, "provider"));
    }
  }
}

async function createProviderContractDef() {
  const id = $("p-cdef-id").value.trim();
  const accessPolicy = $("p-cdef-access-policy").value.trim();
  const contractPolicy = $("p-cdef-contract-policy").value.trim();
  const assetFilter = $("p-cdef-asset-filter").value.trim();
  if (!id || !accessPolicy || !contractPolicy) return;

  const assetsSelector = assetFilter ? [{
    operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
    operator: "=",
    operandRight: assetFilter,
  }] : [];

  const body = {
    "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
    "@id": id,
    accessPolicyId: accessPolicy,
    contractPolicyId: contractPolicy,
    assetsSelector,
  };

  const result = await edcProxy("provider", "POST", "/v3/contractdefinitions", body);
  if (result.status >= 200 && result.status < 300) {
    $("p-contractdefs-form").hidden = true;
    $("p-cdef-id").value = "";
    $("p-cdef-access-policy").value = "";
    $("p-cdef-contract-policy").value = "";
    $("p-cdef-asset-filter").value = "";
    refreshProviderContractDefs();
  } else {
    const msg = result.error || (result.body && (result.body.message || JSON.stringify(result.body))) || `HTTP ${result.status}`;
    showToast(`Contract Def-Fehler: ${msg}`, "error");
  }
}

// ── Consumer: Catalog ──────────────────────────────────────
async function queryCatalog() {
  const address = $("c-catalog-address").value.trim();
  if (!address) return;

  const body = {
    "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
    counterPartyAddress: address,
    protocol: "dataspace-protocol-http",
  };

  const result = await edcProxy("consumer", "POST", "/v3/catalog/request", body);
  const list = $("c-catalog-results");
  list.innerHTML = "";

  if (result.status >= 200 && result.status < 300 && result.body) {
    const datasets = result.body["dcat:dataset"] || result.body.dataset || [];
    const items = Array.isArray(datasets) ? datasets : [datasets];
    if (!items.length) {
      list.innerHTML = `<div style="color:var(--muted);font-size:.72rem;padding:8px">${t("noResults")}</div>`;
      return;
    }
    for (const ds of items) {
      const card = document.createElement("div");
      card.className = "catalog-card";
      const dsId = ds["@id"] || ds.id || "?";
      const dsName = ds.name || ds["edc:name"] || dsId;
      const policy = ds["odrl:hasPolicy"] || ds.hasPolicy || {};
      const offerId = policy["@id"] || policy.id || "";
      const providerId = result.body.participantId || result.body["edc:participantId"]
        || result.body["dspace:participantId"] || edcConfig.provider?.participantId || "";

      card.innerHTML = `
        <div class="catalog-card-header" onclick="this.parentElement.classList.toggle('open')">
          <svg class="catalog-card-chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          <span class="catalog-card-name">${esc(dsName)}</span>
          <span class="catalog-card-id">${esc(dsId)}</span>
        </div>
        <div class="catalog-card-body">
          <div class="catalog-card-detail"><strong>Asset ID:</strong> ${esc(dsId)}</div>
          <div class="catalog-card-detail"><strong>Offer ID:</strong> <span style="font-family:var(--mono);font-size:.62rem;word-break:break-all">${esc(offerId)}</span></div>
          <div class="catalog-card-detail"><strong>Provider:</strong> ${esc(providerId)}</div>
          <div class="object-card-json" style="display:block">${syntaxHighlight(JSON.stringify(policy, null, 2))}</div>
          <div class="catalog-card-actions">
            <button class="btn btn-sm btn-accent-consumer negotiate-btn">${t("negotiate")}</button>
          </div>
        </div>`;

      card.querySelector(".negotiate-btn").onclick = () => {
        switchConsumerTab("c-negotiations");
        $("c-negotiate-form").hidden = false;
        $("c-neg-address").value = address;
        $("c-neg-offer-id").value = offerId;
        $("c-neg-asset-id").value = dsId;
        $("c-neg-provider-id").value = providerId;
      };

      list.appendChild(card);
    }
  } else {
    list.innerHTML = `<div class="object-card"><div class="object-card-id" style="color:var(--danger)">${esc(result.error || "HTTP " + result.status)}</div></div>`;
  }
}

// ── Consumer: Negotiations ─────────────────────────────────
async function refreshConsumerNegotiations() {
  const result = await edcProxy("consumer", "POST", "/v3/contractnegotiations/request", {
    "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
    "@type": "QuerySpec",
  });
  const list = $("c-negotiations-list");
  list.innerHTML = "";
  if (result.status >= 200 && result.status < 300 && Array.isArray(result.body)) {
    for (const neg of result.body) {
      const id = neg["@id"] || neg.id || "?";
      const state = (neg.state || neg["edc:state"] || "").toUpperCase();
      const agreementId = neg.contractAgreementId || neg["edc:contractAgreementId"] || "";

      const card = document.createElement("div");
      card.className = "object-card";
      card.innerHTML = `
        <div class="object-card-header">
          <div>
            <div class="object-card-id">${esc(id)}</div>
            <div class="object-card-body">${agreementId ? `Agreement: <span style="font-family:var(--mono)">${esc(agreementId)}</span>` : ""}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <span class="status-badge status-${state.toLowerCase()}">${esc(state)}</span>
            ${state === "FINALIZED" && agreementId ? `<button class="btn btn-sm btn-accent-consumer transfer-btn">${t("startTransfer")}</button>` : ""}
          </div>
        </div>`;

      const transferBtn = card.querySelector(".transfer-btn");
      if (transferBtn) {
        transferBtn.onclick = () => {
          switchConsumerTab("c-transfers");
          $("c-transfer-form").hidden = false;
          $("c-tf-address").value = neg.counterPartyAddress || neg["edc:counterPartyAddress"] || "";
          $("c-tf-agreement-id").value = agreementId;
          $("c-tf-asset-id").value = neg.assetId || "";
        };
      }

      list.appendChild(card);
    }
  }
}

async function startNegotiation() {
  const address = $("c-neg-address").value.trim();
  const offerId = $("c-neg-offer-id").value.trim();
  const assetId = $("c-neg-asset-id").value.trim();
  const providerId = $("c-neg-provider-id").value.trim();
  if (!address || !offerId || !assetId) return;

  const body = {
    "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
    "@type": "ContractRequest",
    counterPartyAddress: address,
    protocol: "dataspace-protocol-http",
    policy: {
      "@context": "http://www.w3.org/ns/odrl.jsonld",
      "@id": offerId,
      "@type": "Offer",
      assigner: providerId,
      target: assetId,
    },
  };

  const result = await edcProxy("consumer", "POST", "/v3/contractnegotiations", body);
  if (result.status >= 200 && result.status < 300) {
    $("c-negotiate-form").hidden = true;
    const negId = result.body?.["@id"] || result.body?.id;
    if (negId) startPollingNegotiation(negId);
    setTimeout(() => refreshConsumerNegotiations(), 1000);
  }
}

function startPollingNegotiation(negId) {
  const timer = setInterval(async () => {
    const result = await edcProxy("consumer", "GET", `/v3/contractnegotiations/${encodeURIComponent(negId)}`);
    if (result.status >= 200 && result.status < 300) {
      const state = (result.body?.state || result.body?.["edc:state"] || "").toUpperCase();
      refreshConsumerNegotiations();
      if (state === "FINALIZED" || state === "TERMINATED" || state === "ERROR") {
        clearInterval(timer);
        pollingTimers = pollingTimers.filter(t => t !== timer);
      }
    }
  }, 3000);
  pollingTimers.push(timer);
}

// ── Consumer: Transfers ────────────────────────────────────
async function refreshConsumerTransfers() {
  const result = await edcProxy("consumer", "POST", "/v3/transferprocesses/request", {
    "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
    "@type": "QuerySpec",
  });
  const list = $("c-transfers-list");
  list.innerHTML = "";
  if (result.status >= 200 && result.status < 300 && Array.isArray(result.body)) {
    for (const tf of result.body) {
      const id = tf["@id"] || tf.id || "?";
      const state = (tf.state || tf["edc:state"] || "").toUpperCase();

      const card = document.createElement("div");
      card.className = "object-card";
      const canFetch = state === "STARTED" || state === "COMPLETED";
      const errorReason = tf.errorDetail || tf["edc:errorDetail"] || "";
      card.innerHTML = `
        <div class="object-card-header">
          <div>
            <div class="object-card-id">${esc(id)}</div>
            <div class="object-card-body">Asset: ${esc(tf.assetId || tf["edc:assetId"] || "")}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <span class="status-badge status-${state.toLowerCase()}">${esc(state)}</span>
          </div>
        </div>
        ${state === "TERMINATED" ? `<div class="transfer-error-row" id="tf-err-${esc(id)}">${errorReason ? esc(errorReason) : "Fehlergrund wird geladen..."}</div>` : ""}
        ${canFetch ? `<div class="transfer-fetch-row"><button class="btn btn-sm btn-accent-consumer edr-btn"><svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vertical-align:middle;margin-right:4px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>${t("fetchData")}</button></div>` : ""}`;

      const edrBtn = card.querySelector(".edr-btn");
      if (edrBtn) {
        edrBtn.onclick = () => fetchEdr(id);
      }

      // For TERMINATED without error detail: fetch individual transfer for full error
      if (state === "TERMINATED" && !errorReason) {
        edcProxy("consumer", "GET", `/v3/transferprocesses/${encodeURIComponent(id)}`).then(detail => {
          if (detail.status >= 200 && detail.status < 300 && detail.body) {
            const err = detail.body.errorDetail || detail.body["edc:errorDetail"] || "";
            const el = document.getElementById(`tf-err-${id}`);
            if (el) el.textContent = err || "Kein Fehlergrund verfügbar";
          }
        });
      }

      list.appendChild(card);
    }
  }
}

async function startTransfer() {
  const address = $("c-tf-address").value.trim();
  const agreementId = $("c-tf-agreement-id").value.trim();
  const assetId = $("c-tf-asset-id").value.trim();
  if (!address || !agreementId || !assetId) return;

  const body = {
    "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
    "@type": "TransferRequest",
    connectorId: "provider",
    counterPartyAddress: address,
    protocol: "dataspace-protocol-http",
    contractId: agreementId,
    assetId,
    transferType: "HttpData-PULL",
  };

  const result = await edcProxy("consumer", "POST", "/v3/transferprocesses", body);
  if (result.status >= 200 && result.status < 300) {
    $("c-transfer-form").hidden = true;
    const tfId = result.body?.["@id"] || result.body?.id;
    if (tfId) startPollingTransfer(tfId);
    setTimeout(() => refreshConsumerTransfers(), 1000);
  }
}

function startPollingTransfer(tfId) {
  const timer = setInterval(async () => {
    const result = await edcProxy("consumer", "GET", `/v3/transferprocesses/${encodeURIComponent(tfId)}`);
    if (result.status >= 200 && result.status < 300) {
      const state = (result.body?.state || result.body?.["edc:state"] || "").toUpperCase();
      refreshConsumerTransfers();
      if (state === "STARTED" || state === "COMPLETED" || state === "TERMINATED" || state === "ERROR") {
        clearInterval(timer);
        pollingTimers = pollingTimers.filter(t => t !== timer);
      }
    }
  }, 3000);
  pollingTimers.push(timer);
}

async function fetchEdr(transferId) {
  const result = await edcProxy("consumer", "GET", `/v3/edrs/${encodeURIComponent(transferId)}/dataaddress`);
  if (result.status >= 200 && result.status < 300 && result.body) {
    const endpoint = result.body.endpoint || result.body["edc:endpoint"] || "";
    const authToken = result.body.authorization || result.body["edc:authorization"] || "";
    if (!endpoint) {
      showToast("Kein EDR-Endpoint verfügbar", "error");
      return;
    }
    // Fetch actual data via server proxy
    showToast(locale === "de" ? "Daten werden abgerufen…" : "Fetching data…");
    const dataResult = await api("/api/fetch-data", {
      method: "POST",
      body: { endpoint, authorization: authToken },
    });
    refreshCommLog();
    if (dataResult.ok && dataResult.payload) {
      // Show in JSON modal
      const payload = dataResult.payload;
      $("json-modal-title").textContent = locale === "de" ? "Transferierte Daten" : "Transferred Data";
      const statusCode = payload.status;
      let statusHtml = "";
      if (statusCode) {
        let sc = "s2xx";
        if (statusCode >= 300 && statusCode < 500) sc = "s4xx";
        else if (statusCode >= 500) sc = "s5xx";
        statusHtml = `<span class="log-status-badge ${sc}">${statusCode}</span>`;
      }
      $("json-modal-meta").innerHTML = `
        <span style="color:var(--consumer);font-weight:700">Consumer</span>
        ${statusHtml}
        ${payload.duration ? `<span style="color:var(--muted)">${payload.duration}ms</span>` : ""}
        <span style="color:var(--muted);font-family:var(--mono);font-size:.58rem;word-break:break-all">${esc(endpoint)}</span>`;
      let jsonContent = "";
      let rawJson = "";
      try {
        rawJson = JSON.stringify(payload.body, null, 2);
        jsonContent = syntaxHighlight(rawJson);
      } catch {
        rawJson = String(payload.body || payload.error || "");
        jsonContent = esc(rawJson);
      }
      $("json-modal-body").innerHTML = `
        <div class="json-modal-section">
          <div class="json-modal-section-label">${locale === "de" ? "Empfangene Daten" : "Received Data"}</div>
          <pre class="log-json">${jsonContent}</pre>
        </div>`;
      $("json-modal-body").dataset.raw = rawJson;
      $("json-modal-overlay").hidden = false;
    } else {
      showToast("Fehler: " + (dataResult.payload?.error || "Fetch failed"), "error");
    }
  } else {
    showToast("EDR nicht verfügbar: " + (result.error || `HTTP ${result.status}`), "error");
  }
}

function stopAllPolling() {
  for (const t of pollingTimers) clearInterval(t);
  pollingTimers = [];
}

// ── Object Card Helper ─────────────────────────────────────
function createObjectCard(id, type, data, side) {
  const card = document.createElement("div");
  card.className = "object-card";
  card.innerHTML = `
    <div class="object-card-header">
      <div>
        <div class="object-card-id">${esc(id)}</div>
        <div class="object-card-type">${esc(type)}</div>
      </div>
      <div class="object-card-actions">
        <button class="btn-expand" title="JSON"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
        <button class="btn-delete" title="Delete"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
      </div>
    </div>
    <div class="object-card-json">${syntaxHighlight(JSON.stringify(data, null, 2))}</div>`;

  card.querySelector(".btn-expand").onclick = () => card.classList.toggle("expanded");
  card.querySelector(".btn-delete").onclick = () => deleteEdcObject(side, type, id);
  return card;
}

// ── Communication Log ──────────────────────────────────────

/* Maps EDC endpoint + method to a human-readable description and protocol phase (1-7) */
const EDC_ENDPOINT_MAP = [
  // Phase 1 — Docker / Status
  { match: (m, p) => m === "POST" && p === "/v3/assets/request",            desc: () => "Assets abfragen",               descEn: () => "Query assets",                phase: null },
  { match: (m, p) => m === "POST" && p === "/v3/policydefinitions/request",  desc: () => "Policies abfragen",             descEn: () => "Query policies",              phase: null },
  { match: (m, p) => m === "POST" && p === "/v3/contractdefinitions/request",desc: () => "Contract Defs abfragen",        descEn: () => "Query contract defs",         phase: null },

  // Phase 2 — Asset erstellen
  { match: (m, p) => m === "POST" && p === "/v3/assets",                    desc: () => "Asset erstellen",               descEn: () => "Create asset",                phase: 2 },
  { match: (m, p) => m === "DELETE" && p.startsWith("/v3/assets/"),          desc: (m, p) => `Asset löschen (${decId(p, "/v3/assets/")})`, descEn: (m, p) => `Delete asset (${decId(p, "/v3/assets/")})`, phase: null },

  // Phase 3 — Policy erstellen
  { match: (m, p) => m === "POST" && p === "/v3/policydefinitions",          desc: () => "Policy erstellen",              descEn: () => "Create policy",               phase: 3 },
  { match: (m, p) => m === "DELETE" && p.startsWith("/v3/policydefinitions/"), desc: (m, p) => `Policy löschen (${decId(p, "/v3/policydefinitions/")})`, descEn: (m, p) => `Delete policy (${decId(p, "/v3/policydefinitions/")})`, phase: null },

  // Phase 4 — Contract Definition erstellen
  { match: (m, p) => m === "POST" && p === "/v3/contractdefinitions",        desc: () => "Contract Def erstellen",        descEn: () => "Create contract def",         phase: 4 },
  { match: (m, p) => m === "DELETE" && p.startsWith("/v3/contractdefinitions/"), desc: (m, p) => `Contract Def löschen (${decId(p, "/v3/contractdefinitions/")})`, descEn: (m, p) => `Delete contract def (${decId(p, "/v3/contractdefinitions/")})`, phase: null },

  // Phase 5 — Katalog abfragen (Consumer)
  { match: (m, p) => m === "POST" && p === "/v3/catalog/request",            desc: () => "Katalog abfragen",              descEn: () => "Query catalog",               phase: 5 },

  // Phase 6 — Verhandlung
  { match: (m, p) => m === "POST" && p === "/v3/contractnegotiations/request", desc: () => "Verhandlungen abfragen",      descEn: () => "Query negotiations",          phase: null },
  { match: (m, p) => m === "POST" && p === "/v3/contractnegotiations",       desc: () => "Verhandlung starten",           descEn: () => "Start negotiation",           phase: 6 },
  { match: (m, p) => m === "GET" && p.startsWith("/v3/contractnegotiations/"), desc: () => "Verhandlungsstatus prüfen",   descEn: () => "Check negotiation status",    phase: 6 },

  // Phase 7 — Transfer
  { match: (m, p) => m === "POST" && p === "/v3/transferprocesses/request",  desc: () => "Transfers abfragen",            descEn: () => "Query transfers",             phase: null },
  { match: (m, p) => m === "POST" && p === "/v3/transferprocesses",          desc: () => "Transfer starten",              descEn: () => "Start transfer",              phase: 7 },
  { match: (m, p) => m === "GET" && p.startsWith("/v3/transferprocesses/"),  desc: () => "Transferstatus prüfen",         descEn: () => "Check transfer status",       phase: 7 },
  { match: (m, p) => m === "GET" && p.startsWith("/v3/edrs/"),              desc: () => "EDR-Token abrufen",              descEn: () => "Fetch EDR token",             phase: 7 },
  { match: (m, p) => m === "GET" && p.startsWith("EDR"),                    desc: () => "Daten empfangen",                descEn: () => "Receive data",                phase: 7 },
];

function decId(path, prefix) {
  return decodeURIComponent(path.slice(prefix.length).split("/")[0] || "");
}

function getEndpointInfo(method, endpoint) {
  for (const rule of EDC_ENDPOINT_MAP) {
    if (rule.match(method, endpoint)) {
      const isDE = locale === "de";
      return {
        desc: isDE ? rule.desc(method, endpoint) : rule.descEn(method, endpoint),
        phase: rule.phase,
      };
    }
  }
  return { desc: `${method} ${endpoint}`, phase: null };
}

const PHASE_META = [
  { num: 1, key: "phaseDocker",      descKey: "phaseDockerDesc",      side: "both"     },
  { num: 2, key: "phaseAsset",       descKey: "phaseAssetDesc",       side: "provider" },
  { num: 3, key: "phasePolicy",      descKey: "phasePolicyDesc",      side: "provider" },
  { num: 4, key: "phaseContractDef", descKey: "phaseContractDefDesc", side: "provider" },
  { num: 5, key: "phaseCatalog",     descKey: "phaseCatalogDesc",     side: "consumer" },
  { num: 6, key: "phaseNegotiation", descKey: "phaseNegotiationDesc", side: "consumer" },
  { num: 7, key: "phaseTransfer",    descKey: "phaseTransferDesc",    side: "consumer" },
];

function computePhaseProgress(pairs) {
  completedPhases.clear();
  phaseHasError.clear();
  activePhase = null;
  if (edcStatus["edc-provider"] === "running" && edcStatus["edc-consumer"] === "running") {
    completedPhases.add(1);
  }
  for (const pair of pairs) {
    const entry = pair.res || pair.req;
    const info = getEndpointInfo(entry.method, entry.endpoint);
    if (!info.phase) continue;
    const statusCode = pair.res?.status_code;
    const hasErr = pair.res?.error || (statusCode && statusCode >= 400);
    if (hasErr) phaseHasError.set(info.phase, true);
    if (statusCode && statusCode >= 200 && statusCode < 300) completedPhases.add(info.phase);
    if (!pair.res && (!activePhase || info.phase > activePhase)) activePhase = info.phase;
  }
  if (!activePhase) {
    const maxCompleted = Math.max(0, ...completedPhases);
    if (maxCompleted < 7) activePhase = maxCompleted + 1;
  }
}

function renderProgressBar() {
  const container = $("protocol-progress");
  if (!container) return;
  let html = '<div class="progress-steps">';
  for (let i = 0; i < PHASE_META.length; i++) {
    const phase = PHASE_META[i];
    const num = phase.num;
    const isCompleted = completedPhases.has(num);
    const isActive = activePhase === num;
    const hasErr = phaseHasError.get(num);
    let stateClass = "step-pending";
    if (hasErr) stateClass = "step-error";
    else if (isCompleted) stateClass = "step-completed";
    else if (isActive) stateClass = "step-active";
    const sideClass = phase.side === "provider" ? "step-provider" : phase.side === "consumer" ? "step-consumer" : "step-both";
    if (i > 0) {
      const prevDone = completedPhases.has(PHASE_META[i - 1].num);
      html += `<div class="step-connector ${prevDone ? "connector-done" : ""}"></div>`;
    }
    html += `<div class="step-node ${stateClass} ${sideClass}" data-phase="${num}" title="${t(phase.key)}: ${t(phase.descKey)}"><div class="step-circle">${num}</div><div class="step-label">${t(phase.key)}</div></div>`;
  }
  html += "</div>";
  container.innerHTML = html;
  container.querySelectorAll(".step-node").forEach(node => {
    node.addEventListener("click", () => {
      const g = document.querySelector(`.phase-group[data-phase="${node.dataset.phase}"]`);
      if (g) g.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function groupPairsByPhase(pairs) {
  const phaseGroups = new Map();
  const debugEntries = [];
  for (const pair of pairs) {
    const entry = pair.res || pair.req;
    const info = getEndpointInfo(entry.method, entry.endpoint);
    if (info.phase === null) { debugEntries.push(pair); }
    else {
      if (!phaseGroups.has(info.phase)) phaseGroups.set(info.phase, []);
      phaseGroups.get(info.phase).push(pair);
    }
  }
  return { phaseGroups, debugEntries };
}

function extractPreview(pair) {
  if (!pair.res) return "";
  try {
    const body = JSON.parse(pair.res.body_json || "{}");
    if (body["@id"]) return `<span class="preview-label">ID:</span> <code>${esc(body["@id"])}</code>`;
    if (body.state || body["edc:state"]) {
      const st = (body.state || body["edc:state"]).toUpperCase();
      return `<span class="preview-label">State:</span> <span class="preview-state">${esc(st)}</span>`;
    }
    if (body["dcat:dataset"]) {
      const ds = Array.isArray(body["dcat:dataset"]) ? body["dcat:dataset"] : [body["dcat:dataset"]];
      return `<span class="preview-label">Datasets:</span> ${ds.length}`;
    }
    if (Array.isArray(body)) return `<span class="preview-label">Results:</span> ${body.length}`;
  } catch {}
  return "";
}

function extractErrorMsg(pair) {
  if (pair.res?.error) return pair.res.error;
  try {
    const body = JSON.parse(pair.res?.body_json || "{}");
    return body.message || body.detail || "";
  } catch {}
  return "";
}

function renderLogCard(pair, globalIdx) {
  const entry = pair.res || pair.req;
  const el = document.createElement("div");
  const sideLabel = entry.side === "provider" ? "Provider" : "Consumer";
  const sideColor = entry.side === "provider" ? "var(--provider)" : "var(--consumer)";
  const statusCode = pair.res?.status_code;
  const hasErr = pair.res?.error || (statusCode && statusCode >= 400);
  let statusClass = "", statusText = "";
  if (statusCode) {
    if (statusCode < 300) statusClass = "s2xx";
    else if (statusCode < 500) statusClass = "s4xx";
    else statusClass = "s5xx";
    statusText = String(statusCode);
  } else if (pair.res?.error) {
    statusClass = "s0"; statusText = "ERR";
  } else if (!pair.res) {
    statusClass = "s-pending"; statusText = "\u2026";
  }
  const time = entry.created_at ? new Date(entry.created_at + "Z").toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
  const info = getEndpointInfo(entry.method, entry.endpoint);
  const previewInfo = extractPreview(pair);
  el.className = `log-card${hasErr ? " log-card-error" : ""}${!pair.res ? " log-card-pending" : ""}`;
  el.innerHTML = `<div class="log-card-main"><span class="log-card-side-bar" style="background:${sideColor}"></span><div class="log-card-content"><div class="log-card-top"><span class="log-card-desc">${esc(info.desc)}</span><span class="log-card-time">${esc(time)}</span></div>${previewInfo ? `<div class="log-card-preview">${previewInfo}</div>` : ""}<div class="log-card-bottom"><span class="log-card-side" style="color:${sideColor}">${esc(sideLabel)}</span>${statusText ? `<span class="log-status-badge ${statusClass}">${esc(statusText)}</span>` : ""}${pair.res?.duration_ms ? `<span class="log-dur">${pair.res.duration_ms}ms</span>` : ""}${hasErr ? `<span class="log-card-error-hint">${esc(extractErrorMsg(pair))}</span>` : ""}<button class="log-json-btn" data-idx="${globalIdx}">JSON</button></div></div></div>`;
  return el;
}

/* Group raw log entries into paired request+response objects */
function pairLogEntries(entries) {
  const pairs = [];
  const pending = {}; // key → request entry
  for (const e of entries) {
    const key = `${e.side}|${e.method}|${e.endpoint}`;
    if (e.direction === "request") {
      pending[key] = e;
    } else {
      // response — try to match with pending request
      const req = pending[key];
      pairs.push({ req: req || null, res: e });
      delete pending[key];
    }
  }
  // Any unmatched requests (still pending / no response yet)
  for (const key of Object.keys(pending)) {
    pairs.push({ req: pending[key], res: null });
  }
  return pairs;
}

let commLogPairs = [];

async function refreshCommLog() {
  const side = commLogFilter === "all" ? "" : `&side=${commLogFilter}`;
  const res = await api(`/api/log?limit=200${side}`);
  if (!res.ok) return;
  const entries = res.payload?.entries || [];
  commLogEntries = entries;
  const pairs = pairLogEntries(entries);
  commLogPairs = pairs;

  computePhaseProgress(pairs);
  renderProgressBar();

  const { phaseGroups, debugEntries } = groupPairsByPhase(pairs);
  const totalProtocol = pairs.length - debugEntries.length;
  commLogCount.textContent = String(totalProtocol);

  const groupsContainer = $("phase-groups");
  const placeholder = $("comm-log-placeholder");
  if (!groupsContainer) return;

  if (!pairs.length) {
    groupsContainer.innerHTML = "";
    if (placeholder) placeholder.style.display = "";
    return;
  }
  if (placeholder) placeholder.style.display = "none";
  groupsContainer.innerHTML = "";

  for (const phaseMeta of PHASE_META) {
    const phasePairs = phaseGroups.get(phaseMeta.num);
    if (!phasePairs || !phasePairs.length) continue;
    const isDone = completedPhases.has(phaseMeta.num);
    const hasErr = phaseHasError.get(phaseMeta.num);
    const sideColor = phaseMeta.side === "provider" ? "var(--provider)" : phaseMeta.side === "consumer" ? "var(--consumer)" : "var(--text)";

    const group = document.createElement("div");
    group.className = `phase-group ${hasErr ? "phase-error" : isDone ? "phase-done" : "phase-active"}`;
    group.dataset.phase = phaseMeta.num;

    const header = document.createElement("div");
    header.className = "phase-group-header";
    header.innerHTML = `<div class="phase-group-left"><span class="phase-num" style="border-color:${sideColor}">${phaseMeta.num}</span><div class="phase-group-info"><span class="phase-group-name">${t(phaseMeta.key)}</span><span class="phase-group-desc">${t(phaseMeta.descKey)}</span></div></div><div class="phase-group-right"><span class="phase-group-count">${phasePairs.length}</span>${hasErr ? '<span class="phase-badge-error">ERROR</span>' : isDone ? '<span class="phase-badge-done">OK</span>' : '<span class="phase-badge-pending">\u2026</span>'}<svg class="phase-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></div>`;

    const entriesEl = document.createElement("div");
    entriesEl.className = "phase-entries";
    for (const p of phasePairs) {
      entriesEl.appendChild(renderLogCard(p, pairs.indexOf(p)));
    }
    header.addEventListener("click", () => group.classList.toggle("collapsed"));
    group.appendChild(header);
    group.appendChild(entriesEl);
    groupsContainer.appendChild(group);
  }

  if (showDebugEntries && debugEntries.length) {
    const dg = document.createElement("div");
    dg.className = "phase-group phase-debug collapsed";
    const dh = document.createElement("div");
    dh.className = "phase-group-header";
    dh.innerHTML = `<div class="phase-group-left"><span class="phase-num phase-num-debug">?</span><div class="phase-group-info"><span class="phase-group-name">${t("debugLog")}</span><span class="phase-group-desc">Queries, Refreshes, Deletes</span></div></div><div class="phase-group-right"><span class="phase-group-count">${debugEntries.length}</span><svg class="phase-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></div>`;
    const de = document.createElement("div");
    de.className = "phase-entries";
    for (const p of debugEntries) {
      de.appendChild(renderLogCard(p, pairs.indexOf(p)));
    }
    dh.addEventListener("click", () => dg.classList.toggle("collapsed"));
    dg.appendChild(dh);
    dg.appendChild(de);
    groupsContainer.appendChild(dg);
  }

  commLogBody.scrollTop = commLogBody.scrollHeight;
}

async function clearCommLog() {
  await api("/api/log", { method: "DELETE" });
  refreshCommLog();
}

// ── JSON Syntax Highlighting ───────────────────────────────
function syntaxHighlight(json) {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) return `<span class="jk">${match}</span>`;
        return `<span class="js">${match}</span>`;
      }
      if (/true|false/.test(match)) return `<span class="jb">${match}</span>`;
      if (/null/.test(match)) return `<span class="jnull">${match}</span>`;
      return `<span class="jn">${match}</span>`;
    }
  );
}

// ── JSON Modal ──────────────────────────────────────────────
function openJsonModal(idx) {
  const pair = commLogPairs[idx];
  if (!pair) return;
  const entry = pair.res || pair.req;
  const sideLabel = entry.side === "provider" ? "Provider" : "Consumer";
  const sideColor = entry.side === "provider" ? "var(--provider)" : "var(--consumer)";
  const info = getEndpointInfo(entry.method, entry.endpoint);
  const phaseText = info.phase ? ` [${info.phase}/7]` : "";
  $("json-modal-title").textContent = `${info.desc}${phaseText}`;
  const statusCode = pair.res?.status_code;
  let statusHtml = "";
  if (statusCode) {
    let sc = "s2xx";
    if (statusCode >= 300 && statusCode < 500) sc = "s4xx";
    else if (statusCode >= 500) sc = "s5xx";
    statusHtml = `<span class="log-status-badge ${sc}">${statusCode}</span>`;
  } else if (pair.res?.error) {
    statusHtml = `<span class="log-status-badge s0">ERR</span>`;
  }
  $("json-modal-meta").innerHTML = `
    <span style="color:${sideColor};font-weight:700">${esc(sideLabel)}</span>
    ${statusHtml}
    ${pair.res?.duration_ms ? `<span style="color:var(--muted)">${pair.res.duration_ms}ms</span>` : ""}
    <span style="color:var(--muted);font-family:var(--mono);font-size:.62rem">${esc(entry.method)} ${esc(entry.endpoint)}</span>`;

  // Build sections for request and response
  let sections = "";
  let allRaw = {};
  if (pair.req) {
    try {
      const parsed = JSON.parse(pair.req.body_json || "{}");
      allRaw.request = parsed;
      sections += `<div class="json-modal-section"><div class="json-modal-section-label">\u2192 Request</div><pre class="log-json">${syntaxHighlight(JSON.stringify(parsed, null, 2))}</pre></div>`;
    } catch {
      allRaw.request = pair.req.body_json || "";
      sections += `<div class="json-modal-section"><div class="json-modal-section-label">\u2192 Request</div><pre class="log-json">${esc(pair.req.body_json || "")}</pre></div>`;
    }
  }
  if (pair.res) {
    const resSource = pair.res.body_json || pair.res.error || "";
    try {
      const parsed = JSON.parse(resSource);
      allRaw.response = parsed;
      sections += `<div class="json-modal-section"><div class="json-modal-section-label">\u2190 Response</div><pre class="log-json">${syntaxHighlight(JSON.stringify(parsed, null, 2))}</pre></div>`;
    } catch {
      allRaw.response = resSource;
      sections += `<div class="json-modal-section"><div class="json-modal-section-label">\u2190 Response</div><pre class="log-json">${esc(resSource)}</pre></div>`;
    }
  }
  $("json-modal-body").innerHTML = sections;
  $("json-modal-body").dataset.raw = JSON.stringify(allRaw, null, 2);
  $("json-modal-overlay").hidden = false;
}

function closeJsonModal() {
  $("json-modal-overlay").hidden = true;
}

function copyJsonModal() {
  const raw = $("json-modal-body").dataset.raw || "";
  navigator.clipboard.writeText(raw).then(() => showToast(t("copySuccess")));
}

// ── Info Tooltip ────────────────────────────────────────────
let activeTooltip = null;
function showInfoTooltip(icon) {
  closeInfoTooltip();
  const info = icon.dataset.info || "";
  const example = icon.dataset.example || "";
  const tip = document.createElement("div");
  tip.className = "info-tooltip";
  tip.innerHTML = esc(info) + (example ? `<div class="info-example"><div class="info-example-label">Beispiel</div><code>${esc(example)}</code></div>` : "");
  document.body.appendChild(tip);
  const rect = icon.getBoundingClientRect();
  tip.style.left = Math.min(rect.left, window.innerWidth - 320) + "px";
  tip.style.top = (rect.bottom + 6) + "px";
  activeTooltip = tip;
}
function closeInfoTooltip() {
  if (activeTooltip) { activeTooltip.remove(); activeTooltip = null; }
}

// ── Landing Navigation ──────────────────────────────────────
function enterBothMode() {
  $("edc-landing-view").hidden = true;
  $("edc-split-view").hidden = false;
  refreshEdcStatus();
  refreshCommLog();
  commLogExpanded = true;
  commLog.classList.add("expanded");
  if (!statusPollTimer) statusPollTimer = setInterval(refreshEdcStatus, 30000);
}

function backToLanding() {
  $("edc-split-view").hidden = true;
  $("edc-landing-view").hidden = false;
  if (statusPollTimer) { clearInterval(statusPollTimer); statusPollTimer = null; }
  stopAllPolling();
}

// ── Example Loaders ─────────────────────────────────────────
function loadAssetExample() {
  $("p-asset-id").value = "product-data-1";
  $("p-asset-name").value = "Produktdaten API";
  $("p-asset-contenttype").value = "application/json";
  $("p-asset-baseurl").value = "https://jsonplaceholder.typicode.com/todos/1";
  $("p-asset-proxypath").checked = true;
  $("p-asset-proxymethod").checked = true;
  $("p-asset-proxybody").checked = true;
  $("p-asset-proxyquery").checked = true;
}
function loadPolicyExample() {
  $("p-policy-id").value = "open-policy-1";
  $("p-policy-type").value = "open";
  $("p-policy-constraint-fields").hidden = true;
}
function loadContractDefExample() {
  $("p-cdef-id").value = "contract-def-1";
  $("p-cdef-access-policy").value = "open-policy-1";
  $("p-cdef-contract-policy").value = "open-policy-1";
  $("p-cdef-asset-filter").value = "";
}

// ── Event Listeners ────────────────────────────────────────

// User menu
userMenuToggle.addEventListener("click", () => {
  userMenu.hidden = !userMenu.hidden;
  userMenuToggle.setAttribute("aria-expanded", String(!userMenu.hidden));
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
localeDeBtn.addEventListener("click", () => setLocale("de"));
localeEnBtn.addEventListener("click", () => setLocale("en"));

// Docker controls
$("edc-start-btn").addEventListener("click", startEdc);
$("edc-stop-btn").addEventListener("click", stopEdc);
$("edc-restart-btn").addEventListener("click", restartEdc);

// Provider tabs
$("provider-tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".panel-tab");
  if (tab) switchProviderTab(tab.dataset.tab);
});

// Consumer tabs
$("consumer-tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".panel-tab");
  if (tab) switchConsumerTab(tab.dataset.tab);
});

// Provider: Assets
$("p-assets-add-btn").addEventListener("click", () => { $("p-assets-form").hidden = !$("p-assets-form").hidden; });
$("p-assets-cancel-btn").addEventListener("click", () => { $("p-assets-form").hidden = true; });
$("p-assets-create-btn").addEventListener("click", createProviderAsset);
$("p-assets-refresh-btn").addEventListener("click", refreshProviderAssets);

// Provider: Policies
$("p-policies-add-btn").addEventListener("click", () => { $("p-policies-form").hidden = !$("p-policies-form").hidden; });
$("p-policies-cancel-btn").addEventListener("click", () => { $("p-policies-form").hidden = true; });
$("p-policies-create-btn").addEventListener("click", createProviderPolicy);
$("p-policies-refresh-btn").addEventListener("click", refreshProviderPolicies);
$("p-policy-type").addEventListener("change", () => {
  $("p-policy-constraint-fields").hidden = $("p-policy-type").value !== "constrained";
});

// Provider: Contract Defs
$("p-contractdefs-add-btn").addEventListener("click", () => { $("p-contractdefs-form").hidden = !$("p-contractdefs-form").hidden; });
$("p-contractdefs-cancel-btn").addEventListener("click", () => { $("p-contractdefs-form").hidden = true; });
$("p-contractdefs-create-btn").addEventListener("click", createProviderContractDef);
$("p-contractdefs-refresh-btn").addEventListener("click", refreshProviderContractDefs);

// Provider: Settings
$("provider-test-btn").addEventListener("click", () => testConnection("provider"));

// Consumer: Catalog
$("c-catalog-query-btn").addEventListener("click", queryCatalog);

// Consumer: Negotiations
$("c-negotiate-add-btn").addEventListener("click", () => { $("c-negotiate-form").hidden = !$("c-negotiate-form").hidden; });
$("c-negotiate-cancel-btn").addEventListener("click", () => { $("c-negotiate-form").hidden = true; });
$("c-negotiate-start-btn").addEventListener("click", startNegotiation);
$("c-negotiations-refresh-btn").addEventListener("click", refreshConsumerNegotiations);

// Consumer: Transfers
$("c-transfer-add-btn").addEventListener("click", () => { $("c-transfer-form").hidden = !$("c-transfer-form").hidden; });
$("c-transfer-cancel-btn").addEventListener("click", () => { $("c-transfer-form").hidden = true; });
$("c-transfer-start-btn").addEventListener("click", startTransfer);
$("c-transfers-refresh-btn").addEventListener("click", refreshConsumerTransfers);

// Consumer: Settings
$("consumer-test-btn").addEventListener("click", () => testConnection("consumer"));

// Landing Mode Cards
$("mode-both").addEventListener("click", enterBothMode);
$("mode-provider").addEventListener("click", () => showToast(t("modeNotAvailable")));
$("mode-consumer").addEventListener("click", () => showToast(t("modeNotAvailable")));

// Example Load Buttons
$("example-load-assets").addEventListener("click", loadAssetExample);
$("example-load-policies").addEventListener("click", loadPolicyExample);
$("example-load-contractdefs").addEventListener("click", loadContractDefExample);

// Info Tooltips (delegated)
document.addEventListener("click", (e) => {
  const icon = e.target.closest(".info-icon");
  if (icon) { e.preventDefault(); e.stopPropagation(); showInfoTooltip(icon); return; }
  if (activeTooltip && !e.target.closest(".info-tooltip")) closeInfoTooltip();
});

// JSON Modal
$("json-modal-close").addEventListener("click", closeJsonModal);
$("json-modal-close-btn").addEventListener("click", closeJsonModal);
$("json-modal-copy").addEventListener("click", copyJsonModal);
$("json-modal-overlay").addEventListener("click", (e) => { if (e.target === $("json-modal-overlay")) closeJsonModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("json-modal-overlay").hidden) closeJsonModal(); });

// Comm Log Body — JSON button click (delegated)
commLogBody.addEventListener("click", (e) => {
  const btn = e.target.closest(".log-json-btn");
  if (btn) { openJsonModal(Number(btn.dataset.idx)); }
});

// Comm Log
commLogHeader.addEventListener("click", (e) => {
  if (e.target.closest(".comm-log-actions")) return;
  commLogExpanded = !commLogExpanded;
  commLog.classList.toggle("expanded", commLogExpanded);
  if (commLogExpanded && commLog.style.height) commLog.style.height = "";
});
commLogToggle.addEventListener("click", () => {
  commLogExpanded = !commLogExpanded;
  commLog.classList.toggle("expanded", commLogExpanded);
  if (commLogExpanded && commLog.style.height) commLog.style.height = "";
});
commLogClearBtn.addEventListener("click", clearCommLog);
$("comm-log-filter").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  commLogFilter = btn.dataset.filter;
  document.querySelectorAll("#comm-log-filter .filter-btn").forEach(b => b.classList.toggle("active", b === btn));
  refreshCommLog();
});
// Debug toggle
$("comm-log-debug-toggle")?.addEventListener("click", (e) => {
  e.stopPropagation();
  showDebugEntries = !showDebugEntries;
  $("comm-log-debug-toggle").classList.toggle("active", showDebugEntries);
  refreshCommLog();
});

// Comm Log Resize (drag handle)
{
  const handle = $("comm-log-resize-handle");
  let dragging = false, startY = 0, startH = 0;
  handle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    dragging = true;
    startY = e.clientY;
    startH = commLog.offsetHeight;
    commLog.classList.add("resizing");
    if (!commLogExpanded) { commLogExpanded = true; commLog.classList.add("expanded"); }
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", onUp);
  });
  function onDrag(e) {
    if (!dragging) return;
    const newH = Math.max(44, Math.min(window.innerHeight * 0.8, startH + (startY - e.clientY)));
    commLog.style.height = newH + "px";
  }
  function onUp() {
    dragging = false;
    commLog.classList.remove("resizing");
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", onUp);
  }
}

// ── Back Button ─────────────────────────────────────────────
$("back-btn").addEventListener("click", (e) => {
  // If split-screen is visible, go back to landing instead of dashboard
  if (!$("edc-split-view").hidden) {
    e.preventDefault();
    backToLanding();
  }
  // Otherwise, default href goes to dashboard
});

// ── Init ───────────────────────────────────────────────────
async function init() {
  const userRes = await fetch("/api/me");
  if (userRes.ok) {
    currentUser = await userRes.json();
    userInitials.textContent = getInitials(currentUser.name);
    userInfo.textContent = currentUser.name || currentUser.email || "";
  }
  setLocale(locale);

  // Show landing page, split-screen hidden by default (set in HTML)
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

init();
