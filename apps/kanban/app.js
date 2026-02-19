const APP_BASE = "/apps/kanban";
const DEFAULT_COLUMNS = ["Backlog", "In Arbeit", "Review", "Erledigt"];
const STORAGE_KEY = "kanban-v2";

const board = document.getElementById("board");
const projectTabs = document.getElementById("project-tabs");
const addProjectBtn = document.getElementById("add-project-btn");
const projectSidebar = document.getElementById("project-sidebar");
const projectSidebarTitle = document.getElementById("project-sidebar-title");
const projectSidebarToggle = document.getElementById("project-sidebar-toggle");
const deleteProjectBtn = document.getElementById("delete-project-btn");
const addColumnBtn = document.getElementById("add-column-btn");
const activityPanelBtn = document.getElementById("activity-panel-btn");
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
const userInfo = document.getElementById("user-info");
const localeDeBtn = document.getElementById("locale-de-btn");
const localeEnBtn = document.getElementById("locale-en-btn");
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
const projectNameModal = document.getElementById("project-name-modal");
const projectNameForm = document.getElementById("project-name-form");
const projectNameModalTitle = document.getElementById("project-name-modal-title");
const projectNameMessage = document.getElementById("project-name-message");
const projectNameField = document.getElementById("project-name-field");
const projectNameLabel = document.getElementById("project-name-label");
const projectNameInput = document.getElementById("project-name-input");
const projectNameOkBtn = document.getElementById("project-name-ok-btn");
const projectNameCancelBtn = document.getElementById("project-name-cancel-btn");
const activityOverlay = document.getElementById("activity-overlay");
const activityPanel = document.getElementById("activity-panel");
const activityPanelTitle = document.getElementById("activity-panel-title");
const activityPanelSubtitle = document.getElementById("activity-panel-subtitle");
const activityPanelCloseBtn = document.getElementById("activity-panel-close-btn");
const activityList = document.getElementById("activity-list");

const LOCALE_KEY = "kanban-locale";
const SIDEBAR_COLLAPSED_KEY = "kanban-sidebar-collapsed";
const FALLBACK_LOCALE = "de";
const TRANSLATIONS = {
  de: {
    searchPlaceholder: "Tasks filtern...",
    searchAria: "Tasks filtern",
    clearSearch: "Suche leeren",
    boardActions: "Board Aktionen",
    tabsAria: "Projekt Tabs",
    projectsTitle: "Projekte",
    boardAria: "Kanban Board",
    btnNew: "Neu",
    btnShare: "Teilen",
    btnRights: "Rechte",
    btnDelete: "Löschen",
    btnColumn: "Spalte",
    btnActivity: "Aktivität",
    btnExport: "Export",
    btnImport: "Import",
    titleNewProject: "Projekt anlegen",
    titleShareProject: "Projekt teilen",
    titleRights: "Rechte verwalten",
    titleDeleteProject: "Projekt löschen",
    titleAddColumn: "Spalte hinzufügen",
    titleActivity: "Aktivitäten",
    titleExport: "Exportieren",
    titleImport: "Importieren",
    sidebarCollapse: "Navigation einklappen",
    sidebarExpand: "Navigation ausklappen",
    syncIdle: "Bereit",
    syncSyncing: "Synchronisiere...",
    syncSynced: "Synchron",
    syncSaving: "Speichere...",
    syncOffline: "Offline",
    syncError: "Sync-Fehler",
    logout: "Logout",
    localeDeShort: "DE",
    localeEnShort: "EN",
    localeDe: "Deutsch",
    localeEn: "English",
    defaultProjectName: "Standardprojekt",
    newProjectTitle: "Neues Projekt",
    newProjectLabel: "Projektname",
    newProjectOk: "Erstellen",
    renameProjectTitle: "Projekt umbenennen",
    renameProjectLabel: "Projektname",
    renameProjectOk: "Speichern",
    projectDeleteOwnerOnly: "Nur der Projekt-Owner kann dieses Projekt löschen.",
    atLeastOneProject: "Mindestens ein Projekt muss bestehen bleiben.",
    deleteProjectTitle: "Projekt löschen",
    deleteProjectMessage: "Projekt \"{name}\" wirklich entfernen?",
    confirmDelete: "Löschen",
    confirmProjectNameLabel: "Bitte den Projektnamen zur Bestätigung eingeben: \"{name}\"",
    errorCreateProject: "Projekt konnte nicht erstellt werden.",
    errorDeleteProject: "Projekt konnte nicht gelöscht werden.",
    readOnlyProject: "Dieses Projekt ist schreibgeschützt.",
    newColumnName: "Neue Spalte {n}",
    exportFilePrefix: "kanban-export",
    importError: "Import fehlgeschlagen. Bitte eine gültige Export-Datei auswählen.",
    itemModalNewTitle: "Neuer Task",
    itemModalEditTitle: "Task bearbeiten",
    itemTitleLabel: "Titel",
    itemDescriptionLabel: "Beschreibung",
    itemPriorityLabel: "Priorität",
    itemDateLabel: "Fälligkeitsdatum",
    itemAssigneeLabel: "Zugewiesen an",
    itemProgressLabel: "Fortschritt — ",
    itemTagsLabel: "Tags ",
    itemTagsHint: "(kommagetrennt)",
    itemTagsPlaceholder: "z. B. Design, Backend, Bug …",
    itemAssigneePlaceholder: "Name der Person …",
    checklistLabel: "Checkliste",
    checklistAdd: "Checklistenpunkt hinzufügen",
    save: "Speichern",
    close: "Schließen",
    cancel: "Abbrechen",
    add: "Hinzufügen",
    untitled: "Ohne Titel",
    cardDeleteTitle: "Task löschen",
    cardDeleteMessage: "Task \"{name}\" wirklich löschen?",
    columnDeleteTitle: "Spalte löschen",
    columnDeleteMessage: "Spalte \"{name}\" wirklich entfernen?",
    atLeastOneColumn: "Mindestens eine Spalte muss bestehen bleiben.",
    collapseAll: "Alle einklappen",
    expandAll: "Alle ausklappen",
    priorityLow: "Niedrig",
    priorityMedium: "Mittel",
    priorityHigh: "Hoch",
    priorityBadgeLow: "Niedrig",
    priorityBadgeMedium: "Mittel",
    priorityBadgeHigh: "Hoch",
    checklistSummary: "Checkliste: {done}/{total}",
    checklistItemPlaceholder: "Beschreibung...",
    checklistRemove: "Checklistenpunkt entfernen",
    membersOwnerOnly: "Nur der Projekt-Owner kann Rechte verwalten.",
    membersLoad: "Lade Mitglieder...",
    membersLoadError: "Fehler beim Laden.",
    membersEmpty: "Keine Mitglieder gefunden.",
    membersUnknown: "Unbekannt",
    youSuffix: " (Du)",
    roleOwner: "Owner",
    roleEditor: "Editor",
    roleViewer: "Viewer",
    roleRemove: "Entfernen",
    apply: "Übernehmen",
    membersUpdateFailed: "Mindestens eine Rollenänderung ist fehlgeschlagen.",
    memberLoadFailed: "Mitglieder konnten nicht geladen werden.",
    shareCreateBusy: "Erstelle...",
    shareCreateLink: "Link erstellen",
    shareCopy: "Kopieren",
    shareCopied: "Kopiert",
    shareReadonlyError: "Dieses Projekt ist schreibgeschützt.",
    shareCreateError: "Einladungslink konnte nicht erstellt werden.",
    copyFailed: "Konnte nicht automatisch kopieren. Bitte Link manuell kopieren.",
    inviteAcceptError: "Einladung konnte nicht angenommen werden.",
    projectRenameError: "Projektname konnte nicht geändert werden.",
    confirmDefaultTitle: "Bitte bestätigen",
    confirmTypeLabel: "Zur Bestätigung Namen eingeben",
    shareTitle: "Projekt teilen",
    shareSubtitle: "Erstelle einen Link und teile ihn mit deinem Team.",
    sharePermission: "Berechtigung",
    shareLink: "Einladungslink",
    shareLinkPlaceholder: "Noch kein Link erstellt",
    shareEditorOption: "Editor (kann bearbeiten)",
    shareViewerOption: "Viewer (nur lesen)",
    membersTitle: "Mitglieder & Rechte",
    membersSubtitle: "Rollen für das aktive Projekt verwalten.",
    activityTitle: "Letzte Aktivitäten",
    activitySubtitle: "Aktivitäten im aktuellen Board",
    activityClose: "Schließen",
    activityLoading: "Aktivitäten werden geladen...",
    activityEmpty: "Noch keine Aktivitäten vorhanden.",
    activityLoadError: "Aktivitäten konnten nicht geladen werden.",
    activityAt: "{actor} · {time}",
    activityProjectCreated: "{actor} hat das Projekt erstellt",
    activityProjectRenamed: "{actor} hat das Projekt umbenannt",
    activityColumnCreated: "{actor} hat eine Spalte erstellt: {name}",
    activityColumnDeleted: "{actor} hat eine Spalte entfernt: {name}",
    activityColumnMoved: "{actor} hat eine Spalte verschoben: {name}",
    activityCardCreated: "{actor} hat eine Task erstellt: {name}",
    activityCardUpdated: "{actor} hat eine Task bearbeitet: {name}",
    activityCardDeleted: "{actor} hat eine Task gelöscht: {name}",
    activityCardMoved: "{actor} hat eine Task verschoben: {name}",
    activityMemberRoleUpdated: "{actor} hat eine Rolle geändert",
    activityMemberRemoved: "{actor} hat ein Mitglied entfernt",
    activityInviteCreated: "{actor} hat einen Einladungslink erstellt",
    activityInviteAccepted: "{actor} hat eine Einladung angenommen",
    activityGeneric: "{actor} hat eine Änderung vorgenommen",
    sortName: "Name",
    sortPriority: "Prio",
    sortDate: "Datum",
    addTask: "Hinzufügen",
    editTask: "Task bearbeiten",
    deleteTask: "Task löschen",
    moveColumn: "Spalte verschieben",
    deleteColumn: "Spalte löschen",
    toggleCards: "Alle ein-/ausklappen",
    addTaskTitle: "Task hinzufügen",
  },
  en: {
    searchPlaceholder: "Filter tasks...",
    searchAria: "Filter tasks",
    clearSearch: "Clear search",
    boardActions: "Board actions",
    tabsAria: "Project tabs",
    projectsTitle: "Projects",
    boardAria: "Kanban board",
    btnNew: "New",
    btnShare: "Share",
    btnRights: "Rights",
    btnDelete: "Delete",
    btnColumn: "Column",
    btnActivity: "Activity",
    btnExport: "Export",
    btnImport: "Import",
    titleNewProject: "Create project",
    titleShareProject: "Share project",
    titleRights: "Manage rights",
    titleDeleteProject: "Delete project",
    titleAddColumn: "Add column",
    titleActivity: "Activity",
    titleExport: "Export",
    titleImport: "Import",
    sidebarCollapse: "Collapse navigation",
    sidebarExpand: "Expand navigation",
    syncIdle: "Ready",
    syncSyncing: "Syncing...",
    syncSynced: "Synced",
    syncSaving: "Saving...",
    syncOffline: "Offline",
    syncError: "Sync error",
    logout: "Logout",
    localeDeShort: "DE",
    localeEnShort: "EN",
    localeDe: "Deutsch",
    localeEn: "English",
    defaultProjectName: "Default project",
    newProjectTitle: "New Project",
    newProjectLabel: "Project name",
    newProjectOk: "Create",
    renameProjectTitle: "Rename Project",
    renameProjectLabel: "Project name",
    renameProjectOk: "Save",
    projectDeleteOwnerOnly: "Only the project owner can delete this project.",
    atLeastOneProject: "At least one project must remain.",
    deleteProjectTitle: "Delete project",
    deleteProjectMessage: "Remove project \"{name}\"?",
    confirmDelete: "Delete",
    confirmProjectNameLabel: "Type the project name to confirm: \"{name}\"",
    errorCreateProject: "Project could not be created.",
    errorDeleteProject: "Project could not be deleted.",
    readOnlyProject: "This project is read-only.",
    newColumnName: "New column {n}",
    exportFilePrefix: "kanban-export",
    importError: "Import failed. Please choose a valid export file.",
    itemModalNewTitle: "New task",
    itemModalEditTitle: "Edit task",
    itemTitleLabel: "Title",
    itemDescriptionLabel: "Description",
    itemPriorityLabel: "Priority",
    itemDateLabel: "Due date",
    itemAssigneeLabel: "Assigned to",
    itemProgressLabel: "Progress — ",
    itemTagsLabel: "Tags ",
    itemTagsHint: "(comma-separated)",
    itemTagsPlaceholder: "e.g. Design, Backend, Bug …",
    itemAssigneePlaceholder: "Person name …",
    checklistLabel: "Checklist",
    checklistAdd: "Add checklist item",
    save: "Save",
    close: "Close",
    cancel: "Cancel",
    add: "Add",
    untitled: "Untitled",
    cardDeleteTitle: "Delete task",
    cardDeleteMessage: "Delete task \"{name}\"?",
    columnDeleteTitle: "Delete column",
    columnDeleteMessage: "Remove column \"{name}\"?",
    atLeastOneColumn: "At least one column must remain.",
    collapseAll: "Collapse all",
    expandAll: "Expand all",
    priorityLow: "Low",
    priorityMedium: "Medium",
    priorityHigh: "High",
    priorityBadgeLow: "Low",
    priorityBadgeMedium: "Medium",
    priorityBadgeHigh: "High",
    checklistSummary: "Checklist: {done}/{total}",
    checklistItemPlaceholder: "Description...",
    checklistRemove: "Remove checklist item",
    membersOwnerOnly: "Only the project owner can manage rights.",
    membersLoad: "Loading members...",
    membersLoadError: "Loading failed.",
    membersEmpty: "No members found.",
    membersUnknown: "Unknown",
    youSuffix: " (You)",
    roleOwner: "Owner",
    roleEditor: "Editor",
    roleViewer: "Viewer",
    roleRemove: "Remove",
    apply: "Apply",
    membersUpdateFailed: "At least one role change failed.",
    memberLoadFailed: "Members could not be loaded.",
    shareCreateBusy: "Creating...",
    shareCreateLink: "Create link",
    shareCopy: "Copy",
    shareCopied: "Copied",
    shareReadonlyError: "This project is read-only.",
    shareCreateError: "Invite link could not be created.",
    copyFailed: "Could not copy automatically. Please copy the link manually.",
    inviteAcceptError: "Invite could not be accepted.",
    projectRenameError: "Project name could not be changed.",
    confirmDefaultTitle: "Please confirm",
    confirmTypeLabel: "Type name to confirm",
    shareTitle: "Share project",
    shareSubtitle: "Create a link and share it with your team.",
    sharePermission: "Permission",
    shareLink: "Invite link",
    shareLinkPlaceholder: "No link created yet",
    shareEditorOption: "Editor (can edit)",
    shareViewerOption: "Viewer (read-only)",
    membersTitle: "Members & rights",
    membersSubtitle: "Manage roles for the active project.",
    activityTitle: "Recent activity",
    activitySubtitle: "Activity in the active board",
    activityClose: "Close",
    activityLoading: "Loading activity...",
    activityEmpty: "No activity yet.",
    activityLoadError: "Activity could not be loaded.",
    activityAt: "{actor} · {time}",
    activityProjectCreated: "{actor} created the project",
    activityProjectRenamed: "{actor} renamed the project",
    activityColumnCreated: "{actor} created a column: {name}",
    activityColumnDeleted: "{actor} removed a column: {name}",
    activityColumnMoved: "{actor} moved a column: {name}",
    activityCardCreated: "{actor} created a task: {name}",
    activityCardUpdated: "{actor} updated a task: {name}",
    activityCardDeleted: "{actor} deleted a task: {name}",
    activityCardMoved: "{actor} moved a task: {name}",
    activityMemberRoleUpdated: "{actor} changed a role",
    activityMemberRemoved: "{actor} removed a member",
    activityInviteCreated: "{actor} created an invite link",
    activityInviteAccepted: "{actor} accepted an invite",
    activityGeneric: "{actor} made a change",
    sortName: "Name",
    sortPriority: "Priority",
    sortDate: "Date",
    addTask: "Add",
    editTask: "Edit task",
    deleteTask: "Delete task",
    moveColumn: "Move column",
    deleteColumn: "Delete column",
    toggleCards: "Collapse/expand all",
    addTaskTitle: "Add task",
  },
};

function loadLocale() {
  const stored = localStorage.getItem(LOCALE_KEY);
  return stored === "en" ? "en" : FALLBACK_LOCALE;
}

let currentLocale = loadLocale();

function t(key, params = {}) {
  const bundle = TRANSLATIONS[currentLocale] || TRANSLATIONS[FALLBACK_LOCALE];
  const fallback = TRANSLATIONS[FALLBACK_LOCALE];
  let value = bundle[key] ?? fallback[key] ?? key;
  Object.entries(params).forEach(([param, paramValue]) => {
    value = value.replaceAll(`{${param}}`, String(paramValue));
  });
  return value;
}

function localeToHtmlLang(locale) {
  return locale === "en" ? "en" : "de";
}

function isMobileSidebarLayout() {
  return window.matchMedia("(max-width: 860px)").matches;
}

function loadSidebarCollapsedPreference() {
  return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
}

function persistSidebarCollapsedPreference(collapsed) {
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
}

function syncSidebarToggleButton() {
  if (!projectSidebarToggle) {
    return;
  }
  const isExpanded = isMobileSidebarLayout()
    ? document.body.classList.contains("sidebar-open-mobile")
    : !document.body.classList.contains("sidebar-collapsed");
  const title = isExpanded ? t("sidebarCollapse") : t("sidebarExpand");
  projectSidebarToggle.title = title;
  projectSidebarToggle.setAttribute("aria-label", title);
}

function applyStaticTranslations() {
  document.documentElement.lang = localeToHtmlLang(currentLocale);

  boardFilterInput?.setAttribute("placeholder", t("searchPlaceholder"));
  boardFilterInput?.setAttribute("aria-label", t("searchAria"));
  boardFilterClearBtn?.setAttribute("title", t("clearSearch"));

  const headerActions = document.querySelector(".header-actions");
  headerActions?.setAttribute("aria-label", t("boardActions"));
  projectSidebar?.setAttribute("aria-label", t("tabsAria"));
  if (projectSidebarTitle) projectSidebarTitle.textContent = t("projectsTitle");
  board?.setAttribute("aria-label", t("boardAria"));

  const setBtnText = (id, text) => {
    const btn = document.getElementById(id);
    const span = btn?.querySelector("span");
    if (span) {
      span.textContent = text;
    }
  };

  setBtnText("add-project-btn", t("btnNew"));
  setBtnText("share-project-btn", t("btnShare"));
  setBtnText("manage-members-btn", t("btnRights"));
  setBtnText("delete-project-btn", t("btnDelete"));
  setBtnText("add-column-btn", t("btnColumn"));
  setBtnText("activity-panel-btn", t("btnActivity"));
  setBtnText("export-btn", t("btnExport"));
  setBtnText("import-btn", t("btnImport"));

  addProjectBtn?.setAttribute("title", t("titleNewProject"));
  shareProjectBtn?.setAttribute("title", t("titleShareProject"));
  manageMembersBtn?.setAttribute("title", t("titleRights"));
  deleteProjectBtn?.setAttribute("title", t("titleDeleteProject"));
  addColumnBtn?.setAttribute("title", t("titleAddColumn"));
  activityPanelBtn?.setAttribute("title", t("titleActivity"));
  exportBtn?.setAttribute("title", t("titleExport"));
  importBtn?.setAttribute("title", t("titleImport"));
  syncSidebarToggleButton();

  logoutBtn.textContent = t("logout");
  localeDeBtn.classList.toggle("active", currentLocale === "de");
  localeEnBtn.classList.toggle("active", currentLocale === "en");

  const shareTitle = document.querySelector("#share-form h2");
  const shareSubtitle = document.querySelector("#share-form p");
  const sharePermissionLabel = document.querySelector('label[for="share-role"] > span');
  const shareLinkLabel = document.querySelector('label[for="share-link"] > span');
  const shareEditorOption = shareRoleInput?.querySelector('option[value="editor"]');
  const shareViewerOption = shareRoleInput?.querySelector('option[value="viewer"]');
  shareTitle.textContent = t("shareTitle");
  shareSubtitle.textContent = t("shareSubtitle");
  if (sharePermissionLabel) sharePermissionLabel.textContent = t("sharePermission");
  if (shareLinkLabel) shareLinkLabel.textContent = t("shareLink");
  if (shareLinkInput) shareLinkInput.placeholder = t("shareLinkPlaceholder");
  if (shareEditorOption) shareEditorOption.textContent = t("shareEditorOption");
  if (shareViewerOption) shareViewerOption.textContent = t("shareViewerOption");

  shareCloseBtn.textContent = t("close");
  shareCopyBtn.textContent = shareCopyBtn.textContent === t("shareCopied") ? t("shareCopied") : t("shareCopy");
  shareCreateBtn.textContent = t("shareCreateLink");

  const membersTitle = document.querySelector("#members-form h2");
  const membersSubtitle = document.querySelector("#members-form p");
  membersTitle.textContent = t("membersTitle");
  membersSubtitle.textContent = t("membersSubtitle");
  membersCloseBtn.textContent = t("close");
  membersApplyBtn.textContent = t("apply");

  if (activityPanelTitle) activityPanelTitle.textContent = t("activityTitle");
  if (activityPanelSubtitle) activityPanelSubtitle.textContent = t("activitySubtitle");
  if (activityPanelCloseBtn) activityPanelCloseBtn.title = t("activityClose");

  const confirmCancelBtn = document.getElementById("confirm-cancel-btn");
  if (confirmTitle) confirmTitle.textContent = t("confirmDefaultTitle");
  confirmCancelBtn.textContent = t("cancel");
  confirmOkBtn.textContent = t("confirmDelete");
  if (confirmInputLabel && confirmInputLabel.textContent === TRANSLATIONS[FALLBACK_LOCALE].confirmTypeLabel) {
    confirmInputLabel.textContent = t("confirmTypeLabel");
  }

  const itemTitleLabel = document.querySelector('label[for="item-title"] > span');
  const itemDescLabel = document.querySelector('label[for="item-description"] > span');
  const itemPriorityLabel = document.querySelector('label[for="item-priority"] > span');
  const itemDateLabel = document.querySelector('label[for="item-date"] > span');
  const itemAssigneeLabel = document.querySelector('label[for="item-assignee"] > span');
  const itemProgressLabel = document.querySelector('label[for="item-progress"] > span');
  const itemTagsLabel = document.querySelector('label[for="item-tags"] > span');
  const itemTagsHint = document.querySelector('label[for="item-tags"] .field-hint');
  const checklistLabel = document.querySelector('#item-form .field > span');
  if (itemTitleLabel) itemTitleLabel.textContent = t("itemTitleLabel");
  if (itemDescLabel) itemDescLabel.textContent = t("itemDescriptionLabel");
  if (itemPriorityLabel) itemPriorityLabel.textContent = t("itemPriorityLabel");
  if (itemDateLabel) itemDateLabel.textContent = t("itemDateLabel");
  if (itemAssigneeLabel) itemAssigneeLabel.textContent = t("itemAssigneeLabel");
  if (itemProgressLabel) itemProgressLabel.childNodes[0].textContent = t("itemProgressLabel");
  if (itemTagsLabel) itemTagsLabel.childNodes[0].textContent = t("itemTagsLabel");
  if (itemTagsHint) itemTagsHint.textContent = t("itemTagsHint");
  if (checklistLabel) checklistLabel.textContent = t("checklistLabel");
  addChecklistItemBtn.textContent = t("checklistAdd");
  itemAssigneeInput.placeholder = t("itemAssigneePlaceholder");
  itemTagsInput.placeholder = t("itemTagsPlaceholder");
  itemSecondaryBtn.textContent = t("cancel");

  const priorityOptions = itemPriorityInput?.querySelectorAll("option");
  if (priorityOptions?.[0]) priorityOptions[0].textContent = `🟢 ${t("priorityLow")}`;
  if (priorityOptions?.[1]) priorityOptions[1].textContent = `🟡 ${t("priorityMedium")}`;
  if (priorityOptions?.[2]) priorityOptions[2].textContent = `🔴 ${t("priorityHigh")}`;

  const template = columnTemplate?.content;
  if (template) {
    template.querySelector(".column-drag")?.setAttribute("title", t("moveColumn"));
    template.querySelector(".collapse-all-btn")?.setAttribute("title", t("toggleCards"));
    template.querySelector(".delete-column")?.setAttribute("title", t("deleteColumn"));
    const sortName = template.querySelector('.sort-btn[data-field="name"] .sort-btn-label');
    const sortPrio = template.querySelector('.sort-btn[data-field="priority"] .sort-btn-label');
    const sortDate = template.querySelector('.sort-btn[data-field="date"] .sort-btn-label');
    if (sortName) sortName.textContent = t("sortName");
    if (sortPrio) sortPrio.textContent = t("sortPriority");
    if (sortDate) sortDate.textContent = t("sortDate");
    const addItemBtnText = template.querySelector(".add-item-btn");
    if (addItemBtnText) {
      addItemBtnText.setAttribute("title", t("addTaskTitle"));
      const trailingTextNode = Array.from(addItemBtnText.childNodes)
        .reverse()
        .find((node) => node.nodeType === Node.TEXT_NODE);
      if (trailingTextNode) {
        trailingTextNode.nodeValue = ` ${t("addTask")}`;
      } else {
        addItemBtnText.append(` ${t("addTask")}`);
      }
    }
  }

  const cardTpl = cardTemplate?.content;
  if (cardTpl) {
    cardTpl.querySelector(".edit-card")?.setAttribute("title", t("editTask"));
    cardTpl.querySelector(".delete-card")?.setAttribute("title", t("deleteTask"));
  }
}

function setLocale(nextLocale) {
  const locale = nextLocale === "en" ? "en" : "de";
  currentLocale = locale;
  localStorage.setItem(LOCALE_KEY, locale);
  applyStaticTranslations();
  queueRender();
}

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
let activityRefreshTimerId = null;
let activityPanelOpen = false;
let activityRefreshInFlight = false;
let projectsSummaryFingerprint = "";
let sidebarCollapsedPreferred = loadSidebarCollapsedPreference();
let lastUserInteractionAt = Date.now();
let renderQueued = false;
const projectUpdatedAtMap = {};
const projectRoleMap = {};
const savedProjectFingerprintMap = {};
const pendingMemberRoleChanges = {};
const columnSortStates = {}; // { [columnId]: { field: "name"|"priority"|"date"|null, dir: "asc"|"desc" } }
const columnExpandedStates = {}; // { [columnId]: true } means all cards expanded
const cardExpandedStates = {}; // { [cardId]: true } means expanded

if (!isMobileSidebarLayout() && sidebarCollapsedPreferred) {
  document.body.classList.add("sidebar-collapsed");
} else {
  document.body.classList.remove("sidebar-collapsed");
}
document.body.classList.remove("sidebar-open-mobile");

applyStaticTranslations();
render();
setupProjectSidebar();
setupUserMenu();
setupLocaleMenu();
setupActivityPanel();
setupConfirmModal();
setupShareModal();
setupMembersModal();
setupSearchFilter();
setupActivityTracking();
init();

function openProjectNameModal({
  title,
  label,
  okText,
  defaultValue = "",
  message = "",
  showInput = true,
  danger = false,
}) {
  return new Promise((resolve) => {
    projectNameModalTitle.textContent = title;
    if (projectNameMessage) {
      projectNameMessage.textContent = message || "";
      projectNameMessage.hidden = !message;
    }
    if (projectNameLabel) {
      projectNameLabel.textContent = label || "";
      projectNameLabel.hidden = !showInput;
    }
    if (projectNameField) {
      projectNameField.hidden = !showInput;
    }
    if (projectNameInput) {
      projectNameInput.required = showInput;
      projectNameInput.hidden = !showInput;
    }
    projectNameOkBtn.textContent = okText;
    projectNameOkBtn.classList.toggle("btn-danger", Boolean(danger));
    projectNameCancelBtn.textContent = t("cancel");
    projectNameInput.value = defaultValue;
    projectNameModal.showModal();
    if (showInput) {
      requestAnimationFrame(() => {
        projectNameInput.focus();
        projectNameInput.select();
      });
    }

    const cleanup = () => {
      projectNameForm.removeEventListener("submit", onSubmit);
      projectNameCancelBtn.removeEventListener("click", onCancel);
      projectNameModal.removeEventListener("cancel", onCancel);
      if (projectNameMessage) {
        projectNameMessage.textContent = "";
        projectNameMessage.hidden = true;
      }
      if (projectNameLabel) {
        projectNameLabel.hidden = false;
      }
      if (projectNameField) {
        projectNameField.hidden = false;
      }
      if (projectNameInput) {
        projectNameInput.required = true;
        projectNameInput.hidden = false;
      }
      projectNameOkBtn.classList.remove("btn-danger");
      projectNameModal.close();
    };
    const onSubmit = (e) => {
      e.preventDefault();
      cleanup();
      resolve(showInput ? projectNameInput.value : true);
    };
    const onCancel = () => {
      cleanup();
      resolve(null);
    };
    projectNameForm.addEventListener("submit", onSubmit);
    projectNameCancelBtn.addEventListener("click", onCancel);
    projectNameModal.addEventListener("cancel", onCancel);
  });
}

async function openProjectStyleConfirm({ title, message, confirmText = t("confirmDelete"), danger = true }) {
  const result = await openProjectNameModal({
    title,
    message,
    okText: confirmText,
    showInput: false,
    danger,
  });
  return Boolean(result);
}

addProjectBtn.addEventListener("click", async () => {
  const defaultName = `Project ${state.projects.length + 1}`;
  const name = await openProjectNameModal({
    title: t("newProjectTitle"),
    label: t("newProjectLabel"),
    okText: t("newProjectOk"),
    defaultValue: defaultName,
  });
  if (name === null) return;
  const cleanName = name.trim() || defaultName;
  setButtonBusy(addProjectBtn, true);
  try {
    const created = await createProjectOnServer(cleanName);
    if (!created) {
      notifyError(t("errorCreateProject"));
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
    alert(t("projectDeleteOwnerOnly"));
    return;
  }
  if (state.projects.length === 1) {
    alert(t("atLeastOneProject"));
    return;
  }
  const shouldDelete = await confirmAction({
    title: t("deleteProjectTitle"),
    message: t("deleteProjectMessage", { name: active.name }),
    confirmText: t("confirmDelete"),
    requireText: active.name,
    requireTextLabel: t("confirmProjectNameLabel", { name: active.name }),
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
      notifyError(t("errorDeleteProject"));
      return;
    }
    await refreshProjectsFromServer(null, true);
  } finally {
    setButtonBusy(deleteProjectBtn, false);
  }
});

addColumnBtn.addEventListener("click", () => {
  if (!canEditActiveProject()) {
    alert(t("readOnlyProject"));
    return;
  }
  const project = getActiveProject();
  if (!project) {
    return;
  }
  project.columns.push({
    id: generateId(),
    title: t("newColumnName", { n: project.columns.length + 1 }),
    cards: [],
  });
  saveAndRender();
  const createdColumn = project.columns[project.columns.length - 1];
  recordActivity("column_created", "column", createdColumn?.title || "");
});

shareProjectBtn?.addEventListener("click", async () => {
  const project = getActiveProject();
  if (!project) {
    return;
  }
  if (!canEditProject(project.id)) {
    alert(t("shareReadonlyError"));
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
    shareCreateBtn.textContent = t("shareCreateLink");
  }
  shareModal.showModal();
});

manageMembersBtn?.addEventListener("click", async () => {
  const project = getActiveProject();
  if (!project) {
    return;
  }
  if (projectRoleMap[project.id] !== "owner") {
    alert(t("membersOwnerOnly"));
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
  link.download = `${t("exportFilePrefix")}-${stamp}.json`;
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
    alert(t("importError"));
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
    alert(t("readOnlyProject"));
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
    column.cards.push({ id: generateId(), ...payload });
    recordActivity("card_created", "card", payload.title);
  } else {
    const card = column.cards.find((entry) => entry.id === modalContext.cardId);
    if (card) {
      Object.assign(card, payload);
      recordActivity("card_updated", "card", payload.title);
    }
  }

  itemModal.close();
  modalContext = null;
  saveAndRender();
});

itemModal.addEventListener("close", () => {
  modalContext = null;
});

function generateId() {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }

  if (c && typeof c.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    // RFC4122 v4 style bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function createDefaultColumns() {
  return DEFAULT_COLUMNS.map((title) => ({
    id: generateId(),
    title,
    cards: [],
  }));
}

function createDefaultState() {
  const firstProjectId = generateId();
  return {
    activeProjectId: firstProjectId,
    projects: [
      {
        id: firstProjectId,
        name: t("defaultProjectName"),
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
          id: typeof project?.id === "string" && project.id ? project.id : generateId(),
          name: typeof project?.name === "string" && project.name.trim() ? project.name.trim() : t("defaultProjectName"),
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
          id: typeof column?.id === "string" && column.id ? column.id : generateId(),
          title: typeof column?.title === "string" && column.title.trim() ? column.title.trim() : t("untitled"),
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
        id: typeof card?.id === "string" && card.id ? card.id : generateId(),
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
        id: typeof item?.id === "string" && item.id ? item.id : generateId(),
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
    idle: t("syncIdle"),
    syncing: t("syncSyncing"),
    synced: t("syncSynced"),
    saving: t("syncSaving"),
    offline: t("syncOffline"),
    error: t("syncError"),
  };
  const nextText = detail || labels[mode] || t("syncIdle");
  if (syncStatus.dataset.mode === mode && syncStatus.title === nextText) {
    return;
  }
  syncStatus.dataset.mode = mode;
  syncStatus.title = nextText;
  syncStatus.setAttribute("aria-label", `${currentLocale === "de" ? "Synchronstatus" : "Sync status"}: ${nextText}`);
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

function buildProjectsSummaryFingerprint(projects) {
  if (!Array.isArray(projects) || !projects.length) {
    return "";
  }
  return projects
    .map((project) => {
      const id = project?.id || "";
      const name = project?.name || "";
      const updatedAt = project?.updatedAt || "";
      const role = project?.role || "";
      return `${id}|${name}|${updatedAt}|${role}`;
    })
    .sort()
    .join(";");
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

  // Route /api/* through the app base path, keep /auth/* and /api/me central
  let resolvedPath = path;
  if (path.startsWith("/api/") && path !== "/api/me") {
    resolvedPath = APP_BASE + path;
  }

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetch(resolvedPath, {
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
    await syncProjectListFromServer();
    scheduleNextSync(getAdaptiveSyncDelay());
  }, delay);
}

function saveAndRender() {
  persistLocalState();
  scheduleProjectSave();
  queueRender();
}

async function init() {
  setSyncStatus("syncing", currentLocale === "de" ? "Initialisiere..." : "Initializing...");
  currentUser = await loadCurrentUser();
  if (!currentUser) {
    redirectToLogin();
    return;
  }
  userInitials.textContent = getUserInitials(currentUser.name || currentUser.email || "User");
  if (userInfo) userInfo.textContent = currentUser.name || currentUser.email || "";

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
    projectsSummaryFingerprint = buildProjectsSummaryFingerprint(remoteProjects);

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

async function loadProjectActivities(projectId, limit = 60) {
  const result = await apiRequest(
    `/api/projects/${encodeURIComponent(projectId)}/activities?limit=${encodeURIComponent(limit)}`,
    {
      cache: "no-store",
      retries: 1,
    }
  );
  if (!result.ok) {
    return null;
  }
  return result.payload?.activities || [];
}

async function loadProjectsSummary() {
  const result = await apiRequest("/api/projects/summary", {
    cache: "no-store",
    retries: 1,
  });
  if (!result.ok) {
    return null;
  }
  return Array.isArray(result.payload?.projects) ? result.payload.projects : [];
}

async function postProjectActivity(projectId, action, entityType = "", entityName = "", meta = {}) {
  const result = await apiRequest(`/api/projects/${encodeURIComponent(projectId)}/activities`, {
    method: "POST",
    body: { action, entityType, entityName, meta },
    retries: 0,
  });
  return Boolean(result.ok);
}

function toActivityTimeLabel(timestampValue) {
  const date = new Date(timestampValue);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const dateLocale = currentLocale === "en" ? "en-US" : "de-DE";
  return date.toLocaleString(dateLocale, {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildActivityMessage(activity) {
  const actor = activity?.actor?.name || activity?.actor?.email || t("membersUnknown");
  const name = activity?.entityName || "";
  const action = activity?.action || "";
  const byActionKey = {
    project_created: "activityProjectCreated",
    project_renamed: "activityProjectRenamed",
    column_created: "activityColumnCreated",
    column_deleted: "activityColumnDeleted",
    column_moved: "activityColumnMoved",
    card_created: "activityCardCreated",
    card_updated: "activityCardUpdated",
    card_deleted: "activityCardDeleted",
    card_moved: "activityCardMoved",
    member_role_updated: "activityMemberRoleUpdated",
    member_removed: "activityMemberRemoved",
    invite_created: "activityInviteCreated",
    invite_accepted: "activityInviteAccepted",
  };
  const key = byActionKey[action] || "activityGeneric";
  return t(key, { actor, name });
}

function renderActivityItems(items) {
  if (!activityList) {
    return;
  }
  activityList.replaceChildren();

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "activity-item";
    empty.innerHTML = `<div class="activity-item-main">${t("activityEmpty")}</div>`;
    activityList.appendChild(empty);
    return;
  }

  items.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "activity-item";

    const main = document.createElement("div");
    main.className = "activity-item-main";
    main.textContent = buildActivityMessage(entry);

    const meta = document.createElement("div");
    meta.className = "activity-item-meta";
    const actor = entry?.actor?.name || entry?.actor?.email || t("membersUnknown");
    meta.textContent = t("activityAt", {
      actor,
      time: toActivityTimeLabel(entry.createdAt),
    });

    item.appendChild(main);
    item.appendChild(meta);
    activityList.appendChild(item);
  });
}

async function refreshActivityPanel() {
  if (!activityPanelOpen || activityRefreshInFlight) {
    return;
  }
  const activeProject = getActiveProject();
  if (!activeProject) {
    return;
  }

  activityRefreshInFlight = true;
  try {
    const entries = await loadProjectActivities(activeProject.id, 80);
    if (!entries) {
      if (activityList) {
        activityList.innerHTML = `<div class="activity-item"><div class="activity-item-main">${t("activityLoadError")}</div></div>`;
      }
      return;
    }
    renderActivityItems(entries);
  } finally {
    activityRefreshInFlight = false;
  }
}

function startActivityPanelRefreshLoop() {
  if (activityRefreshTimerId) {
    clearInterval(activityRefreshTimerId);
  }
  activityRefreshTimerId = setInterval(() => {
    refreshActivityPanel();
  }, 3500);
}

function stopActivityPanelRefreshLoop() {
  if (activityRefreshTimerId) {
    clearInterval(activityRefreshTimerId);
    activityRefreshTimerId = null;
  }
}

function openActivityPanel() {
  if (!activityPanel || !activityOverlay || !activityList) {
    return;
  }
  activityPanelOpen = true;
  activityOverlay.hidden = false;
  activityPanel.classList.add("open");
  activityPanel.setAttribute("aria-hidden", "false");
  activityList.innerHTML = `<div class="activity-item"><div class="activity-item-main">${t("activityLoading")}</div></div>`;
  refreshActivityPanel();
  startActivityPanelRefreshLoop();
}

function closeActivityPanel() {
  if (!activityPanel || !activityOverlay) {
    return;
  }
  activityPanelOpen = false;
  activityOverlay.hidden = true;
  activityPanel.classList.remove("open");
  activityPanel.setAttribute("aria-hidden", "true");
  stopActivityPanelRefreshLoop();
}

function setupActivityPanel() {
  activityPanelBtn?.addEventListener("click", () => {
    if (activityPanelOpen) {
      closeActivityPanel();
    } else {
      openActivityPanel();
    }
  });

  activityPanelCloseBtn?.addEventListener("click", () => {
    closeActivityPanel();
  });

  activityOverlay?.addEventListener("click", () => {
    closeActivityPanel();
  });
}

function recordActivity(action, entityType = "", entityName = "", meta = {}) {
  const activeProject = getActiveProject();
  if (!activeProject) {
    return;
  }
  postProjectActivity(activeProject.id, action, entityType, entityName, meta).then(() => {
    if (activityPanelOpen) {
      refreshActivityPanel();
    }
  });
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
      notifyError(t("inviteAcceptError"));
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

async function syncProjectListFromServer() {
  if (!currentUser || saveInFlight || pendingStatePayload) {
    return;
  }
  const summary = await loadProjectsSummary();
  if (!summary) {
    return;
  }
  const nextFingerprint = buildProjectsSummaryFingerprint(summary);
  if (nextFingerprint === projectsSummaryFingerprint) {
    return;
  }
  await refreshProjectsFromServer(state.activeProjectId, true);
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
  if (activityPanelBtn) {
    activityPanelBtn.disabled = !activeProject;
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
      if (activityPanelOpen) {
        refreshActivityPanel();
      }
    });
    tab.addEventListener("dblclick", async () => {
      if (!canEditProject(project.id)) {
        alert(t("readOnlyProject"));
        return;
      }
      const name = await openProjectNameModal({
        title: t("renameProjectTitle"),
        label: t("renameProjectLabel"),
        okText: t("renameProjectOk"),
        defaultValue: project.name,
      });
      if (name === null) return;
      const cleanName = name.trim();
      if (!cleanName || cleanName === project.name) return;

      const response = await apiRequest(`/api/projects/${encodeURIComponent(project.id)}`, {
        method: "PATCH",
        body: { name: cleanName },
        retries: 1,
      });
      if (!response.ok) {
        notifyError(t("projectRenameError"));
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
    collapseAllBtn.title = allExpanded ? t("collapseAll") : t("expandAll");

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
      column.title = titleInput.value.trim() || t("untitled");
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
        alert(t("atLeastOneColumn"));
        return;
      }
      const shouldDelete = await openProjectStyleConfirm({
        title: t("columnDeleteTitle"),
        message: t("columnDeleteMessage", { name: column.title }),
        confirmText: t("confirmDelete"),
      });
      if (!shouldDelete) {
        return;
      }
      project.columns = project.columns.filter((entry) => entry.id !== column.id);
      saveAndRender();
      recordActivity("column_deleted", "column", column.title);
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
      recordActivity("card_moved", "card", moved.title || "");
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
      const movedColumn = project.columns.find((entry) => entry.id === dragColumnId);
      moveColumn(project, dragColumnId, column.id);
      dragColumnId = null;
      saveAndRender();
      recordActivity("column_moved", "column", movedColumn?.title || "");
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
        const labels = { low: t("priorityBadgeLow"), medium: t("priorityBadgeMedium"), high: t("priorityBadgeHigh") };
        priorityBadge.textContent = labels[priority];
        priorityBadge.className = `card-priority-badge priority-badge-${priority}`;
      }
      if (dateNode && card.dueDate) {
        const d = new Date(card.dueDate + "T12:00:00");
        const dateLocale = currentLocale === "en" ? "en-US" : "de-DE";
        dateNode.textContent = d.toLocaleDateString(dateLocale, { day: "2-digit", month: "short" });
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
        summary.textContent = t("checklistSummary", { done: doneCount, total: card.checklist.length });
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
        const shouldDelete = await openProjectStyleConfirm({
          title: t("cardDeleteTitle"),
          message: t("cardDeleteMessage", { name: card.title }),
          confirmText: t("confirmDelete"),
        });
        if (!shouldDelete) {
          return;
        }
        column.cards = column.cards.filter((entry) => entry.id !== card.id);
        saveAndRender();
        recordActivity("card_deleted", "card", card.title);
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
    itemModalTitle.textContent = t("itemModalNewTitle");
    itemPrimaryBtn.textContent = t("add");
    itemSecondaryBtn.textContent = t("cancel");
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
    itemModalTitle.textContent = t("itemModalEditTitle");
    itemPrimaryBtn.textContent = t("save");
    itemSecondaryBtn.textContent = t("close");
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
  row.dataset.itemId = typeof item?.id === "string" && item.id ? item.id : generateId();

  const done = document.createElement("input");
  done.type = "checkbox";
  done.className = "checklist-editor-done";
  done.checked = Boolean(item?.done);

  const text = document.createElement("input");
  text.type = "text";
  text.className = "checklist-editor-text";
  text.placeholder = t("checklistItemPlaceholder");
  text.maxLength = 240;
  text.value = typeof item?.text === "string" ? item.text : "";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "checklist-editor-remove";
  removeBtn.textContent = "×";
  removeBtn.title = t("checklistRemove");
  removeBtn.setAttribute("aria-label", t("checklistRemove"));
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
        id: row.dataset.itemId || generateId(),
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
      return mult * a.title.localeCompare(b.title, currentLocale === "en" ? "en" : "de");
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
      confirmInputLabel.textContent = t("confirmTypeLabel");
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
      alert(t("shareReadonlyError"));
      return;
    }

    shareCreateBtn.disabled = true;
    shareCreateBtn.textContent = t("shareCreateBusy");
    const role = shareRoleInput.value === "viewer" ? "viewer" : "editor";
    const invite = await createInviteForProject(projectId, { role });
    shareCreateBtn.disabled = false;
    shareCreateBtn.textContent = t("shareCreateLink");

    if (!invite?.inviteUrl) {
      alert(t("shareCreateError"));
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
      shareCopyBtn.textContent = t("shareCopied");
      setTimeout(() => {
        shareCopyBtn.textContent = t("shareCopy");
      }, 1200);
    } catch {
      shareLinkInput.focus();
      shareLinkInput.select();
      alert(t("copyFailed"));
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
    shareCreateBtn.textContent = t("shareCreateLink");
    shareCopyBtn.textContent = t("shareCopy");
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
    membersList.innerHTML = `<div class="member-row"><div class="member-meta"><div class="member-name">${t("membersLoad")}</div></div></div>`;
  }

  const payload = await loadProjectMembers(membersProjectId);
  if (!payload) {
    notifyError(t("memberLoadFailed"));
    if (membersList) {
      membersList.innerHTML =
        `<div class="member-row"><div class="member-meta"><div class="member-name">${t("membersLoadError")}</div></div></div>`;
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
    empty.innerHTML = `<div class="member-meta"><div class="member-name">${t("membersEmpty")}</div></div>`;
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
    nameEl.textContent = member.name || member.email || t("membersUnknown");
    if (member.userId === currentUserId) {
      nameEl.textContent += t("youSuffix");
    }

    const emailEl = document.createElement("div");
    emailEl.className = "member-email";
    emailEl.textContent = member.email || "";

    meta.appendChild(nameEl);
    meta.appendChild(emailEl);

    const roleControl = document.createElement("select");
    roleControl.className = "member-role-select";

    [
      { value: "owner", label: t("roleOwner") },
      { value: "editor", label: t("roleEditor") },
      { value: "viewer", label: t("roleViewer") },
      { value: "remove", label: t("roleRemove") },
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
      notifyError(t("membersUpdateFailed"));
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
  confirmText = t("confirmDelete"),
  requireText = null,
  requireTextLabel = t("confirmTypeLabel"),
}) {
  if (!confirmModal || !confirmTitle || !confirmMessage || !confirmOkBtn) {
    return Promise.resolve(confirm(message));
  }

  confirmTitle.textContent = title || t("confirmDefaultTitle");
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

function setupProjectSidebar() {
  if (!projectSidebarToggle) {
    return;
  }

  const applySidebarMode = () => {
    if (isMobileSidebarLayout()) {
      document.body.classList.remove("sidebar-collapsed");
      document.body.classList.remove("sidebar-open-mobile");
    } else {
      document.body.classList.remove("sidebar-open-mobile");
      document.body.classList.toggle("sidebar-collapsed", sidebarCollapsedPreferred);
    }
    syncSidebarToggleButton();
  };

  projectSidebarToggle.addEventListener("click", () => {
    if (isMobileSidebarLayout()) {
      const nextOpen = !document.body.classList.contains("sidebar-open-mobile");
      document.body.classList.toggle("sidebar-open-mobile", nextOpen);
    } else {
      sidebarCollapsedPreferred = !document.body.classList.contains("sidebar-collapsed");
      document.body.classList.toggle("sidebar-collapsed", sidebarCollapsedPreferred);
      persistSidebarCollapsedPreference(sidebarCollapsedPreferred);
    }
    syncSidebarToggleButton();
  });

  window.addEventListener("resize", () => {
    applySidebarMode();
  });

  applySidebarMode();
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

function setupLocaleMenu() {
  if (!localeDeBtn || !localeEnBtn) {
    return;
  }

  localeDeBtn.addEventListener("click", () => {
    setLocale("de");
  });

  localeEnBtn.addEventListener("click", () => {
    setLocale("en");
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
