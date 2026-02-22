/* =====================================================================
   Knowledge Base – Frontend Logic
   ===================================================================== */

// ---------------------------------------------------------------------------
// i18n
// ---------------------------------------------------------------------------
const I18N = {
  de: {
    brandText: "Wissensdatenbank",
    listTitle: "Dokumente",
    searchPlaceholder: "Dokumente suchen\u2026",
    uploadBtn: "Hochladen",
    emptyText: "Noch keine Dokumente hochgeladen.",
    emptyHint: "Tippe auf den Button unten, um ein Dokument hochzuladen.",
    noResults: "Keine Dokumente gefunden.",
    pageInfo: "Seite {page} von {total}",
    editTitle: "Dokument bearbeiten",
    lblTitle: "Titel",
    lblDesc: "Beschreibung",
    generateDesc: "KI-Beschreibung",
    generating: "Generiere\u2026",
    lblFilename: "Datei: ",
    lblFilesize: "Gr\u00f6\u00dfe: ",
    lblFiletype: "Typ: ",
    lblFiledate: "Datum: ",
    textSectionLabel: "Extrahierter Text",
    save: "Speichern",
    delete: "L\u00f6schen",
    saved: "Gespeichert",
    deleted: "Gel\u00f6scht",
    uploaded: "Hochgeladen",
    confirmDelete: "Dokument wirklich l\u00f6schen?",
    confirmCancel: "Abbrechen",
    confirmOk: "L\u00f6schen",
    settingsTitle: "Einstellungen",
    settingsDesc: "Instruktionen f\u00fcr die Wissensdatenbank als MCP-Ressource.",
    lblBasePrompt: "MCP Base-Prompt",
    resetPrompt: "Zur\u00fccksetzen",
    settingsCancel: "Abbrechen",
    settingsSave: "Speichern",
    settingsSaved: "Einstellungen gespeichert",
    noApiKey: "Bitte zuerst API-Key in AAS Chat Einstellungen hinterlegen.",
    noText: "Kein extrahierter Text vorhanden.",
    generateFailed: "Beschreibung konnte nicht generiert werden.",
    uploadFailed: "Fehler beim Hochladen.",
    logout: "Logout",
  },
  en: {
    brandText: "Knowledge Base",
    listTitle: "Documents",
    searchPlaceholder: "Search documents\u2026",
    uploadBtn: "Upload",
    emptyText: "No documents uploaded yet.",
    emptyHint: "Tap the button below to upload a document.",
    noResults: "No documents found.",
    pageInfo: "Page {page} of {total}",
    editTitle: "Edit Document",
    lblTitle: "Title",
    lblDesc: "Description",
    generateDesc: "AI Description",
    generating: "Generating\u2026",
    lblFilename: "File: ",
    lblFilesize: "Size: ",
    lblFiletype: "Type: ",
    lblFiledate: "Date: ",
    textSectionLabel: "Extracted Text",
    save: "Save",
    delete: "Delete",
    saved: "Saved",
    deleted: "Deleted",
    uploaded: "Uploaded",
    confirmDelete: "Really delete this document?",
    confirmCancel: "Cancel",
    confirmOk: "Delete",
    settingsTitle: "Settings",
    settingsDesc: "Instructions for the knowledge base as MCP resource.",
    lblBasePrompt: "MCP Base Prompt",
    resetPrompt: "Reset",
    settingsCancel: "Cancel",
    settingsSave: "Save",
    settingsSaved: "Settings saved",
    noApiKey: "Please configure an API key in AAS Chat settings first.",
    noText: "No extracted text available.",
    generateFailed: "Could not generate description.",
    uploadFailed: "Upload failed.",
    logout: "Logout",
  },
};

let locale = localStorage.getItem("kanban-locale") || "de";
function t(key) {
  return (I18N[locale] && I18N[locale][key]) || (I18N.de && I18N.de[key]) || key;
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let documents = [];
let editingDoc = null;
let currentPage = 1;
const PAGE_SIZE = 20;
let searchQuery = "";
let defaultBasePrompt = "";

// ---------------------------------------------------------------------------
// DOM
// ---------------------------------------------------------------------------
const listView = document.getElementById("list-view");
const editView = document.getElementById("edit-view");
const docGrid = document.getElementById("doc-grid");
const emptyState = document.getElementById("empty-state");
const docCount = document.getElementById("doc-count");
const searchInput = document.getElementById("search-input");
const searchClear = document.getElementById("search-clear");
const pagination = document.getElementById("pagination");
const pagePrev = document.getElementById("page-prev");
const pageNext = document.getElementById("page-next");
const pageInfo = document.getElementById("page-info");
const uploadBtn = document.getElementById("upload-btn");
const fileInput = document.getElementById("file-input");
const uploadOverlay = document.getElementById("upload-overlay");
const docForm = document.getElementById("doc-form");
const editBackBtn = document.getElementById("edit-back-btn");
const deleteBtn = document.getElementById("delete-btn");
const generateDescBtn = document.getElementById("generate-desc-btn");
const confirmDialog = document.getElementById("confirm-dialog");
const confirmCancel = document.getElementById("confirm-cancel");
const confirmOk = document.getElementById("confirm-ok");
const settingsBtn = document.getElementById("settings-btn");
const settingsDialog = document.getElementById("settings-dialog");
const settingsPrompt = document.getElementById("settings-prompt");
const settingsReset = document.getElementById("settings-reset");
const settingsCancel = document.getElementById("settings-cancel");
const settingsSave = document.getElementById("settings-save");
const userMenuToggle = document.getElementById("user-menu-toggle");
const userMenu = document.getElementById("user-menu");
const userInitials = document.getElementById("user-initials");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");
const localeDeBtn = document.getElementById("locale-de-btn");
const localeEnBtn = document.getElementById("locale-en-btn");

// ---------------------------------------------------------------------------
// API helper
// ---------------------------------------------------------------------------
async function api(path, options = {}) {
  const { method = "GET", body, isFormData } = options;
  try {
    const headers = isFormData ? {} : { "Content-Type": "application/json" };
    const res = await fetch("/apps/knowledge-base" + path, {
      method,
      headers,
      body: isFormData ? body : (body === undefined ? undefined : JSON.stringify(body)),
    });
    if (res.status === 401) { window.location.href = "/"; return { ok: false }; }
    const payload = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, payload };
  } catch (err) {
    return { ok: false, error: err };
  }
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
const kbToast = document.getElementById("kb-toast");
let toastTimer = null;
function showToast(msg) {
  kbToast.textContent = msg;
  kbToast.hidden = false;
  requestAnimationFrame(() => kbToast.classList.add("visible"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    kbToast.classList.remove("visible");
    setTimeout(() => { kbToast.hidden = true; }, 300);
  }, 2500);
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------
function showView(view) {
  listView.classList.remove("active");
  editView.classList.remove("active");
  view.classList.add("active");
}

// ---------------------------------------------------------------------------
// File type helpers
// ---------------------------------------------------------------------------
function getFileExt(name) {
  return (name || "").split(".").pop().toLowerCase();
}

function getFileIcon(ext) {
  if (ext === "pdf") return '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
  if (["xlsx", "xls", "csv"].includes(ext)) return '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><rect x="8" y="12" width="8" height="6" rx="1"/></svg>';
  if (ext === "docx" || ext === "doc") return '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>';
  return '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
}

function formatSize(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// ---------------------------------------------------------------------------
// Render documents
// ---------------------------------------------------------------------------
function getFilteredDocs() {
  if (!searchQuery) return documents;
  const q = searchQuery.toLowerCase();
  return documents.filter(d =>
    (d.title || "").toLowerCase().includes(q) ||
    (d.description || "").toLowerCase().includes(q)
  );
}

function renderDocuments() {
  docGrid.innerHTML = "";
  const filtered = getFilteredDocs();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageDocs = filtered.slice(start, start + PAGE_SIZE);

  // Count
  if (searchQuery && filtered.length !== documents.length) {
    docCount.textContent = documents.length ? `(${filtered.length}/${documents.length})` : "";
  } else {
    docCount.textContent = documents.length ? `(${documents.length})` : "";
  }

  // Empty state
  if (documents.length === 0) {
    emptyState.hidden = false;
    document.getElementById("empty-text").textContent = t("emptyText");
    document.getElementById("empty-hint").textContent = t("emptyHint");
    document.getElementById("empty-hint").hidden = false;
  } else if (filtered.length === 0) {
    emptyState.hidden = false;
    document.getElementById("empty-text").textContent = t("noResults");
    document.getElementById("empty-hint").hidden = true;
  } else {
    emptyState.hidden = true;
  }

  // Pagination
  if (totalPages > 1) {
    pagination.hidden = false;
    pagePrev.disabled = currentPage <= 1;
    pageNext.disabled = currentPage >= totalPages;
    pageInfo.textContent = t("pageInfo").replace("{page}", currentPage).replace("{total}", totalPages);
  } else {
    pagination.hidden = true;
  }

  for (const doc of pageDocs) {
    const ext = getFileExt(doc.original_name);
    const el = document.createElement("div");
    el.className = "doc-card";
    el.dataset.id = doc.doc_id;

    el.innerHTML = `
      <div class="doc-card-icon">${getFileIcon(ext)}</div>
      <div class="doc-card-body">
        <h3 class="doc-card-title">${esc(doc.title || doc.original_name || "\u2014")}</h3>
        ${doc.description ? `<p class="doc-card-desc">${esc(doc.description)}</p>` : ""}
        <div class="doc-card-meta">
          <span>${ext.toUpperCase()}</span>
          <span>${formatSize(doc.file_size)}</span>
          <span>${formatDate(doc.updated_at || doc.created_at)}</span>
        </div>
      </div>
      <button class="doc-card-delete" type="button" title="${esc(t("delete"))}">
        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    `;

    // Delete button
    el.querySelector(".doc-card-delete").addEventListener("click", (e) => {
      e.stopPropagation();
      editingDoc = doc;
      confirmDialog.showModal();
    });

    // Card click → edit
    el.addEventListener("click", () => openEdit(doc.doc_id));
    docGrid.appendChild(el);
  }
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------
uploadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  fileInput.value = "";

  uploadOverlay.hidden = false;
  const formData = new FormData();
  formData.append("file", file);

  const res = await api("/api/documents", { method: "POST", body: formData, isFormData: true });
  uploadOverlay.hidden = true;

  if (res.ok && res.payload) {
    await loadDocuments();
    currentPage = 1;
    renderDocuments();
    showToast(t("uploaded"));
    openEdit(res.payload.doc_id);
  } else {
    showToast(t("uploadFailed"));
  }
});

// ---------------------------------------------------------------------------
// Edit view
// ---------------------------------------------------------------------------
async function openEdit(docId) {
  const doc = documents.find(d => d.doc_id === docId);
  if (!doc) return;
  editingDoc = doc;

  document.getElementById("f-title").value = doc.title || "";
  document.getElementById("f-desc").value = doc.description || "";
  document.getElementById("info-filename").textContent = doc.original_name || "";
  document.getElementById("info-filesize").textContent = formatSize(doc.file_size);
  document.getElementById("info-filetype").textContent = doc.mime_type || "";
  document.getElementById("info-filedate").textContent = formatDate(doc.updated_at || doc.created_at);

  // Load extracted text
  const textPreview = document.getElementById("text-preview");
  textPreview.textContent = "";
  const contentRes = await api("/api/documents/" + docId + "/content");
  if (contentRes.ok && contentRes.payload?.content_text) {
    textPreview.textContent = contentRes.payload.content_text;
    document.getElementById("text-section").hidden = false;
  } else {
    document.getElementById("text-section").hidden = true;
  }

  showView(editView);
}

// Save
docForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!editingDoc) return;
  const title = document.getElementById("f-title").value.trim();
  const description = document.getElementById("f-desc").value.trim();
  const res = await api("/api/documents/" + editingDoc.doc_id, { method: "PUT", body: { title, description } });
  if (res.ok) {
    editingDoc.title = title;
    editingDoc.description = description;
    renderDocuments();
    showToast(t("saved"));
    showView(listView);
  }
});

// Delete
deleteBtn.addEventListener("click", () => confirmDialog.showModal());
confirmCancel.addEventListener("click", () => confirmDialog.close());
confirmOk.addEventListener("click", async () => {
  confirmDialog.close();
  if (!editingDoc) return;
  const res = await api("/api/documents/" + editingDoc.doc_id, { method: "DELETE" });
  if (res.ok) {
    documents = documents.filter(d => d.doc_id !== editingDoc.doc_id);
    editingDoc = null;
    renderDocuments();
    showToast(t("deleted"));
    showView(listView);
  }
});

// Back
editBackBtn.addEventListener("click", () => showView(listView));

// Generate description
generateDescBtn.addEventListener("click", async () => {
  if (!editingDoc) return;
  generateDescBtn.disabled = true;
  const origText = generateDescBtn.textContent;
  generateDescBtn.textContent = t("generating");

  const res = await api("/api/documents/" + editingDoc.doc_id + "/generate-description", { method: "POST" });
  generateDescBtn.disabled = false;
  generateDescBtn.textContent = origText;

  if (res.ok && res.payload?.description) {
    document.getElementById("f-desc").value = res.payload.description;
  } else if (res.payload?.error === "NO_API_KEY") {
    showToast(t("noApiKey"));
  } else if (res.payload?.error === "NO_TEXT") {
    showToast(t("noText"));
  } else {
    showToast(t("generateFailed"));
  }
});

// ---------------------------------------------------------------------------
// Search + Pagination
// ---------------------------------------------------------------------------
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim();
  searchClear.hidden = !searchQuery;
  currentPage = 1;
  renderDocuments();
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchQuery = "";
  searchClear.hidden = true;
  currentPage = 1;
  renderDocuments();
});

pagePrev.addEventListener("click", () => {
  if (currentPage > 1) { currentPage--; renderDocuments(); listView.scrollTo({ top: 0, behavior: "smooth" }); }
});

pageNext.addEventListener("click", () => {
  const filtered = getFilteredDocs();
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  if (currentPage < totalPages) { currentPage++; renderDocuments(); listView.scrollTo({ top: 0, behavior: "smooth" }); }
});

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
settingsBtn.addEventListener("click", async () => {
  const res = await api("/api/settings");
  if (res.ok && res.payload) {
    settingsPrompt.value = res.payload.base_prompt || "";
    settingsPrompt.placeholder = res.payload.default_base_prompt || "";
    defaultBasePrompt = res.payload.default_base_prompt || "";
  }
  settingsDialog.showModal();
});

settingsReset.addEventListener("click", () => { settingsPrompt.value = ""; });
settingsCancel.addEventListener("click", () => settingsDialog.close());
settingsSave.addEventListener("click", async () => {
  await api("/api/settings", { method: "PUT", body: { base_prompt: settingsPrompt.value.trim() } });
  settingsDialog.close();
  showToast(t("settingsSaved"));
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
  document.getElementById("brand-text").textContent = t("brandText");
  document.getElementById("list-title").textContent = t("listTitle");
  document.getElementById("empty-text").textContent = t("emptyText");
  document.getElementById("empty-hint").textContent = t("emptyHint");
  document.getElementById("upload-btn-label").textContent = t("uploadBtn");
  document.getElementById("edit-title").textContent = t("editTitle");
  document.getElementById("lbl-title").textContent = t("lblTitle");
  document.getElementById("lbl-desc").textContent = t("lblDesc");
  generateDescBtn.textContent = t("generateDesc");
  document.getElementById("lbl-filename").textContent = t("lblFilename");
  document.getElementById("lbl-filesize").textContent = t("lblFilesize");
  document.getElementById("lbl-filetype").textContent = t("lblFiletype");
  document.getElementById("lbl-filedate").textContent = t("lblFiledate");
  document.getElementById("text-section-label").textContent = t("textSectionLabel");
  document.getElementById("save-btn").textContent = t("save");
  document.getElementById("delete-btn").textContent = t("delete");
  document.getElementById("confirm-text").textContent = t("confirmDelete");
  document.getElementById("confirm-cancel").textContent = t("confirmCancel");
  document.getElementById("confirm-ok").textContent = t("confirmOk");
  document.getElementById("settings-title").textContent = t("settingsTitle");
  document.getElementById("settings-desc").textContent = t("settingsDesc");
  document.getElementById("lbl-base-prompt").textContent = t("lblBasePrompt");
  document.getElementById("settings-reset").textContent = t("resetPrompt");
  document.getElementById("settings-cancel").textContent = t("settingsCancel");
  document.getElementById("settings-save").textContent = t("settingsSave");
  searchInput.placeholder = t("searchPlaceholder");
  logoutBtn.textContent = t("logout");
  renderDocuments();
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
// Load documents
// ---------------------------------------------------------------------------
async function loadDocuments() {
  const res = await api("/api/documents");
  if (res.ok && res.payload?.documents) {
    documents = res.payload.documents;
  }
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
async function init() {
  const meRes = await fetch("/api/me").then(r => r.json()).catch(() => null);
  if (meRes) {
    const initials = meRes.name
      ? meRes.name.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join("").toUpperCase()
      : "?";
    userInitials.textContent = initials;
    userInfo.textContent = meRes.name || meRes.email || "";
  }

  setLocale(locale);
  await loadDocuments();
  renderDocuments();
}

init();
