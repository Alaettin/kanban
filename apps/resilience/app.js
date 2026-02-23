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
const gdacsRetentionSelect = document.getElementById("gdacs-retention-select");
const gdacsSettingsSaveBtn = document.getElementById("gdacs-settings-save-btn");
const importIntervalSelect = document.getElementById("import-interval-select");
const importSettingsSaveBtn = document.getElementById("import-settings-save-btn");

// News DOM refs
const newsListView = document.getElementById("news-list-view");
const newsDetailView = document.getElementById("news-detail-view");
const newsDetailContent = document.getElementById("news-detail-content");
const newsBackBtn = document.getElementById("news-back-btn");
const newsTbody = document.getElementById("news-tbody");
const newsEmpty = document.getElementById("news-empty");
const newsPagination = document.getElementById("news-pagination");
const newsRefreshBtn = document.getElementById("news-refresh-btn");
const newsSearchInput = document.getElementById("news-search-input");

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
    assetsNavGroups: "Gruppen",
    assetsNavAssign: "Zuordnung",
    assignGroup: "Gruppe",
    assignSave: "Speichern",
    grpSearch: "Gruppen suchen…",
    grpAdd: "Hinzufügen",
    grpCount: "Gruppen",
    grpEmpty: "Noch keine Gruppen vorhanden.",
    grpThName: "Name",
    grpThCount: "AAS IDs",
    grpBack: "Zurück",
    grpName: "Name",
    grpAvailable: "Verfügbar",
    grpAssigned: "Zugeordnet",
    grpSourceAll: "Alle Quellen",
    grpAvailSearch: "Verfügbare suchen…",
    grpAssignedSearch: "Zugeordnete suchen…",
    grpAddAll: "Alle hinzufügen",
    grpRemoveAll: "Alle entfernen",
    grpRemoveAllConfirm: "Alle zugeordneten AAS IDs entfernen?",
    grpSave: "Speichern",
    grpSaved: "Gruppe gespeichert.",
    grpDelete: "Löschen",
    grpDeleteConfirm: "Diese Gruppe wirklich löschen?",
    grpDeleted: "Gruppe gelöscht.",
    grpNameRequired: "Name ist erforderlich.",
    grpAvailEmpty: "Keine verfügbaren AAS IDs.",
    grpAssignedEmpty: "Keine AAS IDs zugeordnet.",
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
    retentionLabel: "News aufbewahren für",
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
    gdacsSettingsRetentionLabel: "Alerts aufbewahren für",
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
    newsSearchPlaceholder: "News durchsuchen…",
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
    // Indicators
    indicatorsDescNew: "Definiere Resilienz-Indikatoren für deine Lieferkette.",
    indNavClasses: "Klassen",
    indNavIndicators: "Indikatoren",
    indSearch: "Suchen…",
    indAdd: "Hinzufügen",
    indEmptyText: "Noch keine Indikatoren definiert.",
    indThName: "Name",
    indThClass: "Klasse",
    indThInput: "Input",
    indThRules: "Regeln",
    indBack: "Zurück",
    indNameLabel: "Name",
    indClassLabel: "Klasse",
    indInputTypeLabel: "Input-Typ",
    indInputLabelLabel: "Input-Bezeichnung",
    indInputLabelPlaceholder: "z.B. Magnitude",
    indInputTypeNumber: "Zahl",
    indInputTypeText: "Text",
    indInputTypeBoolean: "Boolean",
    indGroupsTitle: "Regelgruppen",
    indGroupsDesc: "ODER-verknüpft — erste zutreffende Gruppe bestimmt die Ausgabe.",
    indAddGroup: "ODER-Gruppe hinzufügen",
    indAddCondition: "+ UND-Bedingung",
    indConditionValue: "Wert",
    indDefaultTitle: "Standard-Ausgabe",
    indDefaultDesc: "Wird verwendet wenn keine Gruppe zutrifft.",
    indDefaultLabelLabel: "Label",
    indDefaultColorLabel: "Farbe",
    indDefaultScoreLabel: "Score",
    indSave: "Speichern",
    indSaved: "Indikator gespeichert.",
    indSaveError: "Fehler beim Speichern.",
    indDelete: "Löschen",
    indDeleteConfirm: "Diesen Indikator wirklich löschen?",
    indNameRequired: "Bitte einen Namen eingeben.",
    indClassNone: "— Keine Klasse —",
    // Settings: Indicator classes
    indClassesTitle: "Indikator-Klassen",
    indClassInputPlaceholder: "Klasse eingeben…",
    indClassAdd: "Hinzufügen",
    indClassEmpty: "Noch keine Klassen definiert.",
    indClassAdded: "Klasse hinzugefügt.",
    indClassRemoved: "Klasse entfernt.",
    indClassExists: "Diese Klasse existiert bereits.",
    indClassRemove: "Entfernen",
    // AAS Sources
    srcSearch: "Suchen…",
    srcIdSearch: "IDs durchsuchen…",
    srcAdd: "Hinzufügen",
    srcEmptyText: "Noch keine Quellen definiert.",
    srcThName: "Name",
    srcThUrl: "Basis-URL",
    srcThIds: "IDs",
    srcBack: "Zurück",
    srcLblName: "Name",
    srcLblUrl: "Basis-URL",
    srcTabAll: "Alle",
    srcTabAas: "AAS IDs",
    srcTabItem: "Item IDs",
    srcAasAdd: "Hinzufügen",
    srcItemAdd: "Hinzufügen",
    srcPrefixLabel: "Prefix",
    srcIdEmptyAll: "Noch keine IDs hinzugefügt.",
    srcIdEmptyAas: "Noch keine AAS IDs hinzugefügt.",
    srcIdEmptyItem: "Noch keine Item IDs hinzugefügt.",
    srcIdDuplicate: "Diese ID existiert bereits.",
    srcIdAdded: "ID hinzugefügt.",
    srcIdRemoved: "ID entfernt.",
    srcEndpointsTitle: "Verfügbare Endpunkte",
    srcSave: "Speichern",
    srcSaved: "Quelle gespeichert.",
    srcSaveError: "Fehler beim Speichern.",
    srcDelete: "Löschen",
    srcDeleteConfirm: "Diese Quelle wirklich löschen?",
    srcNameRequired: "Bitte einen Namen eingeben.",
    srcUrlRequired: "Bitte eine URL eingeben.",
    srcCount: "Quellen",
    srcImport: "Importieren",
    srcImporting: "Importiere…",
    srcImportDone: "{added} hinzugefügt, {duplicates} bereits vorhanden.",
    srcImportError: "Import fehlgeschlagen.",
    srcImportUrlRequired: "Bitte eine Import-URL eingeben.",
    srcDeleteAllIds: "Alle löschen",
    srcDeleteAllConfirm: "Wirklich alle IDs dieser Quelle löschen?",
    srcDeleteAllDone: "{count} IDs gelöscht.",
    // AAS Overview
    aasNavOverview: "Übersicht",
    aasNavSources: "Quellen",
    aasOvSearch: "Suchen…",
    aasOvThSource: "Quelle",
    aasOvThAasId: "AAS ID",
    aasOvThGroup: "Gruppe",
    aasOvThImported: "Letzter Import",
    aasOvImport: "Import",
    aasImportErrors: "Fehler beim Import",
    aasImportDone: "Import abgeschlossen",
    aasImportSaved: "Gespeichert",
    aasOvView: "Importierte Daten anzeigen",
    importSettingsTitle: "AAS Import",
    importIntervalLabel: "Auto-Import Intervall",
    importIntervalOff: "Aus",
    importInterval6: "6 Std.",
    importInterval12: "12 Std.",
    importInterval24: "24 Std.",
    importSettingsSave: "Speichern",
    aasOvEmpty: "Keine AAS IDs vorhanden. Füge Quellen und IDs hinzu.",
    aasOvCount: "AAS",
    aasOvBack: "Zurück",
    aasOvShellTitle: "Shell",
    aasOvSubmodelTitle: "Submodel",
    aasOvSubmodels: "Submodels",
    aasOvLoadError: "Fehler beim Laden der Shell-Daten.",
    aasOvSmLoadError: "Fehler beim Laden",
    aasOvName: "Name",
    aasOvId: "ID",
    aasOvIdShort: "idShort",
    aasOvAssetKind: "Asset-Kind",
    aasOvAssetType: "Asset-Type",
    aasOvGlobalAssetId: "Global Asset ID",
    aasOvSemanticId: "Semantik-ID",
    aasOvElements: "Elemente",
    // Docs nav
    docsIndicators: "Indikatoren",
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
    assetsNavGroups: "Groups",
    assetsNavAssign: "Assignment",
    assignGroup: "Group",
    assignSave: "Save",
    grpSearch: "Search groups…",
    grpAdd: "Add",
    grpCount: "Groups",
    grpEmpty: "No groups yet.",
    grpThName: "Name",
    grpThCount: "AAS IDs",
    grpBack: "Back",
    grpName: "Name",
    grpAvailable: "Available",
    grpAssigned: "Assigned",
    grpSourceAll: "All sources",
    grpAvailSearch: "Search available…",
    grpAssignedSearch: "Search assigned…",
    grpAddAll: "Add all",
    grpRemoveAll: "Remove all",
    grpRemoveAllConfirm: "Remove all assigned AAS IDs?",
    grpSave: "Save",
    grpSaved: "Group saved.",
    grpDelete: "Delete",
    grpDeleteConfirm: "Delete this group?",
    grpDeleted: "Group deleted.",
    grpNameRequired: "Name is required.",
    grpAvailEmpty: "No available AAS IDs.",
    grpAssignedEmpty: "No AAS IDs assigned.",
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
    retentionLabel: "Keep news for",
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
    gdacsSettingsRetentionLabel: "Keep alerts for",
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
    newsSearchPlaceholder: "Search news…",
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
    // Indicators
    indicatorsDescNew: "Define resilience indicators for your supply chain.",
    indNavClasses: "Classes",
    indNavIndicators: "Indicators",
    indSearch: "Search…",
    indAdd: "Add",
    indEmptyText: "No indicators defined yet.",
    indThName: "Name",
    indThClass: "Class",
    indThInput: "Input",
    indThRules: "Rules",
    indBack: "Back",
    indNameLabel: "Name",
    indClassLabel: "Class",
    indInputTypeLabel: "Input type",
    indInputLabelLabel: "Input label",
    indInputLabelPlaceholder: "e.g. Magnitude",
    indInputTypeNumber: "Number",
    indInputTypeText: "Text",
    indInputTypeBoolean: "Boolean",
    indGroupsTitle: "Rule groups",
    indGroupsDesc: "OR-linked — first matching group determines the output.",
    indAddGroup: "Add OR group",
    indAddCondition: "+ AND condition",
    indConditionValue: "Value",
    indDefaultTitle: "Default output",
    indDefaultDesc: "Used when no group matches.",
    indDefaultLabelLabel: "Label",
    indDefaultColorLabel: "Color",
    indDefaultScoreLabel: "Score",
    indSave: "Save",
    indSaved: "Indicator saved.",
    indSaveError: "Failed to save.",
    indDelete: "Delete",
    indDeleteConfirm: "Really delete this indicator?",
    indNameRequired: "Please enter a name.",
    indClassNone: "— No class —",
    // Settings: Indicator classes
    indClassesTitle: "Indicator Classes",
    indClassInputPlaceholder: "Enter class…",
    indClassAdd: "Add",
    indClassEmpty: "No classes defined yet.",
    indClassAdded: "Class added.",
    indClassRemoved: "Class removed.",
    indClassExists: "This class already exists.",
    indClassRemove: "Remove",
    // AAS Sources
    srcSearch: "Search…",
    srcIdSearch: "Search IDs…",
    srcAdd: "Add",
    srcEmptyText: "No sources defined yet.",
    srcThName: "Name",
    srcThUrl: "Base URL",
    srcThIds: "IDs",
    srcBack: "Back",
    srcLblName: "Name",
    srcLblUrl: "Base URL",
    srcTabAll: "All",
    srcTabAas: "AAS IDs",
    srcTabItem: "Item IDs",
    srcAasAdd: "Add",
    srcItemAdd: "Add",
    srcPrefixLabel: "Prefix",
    srcIdEmptyAll: "No IDs added yet.",
    srcIdEmptyAas: "No AAS IDs added yet.",
    srcIdEmptyItem: "No Item IDs added yet.",
    srcIdDuplicate: "This ID already exists.",
    srcIdAdded: "ID added.",
    srcIdRemoved: "ID removed.",
    srcEndpointsTitle: "Available Endpoints",
    srcSave: "Save",
    srcSaved: "Source saved.",
    srcSaveError: "Failed to save.",
    srcDelete: "Delete",
    srcDeleteConfirm: "Really delete this source?",
    srcNameRequired: "Please enter a name.",
    srcUrlRequired: "Please enter a URL.",
    srcCount: "Sources",
    srcImport: "Import",
    srcImporting: "Importing…",
    srcImportDone: "{added} added, {duplicates} already existed.",
    srcImportError: "Import failed.",
    srcImportUrlRequired: "Please enter an import URL.",
    srcDeleteAllIds: "Delete all",
    srcDeleteAllConfirm: "Really delete all IDs of this source?",
    srcDeleteAllDone: "{count} IDs deleted.",
    // AAS Overview
    aasNavOverview: "Overview",
    aasNavSources: "Sources",
    aasOvSearch: "Search…",
    aasOvThSource: "Source",
    aasOvThAasId: "AAS ID",
    aasOvThGroup: "Group",
    aasOvThImported: "Last Import",
    aasOvImport: "Import",
    aasImportErrors: "Import errors",
    aasImportDone: "Import complete",
    aasImportSaved: "Saved",
    aasOvView: "View imported data",
    importSettingsTitle: "AAS Import",
    importIntervalLabel: "Auto-Import Interval",
    importIntervalOff: "Off",
    importInterval6: "6 hrs",
    importInterval12: "12 hrs",
    importInterval24: "24 hrs",
    importSettingsSave: "Save",
    aasOvEmpty: "No AAS IDs available. Add sources and IDs first.",
    aasOvCount: "AAS",
    aasOvBack: "Back",
    aasOvShellTitle: "Shell",
    aasOvSubmodelTitle: "Submodel",
    aasOvSubmodels: "Submodels",
    aasOvLoadError: "Failed to load shell data.",
    aasOvSmLoadError: "Failed to load",
    aasOvName: "Name",
    aasOvId: "ID",
    aasOvIdShort: "idShort",
    aasOvAssetKind: "Asset-Kind",
    aasOvAssetType: "Asset-Type",
    aasOvGlobalAssetId: "Global Asset ID",
    aasOvSemanticId: "Semantic ID",
    aasOvElements: "Elements",
    // Docs nav
    docsIndicators: "Indicators",
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
let newsQuery = "";
const NEWS_PER_PAGE = 30;

// Alerts state
let alertsPage = 0;
const ALERTS_PER_PAGE = 30;

// Docs state
let activeDoc = "overview";

// Indicators nav state
let activeIndNav = "classes";

// AAS Data nav state
let activeAasNav = "overview";
let aasOvPage = 0;
const AAS_OV_PER_PAGE = 20;

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
  if (page === "indicators") { switchIndNav(activeIndNav); }
  if (page === "aas-data") { switchAasNav(activeAasNav); }
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
  document.getElementById("gdacs-retention-label").textContent = t("gdacsSettingsRetentionLabel");
  document.getElementById("gdacs-refresh-label").textContent = t("gdacsSettingsRefreshLabel");
  document.getElementById("gdacs-settings-save-label").textContent = t("gdacsSettingsSave");
  document.getElementById("gdacs-purge-label").textContent = t("gdacsPurge");

  for (const opt of gdacsRetentionSelect.options) {
    opt.textContent = t("ret." + opt.value);
  }
  for (const opt of gdacsRefreshSelect.options) {
    opt.textContent = t("ref." + opt.value);
  }

  // Import settings labels
  document.getElementById("import-settings-title").textContent = t("importSettingsTitle");
  document.getElementById("import-interval-label").textContent = t("importIntervalLabel");
  document.getElementById("import-settings-save-label").textContent = t("importSettingsSave");
  const impOpts = importIntervalSelect.options;
  impOpts[0].textContent = t("importIntervalOff");
  impOpts[1].textContent = t("importInterval6");
  impOpts[2].textContent = t("importInterval12");
  impOpts[3].textContent = t("importInterval24");

  // GDACS Search labels
  applyGdacsLocale();

  // News table headers
  document.getElementById("news-th-id").textContent = t("newsThId");
  document.getElementById("news-th-title").textContent = t("newsThTitle");
  document.getElementById("news-th-stored").textContent = t("newsThStored");
  document.getElementById("news-empty-text").textContent = t("newsEmptyText");
  document.getElementById("news-refresh-label").textContent = t("newsRefresh");
  newsSearchInput.placeholder = t("newsSearchPlaceholder");
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

  // Indicators page labels
  document.getElementById("ind-search").placeholder = t("indSearch");
  document.getElementById("ind-add-label").textContent = t("indAdd");
  document.getElementById("ind-empty-text").textContent = t("indEmptyText");
  document.getElementById("ind-th-name").textContent = t("indThName");
  document.getElementById("ind-th-class").textContent = t("indThClass");
  document.getElementById("ind-th-input").textContent = t("indThInput");
  document.getElementById("ind-th-rules").textContent = t("indThRules");
  document.getElementById("ind-back-label").textContent = t("indBack");
  document.getElementById("ind-name-label").textContent = t("indNameLabel");
  document.getElementById("ind-class-label").textContent = t("indClassLabel");
  document.getElementById("ind-input-type-label").textContent = t("indInputTypeLabel");
  document.getElementById("ind-input-label-label").textContent = t("indInputLabelLabel");
  document.getElementById("ind-input-label").placeholder = t("indInputLabelPlaceholder");
  document.getElementById("ind-groups-title").textContent = t("indGroupsTitle");
  document.getElementById("ind-groups-desc").textContent = t("indGroupsDesc");
  document.getElementById("ind-add-group-label").textContent = t("indAddGroup");
  document.getElementById("ind-default-title").textContent = t("indDefaultTitle");
  document.getElementById("ind-default-desc").textContent = t("indDefaultDesc");
  document.getElementById("ind-default-label-label").textContent = t("indDefaultLabelLabel");
  document.getElementById("ind-default-color-label").textContent = t("indDefaultColorLabel");
  document.getElementById("ind-default-score-label").textContent = t("indDefaultScoreLabel");
  document.getElementById("ind-save-label").textContent = t("indSave");
  document.getElementById("ind-delete-label").textContent = t("indDelete");

  // Input type dropdown options
  const indInputTypeEl = document.getElementById("ind-input-type");
  for (const opt of indInputTypeEl.options) {
    if (opt.value === "number") opt.textContent = t("indInputTypeNumber");
    if (opt.value === "text") opt.textContent = t("indInputTypeText");
    if (opt.value === "boolean") opt.textContent = t("indInputTypeBoolean");
  }

  // AAS Sources page labels
  document.getElementById("src-search").placeholder = t("srcSearch");
  document.getElementById("src-id-search").placeholder = t("srcIdSearch");
  document.getElementById("src-add-label").textContent = t("srcAdd");
  document.getElementById("src-empty").textContent = t("srcEmptyText");
  document.getElementById("src-th-name").textContent = t("srcThName");
  document.getElementById("src-th-url").textContent = t("srcThUrl");
  document.getElementById("src-th-ids").textContent = t("srcThIds");
  document.getElementById("src-back-label").textContent = t("srcBack");
  document.getElementById("src-lbl-name").textContent = t("srcLblName");
  document.getElementById("src-lbl-url").textContent = t("srcLblUrl");
  document.getElementById("src-tab-all").textContent = t("srcTabAll");
  document.getElementById("src-tab-aas").textContent = t("srcTabAas");
  document.getElementById("src-tab-item").textContent = t("srcTabItem");
  document.getElementById("src-aas-add-label").textContent = t("srcAasAdd");
  document.getElementById("src-item-add-label").textContent = t("srcItemAdd");
  document.getElementById("src-prefix-label").textContent = t("srcPrefixLabel");
  document.getElementById("src-id-empty-all").textContent = t("srcIdEmptyAll");
  document.getElementById("src-id-empty-aas").textContent = t("srcIdEmptyAas");
  document.getElementById("src-id-empty-item").textContent = t("srcIdEmptyItem");
  document.getElementById("src-endpoints-title").textContent = t("srcEndpointsTitle");
  document.getElementById("src-save-btn").textContent = t("srcSave");
  document.getElementById("src-delete-btn").textContent = t("srcDelete");
  document.getElementById("src-import-label").textContent = t("srcImport");
  document.getElementById("src-delete-all-ids-label").textContent = t("srcDeleteAllIds");

  // AAS Data nav labels
  document.getElementById("aas-nav-btn-overview").textContent = t("aasNavOverview");
  document.getElementById("aas-nav-btn-sources").textContent = t("aasNavSources");
  document.getElementById("aas-ov-search").placeholder = t("aasOvSearch");
  document.getElementById("aas-ov-th-source").textContent = t("aasOvThSource");
  document.getElementById("aas-ov-th-aasid").textContent = t("aasOvThAasId");
  document.getElementById("aas-ov-th-group").textContent = t("aasOvThGroup");
  document.getElementById("aas-ov-th-imported").textContent = t("aasOvThImported");
  document.getElementById("aas-ov-import-label").textContent = t("aasOvImport");
  document.getElementById("aas-ov-empty").textContent = t("aasOvEmpty");
  document.getElementById("aas-ov-back-label").textContent = t("aasOvBack");

  // Groups / Assign labels (under AAS Data)
  document.getElementById("aas-nav-btn-groups").textContent = t("assetsNavGroups");
  document.getElementById("aas-nav-btn-assign").textContent = t("assetsNavAssign");
  document.getElementById("assign-grp-label").textContent = t("assignGroup");
  document.getElementById("assign-save-label").textContent = t("assignSave");
  document.getElementById("grp-search").placeholder = t("grpSearch");
  document.getElementById("grp-add-label").textContent = t("grpAdd");
  document.getElementById("grp-empty-text").textContent = t("grpEmpty");
  document.getElementById("grp-th-name").textContent = t("grpThName");
  document.getElementById("grp-th-count").textContent = t("grpThCount");
  document.getElementById("grp-back-label").textContent = t("grpBack");
  document.getElementById("grp-name-label").textContent = t("grpName");
  document.getElementById("grp-avail-title").textContent = t("grpAvailable");
  document.getElementById("grp-assigned-title").textContent = t("grpAssigned");
  document.getElementById("grp-avail-search").placeholder = t("grpAvailSearch");
  document.getElementById("grp-assigned-search").placeholder = t("grpAssignedSearch");
  document.getElementById("grp-avail-empty").textContent = t("grpAvailEmpty");
  document.getElementById("grp-assigned-empty").textContent = t("grpAssignedEmpty");
  document.getElementById("grp-add-all-label").textContent = t("grpAddAll");
  document.getElementById("grp-remove-all-label").textContent = t("grpRemoveAll");
  document.getElementById("grp-save-label").textContent = t("grpSave");
  document.getElementById("grp-delete-label").textContent = t("grpDelete");

  // Indicators nav
  document.getElementById("ind-nav-btn-classes").textContent = t("indNavClasses");
  document.getElementById("ind-nav-btn-indicators").textContent = t("indNavIndicators");

  // Indicator classes
  document.getElementById("ind-classes-title").textContent = t("indClassesTitle");
  document.getElementById("ind-class-input").placeholder = t("indClassInputPlaceholder");
  document.getElementById("ind-class-add-label").textContent = t("indClassAdd");
  document.getElementById("ind-class-empty-label").textContent = t("indClassEmpty");

  // Docs nav labels
  const docLabels = {
    overview: "docsOverview",
    indicators: "docsIndicators",
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

  // Re-render dynamic content on current page
  if (activePage === "aas-data") {
    if (activeAasNav === "groups") renderGroups();
    if (activeAasNav === "assign" && assignGroupId) {
      const allOpt = grpSourceFilter.querySelector('option[value=""]');
      if (allOpt) allOpt.textContent = t("grpSourceAll");
      renderGrpAssign();
    }
    if (activeAasNav === "sources" && !srcDetailView.hidden) renderSrcIdTabs();
  }
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

function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  const loc = locale === "de" ? "de-DE" : "en-US";
  return d.toLocaleDateString(loc, { day: "2-digit", month: "2-digit", year: "numeric" })
    + " " + d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" });
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

  const { retention_days, refresh_minutes, feeds, gdacs_refresh_minutes, gdacs_retention_days, gdacs_countries, import_interval_hours } = result.payload;
  cachedFeeds = feeds || [];
  cachedGdacsCountries = gdacs_countries || [];

  retentionSelect.value = String(retention_days);
  refreshSelect.value = String(refresh_minutes);
  gdacsRefreshSelect.value = String(gdacs_refresh_minutes || 60);
  gdacsRetentionSelect.value = String(gdacs_retention_days || 30);
  importIntervalSelect.value = String(import_interval_hours || 0);

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
      gdacs_retention_days: parseInt(gdacsRetentionSelect.value),
    },
  });
  gdacsSettingsSaveBtn.disabled = false;

  if (result.ok) {
    showGdacsCountryHint(t("gdacsSettingsSaved"), "success");
    setTimeout(hideGdacsCountryHint, 3000);
  }
});

// Save import interval settings
importSettingsSaveBtn.addEventListener("click", async () => {
  importSettingsSaveBtn.disabled = true;
  const result = await apiRequest("/apps/resilience/api/settings", {
    method: "PUT",
    body: { import_interval_hours: parseInt(importIntervalSelect.value) },
  });
  importSettingsSaveBtn.disabled = false;
  if (result.ok) {
    importSettingsSaveBtn.textContent = t("aasImportSaved");
    setTimeout(() => { importSettingsSaveBtn.textContent = t("importSettingsSave"); }, 2000);
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

// ── Indicators: Nav switching ─────────────────────────────────────
const indNav = document.getElementById("ind-nav");
const indNavClasses = document.getElementById("ind-nav-classes");
const indNavIndicators = document.getElementById("ind-nav-indicators");

indNav.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-ind-nav]");
  if (!btn) return;
  switchIndNav(btn.dataset.indNav);
});

function switchIndNav(nav) {
  activeIndNav = nav;
  indNav.querySelectorAll(".docs-nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.indNav === nav);
  });
  indNavClasses.hidden = nav !== "classes";
  indNavIndicators.hidden = nav !== "indicators";

  if (nav === "classes") {
    loadIndClasses();
  } else if (nav === "indicators") {
    showIndList();
    loadIndicators();
  }
}

// ── Indicator Classes ────────────────────────────────────────────
const indClassInput = document.getElementById("ind-class-input");
const indClassAddBtn = document.getElementById("ind-class-add-btn");
const indClassHint = document.getElementById("ind-class-hint");
const indClassList = document.getElementById("ind-class-list");
const indClassListEmpty = document.getElementById("ind-class-list-empty");

let cachedIndClasses = [];

function showIndClassHint(msg, type) {
  indClassHint.textContent = msg;
  indClassHint.className = "settings-hint hint-" + type;
  indClassHint.hidden = false;
}
function hideIndClassHint() { indClassHint.hidden = true; }

function renderIndClassList() {
  indClassList.innerHTML = "";
  indClassListEmpty.hidden = cachedIndClasses.length > 0;
  indClassList.hidden = cachedIndClasses.length === 0;

  for (const cls of cachedIndClasses) {
    const item = document.createElement("div");
    item.className = "feed-list-item";
    item.innerHTML = `
      <span class="feed-title">${escapeHtml(cls.name)}</span>
      <span class="feed-url"></span>
      <button class="feed-remove-btn" type="button" title="${t("indClassRemove") || "Entfernen"}" data-class-id="${cls.class_id}">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    indClassList.appendChild(item);
  }
}

async function loadIndClasses() {
  const result = await apiRequest("/apps/resilience/api/indicator-classes");
  if (result.ok && result.payload) {
    cachedIndClasses = result.payload.classes || [];
    renderIndClassList();
  }
}

indClassAddBtn.addEventListener("click", async () => {
  const name = indClassInput.value.trim();
  if (!name) return;
  hideIndClassHint();
  indClassAddBtn.disabled = true;

  const result = await apiRequest("/apps/resilience/api/indicator-classes", { method: "POST", body: { name } });
  indClassAddBtn.disabled = false;

  if (result.ok && result.payload) {
    cachedIndClasses.push(result.payload);
    renderIndClassList();
    indClassInput.value = "";
    showIndClassHint(t("indClassAdded"), "success");
    setTimeout(hideIndClassHint, 3000);
  } else {
    const errKey = result.payload?.error;
    if (errKey === "CLASS_EXISTS") showIndClassHint(t("indClassExists"), "error");
    else showIndClassHint(t("indClassExists"), "error");
  }
});

indClassInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") indClassAddBtn.click();
});

indClassList.addEventListener("click", async (e) => {
  const btn = e.target.closest(".feed-remove-btn");
  if (!btn) return;
  const classId = btn.dataset.classId;
  btn.disabled = true;
  const result = await apiRequest(`/apps/resilience/api/indicator-classes/${classId}`, { method: "DELETE" });
  if (result.ok) {
    cachedIndClasses = cachedIndClasses.filter((c) => c.class_id !== classId);
    renderIndClassList();
    showIndClassHint(t("indClassRemoved"), "success");
    setTimeout(hideIndClassHint, 3000);
  }
});

// ── Indicators Page ──────────────────────────────────────────────
const indListView = document.getElementById("ind-list-view");
const indDetailView = document.getElementById("ind-detail-view");
const indTbody = document.getElementById("ind-tbody");
const indEmpty = document.getElementById("ind-empty");
const indCount = document.getElementById("ind-count");
const indSearch = document.getElementById("ind-search");
const indAddBtn = document.getElementById("ind-add-btn");
const indBackBtn = document.getElementById("ind-back-btn");
const indNameInput = document.getElementById("ind-name");
const indClassSelect = document.getElementById("ind-class-select");
const indInputType = document.getElementById("ind-input-type");
const indInputLabel = document.getElementById("ind-input-label");
const indGroupsContainer = document.getElementById("ind-groups-container");
const indAddGroupBtn = document.getElementById("ind-add-group-btn");
const indDefaultLabel = document.getElementById("ind-default-label");
const indDefaultColor = document.getElementById("ind-default-color");
const indDefaultScore = document.getElementById("ind-default-score");
const indSaveBtn = document.getElementById("ind-save-btn");
const indDeleteBtn = document.getElementById("ind-delete-btn");
const indDetailHint = document.getElementById("ind-detail-hint");

let indicatorsData = [];
let editingIndicatorId = null;

function showIndHint(msg, type) {
  indDetailHint.textContent = msg;
  indDetailHint.className = "settings-hint hint-" + type;
  indDetailHint.hidden = false;
}
function hideIndHint() { indDetailHint.hidden = true; }

function showIndList() {
  indListView.hidden = false;
  indDetailView.hidden = true;
}

function showIndDetail() {
  indListView.hidden = true;
  indDetailView.hidden = false;
}

// ── Load indicators list ──
async function loadIndicators() {
  const result = await apiRequest("/apps/resilience/api/indicators");
  if (result.ok && result.payload) {
    indicatorsData = result.payload.indicators || [];
  }
  renderIndicators();
}

function renderIndicators() {
  const q = indSearch.value.trim().toLowerCase();
  const filtered = q ? indicatorsData.filter((i) =>
    i.name.toLowerCase().includes(q) || (i.class_name || "").toLowerCase().includes(q)
  ) : indicatorsData;

  indTbody.innerHTML = "";
  indEmpty.hidden = filtered.length > 0 || indicatorsData.length > 0;
  indCount.textContent = filtered.length + " " + (locale === "de" ? "Indikatoren" : "Indicators");

  const inputTypeLabel = { number: locale === "de" ? "Zahl" : "Number", text: "Text", boolean: "Boolean" };

  for (const ind of filtered) {
    const tr = document.createElement("tr");
    tr.dataset.indicatorId = ind.indicator_id;
    tr.innerHTML = `
      <td>${escapeHtml(ind.name)}</td>
      <td>${escapeHtml(ind.class_name || "-")}</td>
      <td>${inputTypeLabel[ind.input_type] || ind.input_type}</td>
      <td>${ind.group_count}</td>
      <td>
        <button class="ind-edit-btn" type="button" title="Edit">
          <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </td>
    `;
    indTbody.appendChild(tr);
  }
}

indSearch.addEventListener("input", renderIndicators);

indTbody.addEventListener("click", (e) => {
  const tr = e.target.closest("tr[data-indicator-id]");
  if (tr) openIndicator(tr.dataset.indicatorId);
});

indAddBtn.addEventListener("click", () => {
  editingIndicatorId = null;
  resetIndForm();
  showIndDetail();
});

indBackBtn.addEventListener("click", () => {
  showIndList();
  loadIndicators();
});

// ── Operator options per input type ──
function getOperators(inputType) {
  if (inputType === "text") return [["==", "="], ["!=", "\u2260"]];
  if (inputType === "boolean") return [["==", "="]];
  return [[">", ">"], ["<", "<"], [">=", "\u2265"], ["<=", "\u2264"], ["==", "="], ["!=", "\u2260"]];
}

// ── Build group card HTML ──
function createGroupCard(groupData, groupIndex) {
  const card = document.createElement("div");
  card.className = "ind-group-card";
  card.dataset.groupIndex = groupIndex;

  const header = document.createElement("div");
  header.className = "ind-group-header";
  header.innerHTML = `
    <span class="ind-group-num">#${groupIndex + 1}</span>
    <div class="ind-group-output">
      <input type="text" class="ind-input group-output-label" value="${escapeHtml(groupData.output_label || "")}" placeholder="Label" />
      <input type="color" class="ind-color-input group-output-color" value="${groupData.output_color || "#9ca3af"}" />
      <input type="number" class="ind-input ind-score-input group-output-score" value="${groupData.output_score ?? 0}" placeholder="Score" />
    </div>
    <button class="ind-group-remove" type="button" title="Remove">&times;</button>
  `;
  card.appendChild(header);

  const body = document.createElement("div");
  body.className = "ind-group-body";

  const conditions = groupData.conditions || [];
  for (const cond of conditions) {
    body.appendChild(createConditionRow(cond));
  }

  const addBtn = document.createElement("button");
  addBtn.className = "ind-add-condition-btn";
  addBtn.type = "button";
  addBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> <span>${t("indAddCondition")}</span>`;
  addBtn.addEventListener("click", () => {
    body.insertBefore(createConditionRow({ operator: ">=", value: "" }), addBtn);
  });
  body.appendChild(addBtn);

  card.appendChild(body);

  header.querySelector(".ind-group-remove").addEventListener("click", () => {
    card.remove();
    renumberGroups();
  });

  return card;
}

function createConditionRow(cond) {
  const row = document.createElement("div");
  row.className = "ind-condition-row";

  const ops = getOperators(indInputType.value);
  const selectHtml = ops.map(([val, label]) =>
    `<option value="${val}" ${val === cond.operator ? "selected" : ""}>${escapeHtml(label)}</option>`
  ).join("");

  let valueInput;
  if (indInputType.value === "boolean") {
    valueInput = `<select class="condition-value"><option value="true" ${cond.value === "true" ? "selected" : ""}>true</option><option value="false" ${cond.value === "false" ? "selected" : ""}>false</option></select>`;
  } else {
    valueInput = `<input type="${indInputType.value === "number" ? "number" : "text"}" class="ind-input condition-value" value="${escapeHtml(String(cond.value ?? ""))}" placeholder="${t("indConditionValue")}" step="any" />`;
  }

  row.innerHTML = `
    <select class="condition-operator">${selectHtml}</select>
    ${valueInput}
    <button class="ind-condition-remove" type="button" title="Remove">&times;</button>
  `;

  row.querySelector(".ind-condition-remove").addEventListener("click", () => row.remove());
  return row;
}

function renumberGroups() {
  indGroupsContainer.querySelectorAll(".ind-group-card").forEach((card, i) => {
    card.dataset.groupIndex = i;
    card.querySelector(".ind-group-num").textContent = `#${i + 1}`;
  });
}

indAddGroupBtn.addEventListener("click", () => {
  const idx = indGroupsContainer.children.length;
  const card = createGroupCard({ output_label: "", output_color: "#9ca3af", output_score: 0, conditions: [{ operator: ">=", value: "" }] }, idx);
  indGroupsContainer.appendChild(card);
});

// Update operator options when input type changes
indInputType.addEventListener("change", () => {
  // Rebuild all condition rows with new operators
  const groups = indGroupsContainer.querySelectorAll(".ind-group-card");
  for (const card of groups) {
    const body = card.querySelector(".ind-group-body");
    const condRows = body.querySelectorAll(".ind-condition-row");
    for (const row of condRows) {
      const ops = getOperators(indInputType.value);
      const currentOp = row.querySelector(".condition-operator").value;
      const currentVal = row.querySelector(".condition-value").value;

      const select = row.querySelector(".condition-operator");
      select.innerHTML = ops.map(([val, label]) =>
        `<option value="${val}" ${val === currentOp ? "selected" : ""}>${escapeHtml(label)}</option>`
      ).join("");

      // Replace value input if type changed to/from boolean
      const oldValue = row.querySelector(".condition-value");
      if (indInputType.value === "boolean" && oldValue.tagName !== "SELECT") {
        const sel = document.createElement("select");
        sel.className = "condition-value";
        sel.innerHTML = `<option value="true">true</option><option value="false">false</option>`;
        oldValue.replaceWith(sel);
      } else if (indInputType.value !== "boolean" && oldValue.tagName === "SELECT") {
        const inp = document.createElement("input");
        inp.type = indInputType.value === "number" ? "number" : "text";
        inp.className = "ind-input condition-value";
        inp.value = currentVal;
        inp.step = "any";
        oldValue.replaceWith(inp);
      } else if (indInputType.value === "number" && oldValue.tagName === "INPUT") {
        oldValue.type = "number";
        oldValue.step = "any";
      } else if (indInputType.value === "text" && oldValue.tagName === "INPUT") {
        oldValue.type = "text";
      }
    }
  }
});

// ── Populate class dropdown ──
function populateIndClassSelect(selectedId) {
  indClassSelect.innerHTML = `<option value="">${t("indClassNone")}</option>`;
  for (const cls of cachedIndClasses) {
    const opt = document.createElement("option");
    opt.value = cls.class_id;
    opt.textContent = cls.name;
    if (cls.class_id === selectedId) opt.selected = true;
    indClassSelect.appendChild(opt);
  }
}

// ── Reset form ──
function resetIndForm() {
  indNameInput.value = "";
  indClassSelect.value = "";
  indInputType.value = "number";
  indInputLabel.value = "";
  indGroupsContainer.innerHTML = "";
  indDefaultLabel.value = "";
  indDefaultColor.value = "#9ca3af";
  indDefaultScore.value = "0";
  indDeleteBtn.hidden = true;
  hideIndHint();
  populateIndClassSelect(null);
}

// ── Open indicator for editing ──
async function openIndicator(indicatorId) {
  editingIndicatorId = indicatorId;
  resetIndForm();

  const result = await apiRequest(`/apps/resilience/api/indicators/${indicatorId}`);
  if (!result.ok || !result.payload) return;
  const ind = result.payload;

  indNameInput.value = ind.name;
  indInputType.value = ind.input_type;
  indInputLabel.value = ind.input_label || "";
  indDefaultLabel.value = ind.default_label || "";
  indDefaultColor.value = ind.default_color || "#9ca3af";
  indDefaultScore.value = ind.default_score ?? 0;
  indDeleteBtn.hidden = false;

  // Load classes first, then select
  await loadIndClasses();
  populateIndClassSelect(ind.class_id);

  // Render groups
  const groups = ind.groups || [];
  indGroupsContainer.innerHTML = "";
  for (let i = 0; i < groups.length; i++) {
    const card = createGroupCard(groups[i], i);
    indGroupsContainer.appendChild(card);
  }

  showIndDetail();
}

// ── Collect form data ──
function collectIndicatorData() {
  const groups = [];
  indGroupsContainer.querySelectorAll(".ind-group-card").forEach((card) => {
    const outputLabel = card.querySelector(".group-output-label").value.trim();
    const outputColor = card.querySelector(".group-output-color").value;
    const outputScore = parseFloat(card.querySelector(".group-output-score").value) || 0;
    const conditions = [];
    card.querySelectorAll(".ind-condition-row").forEach((row) => {
      conditions.push({
        operator: row.querySelector(".condition-operator").value,
        value: row.querySelector(".condition-value").value,
      });
    });
    groups.push({ output_label: outputLabel, output_color: outputColor, output_score: outputScore, conditions });
  });

  return {
    name: indNameInput.value.trim(),
    class_id: indClassSelect.value || null,
    input_type: indInputType.value,
    input_label: indInputLabel.value.trim(),
    default_label: indDefaultLabel.value.trim(),
    default_color: indDefaultColor.value,
    default_score: parseFloat(indDefaultScore.value) || 0,
    groups,
  };
}

// ── Save ──
indSaveBtn.addEventListener("click", async () => {
  const data = collectIndicatorData();
  if (!data.name) {
    showIndHint(t("indNameRequired"), "error");
    return;
  }

  indSaveBtn.disabled = true;
  hideIndHint();

  let result;
  if (editingIndicatorId) {
    result = await apiRequest(`/apps/resilience/api/indicators/${editingIndicatorId}`, { method: "PUT", body: data });
  } else {
    result = await apiRequest("/apps/resilience/api/indicators", { method: "POST", body: data });
  }

  indSaveBtn.disabled = false;

  if (result.ok) {
    if (!editingIndicatorId && result.payload?.indicator_id) {
      editingIndicatorId = result.payload.indicator_id;
      indDeleteBtn.hidden = false;
    }
    showIndHint(t("indSaved"), "success");
    setTimeout(hideIndHint, 3000);
  } else {
    showIndHint(result.payload?.error || t("indSaveError"), "error");
  }
});

// ── Delete ──
indDeleteBtn.addEventListener("click", async () => {
  if (!editingIndicatorId) return;
  if (!confirm(t("indDeleteConfirm"))) return;

  const result = await apiRequest(`/apps/resilience/api/indicators/${editingIndicatorId}`, { method: "DELETE" });
  if (result.ok) {
    editingIndicatorId = null;
    showIndList();
    loadIndicators();
  }
});

// ── AAS Sources Page ─────────────────────────────────────────────
const srcListView = document.getElementById("src-list-view");
const srcDetailView = document.getElementById("src-detail-view");
const srcTbody = document.getElementById("src-tbody");
const srcEmpty = document.getElementById("src-empty");
const srcCount = document.getElementById("src-count");
const srcSearch = document.getElementById("src-search");
const srcAddBtn = document.getElementById("src-add-btn");
const srcBackBtn = document.getElementById("src-back-btn");
const srcNameInput = document.getElementById("src-name");
const srcUrlInput = document.getElementById("src-url");
const srcIdsSection = document.getElementById("src-ids-section");
const srcEndpointsSection = document.getElementById("src-endpoints-section");
const srcIdHint = document.getElementById("src-id-hint");
const srcSaveBtn = document.getElementById("src-save-btn");
const srcDeleteBtn = document.getElementById("src-delete-btn");
const srcPagination = document.getElementById("src-pagination");

// Tab elements
const srcTabs = document.querySelectorAll(".src-tab");
const srcTabContents = document.querySelectorAll(".src-tab-content");
const srcAasInput = document.getElementById("src-aas-input");
const srcAasAddBtn = document.getElementById("src-aas-add-btn");
const srcItemInput = document.getElementById("src-item-input");
const srcItemAddBtn = document.getElementById("src-item-add-btn");
const srcPrefixInput = document.getElementById("src-prefix-input");
const srcIdListAll = document.getElementById("src-id-list-all");
const srcIdListAas = document.getElementById("src-id-list-aas");
const srcIdListItem = document.getElementById("src-id-list-item");
const srcIdEmptyAll = document.getElementById("src-id-empty-all");
const srcIdEmptyAas = document.getElementById("src-id-empty-aas");
const srcIdEmptyItem = document.getElementById("src-id-empty-item");

const srcImportUrl = document.getElementById("src-import-url");
const srcImportBtn = document.getElementById("src-import-btn");
const srcDeleteAllIdsBtn = document.getElementById("src-delete-all-ids-btn");
const srcIdPagAll = document.getElementById("src-id-pag-all");
const srcIdPagAas = document.getElementById("src-id-pag-aas");
const srcIdPagItem = document.getElementById("src-id-pag-item");
const srcIdSearchInput = document.getElementById("src-id-search");

// Collapsible endpoints
const srcEndpointsToggle = document.getElementById("src-endpoints-toggle");
const srcEndpointsBody = document.getElementById("src-endpoints-body");

let sourcesData = [];
let srcPage = 0;
const SRC_PER_PAGE = 20;
let editingSourceId = null;
let editingSourceIds = [];
let activeSrcTab = "all";
let srcIdPageAll = 0, srcIdPageAas = 0, srcIdPageItem = 0;
const SRC_ID_PER_PAGE = 20;

function showSrcList() { srcListView.hidden = false; srcDetailView.hidden = true; }
function showSrcDetail() { srcListView.hidden = true; srcDetailView.hidden = false; }

// Tab switching
srcTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeSrcTab = tab.dataset.tab;
    srcTabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === activeSrcTab));
    srcTabContents.forEach((c) => c.classList.toggle("active", c.id === "src-tab-content-" + activeSrcTab));
  });
});

// ID search
srcIdSearchInput.addEventListener("input", () => { srcIdPageAll = 0; srcIdPageAas = 0; srcIdPageItem = 0; renderSrcIdTabs(); });

// Collapsible endpoints toggle
srcEndpointsToggle.addEventListener("click", () => {
  const open = srcEndpointsBody.hidden;
  srcEndpointsBody.hidden = !open;
  srcEndpointsToggle.classList.toggle("open", open);
});

async function loadSources() {
  const result = await apiRequest("/apps/resilience/api/aas-sources");
  if (result.ok && result.payload) {
    sourcesData = result.payload.sources || [];
  }
  renderSources();
}

function renderSources() {
  const q = srcSearch.value.trim().toLowerCase();
  const filtered = q
    ? sourcesData.filter((s) => s.name.toLowerCase().includes(q) || s.base_url.toLowerCase().includes(q))
    : sourcesData;

  const total = filtered.length;
  const totalPages = Math.ceil(total / SRC_PER_PAGE);
  if (srcPage >= totalPages) srcPage = Math.max(0, totalPages - 1);

  const start = srcPage * SRC_PER_PAGE;
  const pageItems = filtered.slice(start, start + SRC_PER_PAGE);

  srcTbody.innerHTML = "";
  srcEmpty.hidden = total > 0 || sourcesData.length > 0;
  srcCount.textContent = total + " " + t("srcCount");

  for (const src of pageItems) {
    const tr = document.createElement("tr");
    tr.dataset.sourceId = src.source_id;
    const urlDisplay = src.base_url.length > 40 ? src.base_url.slice(0, 40) + "…" : src.base_url;
    tr.innerHTML = `
      <td>${escapeHtml(src.name)}</td>
      <td class="src-td-url">${escapeHtml(urlDisplay)}</td>
      <td>${src.id_count}</td>
      <td><button class="ind-edit-btn" title="Edit">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button></td>`;
    srcTbody.appendChild(tr);
  }

  // Pagination
  if (total === 0) { srcPagination.innerHTML = ""; return; }
  let pagHtml = `<span class="pag-total">${total} ${t("srcCount")}</span>`;
  if (totalPages > 1) {
    pagHtml += `<div class="pag-controls">`;
    pagHtml += `<button class="pag-btn" id="src-prev" ${srcPage === 0 ? "disabled" : ""}>&laquo;</button>`;
    pagHtml += `<span>${srcPage + 1} / ${totalPages}</span>`;
    pagHtml += `<button class="pag-btn" id="src-next" ${srcPage >= totalPages - 1 ? "disabled" : ""}>&raquo;</button>`;
    pagHtml += `</div>`;
  }
  srcPagination.innerHTML = pagHtml;

  const prevBtn = document.getElementById("src-prev");
  const nextBtn = document.getElementById("src-next");
  if (prevBtn) prevBtn.addEventListener("click", () => { srcPage--; renderSources(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { srcPage++; renderSources(); });
}

srcSearch.addEventListener("input", () => { srcPage = 0; renderSources(); });

srcTbody.addEventListener("click", (e) => {
  const tr = e.target.closest("tr[data-source-id]");
  if (tr) openSource(tr.dataset.sourceId);
});

srcAddBtn.addEventListener("click", () => {
  editingSourceId = null;
  editingSourceIds = [];
  resetSrcForm();
  srcIdsSection.hidden = true;
  srcEndpointsSection.hidden = true;
  srcDeleteBtn.hidden = true;
  showSrcDetail();
});

srcBackBtn.addEventListener("click", () => {
  showSrcList();
});

function resetSrcForm() {
  srcNameInput.value = "";
  srcUrlInput.value = "";
  srcAasInput.value = "";
  srcItemInput.value = "";
  srcPrefixInput.value = "";
  srcImportUrl.value = "";
  srcIdSearchInput.value = "";
  srcIdListAll.innerHTML = "";
  srcIdListAas.innerHTML = "";
  srcIdListItem.innerHTML = "";
  srcIdEmptyAll.hidden = false;
  srcIdEmptyAas.hidden = false;
  srcIdEmptyItem.hidden = false;
  srcIdPagAll.innerHTML = "";
  srcIdPagAas.innerHTML = "";
  srcIdPagItem.innerHTML = "";
  srcIdPageAll = 0; srcIdPageAas = 0; srcIdPageItem = 0;
  hideSrcIdHint();
  // Reset to first tab
  activeSrcTab = "all";
  srcTabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === "all"));
  srcTabContents.forEach((c) => c.classList.toggle("active", c.id === "src-tab-content-all"));
  // Collapse endpoints
  srcEndpointsBody.hidden = true;
  srcEndpointsToggle.classList.remove("open");
}

async function openSource(sourceId) {
  editingSourceId = sourceId;
  const result = await apiRequest(`/apps/resilience/api/aas-sources/${sourceId}`);
  if (!result.ok || !result.payload) return;
  const src = result.payload;
  srcNameInput.value = src.name;
  srcUrlInput.value = src.base_url;
  srcPrefixInput.value = src.item_prefix || "";
  editingSourceIds = src.ids || [];
  renderSrcIdTabs();
  srcIdsSection.hidden = false;
  srcEndpointsSection.hidden = false;
  srcDeleteBtn.hidden = false;
  // Reset to first tab
  activeSrcTab = "all";
  srcTabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === "all"));
  srcTabContents.forEach((c) => c.classList.toggle("active", c.id === "src-tab-content-all"));
  showSrcDetail();
}

function buildIdItem(entry, showBadge) {
  const li = document.createElement("li");
  li.className = "src-id-item";
  let badge = "";
  if (showBadge) {
    const cls = entry.entry_type === "item" ? "src-badge-item" : "src-badge-aas";
    const label = entry.entry_type === "item" ? "Item" : "AAS";
    badge = `<span class="src-id-badge ${cls}">${label}</span>`;
  }
  let display;
  if (entry.entry_type === "item" && showBadge) {
    // Alle-Tab: show full AAS ID (= prefix + item_id) as main text
    display = `<span class="src-id-text">${escapeHtml(entry.aas_id)}</span>`;
  } else if (entry.entry_type === "item") {
    // Item-Tab: show item_id bold + computed AAS ID muted
    display = `<span class="src-id-item-id">${escapeHtml(entry.item_id)}</span><span class="src-id-computed">${escapeHtml(entry.aas_id)}</span>`;
  } else {
    display = `<span class="src-id-text">${escapeHtml(entry.aas_id)}</span>`;
  }
  li.innerHTML = `
    ${badge}${display}
    <button class="src-id-remove" data-entry-id="${entry.entry_id}" title="Remove">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>`;
  return li;
}

function renderSrcIdTabs() {
  const q = srcIdSearchInput.value.trim().toLowerCase();
  const match = (e) => !q || (e.aas_id && e.aas_id.toLowerCase().includes(q)) || (e.item_id && e.item_id.toLowerCase().includes(q));
  const allEntries = editingSourceIds.filter(match);
  const aasEntries = allEntries.filter((e) => e.entry_type !== "item");
  const itemEntries = allEntries.filter((e) => e.entry_type === "item");

  renderIdTab(allEntries, srcIdListAll, srcIdEmptyAll, srcIdPagAll, true, "all");
  renderIdTab(aasEntries, srcIdListAas, srcIdEmptyAas, srcIdPagAas, false, "aas");
  renderIdTab(itemEntries, srcIdListItem, srcIdEmptyItem, srcIdPagItem, false, "item");
  srcDeleteAllIdsBtn.hidden = editingSourceIds.length === 0;
}

function renderIdTab(entries, listEl, emptyEl, pagEl, showBadge, tabKey) {
  listEl.innerHTML = "";
  emptyEl.hidden = entries.length > 0;
  pagEl.innerHTML = "";

  if (entries.length === 0) return;

  const total = entries.length;
  const totalPages = Math.ceil(total / SRC_ID_PER_PAGE);
  let page = tabKey === "all" ? srcIdPageAll : tabKey === "aas" ? srcIdPageAas : srcIdPageItem;
  if (page >= totalPages) page = Math.max(0, totalPages - 1);
  if (tabKey === "all") srcIdPageAll = page;
  else if (tabKey === "aas") srcIdPageAas = page;
  else srcIdPageItem = page;

  const start = page * SRC_ID_PER_PAGE;
  const pageItems = entries.slice(start, start + SRC_ID_PER_PAGE);
  for (const entry of pageItems) listEl.appendChild(buildIdItem(entry, showBadge));

  if (totalPages > 1) {
    let h = `<span class="pag-total">${total}</span>`;
    h += `<button class="pag-btn" data-id-pag="${tabKey}" data-dir="prev" ${page === 0 ? "disabled" : ""}>&laquo;</button>`;
    h += `<span>${page + 1} / ${totalPages}</span>`;
    h += `<button class="pag-btn" data-id-pag="${tabKey}" data-dir="next" ${page >= totalPages - 1 ? "disabled" : ""}>&raquo;</button>`;
    pagEl.innerHTML = h;
    pagEl.querySelectorAll("[data-id-pag]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const k = btn.dataset.idPag;
        const dir = btn.dataset.dir === "prev" ? -1 : 1;
        if (k === "all") srcIdPageAll += dir;
        else if (k === "aas") srcIdPageAas += dir;
        else srcIdPageItem += dir;
        renderSrcIdTabs();
      });
    });
  }
}

function showSrcIdHint(msg, type) {
  srcIdHint.textContent = msg;
  srcIdHint.className = "settings-hint hint-" + type;
  srcIdHint.hidden = false;
}
function hideSrcIdHint() { srcIdHint.hidden = true; }

// Add AAS ID (direct IRI)
srcAasAddBtn.addEventListener("click", async () => {
  const aasId = srcAasInput.value.trim();
  if (!aasId || !editingSourceId) return;
  hideSrcIdHint();
  srcAasAddBtn.disabled = true;

  const result = await apiRequest(`/apps/resilience/api/aas-sources/${editingSourceId}/ids`, {
    method: "POST",
    body: { aas_id: aasId, entry_type: "aas" },
  });
  srcAasAddBtn.disabled = false;

  if (result.ok) {
    editingSourceIds.push({ entry_id: result.payload.entry_id, aas_id: result.payload.aas_id, entry_type: "aas", item_id: "" });
    renderSrcIdTabs();
    srcAasInput.value = "";
    showSrcIdHint(t("srcIdAdded"), "success");
  } else if (result.status === 409) {
    showSrcIdHint(t("srcIdDuplicate"), "error");
  }
});

// Add Item ID (prefix + item_id)
srcItemAddBtn.addEventListener("click", async () => {
  const itemId = srcItemInput.value.trim();
  if (!itemId || !editingSourceId) return;
  hideSrcIdHint();
  srcItemAddBtn.disabled = true;

  const result = await apiRequest(`/apps/resilience/api/aas-sources/${editingSourceId}/ids`, {
    method: "POST",
    body: { entry_type: "item", item_id: itemId },
  });
  srcItemAddBtn.disabled = false;

  if (result.ok) {
    editingSourceIds.push({ entry_id: result.payload.entry_id, aas_id: result.payload.aas_id, entry_type: "item", item_id: itemId });
    renderSrcIdTabs();
    srcItemInput.value = "";
    showSrcIdHint(t("srcIdAdded"), "success");
  } else if (result.status === 409) {
    showSrcIdHint(t("srcIdDuplicate"), "error");
  }
});

// Remove ID (works across all tabs via event delegation)
document.getElementById("src-ids-section").addEventListener("click", async (e) => {
  const btn = e.target.closest(".src-id-remove");
  if (!btn || !editingSourceId) return;
  const entryId = btn.dataset.entryId;
  const result = await apiRequest(`/apps/resilience/api/aas-sources/${editingSourceId}/ids/${entryId}`, {
    method: "DELETE",
  });
  if (result.ok) {
    editingSourceIds = editingSourceIds.filter((x) => x.entry_id !== entryId);
    renderSrcIdTabs();
    showSrcIdHint(t("srcIdRemoved"), "success");
  }
});

// Import Item IDs from external endpoint
srcImportBtn.addEventListener("click", async () => {
  const url = srcImportUrl.value.trim();
  if (!url || !editingSourceId) return showSrcIdHint(t("srcImportUrlRequired"), "error");
  hideSrcIdHint();
  srcImportBtn.disabled = true;
  srcImportBtn.querySelector("span").textContent = t("srcImporting");

  const result = await apiRequest(`/apps/resilience/api/aas-sources/${editingSourceId}/ids/import`, {
    method: "POST",
    body: { url },
  });

  srcImportBtn.disabled = false;
  srcImportBtn.querySelector("span").textContent = t("srcImport");

  if (result.ok && result.payload) {
    const msg = t("srcImportDone")
      .replace("{added}", result.payload.added)
      .replace("{duplicates}", result.payload.duplicates);
    showSrcIdHint(msg, "success");
    // Reload source to get updated IDs
    const reload = await apiRequest(`/apps/resilience/api/aas-sources/${editingSourceId}`);
    if (reload.ok && reload.payload) {
      editingSourceIds = reload.payload.ids || [];
      renderSrcIdTabs();
    }
    srcImportUrl.value = "";
    loadSources();
  } else {
    showSrcIdHint(t("srcImportError"), "error");
  }
});

// Delete all IDs
srcDeleteAllIdsBtn.addEventListener("click", async () => {
  if (!editingSourceId) return;
  if (!confirm(t("srcDeleteAllConfirm"))) return;
  hideSrcIdHint();

  const result = await apiRequest(`/apps/resilience/api/aas-sources/${editingSourceId}/ids`, {
    method: "DELETE",
  });

  if (result.ok) {
    const count = result.payload?.deleted || 0;
    editingSourceIds = [];
    renderSrcIdTabs();
    showSrcIdHint(t("srcDeleteAllDone").replace("{count}", count), "success");
    loadSources();
  }
});

srcSaveBtn.addEventListener("click", async () => {
  const name = srcNameInput.value.trim();
  const baseUrl = srcUrlInput.value.trim();
  if (!name) return showSrcIdHint(t("srcNameRequired"), "error");
  if (!baseUrl) return showSrcIdHint(t("srcUrlRequired"), "error");
  hideSrcIdHint();
  srcSaveBtn.disabled = true;
  const itemPrefix = srcPrefixInput.value.trim();

  if (editingSourceId) {
    const result = await apiRequest(`/apps/resilience/api/aas-sources/${editingSourceId}`, {
      method: "PUT",
      body: { name, base_url: baseUrl, item_prefix: itemPrefix },
    });
    srcSaveBtn.disabled = false;
    if (result.ok) {
      showSrcIdHint(t("srcSaved"), "success");
      loadSources();
    } else {
      showSrcIdHint(t("srcSaveError"), "error");
    }
  } else {
    const result = await apiRequest("/apps/resilience/api/aas-sources", {
      method: "POST",
      body: { name, base_url: baseUrl, item_prefix: itemPrefix },
    });
    srcSaveBtn.disabled = false;
    if (result.ok) {
      editingSourceId = result.payload.source_id;
      editingSourceIds = [];
      renderSrcIdTabs();
      srcIdsSection.hidden = false;
      srcEndpointsSection.hidden = false;
      srcDeleteBtn.hidden = false;
      showSrcIdHint(t("srcSaved"), "success");
      loadSources();
    } else {
      showSrcIdHint(t("srcSaveError"), "error");
    }
  }
});

srcDeleteBtn.addEventListener("click", async () => {
  if (!editingSourceId) return;
  if (!confirm(t("srcDeleteConfirm"))) return;
  const result = await apiRequest(`/apps/resilience/api/aas-sources/${editingSourceId}`, { method: "DELETE" });
  if (result.ok) {
    editingSourceId = null;
    showSrcList();
    loadSources();
  }
});

// ── AAS Data: Internal Nav + Overview ─────────────────────────────
const aasDataNav = document.getElementById("aas-data-nav");
const aasNavOverview = document.getElementById("aas-nav-overview");
const aasNavSources = document.getElementById("aas-nav-sources");
const aasOvList = document.getElementById("aas-overview-list");
const aasOvDetail = document.getElementById("aas-overview-detail");
const aasOvTbody = document.getElementById("aas-ov-tbody");
const aasOvEmpty = document.getElementById("aas-ov-empty");
const aasOvCount = document.getElementById("aas-ov-count");
const aasOvSearch = document.getElementById("aas-ov-search");
const aasOvBackBtn = document.getElementById("aas-ov-back-btn");
const aasProgress = document.getElementById("aas-progress");
const aasProgressBar = document.getElementById("aas-progress-bar");
const aasProgressText = document.getElementById("aas-progress-text");
const aasShellInfo = document.getElementById("aas-shell-info");
const aasSubmodelsContainer = document.getElementById("aas-submodels-container");
const aasOvPagination = document.getElementById("aas-ov-pagination");
const aasOvImportBtn = document.getElementById("aas-ov-import-btn");
const globalImportStatus = document.getElementById("global-import-status");
const globalImportBar = document.getElementById("global-import-bar");
const globalImportText = document.getElementById("global-import-text");

let aasOverviewData = [];
let aasImporting = false;

// Nav switching
aasDataNav.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-aas-nav]");
  if (!btn) return;
  switchAasNav(btn.dataset.aasNav);
});

function switchAasNav(nav) {
  activeAasNav = nav;
  aasDataNav.querySelectorAll(".docs-nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.aasNav === nav);
  });
  aasNavOverview.hidden = nav !== "overview";
  aasNavSources.hidden = nav !== "sources";
  aasNavGroups.hidden = nav !== "groups";
  aasNavAssign.hidden = nav !== "assign";

  if (nav === "overview") {
    showAasOvList();
    loadAasOverview();
  } else if (nav === "sources") {
    showSrcList();
    loadSources();
  } else if (nav === "groups") {
    showGrpList();
    loadGroups();
  } else if (nav === "assign") {
    loadAssignPage();
  }
}

function showAasOvList() {
  aasOvList.hidden = false;
  aasOvDetail.hidden = true;
}

function showAasOvDetail() {
  aasOvList.hidden = true;
  aasOvDetail.hidden = false;
}

async function loadAasOverview() {
  const result = await apiRequest("/apps/resilience/api/aas-overview");
  if (result.ok && result.payload) {
    aasOverviewData = result.payload.entries || [];
  }
  renderAasOverview();
}

function renderAasOverview() {
  const q = aasOvSearch.value.trim().toLowerCase();
  const filtered = q
    ? aasOverviewData.filter((e) => e.aas_id.toLowerCase().includes(q) || e.source_name.toLowerCase().includes(q) || (e.group_name && e.group_name.toLowerCase().includes(q)))
    : aasOverviewData;

  const total = filtered.length;
  const totalPages = Math.ceil(total / AAS_OV_PER_PAGE);
  if (aasOvPage >= totalPages) aasOvPage = Math.max(0, totalPages - 1);

  const start = aasOvPage * AAS_OV_PER_PAGE;
  const pageItems = filtered.slice(start, start + AAS_OV_PER_PAGE);

  aasOvTbody.innerHTML = "";
  aasOvEmpty.hidden = total > 0;
  aasOvCount.textContent = total + " " + t("aasOvCount");

  for (const entry of pageItems) {
    const tr = document.createElement("tr");
    tr.className = "aas-ov-row";
    tr.dataset.sourceId = entry.source_id;
    tr.dataset.aasId = entry.aas_id;
    const idDisplay = entry.aas_id.length > 60 ? entry.aas_id.slice(0, 60) + "\u2026" : entry.aas_id;
    const grpDisplay = entry.group_name ? escapeHtml(entry.group_name) : "\u2014";
    const impDisplay = entry.imported_at || "\u2014";
    const statusIcon = entry.imported_at
      ? `<svg class="aas-ov-status-ok" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
      : `<svg class="aas-ov-status-no" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    const viewBtn = entry.imported_at
      ? `<button class="aas-ov-view-btn" data-view-aas="${escapeHtml(entry.aas_id)}" title="${t("aasOvView")}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>`
      : "";
    tr.innerHTML = `<td class="src-td-url">${escapeHtml(idDisplay)}</td><td class="aas-ov-copy-cell"><button class="aas-ov-copy-btn" data-copy="${escapeHtml(entry.aas_id)}" title="Copy AAS ID"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></td><td>${escapeHtml(entry.source_name)}</td><td>${grpDisplay}</td><td>${impDisplay}</td><td class="aas-ov-status-cell">${statusIcon}</td><td class="aas-ov-view-cell">${viewBtn}</td>`;
    aasOvTbody.appendChild(tr);
  }

  // Pagination
  if (total === 0) { aasOvPagination.innerHTML = ""; return; }
  let pagHtml = `<span class="pag-total">${total} ${t("aasOvCount")}</span>`;
  if (totalPages > 1) {
    pagHtml += `<div class="pag-controls">`;
    pagHtml += `<button class="pag-btn" id="aas-ov-prev" ${aasOvPage === 0 ? "disabled" : ""}>&laquo;</button>`;
    pagHtml += `<span>${aasOvPage + 1} / ${totalPages}</span>`;
    pagHtml += `<button class="pag-btn" id="aas-ov-next" ${aasOvPage >= totalPages - 1 ? "disabled" : ""}>&raquo;</button>`;
    pagHtml += `</div>`;
  }
  aasOvPagination.innerHTML = pagHtml;

  const prevBtn = document.getElementById("aas-ov-prev");
  const nextBtn = document.getElementById("aas-ov-next");
  if (prevBtn) prevBtn.addEventListener("click", () => { aasOvPage--; renderAasOverview(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { aasOvPage++; renderAasOverview(); });
}

aasOvSearch.addEventListener("input", () => { aasOvPage = 0; renderAasOverview(); });

// Import all AAS IDs (server-side)
aasOvImportBtn.addEventListener("click", async () => {
  if (aasImporting) return;
  const result = await apiRequest("/apps/resilience/api/aas-import", { method: "POST" });
  if (result.ok) startImportPolling();
});

let importPollTimer = null;

function startImportPolling() {
  if (importPollTimer) return;
  aasImporting = true;
  aasOvImportBtn.disabled = true;
  globalImportStatus.hidden = false;
  globalImportStatus.className = "global-import-status";

  importPollTimer = setInterval(async () => {
    const result = await apiRequest("/apps/resilience/api/aas-import-status");
    if (!result.ok || !result.payload) return;
    const { running, total, done, errors } = result.payload;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    globalImportBar.style.width = pct + "%";
    globalImportText.textContent = `${done} / ${total}`;

    if (!running) {
      clearInterval(importPollTimer);
      importPollTimer = null;
      aasImporting = false;
      aasOvImportBtn.disabled = false;
      if (errors > 0) {
        globalImportStatus.className = "global-import-status error";
        globalImportText.textContent = `${errors} ${t("aasImportErrors")}`;
      } else {
        globalImportStatus.className = "global-import-status done";
        globalImportText.textContent = t("aasImportDone");
      }
      if (activePage === "aas-data" && activeAasNav === "overview") loadAasOverview();
      setTimeout(() => { globalImportStatus.hidden = true; }, 4000);
    }
  }, 2000);
}

// Check if import is running on page load (survives F5)
(async () => {
  const result = await apiRequest("/apps/resilience/api/aas-import-status");
  if (result.ok && result.payload?.running) startImportPolling();
})();

// Overview table click handler (copy, view, row click)
aasOvTbody.addEventListener("click", (e) => {
  // View imported data (eye icon)
  const viewBtn = e.target.closest(".aas-ov-view-btn");
  if (viewBtn) {
    e.stopPropagation();
    loadImportedAas(viewBtn.dataset.viewAas);
    return;
  }
  // Copy AAS ID
  const copyBtn = e.target.closest(".aas-ov-copy-btn");
  if (copyBtn) {
    e.stopPropagation();
    navigator.clipboard.writeText(copyBtn.dataset.copy).then(() => {
      copyBtn.classList.add("copied");
      setTimeout(() => copyBtn.classList.remove("copied"), 1200);
    });
    return;
  }
  // Click on row → load shell + submodels live
  const tr = e.target.closest("tr.aas-ov-row");
  if (!tr) return;
  loadAasShell(tr.dataset.sourceId, tr.dataset.aasId);
});

aasOvBackBtn.addEventListener("click", showAasOvList);

async function loadAasShell(sourceId, aasId) {
  showAasOvDetail();
  aasShellInfo.innerHTML = "";
  aasSubmodelsContainer.innerHTML = "";
  aasProgress.hidden = false;
  aasProgressBar.style.width = "0%";
  aasProgressText.textContent = "0/0";

  // 1. Load shell
  const shellResult = await apiRequest(`/apps/resilience/api/aas-proxy/shell?source_id=${encodeURIComponent(sourceId)}&aas_id=${encodeURIComponent(aasId)}`);
  if (!shellResult.ok || !shellResult.payload) {
    aasProgress.hidden = true;
    aasShellInfo.innerHTML = `<div class="aas-error">${escapeHtml(t("aasOvLoadError"))}</div>`;
    return;
  }

  const shell = shellResult.payload;

  // Render shell info
  aasShellInfo.innerHTML = renderShellCard(shell);

  // 2. Extract submodel refs
  const submodelRefs = (shell.submodels || []).map((ref) => {
    const keys = ref.keys || [];
    return keys.length > 0 ? keys[0].value : null;
  }).filter(Boolean);

  const total = submodelRefs.length;
  let loaded = 0;

  aasProgressBar.style.width = `${Math.round((1 / (total + 1)) * 100)}%`;
  aasProgressText.textContent = `0/${total} ${t("aasOvSubmodels")}`;

  // 3. Load each submodel
  for (const smId of submodelRefs) {
    const smResult = await apiRequest(
      `/apps/resilience/api/aas-proxy/submodel?source_id=${encodeURIComponent(sourceId)}&aas_id=${encodeURIComponent(aasId)}&submodel_id=${encodeURIComponent(smId)}`
    );
    loaded++;
    const pct = Math.round(((loaded + 1) / (total + 1)) * 100);
    aasProgressBar.style.width = `${pct}%`;
    aasProgressText.textContent = `${loaded}/${total} ${t("aasOvSubmodels")}`;

    if (smResult.ok && smResult.payload) {
      aasSubmodelsContainer.insertAdjacentHTML("beforeend", renderSubmodelCard(smResult.payload));
    } else {
      aasSubmodelsContainer.insertAdjacentHTML("beforeend",
        `<div class="aas-sm-card aas-sm-error"><h4>${escapeHtml(smId)}</h4><p>${escapeHtml(t("aasOvSmLoadError"))}</p></div>`
      );
    }
  }

  // Done
  aasProgress.hidden = true;
}

// Load imported AAS data from DB (no live request)
async function loadImportedAas(aasId) {
  showAasOvDetail();
  aasShellInfo.innerHTML = "";
  aasSubmodelsContainer.innerHTML = "";
  aasProgress.hidden = true;

  const result = await apiRequest(`/apps/resilience/api/aas-import/${encodeURIComponent(aasId)}`);
  if (!result.ok || !result.payload) {
    aasShellInfo.innerHTML = `<div class="aas-error">${escapeHtml(t("aasOvLoadError"))}</div>`;
    return;
  }

  aasShellInfo.innerHTML = renderShellCard(result.payload.shell);
  for (const sm of result.payload.submodels) {
    aasSubmodelsContainer.insertAdjacentHTML("beforeend", renderSubmodelCard(sm));
  }
}

// ── Shell + Submodel Rendering ───────────────────────────────────

function toBase64Display(str) {
  try { return btoa(unescape(encodeURIComponent(str))); } catch { return btoa(str); }
}

function renderShellCard(shell) {
  const idShort = shell.idShort || "";
  const id = shell.id || "";
  const b64 = id ? toBase64Display(id) : "";
  const asset = shell.assetInformation || {};
  const assetKind = asset.assetKind || "";
  const assetType = asset.assetType || "";
  const globalAssetId = asset.globalAssetId || "";

  let html = `<h3 class="aas-card-title">${escapeHtml(t("aasOvShellTitle"))}</h3><table class="aas-info-table">`;
  if (idShort) html += `<tr><td class="aas-info-label">${escapeHtml(t("aasOvIdShort"))}</td><td>${escapeHtml(idShort)}</td></tr>`;
  html += `<tr><td class="aas-info-label">${escapeHtml(t("aasOvId"))}</td><td class="aas-id-cell">${escapeHtml(id)}</td></tr>`;
  if (b64) html += `<tr><td class="aas-info-label">Base64</td><td class="aas-id-cell aas-b64">${escapeHtml(b64)}</td></tr>`;
  if (assetKind) html += `<tr><td class="aas-info-label">${escapeHtml(t("aasOvAssetKind"))}</td><td>${escapeHtml(assetKind)}</td></tr>`;
  if (assetType) html += `<tr><td class="aas-info-label">${escapeHtml(t("aasOvAssetType"))}</td><td>${escapeHtml(assetType)}</td></tr>`;
  if (globalAssetId) html += `<tr><td class="aas-info-label">${escapeHtml(t("aasOvGlobalAssetId"))}</td><td class="aas-id-cell">${escapeHtml(globalAssetId)}</td></tr>`;
  html += `</table>`;
  return html;
}

function renderSubmodelCard(sm) {
  const idShort = sm.idShort || "";
  const id = sm.id || "";
  const b64 = id ? toBase64Display(id) : "";
  const semanticId = (sm.semanticId?.keys || []).map((k) => k.value).join(" / ") || "";
  const elements = sm.submodelElements || [];

  let html = `<div class="aas-sm-card"><h4 class="aas-card-title">${escapeHtml(t("aasOvSubmodelTitle"))}: ${escapeHtml(idShort || id)}</h4>`;
  html += `<table class="aas-info-table">`;
  if (idShort) html += `<tr><td class="aas-info-label">${escapeHtml(t("aasOvIdShort"))}</td><td>${escapeHtml(idShort)}</td></tr>`;
  html += `<tr><td class="aas-info-label">${escapeHtml(t("aasOvId"))}</td><td class="aas-id-cell">${escapeHtml(id)}</td></tr>`;
  if (b64) html += `<tr><td class="aas-info-label">Base64</td><td class="aas-id-cell aas-b64">${escapeHtml(b64)}</td></tr>`;
  if (semanticId) html += `<tr><td class="aas-info-label">${escapeHtml(t("aasOvSemanticId"))}</td><td class="aas-id-cell">${escapeHtml(semanticId)}</td></tr>`;
  html += `</table>`;

  if (elements.length > 0) {
    html += `<div class="aas-elements"><h5 class="aas-elements-title">${escapeHtml(t("aasOvElements"))}</h5>`;
    html += renderElements(elements, 0);
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

function renderElements(elements, depth) {
  let html = `<ul class="aas-el-list" style="padding-left:${depth > 0 ? "1.2rem" : "0"}">`;
  for (const el of elements) {
    html += renderElement(el, depth);
  }
  html += `</ul>`;
  return html;
}

function renderElement(el, depth) {
  const mt = el.modelType || "";
  const name = el.idShort || "";

  switch (mt) {
    case "Property": {
      const val = el.value ?? "";
      const vt = el.valueType || "";
      return `<li class="aas-el-item"><span class="aas-el-name">${escapeHtml(name)}</span> = <span class="aas-el-value">${escapeHtml(String(val))}</span>${vt ? ` <span class="aas-el-type">[${escapeHtml(vt)}]</span>` : ""}</li>`;
    }
    case "MultiLanguageProperty": {
      const langs = el.value || [];
      const parts = langs.map((l) => `${l.language}: ${l.text}`).join(", ");
      return `<li class="aas-el-item"><span class="aas-el-name">${escapeHtml(name)}</span> = <span class="aas-el-value">${escapeHtml(parts)}</span></li>`;
    }
    case "Range": {
      const min = el.min ?? "";
      const max = el.max ?? "";
      const vt = el.valueType || "";
      return `<li class="aas-el-item"><span class="aas-el-name">${escapeHtml(name)}</span> = <span class="aas-el-value">${escapeHtml(String(min))} .. ${escapeHtml(String(max))}</span>${vt ? ` <span class="aas-el-type">[${escapeHtml(vt)}]</span>` : ""}</li>`;
    }
    case "File": {
      const path = el.value || "";
      const ct = el.contentType || "";
      return `<li class="aas-el-item"><span class="aas-el-name">${escapeHtml(name)}</span> <span class="aas-el-type">[File]</span> &rarr; ${escapeHtml(path)}${ct ? ` (${escapeHtml(ct)})` : ""}</li>`;
    }
    case "Blob": {
      const ct = el.contentType || "";
      return `<li class="aas-el-item"><span class="aas-el-name">${escapeHtml(name)}</span> <span class="aas-el-type">[Blob, ${escapeHtml(ct)}]</span></li>`;
    }
    case "ReferenceElement": {
      const keys = (el.value?.keys || []).map((k) => k.value).join(" / ");
      return `<li class="aas-el-item"><span class="aas-el-name">${escapeHtml(name)}</span> &rarr; Ref(${escapeHtml(keys)})</li>`;
    }
    case "SubmodelElementCollection": {
      const children = el.value || [];
      let html = `<li class="aas-el-item aas-el-group"><span class="aas-el-name">${escapeHtml(name)}</span> <span class="aas-el-type">[Collection]</span>`;
      if (children.length > 0) html += renderElements(children, depth + 1);
      html += `</li>`;
      return html;
    }
    case "SubmodelElementList": {
      const children = el.value || [];
      let html = `<li class="aas-el-item aas-el-group"><span class="aas-el-name">${escapeHtml(name)}</span> <span class="aas-el-type">[List]</span>`;
      if (children.length > 0) html += renderElements(children, depth + 1);
      html += `</li>`;
      return html;
    }
    case "Entity": {
      const statements = el.statements || [];
      let html = `<li class="aas-el-item aas-el-group"><span class="aas-el-name">${escapeHtml(name)}</span> <span class="aas-el-type">[Entity]</span>`;
      if (statements.length > 0) html += renderElements(statements, depth + 1);
      html += `</li>`;
      return html;
    }
    default:
      return `<li class="aas-el-item"><span class="aas-el-name">${escapeHtml(name)}</span> <span class="aas-el-type">[${escapeHtml(mt)}]</span></li>`;
  }
}

// ── Asset Groups ────────────────────────────────────────────────────

// DOM refs — Groups CRUD
const aasNavGroups = document.getElementById("aas-nav-groups");
const aasNavAssign = document.getElementById("aas-nav-assign");
const grpListView = document.getElementById("grp-list-view");
const grpDetailView = document.getElementById("grp-detail-view");
const grpSearch = document.getElementById("grp-search");
const grpTbody = document.getElementById("grp-tbody");
const grpEmpty = document.getElementById("grp-empty");
const grpCount = document.getElementById("grp-count");
const grpAddBtn = document.getElementById("grp-add-btn");
const grpPagination = document.getElementById("grp-pagination");
const grpBackBtn = document.getElementById("grp-back-btn");
const grpNameInput = document.getElementById("grp-name-input");
const grpHint = document.getElementById("grp-hint");
const grpSaveBtn = document.getElementById("grp-save-btn");
const grpDeleteBtn = document.getElementById("grp-delete-btn");

// DOM refs — Assignment
const assignGrpSelect = document.getElementById("assign-grp-select");
const assignHint = document.getElementById("assign-hint");
const assignContent = document.getElementById("assign-content");
const assignSaveBtn = document.getElementById("assign-save-btn");
const grpSourceFilter = document.getElementById("grp-source-filter");
const grpAvailSearch = document.getElementById("grp-avail-search");
const grpAvailList = document.getElementById("grp-avail-list");
const grpAvailEmpty = document.getElementById("grp-avail-empty");
const grpAvailPag = document.getElementById("grp-avail-pag");
const grpAssignedSearch = document.getElementById("grp-assigned-search");
const grpAssignedList = document.getElementById("grp-assigned-list");
const grpAssignedEmpty = document.getElementById("grp-assigned-empty");
const grpAssignedPag = document.getElementById("grp-assigned-pag");
const grpAddAllBtn = document.getElementById("grp-add-all-btn");
const grpRemoveAllBtn = document.getElementById("grp-remove-all-btn");

// State
let groupsData = [];
let grpPage = 0;
const GRP_PER_PAGE = 20;
let editingGroupId = null;
let assignGroupId = null;
let grpMembers = [];
let grpAvailData = [];
let grpAvailPage = 0, grpAssignedPage = 0;
const GRP_ASSIGN_PER_PAGE = 20;

function showGrpList() { grpListView.hidden = false; grpDetailView.hidden = true; }
function showGrpDetail() { grpListView.hidden = true; grpDetailView.hidden = false; }

// ── Groups CRUD ──
async function loadGroups() {
  const result = await apiRequest("/apps/resilience/api/asset-groups");
  if (result.ok && result.payload) {
    groupsData = result.payload.groups || [];
  }
  renderGroups();
}

function renderGroups() {
  const q = grpSearch.value.trim().toLowerCase();
  const filtered = q ? groupsData.filter((g) => g.name.toLowerCase().includes(q)) : groupsData;
  const total = filtered.length;
  const totalPages = Math.ceil(total / GRP_PER_PAGE);
  if (grpPage >= totalPages) grpPage = Math.max(0, totalPages - 1);
  const start = grpPage * GRP_PER_PAGE;
  const pageItems = filtered.slice(start, start + GRP_PER_PAGE);

  grpTbody.innerHTML = "";
  grpEmpty.hidden = total > 0 || groupsData.length > 0;
  grpCount.textContent = total + " " + t("grpCount");

  for (const grp of pageItems) {
    const tr = document.createElement("tr");
    tr.dataset.groupId = grp.group_id;
    tr.innerHTML = `
      <td>${escapeHtml(grp.name)}</td>
      <td>${grp.member_count}</td>
      <td><button class="ind-edit-btn" title="Edit">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button></td>`;
    grpTbody.appendChild(tr);
  }

  if (total === 0) { grpPagination.innerHTML = ""; return; }
  let pagHtml = `<span class="pag-total">${total} ${t("grpCount")}</span>`;
  if (totalPages > 1) {
    pagHtml += `<div class="pag-controls">`;
    pagHtml += `<button class="pag-btn" id="grp-prev" ${grpPage === 0 ? "disabled" : ""}>&laquo;</button>`;
    pagHtml += `<span>${grpPage + 1} / ${totalPages}</span>`;
    pagHtml += `<button class="pag-btn" id="grp-next" ${grpPage >= totalPages - 1 ? "disabled" : ""}>&raquo;</button>`;
    pagHtml += `</div>`;
  }
  grpPagination.innerHTML = pagHtml;
  const prevBtn = document.getElementById("grp-prev");
  const nextBtn = document.getElementById("grp-next");
  if (prevBtn) prevBtn.addEventListener("click", () => { grpPage--; renderGroups(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { grpPage++; renderGroups(); });
}

grpSearch.addEventListener("input", () => { grpPage = 0; renderGroups(); });

grpTbody.addEventListener("click", (e) => {
  const tr = e.target.closest("tr[data-group-id]");
  if (tr) openGroup(tr.dataset.groupId);
});

grpAddBtn.addEventListener("click", async () => {
  grpAddBtn.disabled = true;
  const result = await apiRequest("/apps/resilience/api/asset-groups", {
    method: "POST",
    body: { name: t("assetsNavGroups") + " " + (groupsData.length + 1) },
  });
  grpAddBtn.disabled = false;
  if (result.ok && result.payload) {
    await loadGroups();
    openGroup(result.payload.group_id);
  }
});

grpBackBtn.addEventListener("click", () => { showGrpList(); loadGroups(); });

async function openGroup(groupId) {
  editingGroupId = groupId;
  grpHint.hidden = true;
  const result = await apiRequest(`/apps/resilience/api/asset-groups/${groupId}`);
  if (!result.ok || !result.payload) return;
  grpNameInput.value = result.payload.name;
  grpDeleteBtn.hidden = false;
  showGrpDetail();
}

grpSaveBtn.addEventListener("click", async () => {
  const name = grpNameInput.value.trim();
  if (!name) { showGrpHint(t("grpNameRequired"), "error"); return; }
  grpHint.hidden = true;
  grpSaveBtn.disabled = true;
  // Save name only — keep existing members untouched
  const grpResult = await apiRequest(`/apps/resilience/api/asset-groups/${editingGroupId}`);
  const existingMembers = (grpResult.ok && grpResult.payload) ? (grpResult.payload.members || []) : [];
  const result = await apiRequest(`/apps/resilience/api/asset-groups/${editingGroupId}`, {
    method: "PUT",
    body: { name, members: existingMembers },
  });
  grpSaveBtn.disabled = false;
  if (result.ok) showGrpHint(t("grpSaved"), "success");
});

grpDeleteBtn.addEventListener("click", async () => {
  if (!editingGroupId) return;
  if (!confirm(t("grpDeleteConfirm"))) return;
  const result = await apiRequest(`/apps/resilience/api/asset-groups/${editingGroupId}`, { method: "DELETE" });
  if (result.ok) { editingGroupId = null; showGrpList(); loadGroups(); }
});

function showGrpHint(msg, type) {
  grpHint.textContent = msg;
  grpHint.className = "settings-hint hint-" + type;
  grpHint.hidden = false;
}

// ── Assignment page ──
async function loadAssignPage() {
  assignContent.hidden = true;
  assignHint.hidden = true;
  // Load groups for dropdown
  const result = await apiRequest("/apps/resilience/api/asset-groups");
  const groups = (result.ok && result.payload) ? (result.payload.groups || []) : [];
  let html = `<option value="">\u2014</option>`;
  for (const g of groups) html += `<option value="${escapeHtml(g.group_id)}">${escapeHtml(g.name)}</option>`;
  assignGrpSelect.innerHTML = html;
  // Pre-select if there was a previous selection
  if (assignGroupId) {
    assignGrpSelect.value = assignGroupId;
    if (assignGrpSelect.value === assignGroupId) await loadAssignGroup(assignGroupId);
    else assignGroupId = null;
  }
}

assignGrpSelect.addEventListener("change", async () => {
  const id = assignGrpSelect.value;
  if (!id) { assignContent.hidden = true; assignGroupId = null; return; }
  await loadAssignGroup(id);
});

async function loadAssignGroup(groupId) {
  assignGroupId = groupId;
  assignHint.hidden = true;
  // Load group members
  const grpResult = await apiRequest(`/apps/resilience/api/asset-groups/${groupId}`);
  if (!grpResult.ok || !grpResult.payload) return;
  const savedMembers = grpResult.payload.members || [];
  grpMembers = savedMembers.map((m) => ({ aas_id: m.aas_id, source_id: m.source_id || "", source_name: "" }));
  // Load all AAS IDs
  const ovResult = await apiRequest("/apps/resilience/api/aas-overview");
  grpAvailData = (ovResult.ok && ovResult.payload) ? (ovResult.payload.entries || []) : [];
  // Enrich members with source_name
  const sourceMap = {};
  for (const e of grpAvailData) sourceMap[e.aas_id] = e.source_name;
  for (const m of grpMembers) { if (!m.source_name) m.source_name = sourceMap[m.aas_id] || ""; }
  // Populate source filter
  const sources = new Map();
  for (const e of grpAvailData) { if (!sources.has(e.source_id)) sources.set(e.source_id, e.source_name); }
  let shtml = `<option value="">${t("grpSourceAll")}</option>`;
  for (const [id, name] of sources) shtml += `<option value="${escapeHtml(id)}">${escapeHtml(name)}</option>`;
  grpSourceFilter.innerHTML = shtml;
  grpAvailPage = 0; grpAssignedPage = 0;
  grpAvailSearch.value = ""; grpAssignedSearch.value = "";
  assignContent.hidden = false;
  renderGrpAssign();
}

function renderGrpAssign() {
  const memberSet = new Set(grpMembers.map((m) => m.aas_id));

  // Available
  const srcFilter = grpSourceFilter.value;
  const qa = grpAvailSearch.value.trim().toLowerCase();
  let avail = grpAvailData.filter((e) => !memberSet.has(e.aas_id) && !e.group_id);
  if (srcFilter) avail = avail.filter((e) => e.source_id === srcFilter);
  if (qa) avail = avail.filter((e) => e.aas_id.toLowerCase().includes(qa) || e.source_name.toLowerCase().includes(qa));
  const availTotal = avail.length;
  const availPages = Math.ceil(availTotal / GRP_ASSIGN_PER_PAGE) || 1;
  if (grpAvailPage >= availPages) grpAvailPage = Math.max(0, availPages - 1);
  const availSlice = avail.slice(grpAvailPage * GRP_ASSIGN_PER_PAGE, (grpAvailPage + 1) * GRP_ASSIGN_PER_PAGE);

  grpAvailList.innerHTML = "";
  grpAvailEmpty.hidden = availTotal > 0;
  for (const entry of availSlice) {
    const li = document.createElement("li");
    li.className = "grp-id-item";
    li.innerHTML = `<div class="grp-id-info"><span class="grp-id-text" title="${escapeHtml(entry.aas_id)}">${escapeHtml(entry.aas_id)}</span><span class="grp-id-source">${escapeHtml(entry.source_name)}</span></div>
      <button class="grp-id-btn" data-add-aas="${escapeHtml(entry.aas_id)}" data-add-src="${escapeHtml(entry.source_id)}" data-add-name="${escapeHtml(entry.source_name)}"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>`;
    grpAvailList.appendChild(li);
  }
  renderAssignPag(grpAvailPag, availTotal, availPages, grpAvailPage, "avail");

  // Assigned
  const qs = grpAssignedSearch.value.trim().toLowerCase();
  let assigned = qs ? grpMembers.filter((m) => m.aas_id.toLowerCase().includes(qs) || (m.source_name && m.source_name.toLowerCase().includes(qs))) : grpMembers;
  const assignedTotal = assigned.length;
  const assignedPages = Math.ceil(assignedTotal / GRP_ASSIGN_PER_PAGE) || 1;
  if (grpAssignedPage >= assignedPages) grpAssignedPage = Math.max(0, assignedPages - 1);
  const assignedSlice = assigned.slice(grpAssignedPage * GRP_ASSIGN_PER_PAGE, (grpAssignedPage + 1) * GRP_ASSIGN_PER_PAGE);

  grpAssignedList.innerHTML = "";
  grpAssignedEmpty.hidden = assignedTotal > 0;
  for (const m of assignedSlice) {
    const li = document.createElement("li");
    li.className = "grp-id-item";
    li.innerHTML = `<div class="grp-id-info"><span class="grp-id-text" title="${escapeHtml(m.aas_id)}">${escapeHtml(m.aas_id)}</span><span class="grp-id-source">${escapeHtml(m.source_name || "")}</span></div>
      <button class="grp-id-btn grp-id-remove" data-remove-aas="${escapeHtml(m.aas_id)}"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;
    grpAssignedList.appendChild(li);
  }
  renderAssignPag(grpAssignedPag, assignedTotal, assignedPages, grpAssignedPage, "assigned");
}

function renderAssignPag(el, total, totalPages, page, key) {
  el.innerHTML = "";
  if (total === 0) return;
  let h = `<span class="pag-total">${total}</span>`;
  if (totalPages > 1) {
    h += `<button class="pag-btn" data-grp-pag="${key}" data-dir="prev" ${page === 0 ? "disabled" : ""}>&laquo;</button>`;
    h += `<span>${page + 1} / ${totalPages}</span>`;
    h += `<button class="pag-btn" data-grp-pag="${key}" data-dir="next" ${page >= totalPages - 1 ? "disabled" : ""}>&raquo;</button>`;
  }
  el.innerHTML = h;
  el.querySelectorAll("[data-grp-pag]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.grpPag === "avail") grpAvailPage += btn.dataset.dir === "prev" ? -1 : 1;
      else grpAssignedPage += btn.dataset.dir === "prev" ? -1 : 1;
      renderGrpAssign();
    });
  });
}

grpAvailList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add-aas]");
  if (!btn) return;
  const addedId = btn.dataset.addAas;
  grpMembers.push({ aas_id: addedId, source_id: btn.dataset.addSrc, source_name: btn.dataset.addName });
  const entry = grpAvailData.find((e) => e.aas_id === addedId);
  if (entry) { entry.group_id = assignGroupId; entry.group_name = null; }
  renderGrpAssign();
});

grpAssignedList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove-aas]");
  if (!btn) return;
  const removedId = btn.dataset.removeAas;
  grpMembers = grpMembers.filter((m) => m.aas_id !== removedId);
  const entry = grpAvailData.find((e) => e.aas_id === removedId);
  if (entry) { entry.group_id = null; entry.group_name = null; }
  renderGrpAssign();
});

grpAddAllBtn.addEventListener("click", () => {
  const memberSet = new Set(grpMembers.map((m) => m.aas_id));
  const srcFilter = grpSourceFilter.value;
  const qa = grpAvailSearch.value.trim().toLowerCase();
  let avail = grpAvailData.filter((e) => !memberSet.has(e.aas_id) && !e.group_id);
  if (srcFilter) avail = avail.filter((e) => e.source_id === srcFilter);
  if (qa) avail = avail.filter((e) => e.aas_id.toLowerCase().includes(qa) || e.source_name.toLowerCase().includes(qa));
  for (const e of avail) {
    grpMembers.push({ aas_id: e.aas_id, source_id: e.source_id, source_name: e.source_name });
    e.group_id = assignGroupId;
  }
  renderGrpAssign();
});

grpRemoveAllBtn.addEventListener("click", () => {
  if (grpMembers.length === 0) return;
  if (!confirm(t("grpRemoveAllConfirm"))) return;
  for (const m of grpMembers) {
    const entry = grpAvailData.find((e) => e.aas_id === m.aas_id);
    if (entry) { entry.group_id = null; entry.group_name = null; }
  }
  grpMembers = [];
  renderGrpAssign();
});

grpSourceFilter.addEventListener("change", () => { grpAvailPage = 0; renderGrpAssign(); });
grpAvailSearch.addEventListener("input", () => { grpAvailPage = 0; renderGrpAssign(); });
grpAssignedSearch.addEventListener("input", () => { grpAssignedPage = 0; renderGrpAssign(); });

assignSaveBtn.addEventListener("click", async () => {
  if (!assignGroupId) return;
  assignHint.hidden = true;
  assignSaveBtn.disabled = true;
  // Get current name from group
  const grpResult = await apiRequest(`/apps/resilience/api/asset-groups/${assignGroupId}`);
  const name = (grpResult.ok && grpResult.payload) ? grpResult.payload.name : "";
  const members = grpMembers.map((m) => ({ aas_id: m.aas_id, source_id: m.source_id || null }));
  const result = await apiRequest(`/apps/resilience/api/asset-groups/${assignGroupId}`, {
    method: "PUT",
    body: { name, members },
  });
  assignSaveBtn.disabled = false;
  if (result.ok) {
    assignHint.textContent = t("grpSaved");
    assignHint.className = "settings-hint hint-success";
    assignHint.hidden = false;
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
  const qParam = newsQuery ? `&q=${encodeURIComponent(newsQuery)}` : "";
  const result = await apiRequest(`/apps/resilience/api/news?limit=${NEWS_PER_PAGE}&offset=${offset}${qParam}`);
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
      <td class="news-td-stored">${formatDateTime(item.created_at)}</td>
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

// ── News Feeds: Search ────────────────────────────────────────────
let newsSearchTimer = null;
newsSearchInput.addEventListener("input", () => {
  clearTimeout(newsSearchTimer);
  newsSearchTimer = setTimeout(() => {
    newsQuery = newsSearchInput.value.trim();
    newsPage = 0;
    loadNews();
  }, 400);
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
          <li><strong>Indikatoren</strong> — Definiere Resilienz-Indikatoren mit flexiblen UND/ODER-Regelgruppen.</li>
          <li><strong>AI Mapping</strong> — KI-gestützte Zuordnung und Analyse (in Entwicklung).</li>
        </ul>
      `,
    },
    indicators: {
      title: "Indikatoren",
      html: `
        <h2>Indikatoren</h2>
        <p>Mit Indikatoren definierst du Regeln, die einen Input-Wert anhand von Bedingungen in eine Ausgabe (Label, Farbe, Score) umwandeln.</p>
        <h3>Aufbau eines Indikators</h3>
        <ul>
          <li><strong>Name</strong> — Bezeichnung des Indikators (z.B. "Erdbeben-Risiko").</li>
          <li><strong>Klasse</strong> — Optionale Kategorie (z.B. "Naturkatastrophen"). Klassen werden in den Einstellungen definiert.</li>
          <li><strong>Input-Typ</strong> — Art des Eingabewerts: Zahl, Text oder Boolean.</li>
          <li><strong>Input-Bezeichnung</strong> — Beschreibt was der Input darstellt (z.B. "Magnitude").</li>
        </ul>
        <h3>Regelgruppen (ODER/UND)</h3>
        <p>Ein Indikator hat eine oder mehrere Regelgruppen. Die Gruppen werden von oben nach unten ausgewertet — die erste zutreffende Gruppe bestimmt die Ausgabe.</p>
        <p>Innerhalb einer Gruppe sind die Bedingungen UND-verknüpft — alle Bedingungen müssen gleichzeitig zutreffen.</p>
        <h3>Ausgabe</h3>
        <p>Jede Regelgruppe hat eine Ausgabe bestehend aus Label, Farbe und Score. Falls keine Gruppe zutrifft, wird die Standard-Ausgabe verwendet.</p>
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
          <li><strong>Indicators</strong> — Define resilience indicators with flexible AND/OR rule groups.</li>
          <li><strong>AI Mapping</strong> — AI-powered mapping and analysis (in development).</li>
        </ul>
      `,
    },
    indicators: {
      title: "Indicators",
      html: `
        <h2>Indicators</h2>
        <p>Indicators let you define rules that transform an input value into an output (label, color, score) based on conditions.</p>
        <h3>Indicator Structure</h3>
        <ul>
          <li><strong>Name</strong> — The indicator's label (e.g. "Earthquake Risk").</li>
          <li><strong>Class</strong> — Optional category (e.g. "Natural Disasters"). Classes are defined in Settings.</li>
          <li><strong>Input Type</strong> — The type of input value: Number, Text, or Boolean.</li>
          <li><strong>Input Label</strong> — Describes what the input represents (e.g. "Magnitude").</li>
        </ul>
        <h3>Rule Groups (OR/AND)</h3>
        <p>An indicator has one or more rule groups. Groups are evaluated top to bottom — the first matching group determines the output.</p>
        <p>Within a group, conditions are AND-linked — all conditions must be met simultaneously.</p>
        <h3>Output</h3>
        <p>Each rule group has an output consisting of label, color, and score. If no group matches, the default output is used.</p>
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
