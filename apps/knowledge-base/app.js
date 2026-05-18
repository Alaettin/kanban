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
    lblTags: "Tags",
    tagsPlaceholder: "Noch keine Tags. Vorschlag w\u00e4hlen oder eigenen Tag eingeben.",
    tagSuggestPlaceholder: "Vorschlag w\u00e4hlen\u2026",
    tagCustomPlaceholder: "Eigener Tag",
    generateDesc: "KI-Beschreibung",
    generateDescTitle: "Generiert Beschreibung und Tag-Vorschl\u00e4ge",
    aiTagsAdded: "{n} Tag(s) erg\u00e4nzt",
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
    settingsTestTitle: "Demo-Daten",
    settingsTestDesc: "Legt 10 Test-Kontaktpersonen für die Resilienz-Demo an (mit Präfix \"Test: \"). Vorhandene Test-Einträge werden nicht doppelt erstellt.",
    seedContactsBtn: "10 Test-Kontakte anlegen",
    seedDone: "{c} angelegt, {s} bereits vorhanden",
    seedFailed: "Test-Kontakte konnten nicht angelegt werden.",
    settingsFillDesc: "Sucht alle Dokumente ohne Beschreibung oder Tags und ergänzt fehlende Felder per KI. Bestehende Beschreibungen und Tags bleiben unverändert.",
    fillMetaBtn: "Fehlende Meta-Daten ergänzen",
    filling: "Ergänze… (kann dauern)",
    fillDone: "{p} bearbeitet · {d} Beschreibungen · {tg} Tag-Sätze · {s} übersprungen",
    fillFailed: "Meta-Daten konnten nicht ergänzt werden.",
    noApiKey: "Bitte zuerst API-Key in AAS Chat Einstellungen hinterlegen.",
    noText: "Kein extrahierter Text vorhanden.",
    generateFailed: "Beschreibung konnte nicht generiert werden.",
    uploadFailed: "Fehler beim Hochladen.",
    logout: "Logout",
    tabDocuments: "Dokumente",
    tabContacts: "Kontaktpersonen",
    contactsTitle: "Kontaktpersonen",
    contactsHint: "Hinterlege Ansprechpersonen (Betriebsrat, BEM, Betriebsarzt, SBV, \u2026), die der Chatbot im Resilienz-Modus passend vorschlagen kann.",
    contactsEmpty: "Noch keine Kontakte hinterlegt.",
    contactAdd: "Neuer Kontakt",
    contactDialogTitle: "Kontaktperson",
    contactDialogDesc: "Pflege Name und Erreichbarkeit. Tags steuern, in welchen Rollen-Antworten dieser Kontakt erscheint.",
    lblCFunction: "Funktion",
    lblCName: "Name",
    lblCEmail: "E-Mail",
    lblCPhone: "Telefon",
    lblCNote: "Notiz",
    lblCRoles: "Rollen (Sichtbarkeit)",
    contactSaved: "Kontakt gespeichert",
    contactDeleted: "Kontakt gel\u00f6scht",
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
    lblTags: "Tags",
    tagsPlaceholder: "No tags yet. Pick a suggestion or type a custom tag.",
    tagSuggestPlaceholder: "Pick a suggestion\u2026",
    tagCustomPlaceholder: "Custom tag",
    generateDesc: "AI Description",
    generateDescTitle: "Generates description and tag suggestions",
    aiTagsAdded: "{n} tag(s) added",
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
    settingsTestTitle: "Demo data",
    settingsTestDesc: "Creates 10 test contacts for the resilience demo (prefixed with \"Test: \"). Existing test entries are not duplicated.",
    seedContactsBtn: "Create 10 test contacts",
    seedDone: "{c} created, {s} already present",
    seedFailed: "Could not create test contacts.",
    settingsFillDesc: "Scans all documents without a description or tags and fills missing fields via AI. Existing descriptions and tags are preserved.",
    fillMetaBtn: "Fill missing metadata",
    filling: "Filling… (may take a while)",
    fillDone: "{p} updated · {d} descriptions · {tg} tag sets · {s} skipped",
    fillFailed: "Could not fill metadata.",
    noApiKey: "Please configure an API key in AAS Chat settings first.",
    noText: "No extracted text available.",
    generateFailed: "Could not generate description.",
    uploadFailed: "Upload failed.",
    logout: "Logout",
    tabDocuments: "Documents",
    tabContacts: "Contact persons",
    contactsTitle: "Contact persons",
    contactsHint: "Add contacts (works council, BEM, occupational doctor, SBV, \u2026) for the chatbot to suggest in resilience mode.",
    contactsEmpty: "No contacts yet.",
    contactAdd: "New contact",
    contactDialogTitle: "Contact",
    contactDialogDesc: "Maintain name and reachability. Tags control in which role responses this contact appears.",
    lblCFunction: "Function",
    lblCName: "Name",
    lblCEmail: "Email",
    lblCPhone: "Phone",
    lblCNote: "Note",
    lblCRoles: "Roles (visibility)",
    contactSaved: "Contact saved",
    contactDeleted: "Contact deleted",
  },
};

// Tag vocabulary (canonical IDs \u2014 must match aas-chat MCP enum + DB)
const ROLE_TAG_LABELS = {
  "beschaeftigte-buero":     { de: "Besch\u00e4ftigte (B\u00fcro)",      en: "Employees (office)" },
  "beschaeftigte-produktion":{ de: "Besch\u00e4ftigte (Produktion)", en: "Employees (production)" },
  "fk-klein":                { de: "F\u00fchrungskraft (\u2264 10 P.)",  en: "Manager (small team)" },
  "fk-gross":                { de: "F\u00fchrungskraft (gro\u00df)",     en: "Manager (large org)" },
  "kontaktperson":           { de: "Kontaktperson",                en: "Contact person" },
  "all-roles":               { de: "Alle Rollen",                  en: "All roles" },
};
const TOPIC_TAGS = [
  "resilienz-grundlagen", "stress", "konflikt", "ueberlastung",
  "fuehrung", "team", "belastungs-ekg", "schnittstellen-workshop",
  "audit", "programme-unternehmen", "prozess-vorschlag",
];
function roleLabel(id) { return (ROLE_TAG_LABELS[id] && ROLE_TAG_LABELS[id][locale]) || id; }

let locale = localStorage.getItem("kanban-locale") || "de";
function t(key) {
  return (I18N[locale] && I18N[locale][key]) || (I18N.de && I18N.de[key]) || key;
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let documents = [];
let editingDoc = null;
let editingTags = [];
let currentPage = 1;
const PAGE_SIZE = 20;
let searchQuery = "";
let defaultBasePrompt = "";
let contacts = [];
let editingContact = null;
let currentTab = "documents";

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
const settingsSeedContacts = document.getElementById("settings-seed-contacts");
const settingsFillMeta = document.getElementById("settings-fill-meta");
const userMenuToggle = document.getElementById("user-menu-toggle");
const userMenu = document.getElementById("user-menu");
const userInitials = document.getElementById("user-initials");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");
const localeDeBtn = document.getElementById("locale-de-btn");
const localeEnBtn = document.getElementById("locale-en-btn");
const tabButtons = document.querySelectorAll(".tab-btn");
const contactsView = document.getElementById("contacts-view");
const contactsGrid = document.getElementById("contacts-grid");
const contactsEmpty = document.getElementById("contacts-empty");
const contactsCount = document.getElementById("contacts-count");
const contactAddBtn = document.getElementById("contact-add-btn");
const contactDialog = document.getElementById("contact-dialog");
const contactCancel = document.getElementById("contact-cancel");
const contactSave = document.getElementById("contact-save");
const contactDelete = document.getElementById("contact-delete");
const tagsChips = document.getElementById("f-tags-chips");
const tagsSelect = document.getElementById("f-tags-select");
const tagsCustom = document.getElementById("f-tags-custom");
const tagsAdd = document.getElementById("f-tags-add");

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
  contactsView.classList.remove("active");
  view.classList.add("active");
}

function setTab(tab) {
  currentTab = tab;
  tabButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tab));
  if (tab === "documents") showView(listView);
  else if (tab === "contacts") { showView(contactsView); renderContacts(); }
}
tabButtons.forEach(btn => btn.addEventListener("click", () => setTab(btn.dataset.tab)));

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

    const tagChips = Array.isArray(doc.tags) && doc.tags.length
      ? `<div class="contact-card-roles">${doc.tags.map(tg => {
          const label = isRoleTag(tg) ? roleLabel(tg) : tg;
          const cls = isRoleTag(tg) ? " role-tag" : "";
          return `<span class="tag-chip${cls}">${esc(label)}</span>`;
        }).join("")}</div>`
      : "";

    el.innerHTML = `
      <div class="doc-card-icon">${getFileIcon(ext)}</div>
      <div class="doc-card-body">
        <h3 class="doc-card-title">${esc(doc.title || doc.original_name || "\u2014")}</h3>
        ${doc.description ? `<p class="doc-card-desc">${esc(doc.description)}</p>` : ""}
        ${tagChips}
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
  editingTags = Array.isArray(doc.tags) ? [...doc.tags] : [];

  document.getElementById("f-title").value = doc.title || "";
  document.getElementById("f-desc").value = doc.description || "";
  document.getElementById("info-filename").textContent = doc.original_name || "";
  document.getElementById("info-filesize").textContent = formatSize(doc.file_size);
  document.getElementById("info-filetype").textContent = doc.mime_type || "";
  document.getElementById("info-filedate").textContent = formatDate(doc.updated_at || doc.created_at);

  renderTagChips();
  populateTagsSelect();

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
  const res = await api("/api/documents/" + editingDoc.doc_id, {
    method: "PUT",
    body: { title, description, tags: editingTags },
  });
  if (res.ok) {
    editingDoc.title = title;
    editingDoc.description = description;
    editingDoc.tags = [...editingTags];
    renderDocuments();
    showToast(t("saved"));
    setTab("documents");
  }
});

// ---------------------------------------------------------------------------
// Tag editor
// ---------------------------------------------------------------------------
function isRoleTag(tag) { return Object.prototype.hasOwnProperty.call(ROLE_TAG_LABELS, tag); }

function renderTagChips() {
  tagsChips.dataset.placeholder = t("tagsPlaceholder");
  tagsChips.innerHTML = "";
  for (const tag of editingTags) {
    const chip = document.createElement("span");
    chip.className = "tag-chip" + (isRoleTag(tag) ? " role-tag" : "");
    const label = isRoleTag(tag) ? roleLabel(tag) : tag;
    chip.innerHTML = `${esc(label)} <button type="button" class="tag-chip-remove" aria-label="Entfernen">&times;</button>`;
    chip.querySelector(".tag-chip-remove").addEventListener("click", () => {
      editingTags = editingTags.filter(x => x !== tag);
      renderTagChips();
      populateTagsSelect();
    });
    tagsChips.appendChild(chip);
  }
}

function populateTagsSelect() {
  tagsSelect.innerHTML = "";
  const optEmpty = document.createElement("option");
  optEmpty.value = "";
  optEmpty.textContent = t("tagSuggestPlaceholder");
  tagsSelect.appendChild(optEmpty);

  const grpRole = document.createElement("optgroup");
  grpRole.label = locale === "de" ? "Rollen" : "Roles";
  for (const id of Object.keys(ROLE_TAG_LABELS)) {
    if (editingTags.includes(id)) continue;
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = roleLabel(id);
    grpRole.appendChild(opt);
  }
  if (grpRole.childElementCount > 0) tagsSelect.appendChild(grpRole);

  const grpTopic = document.createElement("optgroup");
  grpTopic.label = locale === "de" ? "Themen" : "Topics";
  for (const id of TOPIC_TAGS) {
    if (editingTags.includes(id)) continue;
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = id;
    grpTopic.appendChild(opt);
  }
  if (grpTopic.childElementCount > 0) tagsSelect.appendChild(grpTopic);
}

function addTagFromInput() {
  const sel = tagsSelect.value;
  const custom = tagsCustom.value.trim();
  if (sel && !editingTags.includes(sel)) editingTags.push(sel);
  if (custom && !editingTags.includes(custom)) editingTags.push(custom);
  tagsSelect.value = "";
  tagsCustom.value = "";
  renderTagChips();
  populateTagsSelect();
}
tagsSelect.addEventListener("change", () => { if (tagsSelect.value) addTagFromInput(); });
tagsAdd.addEventListener("click", addTagFromInput);
tagsCustom.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); addTagFromInput(); }
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
    setTab("documents");
  }
});

// Back
editBackBtn.addEventListener("click", () => setTab("documents"));

// Generate description (+ tag suggestions)
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
    // Merge KI-Tag-Vorschläge in editingTags (Union, keine Duplikate)
    if (Array.isArray(res.payload.tags) && res.payload.tags.length) {
      const before = editingTags.length;
      for (const tag of res.payload.tags) {
        if (typeof tag === "string" && tag && !editingTags.includes(tag)) editingTags.push(tag);
      }
      const added = editingTags.length - before;
      if (added > 0) {
        renderTagChips();
        populateTagsSelect();
        showToast(t("aiTagsAdded").replace("{n}", added));
      }
    }
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

settingsSeedContacts.addEventListener("click", async () => {
  settingsSeedContacts.disabled = true;
  const res = await api("/api/kb-contacts/seed-test", { method: "POST" });
  settingsSeedContacts.disabled = false;
  if (res.ok && res.payload) {
    const { created, skipped } = res.payload;
    showToast(t("seedDone").replace("{c}", created).replace("{s}", skipped));
    await loadContacts();
    if (currentTab === "contacts") renderContacts();
  } else {
    showToast(t("seedFailed"));
  }
});

settingsFillMeta.addEventListener("click", async () => {
  const origText = settingsFillMeta.textContent;
  settingsFillMeta.disabled = true;
  settingsFillMeta.textContent = t("filling");
  const res = await api("/api/documents/fill-missing-meta", { method: "POST" });
  settingsFillMeta.disabled = false;
  settingsFillMeta.textContent = origText;
  if (res.ok && res.payload) {
    const p = res.payload;
    const skipTotal = (p.skipped?.alreadyComplete || 0) + (p.skipped?.noText || 0);
    showToast(t("fillDone")
      .replace("{p}", p.processed)
      .replace("{d}", p.descriptionFilled)
      .replace("{tg}", p.tagsFilled)
      .replace("{s}", skipTotal)
    );
    await loadDocuments();
    if (currentTab === "documents") renderDocuments();
  } else if (res.payload?.error === "NO_API_KEY") {
    showToast(t("noApiKey"));
  } else {
    showToast(t("fillFailed"));
  }
});

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------
async function loadContacts() {
  const res = await api("/api/kb-contacts");
  if (res.ok && res.payload?.contacts) contacts = res.payload.contacts;
}

function renderContacts() {
  contactsGrid.innerHTML = "";
  contactsCount.textContent = contacts.length ? `(${contacts.length})` : "";
  if (!contacts.length) {
    contactsEmpty.hidden = false;
    document.getElementById("contacts-empty-text").textContent = t("contactsEmpty");
    return;
  }
  contactsEmpty.hidden = true;
  for (const c of contacts) {
    const el = document.createElement("div");
    el.className = "doc-card contact-card";
    el.dataset.id = c.contact_id;
    const tags = Array.isArray(c.role_tags) ? c.role_tags : [];
    const chips = tags.length
      ? `<div class="contact-card-roles">${tags.map(tg => {
          const label = isRoleTag(tg) ? roleLabel(tg) : tg;
          const cls = isRoleTag(tg) ? " role-tag" : "";
          return `<span class="tag-chip${cls}">${esc(label)}</span>`;
        }).join("")}</div>`
      : "";
    el.innerHTML = `
      <div class="doc-card-icon">
        <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <div class="doc-card-body">
        <h3 class="doc-card-title">${esc(c.function || "—")}${c.name ? " · " + esc(c.name) : ""}</h3>
        ${c.email ? `<p class="doc-card-desc">${esc(c.email)}${c.phone ? " · " + esc(c.phone) : ""}</p>` : (c.phone ? `<p class="doc-card-desc">${esc(c.phone)}</p>` : "")}
        ${chips}
      </div>
      <button class="doc-card-delete" type="button" title="${esc(t("delete"))}">
        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    `;
    el.querySelector(".doc-card-delete").addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm(t("confirmDelete"))) return;
      const r = await api("/api/kb-contacts/" + c.contact_id, { method: "DELETE" });
      if (r.ok) { contacts = contacts.filter(x => x.contact_id !== c.contact_id); renderContacts(); showToast(t("contactDeleted")); }
    });
    el.addEventListener("click", () => openContactDialog(c));
    contactsGrid.appendChild(el);
  }
}

function buildRoleChecks(selected) {
  const wrap = document.getElementById("c-roles");
  wrap.innerHTML = "";
  for (const id of Object.keys(ROLE_TAG_LABELS)) {
    const label = document.createElement("label");
    const checked = selected.includes(id);
    label.className = checked ? "checked" : "";
    label.innerHTML = `<input type="checkbox" value="${id}" ${checked ? "checked" : ""}/> ${esc(roleLabel(id))}`;
    const input = label.querySelector("input");
    input.addEventListener("change", () => { label.classList.toggle("checked", input.checked); });
    wrap.appendChild(label);
  }
}

function openContactDialog(contact) {
  editingContact = contact || null;
  document.getElementById("c-function").value = contact?.function || "";
  document.getElementById("c-name").value     = contact?.name || "";
  document.getElementById("c-email").value    = contact?.email || "";
  document.getElementById("c-phone").value    = contact?.phone || "";
  document.getElementById("c-note").value     = contact?.note || "";
  buildRoleChecks(contact?.role_tags || []);
  contactDelete.hidden = !contact;
  contactDialog.showModal();
}

contactAddBtn.addEventListener("click", () => openContactDialog(null));
contactCancel.addEventListener("click", () => contactDialog.close());

contactSave.addEventListener("click", async () => {
  const payload = {
    function: document.getElementById("c-function").value.trim(),
    name:     document.getElementById("c-name").value.trim(),
    email:    document.getElementById("c-email").value.trim(),
    phone:    document.getElementById("c-phone").value.trim(),
    note:     document.getElementById("c-note").value.trim(),
    role_tags: Array.from(document.querySelectorAll("#c-roles input[type=checkbox]:checked")).map(i => i.value),
  };
  let res;
  if (editingContact) {
    res = await api("/api/kb-contacts/" + editingContact.contact_id, { method: "PUT", body: payload });
  } else {
    res = await api("/api/kb-contacts", { method: "POST", body: payload });
  }
  if (res.ok) {
    contactDialog.close();
    await loadContacts();
    renderContacts();
    showToast(t("contactSaved"));
  }
});

contactDelete.addEventListener("click", async () => {
  if (!editingContact) return;
  if (!confirm(t("confirmDelete"))) return;
  const r = await api("/api/kb-contacts/" + editingContact.contact_id, { method: "DELETE" });
  if (r.ok) {
    contactDialog.close();
    contacts = contacts.filter(x => x.contact_id !== editingContact.contact_id);
    renderContacts();
    showToast(t("contactDeleted"));
  }
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
  generateDescBtn.title = t("generateDescTitle");
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
  document.getElementById("settings-test-title").textContent = t("settingsTestTitle");
  document.getElementById("settings-test-desc").textContent = t("settingsTestDesc");
  document.getElementById("settings-seed-contacts").textContent = t("seedContactsBtn");
  document.getElementById("settings-fill-desc").textContent = t("settingsFillDesc");
  document.getElementById("settings-fill-meta").textContent = t("fillMetaBtn");
  searchInput.placeholder = t("searchPlaceholder");
  logoutBtn.textContent = t("logout");
  // Tabs + contacts
  document.getElementById("tab-documents-btn").textContent = t("tabDocuments");
  document.getElementById("tab-contacts-btn").textContent = t("tabContacts");
  document.getElementById("contacts-title").textContent = t("contactsTitle");
  document.getElementById("contacts-hint").textContent = t("contactsHint");
  document.getElementById("contact-add-label").textContent = t("contactAdd");
  document.getElementById("contact-dialog-title").textContent = t("contactDialogTitle");
  document.getElementById("contact-dialog-desc").textContent = t("contactDialogDesc");
  document.getElementById("lbl-c-function").textContent = t("lblCFunction");
  document.getElementById("lbl-c-name").textContent = t("lblCName");
  document.getElementById("lbl-c-email").textContent = t("lblCEmail");
  document.getElementById("lbl-c-phone").textContent = t("lblCPhone");
  document.getElementById("lbl-c-note").textContent = t("lblCNote");
  document.getElementById("lbl-c-roles").textContent = t("lblCRoles");
  document.getElementById("contact-cancel").textContent = t("settingsCancel");
  document.getElementById("contact-save").textContent = t("settingsSave");
  document.getElementById("contact-delete").textContent = t("delete");
  document.getElementById("lbl-tags").textContent = t("lblTags");
  tagsCustom.placeholder = t("tagCustomPlaceholder");
  renderDocuments();
  if (currentTab === "contacts") renderContacts();
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
  await loadContacts();
  renderDocuments();
}

init();
