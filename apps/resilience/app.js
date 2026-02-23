/* ── Resilience App ─────────────────────────────────────────────── */

// DOM refs
const sidebarNav = document.getElementById("sidebar-nav");
const sidebarToggle = document.getElementById("sidebar-toggle");
const userMenuToggle = document.getElementById("user-menu-toggle");
const userMenu = document.getElementById("user-menu");
const userInitials = document.getElementById("user-initials");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");
const localeDeBtn = document.getElementById("locale-de-btn");
const localeEnBtn = document.getElementById("locale-en-btn");

// Settings DOM refs
const feedUrlInput = document.getElementById("feed-url-input");
const feedAddBtn = document.getElementById("feed-add-btn");
const feedHint = document.getElementById("feed-hint");
const feedList = document.getElementById("feed-list");
const feedListEmpty = document.getElementById("feed-list-empty");
const retentionSelect = document.getElementById("retention-select");
const refreshSelect = document.getElementById("refresh-select");
const settingsSaveBtn = document.getElementById("settings-save-btn");

// GDACS Settings DOM refs
const gdacsCountryInput = document.getElementById("gdacs-country-input");
const gdacsCountryAddBtn = document.getElementById("gdacs-country-add-btn");
const gdacsCountryHint = document.getElementById("gdacs-country-hint");
const gdacsCountryList = document.getElementById("gdacs-country-list");
const gdacsCountryListEmpty = document.getElementById("gdacs-country-list-empty");
const gdacsRefreshSelect = document.getElementById("gdacs-refresh-select");
const gdacsSettingsSaveBtn = document.getElementById("gdacs-settings-save-btn");

// News DOM refs
const newsListView = document.getElementById("news-list-view");
const newsDetailView = document.getElementById("news-detail-view");
const newsDetailContent = document.getElementById("news-detail-content");
const newsBackBtn = document.getElementById("news-back-btn");
const newsTbody = document.getElementById("news-tbody");
const newsEmpty = document.getElementById("news-empty");
const newsPagination = document.getElementById("news-pagination");
const newsRefreshBtn = document.getElementById("news-refresh-btn");

// GDACS Search DOM refs
const gdacsCountry = document.getElementById("gdacs-country");
const gdacsDays = document.getElementById("gdacs-days");
const gdacsTypes = document.getElementById("gdacs-types");
const gdacsAlert = document.getElementById("gdacs-alert");
const gdacsSearchBtn = document.getElementById("gdacs-search-btn");
const gdacsResultsCount = document.getElementById("gdacs-results-count");
const gdacsTableWrap = document.getElementById("gdacs-table-wrap");
const gdacsTbody = document.getElementById("gdacs-tbody");
const gdacsEmpty = document.getElementById("gdacs-empty");
const gdacsError = document.getElementById("gdacs-error");

// GDACS Alerts DOM refs
const alertsContent = document.getElementById("alerts-content");
const alertsEmpty = document.getElementById("alerts-empty");
const alertsPagination = document.getElementById("alerts-pagination");
const alertsRefreshBtn = document.getElementById("alerts-refresh-btn");

// Docs DOM refs
const docsNav = document.getElementById("docs-nav");
const docsContentEl = document.getElementById("docs-content");

// ── i18n ──────────────────────────────────────────────────────────
const I18N = {
  de: {
    brandText: "Resilience",
    dashboard: "Dashboard",
    settings: "Einstellungen",
    docs: "Dokumentation",
    sectionTools: "Tools",
    sectionSources: "Quellen & Daten",
    indicators: "Indikatoren",
    gdacs: "GDACS",
    aiMapping: "AI Mapping",
    aasData: "AAS Daten",
    newsFeeds: "News Feeds",
    gdacsAlerts: "GDACS Alerts",
    dashboardTitle: "Resilience Dashboard",
    dashboardDesc: "Übersicht der Resilienz-Tools für deine Lieferkette.",
    indicatorsTitle: "Indikatoren",
    indicatorsDesc: "Überwache Resilienz-Indikatoren deiner Lieferkette.",
    aiMappingTitle: "AI Mapping",
    aiMappingDesc: "KI-gestützte Zuordnung und Analyse.",
    gdacsTitle: "GDACS",
    gdacsDescPre: "Naturkatastrophen-Daten vom",
    gdacsDescLink: "Global Disaster Alert and Coordination System",
    aasDataTitle: "AAS Daten",
    aasDataDesc: "Verwaltungsschalen-Daten zu Lieferanten, Produkten und Materialien.",
    newsFeedsTitle: "News Feeds",
    newsFeedsDesc: "Externe Nachrichten und Informationsquellen.",
    gdacsAlertsTitle: "GDACS Alerts",
    gdacsAlertsDesc: "Gespeicherte Naturkatastrophen-Meldungen für deine überwachten Länder.",
    settingsTitle: "Einstellungen",
    settingsDesc: "Konfiguriere die Resilience-App.",
    docsTitle: "Dokumentation",
    docsDesc: "Anleitungen und Informationen zu den Resilienz-Tools.",
    logout: "Logout",
    sidebarCollapse: "Navigation einklappen",
    sidebarExpand: "Navigation ausklappen",
    backToDashboard: "Zurück zum Dashboard",
    // Settings — News Feeds
    feedSectionTitle: "News Feeds",
    feedUrlPlaceholder: "Feed-URL eingeben…",
    feedAdd: "Hinzufügen",
    feedEmpty: "Noch keine Feeds konfiguriert.",
    feedAdded: "Feed hinzugefügt.",
    feedRemoved: "Feed entfernt.",
    feedInvalidUrl: "Ungültige Feed-URL.",
    feedParseFailed: "Feed konnte nicht gelesen werden.",
    feedExists: "Dieser Feed ist bereits vorhanden.",
    retentionLabel: "Aufbewahrung",
    refreshLabel: "Abruf-Intervall",
    settingsSave: "Speichern",
    settingsSaved: "Einstellungen gespeichert.",
    feedPurge: "Alle News löschen",
    feedPurgeConfirm: "Alle gespeicherten News-Einträge unwiderruflich löschen?",
    feedPurged: "Alle News gelöscht.",
    // Settings — GDACS
    gdacsSettingsTitle: "GDACS Länderüberwachung",
    gdacsCountryInputPlaceholder: "Land eingeben…",
    gdacsCountryAdd: "Hinzufügen",
    gdacsCountryEmpty: "Noch keine Länder konfiguriert.",
    gdacsCountryAdded: "Land hinzugefügt.",
    gdacsCountryRemoved: "Land entfernt.",
    gdacsCountryExists: "Dieses Land ist bereits vorhanden.",
    gdacsSettingsRefreshLabel: "Abruf-Intervall",
    gdacsSettingsSave: "Speichern",
    gdacsSettingsSaved: "Einstellungen gespeichert.",
    gdacsPurge: "Alle Alerts löschen",
    gdacsPurgeConfirm: "Alle gespeicherten GDACS-Alerts unwiderruflich löschen?",
    gdacsPurged: "Alle Alerts gelöscht.",
    // News table
    newsThId: "ID",
    newsThTitle: "Titel",
    newsThPublished: "Veröffentlicht",
    newsThStored: "Gespeichert",
    newsRefresh: "Aktualisieren",
    newsRefreshing: "Lädt…",
    newsEmptyText: "Keine News vorhanden. Füge Feeds in den Einstellungen hinzu.",
    newsTotal: "Einträge",
    newsPrev: "Zurück",
    newsNext: "Weiter",
    // News detail
    newsBack: "Zurück",
    newsDetailSource: "Quelle",
    newsDetailPublished: "Veröffentlicht",
    newsDetailStored: "Gespeichert",
    newsDetailLink: "Original öffnen",
    newsDetailNoContent: "Kein Inhalt verfügbar.",
    // GDACS Search
    gdacsSectionTitle: "GDACS Naturkatastrophen",
    gdacsCountryLabel: "Land",
    gdacsCountryPlaceholder: "z.B. Germany, Turkey…",
    gdacsDaysLabel: "Zeitraum",
    gdacsAlertLabel: "Warnstufe",
    gdacsAlertAll: "Alle",
    gdacsAlertOrangeRed: "Orange + Rot",
    gdacsAlertRed: "Nur Rot",
    gdacsSearch: "Suchen",
    gdacsSearching: "Suche…",
    gdacsThType: "Typ",
    gdacsThName: "Ereignis",
    gdacsThCountry: "Land",
    gdacsThAlert: "Warnstufe",
    gdacsThSeverity: "Schwere",
    gdacsThDate: "Datum",
    gdacsEmpty: "Keine Ereignisse gefunden.",
    gdacsError: "Fehler bei der GDACS-Abfrage.",
    gdacsTimeout: "GDACS-Server antwortet nicht. Bitte später erneut versuchen.",
    gdacsResultCount: "Ergebnisse",
    "gdacs.days.7": "7 Tage",
    "gdacs.days.14": "14 Tage",
    "gdacs.days.30": "30 Tage",
    "gdacs.days.90": "90 Tage",
    "gdacs.days.365": "1 Jahr",
    gdacsTypeEQ: "Erdbeben",
    gdacsTypeTC: "Sturm",
    gdacsTypeFL: "Flut",
    gdacsTypeVO: "Vulkan",
    gdacsTypeWF: "Waldbrand",
    gdacsTypeDR: "Dürre",
    // GDACS Alerts page
    alertsRefresh: "Aktualisieren",
    alertsRefreshing: "Lädt…",
    alertsEmpty: "Keine Alerts vorhanden. Füge Länder in den Einstellungen hinzu.",
    alertsTotal: "Einträge",
    alertsPrev: "Zurück",
    alertsNext: "Weiter",
    // Dashboard tiles
    dashNewsTitle: "Letzte News",
    dashNewsLink: "Alle anzeigen \u2192",
    dashNewsEmpty: "Keine News vorhanden.",
    dashAlertsTitle: "GDACS Alerts",
    dashAlertsLink: "Alle anzeigen \u2192",
    dashAlertsEmpty: "Keine Alerts vorhanden.",
    // Docs nav
    docsOverview: "Übersicht",
    docsNewsFeeds: "News Feeds",
    docsGdacsSearch: "GDACS Suche",
    docsGdacsAlerts: "GDACS Alerts",
    docsDashboard: "Dashboard",
    docsSettings: "Einstellungen",
    // Retention options
    "ret.7": "7 Tage",
    "ret.14": "14 Tage",
    "ret.30": "30 Tage",
    "ret.60": "60 Tage",
    "ret.90": "90 Tage",
    // Refresh options
    "ref.15": "15 Min.",
    "ref.30": "30 Min.",
    "ref.60": "1 Std.",
    "ref.360": "6 Std.",
    "ref.1440": "24 Std.",
  },
  en: {
    brandText: "Resilience",
    dashboard: "Dashboard",
    settings: "Settings",
    docs: "Documentation",
    sectionTools: "Tools",
    sectionSources: "Sources & Data",
    indicators: "Indicators",
    gdacs: "GDACS",
    aiMapping: "AI Mapping",
    aasData: "AAS Data",
    newsFeeds: "News Feeds",
    gdacsAlerts: "GDACS Alerts",
    dashboardTitle: "Resilience Dashboard",
    dashboardDesc: "Overview of resilience tools for your supply chain.",
    indicatorsTitle: "Indicators",
    indicatorsDesc: "Monitor resilience indicators of your supply chain.",
    aiMappingTitle: "AI Mapping",
    aiMappingDesc: "AI-powered mapping and analysis.",
    gdacsTitle: "GDACS",
    gdacsDescPre: "Natural disaster data from the",
    gdacsDescLink: "Global Disaster Alert and Coordination System",
    aasDataTitle: "AAS Data",
    aasDataDesc: "Asset Administration Shell data for suppliers, products and materials.",
    newsFeedsTitle: "News Feeds",
    newsFeedsDesc: "External news and information sources.",
    gdacsAlertsTitle: "GDACS Alerts",
    gdacsAlertsDesc: "Stored natural disaster alerts for your monitored countries.",
    settingsTitle: "Settings",
    settingsDesc: "Configure the Resilience app.",
    docsTitle: "Documentation",
    docsDesc: "Guides and information about the resilience tools.",
    logout: "Logout",
    sidebarCollapse: "Collapse navigation",
    sidebarExpand: "Expand navigation",
    backToDashboard: "Back to dashboard",
    // Settings — News Feeds
    feedSectionTitle: "News Feeds",
    feedUrlPlaceholder: "Enter feed URL…",
    feedAdd: "Add",
    feedEmpty: "No feeds configured yet.",
    feedAdded: "Feed added.",
    feedRemoved: "Feed removed.",
    feedInvalidUrl: "Invalid feed URL.",
    feedParseFailed: "Could not read feed.",
    feedExists: "This feed already exists.",
    retentionLabel: "Retention",
    refreshLabel: "Refresh interval",
    settingsSave: "Save",
    settingsSaved: "Settings saved.",
    feedPurge: "Delete all news",
    feedPurgeConfirm: "Permanently delete all stored news items?",
    feedPurged: "All news deleted.",
    // Settings — GDACS
    gdacsSettingsTitle: "GDACS Country Monitoring",
    gdacsCountryInputPlaceholder: "Enter country…",
    gdacsCountryAdd: "Add",
    gdacsCountryEmpty: "No countries configured yet.",
    gdacsCountryAdded: "Country added.",
    gdacsCountryRemoved: "Country removed.",
    gdacsCountryExists: "This country already exists.",
    gdacsSettingsRefreshLabel: "Refresh interval",
    gdacsSettingsSave: "Save",
    gdacsSettingsSaved: "Settings saved.",
    gdacsPurge: "Delete all alerts",
    gdacsPurgeConfirm: "Permanently delete all stored GDACS alerts?",
    gdacsPurged: "All alerts deleted.",
    // News table
    newsThId: "ID",
    newsThTitle: "Title",
    newsThPublished: "Published",
    newsThStored: "Stored",
    newsRefresh: "Refresh",
    newsRefreshing: "Loading…",
    newsEmptyText: "No news available. Add feeds in settings.",
    newsTotal: "entries",
    newsPrev: "Previous",
    newsNext: "Next",
    // News detail
    newsBack: "Back",
    newsDetailSource: "Source",
    newsDetailPublished: "Published",
    newsDetailStored: "Stored",
    newsDetailLink: "Open original",
    newsDetailNoContent: "No content available.",
    // GDACS Search
    gdacsSectionTitle: "GDACS Natural Disasters",
    gdacsCountryLabel: "Country",
    gdacsCountryPlaceholder: "e.g. Germany, Turkey…",
    gdacsDaysLabel: "Time range",
    gdacsAlertLabel: "Alert level",
    gdacsAlertAll: "All",
    gdacsAlertOrangeRed: "Orange + Red",
    gdacsAlertRed: "Red only",
    gdacsSearch: "Search",
    gdacsSearching: "Searching…",
    gdacsThType: "Type",
    gdacsThName: "Event",
    gdacsThCountry: "Country",
    gdacsThAlert: "Alert",
    gdacsThSeverity: "Severity",
    gdacsThDate: "Date",
    gdacsEmpty: "No events found.",
    gdacsError: "Error querying GDACS.",
    gdacsTimeout: "GDACS server not responding. Please try again later.",
    gdacsResultCount: "results",
    "gdacs.days.7": "7 days",
    "gdacs.days.14": "14 days",
    "gdacs.days.30": "30 days",
    "gdacs.days.90": "90 days",
    "gdacs.days.365": "1 year",
    gdacsTypeEQ: "Earthquake",
    gdacsTypeTC: "Cyclone",
    gdacsTypeFL: "Flood",
    gdacsTypeVO: "Volcano",
    gdacsTypeWF: "Wildfire",
    gdacsTypeDR: "Drought",
    // GDACS Alerts page
    alertsRefresh: "Refresh",
    alertsRefreshing: "Loading…",
    alertsEmpty: "No alerts available. Add countries in settings.",
    alertsTotal: "entries",
    alertsPrev: "Previous",
    alertsNext: "Next",
    // Dashboard tiles
    dashNewsTitle: "Latest News",
    dashNewsLink: "View all \u2192",
    dashNewsEmpty: "No news available.",
    dashAlertsTitle: "GDACS Alerts",
    dashAlertsLink: "View all \u2192",
    dashAlertsEmpty: "No alerts available.",
    // Docs nav
    docsOverview: "Overview",
    docsNewsFeeds: "News Feeds",
    docsGdacsSearch: "GDACS Search",
    docsGdacsAlerts: "GDACS Alerts",
    docsDashboard: "Dashboard",
    docsSettings: "Settings",
    // Retention options
    "ret.7": "7 days",
    "ret.14": "14 days",
    "ret.30": "30 days",
    "ret.60": "60 days",
    "ret.90": "90 days",
    // Refresh options
    "ref.15": "15 min",
    "ref.30": "30 min",
    "ref.60": "1 hour",
    "ref.360": "6 hours",
    "ref.1440": "24 hours",
  },
};

let locale = localStorage.getItem("kanban-locale") || "de";
let currentUser = null;
let activePage = "dashboard";

// News state
let newsPage = 0;
const NEWS_PER_PAGE = 30;

// Alerts state
let alertsPage = 0;
const ALERTS_PER_PAGE = 30;

// Docs state
let activeDoc = "overview";

// Track where news detail was opened from (for back navigation)
let newsOpenedFrom = null;

function t(key) {
  return (I18N[locale] && I18N[locale][key]) || I18N.de[key] || key;
}

// ── API helper ────────────────────────────────────────────────────
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

// ── Navigation ────────────────────────────────────────────────────
const PAGE_I18N = {
  dashboard: "dashboard",
  indicators: "indicators",
  gdacs: "gdacs",
  "ai-mapping": "aiMapping",
  "aas-data": "aasData",
  "news-feeds": "newsFeeds",
  "gdacs-alerts": "gdacsAlerts",
  settings: "settings",
  docs: "docs",
};

function navigateTo(page) {
  activePage = page;
  sidebarNav.querySelectorAll(".sidebar-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
  document.querySelectorAll(".page-section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === "page-" + page);
  });

  if (page === "dashboard") loadDashboard();
  if (page === "gdacs") applyGdacsLocale();
  if (page === "news-feeds") { showNewsList(); loadNews(); }
  if (page === "gdacs-alerts") loadGdacsAlerts();
  if (page === "settings") loadSettings();
  if (page === "docs") loadDoc(activeDoc);
}

sidebarNav.addEventListener("click", (e) => {
  const btn = e.target.closest(".sidebar-item");
  if (!btn || !btn.dataset.page) return;
  navigateTo(btn.dataset.page);
});

// ── Sidebar toggle ────────────────────────────────────────────────
sidebarToggle.addEventListener("click", () => {
  document.body.classList.toggle("sidebar-collapsed");
  const isCollapsed = document.body.classList.contains("sidebar-collapsed");
  sidebarToggle.title = isCollapsed ? t("sidebarExpand") : t("sidebarCollapse");
  localStorage.setItem("resilience-sidebar-collapsed", isCollapsed ? "1" : "");
});

if (localStorage.getItem("resilience-sidebar-collapsed") === "1") {
  document.body.classList.add("sidebar-collapsed");
}

// ── User menu ─────────────────────────────────────────────────────
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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

// ── Locale ────────────────────────────────────────────────────────
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
  logoutBtn.textContent = t("logout");

  // Sidebar labels
  sidebarNav.querySelectorAll(".sidebar-item").forEach((btn) => {
    const page = btn.dataset.page;
    const label = btn.querySelector(".sidebar-label");
    if (label && page) label.textContent = t(PAGE_I18N[page] || page);
  });

  // Section titles
  sidebarNav.querySelectorAll(".sidebar-section-title").forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });

  const isCollapsed = document.body.classList.contains("sidebar-collapsed");
  sidebarToggle.title = isCollapsed ? t("sidebarExpand") : t("sidebarCollapse");

  const backBtn = document.querySelector(".header-back-btn");
  if (backBtn) backBtn.title = t("backToDashboard");

  // Page titles + descriptions
  const pages = ["dashboard", "indicators", "gdacs", "ai-mapping", "aas-data", "news-feeds", "gdacs-alerts", "settings", "docs"];
  for (const page of pages) {
    const key = PAGE_I18N[page] || page;
    const titleEl = document.getElementById(page + "-title");
    if (titleEl) titleEl.textContent = t(key + "Title");
    if (page === "gdacs") {
      const descEl = document.getElementById("gdacs-desc");
      const linkEl = document.getElementById("gdacs-link");
      if (descEl && linkEl) {
        linkEl.textContent = t("gdacsDescLink");
        descEl.firstChild.textContent = t("gdacsDescPre") + " ";
        descEl.lastChild.textContent = ".";
      }
    } else {
      const descEl = document.getElementById(page + "-desc");
      if (descEl) descEl.textContent = t(key + "Desc");
    }
  }

  // Settings — News Feeds labels
  document.getElementById("feed-section-title").textContent = t("feedSectionTitle");
  feedUrlInput.placeholder = t("feedUrlPlaceholder");
  document.getElementById("feed-add-label").textContent = t("feedAdd");
  document.getElementById("feed-empty-label").textContent = t("feedEmpty");
  document.getElementById("retention-label").textContent = t("retentionLabel");
  document.getElementById("refresh-label").textContent = t("refreshLabel");
  document.getElementById("settings-save-label").textContent = t("settingsSave");
  document.getElementById("feed-purge-label").textContent = t("feedPurge");

  for (const opt of retentionSelect.options) {
    opt.textContent = t("ret." + opt.value);
  }
  for (const opt of refreshSelect.options) {
    opt.textContent = t("ref." + opt.value);
  }

  // Settings — GDACS labels
  document.getElementById("gdacs-settings-title").textContent = t("gdacsSettingsTitle");
  gdacsCountryInput.placeholder = t("gdacsCountryInputPlaceholder");
  document.getElementById("gdacs-country-add-label").textContent = t("gdacsCountryAdd");
  document.getElementById("gdacs-country-empty-label").textContent = t("gdacsCountryEmpty");
  document.getElementById("gdacs-refresh-label").textContent = t("gdacsSettingsRefreshLabel");
  document.getElementById("gdacs-settings-save-label").textContent = t("gdacsSettingsSave");
  document.getElementById("gdacs-purge-label").textContent = t("gdacsPurge");

  for (const opt of gdacsRefreshSelect.options) {
    opt.textContent = t("ref." + opt.value);
  }

  // GDACS Search labels
  applyGdacsLocale();

  // News table headers
  document.getElementById("news-th-id").textContent = t("newsThId");
  document.getElementById("news-th-title").textContent = t("newsThTitle");
  document.getElementById("news-th-stored").textContent = t("newsThStored");
  document.getElementById("news-empty-text").textContent = t("newsEmptyText");
  document.getElementById("news-refresh-label").textContent = t("newsRefresh");
  document.getElementById("news-back-label").textContent = t("newsBack");

  // GDACS Alerts page labels
  document.getElementById("alerts-refresh-label").textContent = t("alertsRefresh");
  document.getElementById("alerts-empty-text").textContent = t("alertsEmpty");

  // Dashboard tile labels
  document.getElementById("dash-news-title").textContent = t("dashNewsTitle");
  document.getElementById("dash-news-link").textContent = t("dashNewsLink");
  document.getElementById("dash-news-empty").textContent = t("dashNewsEmpty");
  document.getElementById("dash-alerts-title").textContent = t("dashAlertsTitle");
  document.getElementById("dash-alerts-link").textContent = t("dashAlertsLink");
  document.getElementById("dash-alerts-empty").textContent = t("dashAlertsEmpty");

  // Docs nav labels
  const docLabels = {
    overview: "docsOverview",
    "news-feeds": "docsNewsFeeds",
    "gdacs-search": "docsGdacsSearch",
    "gdacs-alerts": "docsGdacsAlerts",
    dashboard: "docsDashboard",
    settings: "docsSettings",
  };
  docsNav.querySelectorAll(".docs-nav-item").forEach((btn) => {
    const key = docLabels[btn.dataset.doc];
    if (key) btn.textContent = t(key);
  });

  // Re-render docs if active
  if (activePage === "docs") loadDoc(activeDoc);
}

localeDeBtn.addEventListener("click", () => setLocale("de"));
localeEnBtn.addEventListener("click", () => setLocale("en"));

// ── Helper ────────────────────────────────────────────────────────
function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function truncateId(guid) {
  if (!guid) return "-";
  if (guid.startsWith("http")) {
    try {
      const u = new URL(guid);
      const seg = u.pathname.split("/").filter(Boolean).pop() || u.hostname;
      return seg.length > 16 ? seg.slice(0, 16) + "\u2026" : seg;
    } catch { /* fall through */ }
  }
  return guid.length > 12 ? guid.slice(0, 12) + "\u2026" : guid;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateShort(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  const now = new Date();
  const diff = now - d;
  const day = 86400000;
  if (diff < day && diff >= 0) return locale === "de" ? "Heute" : "Today";
  if (diff < 2 * day && diff >= 0) return locale === "de" ? "Gestern" : "Yesterday";
  return d.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
    day: "2-digit",
    month: "2-digit",
  });
}

function showFeedHint(message, type) {
  feedHint.textContent = message;
  feedHint.className = "settings-hint hint-" + type;
  feedHint.hidden = false;
}

function hideFeedHint() {
  feedHint.hidden = true;
}

function showGdacsCountryHint(message, type) {
  gdacsCountryHint.textContent = message;
  gdacsCountryHint.className = "settings-hint hint-" + type;
  gdacsCountryHint.hidden = false;
}

function hideGdacsCountryHint() {
  gdacsCountryHint.hidden = true;
}

// ── Settings: Feed management ─────────────────────────────────────
let cachedFeeds = [];
let cachedGdacsCountries = [];

async function loadSettings() {
  const result = await apiRequest("/apps/resilience/api/settings");
  if (!result.ok || !result.payload) return;

  const { retention_days, refresh_minutes, feeds, gdacs_refresh_minutes, gdacs_countries } = result.payload;
  cachedFeeds = feeds || [];
  cachedGdacsCountries = gdacs_countries || [];

  retentionSelect.value = String(retention_days);
  refreshSelect.value = String(refresh_minutes);
  gdacsRefreshSelect.value = String(gdacs_refresh_minutes || 60);

  renderFeedList();
  renderGdacsCountryList();
}

function renderFeedList() {
  feedList.innerHTML = "";
  feedListEmpty.hidden = cachedFeeds.length > 0;
  feedList.hidden = cachedFeeds.length === 0;

  for (const feed of cachedFeeds) {
    const item = document.createElement("div");
    item.className = "feed-list-item";

    let errorHtml = "";
    if (feed.last_error) {
      errorHtml = `<span class="feed-error" title="${escapeHtml(feed.last_error)}">!</span>`;
    }

    item.innerHTML = `
      <span class="feed-title">${escapeHtml(feed.title || "Unbekannt")}</span>
      <span class="feed-url">${escapeHtml(feed.url)}</span>
      ${errorHtml}
      <button class="feed-remove-btn" type="button" title="Entfernen" data-feed-id="${feed.feed_id}">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    feedList.appendChild(item);
  }
}

function renderGdacsCountryList() {
  gdacsCountryList.innerHTML = "";
  gdacsCountryListEmpty.hidden = cachedGdacsCountries.length > 0;
  gdacsCountryList.hidden = cachedGdacsCountries.length === 0;

  for (const country of cachedGdacsCountries) {
    const item = document.createElement("div");
    item.className = "feed-list-item";
    item.innerHTML = `
      <span class="feed-title">${escapeHtml(country.name)}</span>
      <span class="feed-url"></span>
      <button class="feed-remove-btn" type="button" title="Entfernen" data-country-id="${country.country_id}">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    gdacsCountryList.appendChild(item);
  }
}

// Add feed
feedAddBtn.addEventListener("click", async () => {
  const url = feedUrlInput.value.trim();
  if (!url) return;

  hideFeedHint();
  feedAddBtn.disabled = true;

  const result = await apiRequest("/apps/resilience/api/feeds", {
    method: "POST",
    body: { url },
  });

  feedAddBtn.disabled = false;

  if (result.ok && result.payload) {
    cachedFeeds.push(result.payload);
    renderFeedList();
    feedUrlInput.value = "";
    showFeedHint(t("feedAdded"), "success");
    setTimeout(hideFeedHint, 3000);
  } else {
    const errKey = result.payload?.error;
    if (errKey === "INVALID_URL") showFeedHint(t("feedInvalidUrl"), "error");
    else if (errKey === "FEED_PARSE_FAILED") showFeedHint(t("feedParseFailed"), "error");
    else if (errKey === "FEED_EXISTS") showFeedHint(t("feedExists"), "error");
    else showFeedHint(t("feedParseFailed"), "error");
  }
});

feedUrlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") feedAddBtn.click();
});

// Remove feed (event delegation)
feedList.addEventListener("click", async (e) => {
  const btn = e.target.closest(".feed-remove-btn");
  if (!btn) return;
  const feedId = btn.dataset.feedId;
  btn.disabled = true;

  const result = await apiRequest(`/apps/resilience/api/feeds/${feedId}`, { method: "DELETE" });

  if (result.ok) {
    cachedFeeds = cachedFeeds.filter((f) => f.feed_id !== feedId);
    renderFeedList();
    showFeedHint(t("feedRemoved"), "success");
    setTimeout(hideFeedHint, 3000);
  }
});

// Save news settings
settingsSaveBtn.addEventListener("click", async () => {
  settingsSaveBtn.disabled = true;
  const result = await apiRequest("/apps/resilience/api/settings", {
    method: "PUT",
    body: {
      retention_days: parseInt(retentionSelect.value),
      refresh_minutes: parseInt(refreshSelect.value),
    },
  });
  settingsSaveBtn.disabled = false;

  if (result.ok) {
    showFeedHint(t("settingsSaved"), "success");
    setTimeout(hideFeedHint, 3000);
  }
});

// Purge all news items
document.getElementById("feed-purge-btn").addEventListener("click", async () => {
  if (!confirm(t("feedPurgeConfirm"))) return;

  const result = await apiRequest("/apps/resilience/api/news", { method: "DELETE" });
  if (result.ok) {
    showFeedHint(t("feedPurged"), "success");
    setTimeout(hideFeedHint, 3000);
  }
});

// ── Settings: GDACS Country management ────────────────────────────
gdacsCountryAddBtn.addEventListener("click", async () => {
  const name = gdacsCountryInput.value.trim();
  if (!name) return;

  hideGdacsCountryHint();
  gdacsCountryAddBtn.disabled = true;

  const result = await apiRequest("/apps/resilience/api/gdacs/countries", {
    method: "POST",
    body: { name },
  });

  gdacsCountryAddBtn.disabled = false;

  if (result.ok && result.payload) {
    cachedGdacsCountries.push(result.payload);
    renderGdacsCountryList();
    gdacsCountryInput.value = "";
    showGdacsCountryHint(t("gdacsCountryAdded"), "success");
    setTimeout(hideGdacsCountryHint, 3000);
  } else {
    const errKey = result.payload?.error;
    if (errKey === "COUNTRY_EXISTS") showGdacsCountryHint(t("gdacsCountryExists"), "error");
    else showGdacsCountryHint(t("gdacsCountryExists"), "error");
  }
});

gdacsCountryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") gdacsCountryAddBtn.click();
});

// Remove country
gdacsCountryList.addEventListener("click", async (e) => {
  const btn = e.target.closest(".feed-remove-btn");
  if (!btn) return;
  const countryId = btn.dataset.countryId;
  btn.disabled = true;

  const result = await apiRequest(`/apps/resilience/api/gdacs/countries/${countryId}`, { method: "DELETE" });

  if (result.ok) {
    cachedGdacsCountries = cachedGdacsCountries.filter((c) => c.country_id !== countryId);
    renderGdacsCountryList();
    showGdacsCountryHint(t("gdacsCountryRemoved"), "success");
    setTimeout(hideGdacsCountryHint, 3000);
  }
});

// Save GDACS settings
gdacsSettingsSaveBtn.addEventListener("click", async () => {
  gdacsSettingsSaveBtn.disabled = true;
  const result = await apiRequest("/apps/resilience/api/settings", {
    method: "PUT",
    body: {
      gdacs_refresh_minutes: parseInt(gdacsRefreshSelect.value),
    },
  });
  gdacsSettingsSaveBtn.disabled = false;

  if (result.ok) {
    showGdacsCountryHint(t("gdacsSettingsSaved"), "success");
    setTimeout(hideGdacsCountryHint, 3000);
  }
});

// Purge all GDACS alerts
document.getElementById("gdacs-purge-btn").addEventListener("click", async () => {
  if (!confirm(t("gdacsPurgeConfirm"))) return;

  const result = await apiRequest("/apps/resilience/api/gdacs/alerts", { method: "DELETE" });
  if (result.ok) {
    showGdacsCountryHint(t("gdacsPurged"), "success");
    setTimeout(hideGdacsCountryHint, 3000);
  }
});

// ── News Feeds: Refresh button ────────────────────────────────────
newsRefreshBtn.addEventListener("click", async () => {
  newsRefreshBtn.disabled = true;
  newsRefreshBtn.classList.add("btn-refreshing");
  document.getElementById("news-refresh-label").textContent = t("newsRefreshing");

  await apiRequest("/apps/resilience/api/feeds/refresh", { method: "POST" });

  newsRefreshBtn.disabled = false;
  newsRefreshBtn.classList.remove("btn-refreshing");
  document.getElementById("news-refresh-label").textContent = t("newsRefresh");

  newsPage = 0;
  await loadNews();
});

// ── News Feeds: List / Detail toggle ──────────────────────────────
function showNewsList() {
  newsListView.hidden = false;
  newsDetailView.hidden = true;
}

function showNewsDetail() {
  newsListView.hidden = true;
  newsDetailView.hidden = false;
}

newsBackBtn.addEventListener("click", () => {
  if (newsOpenedFrom) {
    const target = newsOpenedFrom;
    newsOpenedFrom = null;
    navigateTo(target);
  } else {
    showNewsList();
  }
});

// ── News Feeds: Table ─────────────────────────────────────────────
async function loadNews() {
  const offset = newsPage * NEWS_PER_PAGE;
  const result = await apiRequest(`/apps/resilience/api/news?limit=${NEWS_PER_PAGE}&offset=${offset}`);
  if (!result.ok || !result.payload) return;

  const { items, total } = result.payload;

  // Toggle empty state
  const hasItems = items.length > 0 || newsPage > 0;
  newsEmpty.hidden = hasItems;
  document.getElementById("news-table").style.display = hasItems ? "" : "none";

  // Render rows
  newsTbody.innerHTML = "";
  for (const item of items) {
    const tr = document.createElement("tr");
    tr.dataset.itemId = item.item_id;
    tr.innerHTML = `
      <td class="news-td-id" title="${escapeHtml(item.guid || "")}">${escapeHtml(truncateId(item.guid))}</td>
      <td class="news-td-title">${escapeHtml(item.title || "-")}</td>
      <td class="news-td-stored">${formatDate(item.created_at)}</td>
      <td class="news-td-link">${item.link ? `<a class="news-link-btn" href="${escapeHtml(item.link)}" target="_blank" rel="noopener" title="Öffnen"><svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ""}</td>
    `;
    newsTbody.appendChild(tr);
  }

  // Pagination
  const totalPages = Math.ceil(total / NEWS_PER_PAGE);
  if (total === 0) {
    newsPagination.innerHTML = "";
    return;
  }

  let pagHtml = `<span class="pag-total">${total} ${t("newsTotal")}</span>`;
  if (totalPages > 1) {
    pagHtml += `<div class="pag-controls">`;
    pagHtml += `<button class="pag-btn" id="news-prev" ${newsPage === 0 ? "disabled" : ""}>${t("newsPrev")}</button>`;
    pagHtml += `<span>${newsPage + 1} / ${totalPages}</span>`;
    pagHtml += `<button class="pag-btn" id="news-next" ${newsPage >= totalPages - 1 ? "disabled" : ""}>${t("newsNext")}</button>`;
    pagHtml += `</div>`;
  }
  newsPagination.innerHTML = pagHtml;

  const prevBtn = document.getElementById("news-prev");
  const nextBtn = document.getElementById("news-next");
  if (prevBtn) prevBtn.addEventListener("click", () => { newsPage--; loadNews(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { newsPage++; loadNews(); });
}

// ── News Feeds: Row click → detail view ───────────────────────────
newsTbody.addEventListener("click", (e) => {
  if (e.target.closest(".news-link-btn")) return;
  const tr = e.target.closest("tr[data-item-id]");
  if (!tr) return;
  loadNewsDetail(tr.dataset.itemId);
});

async function loadNewsDetail(itemId) {
  showNewsDetail();
  newsDetailContent.innerHTML = `<div class="news-detail-empty">\u2026</div>`;

  const result = await apiRequest(`/apps/resilience/api/news/${itemId}`);
  if (!result.ok || !result.payload) {
    newsDetailContent.innerHTML = `<div class="news-detail-empty">${t("newsDetailNoContent")}</div>`;
    return;
  }

  const item = result.payload;

  let metaHtml = "";
  metaHtml += `<span class="meta-item"><span class="meta-label">ID:</span> ${escapeHtml(item.guid || "-")}</span>`;
  if (item.feed_title) {
    metaHtml += `<span class="meta-item"><span class="meta-label">${t("newsDetailSource")}:</span> ${escapeHtml(item.feed_title)}</span>`;
  }
  if (item.pub_date) {
    metaHtml += `<span class="meta-item"><span class="meta-label">${t("newsDetailPublished")}:</span> ${formatDate(item.pub_date)}</span>`;
  }
  if (item.created_at) {
    metaHtml += `<span class="meta-item"><span class="meta-label">${t("newsDetailStored")}:</span> ${formatDate(item.created_at)}</span>`;
  }
  if (item.link) {
    metaHtml += `<span class="meta-item"><a href="${escapeHtml(item.link)}" target="_blank" rel="noopener">${t("newsDetailLink")} \u2197</a></span>`;
  }

  const contentRaw = item.content || item.description || "";
  const isHtml = /<[a-z][\s\S]*>/i.test(contentRaw);
  const contentHtml = isHtml
    ? contentRaw
    : `<p>${escapeHtml(contentRaw).replace(/\n/g, "<br>")}</p>`;

  newsDetailContent.innerHTML = `
    <div class="news-detail-header">
      <h3>${escapeHtml(item.title || "-")}</h3>
      <div class="news-detail-meta">${metaHtml}</div>
    </div>
    ${contentRaw
      ? `<div class="news-detail-content">${contentHtml}</div>`
      : `<div class="news-detail-empty">${t("newsDetailNoContent")}</div>`
    }
  `;
}

// ── GDACS Search ──────────────────────────────────────────────
const GDACS_TYPE_ICONS = { EQ: "\u{1F30D}", TC: "\u{1F300}", FL: "\u{1F30A}", VO: "\u{1F30B}", WF: "\u{1F525}", DR: "\u2600\uFE0F" };

function applyGdacsLocale() {
  document.getElementById("gdacs-section-title").textContent = t("gdacsSectionTitle");
  document.getElementById("gdacs-country-label").textContent = t("gdacsCountryLabel");
  gdacsCountry.placeholder = t("gdacsCountryPlaceholder");
  document.getElementById("gdacs-days-label").textContent = t("gdacsDaysLabel");
  document.getElementById("gdacs-alert-label").textContent = t("gdacsAlertLabel");
  document.getElementById("gdacs-alert-all").textContent = t("gdacsAlertAll");
  document.getElementById("gdacs-alert-orange-red").textContent = t("gdacsAlertOrangeRed");
  document.getElementById("gdacs-alert-red").textContent = t("gdacsAlertRed");
  document.getElementById("gdacs-search-label").textContent = t("gdacsSearch");
  document.getElementById("gdacs-th-type").textContent = t("gdacsThType");
  document.getElementById("gdacs-th-name").textContent = t("gdacsThName");
  document.getElementById("gdacs-th-country").textContent = t("gdacsThCountry");
  document.getElementById("gdacs-th-alert").textContent = t("gdacsThAlert");
  document.getElementById("gdacs-th-severity").textContent = t("gdacsThSeverity");
  document.getElementById("gdacs-th-date").textContent = t("gdacsThDate");
  document.getElementById("gdacs-empty-text").textContent = t("gdacsEmpty");

  for (const opt of gdacsDays.options) {
    opt.textContent = t("gdacs.days." + opt.value);
  }

  gdacsTypes.querySelectorAll("[data-gdacs-type]").forEach((span) => {
    span.textContent = t("gdacsType" + span.dataset.gdacsType);
  });
}

gdacsSearchBtn.addEventListener("click", performGdacsSearch);

gdacsCountry.addEventListener("keydown", (e) => {
  if (e.key === "Enter") performGdacsSearch();
});

async function performGdacsSearch() {
  const country = gdacsCountry.value.trim();
  const days = gdacsDays.value;
  const alertlevel = gdacsAlert.value;
  const checked = [...gdacsTypes.querySelectorAll("input:checked")].map((cb) => cb.value);

  if (checked.length === 0) {
    gdacsError.textContent = t("gdacsEmpty");
    gdacsError.hidden = false;
    gdacsTableWrap.hidden = true;
    gdacsEmpty.hidden = true;
    gdacsResultsCount.hidden = true;
    return;
  }

  const eventlist = checked.join(",");
  const params = new URLSearchParams({ days, eventlist, alertlevel });
  if (country) params.set("country", country);

  // UI: loading state
  gdacsSearchBtn.disabled = true;
  document.getElementById("gdacs-search-label").innerHTML = `<span class="gdacs-spinner"></span>${escapeHtml(t("gdacsSearching"))}`;
  gdacsError.hidden = true;
  gdacsEmpty.hidden = true;
  gdacsTableWrap.hidden = true;
  gdacsResultsCount.hidden = true;

  // Show skeleton loader
  const skeletonWrap = document.getElementById("gdacs-skeleton");
  if (skeletonWrap) {
    skeletonWrap.innerHTML = Array.from({ length: 5 }, () =>
      `<div class="gdacs-skeleton-row">${Array.from({ length: 5 }, () => `<div class="gdacs-skeleton-cell"></div>`).join("")}</div>`
    ).join("");
    skeletonWrap.hidden = false;
  }

  const result = await apiRequest(`/apps/resilience/api/gdacs/search?${params}`);

  gdacsSearchBtn.disabled = false;
  document.getElementById("gdacs-search-label").textContent = t("gdacsSearch");
  const skeletonEl = document.getElementById("gdacs-skeleton");
  if (skeletonEl) skeletonEl.hidden = true;

  if (!result.ok || !result.payload) {
    const errKey = result.payload?.error === "GDACS_TIMEOUT" ? "gdacsTimeout" : "gdacsError";
    gdacsError.textContent = t(errKey);
    gdacsError.hidden = false;
    return;
  }

  const { events, total } = result.payload;

  if (total === 0) {
    gdacsEmpty.hidden = false;
    return;
  }

  gdacsResultsCount.textContent = `${total} ${t("gdacsResultCount")}`;
  gdacsResultsCount.hidden = false;

  gdacsTbody.innerHTML = "";
  for (const ev of events) {
    const tr = document.createElement("tr");

    const icon = GDACS_TYPE_ICONS[ev.eventtype] || "";
    const alertClass = ev.alertlevel === "Red" ? "alert-red" : ev.alertlevel === "Orange" ? "alert-orange" : "alert-green";

    tr.innerHTML = `
      <td class="gdacs-td-type">${icon}</td>
      <td class="gdacs-td-name">${escapeHtml(ev.name || "-")}</td>
      <td class="gdacs-td-country">${escapeHtml(ev.country || "-")}</td>
      <td class="gdacs-td-alert"><span class="alert-badge ${alertClass}">${escapeHtml(ev.alertlevel)}</span></td>
      <td class="gdacs-td-severity">${escapeHtml(ev.severity || "-")}</td>
      <td class="gdacs-td-date">${formatDate(ev.fromdate)}</td>
      <td class="gdacs-td-link">${ev.url ? `<a class="news-link-btn" href="${escapeHtml(ev.url)}" target="_blank" rel="noopener" title="GDACS"><svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ""}</td>
    `;
    gdacsTbody.appendChild(tr);
  }

  gdacsTableWrap.hidden = false;
}

// ── Dashboard ─────────────────────────────────────────────────────
async function loadDashboard() {
  const dashNewsBody = document.getElementById("dash-news-body");
  const dashAlertsBody = document.getElementById("dash-alerts-body");

  const [newsResult, alertsResult] = await Promise.all([
    apiRequest("/apps/resilience/api/news?limit=8"),
    apiRequest("/apps/resilience/api/gdacs/alerts?limit=8"),
  ]);

  // News tile
  if (newsResult.ok && newsResult.payload && newsResult.payload.items.length > 0) {
    dashNewsBody.innerHTML = newsResult.payload.items
      .map((item) => `
        <div class="dash-item" data-nav-page="news-feeds" data-item-id="${item.item_id}">
          <span class="dash-item-title">${escapeHtml(item.title || "-")}</span>
          <span class="dash-item-date">${formatDateShort(item.created_at)}</span>
        </div>
      `)
      .join("");
  } else {
    dashNewsBody.innerHTML = `<div class="dash-card-empty">${t("dashNewsEmpty")}</div>`;
  }

  // Alerts tile
  if (alertsResult.ok && alertsResult.payload && alertsResult.payload.items.length > 0) {
    dashAlertsBody.innerHTML = alertsResult.payload.items
      .map((a) => {
        const icon = GDACS_TYPE_ICONS[a.eventtype] || "";
        const alertClass = a.alertlevel === "Red" ? "alert-red" : a.alertlevel === "Orange" ? "alert-orange" : "alert-green";
        return `
          <div class="dash-item" data-nav-page="gdacs-alerts">
            <span class="dash-item-icon">${icon}</span>
            <span class="dash-item-title">${escapeHtml(a.name || "-")}</span>
            <span class="alert-badge ${alertClass}" style="font-size:0.68rem">${escapeHtml(a.alertlevel)}</span>
            <span class="dash-item-date">${formatDateShort(a.fromdate)}</span>
            ${a.url ? `<a class="news-link-btn" href="${escapeHtml(a.url)}" target="_blank" rel="noopener" title="GDACS"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ""}
          </div>
        `;
      })
      .join("");
  } else {
    dashAlertsBody.innerHTML = `<div class="dash-card-empty">${t("dashAlertsEmpty")}</div>`;
  }
}

// Dashboard click handlers
document.getElementById("dashboard-grid").addEventListener("click", (e) => {
  const item = e.target.closest(".dash-item[data-nav-page]");
  if (item) {
    // Don't navigate if clicking on a link button inside the item
    if (e.target.closest(".news-link-btn")) return;
    const page = item.dataset.navPage;
    if (page === "news-feeds" && item.dataset.itemId) {
      newsOpenedFrom = "dashboard";
      navigateTo(page);
      loadNewsDetail(item.dataset.itemId);
    } else {
      navigateTo(page);
    }
    return;
  }
  const link = e.target.closest(".dash-card-link");
  if (link) {
    e.preventDefault();
    const page = link.dataset.nav;
    if (page) navigateTo(page);
  }
});

// ── GDACS Alerts Page ─────────────────────────────────────────────
alertsRefreshBtn.addEventListener("click", async () => {
  alertsRefreshBtn.disabled = true;
  alertsRefreshBtn.classList.add("btn-refreshing");
  document.getElementById("alerts-refresh-label").textContent = t("alertsRefreshing");

  await apiRequest("/apps/resilience/api/gdacs/alerts/refresh", { method: "POST" });

  alertsRefreshBtn.disabled = false;
  alertsRefreshBtn.classList.remove("btn-refreshing");
  document.getElementById("alerts-refresh-label").textContent = t("alertsRefresh");

  alertsPage = 0;
  await loadGdacsAlerts();
});

async function loadGdacsAlerts() {
  const offset = alertsPage * ALERTS_PER_PAGE;
  const result = await apiRequest(`/apps/resilience/api/gdacs/alerts?limit=${ALERTS_PER_PAGE}&offset=${offset}`);
  if (!result.ok || !result.payload) return;

  const { items, total } = result.payload;

  if (items.length === 0 && alertsPage === 0) {
    alertsContent.innerHTML = "";
    alertsEmpty.hidden = false;
    alertsPagination.innerHTML = "";
    return;
  }

  alertsEmpty.hidden = true;

  // Group by country_name
  const groups = {};
  for (const a of items) {
    const key = a.country_name || a.country || "Unknown";
    if (!groups[key]) groups[key] = [];
    groups[key].push(a);
  }

  let html = "";
  for (const [country, countryItems] of Object.entries(groups)) {
    html += `<div class="alerts-country-group">`;
    html += `<div class="alerts-country-header">${escapeHtml(country)}</div>`;
    html += `<table class="alerts-country-table"><tbody>`;
    for (const a of countryItems) {
      const icon = GDACS_TYPE_ICONS[a.eventtype] || "";
      const alertClass = a.alertlevel === "Red" ? "alert-red" : a.alertlevel === "Orange" ? "alert-orange" : "alert-green";
      html += `<tr>
        <td style="width:32px;text-align:center;font-size:1.1rem">${icon}</td>
        <td style="font-weight:600">${escapeHtml(a.name || "-")}</td>
        <td><span class="alert-badge ${alertClass}">${escapeHtml(a.alertlevel)}</span></td>
        <td class="alerts-td-severity" style="color:var(--muted);font-size:0.78rem">${escapeHtml(a.severity || "-")}</td>
        <td style="color:var(--muted);white-space:nowrap;font-size:0.78rem">${formatDate(a.fromdate)}</td>
        <td style="width:32px;text-align:center">${a.url ? `<a class="news-link-btn" href="${escapeHtml(a.url)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ""}</td>
      </tr>`;
    }
    html += `</tbody></table></div>`;
  }

  alertsContent.innerHTML = html;

  // Pagination
  const totalPages = Math.ceil(total / ALERTS_PER_PAGE);
  if (total === 0) {
    alertsPagination.innerHTML = "";
    return;
  }

  let pagHtml = `<span class="pag-total">${total} ${t("alertsTotal")}</span>`;
  if (totalPages > 1) {
    pagHtml += `<div class="pag-controls">`;
    pagHtml += `<button class="pag-btn" id="alerts-prev" ${alertsPage === 0 ? "disabled" : ""}>${t("alertsPrev")}</button>`;
    pagHtml += `<span>${alertsPage + 1} / ${totalPages}</span>`;
    pagHtml += `<button class="pag-btn" id="alerts-next" ${alertsPage >= totalPages - 1 ? "disabled" : ""}>${t("alertsNext")}</button>`;
    pagHtml += `</div>`;
  }
  alertsPagination.innerHTML = pagHtml;

  const prevBtn = document.getElementById("alerts-prev");
  const nextBtn = document.getElementById("alerts-next");
  if (prevBtn) prevBtn.addEventListener("click", () => { alertsPage--; loadGdacsAlerts(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { alertsPage++; loadGdacsAlerts(); });
}

// ── Documentation ─────────────────────────────────────────────────
const DOCS = {
  de: {
    overview: {
      title: "Übersicht",
      html: `
        <h2>Übersicht</h2>
        <p>Die Resilience App bietet Tools zur Überwachung und Analyse der Lieferkettenresilienz. Sie kombiniert externe Datenquellen mit KI-gestützter Analyse.</p>
        <h3>Features</h3>
        <ul>
          <li><strong>Dashboard</strong> — Schnellübersicht mit den wichtigsten Informationen auf einen Blick.</li>
          <li><strong>News Feeds</strong> — Automatischer Abruf von Nachrichten aus konfigurierten RSS/Atom-Quellen.</li>
          <li><strong>GDACS Suche</strong> — Suche nach Naturkatastrophen weltweit über das Global Disaster Alert and Coordination System.</li>
          <li><strong>GDACS Alerts</strong> — Automatische Überwachung ausgewählter Länder auf Naturkatastrophen.</li>
          <li><strong>Indikatoren</strong> — Resilienz-Indikatoren für deine Lieferkette (in Entwicklung).</li>
          <li><strong>AI Mapping</strong> — KI-gestützte Zuordnung und Analyse (in Entwicklung).</li>
        </ul>
      `,
    },
    "news-feeds": {
      title: "News Feeds",
      html: `
        <h2>News Feeds</h2>
        <p>Die News-Feed-Funktion ermöglicht das automatische Sammeln von Nachrichten aus externen RSS- und Atom-Quellen.</p>
        <h3>Feeds konfigurieren</h3>
        <p>Gehe zu <strong>Einstellungen → News Feeds</strong> und füge Feed-URLs hinzu. Die App unterstützt gängige RSS 2.0 und Atom 1.0 Feeds.</p>
        <h3>Automatischer Abruf</h3>
        <p>Feeds werden im Hintergrund in einem konfigurierbaren Intervall (15 Min. bis 24 Std.) abgerufen. Du kannst auch jederzeit manuell über den „Aktualisieren"-Button aktualisieren.</p>
        <h3>Aufbewahrung</h3>
        <p>News-Einträge werden je nach Einstellung zwischen 7 und 90 Tagen aufbewahrt. Ältere Einträge werden automatisch gelöscht.</p>
      `,
    },
    "gdacs-search": {
      title: "GDACS Suche",
      html: `
        <h2>GDACS Suche</h2>
        <p>Durchsuche die GDACS-Datenbank nach Naturkatastrophen weltweit. Das Global Disaster Alert and Coordination System (GDACS) stellt Echtzeitdaten zu verschiedenen Katastrophentypen bereit.</p>
        <h3>Suchfilter</h3>
        <ul>
          <li><strong>Land</strong> — Optional: Ergebnisse auf ein bestimmtes Land einschränken.</li>
          <li><strong>Zeitraum</strong> — Wähle zwischen 7 Tagen und 1 Jahr.</li>
          <li><strong>Katastrophentyp</strong> — Erdbeben, Sturm, Flut, Vulkan, Waldbrand, Dürre.</li>
          <li><strong>Warnstufe</strong> — Alle, Orange + Rot, oder nur Rot.</li>
        </ul>
        <h3>Ergebnisse</h3>
        <p>Die Ergebnisse zeigen Typ, Name, Land, Warnstufe, Schwere und Datum. Klicke auf den Link-Button, um den offiziellen GDACS-Bericht zu öffnen.</p>
      `,
    },
    "gdacs-alerts": {
      title: "GDACS Alerts",
      html: `
        <h2>GDACS Alerts</h2>
        <p>Die Alert-Funktion überwacht automatisch ausgewählte Länder auf neue Naturkatastrophen.</p>
        <h3>Länder konfigurieren</h3>
        <p>Gehe zu <strong>Einstellungen → GDACS Länderüberwachung</strong> und füge die gewünschten Länder hinzu (englische Ländernamen, z.B. „Germany", „Turkey", „China").</p>
        <h3>Automatischer Abruf</h3>
        <p>Alerts werden im Hintergrund in einem konfigurierbaren Intervall abgerufen. Dabei werden die letzten 7 Tage abgefragt und neue Ereignisse gespeichert.</p>
        <h3>Alerts anzeigen</h3>
        <p>Auf der GDACS-Alerts-Seite werden alle gespeicherten Alerts gruppiert nach Land angezeigt. Alerts werden nach maximal 7 Tagen automatisch gelöscht.</p>
      `,
    },
    dashboard: {
      title: "Dashboard",
      html: `
        <h2>Dashboard</h2>
        <p>Das Dashboard bietet eine Schnellübersicht der wichtigsten Informationen.</p>
        <h3>Kacheln</h3>
        <ul>
          <li><strong>Letzte News</strong> — Zeigt die neuesten 8 News-Einträge aus deinen konfigurierten Feeds.</li>
          <li><strong>GDACS Alerts</strong> — Zeigt die neuesten 8 GDACS-Alerts für deine überwachten Länder.</li>
        </ul>
        <p>Klicke auf „Alle anzeigen" um zur vollständigen Ansicht zu wechseln.</p>
      `,
    },
    settings: {
      title: "Einstellungen",
      html: `
        <h2>Einstellungen</h2>
        <p>In den Einstellungen konfigurierst du die verschiedenen Datenquellen der App.</p>
        <h3>News Feeds</h3>
        <ul>
          <li><strong>Feed-URL hinzufügen</strong> — Gib eine RSS/Atom-Feed-URL ein und klicke auf „Hinzufügen".</li>
          <li><strong>Aufbewahrung</strong> — Lege fest, wie lange News-Einträge gespeichert werden (7–90 Tage).</li>
          <li><strong>Abruf-Intervall</strong> — Wie oft Feeds automatisch aktualisiert werden.</li>
        </ul>
        <h3>GDACS Länderüberwachung</h3>
        <ul>
          <li><strong>Land hinzufügen</strong> — Gib einen englischen Ländernamen ein (z.B. „Germany").</li>
          <li><strong>Abruf-Intervall</strong> — Wie oft GDACS-Daten für deine Länder abgerufen werden.</li>
          <li><strong>Alerts löschen</strong> — Entfernt alle gespeicherten GDACS-Alerts.</li>
        </ul>
      `,
    },
  },
  en: {
    overview: {
      title: "Overview",
      html: `
        <h2>Overview</h2>
        <p>The Resilience App provides tools for monitoring and analyzing supply chain resilience. It combines external data sources with AI-powered analysis.</p>
        <h3>Features</h3>
        <ul>
          <li><strong>Dashboard</strong> — Quick overview with the most important information at a glance.</li>
          <li><strong>News Feeds</strong> — Automatic retrieval of news from configured RSS/Atom sources.</li>
          <li><strong>GDACS Search</strong> — Search for natural disasters worldwide via the Global Disaster Alert and Coordination System.</li>
          <li><strong>GDACS Alerts</strong> — Automatic monitoring of selected countries for natural disasters.</li>
          <li><strong>Indicators</strong> — Resilience indicators for your supply chain (in development).</li>
          <li><strong>AI Mapping</strong> — AI-powered mapping and analysis (in development).</li>
        </ul>
      `,
    },
    "news-feeds": {
      title: "News Feeds",
      html: `
        <h2>News Feeds</h2>
        <p>The news feed feature allows automatic collection of news from external RSS and Atom sources.</p>
        <h3>Configure Feeds</h3>
        <p>Go to <strong>Settings → News Feeds</strong> and add feed URLs. The app supports common RSS 2.0 and Atom 1.0 feeds.</p>
        <h3>Automatic Retrieval</h3>
        <p>Feeds are fetched in the background at a configurable interval (15 min to 24 hours). You can also manually refresh at any time using the "Refresh" button.</p>
        <h3>Retention</h3>
        <p>News items are retained for 7 to 90 days depending on your setting. Older items are automatically deleted.</p>
      `,
    },
    "gdacs-search": {
      title: "GDACS Search",
      html: `
        <h2>GDACS Search</h2>
        <p>Search the GDACS database for natural disasters worldwide. The Global Disaster Alert and Coordination System (GDACS) provides real-time data on various disaster types.</p>
        <h3>Search Filters</h3>
        <ul>
          <li><strong>Country</strong> — Optional: narrow results to a specific country.</li>
          <li><strong>Time Range</strong> — Choose between 7 days and 1 year.</li>
          <li><strong>Disaster Type</strong> — Earthquake, Cyclone, Flood, Volcano, Wildfire, Drought.</li>
          <li><strong>Alert Level</strong> — All, Orange + Red, or Red only.</li>
        </ul>
        <h3>Results</h3>
        <p>Results show type, name, country, alert level, severity, and date. Click the link button to open the official GDACS report.</p>
      `,
    },
    "gdacs-alerts": {
      title: "GDACS Alerts",
      html: `
        <h2>GDACS Alerts</h2>
        <p>The alert feature automatically monitors selected countries for new natural disasters.</p>
        <h3>Configure Countries</h3>
        <p>Go to <strong>Settings → GDACS Country Monitoring</strong> and add your desired countries (English country names, e.g. "Germany", "Turkey", "China").</p>
        <h3>Automatic Retrieval</h3>
        <p>Alerts are fetched in the background at a configurable interval. The last 7 days are queried and new events are stored.</p>
        <h3>View Alerts</h3>
        <p>On the GDACS Alerts page, all stored alerts are displayed grouped by country. Alerts are automatically deleted after 7 days.</p>
      `,
    },
    dashboard: {
      title: "Dashboard",
      html: `
        <h2>Dashboard</h2>
        <p>The dashboard provides a quick overview of the most important information.</p>
        <h3>Tiles</h3>
        <ul>
          <li><strong>Latest News</strong> — Shows the 8 most recent news items from your configured feeds.</li>
          <li><strong>GDACS Alerts</strong> — Shows the 8 most recent GDACS alerts for your monitored countries.</li>
        </ul>
        <p>Click "View all" to switch to the full view.</p>
      `,
    },
    settings: {
      title: "Settings",
      html: `
        <h2>Settings</h2>
        <p>Configure the various data sources of the app in settings.</p>
        <h3>News Feeds</h3>
        <ul>
          <li><strong>Add Feed URL</strong> — Enter an RSS/Atom feed URL and click "Add".</li>
          <li><strong>Retention</strong> — Set how long news items are stored (7–90 days).</li>
          <li><strong>Refresh Interval</strong> — How often feeds are automatically updated.</li>
        </ul>
        <h3>GDACS Country Monitoring</h3>
        <ul>
          <li><strong>Add Country</strong> — Enter an English country name (e.g. "Germany").</li>
          <li><strong>Refresh Interval</strong> — How often GDACS data is fetched for your countries.</li>
          <li><strong>Delete Alerts</strong> — Removes all stored GDACS alerts.</li>
        </ul>
      `,
    },
  },
};

function loadDoc(docId) {
  activeDoc = docId;
  const docData = DOCS[locale]?.[docId] || DOCS.de[docId];
  if (!docData) return;

  docsContentEl.innerHTML = docData.html;

  docsNav.querySelectorAll(".docs-nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.doc === docId);
  });
}

docsNav.addEventListener("click", (e) => {
  const btn = e.target.closest(".docs-nav-item");
  if (!btn) return;
  loadDoc(btn.dataset.doc);
});

// ── Init ──────────────────────────────────────────────────────────
async function init() {
  const userResult = await apiRequest("/api/me");
  if (userResult.ok && userResult.payload) {
    currentUser = userResult.payload;
    userInitials.textContent = getInitials(currentUser.name);
    if (userInfo) userInfo.textContent = currentUser.name || currentUser.email || "";
  }

  setLocale(locale);
  navigateTo("dashboard");
}

init();
