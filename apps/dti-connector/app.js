const APP_BASE = "/apps/dti-connector";

const userMenuToggle = document.getElementById("user-menu-toggle");
const userMenu = document.getElementById("user-menu");
const userInitials = document.getElementById("user-initials");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");
const localeDeBtn = document.getElementById("locale-de-btn");
const localeEnBtn = document.getElementById("locale-en-btn");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarNav = document.getElementById("sidebar-nav");
const brandText = document.getElementById("brand-text");
const headerBackBtn = document.querySelector(".header-back-btn");

// Connector list elements
const connectorListView = document.getElementById("connector-list-view");
const connectorDetailView = document.getElementById("connector-detail-view");
const connectorGrid = document.getElementById("connector-grid");
const connectorAddBtn = document.getElementById("connector-add-btn");
const connectorHint = document.getElementById("connector-hint");
const connectorDeleteModal = document.getElementById("connector-delete-modal");
const connectorDeleteForm = document.getElementById("connector-delete-form");
const connectorDeleteCancel = document.getElementById("connector-delete-cancel");
const connectorImportModal = document.getElementById("connector-import-modal");
const connectorImportForm = document.getElementById("connector-import-form");
const connectorImportCancel = document.getElementById("connector-import-cancel");
const connectorImportFileInput = document.getElementById("connector-import-file");

// Hierarchy elements
const hierarchyList = document.getElementById("hierarchy-list");
const hierarchyAddBtn = document.getElementById("hierarchy-add-btn");
const hierarchySaveBtn = document.getElementById("hierarchy-save-btn");
const hierarchyExportBtn = document.getElementById("hierarchy-export-btn");
const hierarchyImportBtn = document.getElementById("hierarchy-import-btn");
const hierarchyImportFile = document.getElementById("hierarchy-import-file");
const hierarchyHint = document.getElementById("hierarchy-hint");
const exportDialog = document.getElementById("export-dialog");
const exportNameInput = document.getElementById("export-name");
const exportCancelBtn = document.getElementById("export-cancel");
const exportDownloadBtn = document.getElementById("export-download");

// Settings / API key elements
const apiKeyDisplay = document.getElementById("api-key-display");
const apiKeyCopyBtn = document.getElementById("api-key-copy-btn");
const apiKeyGenerateBtn = document.getElementById("api-key-generate-btn");
const apiKeySaveBtn = document.getElementById("api-key-save-btn");
const settingsHint = document.getElementById("settings-hint");
const settingsEndpointCard = document.getElementById("settings-endpoint-card");
const apiEndpointUrl = document.getElementById("api-endpoint-url");

// Confirm modal
const confirmModal = document.getElementById("dti-confirm-modal");
const confirmForm = document.getElementById("dti-confirm-form");
const confirmTitle = document.getElementById("dti-confirm-title");
const confirmMessage = document.getElementById("dti-confirm-message");
const confirmOkBtn = document.getElementById("dti-confirm-ok");
const confirmCancelBtn = document.getElementById("dti-confirm-cancel");

const NAME_PATTERN = /^[A-Za-z0-9_-]+$/;

const I18N = {
  de: {
    connectorListTitle: "Konnektoren",
    connectorListDesc: "",
    connectorNew: "Neuer Konnektor",
    connectorNewPlaceholder: "Name eingeben…",
    connectorEmpty: "Noch keine Konnektoren erstellt.",
    connectorDeleteTitle: "Konnektor löschen?",
    connectorDeleteMessage: "Alle Daten dieses Konnektors werden unwiderruflich gelöscht.",
    connectorDeleteCancel: "Abbrechen",
    connectorDeleteConfirm: "Löschen",
    connectorImportTitle: "Konnektor importieren",
    connectorImportMessage: "Alle bestehenden Daten dieses Konnektors (Hierarchie, Datenmodell, Dateien und Assets) werden durch die importierten Daten ersetzt. Dieser Vorgang kann nicht rückgängig gemacht werden.",
    connectorImportCancel: "Abbrechen",
    connectorImportConfirm: "Importieren",
    connectorImportSuccess: "Konnektor erfolgreich importiert.",
    connectorImportError: "Fehler beim Importieren.",
    connectorExportError: "Fehler beim Exportieren.",
    shareTitle: "Konnektor teilen",
    shareRoleLabel: "Rolle",
    shareGenerate: "Link erstellen",
    shareCopied: "Link kopiert!",
    shareMembers: "Mitglieder",
    membersTitle: "Mitglieder",
    memberOwner: "Inhaber",
    memberEditor: "Editor",
    memberViewer: "Betrachter",
    memberRemove: "Entfernen",
    memberRemoved: "Mitglied entfernt.",
    memberRoleUpdated: "Rolle aktualisiert.",
    inviteAccepted: "Einladung angenommen!",
    inviteError: "Einladung konnte nicht angenommen werden.",
    inviteExpired: "Diese Einladung ist abgelaufen.",
    shareReadOnly: "Du hast nur Leserechte für diesen Konnektor.",
    connectorCreated: "Erstellt",
    hierarchy: "Hierarchie",
    model: "Modell",
    assets: "Assets",
    files: "Dateien",
    settings: "Einstellungen",
    hierarchyTitle: "Hierarchie-Level",
    hierarchyDesc: "Definiere die Ebenen der Produkthierarchie.",
    hierarchyAdd: "Level hinzufügen",
    hierarchySave: "Übernehmen",
    hierarchyPlaceholder: "Name (z.B. ProductType)",
    hierarchyValidation: "Nur Buchstaben (A-Z, a-z), Ziffern (0-9), Unterstrich (_) und Bindestrich (-) erlaubt.",
    allowedCharsLabel: "Erlaubte Zeichen:",
    exportTitle: "Export",
    exportNameLabel: "Dateiname",
    exportFormatLabel: "Format",
    exportCancel: "Abbrechen",
    exportDownload: "Download",
    hierarchyImported: "{count} Level importiert. Klicke Übernehmen zum Speichern.",
    hierarchyImportEmpty: "Die Datei enthält keine gültigen Einträge.",
    hierarchyImportError: "Fehler beim Lesen der Datei.",
    modelImported: "{count} Datenpunkte importiert. Klicke Übernehmen zum Speichern.",
    modelImportEmpty: "Die Datei enthält keine gültigen Einträge.",
    modelImportError: "Fehler beim Lesen der Datei.",
    hierarchyEmpty: "Jedes Level muss einen Namen haben.",
    hierarchySaved: "Hierarchie-Level erfolgreich gespeichert.",
    hierarchyError: "Fehler beim Speichern der Hierarchie-Level.",
    confirmTitle: "Änderungen übernehmen",
    confirmMessage: "Die Hierarchie-Level werden gespeichert und sind sofort über die API verfügbar. Fortfahren?",
    confirmOk: "Übernehmen",
    confirmCancel: "Abbrechen",
    settingsTitle: "Einstellungen",
    settingsDesc: "Verwalte deinen API-Schlüssel für den Zugriff auf die DTI Connector API.",
    settingsApikeyTitle: "API-Schlüssel",
    settingsApikeyDesc: "Dein persönlicher Schlüssel wird als Teil der API-URL verwendet. Ohne Schlüssel ist kein Zugriff auf die API möglich.",
    settingsEndpointTitle: "Dein API-Endpunkt",
    apiKeyPlaceholder: "Noch kein Schlüssel generiert",
    apiKeyGenerate: "Generieren",
    apiKeyRegenerate: "Neu generieren",
    apiKeySave: "Übernehmen",
    apiKeyCopied: "Kopiert!",
    apiKeySaved: "API-Schlüssel erfolgreich gespeichert.",
    apiKeySaveError: "Fehler beim Speichern des API-Schlüssels.",
    apiKeyUnsaved: "Schlüssel wurde generiert. Klicke auf Übernehmen um ihn zu speichern.",
    swaggerBtn: "API Docs",
    modelTitle: "Datenmodell",
    modelDesc: "Definiere die Datenpunkte, die der Konnektor bereitstellt. Jeder Datenpunkt hat eine eindeutige ID, einen optionalen Namen und einen Typ.",
    modelAdd: "Hinzufügen",
    modelSave: "Übernehmen",
    modelSearch: "Suchen…",
    modelColId: "ID",
    modelColName: "Name",
    modelColType: "Typ",
    modelTypeProperty: "Prop",
    modelTypeFile: "File",
    modelCount: "{filtered} von {total}",
    modelCountAll: "{total} Datenpunkte",
    modelEmpty: "Noch keine Datenpunkte definiert.",
    modelIdRequired: "Jeder Datenpunkt muss eine ID haben.",
    modelIdInvalid: "IDs dürfen nur Buchstaben, Ziffern, Punkt und Unterstrich enthalten.",
    modelIdDuplicate: "Doppelte ID gefunden: {id}",
    modelSaved: "Datenmodell erfolgreich gespeichert.",
    modelError: "Fehler beim Speichern des Datenmodells.",
    modelConfirmTitle: "Datenmodell übernehmen",
    modelConfirmMessage: "Das Datenmodell wird gespeichert und ist sofort über die API verfügbar. Fortfahren?",
    filesTitle: "Dateien",
    filesDesc: "Lade Dateien hoch und verknüpfe sie mit einer eindeutigen ID.",
    filesAdd: "Hinzufügen",
    filesSearch: "Suchen…",
    filesColId: "ID",
    filesColFile: "Datei",
    filesCount: "{filtered} von {total}",
    filesCountAll: "{total} Dateien",
    filesEmpty: "Noch keine Dateien hochgeladen.",
    filesPick: "Datei wählen",
    filesReplace: "Ersetzen",
    filesIdRequired: "Bitte zuerst eine ID eingeben.",
    filesIdInvalid: "ID darf nur Buchstaben, Ziffern, Punkt und Unterstrich enthalten.",
    filesIdDuplicate: "ID bereits vergeben: {id}",
    filesUploadError: "Fehler beim Hochladen.",
    filesDeleteError: "Fehler beim Löschen.",
    filesExportEmpty: "Keine Dateien zum Exportieren vorhanden.",
    filesExportError: "Fehler beim Exportieren.",
    filesImported: "{count} Dateien importiert.",
    filesImportEmpty: "Das ZIP enthält keine gültigen Dateien.",
    filesImportError: "Fehler beim Importieren.",
    filesImportNoManifest: "Das ZIP enthält keine manifest.json.",
    filesUploading: "Wird hochgeladen…",
    assetsTitle: "Assets",
    assetsDesc: "Verwalte deine Assets. Jedes Asset erhält eine eindeutige Item ID.",
    assetsAdd: "Hinzufügen",
    assetsSearch: "Suchen…",
    assetsColId: "Item ID",
    assetsCount: "{filtered} von {total}",
    assetsCountAll: "{total} Assets",
    assetsEmpty: "Noch keine Assets angelegt.",
    assetsIdRequired: "Bitte eine ID eingeben.",
    assetsIdInvalid: "ID darf nur Buchstaben (A-Z, a-z) und Ziffern (0-9) enthalten.",
    assetsIdDuplicate: "ID bereits vergeben: {id}",
    assetsCreateError: "Fehler beim Anlegen.",
    assetsDeleteError: "Fehler beim Löschen.",
    assetsExportEmpty: "Keine Assets zum Exportieren vorhanden.",
    assetsExportError: "Fehler beim Exportieren.",
    assetsImported: "{count} Assets importiert ({skipped} übersprungen).",
    assetsImportEmpty: "Die Datei enthält keine gültigen Assets.",
    assetsImportError: "Fehler beim Importieren.",
    assetsBack: "Zurück",
    assetsItemId: "Item ID",
    assetsHierarchySection: "Hierarchie",
    assetsPropsSection: "Eigenschaften",
    assetsFilesSection: "Dateien",
    assetsSave: "Übernehmen",
    assetsSaved: "Asset erfolgreich gespeichert.",
    assetsError: "Fehler beim Speichern.",
    assetsConfirmTitle: "Asset speichern",
    assetsConfirmMessage: "Die Werte werden gespeichert und sind sofort verfügbar. Fortfahren?",
    assetsFileNone: "— keine —",
    assetsPropsSearch: "Suchen…",
    assetsPropsCount: "{filtered} von {total}",
    assetsPropsCountAll: "{total} Eigenschaften",
    logout: "Logout",
    sidebarCollapse: "Navigation einklappen",
    sidebarExpand: "Navigation ausklappen",
    backToDashboard: "Zurück zum Dashboard",
  },
  en: {
    connectorListTitle: "Connectors",
    connectorListDesc: "",
    connectorNew: "New Connector",
    connectorNewPlaceholder: "Enter name…",
    connectorEmpty: "No connectors created yet.",
    connectorDeleteTitle: "Delete connector?",
    connectorDeleteMessage: "All data of this connector will be permanently deleted.",
    connectorDeleteCancel: "Cancel",
    connectorDeleteConfirm: "Delete",
    connectorImportTitle: "Import connector",
    connectorImportMessage: "All existing data of this connector (hierarchy, data model, files and assets) will be replaced by the imported data. This action cannot be undone.",
    connectorImportCancel: "Cancel",
    connectorImportConfirm: "Import",
    connectorImportSuccess: "Connector imported successfully.",
    connectorImportError: "Import failed.",
    connectorExportError: "Export failed.",
    shareTitle: "Share connector",
    shareRoleLabel: "Role",
    shareGenerate: "Generate link",
    shareCopied: "Link copied!",
    shareMembers: "Members",
    membersTitle: "Members",
    memberOwner: "Owner",
    memberEditor: "Editor",
    memberViewer: "Viewer",
    memberRemove: "Remove",
    memberRemoved: "Member removed.",
    memberRoleUpdated: "Role updated.",
    inviteAccepted: "Invite accepted!",
    inviteError: "Could not accept invite.",
    inviteExpired: "This invite has expired.",
    shareReadOnly: "You have read-only access to this connector.",
    connectorCreated: "Created",
    hierarchy: "Hierarchy",
    model: "Model",
    assets: "Assets",
    files: "Files",
    settings: "Settings",
    hierarchyTitle: "Hierarchy Levels",
    hierarchyDesc: "Define the levels of your product hierarchy.",
    hierarchyAdd: "Add level",
    hierarchySave: "Apply",
    hierarchyPlaceholder: "Name (e.g. ProductType)",
    hierarchyValidation: "Only letters (A-Z, a-z), digits (0-9), underscore (_) and hyphen (-) allowed.",
    allowedCharsLabel: "Allowed characters:",
    exportTitle: "Export",
    exportNameLabel: "Filename",
    exportFormatLabel: "Format",
    exportCancel: "Cancel",
    exportDownload: "Download",
    hierarchyImported: "{count} levels imported. Click Apply to save.",
    hierarchyImportEmpty: "The file contains no valid entries.",
    hierarchyImportError: "Failed to read the file.",
    modelImported: "{count} datapoints imported. Click Apply to save.",
    modelImportEmpty: "The file contains no valid entries.",
    modelImportError: "Failed to read the file.",
    hierarchyEmpty: "Every level must have a name.",
    hierarchySaved: "Hierarchy levels saved successfully.",
    hierarchyError: "Failed to save hierarchy levels.",
    confirmTitle: "Apply changes",
    confirmMessage: "Hierarchy levels will be saved and immediately available via the API. Continue?",
    confirmOk: "Apply",
    confirmCancel: "Cancel",
    settingsTitle: "Settings",
    settingsDesc: "Manage your API key for accessing the DTI Connector API.",
    settingsApikeyTitle: "API Key",
    settingsApikeyDesc: "Your personal key is used as part of the API URL. Without a key, API access is not possible.",
    settingsEndpointTitle: "Your API Endpoint",
    apiKeyPlaceholder: "No key generated yet",
    apiKeyGenerate: "Generate",
    apiKeyRegenerate: "Regenerate",
    apiKeySave: "Apply",
    apiKeyCopied: "Copied!",
    apiKeySaved: "API key saved successfully.",
    apiKeySaveError: "Failed to save API key.",
    apiKeyUnsaved: "Key generated. Click Apply to save it.",
    swaggerBtn: "API Docs",
    modelTitle: "Data Model",
    modelDesc: "Define the datapoints that the connector provides. Each datapoint has a unique ID, an optional name, and a type.",
    modelAdd: "Add",
    modelSave: "Apply",
    modelSearch: "Search…",
    modelColId: "ID",
    modelColName: "Name",
    modelColType: "Type",
    modelTypeProperty: "Prop",
    modelTypeFile: "File",
    modelCount: "{filtered} of {total}",
    modelCountAll: "{total} datapoints",
    modelEmpty: "No datapoints defined yet.",
    modelIdRequired: "Every datapoint must have an ID.",
    modelIdInvalid: "IDs may only contain letters, digits, dot and underscore.",
    modelIdDuplicate: "Duplicate ID found: {id}",
    modelSaved: "Data model saved successfully.",
    modelError: "Failed to save data model.",
    modelConfirmTitle: "Apply data model",
    modelConfirmMessage: "The data model will be saved and immediately available via the API. Continue?",
    filesTitle: "Files",
    filesDesc: "Upload files and link them with a unique ID.",
    filesAdd: "Add",
    filesSearch: "Search…",
    filesColId: "ID",
    filesColFile: "File",
    filesCount: "{filtered} of {total}",
    filesCountAll: "{total} files",
    filesEmpty: "No files uploaded yet.",
    filesPick: "Choose file",
    filesReplace: "Replace",
    filesIdRequired: "Please enter an ID first.",
    filesIdInvalid: "ID may only contain letters, digits, dot and underscore.",
    filesIdDuplicate: "ID already in use: {id}",
    filesUploadError: "Upload failed.",
    filesDeleteError: "Delete failed.",
    filesExportEmpty: "No files to export.",
    filesExportError: "Export failed.",
    filesImported: "{count} files imported.",
    filesImportEmpty: "The ZIP contains no valid files.",
    filesImportError: "Import failed.",
    filesImportNoManifest: "The ZIP contains no manifest.json.",
    filesUploading: "Uploading…",
    assetsTitle: "Assets",
    assetsDesc: "Manage your assets. Each asset gets a unique Item ID.",
    assetsAdd: "Add",
    assetsSearch: "Search…",
    assetsColId: "Item ID",
    assetsCount: "{filtered} of {total}",
    assetsCountAll: "{total} assets",
    assetsEmpty: "No assets created yet.",
    assetsIdRequired: "Please enter an ID.",
    assetsIdInvalid: "ID may only contain letters (A-Z, a-z) and digits (0-9).",
    assetsIdDuplicate: "ID already in use: {id}",
    assetsCreateError: "Failed to create asset.",
    assetsDeleteError: "Delete failed.",
    assetsExportEmpty: "No assets to export.",
    assetsExportError: "Export failed.",
    assetsImported: "{count} assets imported ({skipped} skipped).",
    assetsImportEmpty: "The file contains no valid assets.",
    assetsImportError: "Import failed.",
    assetsBack: "Back",
    assetsItemId: "Item ID",
    assetsHierarchySection: "Hierarchy",
    assetsPropsSection: "Properties",
    assetsFilesSection: "Files",
    assetsSave: "Apply",
    assetsSaved: "Asset saved successfully.",
    assetsError: "Failed to save asset.",
    assetsConfirmTitle: "Save asset",
    assetsConfirmMessage: "The values will be saved and immediately available. Continue?",
    assetsFileNone: "— none —",
    assetsPropsSearch: "Search…",
    assetsPropsCount: "{filtered} of {total}",
    assetsPropsCountAll: "{total} properties",
    logout: "Logout",
    sidebarCollapse: "Collapse navigation",
    sidebarExpand: "Expand navigation",
    backToDashboard: "Back to dashboard",
  },
};

let currentUser = null;
let locale = localStorage.getItem("kanban-locale") || "de";

// Connector state
let connectors = [];
let currentConnectorId = null;
let currentConnectorName = "";
let addingConnector = false;
let deleteConnectorId = null;
let currentConnectorRole = "owner";

// Connector detail state
let savedApiKey = "";
let pendingApiKey = "";
let activePage = "hierarchy";
let hierarchyLevels = [];
let modelDatapoints = [];
let modelSearchQuery = "";
let pendingConfirmAction = "";
let filesData = [];
let filesSearchQuery = "";
let assetsData = [];
let assetsSearchQuery = "";
let currentAssetId = null;
let currentAssetValues = {};
let assetsPropsSearchQuery = "";

function t(key) {
  return (I18N[locale] && I18N[locale][key]) || I18N.de[key] || key;
}

function connApi(path) {
  return `${APP_BASE}/api/connectors/${currentConnectorId}${path}`;
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
    return { ok: response.ok, status: response.status, payload };
  } catch (error) {
    return { ok: false, status: 0, payload: null, error };
  }
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
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
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

// ======================= LOCALE =======================

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
  logoutBtn.textContent = t("logout");

  // Connector list
  document.getElementById("connector-list-title").textContent = t("connectorListTitle");
  document.getElementById("connector-add-label").textContent = t("connectorNew");

  // Sidebar labels
  sidebarNav.querySelectorAll(".sidebar-item").forEach((btn) => {
    const page = btn.dataset.page;
    const label = btn.querySelector(".sidebar-label");
    if (label && page) label.textContent = t(page);
  });

  const isCollapsed = document.body.classList.contains("sidebar-collapsed");
  sidebarToggle.title = isCollapsed ? t("sidebarExpand") : t("sidebarCollapse");

  const backBtn = document.querySelector(".header-back-btn");
  if (backBtn) backBtn.title = currentConnectorId ? currentConnectorName : t("backToDashboard");

  const swaggerLabel = document.getElementById("swagger-btn-label");
  if (swaggerLabel) swaggerLabel.textContent = t("swaggerBtn");

  // Hierarchy page
  document.getElementById("hierarchy-title").textContent = t("hierarchyTitle");
  document.getElementById("hierarchy-desc").textContent = t("hierarchyDesc");
  document.getElementById("hierarchy-chars-label").textContent = t("allowedCharsLabel");
  document.getElementById("hierarchy-add-label").textContent = t("hierarchyAdd");
  document.getElementById("hierarchy-save-label").textContent = t("hierarchySave");

  // Export dialog
  document.getElementById("export-dialog-title").textContent = t("exportTitle");
  document.getElementById("export-name-label").textContent = t("exportNameLabel");
  document.getElementById("export-format-label").textContent = t("exportFormatLabel");
  document.getElementById("export-cancel").textContent = t("exportCancel");
  document.getElementById("export-download").textContent = t("exportDownload");

  // Settings page
  document.getElementById("settings-title").textContent = t("settingsTitle");
  document.getElementById("settings-desc").textContent = t("settingsDesc");
  document.getElementById("settings-apikey-title").textContent = t("settingsApikeyTitle");
  document.getElementById("settings-apikey-desc").textContent = t("settingsApikeyDesc");
  document.getElementById("settings-endpoint-title").textContent = t("settingsEndpointTitle");
  document.getElementById("api-key-generate-label").textContent = savedApiKey ? t("apiKeyRegenerate") : t("apiKeyGenerate");
  document.getElementById("api-key-save-label").textContent = t("apiKeySave");
  apiKeyDisplay.placeholder = t("apiKeyPlaceholder");

  // Model page
  document.getElementById("model-title").textContent = t("modelTitle");
  document.getElementById("model-desc").textContent = t("modelDesc");
  document.getElementById("model-add-label").textContent = t("modelAdd");
  document.getElementById("model-save-label").textContent = t("modelSave");
  document.getElementById("model-search").placeholder = t("modelSearch");

  // Files page
  document.getElementById("files-title").textContent = t("filesTitle");
  document.getElementById("files-desc").textContent = t("filesDesc");
  document.getElementById("files-add-label").textContent = t("filesAdd");
  document.getElementById("files-search").placeholder = t("filesSearch");

  // Assets page
  document.getElementById("assets-title").textContent = t("assetsTitle");
  document.getElementById("assets-desc").textContent = t("assetsDesc");
  document.getElementById("assets-chars-label").textContent = t("allowedCharsLabel");
  document.getElementById("assets-add-label").textContent = t("assetsAdd");
  document.getElementById("assets-search").placeholder = t("assetsSearch");
  document.getElementById("assets-col-id-label").textContent = t("assetsColId");
  document.getElementById("assets-back-label").textContent = t("assetsBack");
  document.getElementById("assets-detail-id-label").textContent = t("assetsItemId");
  document.getElementById("assets-hierarchy-section-title").textContent = t("assetsHierarchySection");
  document.getElementById("assets-props-section-title").textContent = t("assetsPropsSection");
  document.getElementById("assets-files-section-title").textContent = t("assetsFilesSection");
  document.getElementById("assets-save-label").textContent = t("assetsSave");
  assetsPropsSearch.placeholder = t("assetsPropsSearch");

  // Share / Members modals
  document.getElementById("share-modal-title").textContent = t("shareTitle");
  document.getElementById("share-role-label").textContent = t("shareRoleLabel");
  document.getElementById("share-generate-btn").textContent = t("shareGenerate");
  document.getElementById("share-members-btn").textContent = t("shareMembers");
  document.getElementById("members-modal-title").textContent = t("membersTitle");

  // Re-render
  if (currentConnectorId) {
    renderHierarchy();
    renderModel();
    renderFiles();
    renderAssets();
    if (currentAssetId) renderAssetDetail();
    updateEndpointPreview();
  }
  renderConnectors();
}

localeDeBtn.addEventListener("click", () => setLocale("de"));
localeEnBtn.addEventListener("click", () => setLocale("en"));

// ======================= CONNECTOR LIST =======================

async function loadConnectors() {
  const result = await apiRequest(`${APP_BASE}/api/connectors`);
  if (result.ok && result.payload?.connectors) {
    connectors = result.payload.connectors;
  }
  renderConnectors();
}

function renderConnectors() {
  connectorGrid.innerHTML = "";

  if (connectors.length === 0 && !addingConnector) {
    const empty = document.createElement("div");
    empty.className = "connector-empty";
    empty.textContent = t("connectorEmpty");
    connectorGrid.appendChild(empty);
    return;
  }

  for (const conn of connectors) {
    const card = document.createElement("div");
    card.className = "connector-card";

    const info = document.createElement("div");
    info.className = "connector-card-info";

    const name = document.createElement("div");
    name.className = "connector-card-name";
    name.textContent = conn.name;

    const meta = document.createElement("div");
    meta.className = "connector-card-meta";
    const uuid = document.createElement("span");
    uuid.className = "connector-card-uuid";
    uuid.textContent = conn.api_key.slice(0, 8) + "…";
    const created = document.createElement("span");
    created.textContent = t("connectorCreated") + ": " + formatDate(conn.created_at);
    meta.appendChild(uuid);
    meta.appendChild(created);

    info.appendChild(name);
    info.appendChild(meta);

    // Role badge for shared connectors
    if (conn.role && conn.role !== "owner") {
      const badge = document.createElement("span");
      badge.className = "connector-card-role";
      badge.textContent = conn.role === "editor" ? t("memberEditor") : t("memberViewer");
      meta.appendChild(badge);
    }

    const actions = document.createElement("div");
    actions.className = "connector-card-actions";

    // Share button (owner only)
    if (conn.role === "owner") {
      const shareBtn = document.createElement("button");
      shareBtn.type = "button";
      shareBtn.className = "connector-card-action-btn";
      shareBtn.title = t("shareTitle");
      shareBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
      shareBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openShareModal(conn.connector_id);
      });
      actions.appendChild(shareBtn);
    }

    // Members button (editor — can view, not manage)
    if (conn.role === "editor") {
      const membersBtn = document.createElement("button");
      membersBtn.type = "button";
      membersBtn.className = "connector-card-action-btn";
      membersBtn.title = t("shareMembers");
      membersBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
      membersBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openMembersModal(conn.connector_id);
      });
      actions.appendChild(membersBtn);
    }

    // Import button (owner + editor)
    if (conn.role === "owner" || conn.role === "editor") {
      const importBtn = document.createElement("button");
      importBtn.type = "button";
      importBtn.className = "connector-card-action-btn";
      importBtn.title = "Import";
      importBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';
      importBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        startConnectorImport(conn.connector_id, conn.name);
      });
      actions.appendChild(importBtn);
    }

    const exportBtn = document.createElement("button");
    exportBtn.type = "button";
    exportBtn.className = "connector-card-action-btn";
    exportBtn.title = "Export";
    exportBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
    exportBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      exportFullConnector(conn.connector_id, conn.name);
    });
    actions.appendChild(exportBtn);

    // Delete button (owner only)
    if (conn.role === "owner") {
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "connector-card-del";
      delBtn.textContent = "\u00d7";
      delBtn.title = t("connectorDeleteTitle");
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openConnectorDeleteModal(conn.connector_id, conn.name);
      });
      actions.appendChild(delBtn);
    }

    card.appendChild(info);
    card.appendChild(actions);
    card.addEventListener("click", () => enterConnector(conn.connector_id, conn.name, conn.role));
    connectorGrid.appendChild(card);
  }

  // New connector input row
  if (addingConnector) {
    const row = document.createElement("div");
    row.className = "connector-new-row";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "connector-new-input";
    input.id = "connector-new-name";
    input.placeholder = t("connectorNewPlaceholder");
    input.maxLength = 100;
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") confirmNewConnector();
      if (e.key === "Escape") cancelNewConnector();
    });

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "connector-new-confirm";
    confirmBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
    confirmBtn.addEventListener("click", confirmNewConnector);

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "connector-new-cancel";
    cancelBtn.textContent = "\u00d7";
    cancelBtn.addEventListener("click", cancelNewConnector);

    row.appendChild(input);
    row.appendChild(confirmBtn);
    row.appendChild(cancelBtn);
    connectorGrid.appendChild(row);

    requestAnimationFrame(() => input.focus());
  }
}

connectorAddBtn.addEventListener("click", () => {
  if (addingConnector) return;
  addingConnector = true;
  renderConnectors();
});

async function confirmNewConnector() {
  const input = document.getElementById("connector-new-name");
  const name = (input ? input.value : "").trim();
  if (!name) return;
  const result = await apiRequest(`${APP_BASE}/api/connectors`, {
    method: "POST",
    body: { name },
  });
  if (result.ok && result.payload) {
    connectors.push({
      connector_id: result.payload.connector_id,
      name: result.payload.name,
      api_key: result.payload.api_key,
      created_at: result.payload.created_at,
    });
    addingConnector = false;
    renderConnectors();
  }
}

function cancelNewConnector() {
  addingConnector = false;
  renderConnectors();
}

// Connector delete modal
function openConnectorDeleteModal(connId, connName) {
  deleteConnectorId = connId;
  document.getElementById("connector-delete-title").textContent = t("connectorDeleteTitle");
  document.getElementById("connector-delete-message").textContent =
    `${escapeHtml(connName)} — ${t("connectorDeleteMessage")}`;
  document.getElementById("connector-delete-cancel").textContent = t("connectorDeleteCancel");
  document.getElementById("connector-delete-ok").textContent = t("connectorDeleteConfirm");
  connectorDeleteModal.showModal();
}

connectorDeleteCancel.addEventListener("click", () => {
  connectorDeleteModal.close();
  deleteConnectorId = null;
});

connectorDeleteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  connectorDeleteModal.close();
  if (!deleteConnectorId) return;
  const result = await apiRequest(`${APP_BASE}/api/connectors/${deleteConnectorId}`, { method: "DELETE" });
  if (result.ok) {
    connectors = connectors.filter((c) => c.connector_id !== deleteConnectorId);
    renderConnectors();
  }
  deleteConnectorId = null;
});

// ======================= CONNECTOR FULL EXPORT =======================

async function exportFullConnector(connId, connName) {
  try {
    const resp = await fetch(APP_BASE + "/api/connectors/" + connId + "/export-full", { credentials: "same-origin" });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      connectorHint.textContent = err.error || t("connectorExportError");
      connectorHint.className = "hierarchy-hint hint-error";
      connectorHint.hidden = false;
      setTimeout(() => { connectorHint.hidden = true; }, 3000);
      return;
    }
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = connName + ".zip";
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    connectorHint.textContent = t("connectorExportError");
    connectorHint.className = "hierarchy-hint hint-error";
    connectorHint.hidden = false;
    setTimeout(() => { connectorHint.hidden = true; }, 3000);
  }
}

// ======================= CONNECTOR FULL IMPORT =======================

let importConnectorId = null;
let importConnectorName = null;

function startConnectorImport(connId, connName) {
  importConnectorId = connId;
  importConnectorName = connName;
  connectorImportFileInput.value = "";
  connectorImportFileInput.click();
}

connectorImportFileInput.addEventListener("change", () => {
  const file = connectorImportFileInput.files[0];
  if (!file || !importConnectorId) return;

  // Show confirmation dialog
  document.getElementById("connector-import-title").textContent = t("connectorImportTitle");
  document.getElementById("connector-import-message").textContent = t("connectorImportMessage");
  document.getElementById("connector-import-cancel").textContent = t("connectorImportCancel");
  document.getElementById("connector-import-ok").textContent = t("connectorImportConfirm");
  connectorImportModal.showModal();
});

connectorImportCancel.addEventListener("click", () => {
  connectorImportModal.close();
  importConnectorId = null;
  importConnectorName = null;
});

connectorImportForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  connectorImportModal.close();
  if (!importConnectorId) return;

  const file = connectorImportFileInput.files[0];
  if (!file) return;

  const form = new FormData();
  form.append("zip", file);

  try {
    const resp = await fetch(APP_BASE + "/api/connectors/" + importConnectorId + "/import-full", {
      method: "POST",
      credentials: "same-origin",
      body: form,
    });
    const result = await resp.json();
    if (!resp.ok) {
      connectorHint.textContent = result.error || t("connectorImportError");
      connectorHint.className = "hierarchy-hint hint-error";
      connectorHint.hidden = false;
      setTimeout(() => { connectorHint.hidden = true; }, 3000);
    } else {
      connectorHint.textContent = t("connectorImportSuccess");
      connectorHint.className = "hierarchy-hint hint-success";
      connectorHint.hidden = false;
      setTimeout(() => { connectorHint.hidden = true; }, 4000);
    }
  } catch {
    connectorHint.textContent = t("connectorImportError");
    connectorHint.className = "hierarchy-hint hint-error";
    connectorHint.hidden = false;
    setTimeout(() => { connectorHint.hidden = true; }, 3000);
  }
  importConnectorId = null;
  importConnectorName = null;
});

// ======================= SHARING =======================

let shareConnectorId = null;

function openShareModal(connId) {
  shareConnectorId = connId || currentConnectorId;
  const modal = document.getElementById("share-modal");
  document.getElementById("share-link-box").hidden = true;
  document.getElementById("share-hint").hidden = true;
  modal.showModal();
}

document.getElementById("share-generate-btn").addEventListener("click", async () => {
  const role = document.getElementById("share-role-select").value;
  try {
    const resp = await fetch(APP_BASE + "/api/connectors/" + shareConnectorId + "/invites", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error);
    const linkInput = document.getElementById("share-link-input");
    linkInput.value = data.inviteUrl;
    document.getElementById("share-link-box").hidden = false;
  } catch {
    const hint = document.getElementById("share-hint");
    hint.textContent = t("connectorExportError");
    hint.className = "hierarchy-hint hint-error";
    hint.hidden = false;
    setTimeout(() => { hint.hidden = true; }, 3000);
  }
});

document.getElementById("share-copy-btn").addEventListener("click", () => {
  const linkInput = document.getElementById("share-link-input");
  navigator.clipboard.writeText(linkInput.value).then(() => {
    const hint = document.getElementById("share-hint");
    hint.textContent = t("shareCopied");
    hint.className = "hierarchy-hint hint-success";
    hint.hidden = false;
    setTimeout(() => { hint.hidden = true; }, 2000);
  });
});

document.getElementById("share-members-btn").addEventListener("click", () => {
  document.getElementById("share-modal").close();
  openMembersModal(shareConnectorId);
});

async function openMembersModal(connId) {
  const cid = connId || currentConnectorId;
  const modal = document.getElementById("members-modal");
  const list = document.getElementById("members-list");
  list.innerHTML = '<div style="padding:12px;color:var(--text-muted)">...</div>';
  modal.showModal();
  try {
    const resp = await fetch(APP_BASE + "/api/connectors/" + cid + "/members", { credentials: "same-origin" });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error);
    list.innerHTML = "";
    for (const m of data.members) {
      const row = document.createElement("div");
      row.className = "member-row";

      const info = document.createElement("div");
      info.className = "member-info";
      const nameEl = document.createElement("span");
      nameEl.className = "member-name";
      nameEl.textContent = m.name;
      const emailEl = document.createElement("span");
      emailEl.className = "member-email";
      emailEl.textContent = m.email;
      info.appendChild(nameEl);
      info.appendChild(emailEl);

      const roleEl = document.createElement("span");
      roleEl.className = "member-role";

      if (m.role === "owner") {
        roleEl.textContent = t("memberOwner");
        row.appendChild(info);
        row.appendChild(roleEl);
      } else if (data.canManage) {
        const sel = document.createElement("select");
        sel.className = "member-role-select";
        sel.innerHTML = '<option value="editor">' + t("memberEditor") + '</option><option value="viewer">' + t("memberViewer") + '</option>';
        sel.value = m.role;
        sel.addEventListener("change", async () => {
          try {
            await fetch(APP_BASE + "/api/connectors/" + cid + "/members/" + m.userId, {
              method: "PATCH", credentials: "same-origin",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role: sel.value }),
            });
          } catch {}
        });
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "btn btn-danger btn-sm member-remove-btn";
        removeBtn.textContent = t("memberRemove");
        removeBtn.addEventListener("click", async () => {
          try {
            const resp = await fetch(APP_BASE + "/api/connectors/" + cid + "/members/" + m.userId, {
              method: "DELETE", credentials: "same-origin",
            });
            if (resp.ok) {
              row.remove();
            }
          } catch {}
        });
        row.appendChild(info);
        row.appendChild(sel);
        row.appendChild(removeBtn);
      } else {
        roleEl.textContent = m.role === "editor" ? t("memberEditor") : t("memberViewer");
        row.appendChild(info);
        row.appendChild(roleEl);
      }
      list.appendChild(row);
    }
  } catch {
    list.innerHTML = '<div style="padding:12px;color:var(--danger)">Error loading members</div>';
  }
}

async function handleInviteFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("invite");
  if (!token) return;
  // Remove token from URL
  const clean = new URL(window.location);
  clean.searchParams.delete("invite");
  window.history.replaceState({}, "", clean);
  try {
    const resp = await fetch(APP_BASE + "/api/connector-invites/" + token + "/accept", {
      method: "POST", credentials: "same-origin",
    });
    const data = await resp.json();
    if (resp.status === 410) {
      connectorHint.textContent = t("inviteExpired");
      connectorHint.className = "hierarchy-hint hint-error";
      connectorHint.hidden = false;
      setTimeout(() => { connectorHint.hidden = true; }, 4000);
      return;
    }
    if (!resp.ok) throw new Error(data.error);
    connectorHint.textContent = t("inviteAccepted");
    connectorHint.className = "hierarchy-hint hint-success";
    connectorHint.hidden = false;
    setTimeout(() => { connectorHint.hidden = true; }, 4000);
    // Reload connectors to show the newly shared one
    await loadConnectors();
  } catch {
    connectorHint.textContent = t("inviteError");
    connectorHint.className = "hierarchy-hint hint-error";
    connectorHint.hidden = false;
    setTimeout(() => { connectorHint.hidden = true; }, 4000);
  }
}

// Sidebar share/members buttons
document.getElementById("sidebar-share-btn").addEventListener("click", () => openShareModal());
document.getElementById("sidebar-members-btn").addEventListener("click", () => openMembersModal());

// ======================= CONNECTOR DETAIL VIEW =======================

async function enterConnector(connId, connName, role) {
  currentConnectorId = connId;
  currentConnectorName = connName;
  currentConnectorRole = role || "owner";

  // Reset detail state
  savedApiKey = "";
  pendingApiKey = "";
  hierarchyLevels = [];
  modelDatapoints = [];
  modelSearchQuery = "";
  filesData = [];
  filesSearchQuery = "";
  assetsData = [];
  assetsSearchQuery = "";
  currentAssetId = null;
  currentAssetValues = {};
  assetsPropsSearchQuery = "";
  activePage = "hierarchy";

  // Switch views
  connectorListView.style.display = "none";
  connectorDetailView.style.display = "";
  brandText.textContent = connName;

  // Show + update docs link with connector context
  const docsLink = document.getElementById("docs-link");
  if (docsLink) {
    docsLink.href = APP_BASE + "/docs?connector=" + connId;
    docsLink.style.display = "";
  }

  // Show/hide sidebar share/members buttons based on role
  const sidebarShareBtn = document.getElementById("sidebar-share-btn");
  const sidebarMembersBtn = document.getElementById("sidebar-members-btn");
  sidebarShareBtn.style.display = currentConnectorRole === "owner" ? "" : "none";
  sidebarMembersBtn.style.display = "";

  // Toggle read-only class for viewer role
  connectorDetailView.classList.toggle("role-viewer", currentConnectorRole === "viewer");

  // Navigate to hierarchy tab
  navigateTo("hierarchy");

  // Load data
  await loadApiKey();
  await loadHierarchy();
  await loadModel();
  await loadFiles();
  await loadAssets();
}

function backToConnectors() {
  currentConnectorId = null;
  currentConnectorName = "";
  currentConnectorRole = "owner";
  connectorDetailView.style.display = "none";
  connectorListView.style.display = "";
  brandText.textContent = "DTI Connector";
  document.getElementById("sidebar-share-btn").style.display = "none";
  document.getElementById("sidebar-members-btn").style.display = "none";
  const docsLink = document.getElementById("docs-link");
  if (docsLink) docsLink.style.display = "none";
  loadConnectors();
}

// Override back button behavior
headerBackBtn.addEventListener("click", (e) => {
  if (currentConnectorId) {
    e.preventDefault();
    backToConnectors();
  }
});

// ======================= SIDEBAR =======================

sidebarToggle.addEventListener("click", () => {
  document.body.classList.toggle("sidebar-collapsed");
  const isCollapsed = document.body.classList.contains("sidebar-collapsed");
  sidebarToggle.title = isCollapsed ? t("sidebarExpand") : t("sidebarCollapse");
  localStorage.setItem("dti-sidebar-collapsed", isCollapsed ? "1" : "");
});

if (localStorage.getItem("dti-sidebar-collapsed") === "1") {
  document.body.classList.add("sidebar-collapsed");
}

function navigateTo(page) {
  activePage = page;
  sidebarNav.querySelectorAll(".sidebar-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
  document.querySelectorAll(".page-section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === "page-" + page);
  });
  if (page !== "assets" && currentAssetId) {
    showAssetsListView();
  }
}

sidebarNav.addEventListener("click", (e) => {
  const btn = e.target.closest(".sidebar-item");
  if (!btn || !btn.dataset.page) return;
  navigateTo(btn.dataset.page);
});

// ======================= SETTINGS / API KEY =======================

function updateEndpointPreview() {
  const key = savedApiKey || pendingApiKey;
  if (key) {
    settingsEndpointCard.style.display = "";
    apiEndpointUrl.textContent = window.location.origin + APP_BASE + "/api/v1/" + key;
  } else {
    settingsEndpointCard.style.display = "none";
  }
}

function showSettingsHint(msg, type) {
  settingsHint.textContent = msg;
  settingsHint.className = "hierarchy-hint hint-" + type;
  settingsHint.hidden = false;
}

function hideSettingsHint() { settingsHint.hidden = true; }

async function loadApiKey() {
  const result = await apiRequest(connApi("/key"));
  if (result.ok && result.payload && result.payload.apiKey) {
    savedApiKey = result.payload.apiKey;
    pendingApiKey = "";
    apiKeyDisplay.value = savedApiKey;
    apiKeySaveBtn.disabled = true;
    document.getElementById("api-key-generate-label").textContent = t("apiKeyRegenerate");
  }
  updateEndpointPreview();
}

apiKeyGenerateBtn.addEventListener("click", () => {
  pendingApiKey = crypto.randomUUID();
  apiKeyDisplay.value = pendingApiKey;
  apiKeySaveBtn.disabled = false;
  hideSettingsHint();
  showSettingsHint(t("apiKeyUnsaved"), "warning");
  updateEndpointPreview();
});

apiKeySaveBtn.addEventListener("click", async () => {
  if (!pendingApiKey) return;
  apiKeySaveBtn.disabled = true;
  const result = await apiRequest(connApi("/key"), {
    method: "PUT",
    body: { apiKey: pendingApiKey },
  });
  if (result.ok) {
    savedApiKey = pendingApiKey;
    pendingApiKey = "";
    document.getElementById("api-key-generate-label").textContent = t("apiKeyRegenerate");
    showSettingsHint(t("apiKeySaved"), "success");
    setTimeout(hideSettingsHint, 3000);
    // Update connector in local list
    const conn = connectors.find((c) => c.connector_id === currentConnectorId);
    if (conn) conn.api_key = savedApiKey;
  } else {
    apiKeySaveBtn.disabled = false;
    showSettingsHint(result.payload?.error || t("apiKeySaveError"), "error");
  }
  updateEndpointPreview();
});

apiKeyCopyBtn.addEventListener("click", async () => {
  const key = apiKeyDisplay.value;
  if (!key) return;
  try {
    await navigator.clipboard.writeText(key);
    apiKeyCopyBtn.title = t("apiKeyCopied");
    setTimeout(() => { apiKeyCopyBtn.title = "Kopieren"; }, 1500);
  } catch {
    apiKeyDisplay.select();
  }
});

// ======================= HIERARCHY =======================

let hierarchyDragIndex = null;

function renderHierarchy() {
  hierarchyList.innerHTML = "";
  hierarchyLevels.forEach((level, i) => {
    const row = document.createElement("div");
    row.className = "hierarchy-row";
    row.dataset.index = i;

    const handle = document.createElement("div");
    handle.className = "drag-handle";
    handle.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>';
    handle.addEventListener("mousedown", () => { row.draggable = true; });
    handle.addEventListener("touchstart", () => { row.draggable = true; }, { passive: true });

    const num = document.createElement("div");
    num.className = "hierarchy-level";
    num.textContent = i + 1;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "hierarchy-name";
    input.value = level.name;
    input.maxLength = 60;
    input.placeholder = t("hierarchyPlaceholder");
    input.addEventListener("input", () => {
      hierarchyLevels[i].name = input.value;
      if (input.value && !NAME_PATTERN.test(input.value)) {
        input.classList.add("invalid");
      } else {
        input.classList.remove("invalid");
      }
      hideHint();
    });

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "hierarchy-remove-btn";
    removeBtn.textContent = "\u00d7";
    removeBtn.disabled = hierarchyLevels.length <= 1;
    removeBtn.addEventListener("click", () => {
      hierarchyLevels.splice(i, 1);
      renderHierarchy();
    });

    // Drag events
    row.addEventListener("dragstart", (e) => {
      hierarchyDragIndex = i;
      row.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });
    row.addEventListener("dragend", () => {
      hierarchyDragIndex = null;
      row.draggable = false;
      row.classList.remove("dragging");
      hierarchyList.querySelectorAll(".hierarchy-row").forEach(r => {
        r.classList.remove("drag-over-top", "drag-over-bottom");
      });
    });
    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (hierarchyDragIndex === null || hierarchyDragIndex === i) return;
      const rect = row.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      row.classList.toggle("drag-over-top", e.clientY < mid);
      row.classList.toggle("drag-over-bottom", e.clientY >= mid);
    });
    row.addEventListener("dragleave", () => {
      row.classList.remove("drag-over-top", "drag-over-bottom");
    });
    row.addEventListener("drop", (e) => {
      e.preventDefault();
      row.classList.remove("drag-over-top", "drag-over-bottom");
      if (hierarchyDragIndex === null || hierarchyDragIndex === i) return;
      const from = hierarchyDragIndex;
      const rect = row.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      let to = e.clientY < mid ? i : i + 1;
      if (from < to) to--;
      const [item] = hierarchyLevels.splice(from, 1);
      hierarchyLevels.splice(to, 0, item);
      hierarchyDragIndex = null;
      renderHierarchy();
    });

    row.appendChild(handle);
    row.appendChild(num);
    row.appendChild(input);
    row.appendChild(removeBtn);
    hierarchyList.appendChild(row);
  });
}

function validateHierarchy() {
  for (let i = 0; i < hierarchyLevels.length; i++) {
    const name = hierarchyLevels[i].name.trim();
    if (!name) { showHint(t("hierarchyEmpty"), "error"); return false; }
    if (!NAME_PATTERN.test(name)) { showHint(t("hierarchyValidation"), "error"); return false; }
  }
  return true;
}

function showHint(msg, type) {
  hierarchyHint.textContent = msg;
  hierarchyHint.className = "hierarchy-hint hint-" + type;
  hierarchyHint.hidden = false;
}

function hideHint() { hierarchyHint.hidden = true; }

hierarchyAddBtn.addEventListener("click", () => {
  hierarchyLevels.push({ name: "" });
  renderHierarchy();
  const inputs = hierarchyList.querySelectorAll(".hierarchy-name");
  if (inputs.length) inputs[inputs.length - 1].focus();
});

hierarchySaveBtn.addEventListener("click", () => {
  if (!validateHierarchy()) return;
  pendingConfirmAction = "hierarchy";
  openConfirm();
});

// ======================= HIERARCHY EXPORT =======================

hierarchyExportBtn.addEventListener("click", () => {
  exportNameInput.value = "hierarchy_" + currentConnectorName + "_" + savedApiKey;
  exportDialog.querySelector('input[value="xlsx"]').checked = true;
  exportDialog.dataset.source = "hierarchy";
  exportDialog.showModal();
});

exportCancelBtn.addEventListener("click", () => exportDialog.close());

exportDownloadBtn.addEventListener("click", () => {
  const filename = (exportNameInput.value || "export").trim();
  const format = exportDialog.querySelector('input[name="export-format"]:checked').value;
  const source = exportDialog.dataset.source || "hierarchy";

  let data, sheetName;
  if (source === "assets") {
    try { data = JSON.parse(exportDialog.dataset.assetsRows || "[]"); } catch { data = []; }
    sheetName = "Assets";
  } else if (source === "model") {
    data = modelDatapoints.map((dp, i) => ({ ID: dp.id, Name: dp.name, Type: dp.type === 1 ? "File" : "Prop" }));
    sheetName = "Model";
  } else {
    data = hierarchyLevels.map((h, i) => ({ Level: i + 1, Name: h.name }));
    sheetName = "Hierarchy";
  }

  const ws = XLSX.utils.json_to_sheet(data);
  if (format === "xlsx") {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, filename + ".xlsx");
  } else {
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename + ".csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  exportDialog.close();
});

// ======================= HIERARCHY IMPORT =======================

hierarchyImportBtn.addEventListener("click", () => {
  hierarchyImportFile.value = "";
  hierarchyImportFile.click();
});

hierarchyImportFile.addEventListener("change", async () => {
  const file = hierarchyImportFile.files[0];
  if (!file) return;

  try {
    let rows;
    if (file.name.toLowerCase().endsWith(".csv")) {
      let text = await file.text();
      // Strip BOM
      if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
      // Detect separator: semicolon or comma
      const sep = text.indexOf(";") < text.indexOf("\n") && text.includes(";") ? ";" : ",";
      const wb = XLSX.read(text, { type: "string", FS: sep });
      const ws = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(ws);
    } else {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(ws);
    }

    if (!rows.length) {
      showHint(t("hierarchyImportEmpty"), "error");
      return;
    }

    // Detect column names (support Level/level, Name/name and any first/second column)
    const imported = [];
    for (const row of rows) {
      const keys = Object.keys(row);
      const name = row.Name || row.name || row.NAME || (keys.length >= 2 ? row[keys[1]] : row[keys[0]]) || "";
      const str = String(name).trim();
      if (str) {
        imported.push({ name: str });
      }
    }

    if (!imported.length) {
      showHint(t("hierarchyImportEmpty"), "error");
      return;
    }

    // Validate names
    for (const h of imported) {
      if (!NAME_PATTERN.test(h.name)) {
        showHint(t("hierarchyValidation"), "error");
        return;
      }
    }

    hierarchyLevels = imported;
    renderHierarchy();
    showHint(t("hierarchyImported").replace("{count}", imported.length), "success");
  } catch (err) {
    showHint(t("hierarchyImportError"), "error");
  }
});

// ======================= CONFIRM MODAL =======================

function openConfirm() {
  confirmTitle.textContent = t("confirmTitle");
  confirmMessage.textContent = t("confirmMessage");
  confirmOkBtn.textContent = t("confirmOk");
  confirmCancelBtn.textContent = t("confirmCancel");
  confirmModal.showModal();
}

confirmCancelBtn.addEventListener("click", () => confirmModal.close());

confirmForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  confirmModal.close();
  if (pendingConfirmAction === "model") {
    await saveModel();
  } else if (pendingConfirmAction === "assets") {
    await saveAssetValues();
  } else {
    await saveHierarchy();
  }
  pendingConfirmAction = "";
});

async function saveHierarchy() {
  hierarchySaveBtn.disabled = true;
  const payload = hierarchyLevels.map((l, i) => ({ level: i + 1, name: l.name.trim() }));
  const result = await apiRequest(connApi("/hierarchy/levels"), { method: "PUT", body: payload });
  hierarchySaveBtn.disabled = false;
  if (result.ok) {
    if (Array.isArray(result.payload)) {
      hierarchyLevels = result.payload.map((r) => ({ name: r.name }));
      renderHierarchy();
    }
    showHint(t("hierarchySaved"), "success");
    setTimeout(hideHint, 3000);
  } else {
    showHint(result.payload?.error || t("hierarchyError"), "error");
  }
}

async function loadHierarchy() {
  const result = await apiRequest(connApi("/hierarchy/levels/internal"));
  if (result.ok && Array.isArray(result.payload)) {
    hierarchyLevels = result.payload.map((r) => ({ name: r.name }));
  }
  if (hierarchyLevels.length === 0) hierarchyLevels = [{ name: "" }];
  renderHierarchy();
}

// ======================= MODEL =======================

const modelTableBody = document.getElementById("model-table-body");
const modelSearchInput = document.getElementById("model-search");
const modelCountEl = document.getElementById("model-count");
const modelAddBtn = document.getElementById("model-add-btn");
const modelSaveBtn = document.getElementById("model-save-btn");
const modelExportBtn = document.getElementById("model-export-btn");
const modelImportBtn = document.getElementById("model-import-btn");
const modelImportFile = document.getElementById("model-import-file");
const modelHint = document.getElementById("model-hint");

const MODEL_ID_PATTERN = /^[a-zA-Z0-9._]+$/;

function renderModel() {
  modelTableBody.innerHTML = "";
  const q = modelSearchQuery.toLowerCase();
  let visibleCount = 0;

  if (modelDatapoints.length === 0) {
    const empty = document.createElement("div");
    empty.className = "model-empty";
    empty.textContent = t("modelEmpty");
    modelTableBody.appendChild(empty);
    updateModelCount(0, 0);
    return;
  }

  modelDatapoints.forEach((dp, i) => {
    const matchesSearch = !q || dp.id.toLowerCase().includes(q) || (dp.name || "").toLowerCase().includes(q);
    const row = document.createElement("div");
    row.className = "model-row" + (matchesSearch ? "" : " row-hidden");
    if (matchesSearch) visibleCount++;

    const num = document.createElement("span");
    num.className = "model-row-num";
    num.textContent = i + 1;

    const idInput = document.createElement("input");
    idInput.type = "text";
    idInput.className = "model-id";
    idInput.value = dp.id;
    idInput.placeholder = "datapoint.id";
    idInput.addEventListener("input", () => {
      modelDatapoints[i].id = idInput.value;
      idInput.classList.toggle("invalid", idInput.value && !MODEL_ID_PATTERN.test(idInput.value));
      hideModelHint();
    });

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = dp.name || "";
    nameInput.placeholder = t("modelColName");
    nameInput.addEventListener("input", () => { modelDatapoints[i].name = nameInput.value; });

    const typeWrap = document.createElement("div");
    typeWrap.className = "model-type-toggle";
    const propBtn = document.createElement("button");
    propBtn.type = "button";
    propBtn.className = "model-type-btn" + (dp.type === 0 ? " active" : "");
    propBtn.textContent = t("modelTypeProperty");
    const fileBtn = document.createElement("button");
    fileBtn.type = "button";
    fileBtn.className = "model-type-btn" + (dp.type === 1 ? " active" : "");
    fileBtn.textContent = t("modelTypeFile");
    propBtn.addEventListener("click", () => { modelDatapoints[i].type = 0; propBtn.classList.add("active"); fileBtn.classList.remove("active"); });
    fileBtn.addEventListener("click", () => { modelDatapoints[i].type = 1; fileBtn.classList.add("active"); propBtn.classList.remove("active"); });
    typeWrap.appendChild(propBtn);
    typeWrap.appendChild(fileBtn);

    const typeText = document.createElement("span");
    typeText.className = "model-type-text";
    typeText.textContent = dp.type === 1 ? t("modelTypeFile") : t("modelTypeProperty");

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "model-row-del";
    delBtn.textContent = "\u00d7";
    delBtn.addEventListener("click", () => { modelDatapoints.splice(i, 1); renderModel(); });

    row.appendChild(num);
    row.appendChild(idInput);
    row.appendChild(nameInput);
    row.appendChild(typeWrap);
    row.appendChild(typeText);
    row.appendChild(delBtn);
    modelTableBody.appendChild(row);
  });

  updateModelCount(visibleCount, modelDatapoints.length);
}

function updateModelCount(filtered, total) {
  if (modelSearchQuery && filtered !== total) {
    modelCountEl.textContent = t("modelCount").replace("{filtered}", filtered).replace("{total}", total);
  } else {
    modelCountEl.textContent = t("modelCountAll").replace("{total}", total);
  }
}

function validateModel() {
  const seenIds = new Map();
  for (let i = 0; i < modelDatapoints.length; i++) {
    const id = modelDatapoints[i].id.trim();
    if (!id) { showModelHint(t("modelIdRequired"), "error"); return false; }
    if (!MODEL_ID_PATTERN.test(id)) { showModelHint(t("modelIdInvalid"), "error"); return false; }
    const lower = id.toLowerCase();
    if (seenIds.has(lower)) { showModelHint(t("modelIdDuplicate").replace("{id}", id), "error"); return false; }
    seenIds.set(lower, true);
  }
  return true;
}

function showModelHint(msg, type) {
  modelHint.textContent = msg;
  modelHint.className = "hierarchy-hint hint-" + type;
  modelHint.hidden = false;
}
function hideModelHint() { modelHint.hidden = true; }

modelSearchInput.addEventListener("input", () => { modelSearchQuery = modelSearchInput.value; renderModel(); });

modelAddBtn.addEventListener("click", () => {
  modelDatapoints.push({ id: "", name: "", type: 0 });
  modelSearchQuery = "";
  modelSearchInput.value = "";
  renderModel();
  const rows = modelTableBody.querySelectorAll(".model-row");
  if (rows.length) {
    const lastRow = rows[rows.length - 1];
    const idInput = lastRow.querySelector(".model-id");
    if (idInput) idInput.focus();
    modelTableBody.scrollTop = modelTableBody.scrollHeight;
  }
});

// ======================= MODEL EXPORT =======================

modelExportBtn.addEventListener("click", () => {
  exportNameInput.value = "model_" + currentConnectorName + "_" + savedApiKey;
  exportDialog.querySelector('input[value="xlsx"]').checked = true;
  // Tag the dialog so download knows it's model data
  exportDialog.dataset.source = "model";
  exportDialog.showModal();
});

// ======================= MODEL IMPORT =======================

modelImportBtn.addEventListener("click", () => {
  modelImportFile.value = "";
  modelImportFile.click();
});

modelImportFile.addEventListener("change", async () => {
  const file = modelImportFile.files[0];
  if (!file) return;

  try {
    let rows;
    if (file.name.toLowerCase().endsWith(".csv")) {
      let text = await file.text();
      if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
      const sep = text.indexOf(";") < text.indexOf("\n") && text.includes(";") ? ";" : ",";
      const wb = XLSX.read(text, { type: "string", FS: sep });
      const ws = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(ws);
    } else {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(ws);
    }

    if (!rows.length) {
      showModelHint(t("modelImportEmpty"), "error");
      return;
    }

    const imported = [];
    for (const row of rows) {
      const id = String(row.ID || row.id || row.Id || "").trim();
      const name = String(row.Name || row.name || row.NAME || "").trim();
      const rawType = row.Type || row.type || row.Typ || row.typ || 0;
      const type = rawType === 1 || rawType === "1" || String(rawType).toLowerCase() === "file" ? 1 : 0;
      if (id && MODEL_ID_PATTERN.test(id)) {
        imported.push({ id, name, type, sort_order: imported.length });
      }
    }

    if (!imported.length) {
      showModelHint(t("modelImportEmpty"), "error");
      return;
    }

    modelDatapoints = imported;
    renderModel();
    showModelHint(t("modelImported").replace("{count}", imported.length), "success");
  } catch (err) {
    showModelHint(t("modelImportError"), "error");
  }
});

modelSaveBtn.addEventListener("click", () => {
  if (!validateModel()) return;
  confirmTitle.textContent = t("modelConfirmTitle");
  confirmMessage.textContent = t("modelConfirmMessage");
  confirmOkBtn.textContent = t("confirmOk");
  confirmCancelBtn.textContent = t("confirmCancel");
  confirmModal.showModal();
  pendingConfirmAction = "model";
});

async function saveModel() {
  modelSaveBtn.disabled = true;
  const payload = modelDatapoints.map((dp) => ({ id: dp.id.trim(), name: (dp.name || "").trim(), type: dp.type }));
  const result = await apiRequest(connApi("/model"), { method: "PUT", body: payload });
  modelSaveBtn.disabled = false;
  if (result.ok && Array.isArray(result.payload)) {
    modelDatapoints = result.payload.map((r) => ({ id: r.id, name: r.name || "", type: r.type }));
    renderModel();
    showModelHint(t("modelSaved"), "success");
    setTimeout(hideModelHint, 3000);
  } else {
    showModelHint(result.payload?.error || t("modelError"), "error");
  }
}

async function loadModel() {
  const result = await apiRequest(connApi("/model/internal"));
  if (result.ok && Array.isArray(result.payload)) {
    modelDatapoints = result.payload.map((r) => ({ id: r.id, name: r.name || "", type: r.type }));
  }
  renderModel();
}

// ======================= FILES =======================

const filesTableBody = document.getElementById("files-table-body");
const filesSearchInput = document.getElementById("files-search");
const filesCountEl = document.getElementById("files-count");
const filesAddBtn = document.getElementById("files-add-btn");
const filesExportBtn = document.getElementById("files-export-btn");
const filesImportBtn = document.getElementById("files-import-btn");
const filesImportFile = document.getElementById("files-import-file");
const filesHint = document.getElementById("files-hint");

const FILES_ID_PATTERN = /^[a-zA-Z0-9._]+$/;

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const PREVIEWABLE_TYPES = new Set([
  "image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml",
  "application/pdf", "application/json", "text/json",
]);
function isPreviewable(mime) { return PREVIEWABLE_TYPES.has((mime || "").toLowerCase()); }

function groupFilesFromApi(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.file_id)) {
      map.set(row.file_id, { file_id: row.file_id, en: null, de: null, _new: false, _uploads: {} });
    }
    const entry = map.get(row.file_id);
    entry[row.lang] = { original_name: row.original_name, size: row.size, mime_type: row.mime_type };
  }
  return Array.from(map.values());
}

function buildLangCell(entry, lang, rowIdx) {
  const cell = document.createElement("div");
  cell.className = "files-file-cell";

  const uploadState = entry._uploads[lang];
  const fileData = entry[lang];

  if (uploadState && uploadState.uploading) {
    const wrap = document.createElement("div");
    wrap.className = "files-progress-wrap";
    const bar = document.createElement("div");
    bar.className = "files-progress-bar";
    const fill = document.createElement("div");
    fill.className = "files-progress-fill";
    fill.style.width = (uploadState.progress || 0) + "%";
    fill.id = "fp-" + rowIdx + "-" + lang;
    bar.appendChild(fill);
    wrap.appendChild(bar);
    const txt = document.createElement("div");
    txt.className = "files-progress-text";
    txt.id = "ft-" + rowIdx + "-" + lang;
    txt.textContent = (uploadState.progress || 0) + "%";
    wrap.appendChild(txt);
    cell.appendChild(wrap);
  } else if (fileData) {
    const check = document.createElement("span");
    check.className = "files-check";
    check.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
    cell.appendChild(check);
    const fname = document.createElement("span");
    fname.className = "files-filename";
    fname.textContent = fileData.original_name;
    fname.title = fileData.original_name;
    cell.appendChild(fname);
    if (fileData.size) {
      const fsize = document.createElement("span");
      fsize.className = "files-filesize";
      fsize.textContent = formatFileSize(fileData.size);
      cell.appendChild(fsize);
    }
    if (isPreviewable(fileData.mime_type)) {
      const openBtn = document.createElement("a");
      openBtn.className = "files-open-btn";
      openBtn.href = connApi("/files/view/" + encodeURIComponent(entry.file_id) + "/" + lang);
      openBtn.target = "_blank";
      openBtn.title = fileData.original_name;
      openBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
      cell.appendChild(openBtn);
    }
  } else if (entry._new && lang === "en") {
    const btn = createPickBtn(t("filesPick"));
    btn.addEventListener("click", () => {
      const idInput = filesTableBody.querySelector("#files-new-id");
      const fileId = idInput ? idInput.value.trim() : "";
      if (!fileId) { showFilesHint(t("filesIdRequired"), "error"); setTimeout(hideFilesHint, 3000); return; }
      if (!FILES_ID_PATTERN.test(fileId)) { showFilesHint(t("filesIdInvalid"), "error"); setTimeout(hideFilesHint, 3000); return; }
      const dup = filesData.some((f) => !f._new && f.file_id.toLowerCase() === fileId.toLowerCase());
      if (dup) { showFilesHint(t("filesIdDuplicate").replace("{id}", fileId), "error"); setTimeout(hideFilesHint, 3000); return; }
      entry.file_id = fileId;
      entry._new = false;
      pickAndUpload(entry, "en");
    });
    cell.appendChild(btn);
  } else if (!entry._new && lang === "en") {
    const btn = createPickBtn(t("filesReplace"));
    btn.addEventListener("click", () => pickAndUpload(entry, "en"));
    cell.appendChild(btn);
  } else if (!entry._new && lang === "de" && entry.en) {
    const btn = createPickBtn(fileData ? t("filesReplace") : t("filesPick"));
    btn.addEventListener("click", () => pickAndUpload(entry, "de"));
    cell.appendChild(btn);
  }

  return cell;
}

function createPickBtn(label) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "files-pick-btn";
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';
  const span = document.createElement("span");
  span.textContent = label;
  btn.appendChild(span);
  return btn;
}

function renderFiles() {
  filesTableBody.innerHTML = "";
  const q = filesSearchQuery.toLowerCase();
  let visibleCount = 0;
  const savedEntries = filesData.filter((f) => !f._new);
  const newEntry = filesData.find((f) => f._new);

  if (savedEntries.length === 0 && !newEntry) {
    const empty = document.createElement("div");
    empty.className = "model-empty";
    empty.textContent = t("filesEmpty");
    filesTableBody.appendChild(empty);
    updateFilesCount(0, 0);
    return;
  }

  savedEntries.forEach((entry, i) => {
    const matchesSearch = !q ||
      entry.file_id.toLowerCase().includes(q) ||
      (entry.en && entry.en.original_name.toLowerCase().includes(q)) ||
      (entry.de && entry.de.original_name.toLowerCase().includes(q));

    const row = document.createElement("div");
    row.className = "files-row" + (matchesSearch ? "" : " row-hidden");
    if (matchesSearch) visibleCount++;

    const num = document.createElement("span");
    num.className = "files-row-num";
    num.textContent = i + 1;

    const idInput = document.createElement("input");
    idInput.type = "text";
    idInput.className = "files-id";
    idInput.value = entry.file_id;
    idInput.disabled = true;

    const enCell = buildLangCell(entry, "en", i);
    const deCell = buildLangCell(entry, "de", i);

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "files-row-del";
    delBtn.textContent = "\u00d7";
    const hasActiveUpload = (entry._uploads.en && entry._uploads.en.uploading) || (entry._uploads.de && entry._uploads.de.uploading);
    if (hasActiveUpload) { delBtn.disabled = true; delBtn.style.opacity = "0.3"; }
    delBtn.addEventListener("click", () => deleteFile(entry.file_id));

    row.appendChild(num);
    row.appendChild(idInput);
    row.appendChild(enCell);
    row.appendChild(deCell);
    row.appendChild(delBtn);
    filesTableBody.appendChild(row);
  });

  if (newEntry) {
    const row = document.createElement("div");
    row.className = "files-row";
    const num = document.createElement("span");
    num.className = "files-row-num";
    num.textContent = savedEntries.length + 1;

    const idInput = document.createElement("input");
    idInput.type = "text";
    idInput.className = "files-id";
    idInput.id = "files-new-id";
    idInput.value = newEntry.file_id;
    idInput.placeholder = "datei.id";
    idInput.addEventListener("input", () => {
      newEntry.file_id = idInput.value;
      const val = idInput.value.trim();
      const patternBad = val && !FILES_ID_PATTERN.test(val);
      const dupBad = val && filesData.some((f) => !f._new && f.file_id.toLowerCase() === val.toLowerCase());
      idInput.classList.toggle("invalid", patternBad || dupBad);
      if (dupBad) { showFilesHint(t("filesIdDuplicate").replace("{id}", val), "error"); }
      else { hideFilesHint(); }
    });

    const enCell = buildLangCell(newEntry, "en", savedEntries.length);
    const deCell = document.createElement("div");
    deCell.className = "files-file-cell";

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "files-row-del";
    delBtn.textContent = "\u00d7";
    delBtn.addEventListener("click", () => {
      filesData = filesData.filter((f) => !f._new);
      renderFiles();
    });

    row.appendChild(num);
    row.appendChild(idInput);
    row.appendChild(enCell);
    row.appendChild(deCell);
    row.appendChild(delBtn);
    filesTableBody.appendChild(row);
    visibleCount++;
  }

  updateFilesCount(visibleCount, savedEntries.length + (newEntry ? 1 : 0));
}

function updateFilesCount(filtered, total) {
  if (filesSearchQuery && filtered !== total) {
    filesCountEl.textContent = t("filesCount").replace("{filtered}", filtered).replace("{total}", total);
  } else {
    filesCountEl.textContent = t("filesCountAll").replace("{total}", total);
  }
}

function showFilesHint(msg, type) {
  filesHint.textContent = msg;
  filesHint.className = "hierarchy-hint hint-" + type;
  filesHint.hidden = false;
}
function hideFilesHint() { filesHint.hidden = true; }

filesSearchInput.addEventListener("input", () => { filesSearchQuery = filesSearchInput.value; renderFiles(); });

filesAddBtn.addEventListener("click", () => {
  if (filesData.some((f) => f._new)) return;
  filesData.push({ file_id: "", en: null, de: null, _new: true, _uploads: {} });
  filesSearchQuery = "";
  filesSearchInput.value = "";
  renderFiles();
  const idInput = document.getElementById("files-new-id");
  if (idInput) idInput.focus();
  filesTableBody.scrollTop = filesTableBody.scrollHeight;
});

// ======================= FILES EXPORT (ZIP) =======================

filesExportBtn.addEventListener("click", async () => {
  if (!filesData.length) {
    showFilesHint(t("filesExportEmpty"), "error");
    setTimeout(hideFilesHint, 3000);
    return;
  }
  try {
    const resp = await fetch(APP_BASE + "/api/connectors/" + currentConnectorId + "/files/export", { credentials: "same-origin" });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      showFilesHint(err.error || t("filesExportError"), "error");
      setTimeout(hideFilesHint, 3000);
      return;
    }
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "files_" + currentConnectorName + "_" + savedApiKey + ".zip";
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    showFilesHint(t("filesExportError"), "error");
    setTimeout(hideFilesHint, 3000);
  }
});

// ======================= FILES IMPORT (ZIP) =======================

filesImportBtn.addEventListener("click", () => {
  filesImportFile.value = "";
  filesImportFile.click();
});

filesImportFile.addEventListener("change", async () => {
  const file = filesImportFile.files[0];
  if (!file) return;

  const form = new FormData();
  form.append("zip", file);

  try {
    const resp = await fetch(APP_BASE + "/api/connectors/" + currentConnectorId + "/files/import", {
      method: "POST",
      credentials: "same-origin",
      body: form,
    });
    const result = await resp.json();
    if (!resp.ok) {
      showFilesHint(result.error || t("filesImportError"), "error");
      setTimeout(hideFilesHint, 3000);
      return;
    }
    if (result.imported === 0) {
      showFilesHint(t("filesImportEmpty"), "error");
      setTimeout(hideFilesHint, 3000);
      return;
    }
    // Reload files from server
    await loadFiles();
    showFilesHint(t("filesImported").replace("{count}", result.imported), "success");
    setTimeout(hideFilesHint, 4000);
  } catch {
    showFilesHint(t("filesImportError"), "error");
    setTimeout(hideFilesHint, 3000);
  }
});

function pickAndUpload(entry, lang) {
  const input = document.createElement("input");
  input.type = "file";
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    uploadFile(entry, lang, file);
  });
  input.click();
}

function uploadFile(entry, lang, file) {
  hideFilesHint();
  entry._uploads[lang] = { uploading: true, progress: 0 };
  renderFiles();
  filesTableBody.scrollTop = filesTableBody.scrollHeight;

  const rowIdx = filesData.indexOf(entry);
  const formData = new FormData();
  formData.append("file_id", entry.file_id);
  formData.append("lang", lang);
  formData.append("file", file);

  const xhr = new XMLHttpRequest();

  xhr.upload.addEventListener("progress", (e) => {
    if (e.lengthComputable) {
      const pct = Math.round((e.loaded / e.total) * 100);
      const fill = document.getElementById("fp-" + rowIdx + "-" + lang);
      const txt = document.getElementById("ft-" + rowIdx + "-" + lang);
      if (fill) fill.style.width = pct + "%";
      if (txt) txt.textContent = pct + "%";
      if (entry._uploads[lang]) entry._uploads[lang].progress = pct;
    }
  });

  xhr.addEventListener("load", () => {
    delete entry._uploads[lang];
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const result = JSON.parse(xhr.responseText);
        entry[lang] = { original_name: result.original_name, size: result.size, mime_type: result.mime_type };
      } catch {
        showFilesHint(t("filesUploadError"), "error");
        setTimeout(hideFilesHint, 3000);
      }
    } else {
      showFilesHint(t("filesUploadError"), "error");
      setTimeout(hideFilesHint, 3000);
    }
    renderFiles();
  });

  xhr.addEventListener("error", () => {
    delete entry._uploads[lang];
    showFilesHint(t("filesUploadError"), "error");
    setTimeout(hideFilesHint, 3000);
    renderFiles();
  });

  xhr.open("POST", connApi("/files/upload"));
  xhr.send(formData);
}

async function deleteFile(fileId) {
  const result = await apiRequest(connApi(`/files/${encodeURIComponent(fileId)}`), { method: "DELETE" });
  if (result.ok) {
    filesData = filesData.filter((f) => f.file_id !== fileId);
    renderFiles();
  } else {
    showFilesHint(result.payload?.error || t("filesDeleteError"), "error");
    setTimeout(hideFilesHint, 3000);
  }
}

async function loadFiles() {
  const result = await apiRequest(connApi("/files/internal"));
  if (result.ok && Array.isArray(result.payload)) {
    filesData = groupFilesFromApi(result.payload);
  }
  renderFiles();
}

// ======================= ASSETS =======================

const assetsListView = document.getElementById("assets-list-view");
const assetsDetailView = document.getElementById("assets-detail-view");
const assetsTableBody = document.getElementById("assets-table-body");
const assetsSearchInput = document.getElementById("assets-search");
const assetsCountEl = document.getElementById("assets-count");
const assetsAddBtn = document.getElementById("assets-add-btn");
const assetsListHint = document.getElementById("assets-list-hint");
const assetsBackBtn = document.getElementById("assets-back-btn");
const assetsHierarchyFields = document.getElementById("assets-hierarchy-fields");
const assetsPropsBody = document.getElementById("assets-props-body");
const assetsPropsSearch = document.getElementById("assets-props-search");
const assetsPropsCountEl = document.getElementById("assets-props-count");
const assetsFilesBody = document.getElementById("assets-files-body");
const assetsSaveBtn = document.getElementById("assets-save-btn");
const assetsDetailHint = document.getElementById("assets-detail-hint");

const ASSET_ID_PATTERN = /^[a-zA-Z0-9]+$/;

function showAssetsListHint(msg, type) {
  assetsListHint.textContent = msg;
  assetsListHint.className = "hierarchy-hint hint-" + type;
  assetsListHint.hidden = false;
}
function hideAssetsListHint() { assetsListHint.hidden = true; }

function showAssetsDetailHint(msg, type) {
  assetsDetailHint.textContent = msg;
  assetsDetailHint.className = "hierarchy-hint hint-" + type;
  assetsDetailHint.hidden = false;
}
function hideAssetsDetailHint() { assetsDetailHint.hidden = true; }

function updateAssetsCount(filtered, total) {
  if (assetsSearchQuery && filtered !== total) {
    assetsCountEl.textContent = t("assetsCount").replace("{filtered}", filtered).replace("{total}", total);
  } else {
    assetsCountEl.textContent = t("assetsCountAll").replace("{total}", total);
  }
}

function renderAssets() {
  assetsTableBody.innerHTML = "";
  const q = assetsSearchQuery.toLowerCase();
  const savedEntries = assetsData.filter((a) => !a._new);
  const newEntry = assetsData.find((a) => a._new);
  let visibleCount = 0;

  if (savedEntries.length === 0 && !newEntry) {
    const empty = document.createElement("div");
    empty.className = "model-empty";
    empty.textContent = t("assetsEmpty");
    assetsTableBody.appendChild(empty);
    updateAssetsCount(0, 0);
    return;
  }

  savedEntries.forEach((entry, i) => {
    const matchesSearch = !q || entry.asset_id.toLowerCase().includes(q);
    const row = document.createElement("div");
    row.className = "assets-row" + (matchesSearch ? "" : " row-hidden");
    if (matchesSearch) visibleCount++;

    const num = document.createElement("span");
    num.className = "assets-row-num";
    num.textContent = i + 1;

    const idInput = document.createElement("input");
    idInput.type = "text";
    idInput.className = "assets-id";
    idInput.value = entry.asset_id;
    idInput.disabled = true;

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "assets-row-del";
    delBtn.textContent = "\u00d7";
    delBtn.addEventListener("click", (e) => { e.stopPropagation(); deleteAsset(entry.asset_id); });

    row.addEventListener("click", () => openAssetDetail(entry.asset_id));
    row.appendChild(num);
    row.appendChild(idInput);
    row.appendChild(delBtn);
    assetsTableBody.appendChild(row);
  });

  if (newEntry) {
    const row = document.createElement("div");
    row.className = "assets-row assets-row-new";

    const num = document.createElement("span");
    num.className = "assets-row-num";
    num.textContent = savedEntries.length + 1;

    const idInput = document.createElement("input");
    idInput.type = "text";
    idInput.className = "assets-id";
    idInput.id = "assets-new-id";
    idInput.value = newEntry.asset_id;
    idInput.placeholder = "assetId";
    idInput.addEventListener("input", () => {
      newEntry.asset_id = idInput.value;
      idInput.classList.toggle("invalid", idInput.value && !ASSET_ID_PATTERN.test(idInput.value));
      hideAssetsListHint();
    });
    idInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveNewAsset(newEntry);
    });

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "assets-row-confirm";
    confirmBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
    confirmBtn.title = t("assetsSave");
    confirmBtn.addEventListener("click", () => saveNewAsset(newEntry));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "assets-row-del";
    delBtn.textContent = "\u00d7";
    delBtn.addEventListener("click", () => {
      assetsData = assetsData.filter((a) => !a._new);
      renderAssets();
    });

    row.appendChild(num);
    row.appendChild(idInput);
    row.appendChild(confirmBtn);
    row.appendChild(delBtn);
    assetsTableBody.appendChild(row);
    visibleCount++;
  }

  updateAssetsCount(visibleCount, savedEntries.length + (newEntry ? 1 : 0));
}

async function saveNewAsset(entry) {
  const assetId = (entry.asset_id || "").trim();
  if (!assetId) { showAssetsListHint(t("assetsIdRequired"), "error"); setTimeout(hideAssetsListHint, 3000); return; }
  if (!ASSET_ID_PATTERN.test(assetId)) { showAssetsListHint(t("assetsIdInvalid"), "error"); setTimeout(hideAssetsListHint, 3000); return; }
  const dup = assetsData.some((a) => !a._new && a.asset_id.toLowerCase() === assetId.toLowerCase());
  if (dup) { showAssetsListHint(t("assetsIdDuplicate").replace("{id}", assetId), "error"); setTimeout(hideAssetsListHint, 3000); return; }

  const result = await apiRequest(connApi("/assets"), { method: "POST", body: { asset_id: assetId } });
  if (result.ok) {
    assetsData = assetsData.filter((a) => !a._new);
    assetsData.push({ asset_id: result.payload.asset_id });
    assetsData.sort((a, b) => a.asset_id.localeCompare(b.asset_id));
    renderAssets();
  } else {
    showAssetsListHint(result.payload?.error || t("assetsCreateError"), "error");
    setTimeout(hideAssetsListHint, 3000);
  }
}

async function deleteAsset(assetId) {
  const result = await apiRequest(connApi(`/assets/${encodeURIComponent(assetId)}`), { method: "DELETE" });
  if (result.ok) {
    assetsData = assetsData.filter((a) => a.asset_id !== assetId);
    renderAssets();
  } else {
    showAssetsListHint(result.payload?.error || t("assetsDeleteError"), "error");
    setTimeout(hideAssetsListHint, 3000);
  }
}

async function loadAssets() {
  const result = await apiRequest(connApi("/assets/internal"));
  if (result.ok && Array.isArray(result.payload)) {
    assetsData = result.payload.map((r) => ({ asset_id: r.asset_id }));
  }
  renderAssets();
}

assetsSearchInput.addEventListener("input", () => { assetsSearchQuery = assetsSearchInput.value; renderAssets(); });

assetsAddBtn.addEventListener("click", () => {
  if (assetsData.some((a) => a._new)) return;
  assetsData.push({ asset_id: "", _new: true });
  assetsSearchQuery = "";
  assetsSearchInput.value = "";
  renderAssets();
  const idInput = document.getElementById("assets-new-id");
  if (idInput) idInput.focus();
  assetsTableBody.scrollTop = assetsTableBody.scrollHeight;
});

// ======================= ASSETS EXPORT =======================

const assetsExportBtn = document.getElementById("assets-export-btn");
const assetsImportBtn = document.getElementById("assets-import-btn");
const assetsImportFile = document.getElementById("assets-import-file");

assetsExportBtn.addEventListener("click", async () => {
  if (!assetsData.filter(a => !a._new).length) {
    showAssetsListHint(t("assetsExportEmpty"), "error");
    setTimeout(hideAssetsListHint, 3000);
    return;
  }
  try {
    const result = await apiRequest(connApi("/assets/export"));
    if (!result.ok) {
      showAssetsListHint(result.payload?.error || t("assetsExportError"), "error");
      setTimeout(hideAssetsListHint, 3000);
      return;
    }
    const data = result.payload;
    const hLevels = data.hierarchy_levels || [];
    const dps = data.datapoints || [];
    const assets = data.assets || [];

    // Build column headers:
    // - Item ID
    // - Hierarchy levels: single column (only EN, no language distinction)
    // - Prop datapoints: two columns with (EN) / (DE) suffix
    // - File datapoints: single column (just file_id reference)
    const rows = [];
    for (const asset of assets) {
      const row = { "Item ID": asset.asset_id };
      const vals = asset.values || {};

      for (const levelName of hLevels) {
        const lv = vals[levelName] || {};
        row[levelName] = lv.en || "";
      }

      for (const dp of dps) {
        const dv = vals[dp.id] || {};
        if (dp.type === 1) {
          row[dp.id] = dv.en || "";
        } else {
          row[dp.id + " (EN)"] = dv.en || "";
          row[dp.id + " (DE)"] = dv.de || "";
        }
      }
      rows.push(row);
    }

    // Open shared export dialog
    exportNameInput.value = "assets_" + currentConnectorName + "_" + savedApiKey;
    exportDialog.querySelector('input[value="xlsx"]').checked = true;
    exportDialog.dataset.source = "assets";
    exportDialog.dataset.assetsRows = JSON.stringify(rows);
    exportDialog.showModal();
  } catch {
    showAssetsListHint(t("assetsExportError"), "error");
    setTimeout(hideAssetsListHint, 3000);
  }
});

// ======================= ASSETS IMPORT =======================

assetsImportBtn.addEventListener("click", () => {
  assetsImportFile.value = "";
  assetsImportFile.click();
});

assetsImportFile.addEventListener("change", async () => {
  const file = assetsImportFile.files[0];
  if (!file) return;

  try {
    let rows;
    if (file.name.toLowerCase().endsWith(".csv")) {
      let text = await file.text();
      if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
      const sep = text.indexOf(";") < text.indexOf("\n") && text.includes(";") ? ";" : ",";
      const wb = XLSX.read(text, { type: "string", FS: sep });
      rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    } else {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    }

    if (!rows.length) {
      showAssetsListHint(t("assetsImportEmpty"), "error");
      setTimeout(hideAssetsListHint, 3000);
      return;
    }

    // Parse rows into import format
    // Detect column structure: "Item ID" column + other columns with optional " (EN)"/" (DE)" suffix
    const importAssets = [];
    for (const row of rows) {
      const assetId = String(row["Item ID"] || row["item_id"] || row["ItemID"] || row["asset_id"] || "").trim();
      if (!assetId || !ASSET_ID_PATTERN.test(assetId)) continue;

      const values = {};
      for (const [col, val] of Object.entries(row)) {
        if (col === "Item ID" || col === "item_id" || col === "ItemID" || col === "asset_id") continue;
        const strVal = String(val || "").trim();
        if (!strVal) continue;

        // Check for " (EN)" or " (DE)" suffix
        const matchLang = col.match(/^(.+?)\s*\((EN|DE)\)$/i);
        if (matchLang) {
          const key = matchLang[1].trim();
          const lang = matchLang[2].toLowerCase();
          if (!values[key]) values[key] = {};
          values[key][lang] = strVal;
        } else {
          // No language suffix — set as EN
          if (!values[col]) values[col] = {};
          values[col].en = strVal;
        }
      }

      importAssets.push({ asset_id: assetId, values });
    }

    if (!importAssets.length) {
      showAssetsListHint(t("assetsImportEmpty"), "error");
      setTimeout(hideAssetsListHint, 3000);
      return;
    }

    // Send to server
    const result = await apiRequest(connApi("/assets/import"), {
      method: "POST",
      body: { assets: importAssets },
    });

    if (!result.ok) {
      showAssetsListHint(result.payload?.error || t("assetsImportError"), "error");
      setTimeout(hideAssetsListHint, 3000);
      return;
    }

    await loadAssets();
    showAssetsListHint(
      t("assetsImported").replace("{count}", result.payload.imported).replace("{skipped}", result.payload.skipped),
      "success"
    );
    setTimeout(hideAssetsListHint, 4000);
  } catch {
    showAssetsListHint(t("assetsImportError"), "error");
    setTimeout(hideAssetsListHint, 3000);
  }
});

// -- Assets detail --

function showAssetsListView() {
  assetsListView.style.display = "";
  assetsDetailView.style.display = "none";
  currentAssetId = null;
  currentAssetValues = {};
  assetsPropsSearchQuery = "";
}

function showAssetsDetailView() {
  assetsListView.style.display = "none";
  assetsDetailView.style.display = "";
}

const assetsDetailIdInput = document.getElementById("assets-detail-id");

async function openAssetDetail(assetId) {
  currentAssetId = assetId;
  currentAssetValues = {};
  assetsPropsSearchQuery = "";
  assetsPropsSearch.value = "";
  assetsDetailIdInput.value = assetId;
  hideAssetsDetailHint();

  const result = await apiRequest(connApi(`/assets/${encodeURIComponent(assetId)}/values`));
  if (result.ok && result.payload) {
    for (const { key, lang, value } of result.payload.values) {
      if (!currentAssetValues[key]) currentAssetValues[key] = {};
      currentAssetValues[key][lang || "en"] = value;
    }
  }

  renderAssetDetail();
  showAssetsDetailView();
}

function buildFieldLabel(id, name) {
  const label = document.createElement("span");
  label.className = "assets-field-label";
  const textSpan = document.createElement("span");
  textSpan.className = "assets-field-label-text";
  textSpan.textContent = id;
  label.appendChild(textSpan);
  if (name && name !== id) {
    const info = document.createElement("span");
    info.className = "assets-field-info";
    info.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    info.addEventListener("mouseenter", (e) => {
      let tip = document.getElementById("field-tooltip");
      if (!tip) {
        tip = document.createElement("div");
        tip.id = "field-tooltip";
        document.body.appendChild(tip);
      }
      tip.textContent = name;
      const rect = e.currentTarget.getBoundingClientRect();
      tip.style.left = rect.left + rect.width / 2 + "px";
      tip.style.top = rect.bottom + 6 + "px";
      tip.style.display = "block";
    });
    info.addEventListener("mouseleave", () => {
      const tip = document.getElementById("field-tooltip");
      if (tip) tip.style.display = "none";
    });
    label.appendChild(info);
  }
  return label;
}

function renderAssetDetail() {
  assetsHierarchyFields.innerHTML = "";
  const hierarchySection = document.getElementById("assets-hierarchy-section");
  if (hierarchyLevels.length === 0 || (hierarchyLevels.length === 1 && !hierarchyLevels[0].name)) {
    hierarchySection.style.display = "none";
  } else {
    hierarchySection.style.display = "";
    hierarchyLevels.forEach((level) => {
      if (!level.name) return;
      const row = document.createElement("div");
      row.className = "assets-field-row";
      const label = buildFieldLabel(level.name, "");
      if (!currentAssetValues[level.name]) currentAssetValues[level.name] = {};
      const input = document.createElement("input");
      input.type = "text";
      input.className = "assets-field-input";
      input.value = currentAssetValues[level.name].en || "";
      input.placeholder = level.name;
      input.addEventListener("input", () => {
        if (!currentAssetValues[level.name]) currentAssetValues[level.name] = {};
        currentAssetValues[level.name].en = input.value;
      });
      row.appendChild(label);
      row.appendChild(input);
      assetsHierarchyFields.appendChild(row);
    });
  }

  assetsPropsBody.innerHTML = "";
  const propsSection = document.getElementById("assets-props-section");
  const propDps = modelDatapoints.filter((dp) => dp.type === 0);
  if (propDps.length === 0) {
    propsSection.style.display = "none";
  } else {
    propsSection.style.display = "";
    const q = assetsPropsSearchQuery.toLowerCase();
    let visibleCount = 0;

    propDps.forEach((dp, i) => {
      const matchesSearch = !q || dp.id.toLowerCase().includes(q) || (dp.name || "").toLowerCase().includes(q);
      const row = document.createElement("div");
      row.className = "assets-props-row" + (matchesSearch ? "" : " row-hidden");
      if (matchesSearch) visibleCount++;

      const num = document.createElement("span");
      num.className = "model-row-num";
      num.textContent = i + 1;
      const label = buildFieldLabel(dp.id, dp.name);
      if (!currentAssetValues[dp.id]) currentAssetValues[dp.id] = {};

      const enInput = document.createElement("input");
      enInput.type = "text";
      enInput.value = currentAssetValues[dp.id].en || "";
      enInput.placeholder = "EN";
      enInput.addEventListener("input", () => {
        if (!currentAssetValues[dp.id]) currentAssetValues[dp.id] = {};
        currentAssetValues[dp.id].en = enInput.value;
      });

      const deInput = document.createElement("input");
      deInput.type = "text";
      deInput.value = currentAssetValues[dp.id].de || "";
      deInput.placeholder = "DE";
      deInput.addEventListener("input", () => {
        if (!currentAssetValues[dp.id]) currentAssetValues[dp.id] = {};
        currentAssetValues[dp.id].de = deInput.value;
      });

      row.appendChild(num);
      row.appendChild(label);
      row.appendChild(enInput);
      row.appendChild(deInput);
      assetsPropsBody.appendChild(row);
    });

    updateAssetsPropsCount(visibleCount, propDps.length);
  }

  assetsFilesBody.innerHTML = "";
  const filesSection = document.getElementById("assets-files-section");
  const fileDps = modelDatapoints.filter((dp) => dp.type === 1);
  if (fileDps.length === 0) {
    filesSection.style.display = "none";
  } else {
    filesSection.style.display = "";
    const fileIds = filesData.filter((f) => !f._new).map((f) => f.file_id).sort();
    fileDps.forEach((dp, i) => {
      const row = document.createElement("div");
      row.className = "assets-files-row";
      const num = document.createElement("span");
      num.className = "model-row-num";
      num.textContent = i + 1;
      const label = buildFieldLabel(dp.id, dp.name);
      if (!currentAssetValues[dp.id]) currentAssetValues[dp.id] = {};

      const select = document.createElement("select");
      const emptyOpt = document.createElement("option");
      emptyOpt.value = "";
      emptyOpt.textContent = t("assetsFileNone");
      select.appendChild(emptyOpt);
      fileIds.forEach((fileId) => {
        const opt = document.createElement("option");
        opt.value = fileId;
        opt.textContent = fileId;
        if ((currentAssetValues[dp.id].en || "") === fileId) opt.selected = true;
        select.appendChild(opt);
      });
      select.addEventListener("change", () => {
        if (!currentAssetValues[dp.id]) currentAssetValues[dp.id] = {};
        currentAssetValues[dp.id].en = select.value;
      });

      row.appendChild(num);
      row.appendChild(label);
      row.appendChild(select);
      assetsFilesBody.appendChild(row);
    });
  }
}

function updateAssetsPropsCount(filtered, total) {
  if (assetsPropsSearchQuery && filtered !== total) {
    assetsPropsCountEl.textContent = t("assetsPropsCount").replace("{filtered}", filtered).replace("{total}", total);
  } else {
    assetsPropsCountEl.textContent = t("assetsPropsCountAll").replace("{total}", total);
  }
}

async function saveAssetValues() {
  assetsSaveBtn.disabled = true;
  const newId = assetsDetailIdInput.value.trim();
  if (!newId) { showAssetsDetailHint(t("assetsIdRequired"), "error"); assetsSaveBtn.disabled = false; return; }
  if (!ASSET_ID_PATTERN.test(newId)) { showAssetsDetailHint(t("assetsIdInvalid"), "error"); assetsSaveBtn.disabled = false; return; }

  if (newId !== currentAssetId) {
    const renameResult = await apiRequest(
      connApi(`/assets/${encodeURIComponent(currentAssetId)}/rename`),
      { method: "PUT", body: { asset_id: newId } }
    );
    if (!renameResult.ok) {
      showAssetsDetailHint(renameResult.payload?.error || t("assetsError"), "error");
      assetsSaveBtn.disabled = false;
      return;
    }
    const oldId = currentAssetId;
    currentAssetId = newId;
    const entry = assetsData.find((a) => a.asset_id === oldId);
    if (entry) entry.asset_id = newId;
  }

  const payload = [];
  for (const [key, langs] of Object.entries(currentAssetValues)) {
    if (langs.en !== undefined && langs.en !== "") payload.push({ key, lang: "en", value: langs.en });
    if (langs.de !== undefined && langs.de !== "") payload.push({ key, lang: "de", value: langs.de });
  }
  const result = await apiRequest(
    connApi(`/assets/${encodeURIComponent(currentAssetId)}/values`),
    { method: "PUT", body: payload }
  );
  assetsSaveBtn.disabled = false;
  if (result.ok) {
    currentAssetValues = {};
    for (const { key, lang, value } of result.payload.values) {
      if (!currentAssetValues[key]) currentAssetValues[key] = {};
      currentAssetValues[key][lang || "en"] = value;
    }
    renderAssetDetail();
    showAssetsDetailHint(t("assetsSaved"), "success");
    setTimeout(hideAssetsDetailHint, 3000);
  } else {
    showAssetsDetailHint(result.payload?.error || t("assetsError"), "error");
  }
}

assetsSaveBtn.addEventListener("click", () => {
  confirmTitle.textContent = t("assetsConfirmTitle");
  confirmMessage.textContent = t("assetsConfirmMessage");
  confirmOkBtn.textContent = t("confirmOk");
  confirmCancelBtn.textContent = t("confirmCancel");
  pendingConfirmAction = "assets";
  confirmModal.showModal();
});

assetsBackBtn.addEventListener("click", showAssetsListView);

assetsPropsSearch.addEventListener("input", () => {
  assetsPropsSearchQuery = assetsPropsSearch.value;
  renderAssetDetail();
});

// ======================= USER MENU =======================

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
  await apiRequest("/auth/logout", { method: "POST" });
  window.location.href = "/";
});

// ======================= INIT =======================

async function init() {
  const userResult = await apiRequest("/api/me");
  if (userResult.ok && userResult.payload) {
    currentUser = userResult.payload;
    userInitials.textContent = getInitials(currentUser.name);
    if (userInfo) userInfo.textContent = currentUser.name || currentUser.email || "";
  }

  setLocale(locale);
  await handleInviteFromUrl();
  await loadConnectors();

  // Deep-link: ?connector=<id> → jump straight into that connector
  const urlConn = new URLSearchParams(window.location.search).get("connector");
  if (urlConn) {
    const match = connectors.find((c) => c.connector_id === urlConn);
    if (match) {
      await enterConnector(match.connector_id, match.name, match.role);
    }
  }
}

init();
