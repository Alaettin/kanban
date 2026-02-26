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

// Country Mappings DOM refs
const settingsNav = document.getElementById("settings-nav");
const settingsNavFeeds = document.getElementById("settings-nav-feeds");
const settingsNavGdacs = document.getElementById("settings-nav-gdacs");
const settingsNavAasImport = document.getElementById("settings-nav-aas-import");
const settingsNavCC = document.getElementById("settings-nav-country-codes");
const settingsNavGdeltBq = document.getElementById("settings-nav-gdelt-bq");
const settingsNavDangerZone = document.getElementById("settings-nav-danger-zone");
const bqSaInput = document.getElementById("bq-sa-input");
const bqSaSaveBtn = document.getElementById("bq-sa-save-btn");
const bqSaStatus = document.getElementById("bq-sa-status");
const cmSearchInput = document.getElementById("cm-search-input");
const cmTbody = document.getElementById("cm-tbody");
const cmEmpty = document.getElementById("cm-empty");
const cmPrevBtn = document.getElementById("cm-prev-btn");
const cmNextBtn = document.getElementById("cm-next-btn");
const cmPageInfo = document.getElementById("cm-page-info");
const cmResetBtn = document.getElementById("cm-reset-btn");
const cmConfirmModal = document.getElementById("cm-confirm-modal");
const cmConfirmCancel = document.getElementById("cm-confirm-cancel");
const cmConfirmForm = document.getElementById("cm-confirm-form");

// Single-AAS Geocoding
const geoSingleModal = document.getElementById("geo-single-modal");
const geoSingleOkBtn = document.getElementById("geo-single-ok");
const geoSingleOkLabel = document.getElementById("geo-single-ok-label");
const geoSingleCancelBtn = document.getElementById("geo-single-cancel");
let geoSinglePendingAasId = null;

// Import-single modal DOM refs
const importSingleModal = document.getElementById("import-single-modal");
const importSingleOkBtn = document.getElementById("import-single-ok");
const importSingleOkLabel = document.getElementById("import-single-ok-label");
const importSingleCancelBtn = document.getElementById("import-single-cancel");
let importSinglePendingAasId = null;

// Map modal DOM refs
const mapModal = document.getElementById("map-modal");
const mapCloseBtn = document.getElementById("map-modal-close");
const mapFilterBtn = document.getElementById("map-filter-btn");
const mapFilterLabel = document.getElementById("map-filter-label");
const mapDistBtn = document.getElementById("map-dist-btn");
const dashAasMapBtn = document.getElementById("dash-aas-map-btn");
let mapInstance = null;
let mapMatchesOnly = false;
let mapShowDist = true;
let mapCachedData = null;

// Company Detail Modal
const companyDetailModal = document.getElementById("company-detail-modal");
const cdModalClose = document.getElementById("cd-modal-close");
const cdSidebar = document.getElementById("cd-sidebar");
const cdPageLocation = document.getElementById("cd-page-location");
const cdPageAlerts = document.getElementById("cd-page-alerts");
const cdPageGdelt = document.getElementById("cd-page-gdelt");
const cdPageWorldbank = document.getElementById("cd-page-worldbank");
const cdPageInform = document.getElementById("cd-page-inform");
const cdPages = { location: cdPageLocation, alerts: cdPageAlerts, gdelt: cdPageGdelt, worldbank: cdPageWorldbank, inform: cdPageInform };
let cdMapInstance = null;
let cdAlertLayerGroup = null;
let cdAlertsVisible = true;
let cdActivePage = "location";
let cdNewsLoaded = false;
let cdGdeltLoaded = false;
let cdWorldbankLoaded = false;
let cdInformLoaded = false;
let cdCurrentAasId = null;
let cdCompanyName = "";
let cdCompanyAlias = "";

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
    aiMapping: "AI Enrichment",
    simulation: "Simulation",
    aasData: "AAS Daten",
    newsFeeds: "News Feeds",
    gdacsAlerts: "GDACS Alerts",
    dashboardTitle: "Resilience Dashboard",
    dashboardDesc: "Übersicht der Resilienz-Tools für deine Lieferkette.",
    dashEditBtn: "Kacheln bearbeiten",
    vtWizardTitle: "Wert-Kachel erstellen",
    vtStep1Desc: "Wähle eine AAS aus.",
    vtStep2Desc: "Wähle Pfade für Bezeichnung und Wert.",
    vtStep3Desc: "Wähle Darstellung und Farbe.",
    vtSearchPlaceholder: "AAS suchen\u2026",
    vtLabelField: "Bezeichnung",
    vtValueField: "Wert",
    vtFieldEmpty: "Klicke auf eine Property im Baum",
    vtBigNumber: "Große Zahl",
    vtProgressBar: "Fortschrittsbalken",
    vtStatCard: "Statistik-Karte",
    vtTextPlain: "Einfacher Text",
    vtTextBadge: "Badge",
    vtTextHighlight: "Highlight",
    vtColorLabel: "Farbe",
    vtCreate: "Erstellen",
    vtDeleteConfirm: "Kachel wirklich entfernen?",
    vtDeleteBtn: "Entfernen",
    vtCancel: "Abbrechen",
    vtBack: "Zurück",
    vtNext: "Weiter",
    vtNoAas: "Keine AAS importiert.",
    vtLoading: "Laden\u2026",
    indicatorsTitle: "Indikatoren",
    indicatorsDesc: "Überwache Resilienz-Indikatoren deiner Lieferkette.",
    aiMappingTitle: "AI Enrichment",
    aiMappingDesc: "KI-gestützte Anreicherung und Analyse.",
    simulationTitle: "Simulation",
    simulationDesc: "Szenarien simulieren und Auswirkungen analysieren.",
    simStep1: "Kalibrierung",
    simStep2: "Störungen",
    simStep3: "Gegenmaßnahmen",
    simMaterial: "Komponente auswählen",
    simSupplier: "Lieferant",
    simQty: "Benötigte Menge",
    simDelivery: "Lieferzeitpunkt",
    simOrderData: "Bestelldaten",
    simOrderMaterial: "Material-Bedarf",
    simOrderQty: "Menge pro Bestellung",
    simOrderDate: "Bestelldatum",
    simParams: "Simulationsparameter",
    simStock: "Lagerbestand",
    simBuffer: "Sicherheitspuffer",
    simReliability: "Lieferanten-Zuverlässigkeit",
    simNext: "Weiter",
    simBack: "Zurück",
    simParametrizing: "Simulation wird parametriert…",
    simRunning: "Simulation läuft…",
    simStartSim: "Simulation starten",
    simWithMeasures: "Simulation mit Maßnahmen",
    simFinish: "Neue Simulation",
    simResimulate: "Erneut simulieren",
    simSelectDisruptions: "Wähle Störungen aus, die in die Lieferkette eingebaut werden sollen.",
    simSelectMeasures: "Wähle Gegenmaßnahmen, um die Auswirkungen zu reduzieren.",
    simResults: "Auswertung",
    simComparison: "Vergleich mit Gegenmaßnahmen",
    simDelayDays: "Lieferverzögerung",
    simCostIncrease: "Kostenerhöhung",
    simFulfillment: "Erfüllungsquote",
    simRiskScore: "Risiko-Score",
    simBefore: "Vorher",
    simAfter: "Nachher",
    simSummary: "Zusammenfassung",
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
    gdacsAasFillEmpty: "Keine Länder mit AAS-Zuordnung gefunden.",
    gdacsAasFillDone: "{n} Länder aus AAS-Zuordnungen hinzugefügt.",
    gdacsAasSourceLabel: "AAS Länderzuordnung",
    gdacsAasSourceEmpty: "Nicht konfiguriert",
    gdacsAasSourceBtn: "Wählen",
    gdacsAasSourceSaved: "AAS Länderzuordnung gespeichert.",
    gdacsColsLabel: "Spaltenauswahl",
    gdacsColsEmpty: "Nicht konfiguriert",
    gdacsColsBtn: "Wählen",
    gdacsColsSaved: "Spaltenauswahl gespeichert.",
    gdacsColsCount: "{n} Spalten ausgewählt",
    // Geocoding
    geocodingTitle: "Geocoding",
    geocodingStart: "Starten",
    geocodingStep3Country: "Wähle die Property für das Land.",
    geocodingStep3City: "Wähle nun die Property für die Stadt.",
    geocodingCountryLabel: "Land",
    geocodingCityLabel: "Stadt",
    geocodingDone: "Geocoding abgeschlossen",
    geocodingErrors: "Fehler",
    // Geo-Matching
    matchPolygon: "Polygon-Match (hohe Genauigkeit)",
    matchDistance: "Distanz-Match ({km} km)",
    matchCountry: "Länderzuordnung (niedrige Genauigkeit)",
    thresholdLabel: "Matching-Radius (km)",
    // Matching-Parameter Wizard
    matchingLabel: "Matching-Parameter",
    matchingEmpty: "Nicht konfiguriert",
    matchingBtn: "Konfigurieren",
    matchingCountryStep: "Wähle den Pfad für das Land.",
    matchingCityStep: "Wähle den Pfad für die Stadt.",
    matchingLatStep: "Wähle den Pfad für Latitude.",
    matchingLonStep: "Wähle den Pfad für Longitude.",
    matchingSkip: "Überspringen",
    matchingSaved: "Matching-Parameter gespeichert.",
    matchingDeleted: "Matching-Parameter gelöscht.",
    matchingCountry: "Land",
    matchingCity: "Stadt",
    matchingLat: "Lat",
    matchingLon: "Lon",
    // Single-AAS Geocoding
    geoSingleTitle: "Geocoding",
    geoSingleDesc: "AAS-Standort wird geocodiert.",
    geoSingleCancel: "Abbrechen",
    geoSingleStart: "Starten",
    geoSingleSuccess: "Geocoding erfolgreich.",
    geoSingleError: "Geocoding fehlgeschlagen.",
    geoSingleNoPaths: "Matching-Parameter müssen zuerst konfiguriert werden.",
    companyProcessTitle: "Company Process",
    companyProcessDesc: "Wähle die Property für den Unternehmensnamen.",
    companyProcessStart: "Starten",
    companyProcessSuccess: "Company-Daten erfolgreich gespeichert.",
    companyProcessError: "Company Process fehlgeschlagen.",
    // Single-AAS Import
    importSingleTitle: "Erneut importieren?",
    importSingleDesc: "Alle gespeicherten Daten dieser AAS werden gelöscht und neu importiert. Geocoding muss danach erneut durchgeführt werden.",
    importSingleCancel: "Abbrechen",
    importSingleStart: "Importieren",
    importSingleSuccess: "Import erfolgreich.",
    importSingleError: "Import fehlgeschlagen.",
    // World Map
    mapTitle: "Weltkarte",
    mapBtnTitle: "Karte anzeigen",
    mapPopupAlerts: "Betroffene Alerts",
    mapFilterMatches: "Nur Matches",
    mapFilterAll: "Alle anzeigen",
    // Dashboard AAS Tile Settings
    dashAasSettingsTitle: "Kachel-Einstellungen",
    dashAasFilterLabel: "Match-Qualität anzeigen",
    dashAasFilterPolygon: "Polygon",
    dashAasFilterDistance: "Distanz",
    dashAasFilterCountry: "Land",
    dashAasColsLabel: "Spaltenauswahl",
    dashAasColsBtn: "Spalten wählen",
    dashAasSettingsSave: "Speichern",
    dashAasSettingsDelete: "Löschen",
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
    dashIndicatorsTitle: "Indikatoren",
    dashIndicatorsLink: "Alle anzeigen \u2192",
    dashIndicatorsEmpty: "Keine Indikatoren konfiguriert.",
    dashAasTitle: "Naturkatastrophen & Lieferkettenrisiken",
    dashAasEmpty: "Keine betroffenen Standorte erkannt.",
    dashAasUpdated: "Aktualisiert: {time}",
    dashAasPage: "Seite {page} von {pages}",
    dashAasCountryHeader: "Land",
    // Company Detail Modal
    cdTitle: "Unternehmensinformation",
    cdShellTitle: "Shell-Informationen",
    cdCountry: "Land",
    cdCity: "Stadt",
    cdCoordinates: "Koordinaten",
    cdImportedAt: "Importiert am",
    cdGeoTitle: "Standort",
    cdAlertsTitle: "GDACS Alerts",
    cdSubmodelsTitle: "Submodels",
    cdColumnsTitle: "Konfigurierte Spalten",
    cdLoadError: "Fehler beim Laden der Daten.",
    cdMatchPolygon: "Polygon",
    cdMatchDistance: "Distanz ({km} km)",
    cdMatchCountry: "Land",
    cdNoAlerts: "Keine Alerts zugeordnet.",
    cdSubmodelElements: "Elemente",
    cdTabLocation: "Standort",
    cdTabAlerts: "Google News",
    cdTabGdelt: "GDELT",
    cdTabWorldbank: "World Bank",
    cdTabInform: "INFORM Risk",
    cdGdeltPlaceholder: "GDELT-Integration wird hier verfügbar sein.",
    cdNewsTitle: "Nachrichten",
    cdNewsNoCompany: "Kein Unternehmensname vorhanden. Bitte zuerst Enrichment ausführen.",
    cdNewsEmpty: "Keine Nachrichten der letzten 14 Tage gefunden.",
    cdNewsError: "Nachrichten konnten nicht geladen werden.",
    cdNewsNoContent: "Kein Inhalt verfügbar.",
    // Indicators
    indicatorsDescNew: "Definiere Resilienz-Indikatoren für deine Lieferkette.",
    indNavClasses: "Klassen",
    indNavIndicators: "Indikatoren",
    indSearch: "Suchen…",
    indAdd: "Hinzufügen",
    indEmptyText: "Noch keine Indikatoren definiert.",
    indThName: "Name",
    indThClass: "Klasse",
    indThRules: "Regeln",
    indBack: "Zurück",
    indNameLabel: "Name",
    indClassLabel: "Klasse",
    indOpEquals: "ist gleich",
    indOpNotEquals: "ist ungleich",
    indOpGreater: "ist größer als",
    indOpLess: "ist kleiner als",
    indOpGreaterEqual: "ist größer gleich",
    indOpLessEqual: "ist kleiner gleich",
    indInputNumber: "Zahl",
    indInputText: "Text",
    indInputBoolean: "Boolean",
    indColorCustom: "Eigene Farbe…",
    // Indicator Dashboard
    indDashSettingsTitle: "Indikator-Kachel",
    indDashConfigure: "Konfigurieren",
    indDashDeleteAll: "Alle löschen",
    indDashDeleteConfirm: "Alle Indikator-Konfigurationen löschen?",
    indDashDeleteConfirmBtn: "Löschen",
    indDashCancel: "Abbrechen",
    indDashNoConfig: "Nicht konfiguriert",
    indDashConfigured: "konfiguriert",
    indWizardTitle: "Indikatoren konfigurieren",
    indWizardStep1Desc: "Wähle die AAS-Gruppe für die Auswertung",
    indWizardStep2Desc: "Wähle die Indikatoren die ausgewertet werden sollen",
    indWizardStep3Desc: "Ordne jedem Input-Typ einen AAS-Pfad zu",
    indWizardStep3aDesc: "Wähle ein Referenz-AAS-Item",
    indWizardStep3bDesc: "Klicke auf einen Pfad um den Input zuzuordnen",
    indWizardMappingFor: "Mapping für",
    indWizardSelectPath: "Pfad wählen",
    indWizardPathSet: "Zugeordnet",
    indWizardDone: "Konfiguration gespeichert",
    indWizardNext: "Weiter",
    indWizardBack: "Zurück",
    indWizardSave: "Speichern",
    indWizardNoIndicators: "Keine Indikatoren definiert",
    indWizardNoGroups: "Keine Gruppen vorhanden",
    indWizardRefAas: "Referenz-AAS",
    indWizardTreeLoading: "Lade Struktur…",
    indWizardTypeMismatch: "Typ-Inkompatibel",
    indDashPage: "Seite {page} / {pages}",
    indDetailTitle: "Indikator-Detail",
    indDetailColumns: "Eigenschaften",
    indDetailScore: "Score: {score}",
    indDetailClassScore: "\u00D8 Score: {score}",
    indDetailNoClass: "Ohne Klasse",
    dashScoreTitle: "Score",
    dashScoreSettingsTitle: "Score-Kachel",
    dashScoreEmpty: "Nicht konfiguriert.",
    dashScoreClose: "Schließen",
    dashScoreConfigure: "Konfigurieren",
    dashScoreDelete: "Löschen",
    dashScoreBack: "Zurück",
    dashScoreNext: "Weiter",
    dashScoreSave: "Übernehmen",
    dashScoreStep1: "Wähle eine AAS-Gruppe.",
    dashScoreStep2: "Wähle AAS-Items aus.",
    dashScoreStep3: "Wähle Pfade für Benennung und Vergleichswert.",
    dashScoreLabel: "Benennung",
    dashScoreTarget: "Vergleichswert",
    dashScoreConfigured: "konfiguriert",
    indColsLabel: "Spaltenauswahl",
    indColsBtn: "Spalten wählen",
    indColsEmpty: "Keine Spalten",
    indColsCount: "{n} Spalten gewählt",
    indColsSaved: "Spalten gespeichert",
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
    settingsNavFeeds: "News Feeds",
    settingsNavGdacs: "GDACS",
    settingsNavAasImport: "AAS Import",
    settingsNavCountryCodes: "Ländercodes",
    settingsNavGdelt: "GDELT",
    settingsNavDanger: "Danger Zone",
    dangerZoneTitle: "Alle Daten löschen",
    dangerZoneDesc: "Diese Aktion löscht unwiderruflich alle Inhalte: Imports, Anreicherungen, Konfigurationen, Feeds, Alerts und Indikatoren. Einstellungen werden zurückgesetzt.",
    dangerZoneInputLabel: 'Bitte <strong>Löschen</strong> eingeben, um zu bestätigen:',
    dangerZoneBtn: "Alle Daten unwiderruflich löschen",
    dangerZoneConfirmWord: "Löschen",
    dangerZoneSuccess: "Alle Daten wurden gelöscht.",
    dangerZoneError: "Fehler beim Löschen der Daten.",
    gdeltSettingsTitle: "GDELT / BigQuery",
    gdeltSettingsDesc: "Verbinde einen Google Cloud Service Account für GDELT-Abfragen über BigQuery.",
    gdeltSaLabel: "Service Account JSON",
    gdeltSaConfigured: "Service Account konfiguriert",
    gdeltSettingsSaved: "GDELT-Einstellungen gespeichert.",
    gdeltSettingsFailed: "Speichern fehlgeschlagen.",
    gdeltNoCredentials: "Kein BigQuery Service Account konfiguriert.",
    gdeltNoCompany: "Kein Unternehmensname vorhanden.",
    gdeltNoData: "Keine GDELT-Daten gefunden.",
    gdeltMentions: "Erwähnungen",
    gdeltSentiment: "Sentiment",
    gdeltArticles: "Artikel",
    // World Bank
    wbTitle: "Governance-Indikatoren",
    wbLogistics: "Logistik-Performance",
    wbNoCountry: "Kein Ländercode verfügbar.",
    wbNoData: "Keine World-Bank-Daten verfügbar.",
    wbCorruption: "Korruptionskontrolle",
    wbEffectiveness: "Regierungseffektivität",
    wbStability: "Politische Stabilität",
    wbRegulatory: "Regulierungsqualität",
    wbRuleOfLaw: "Rechtsstaatlichkeit",
    wbVoice: "Mitsprache & Rechenschaft",
    // INFORM Risk
    informTitle: "INFORM Risiko-Index",
    informHazard: "Gefahren & Exposition",
    informVulnerability: "Vulnerabilität",
    informCoping: "Bewältigungskapazität",
    informNatural: "Naturgefahren",
    informHuman: "Menschliche Gefahren",
    informSocioEcon: "Sozioökonomisch",
    informVulnGroups: "Vulnerable Gruppen",
    informInfra: "Infrastruktur",
    informInstitutional: "Institutionell",
    informNoCountry: "Kein Ländercode verfügbar.",
    informNoData: "Keine INFORM-Daten verfügbar.",
    // Source badges
    srcGoogleNews: "Quelle: Google News RSS — Nachrichtenartikel der letzten 14 Tage in Deutsch und Englisch",
    srcGdelt: "Quelle: GDELT Project via Google BigQuery — Globale Medienanalyse mit Sentiment-Bewertung (30 Tage)",
    srcWorldBank: "Quelle: World Bank — Worldwide Governance Indicators, jährlich aktualisierte Länder-Governance-Daten",
    srcInform: "Quelle: INFORM Risk Index (EU JRC/DRMKC) — Globaler Risiko-Index für Naturgefahren, Vulnerabilität und Bewältigungskapazität",
    cmSearch: "Suchen…",
    cmThIso: "Alpha-2",
    cmThAlpha3: "Alpha-3",
    cmThNumeric: "Numeric",
    cmThAas: "AAS",
    cmThGdacs: "GDACS",
    cmEmpty: "Keine Einträge gefunden.",
    cmReset: "Zurücksetzen",
    cmImport: "Import",
    cmExport: "Export",
    cmImportSuccess: "Import erfolgreich: {n} Einträge aktualisiert.",
    cmImportError: "Import fehlgeschlagen. Bitte gültige JSON-Datei verwenden.",
    cmResetTitle: "Ländercodes zurücksetzen",
    cmResetMessage: "Alle AAS- und GDACS-Zuordnungen werden auf die Standardwerte zurückgesetzt. Dieser Vorgang kann nicht rückgängig gemacht werden.",
    cmResetCancel: "Abbrechen",
    cmResetConfirm: "Zurücksetzen",
    cmPrev: "Zurück",
    cmNext: "Weiter",
    aasCmTitle: "AAS Länder-Import",
    aasCmStep1Desc: "Wähle eine AAS-Gruppe aus.",
    aasCmStep2Desc: "Wähle eine AAS aus der Gruppe, um den Submodel-Baum zu laden.",
    aasCmStep3Desc: "Navigiere im Baum und klicke auf eine Property, deren Werte zugeordnet werden sollen.",
    aasCmGroupEmpty: "Keine Gruppen vorhanden. Erstelle zuerst Gruppen unter AAS Daten.",
    aasCmAasEmpty: "Keine AAS in dieser Gruppe.",
    aasCmTreeError: "Keine importierten Daten vorhanden. Bitte zuerst einen AAS-Import durchführen.",
    aasCmTreeLoading: "Lade Submodel-Daten…",
    aasCmSelectedPath: "Ausgewählt: {path}",
    aasCmProc1: "Schritt 1: Direkte Zuordnung",
    aasCmProc2: "Schritt 2: KI-Zuordnung",
    aasCmSummary: "{total} Werte gefunden — {step1} direkt, {step2} per KI, {unmatched} nicht zuordenbar.",
    aasCmDirect: "Direkt",
    aasCmNoMatch: "Kein Match",
    aasCmApply: "Übernehmen",
    aasCmApplyResults: "Anwenden",
    aasCmApplying: "Wird angewendet…",
    aasCmCancel: "Abbrechen",
    aasCmClose: "Schließen",
    aasCmBack: "Zurück",
    aasCmAasBtn: "AAS",
    aasCmThValue: "Wert",
    aasCmThMatch: "Zuordnung",
    aasCmThMethod: "Methode",
    aasCmApplied: "Zuordnungen erfolgreich übernommen.",
    aasCmSuccessDetail: "{n} Werte wurden in die Ländercodes-Tabelle übernommen.",
    aasCmAiUnavailable: "KI nicht konfiguriert — nur direkte Zuordnung.",
    aasCmNoProperty: "Bitte wähle zuerst eine Property aus.",
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
    aiMapping: "AI Enrichment",
    simulation: "Simulation",
    aasData: "AAS Data",
    newsFeeds: "News Feeds",
    gdacsAlerts: "GDACS Alerts",
    dashboardTitle: "Resilience Dashboard",
    dashboardDesc: "Overview of resilience tools for your supply chain.",
    dashEditBtn: "Edit tiles",
    vtWizardTitle: "Create value tile",
    vtStep1Desc: "Select an AAS.",
    vtStep2Desc: "Select paths for label and value.",
    vtStep3Desc: "Choose display and color.",
    vtSearchPlaceholder: "Search AAS\u2026",
    vtLabelField: "Label",
    vtValueField: "Value",
    vtFieldEmpty: "Click a property in the tree",
    vtBigNumber: "Big number",
    vtProgressBar: "Progress bar",
    vtStatCard: "Stat card",
    vtTextPlain: "Plain text",
    vtTextBadge: "Badge",
    vtTextHighlight: "Highlight",
    vtColorLabel: "Color",
    vtCreate: "Create",
    vtDeleteConfirm: "Really remove this tile?",
    vtDeleteBtn: "Remove",
    vtCancel: "Cancel",
    vtBack: "Back",
    vtNext: "Next",
    vtNoAas: "No AAS imported.",
    vtLoading: "Loading\u2026",
    indicatorsTitle: "Indicators",
    indicatorsDesc: "Monitor resilience indicators of your supply chain.",
    aiMappingTitle: "AI Enrichment",
    aiMappingDesc: "AI-powered enrichment and analysis.",
    simulationTitle: "Simulation",
    simulationDesc: "Simulate scenarios and analyze impacts.",
    simStep1: "Calibration",
    simStep2: "Disruptions",
    simStep3: "Countermeasures",
    simMaterial: "Select component",
    simSupplier: "Supplier",
    simQty: "Required quantity",
    simDelivery: "Delivery time",
    simOrderData: "Order data",
    simOrderMaterial: "Material demand",
    simOrderQty: "Quantity per order",
    simOrderDate: "Order date",
    simParams: "Simulation parameters",
    simStock: "Stock level",
    simBuffer: "Safety buffer",
    simReliability: "Supplier reliability",
    simNext: "Next",
    simBack: "Back",
    simParametrizing: "Parametrizing simulation…",
    simRunning: "Running simulation…",
    simStartSim: "Start simulation",
    simWithMeasures: "Simulate with measures",
    simFinish: "New simulation",
    simResimulate: "Re-simulate",
    simSelectDisruptions: "Select disruptions to introduce into the supply chain.",
    simSelectMeasures: "Select countermeasures to reduce the impact.",
    simResults: "Results",
    simComparison: "Comparison with countermeasures",
    simDelayDays: "Delivery delay",
    simCostIncrease: "Cost increase",
    simFulfillment: "Fulfillment rate",
    simRiskScore: "Risk score",
    simBefore: "Before",
    simAfter: "After",
    simSummary: "Summary",
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
    gdacsAasFillEmpty: "No countries with AAS mapping found.",
    gdacsAasFillDone: "{n} countries added from AAS mappings.",
    gdacsAasSourceLabel: "AAS Country Mapping",
    gdacsAasSourceEmpty: "Not configured",
    gdacsAasSourceBtn: "Select",
    gdacsAasSourceSaved: "AAS country mapping saved.",
    gdacsColsLabel: "Column Selection",
    gdacsColsEmpty: "Not configured",
    gdacsColsBtn: "Select",
    gdacsColsSaved: "Column selection saved.",
    gdacsColsCount: "{n} columns selected",
    // Geocoding
    geocodingTitle: "Geocoding",
    geocodingStart: "Start",
    geocodingStep3Country: "Select the property for the country.",
    geocodingStep3City: "Now select the property for the city.",
    geocodingCountryLabel: "Country",
    geocodingCityLabel: "City",
    geocodingDone: "Geocoding complete",
    geocodingErrors: "errors",
    // Geo-Matching
    matchPolygon: "Polygon match (high accuracy)",
    matchDistance: "Distance match ({km} km)",
    matchCountry: "Country match (low accuracy)",
    thresholdLabel: "Matching radius (km)",
    // Matching-Parameter Wizard
    matchingLabel: "Matching Parameters",
    matchingEmpty: "Not configured",
    matchingBtn: "Configure",
    matchingCountryStep: "Select the path for the country.",
    matchingCityStep: "Select the path for the city.",
    matchingLatStep: "Select the path for latitude.",
    matchingLonStep: "Select the path for longitude.",
    matchingSkip: "Skip",
    matchingSaved: "Matching parameters saved.",
    matchingDeleted: "Matching parameters deleted.",
    matchingCountry: "Country",
    matchingCity: "City",
    matchingLat: "Lat",
    matchingLon: "Lon",
    // Single-AAS Geocoding
    geoSingleTitle: "Geocoding",
    geoSingleDesc: "AAS location will be geocoded.",
    geoSingleCancel: "Cancel",
    geoSingleStart: "Start",
    geoSingleSuccess: "Geocoding successful.",
    geoSingleError: "Geocoding failed.",
    geoSingleNoPaths: "Matching parameters must be configured first.",
    companyProcessTitle: "Company Process",
    companyProcessDesc: "Select the property for the company name.",
    companyProcessStart: "Start",
    companyProcessSuccess: "Company data saved successfully.",
    companyProcessError: "Company process failed.",
    // Single-AAS Import
    importSingleTitle: "Re-import?",
    importSingleDesc: "All stored data for this AAS will be deleted and re-imported. Geocoding must be performed again afterwards.",
    importSingleCancel: "Cancel",
    importSingleStart: "Import",
    importSingleSuccess: "Import successful.",
    importSingleError: "Import failed.",
    // World Map
    mapTitle: "World Map",
    mapBtnTitle: "Show map",
    mapPopupAlerts: "Affected alerts",
    mapFilterMatches: "Matches only",
    mapFilterAll: "Show all",
    // Dashboard AAS Tile Settings
    dashAasSettingsTitle: "Tile Settings",
    dashAasFilterLabel: "Show match quality",
    dashAasFilterPolygon: "Polygon",
    dashAasFilterDistance: "Distance",
    dashAasFilterCountry: "Country",
    dashAasColsLabel: "Column Selection",
    dashAasColsBtn: "Select Columns",
    dashAasSettingsSave: "Save",
    dashAasSettingsDelete: "Delete",
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
    dashIndicatorsTitle: "Indicators",
    dashIndicatorsLink: "View all \u2192",
    dashIndicatorsEmpty: "No indicators configured.",
    dashAasTitle: "Natural Disasters & Supply Chain Risks",
    dashAasEmpty: "No affected locations detected.",
    dashAasUpdated: "Updated: {time}",
    dashAasPage: "Page {page} of {pages}",
    dashAasCountryHeader: "Country",
    // Company Detail Modal
    cdTitle: "Company Information",
    cdShellTitle: "Shell Information",
    cdCountry: "Country",
    cdCity: "City",
    cdCoordinates: "Coordinates",
    cdImportedAt: "Imported At",
    cdGeoTitle: "Location",
    cdAlertsTitle: "GDACS Alerts",
    cdSubmodelsTitle: "Submodels",
    cdColumnsTitle: "Configured Columns",
    cdLoadError: "Failed to load data.",
    cdMatchPolygon: "Polygon",
    cdMatchDistance: "Distance ({km} km)",
    cdMatchCountry: "Country",
    cdNoAlerts: "No alerts matched.",
    cdSubmodelElements: "Elements",
    cdTabLocation: "Location",
    cdTabAlerts: "Google News",
    cdTabGdelt: "GDELT",
    cdTabWorldbank: "World Bank",
    cdTabInform: "INFORM Risk",
    cdGdeltPlaceholder: "GDELT integration will be available here.",
    cdNewsTitle: "News",
    cdNewsNoCompany: "No company name available. Please run enrichment first.",
    cdNewsEmpty: "No news from the last 14 days found.",
    cdNewsError: "Failed to load news.",
    cdNewsNoContent: "No content available.",
    // Indicators
    indicatorsDescNew: "Define resilience indicators for your supply chain.",
    indNavClasses: "Classes",
    indNavIndicators: "Indicators",
    indSearch: "Search…",
    indAdd: "Add",
    indEmptyText: "No indicators defined yet.",
    indThName: "Name",
    indThClass: "Class",
    indThRules: "Rules",
    indBack: "Back",
    indNameLabel: "Name",
    indClassLabel: "Class",
    indOpEquals: "equals",
    indOpNotEquals: "not equal",
    indOpGreater: "greater than",
    indOpLess: "less than",
    indOpGreaterEqual: "greater or equal",
    indOpLessEqual: "less or equal",
    indInputNumber: "Number",
    indInputText: "Text",
    indInputBoolean: "Boolean",
    indColorCustom: "Custom color…",
    indDashSettingsTitle: "Indicator Tile",
    indDashConfigure: "Configure",
    indDashDeleteAll: "Delete All",
    indDashDeleteConfirm: "Delete all indicator configurations?",
    indDashDeleteConfirmBtn: "Delete",
    indDashCancel: "Cancel",
    indDashNoConfig: "Not configured",
    indDashConfigured: "configured",
    indWizardTitle: "Configure Indicators",
    indWizardStep1Desc: "Select the AAS group for evaluation",
    indWizardStep2Desc: "Select indicators to evaluate",
    indWizardStep3Desc: "Map each input type to an AAS path",
    indWizardStep3aDesc: "Select a reference AAS item",
    indWizardStep3bDesc: "Click a path to assign the input",
    indWizardMappingFor: "Mapping for",
    indWizardSelectPath: "Select path",
    indWizardPathSet: "Assigned",
    indWizardDone: "Configuration saved",
    indWizardNext: "Next",
    indWizardBack: "Back",
    indWizardSave: "Save",
    indWizardNoIndicators: "No indicators defined",
    indWizardNoGroups: "No groups available",
    indWizardRefAas: "Reference AAS",
    indWizardTreeLoading: "Loading structure…",
    indWizardTypeMismatch: "Type incompatible",
    indDashPage: "Page {page} / {pages}",
    indDetailTitle: "Indicator Detail",
    indDetailColumns: "Properties",
    indDetailScore: "Score: {score}",
    indDetailClassScore: "\u00D8 Score: {score}",
    indDetailNoClass: "No class",
    dashScoreTitle: "Score",
    dashScoreSettingsTitle: "Score Tile",
    dashScoreEmpty: "Not configured.",
    dashScoreClose: "Close",
    dashScoreConfigure: "Configure",
    dashScoreDelete: "Delete",
    dashScoreBack: "Back",
    dashScoreNext: "Next",
    dashScoreSave: "Apply",
    dashScoreStep1: "Select an AAS group.",
    dashScoreStep2: "Select AAS items.",
    dashScoreStep3: "Select paths for label and target value.",
    dashScoreLabel: "Label",
    dashScoreTarget: "Target value",
    dashScoreConfigured: "configured",
    indColsLabel: "Column selection",
    indColsBtn: "Select columns",
    indColsEmpty: "No columns",
    indColsCount: "{n} columns selected",
    indColsSaved: "Columns saved",
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
    settingsNavFeeds: "News Feeds",
    settingsNavGdacs: "GDACS",
    settingsNavAasImport: "AAS Import",
    settingsNavCountryCodes: "Country Codes",
    settingsNavGdelt: "GDELT",
    settingsNavDanger: "Danger Zone",
    dangerZoneTitle: "Delete all data",
    dangerZoneDesc: "This action irreversibly deletes all content: imports, enrichments, configurations, feeds, alerts and indicators. Settings will be reset.",
    dangerZoneInputLabel: 'Please type <strong>Delete</strong> to confirm:',
    dangerZoneBtn: "Permanently delete all data",
    dangerZoneConfirmWord: "Delete",
    dangerZoneSuccess: "All data has been deleted.",
    dangerZoneError: "Error deleting data.",
    gdeltSettingsTitle: "GDELT / BigQuery",
    gdeltSettingsDesc: "Connect a Google Cloud service account for GDELT queries via BigQuery.",
    gdeltSaLabel: "Service Account JSON",
    gdeltSaConfigured: "Service account configured",
    gdeltSettingsSaved: "GDELT settings saved.",
    gdeltSettingsFailed: "Failed to save.",
    gdeltNoCredentials: "No BigQuery service account configured.",
    gdeltNoCompany: "No company name available.",
    gdeltNoData: "No GDELT data found.",
    gdeltMentions: "Mentions",
    gdeltSentiment: "Sentiment",
    gdeltArticles: "Articles",
    // World Bank
    wbTitle: "Governance Indicators",
    wbLogistics: "Logistics Performance",
    wbNoCountry: "No country code available.",
    wbNoData: "No World Bank data available.",
    wbCorruption: "Control of Corruption",
    wbEffectiveness: "Government Effectiveness",
    wbStability: "Political Stability",
    wbRegulatory: "Regulatory Quality",
    wbRuleOfLaw: "Rule of Law",
    wbVoice: "Voice & Accountability",
    // INFORM Risk
    informTitle: "INFORM Risk Index",
    informHazard: "Hazard & Exposure",
    informVulnerability: "Vulnerability",
    informCoping: "Coping Capacity",
    informNatural: "Natural Hazards",
    informHuman: "Human Hazards",
    informSocioEcon: "Socio-Economic",
    informVulnGroups: "Vulnerable Groups",
    informInfra: "Infrastructure",
    informInstitutional: "Institutional",
    informNoCountry: "No country code available.",
    informNoData: "No INFORM data available.",
    // Source badges
    srcGoogleNews: "Source: Google News RSS — News articles from the last 14 days in German and English",
    srcGdelt: "Source: GDELT Project via Google BigQuery — Global media analysis with sentiment scoring (30 days)",
    srcWorldBank: "Source: World Bank — Worldwide Governance Indicators, annually updated country governance data",
    srcInform: "Source: INFORM Risk Index (EU JRC/DRMKC) — Global risk index for natural hazards, vulnerability, and coping capacity",
    cmSearch: "Search…",
    cmThIso: "Alpha-2",
    cmThAlpha3: "Alpha-3",
    cmThNumeric: "Numeric",
    cmThAas: "AAS",
    cmThGdacs: "GDACS",
    cmEmpty: "No entries found.",
    cmReset: "Reset",
    cmImport: "Import",
    cmExport: "Export",
    cmImportSuccess: "Import successful: {n} entries updated.",
    cmImportError: "Import failed. Please use a valid JSON file.",
    cmResetTitle: "Reset country codes",
    cmResetMessage: "All AAS and GDACS mappings will be reset to default values. This action cannot be undone.",
    cmResetCancel: "Cancel",
    cmResetConfirm: "Reset",
    cmPrev: "Previous",
    cmNext: "Next",
    aasCmTitle: "AAS Country Import",
    aasCmStep1Desc: "Select an AAS group.",
    aasCmStep2Desc: "Select an AAS from the group to load the submodel tree.",
    aasCmStep3Desc: "Navigate the tree and click on a property whose values should be mapped.",
    aasCmGroupEmpty: "No groups available. Create groups first under AAS Data.",
    aasCmAasEmpty: "No AAS in this group.",
    aasCmTreeError: "No imported data available. Please run an AAS import first.",
    aasCmTreeLoading: "Loading submodel data…",
    aasCmSelectedPath: "Selected: {path}",
    aasCmProc1: "Step 1: Direct matching",
    aasCmProc2: "Step 2: AI matching",
    aasCmSummary: "{total} values found — {step1} direct, {step2} via AI, {unmatched} unmatched.",
    aasCmDirect: "Direct",
    aasCmNoMatch: "No match",
    aasCmApply: "Apply",
    aasCmApplyResults: "Apply results",
    aasCmApplying: "Applying…",
    aasCmCancel: "Cancel",
    aasCmClose: "Close",
    aasCmBack: "Back",
    aasCmAasBtn: "AAS",
    aasCmThValue: "Value",
    aasCmThMatch: "Mapping",
    aasCmThMethod: "Method",
    aasCmApplied: "Mappings applied successfully.",
    aasCmSuccessDetail: "{n} values were added to the country codes table.",
    aasCmAiUnavailable: "AI not configured — only direct matching performed.",
    aasCmNoProperty: "Please select a property first.",
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

// Settings nav state
let activeSettingsNav = "feeds";
let cmPage = 0, cmQuery = "";
const CM_PER_PAGE = 30;
let cmDebounceTimer = null;

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
  simulation: "simulation",
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
  if (page === "settings") switchSettingsNav(activeSettingsNav);
  if (page === "simulation") renderSimStep(simStep);
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
  const pages = ["dashboard", "indicators", "gdacs", "ai-mapping", "simulation", "aas-data", "news-feeds", "gdacs-alerts", "settings", "docs"];
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
  // Single-AAS geocoding dialog
  document.getElementById("geo-single-title").textContent = t("geoSingleTitle");
  document.getElementById("geo-single-desc").textContent = t("geoSingleDesc");
  // Single-AAS import dialog
  document.getElementById("import-single-title").textContent = t("importSingleTitle");
  document.getElementById("import-single-desc").textContent = t("importSingleDesc");
  // World map modal labels
  document.getElementById("map-modal-title").textContent = t("mapTitle");
  dashAasMapBtn.title = t("mapBtnTitle");
  mapFilterLabel.textContent = mapMatchesOnly ? t("mapFilterAll") : t("mapFilterMatches");
  // Dashboard tile settings labels
  document.getElementById("dash-aas-settings-title").textContent = t("dashAasSettingsTitle");
  document.getElementById("dash-aas-filter-label").textContent = t("dashAasFilterLabel");
  document.getElementById("dash-aas-filter-polygon-label").textContent = t("dashAasFilterPolygon");
  document.getElementById("dash-aas-filter-distance-label").textContent = t("dashAasFilterDistance");
  document.getElementById("dash-aas-filter-country-label").textContent = t("dashAasFilterCountry");
  document.getElementById("dash-aas-cols-label").textContent = t("dashAasColsLabel");
  document.getElementById("dash-aas-cols-btn-label").textContent = t("dashAasColsBtn");
  document.getElementById("gdacs-matching-label").textContent = t("matchingLabel");
  document.getElementById("gdacs-matching-btn-label").textContent = t("matchingBtn");
  document.getElementById("dash-aas-settings-save").textContent = t("dashAasSettingsSave");
  document.getElementById("dash-aas-settings-delete").textContent = t("dashAasSettingsDelete");
  document.getElementById("gdacs-retention-label").textContent = t("gdacsSettingsRetentionLabel");
  document.getElementById("gdacs-refresh-label").textContent = t("gdacsSettingsRefreshLabel");
  document.getElementById("gdacs-settings-save-label").textContent = t("gdacsSettingsSave");
  document.getElementById("gdacs-purge-label").textContent = t("gdacsPurge");
  document.getElementById("gdacs-threshold-label").textContent = t("thresholdLabel");

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

  // Settings nav labels
  document.getElementById("settings-nav-feeds-btn").textContent = t("settingsNavFeeds");
  document.getElementById("settings-nav-gdacs-btn").textContent = t("settingsNavGdacs");
  document.getElementById("settings-nav-aas-btn").textContent = t("settingsNavAasImport");
  document.getElementById("settings-nav-cc-btn").textContent = t("settingsNavCountryCodes");
  document.getElementById("settings-nav-gdelt-btn").textContent = t("settingsNavGdelt");
  document.getElementById("settings-nav-danger-btn").textContent = t("settingsNavDanger");
  document.getElementById("danger-zone-title").textContent = t("dangerZoneTitle");
  document.getElementById("danger-zone-desc").textContent = t("dangerZoneDesc");
  document.getElementById("danger-zone-input-label").innerHTML = t("dangerZoneInputLabel");
  document.getElementById("danger-zone-btn-label").textContent = t("dangerZoneBtn");
  document.getElementById("danger-zone-input").placeholder = t("dangerZoneConfirmWord");
  document.getElementById("gdelt-settings-title").textContent = t("gdeltSettingsTitle");
  document.getElementById("gdelt-settings-desc").textContent = t("gdeltSettingsDesc");
  document.getElementById("gdelt-sa-label").textContent = t("gdeltSaLabel");
  document.getElementById("bq-sa-save-label").textContent = t("importSettingsSave");
  cmSearchInput.placeholder = t("cmSearch");
  document.getElementById("cm-th-iso").textContent = t("cmThIso");
  document.getElementById("cm-th-alpha3").textContent = t("cmThAlpha3");
  document.getElementById("cm-th-numeric").textContent = t("cmThNumeric");
  document.getElementById("cm-th-aas").textContent = t("cmThAas");
  document.getElementById("cm-th-gdacs").textContent = t("cmThGdacs");
  document.getElementById("cm-empty-label").textContent = t("cmEmpty");
  document.getElementById("cm-reset-label").textContent = t("cmReset");
  document.getElementById("cm-import-label").textContent = t("cmImport");
  document.getElementById("cm-export-label").textContent = t("cmExport");
  cmPrevBtn.textContent = t("cmPrev");
  cmNextBtn.textContent = t("cmNext");

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

  // Dashboard edit button
  document.getElementById("dash-edit-btn").title = t("dashEditBtn");

  // Value tile wizard
  document.getElementById("vt-wizard-title").textContent = t("vtWizardTitle");
  document.getElementById("vt-step1-desc").textContent = t("vtStep1Desc");
  document.getElementById("vt-step2-desc").textContent = t("vtStep2Desc");
  document.getElementById("vt-step3-desc").textContent = t("vtStep3Desc");
  document.getElementById("vt-aas-search").placeholder = t("vtSearchPlaceholder");
  document.getElementById("vt-field-label-text").textContent = t("vtLabelField");
  document.getElementById("vt-field-value-text").textContent = t("vtValueField");
  if (!vtLabelPath) document.getElementById("vt-field-label-value").textContent = t("vtFieldEmpty");
  if (!vtValuePath) document.getElementById("vt-field-value-value").textContent = t("vtFieldEmpty");
  document.getElementById("vt-color-label").textContent = t("vtColorLabel");
  document.getElementById("vt-wizard-back").textContent = t("vtBack");
  document.getElementById("vt-wizard-cancel").textContent = t("vtCancel");
  document.getElementById("vt-wizard-next").textContent = t("vtNext");
  document.getElementById("vt-wizard-create").textContent = t("vtCreate");

  // Dashboard tile labels
  document.getElementById("dash-news-title").textContent = t("dashNewsTitle");
  document.getElementById("dash-news-link").textContent = t("dashNewsLink");
  document.getElementById("dash-news-empty").textContent = t("dashNewsEmpty");
  document.getElementById("dash-alerts-title").textContent = t("dashAlertsTitle");
  document.getElementById("dash-alerts-link").textContent = t("dashAlertsLink");
  document.getElementById("dash-alerts-empty").textContent = t("dashAlertsEmpty");
  document.getElementById("dash-indicators-title").textContent = t("dashIndicatorsTitle");
  document.getElementById("dash-indicators-empty").textContent = t("dashIndicatorsEmpty");
  // Indicator dashboard settings/wizard
  document.getElementById("dash-ind-settings-title").textContent = t("indDashSettingsTitle");
  document.getElementById("dash-ind-configure-btn").textContent = t("indDashConfigure");
  document.getElementById("dash-ind-delete-btn").textContent = t("indDashDeleteAll");
  document.getElementById("ind-confirm-text").textContent = t("indDashDeleteConfirm");
  document.getElementById("ind-confirm-cancel").textContent = t("indDashCancel");
  document.getElementById("ind-confirm-ok").textContent = t("indDashDeleteConfirmBtn");
  document.getElementById("dash-ind-cols-label").textContent = t("indColsLabel");
  document.getElementById("dash-ind-cols-btn-label").textContent = t("indColsBtn");
  document.getElementById("ind-wizard-title").textContent = t("indWizardTitle");
  document.getElementById("ind-wizard-step1-desc").textContent = t("indWizardStep1Desc");
  document.getElementById("ind-wizard-step2-desc").textContent = t("indWizardStep2Desc");
  document.getElementById("ind-wizard-step3-desc").textContent = t("indWizardStep3Desc");
  document.getElementById("ind-wizard-step3a-desc").textContent = t("indWizardStep3aDesc");
  document.getElementById("ind-wizard-back-btn").textContent = t("indWizardBack");
  document.getElementById("ind-wizard-cancel-btn").textContent = t("indDashCancel");
  document.getElementById("ind-wizard-next-btn").textContent = t("indWizardNext");
  document.getElementById("ind-wizard-save-btn").textContent = t("indWizardSave");
  document.getElementById("ind-wizard-success-text").textContent = t("indWizardDone");
  document.getElementById("dash-aas-title").textContent = t("dashAasTitle");
  document.getElementById("dash-aas-empty").textContent = t("dashAasEmpty");

  // Indicators page labels
  document.getElementById("ind-search").placeholder = t("indSearch");
  document.getElementById("ind-add-label").textContent = t("indAdd");
  document.getElementById("ind-empty-text").textContent = t("indEmptyText");
  document.getElementById("ind-th-name").textContent = t("indThName");
  document.getElementById("ind-th-class").textContent = t("indThClass");
  document.getElementById("ind-th-rules").textContent = t("indThRules");
  document.getElementById("ind-back-label").textContent = t("indBack");
  document.getElementById("ind-name-label").textContent = t("indNameLabel");
  document.getElementById("ind-class-label").textContent = t("indClassLabel");
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
let cachedDashMatchFilter = ["polygon", "distance"];


async function loadSettings() {
  const result = await apiRequest("/apps/resilience/api/settings");
  if (!result.ok || !result.payload) return;

  const { retention_days, refresh_minutes, feeds, gdacs_refresh_minutes, gdacs_retention_days, gdacs_countries, import_interval_hours, gdacs_aas_columns, gdacs_distance_thresholds, matching_group_id, matching_group_name, matching_country_path, matching_city_path, matching_lat_path, matching_lon_path, dash_aas_match_filter, bq_has_credentials, bq_project_id } = result.payload;
  cachedFeeds = feeds || [];
  cachedGdacsCountries = gdacs_countries || [];
  cachedDashMatchFilter = dash_aas_match_filter || ["polygon", "distance"];

  retentionSelect.value = String(retention_days);
  refreshSelect.value = String(refresh_minutes);
  gdacsRefreshSelect.value = String(gdacs_refresh_minutes || 60);
  gdacsRetentionSelect.value = String(gdacs_retention_days || 30);
  importIntervalSelect.value = String(import_interval_hours || 0);

  // Matching-Parameter display
  if (matching_group_id) {
    updateMatchingDisplay(matching_group_name || matching_group_id, {
      country: matching_country_path || "", city: matching_city_path || "",
      lat: matching_lat_path || "", lon: matching_lon_path || "",
    });
  }

  // GDACS columns display (dashboard tile settings)
  updateGdacsColsDisplay(gdacs_aas_columns || []);

  // Match filter checkboxes
  const filterPolygon = document.getElementById("dash-filter-polygon");
  const filterDistance = document.getElementById("dash-filter-distance");
  const filterCountry = document.getElementById("dash-filter-country");
  if (filterPolygon) filterPolygon.checked = cachedDashMatchFilter.includes("polygon");
  if (filterDistance) filterDistance.checked = cachedDashMatchFilter.includes("distance");
  if (filterCountry) filterCountry.checked = cachedDashMatchFilter.includes("country");

  // GDACS distance thresholds → fill settings inputs
  if (gdacs_distance_thresholds) {
    try {
      const th = typeof gdacs_distance_thresholds === "string" ? JSON.parse(gdacs_distance_thresholds) : gdacs_distance_thresholds;
      for (const [type, km] of Object.entries(th)) {
        const inp = document.getElementById(`threshold-${type}`);
        if (inp) inp.value = String(km);
      }
    } catch (_) { /* ignore parse errors */ }
  }

  // GDELT BigQuery credentials
  if (bq_has_credentials) {
    bqSaInput.value = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022";
    bqSaInput.placeholder = t("gdeltSaConfigured") + (bq_project_id ? ` (${bq_project_id})` : "");
  } else {
    bqSaInput.value = "";
  }

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

let gdacsCountryPage = 1;
const GDACS_COUNTRY_PAGE_SIZE = 10;

function renderGdacsCountryList() {
  gdacsCountryList.innerHTML = "";
  gdacsCountryListEmpty.hidden = cachedGdacsCountries.length > 0;
  gdacsCountryList.hidden = cachedGdacsCountries.length === 0;

  const total = cachedGdacsCountries.length;
  const totalPages = Math.ceil(total / GDACS_COUNTRY_PAGE_SIZE) || 1;
  if (gdacsCountryPage > totalPages) gdacsCountryPage = totalPages;

  const start = (gdacsCountryPage - 1) * GDACS_COUNTRY_PAGE_SIZE;
  const pageItems = cachedGdacsCountries.slice(start, start + GDACS_COUNTRY_PAGE_SIZE);

  for (const country of pageItems) {
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

  // Pagination controls
  if (totalPages > 1) {
    const pag = document.createElement("div");
    pag.className = "gdacs-country-pagination";
    pag.innerHTML = `
      <button class="btn btn-sm gdacs-country-pg-btn" data-pg="prev" ${gdacsCountryPage <= 1 ? "disabled" : ""}>\u2039</button>
      <span class="gdacs-country-pg-info">${gdacsCountryPage} / ${totalPages}</span>
      <button class="btn btn-sm gdacs-country-pg-btn" data-pg="next" ${gdacsCountryPage >= totalPages ? "disabled" : ""}>\u203A</button>
    `;
    gdacsCountryList.appendChild(pag);
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
    gdacsCountryPage = Math.ceil(cachedGdacsCountries.length / GDACS_COUNTRY_PAGE_SIZE);
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
  // Pagination
  const pgBtn = e.target.closest(".gdacs-country-pg-btn");
  if (pgBtn) {
    if (pgBtn.dataset.pg === "prev" && gdacsCountryPage > 1) gdacsCountryPage--;
    else if (pgBtn.dataset.pg === "next") gdacsCountryPage++;
    renderGdacsCountryList();
    return;
  }
  // Remove
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
  const gdacs_distance_thresholds = {};
  for (const type of ["EQ", "TC", "FL", "VO", "WF", "DR"]) {
    const inp = document.getElementById(`threshold-${type}`);
    gdacs_distance_thresholds[type] = inp ? parseInt(inp.value) || 300 : 300;
  }
  const result = await apiRequest("/apps/resilience/api/settings", {
    method: "PUT",
    body: {
      gdacs_refresh_minutes: parseInt(gdacsRefreshSelect.value),
      gdacs_retention_days: parseInt(gdacsRetentionSelect.value),
      gdacs_distance_thresholds,
    },
  });
  gdacsSettingsSaveBtn.disabled = false;

  if (result.ok) {
    showGdacsCountryHint(t("gdacsSettingsSaved"), "success");
    setTimeout(hideGdacsCountryHint, 3000);
  }
});

// Fill GDACS watchlist from AAS country mappings
document.getElementById("gdacs-aas-fill-btn").addEventListener("click", async () => {
  const btn = document.getElementById("gdacs-aas-fill-btn");
  btn.disabled = true;
  hideGdacsCountryHint();
  const res = await apiRequest("/apps/resilience/api/country-mappings/aas-countries");
  if (!res.ok || !res.payload.names?.length) {
    btn.disabled = false;
    showGdacsCountryHint(t("gdacsAasFillEmpty"), "error");
    setTimeout(hideGdacsCountryHint, 3000);
    return;
  }
  let added = 0;
  for (const name of res.payload.names) {
    const r = await apiRequest("/apps/resilience/api/gdacs/countries", {
      method: "POST", body: { name }
    });
    if (r.ok && r.payload) {
      cachedGdacsCountries.push(r.payload);
      added++;
    }
  }
  renderGdacsCountryList();
  btn.disabled = false;
  showGdacsCountryHint(t("gdacsAasFillDone").replace("{n}", added), "success");
  setTimeout(hideGdacsCountryHint, 4000);
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

// Save GDELT BigQuery credentials
bqSaSaveBtn.addEventListener("click", async () => {
  bqSaSaveBtn.disabled = true;
  bqSaStatus.hidden = true;
  const result = await apiRequest("/apps/resilience/api/settings", {
    method: "PUT",
    body: { bq_service_account: bqSaInput.value },
  });
  bqSaSaveBtn.disabled = false;
  if (result.ok) {
    bqSaStatus.textContent = t("gdeltSettingsSaved");
    bqSaStatus.className = "settings-hint hint-success";
    bqSaStatus.hidden = false;
    setTimeout(() => { bqSaStatus.hidden = true; }, 3000);
    loadSettings();
  } else {
    bqSaStatus.textContent = result.payload?.error === "INVALID_JSON" ? "Invalid JSON" : result.payload?.error === "INVALID_SERVICE_ACCOUNT" ? "Missing project_id, client_email or private_key" : t("gdeltSettingsFailed");
    bqSaStatus.className = "settings-hint hint-error";
    bqSaStatus.hidden = false;
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

// GDACS AAS source display helper
function updateGdacsAasSourceDisplay(groupName, path) {
  const textEl = document.getElementById("gdacs-aas-source-text");
  if (!groupName && !path) {
    textEl.className = "gdacs-aas-source-empty";
    textEl.textContent = t("gdacsAasSourceEmpty");
  } else {
    textEl.className = "gdacs-aas-source-filled";
    textEl.innerHTML = `<span class="gdacs-src-group">${escapeHtml(groupName || "—")}</span><span class="gdacs-src-path">${escapeHtml(path || "—")}</span>`;
  }
}

// GDACS columns display helper (now in dashboard tile settings modal)
let cachedGdacsColumns = [];
function updateGdacsColsDisplay(columns) {
  cachedGdacsColumns = columns || [];
  const textEl = document.getElementById("dash-aas-cols-text");
  if (!textEl) return;
  if (!columns || !columns.length) {
    textEl.className = "gdacs-aas-source-empty";
    textEl.textContent = t("gdacsColsEmpty");
  } else {
    textEl.className = "gdacs-aas-source-filled";
    textEl.innerHTML = columns.map(c => {
      const p = typeof c === "string" ? c : c.path;
      const tp = typeof c === "string" ? "" : c.type;
      const typeHtml = tp ? ` <span class="gdacs-src-type">[${escapeHtml(tp)}]</span>` : "";
      return `<span class="gdacs-src-path">${escapeHtml(p)}${typeHtml}</span>`;
    }).join("");
  }
}

// Matching-Parameter display
let cachedMatchingConfigured = false;
function updateMatchingDisplay(groupName, paths) {
  const el = document.getElementById("gdacs-matching-paths");
  const hasData = !!(groupName || paths.country || paths.city || paths.lat || paths.lon);
  cachedMatchingConfigured = hasData;
  if (!hasData) {
    el.innerHTML = `<span class="gdacs-aas-source-empty">${t("matchingEmpty")}</span>`;
    return;
  }
  const items = [
    { key: "country", label: t("matchingCountry"), path: paths.country },
    { key: "city", label: t("matchingCity"), path: paths.city },
    { key: "lat", label: t("matchingLat"), path: paths.lat },
    { key: "lon", label: t("matchingLon"), path: paths.lon },
  ];
  let html = `<div class="gdacs-matching-group">${escapeHtml(groupName)}</div>`;
  for (const item of items) {
    const val = item.path
      ? `<span class="gdacs-matching-path-value">${escapeHtml(item.path)}</span>`
      : `<span class="gdacs-matching-path-skip">&mdash;</span>`;
    html += `<div class="gdacs-matching-path-item"><span class="gdacs-matching-path-label">${item.label}:</span> ${val}</div>`;
  }
  el.innerHTML = html;
}

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

// ── Settings: Nav switching ────────────────────────────────────────
settingsNav.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-settings-nav]");
  if (!btn) return;
  switchSettingsNav(btn.dataset.settingsNav);
});

function switchSettingsNav(nav) {
  activeSettingsNav = nav;
  settingsNav.querySelectorAll(".docs-nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.settingsNav === nav);
  });
  settingsNavFeeds.hidden = nav !== "feeds";
  settingsNavGdacs.hidden = nav !== "gdacs";
  settingsNavAasImport.hidden = nav !== "aas-import";
  settingsNavCC.hidden = nav !== "country-codes";
  settingsNavGdeltBq.hidden = nav !== "gdelt-bq";
  settingsNavDangerZone.hidden = nav !== "danger-zone";

  if (nav === "feeds" || nav === "gdacs" || nav === "aas-import" || nav === "gdelt-bq") {
    loadSettings();
  } else if (nav === "country-codes") {
    loadCountryMappings();
  }
}

// ── Danger Zone: delete all data ──────────────────────────────────
{
  const dzInput = document.getElementById("danger-zone-input");
  const dzBtn = document.getElementById("danger-zone-btn");
  const dzHint = document.getElementById("danger-zone-hint");

  dzInput.addEventListener("input", () => {
    dzBtn.disabled = dzInput.value.trim() !== t("dangerZoneConfirmWord");
  });

  dzBtn.addEventListener("click", async () => {
    if (dzInput.value.trim() !== t("dangerZoneConfirmWord")) return;
    dzBtn.disabled = true;
    dzHint.hidden = true;
    try {
      const res = await fetch("/apps/resilience/api/delete-all-data", { method: "POST", credentials: "same-origin" });
      if (!res.ok) throw new Error();
      dzHint.textContent = t("dangerZoneSuccess");
      dzHint.style.color = "var(--success, #22c55e)";
      dzHint.hidden = false;
      dzInput.value = "";
    } catch {
      dzHint.textContent = t("dangerZoneError");
      dzHint.style.color = "var(--danger, #ef4444)";
      dzHint.hidden = false;
      dzBtn.disabled = false;
    }
  });
}

// ── Country Mappings ──────────────────────────────────────────────
async function loadCountryMappings() {
  try {
    const offset = cmPage * CM_PER_PAGE;
    const qs = new URLSearchParams({ limit: CM_PER_PAGE, offset, q: cmQuery });
    const res = await apiRequest(`/apps/resilience/api/country-mappings?${qs}`);
    if (!res.ok || !res.payload) return;
    const data = res.payload;

    cmTbody.innerHTML = "";
    cmEmpty.hidden = data.items.length > 0;
    document.getElementById("cm-table").hidden = data.items.length === 0;

    for (const row of data.items) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td class="cm-td-iso">${escapeHtml(row.iso_code)}</td><td class="cm-td-alpha3">${escapeHtml(row.alpha3)}</td><td class="cm-td-numeric">${escapeHtml(row.numeric)}</td><td class="cm-td-editable" data-field="aas_names">${escapeHtml(row.aas_names)}</td><td class="cm-td-editable" data-field="gdacs_names">${escapeHtml(row.gdacs_names)}</td>`;
      tr.dataset.iso = row.iso_code;
      cmTbody.appendChild(tr);
    }

    // Pagination
    const totalPages = Math.max(1, Math.ceil(data.total / CM_PER_PAGE));
    const curPage = cmPage + 1;
    cmPageInfo.textContent = `${curPage} / ${totalPages} (${data.total})`;
    cmPrevBtn.disabled = cmPage <= 0;
    cmNextBtn.disabled = curPage >= totalPages;
  } catch (err) {
    console.error("loadCountryMappings error:", err);
  }
}

cmPrevBtn.addEventListener("click", () => { if (cmPage > 0) { cmPage--; loadCountryMappings(); } });
cmNextBtn.addEventListener("click", () => { cmPage++; loadCountryMappings(); });

cmSearchInput.addEventListener("input", () => {
  clearTimeout(cmDebounceTimer);
  cmDebounceTimer = setTimeout(() => {
    cmQuery = cmSearchInput.value.trim();
    cmPage = 0;
    loadCountryMappings();
  }, 400);
});

// Inline editing
cmTbody.addEventListener("click", (e) => {
  const td = e.target.closest(".cm-td-editable");
  if (!td || td.querySelector("input")) return;
  const oldVal = td.textContent;
  const field = td.dataset.field;
  const iso = td.closest("tr").dataset.iso;

  const input = document.createElement("input");
  input.type = "text";
  input.className = "cm-edit-input";
  input.value = oldVal;
  td.textContent = "";
  td.appendChild(input);
  input.focus();

  const save = async () => {
    const newVal = input.value.trim();
    td.textContent = newVal;
    if (newVal !== oldVal) {
      const body = {};
      // Get sibling value for the other field
      const tr = td.closest("tr");
      const aasTd = tr.querySelector('[data-field="aas_names"]');
      const gdacsTd = tr.querySelector('[data-field="gdacs_names"]');
      body.aas_names = field === "aas_names" ? newVal : aasTd.textContent;
      body.gdacs_names = field === "gdacs_names" ? newVal : gdacsTd.textContent;
      const result = await apiRequest(`/apps/resilience/api/country-mappings/${iso}`, {
        method: "PUT",
        body,
      });
      if (!result.ok) td.textContent = oldVal;
    }
  };

  input.addEventListener("blur", save);
  input.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") { input.removeEventListener("blur", save); save(); }
    if (ev.key === "Escape") { input.removeEventListener("blur", save); td.textContent = oldVal; }
  });
});

// Reset country mappings
cmResetBtn.addEventListener("click", () => {
  document.getElementById("cm-confirm-title").textContent = t("cmResetTitle");
  document.getElementById("cm-confirm-message").textContent = t("cmResetMessage");
  cmConfirmCancel.textContent = t("cmResetCancel");
  document.getElementById("cm-confirm-ok").textContent = t("cmResetConfirm");
  cmConfirmModal.showModal();
});

cmConfirmCancel.addEventListener("click", () => cmConfirmModal.close());

cmConfirmForm.addEventListener("submit", async (e) => {
  if (e.submitter?.value !== "confirm") return;
  cmConfirmModal.close();
  const res = await apiRequest("/apps/resilience/api/country-mappings/reset", { method: "POST" });
  if (res.ok) {
    cmPage = 0;
    cmQuery = "";
    cmSearchInput.value = "";
    loadCountryMappings();
  }
});

// Export country mappings
document.getElementById("cm-export-btn").addEventListener("click", async () => {
  const res = await apiRequest("/apps/resilience/api/country-mappings/export");
  if (!res.ok) return;
  const blob = new Blob([JSON.stringify(res.payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "country-mappings.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

// Import country mappings
const cmImportFile = document.getElementById("cm-import-file");
document.getElementById("cm-import-btn").addEventListener("click", () => cmImportFile.click());
cmImportFile.addEventListener("change", async () => {
  const file = cmImportFile.files[0];
  cmImportFile.value = "";
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const res = await apiRequest("/apps/resilience/api/country-mappings/import", {
      method: "POST", body: data
    });
    if (res.ok) {
      alert(t("cmImportSuccess").replace("{n}", res.payload.updated));
      loadCountryMappings();
    } else {
      alert(t("cmImportError"));
    }
  } catch {
    alert(t("cmImportError"));
  }
});

// ── AAS Country Import Modal ─────────────────────────────────────
const aasCmModal = document.getElementById("aas-cm-modal");
const aasCmCloseBtn = document.getElementById("aas-cm-close");
const aasCmBackBtn = document.getElementById("aas-cm-back-btn");
const aasCmCancelBtn = document.getElementById("aas-cm-cancel-btn");
const aasCmApplyBtn = document.getElementById("aas-cm-apply-btn");
const aasCmSteps = document.getElementById("aas-cm-steps");
const aasCmTree = document.getElementById("aas-cm-tree");

let aasCmCurrentStep = 1;
let aasCmSelectedGroup = null;
let aasCmSelectedAas = null;
let aasCmSelectedPath = "";
let aasCmSelectedPaths = []; // multi-select for columns mode
let aasCmMatchResults = null;
let aasCmMode = "import"; // "import", "picker", "columns", "geocoding", "matching", or "geo-single"
let aasCmGeoSingleAasId = null;
let aasCmGeoCountryPath = "";
let aasCmGeoCityPath = "";
let aasCmGeoPhase = "country"; // "country" or "city"
// Matching-Parameter Wizard state
let aasCmMatchingPaths = { country: "", city: "", lat: "", lon: "" };
let aasCmMatchingPhase = "country";
const MATCHING_PHASES = ["country", "city", "lat", "lon"];
const aasCmSkipBtn = document.getElementById("aas-cm-skip-btn");

function showAasCmStep(step) {
  aasCmCurrentStep = step;
  document.getElementById("aas-cm-success").hidden = true;
  const maxSteps = (aasCmMode === "picker" || aasCmMode === "columns" || aasCmMode === "geocoding" || aasCmMode === "matching" || aasCmMode === "geo-single" || aasCmMode === "company" || aasCmMode === "company-single") ? 3 : 4;
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`aas-cm-step-${i}`).hidden = i !== step;
    const dot = aasCmSteps.querySelector(`[data-step="${i}"]`);
    if (i > maxSteps) {
      dot.hidden = true;
    } else {
      dot.hidden = false;
      dot.classList.toggle("active", i <= step);
      dot.classList.toggle("done", i < step);
    }
    // Hide step-line after last visible dot
    const line = dot.nextElementSibling;
    if (line && line.classList.contains("aas-cm-step-line")) {
      line.hidden = i >= maxSteps;
    }
  }
  aasCmBackBtn.hidden = step <= 1 || aasCmMode === "geo-single" || aasCmMode === "company-single";
  // In single modes, hide all step indicators (only 1 visible step)
  if (aasCmMode === "geo-single" || aasCmMode === "company-single") {
    aasCmSteps.hidden = true;
  } else {
    aasCmSteps.hidden = false;
  }
  aasCmApplyBtn.hidden = true;
  aasCmApplyBtn.disabled = false;
  aasCmSkipBtn.hidden = true;
  if (step === 3 && aasCmMode === "matching") {
    updateMatchingPhaseUI();
  } else if (step === 3 && (aasCmMode === "geocoding" || aasCmMode === "geo-single")) {
    document.getElementById("aas-cm-step3-desc").textContent = t("geocodingStep3Country");
    if (aasCmGeoCountryPath && aasCmGeoCityPath) {
      aasCmApplyBtn.hidden = false;
      aasCmApplyBtn.textContent = t("geocodingStart");
    }
  } else if (step === 3 && aasCmMode === "columns" && aasCmSelectedPaths.length > 0) {
    aasCmApplyBtn.hidden = false;
    aasCmApplyBtn.textContent = t("gdacsColsBtn");
  } else if (step === 3 && (aasCmMode === "company" || aasCmMode === "company-single")) {
    document.getElementById("aas-cm-step3-desc").textContent = t("companyProcessDesc");
    if (aasCmSelectedPath) {
      aasCmApplyBtn.hidden = false;
      aasCmApplyBtn.textContent = t("companyProcessStart");
    }
  } else if (step === 3 && aasCmSelectedPath) {
    aasCmApplyBtn.hidden = false;
    aasCmApplyBtn.textContent = aasCmMode === "picker" ? t("gdacsAasSourceBtn") : t("aasCmApply");
  }
  aasCmCancelBtn.textContent = t("aasCmCancel");
}

// Open modal (shared for import + picker modes)
function openAasCmModal(mode, aasId) {
  aasCmMode = mode;
  aasCmCurrentStep = 1;
  aasCmSelectedGroup = null;
  aasCmSelectedAas = null;
  aasCmSelectedPath = "";
  aasCmSelectedPaths = [];
  aasCmMatchResults = null;
  aasCmGeoCountryPath = "";
  aasCmGeoCityPath = "";
  aasCmGeoPhase = "country";
  aasCmGeoSingleAasId = null;
  aasCmMatchingPaths = { country: "", city: "", lat: "", lon: "" };
  aasCmMatchingPhase = "country";
  aasCmSkipBtn.hidden = true;
  const titles = { picker: t("gdacsAasSourceLabel"), columns: t("gdacsColsLabel"), "ind-columns": t("indColsLabel"), geocoding: t("geocodingTitle"), matching: t("matchingLabel"), import: t("aasCmTitle"), "geo-single": t("geocodingTitle"), company: t("companyProcessTitle"), "company-single": t("companyProcessTitle") };
  document.getElementById("aas-cm-title").textContent = titles[mode] || titles.import;
  document.getElementById("aas-cm-step1-desc").textContent = t("aasCmStep1Desc");
  document.getElementById("aas-cm-selected-path").hidden = true;
  document.getElementById("aas-cm-results").hidden = true;
  document.getElementById("aas-cm-processing").hidden = false;
  document.getElementById("aas-cm-proc-1-icon").textContent = "\u25CB";
  document.getElementById("aas-cm-proc-1-count").textContent = "";
  document.getElementById("aas-cm-proc-2-icon").textContent = "\u25CB";
  document.getElementById("aas-cm-proc-2-count").textContent = "";
  document.getElementById("aas-cm-success").hidden = true;

  if ((mode === "geo-single" || mode === "company-single") && aasId) {
    // Skip steps 1+2, jump directly to tree
    aasCmGeoSingleAasId = aasId;
    showAasCmStep(3);
    loadAasCmTree(aasId);
  } else if (mode === "ind-columns" && aasId) {
    // aasId is actually group_id here — skip step 1, go to step 2
    aasCmSelectedGroup = { group_id: aasId };
    showAasCmStep(2);
    loadAasCmAas(aasId);
  } else {
    showAasCmStep(1);
    loadAasCmGroups();
  }
  aasCmModal.showModal();
}

document.getElementById("cm-aas-import-btn").addEventListener("click", () => openAasCmModal("import"));
document.getElementById("gdacs-matching-btn").addEventListener("click", () => openAasCmModal("matching"));
document.getElementById("aas-ov-geocoding-btn").addEventListener("click", () => openAasCmModal("geocoding"));
document.getElementById("aas-ov-process-btn").addEventListener("click", () => openAasCmModal("company"));

// Close / cancel
aasCmCloseBtn.addEventListener("click", () => aasCmModal.close());
aasCmCancelBtn.addEventListener("click", () => aasCmModal.close());
aasCmBackBtn.addEventListener("click", () => {
  if (aasCmMode === "geo-single") {
    // geo-single starts at step 3 — back closes the modal
    aasCmModal.close();
    return;
  }
  if (aasCmCurrentStep > 1) {
    if (aasCmCurrentStep === 3) {
      aasCmSelectedPath = "";
      if (aasCmMode === "geocoding") {
        aasCmGeoCountryPath = "";
        aasCmGeoCityPath = "";
        aasCmGeoPhase = "country";
      }
      if (aasCmMode === "matching") {
        aasCmMatchingPaths = { country: "", city: "", lat: "", lon: "" };
        aasCmMatchingPhase = "country";
        aasCmSkipBtn.hidden = true;
      }
    }
    showAasCmStep(aasCmCurrentStep - 1);
  }
});

// Matching Wizard: Phase UI + advance logic
const MATCHING_PHASE_KEYS = { country: "matchingCountryStep", city: "matchingCityStep", lat: "matchingLatStep", lon: "matchingLonStep" };
const MATCHING_PHASE_LABELS = { country: "matchingCountry", city: "matchingCity", lat: "matchingLat", lon: "matchingLon" };

function updateMatchingPhaseUI() {
  const desc = document.getElementById("aas-cm-step3-desc");
  desc.textContent = t(MATCHING_PHASE_KEYS[aasCmMatchingPhase]);
  aasCmSkipBtn.hidden = false;
  aasCmSkipBtn.textContent = t("matchingSkip");
  aasCmApplyBtn.hidden = true;
  // Show summary of already-selected paths
  const pathDisplay = document.getElementById("aas-cm-selected-path");
  const selected = MATCHING_PHASES.filter(p => aasCmMatchingPaths[p]);
  if (selected.length) {
    pathDisplay.hidden = false;
    pathDisplay.innerHTML = selected.map(p =>
      `<span class="aas-cm-matching-tag aas-cm-matching-${p}">${t(MATCHING_PHASE_LABELS[p])}: ${escapeHtml(aasCmMatchingPaths[p])}</span>`
    ).join(" ");
  } else {
    pathDisplay.hidden = true;
  }
  // Remove prior phase highlights from tree
  document.querySelectorAll(".aas-cm-matching-country, .aas-cm-matching-city, .aas-cm-matching-lat, .aas-cm-matching-lon").forEach(el => {
    el.classList.remove("aas-cm-matching-country", "aas-cm-matching-city", "aas-cm-matching-lat", "aas-cm-matching-lon");
  });
}

function advanceMatchingPhase() {
  const idx = MATCHING_PHASES.indexOf(aasCmMatchingPhase);
  if (idx < MATCHING_PHASES.length - 1) {
    aasCmMatchingPhase = MATCHING_PHASES[idx + 1];
    updateMatchingPhaseUI();
  } else {
    // All phases done — show apply button
    aasCmSkipBtn.hidden = true;
    const pathDisplay = document.getElementById("aas-cm-selected-path");
    pathDisplay.hidden = false;
    pathDisplay.innerHTML = MATCHING_PHASES.map(p => {
      const val = aasCmMatchingPaths[p];
      return `<span class="aas-cm-matching-tag aas-cm-matching-${p}">${t(MATCHING_PHASE_LABELS[p])}: ${val ? escapeHtml(val) : "—"}</span>`;
    }).join(" ");
    document.getElementById("aas-cm-step3-desc").textContent = t("matchingSaved").replace("gespeichert.", "").replace("saved.", "").trim() || t("matchingLabel");
    aasCmApplyBtn.hidden = false;
    aasCmApplyBtn.textContent = t("gdacsSettingsSave");
  }
}

aasCmSkipBtn.addEventListener("click", () => {
  if (aasCmMode === "matching") {
    aasCmMatchingPaths[aasCmMatchingPhase] = "";
    advanceMatchingPhase();
  }
});

// Step 1: Load groups
async function loadAasCmGroups() {
  const res = await apiRequest("/apps/resilience/api/asset-groups");
  const list = document.getElementById("aas-cm-group-list");
  list.innerHTML = "";
  const groups = res.ok ? (res.payload.groups || []) : [];
  document.getElementById("aas-cm-group-empty").hidden = groups.length > 0;
  for (const g of groups) {
    const btn = document.createElement("button");
    btn.className = "aas-cm-select-item";
    btn.textContent = `${g.name} (${g.member_count} AAS)`;
    btn.addEventListener("click", () => {
      aasCmSelectedGroup = g;
      document.getElementById("aas-cm-step2-desc").textContent = t("aasCmStep2Desc");
      showAasCmStep(2);
      loadAasCmAas(g.group_id);
    });
    list.appendChild(btn);
  }
}

// Step 2: Load AAS in group
async function loadAasCmAas(groupId) {
  const res = await apiRequest(`/apps/resilience/api/asset-groups/${groupId}`);
  const list = document.getElementById("aas-cm-aas-list");
  list.innerHTML = "";
  const members = res.ok ? (res.payload.members || []) : [];
  document.getElementById("aas-cm-aas-empty").hidden = members.length > 0;
  for (const m of members) {
    const btn = document.createElement("button");
    btn.className = "aas-cm-select-item";
    btn.textContent = m.aas_id;
    btn.addEventListener("click", () => {
      aasCmSelectedAas = m;
      document.getElementById("aas-cm-step3-desc").textContent = t("aasCmStep3Desc");
      showAasCmStep(3);
      loadAasCmTree(m.aas_id);
    });
    list.appendChild(btn);
  }
}

// Step 3: Load tree
async function loadAasCmTree(aasId) {
  aasCmTree.innerHTML = "";
  const loading = document.getElementById("aas-cm-tree-loading");
  loading.hidden = false;
  loading.textContent = t("aasCmTreeLoading");

  const res = await apiRequest(`/apps/resilience/api/aas-import/${encodeURIComponent(aasId)}`);
  loading.hidden = true;
  if (!res.ok || !res.payload) {
    aasCmTree.innerHTML = `<p class="aas-cm-error">${escapeHtml(t("aasCmTreeError"))}</p>`;
    return;
  }
  const submodels = res.payload.submodels || [];
  if (!submodels.length) {
    aasCmTree.innerHTML = `<p class="aas-cm-error">${escapeHtml(t("aasCmTreeError"))}</p>`;
    return;
  }
  for (const sm of submodels) {
    const card = document.createElement("div");
    card.className = "aas-cm-sm-card";
    card.innerHTML = `<h4 class="aas-cm-sm-title">${escapeHtml(sm.idShort || sm.id)}</h4>`;
    const elHtml = renderSelectableEls(sm.submodelElements || [], 0, sm.idShort || "");
    card.insertAdjacentHTML("beforeend", elHtml);
    aasCmTree.appendChild(card);
  }
}

function renderSelectableEls(elements, depth, parentPath) {
  let html = `<ul class="aas-el-list" style="padding-left:${depth > 0 ? "1.2rem" : "0"}">`;
  for (const el of elements) html += renderSelectableEl(el, depth, parentPath);
  html += "</ul>";
  return html;
}

function renderSelectableEl(el, depth, parentPath) {
  const mt = el.modelType || "";
  const name = el.idShort || "";
  const path = parentPath ? `${parentPath}.${name}` : name;
  switch (mt) {
    case "Property": {
      const val = el.value ?? "";
      const vt = el.valueType || "";
      const vtHtml = vt ? `<span class="aas-el-type">[${escapeHtml(vt)}]</span>` : "";
      return `<li class="aas-el-item aas-cm-prop-item" data-idshort-path="${escapeHtml(path)}" data-value-type="${escapeHtml(vt)}"><span class="aas-el-name">${escapeHtml(name)}</span> ${vtHtml} = <span class="aas-el-value">${escapeHtml(String(val))}</span></li>`;
    }
    case "MultiLanguageProperty": {
      const parts = (el.value || []).map(l => `${l.language}: ${l.text}`).join(", ");
      return `<li class="aas-el-item aas-cm-prop-item" data-idshort-path="${escapeHtml(path)}" data-value-type="MLProperty"><span class="aas-el-name">${escapeHtml(name)}</span> <span class="aas-el-type">[MLProperty]</span> = <span class="aas-el-value">${escapeHtml(parts)}</span></li>`;
    }
    case "SubmodelElementCollection":
    case "SubmodelElementList": {
      const children = el.value || [];
      const label = mt === "SubmodelElementCollection" ? "Collection" : "List";
      let h = `<li class="aas-el-item aas-el-group"><span class="aas-el-name">${escapeHtml(name)}</span> <span class="aas-el-type">[${label}]</span>`;
      if (children.length > 0) h += renderSelectableEls(children, depth + 1, path);
      return h + "</li>";
    }
    case "Entity": {
      const stmts = el.statements || [];
      let h = `<li class="aas-el-item aas-el-group"><span class="aas-el-name">${escapeHtml(name)}</span> <span class="aas-el-type">[Entity]</span>`;
      if (stmts.length > 0) h += renderSelectableEls(stmts, depth + 1, path);
      return h + "</li>";
    }
    default:
      return `<li class="aas-el-item"><span class="aas-el-name">${escapeHtml(name)}</span> <span class="aas-el-type">[${escapeHtml(mt)}]</span></li>`;
  }
}

// Tree click: select property
aasCmTree.addEventListener("click", (e) => {
  const propEl = e.target.closest("[data-idshort-path]");
  if (!propEl) return;
  const path = propEl.dataset.idshortPath;
  const pathDisplay = document.getElementById("aas-cm-selected-path");

  if (aasCmMode === "matching") {
    // Multi-phase: country → city → lat → lon
    propEl.classList.add(`aas-cm-matching-${aasCmMatchingPhase}`);
    aasCmMatchingPaths[aasCmMatchingPhase] = path;
    advanceMatchingPhase();
  } else if (aasCmMode === "geocoding" || aasCmMode === "geo-single") {
    // Two-phase: first country, then city
    if (aasCmGeoPhase === "country") {
      // Remove previous country highlight
      aasCmTree.querySelectorAll(".aas-cm-geo-country").forEach(el => el.classList.remove("aas-cm-geo-country"));
      propEl.classList.add("aas-cm-geo-country");
      aasCmGeoCountryPath = path;
      // Show label
      pathDisplay.innerHTML = `<span class="geo-path-label geo-country">${t("geocodingCountryLabel")}: ${escapeHtml(path)}</span>`;
      pathDisplay.hidden = false;
      // Advance to city phase
      aasCmGeoPhase = "city";
      document.getElementById("aas-cm-step3-desc").textContent = t("geocodingStep3City");
    } else {
      // City phase
      aasCmTree.querySelectorAll(".aas-cm-geo-city").forEach(el => el.classList.remove("aas-cm-geo-city"));
      propEl.classList.add("aas-cm-geo-city");
      aasCmGeoCityPath = path;
      // Show both labels
      pathDisplay.innerHTML = `<span class="geo-path-label geo-country">${t("geocodingCountryLabel")}: ${escapeHtml(aasCmGeoCountryPath)}</span> <span class="geo-path-label geo-city">${t("geocodingCityLabel")}: ${escapeHtml(aasCmGeoCityPath)}</span>`;
      pathDisplay.hidden = false;
      aasCmApplyBtn.hidden = false;
      aasCmApplyBtn.textContent = t("geocodingStart");
    }
  } else if (aasCmMode === "columns" || aasCmMode === "ind-columns") {
    // Multi-select: toggle {path, type} objects
    const valueType = propEl.dataset.valueType || "";
    const idx = aasCmSelectedPaths.findIndex(c => c.path === path);
    if (idx >= 0) {
      aasCmSelectedPaths.splice(idx, 1);
      propEl.classList.remove("aas-cm-prop-selected");
    } else {
      aasCmSelectedPaths.push({ path, type: valueType });
      propEl.classList.add("aas-cm-prop-selected");
    }
    if (aasCmSelectedPaths.length) {
      const countKey = aasCmMode === "ind-columns" ? "indColsCount" : "gdacsColsCount";
      const btnKey = aasCmMode === "ind-columns" ? "indColsBtn" : "gdacsColsBtn";
      pathDisplay.textContent = t(countKey).replace("{n}", aasCmSelectedPaths.length);
      pathDisplay.hidden = false;
      aasCmApplyBtn.hidden = false;
      aasCmApplyBtn.textContent = t(btnKey);
    } else {
      pathDisplay.hidden = true;
      aasCmApplyBtn.hidden = true;
    }
  } else {
    // Single-select
    aasCmTree.querySelectorAll(".aas-cm-prop-selected").forEach(el => el.classList.remove("aas-cm-prop-selected"));
    propEl.classList.add("aas-cm-prop-selected");
    aasCmSelectedPath = path;
    pathDisplay.textContent = t("aasCmSelectedPath").replace("{path}", aasCmSelectedPath);
    pathDisplay.hidden = false;
    aasCmApplyBtn.hidden = false;
    aasCmApplyBtn.textContent = aasCmMode === "picker" ? t("gdacsAasSourceBtn") : (aasCmMode === "company" || aasCmMode === "company-single") ? t("companyProcessStart") : t("aasCmApply");
  }
});

// Apply / Übernehmen button
aasCmApplyBtn.addEventListener("click", async () => {
  if (aasCmCurrentStep === 3 && aasCmMode === "matching") {
    // Matching mode: save all 4 paths + group
    aasCmApplyBtn.disabled = true;
    const res = await apiRequest("/apps/resilience/api/settings", {
      method: "PUT",
      body: {
        matching_params: {
          group_id: aasCmSelectedGroup.group_id,
          country_path: aasCmMatchingPaths.country,
          city_path: aasCmMatchingPaths.city,
          lat_path: aasCmMatchingPaths.lat,
          lon_path: aasCmMatchingPaths.lon,
        },
      },
    });
    aasCmApplyBtn.disabled = false;
    if (res.ok) {
      updateMatchingDisplay(aasCmSelectedGroup.name, aasCmMatchingPaths);
      aasCmModal.close();
    }
    return;
  }
  if (aasCmCurrentStep === 3 && aasCmMode === "geocoding" && aasCmGeoCountryPath && aasCmGeoCityPath) {
    // Geocoding mode: save settings + trigger job
    aasCmApplyBtn.disabled = true;
    const saveRes = await apiRequest("/apps/resilience/api/settings", {
      method: "PUT",
      body: {
        geocoding_group_id: aasCmSelectedGroup.group_id,
        geocoding_country_path: aasCmGeoCountryPath,
        geocoding_city_path: aasCmGeoCityPath,
      },
    });
    if (!saveRes.ok) { aasCmApplyBtn.disabled = false; return; }
    const runRes = await apiRequest("/apps/resilience/api/geocoding/run", { method: "POST" });
    aasCmApplyBtn.disabled = false;
    if (runRes.ok) {
      aasCmModal.close();
      startGeocodingPolling();
    }
    return;
  }
  if (aasCmCurrentStep === 3 && aasCmMode === "geo-single" && aasCmGeoCountryPath && aasCmGeoCityPath && aasCmGeoSingleAasId) {
    // Single-AAS geocoding: call run-single with paths
    aasCmApplyBtn.disabled = true;
    const res = await apiRequest("/apps/resilience/api/geocoding/run-single", {
      method: "POST",
      body: { aas_id: aasCmGeoSingleAasId, country_path: aasCmGeoCountryPath, city_path: aasCmGeoCityPath },
    });
    aasCmApplyBtn.disabled = false;
    aasCmModal.close();
    if (res.ok) {
      const status = res.payload.geocoded_status;
      // Geo-Button in Tabelle aktualisieren
      const geoBtn = aasOvTbody.querySelector(`[data-geo-aas="${CSS.escape(aasCmGeoSingleAasId)}"]`);
      if (geoBtn) {
        geoBtn.innerHTML = status === "ok"
          ? `<svg class="aas-ov-status-ok" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
          : `<svg class="aas-ov-status-no" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
      }
      const entry = aasOverviewData.find(e => e.aas_id === aasCmGeoSingleAasId);
      if (entry) entry.geocoded_status = status;
      showGdacsCountryHint(status === "ok" ? t("geoSingleSuccess") : t("geoSingleError"), status === "ok" ? "success" : "error");
    } else {
      showGdacsCountryHint(t("geoSingleError"), "error");
    }
    return;
  }
  // Company batch mode
  if (aasCmCurrentStep === 3 && aasCmMode === "company" && aasCmSelectedPath && aasCmSelectedGroup) {
    aasCmApplyBtn.disabled = true;
    const saveRes = await apiRequest("/apps/resilience/api/settings", {
      method: "PUT",
      body: { company_group_id: aasCmSelectedGroup.group_id, company_name_path: aasCmSelectedPath },
    });
    if (!saveRes.ok) { aasCmApplyBtn.disabled = false; return; }
    const runRes = await apiRequest("/apps/resilience/api/company-process/run", { method: "POST" });
    aasCmApplyBtn.disabled = false;
    if (runRes.ok) {
      aasCmModal.close();
      startCompanyProcessPolling();
    }
    return;
  }
  // Company single mode
  if (aasCmCurrentStep === 3 && aasCmMode === "company-single" && aasCmSelectedPath && aasCmGeoSingleAasId) {
    aasCmApplyBtn.disabled = true;
    const singleAasId = aasCmGeoSingleAasId;
    aasCmModal.close();
    // Show spinner on row icon while processing
    const rowBtn = aasOvTbody.querySelector(`[data-process-aas="${CSS.escape(singleAasId)}"]`);
    if (rowBtn) {
      rowBtn.disabled = true;
      rowBtn.innerHTML = `<svg class="aas-ov-spinner" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v4m0 12v4m-7.07-15.07 2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>`;
    }
    const res = await apiRequest("/apps/resilience/api/company-process/run-single", {
      method: "POST",
      body: { aas_id: singleAasId, company_name_path: aasCmSelectedPath },
    });
    if (res.ok && res.payload?.status === "ok") {
      if (rowBtn) {
        rowBtn.disabled = false;
        rowBtn.innerHTML = `<svg class="aas-ov-status-ok" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      }
      const entry = aasOverviewData.find(e => e.aas_id === singleAasId);
      if (entry) entry.company_status = "ok";
      showGdacsCountryHint(t("companyProcessSuccess"), "success");
    } else {
      if (rowBtn) {
        rowBtn.disabled = false;
        rowBtn.innerHTML = `<svg class="aas-ov-status-no" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
      }
      showGdacsCountryHint(t("companyProcessError"), "error");
    }
    return;
  }
  if (aasCmCurrentStep === 3 && aasCmSelectedPaths.length > 0 && aasCmMode === "columns") {
    // Columns mode: save selected paths
    aasCmApplyBtn.disabled = true;
    const res = await apiRequest("/apps/resilience/api/settings", {
      method: "PUT",
      body: { gdacs_aas_columns: aasCmSelectedPaths },
    });
    aasCmApplyBtn.disabled = false;
    if (res.ok) {
      updateGdacsColsDisplay(aasCmSelectedPaths);
      showGdacsCountryHint(t("gdacsColsSaved"), "success");
      setTimeout(hideGdacsCountryHint, 3000);
      aasCmModal.close();
      // Refresh dashboard to apply new columns
      dashAasPage = 0;
      loadDashboard();
    }
    return;
  }
  if (aasCmCurrentStep === 3 && aasCmSelectedPaths.length > 0 && aasCmMode === "ind-columns") {
    // Indicator columns mode: merge columns into indicator dashboard config
    aasCmApplyBtn.disabled = true;
    const cfgRes = await apiRequest("/apps/resilience/api/indicators/dashboard-config");
    const cfg = cfgRes.ok ? cfgRes.payload : {};
    cfg.columns = aasCmSelectedPaths;
    const saveRes = await apiRequest("/apps/resilience/api/indicators/dashboard-config", {
      method: "PUT", body: { config: cfg },
    });
    aasCmApplyBtn.disabled = false;
    if (saveRes.ok) {
      updateIndColsDisplay(aasCmSelectedPaths);
      showGdacsCountryHint(t("indColsSaved"), "success");
      setTimeout(hideGdacsCountryHint, 3000);
      aasCmModal.close();
      dashIndPage = 0;
      loadDashboard();
    }
    return;
  }
  if (aasCmCurrentStep === 3 && aasCmSelectedPath && aasCmMode === "picker") {
    // Picker mode: save group + path to GDACS settings
    aasCmApplyBtn.disabled = true;
    const res = await apiRequest("/apps/resilience/api/settings", {
      method: "PUT",
      body: {
        gdacs_aas_group_id: aasCmSelectedGroup.group_id,
        gdacs_aas_path: aasCmSelectedPath,
      },
    });
    aasCmApplyBtn.disabled = false;
    if (res.ok) {
      updateGdacsAasSourceDisplay(aasCmSelectedGroup.name, aasCmSelectedPath);
      showGdacsCountryHint(t("gdacsAasSourceSaved"), "success");
      setTimeout(hideGdacsCountryHint, 3000);
      aasCmModal.close();
    }
    return;
  }
  if (aasCmCurrentStep === 3 && aasCmSelectedPath) {
    showAasCmStep(4);
    await runAasCmProcessing();
  } else if (aasCmCurrentStep === 4 && aasCmMatchResults) {
    await applyAasCmResults();
  }
});

// Step 4: Processing
async function runAasCmProcessing() {
  const proc1Icon = document.getElementById("aas-cm-proc-1-icon");
  const proc1Count = document.getElementById("aas-cm-proc-1-count");
  const proc2Icon = document.getElementById("aas-cm-proc-2-icon");
  const proc2Count = document.getElementById("aas-cm-proc-2-count");
  const resultsDiv = document.getElementById("aas-cm-results");

  document.getElementById("aas-cm-processing").hidden = false;
  resultsDiv.hidden = true;
  proc1Icon.textContent = "\u23F3";
  proc1Count.textContent = "";
  proc2Icon.textContent = "\u25CB";
  proc2Count.textContent = "";
  document.getElementById("aas-cm-proc-1-label").textContent = t("aasCmProc1");
  document.getElementById("aas-cm-proc-2-label").textContent = t("aasCmProc2");

  // Extract values
  const extractRes = await apiRequest("/apps/resilience/api/country-mappings/aas-extract", {
    method: "POST",
    body: { group_id: aasCmSelectedGroup.group_id, id_short_path: aasCmSelectedPath }
  });
  if (!extractRes.ok) {
    proc1Icon.textContent = "\u2717";
    return;
  }
  const values = extractRes.payload.values || [];
  if (values.length === 0) {
    proc1Icon.textContent = "\u2713";
    proc1Count.textContent = "0/0";
    proc2Icon.textContent = "\u2713";
    proc2Count.textContent = "0/0";
    aasCmMatchResults = { step1Matched: [], step2Matched: [], unmatched: [] };
    renderAasCmResults();
    return;
  }

  // Step 1: Direct match
  const matchRes = await apiRequest("/apps/resilience/api/country-mappings/aas-match", {
    method: "POST", body: { values }
  });
  if (!matchRes.ok) { proc1Icon.textContent = "\u2717"; return; }
  const step1Matched = matchRes.payload.matched;
  const unmatched = matchRes.payload.unmatched;
  proc1Icon.textContent = "\u2713";
  proc1Count.textContent = `${step1Matched.length}/${values.length}`;

  // Step 2: AI match
  let step2Matched = [];
  let finalUnmatched = unmatched;
  if (unmatched.length > 0) {
    proc2Icon.textContent = "\u23F3";
    const aiRes = await apiRequest("/apps/resilience/api/country-mappings/aas-ai-match", {
      method: "POST", body: { values: unmatched }
    });
    if (aiRes.ok && !aiRes.payload.ai_unavailable) {
      step2Matched = aiRes.payload.matched || [];
      finalUnmatched = aiRes.payload.unmatched || [];
    } else if (aiRes.ok && aiRes.payload.ai_unavailable) {
      finalUnmatched = unmatched;
    }
  }
  proc2Icon.textContent = "\u2713";
  proc2Count.textContent = `${step2Matched.length}/${unmatched.length}`;

  aasCmMatchResults = { step1Matched, step2Matched, unmatched: finalUnmatched };
  renderAasCmResults();
}

function renderAasCmResults() {
  const { step1Matched, step2Matched, unmatched } = aasCmMatchResults;
  const total = step1Matched.length + step2Matched.length + unmatched.length;
  const summary = document.getElementById("aas-cm-summary");
  summary.textContent = t("aasCmSummary")
    .replace("{total}", total)
    .replace("{step1}", step1Matched.length)
    .replace("{step2}", step2Matched.length)
    .replace("{unmatched}", unmatched.length);

  const tbody = document.getElementById("aas-cm-result-tbody");
  tbody.innerHTML = "";
  document.getElementById("aas-cm-th-value").textContent = t("aasCmThValue");
  document.getElementById("aas-cm-th-match").textContent = t("aasCmThMatch");
  document.getElementById("aas-cm-th-method").textContent = t("aasCmThMethod");

  for (const m of step1Matched) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${escapeHtml(m.value)}</td><td><code>${escapeHtml(m.iso_code)}</code></td><td><span class="aas-cm-badge aas-cm-badge-direct">${escapeHtml(t("aasCmDirect"))}</span></td>`;
    tbody.appendChild(tr);
  }
  for (const m of step2Matched) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${escapeHtml(m.value)}</td><td><code>${escapeHtml(m.iso_code)}</code></td><td><span class="aas-cm-badge aas-cm-badge-ai">AI</span></td>`;
    tbody.appendChild(tr);
  }
  for (const v of unmatched) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${escapeHtml(v)}</td><td>—</td><td><span class="aas-cm-badge aas-cm-badge-none">${escapeHtml(t("aasCmNoMatch"))}</span></td>`;
    tbody.appendChild(tr);
  }

  document.getElementById("aas-cm-results").hidden = false;
  if (step1Matched.length + step2Matched.length > 0) {
    aasCmApplyBtn.hidden = false;
    aasCmApplyBtn.textContent = t("aasCmApplyResults");
  }
  aasCmCancelBtn.textContent = t("aasCmClose");
}

async function applyAasCmResults() {
  const { step1Matched, step2Matched } = aasCmMatchResults;
  const allMapped = [...step1Matched, ...step2Matched];
  aasCmApplyBtn.disabled = true;
  aasCmApplyBtn.textContent = t("aasCmApplying");

  const res = await apiRequest("/apps/resilience/api/country-mappings/aas-apply", {
    method: "POST", body: { mappings: allMapped }
  });
  aasCmApplyBtn.disabled = false;
  if (res.ok) {
    aasCmApplyBtn.hidden = true;
    aasCmBackBtn.hidden = true;
    aasCmCancelBtn.textContent = t("aasCmClose");
    loadCountryMappings();
    // Show success screen
    document.getElementById("aas-cm-step-4").hidden = true;
    const successDiv = document.getElementById("aas-cm-success");
    document.getElementById("aas-cm-success-title").textContent = t("aasCmApplied");
    const { step1Matched, step2Matched } = aasCmMatchResults;
    document.getElementById("aas-cm-success-detail").textContent =
      t("aasCmSuccessDetail").replace("{n}", step1Matched.length + step2Matched.length);
    successDiv.hidden = false;
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

// ── Color Swatch Picker ──
const IND_COLOR_SWATCHES = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308",
  "#84cc16", "#22c55e", "#14b8a6", "#06b6d4",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
  "#ec4899", "#f43f5e", "#9ca3af", "#6b7280",
];

let activeSwatchBtn = null;

function openColorPicker(btn) {
  closeColorPicker();
  activeSwatchBtn = btn;
  const picker = document.createElement("div");
  picker.className = "ind-color-picker-popover";
  picker.innerHTML = IND_COLOR_SWATCHES.map((c) =>
    `<button type="button" class="ind-color-picker-swatch" data-color="${c}" style="background:${c}" ${c === btn.dataset.color ? 'data-active="true"' : ""}></button>`
  ).join("") + `<button type="button" class="ind-color-picker-custom">${t("indColorCustom")}</button>`;

  picker.addEventListener("click", (e) => {
    const swatch = e.target.closest(".ind-color-picker-swatch");
    if (swatch) {
      selectSwatchColor(btn, swatch.dataset.color);
      closeColorPicker();
      return;
    }
    if (e.target.closest(".ind-color-picker-custom")) {
      const tmp = document.createElement("input");
      tmp.type = "color";
      tmp.value = btn.dataset.color;
      tmp.addEventListener("input", () => selectSwatchColor(btn, tmp.value));
      tmp.click();
      closeColorPicker();
    }
  });

  btn.appendChild(picker);
  setTimeout(() => document.addEventListener("click", closePickerOutside, { once: true }), 0);
}

function closePickerOutside(e) {
  if (activeSwatchBtn && !activeSwatchBtn.contains(e.target)) closeColorPicker();
}

function closeColorPicker() {
  document.querySelectorAll(".ind-color-picker-popover").forEach((p) => p.remove());
  activeSwatchBtn = null;
}

function selectSwatchColor(btn, color) {
  btn.dataset.color = color;
  btn.style.background = color;
  const hidden = btn.nextElementSibling;
  if (hidden && hidden.type === "hidden") hidden.value = color;
}

document.addEventListener("click", (e) => {
  const swatchBtn = e.target.closest(".ind-color-swatch-btn");
  if (swatchBtn && !swatchBtn.querySelector(".ind-color-picker-popover")) {
    e.stopPropagation();
    openColorPicker(swatchBtn);
  }
});

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

  for (const ind of filtered) {
    const tr = document.createElement("tr");
    tr.dataset.indicatorId = ind.indicator_id;
    tr.innerHTML = `
      <td>${escapeHtml(ind.name)}</td>
      <td>${escapeHtml(ind.class_name || "-")}</td>
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

// ── Operator options per input type (readable text) ──
function getOperators(inputType) {
  if (inputType === "text") return [["==", t("indOpEquals")], ["!=", t("indOpNotEquals")]];
  if (inputType === "boolean") return [["==", t("indOpEquals")]];
  return [
    ["==",  t("indOpEquals")],
    ["!=",  t("indOpNotEquals")],
    [">",   t("indOpGreater")],
    ["<",   t("indOpLess")],
    [">=",  t("indOpGreaterEqual")],
    ["<=",  t("indOpLessEqual")],
  ];
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
      <button type="button" class="ind-color-swatch-btn group-output-color" data-color="${groupData.output_color || "#9ca3af"}" style="background:${groupData.output_color || "#9ca3af"}"></button>
      <input type="hidden" class="group-output-color-hidden" value="${groupData.output_color || "#9ca3af"}" />
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
    body.insertBefore(createConditionRow({ input: "number", operator: "==", value: "" }), addBtn);
  });
  body.appendChild(addBtn);

  card.appendChild(body);

  header.querySelector(".ind-group-remove").addEventListener("click", () => {
    card.remove();
    renumberGroups();
  });

  return card;
}

function buildOperatorHtml(inputType, selected) {
  return getOperators(inputType).map(([val, label]) =>
    `<option value="${val}" ${val === selected ? "selected" : ""}>${escapeHtml(label)}</option>`
  ).join("");
}

function buildValueHtml(inputType, value) {
  if (inputType === "boolean") {
    return `<select class="ind-input condition-value"><option value="true" ${value === "true" ? "selected" : ""}>true</option><option value="false" ${value === "false" ? "selected" : ""}>false</option></select>`;
  }
  const type = inputType === "number" ? "number" : "text";
  return `<input type="${type}" class="ind-input condition-value" value="${escapeHtml(String(value ?? ""))}" placeholder="${t("indConditionValue")}" ${type === "number" ? 'step="any"' : ""} />`;
}

function createConditionRow(cond) {
  const row = document.createElement("div");
  row.className = "ind-condition-row";
  const inputType = cond.input || "number";

  row.innerHTML = `
    <select class="condition-input">
      <option value="number" ${inputType === "number" ? "selected" : ""}>${t("indInputNumber")}</option>
      <option value="text" ${inputType === "text" ? "selected" : ""}>${t("indInputText")}</option>
      <option value="boolean" ${inputType === "boolean" ? "selected" : ""}>${t("indInputBoolean")}</option>
    </select>
    <select class="condition-operator">${buildOperatorHtml(inputType, cond.operator)}</select>
    ${buildValueHtml(inputType, cond.value)}
    <button class="ind-condition-remove" type="button" title="Remove">&times;</button>
  `;

  // Change input type → rebuild operator + value
  row.querySelector(".condition-input").addEventListener("change", (e) => {
    const newType = e.target.value;
    const opSelect = row.querySelector(".condition-operator");
    const currentOp = opSelect.value;
    opSelect.innerHTML = buildOperatorHtml(newType, currentOp);
    const oldVal = row.querySelector(".condition-value");
    const curVal = oldVal.value;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = buildValueHtml(newType, newType === "boolean" ? "true" : curVal);
    oldVal.replaceWith(wrapper.firstElementChild);
  });

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
  const card = createGroupCard({ output_label: "", output_color: "#9ca3af", output_score: 0, conditions: [{ input: "", operator: "==", value: "" }] }, idx);
  indGroupsContainer.appendChild(card);
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
  indGroupsContainer.innerHTML = "";
  indDefaultLabel.value = "";
  const defColorBtn = document.getElementById("ind-default-color");
  defColorBtn.dataset.color = "#9ca3af";
  defColorBtn.style.background = "#9ca3af";
  document.getElementById("ind-default-color-hidden").value = "#9ca3af";
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
  indDefaultLabel.value = ind.default_label || "";
  const defColor = ind.default_color || "#9ca3af";
  const defColorBtn = document.getElementById("ind-default-color");
  defColorBtn.dataset.color = defColor;
  defColorBtn.style.background = defColor;
  document.getElementById("ind-default-color-hidden").value = defColor;
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
    const outputColor = card.querySelector(".group-output-color-hidden").value;
    const outputScore = parseFloat(card.querySelector(".group-output-score").value) || 0;
    const conditions = [];
    card.querySelectorAll(".ind-condition-row").forEach((row) => {
      conditions.push({
        input: row.querySelector(".condition-input").value.trim(),
        operator: row.querySelector(".condition-operator").value,
        value: row.querySelector(".condition-value").value,
      });
    });
    groups.push({ output_label: outputLabel, output_color: outputColor, output_score: outputScore, conditions });
  });

  return {
    name: indNameInput.value.trim(),
    class_id: indClassSelect.value || null,
    default_label: indDefaultLabel.value.trim(),
    default_color: document.getElementById("ind-default-color-hidden").value,
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
    body: { url, item_prefix: srcPrefixInput.value.trim() },
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
const aasOvTotalCount = document.getElementById("aas-ov-total-count");
const aasOvGeoCount = document.getElementById("aas-ov-geo-count");
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
  // Badge stats
  if (aasOvTotalCount) aasOvTotalCount.textContent = aasOverviewData.length;
  if (aasOvGeoCount) aasOvGeoCount.textContent = aasOverviewData.filter(e => e.geocoded_status === "ok").length;

  for (const entry of pageItems) {
    const tr = document.createElement("tr");
    tr.className = "aas-ov-row";
    tr.dataset.sourceId = entry.source_id;
    tr.dataset.aasId = entry.aas_id;
    const idDisplay = entry.aas_id.length > 60 ? entry.aas_id.slice(0, 60) + "\u2026" : entry.aas_id;
    const grpDisplay = entry.group_name ? escapeHtml(entry.group_name) : "\u2014";
    const impDisplay = entry.imported_at || "\u2014";
    const importSvg = entry.imported_at
      ? `<svg class="aas-ov-status-ok" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
      : `<svg class="aas-ov-status-no" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    const importBtn = `<button class="aas-ov-import-btn" data-import-aas="${escapeHtml(entry.aas_id)}" title="Import">${importSvg}</button>`;
    const viewBtn = entry.imported_at
      ? `<button class="aas-ov-view-btn" data-view-aas="${escapeHtml(entry.aas_id)}" title="${t("aasOvView")}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>`
      : "";
    const geoSvg = entry.geocoded_status === "ok"
      ? `<svg class="aas-ov-status-ok" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
      : `<svg class="aas-ov-status-no" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    const geoBtn = `<button class="aas-ov-geo-btn" data-geo-aas="${escapeHtml(entry.aas_id)}" title="Geocoding">${geoSvg}</button>`;
    const processSvg = entry.company_status === "ok"
      ? `<svg class="aas-ov-status-ok" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
      : `<svg class="aas-ov-status-no" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    const processBtn = `<button class="aas-ov-process-row-btn" data-process-aas="${escapeHtml(entry.aas_id)}" title="Process">${processSvg}</button>`;
    tr.innerHTML = `<td class="aas-ov-id-cell">${escapeHtml(idDisplay)}</td><td class="aas-ov-copy-cell"><button class="aas-ov-copy-btn" data-copy="${escapeHtml(entry.aas_id)}" title="Copy AAS ID"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></td><td>${escapeHtml(entry.source_name)}</td><td>${grpDisplay}</td><td>${impDisplay}</td><td class="aas-ov-status-cell">${importBtn}</td><td class="aas-ov-geo-cell">${geoBtn}</td><td class="aas-ov-status-cell">${processBtn}</td><td class="aas-ov-view-cell">${viewBtn}</td>`;
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

// ── Single-AAS Geocoding ────────────────────────────────────
function openGeoSingleModal(aasId) {
  geoSinglePendingAasId = aasId;
  document.getElementById("geo-single-title").textContent = t("geoSingleTitle");
  document.getElementById("geo-single-desc").textContent = t("geoSingleDesc");
  document.getElementById("geo-single-aas-id").textContent = aasId;
  geoSingleCancelBtn.textContent = t("geoSingleCancel");
  geoSingleOkLabel.textContent = t("geoSingleStart");
  geoSingleOkBtn.disabled = false;
  geoSingleModal.showModal();
}

geoSingleCancelBtn.addEventListener("click", () => geoSingleModal.close());
geoSingleModal.addEventListener("click", (e) => { if (e.target === geoSingleModal) geoSingleModal.close(); });

geoSingleOkBtn.addEventListener("click", async () => {
  if (!geoSinglePendingAasId) return;
  geoSingleOkBtn.disabled = true;
  geoSingleOkLabel.textContent = "\u2026";

  const res = await apiRequest("/apps/resilience/api/geocoding/run-single", {
    method: "POST",
    body: { aas_id: geoSinglePendingAasId },
  });

  geoSingleModal.close();

  if (res.ok) {
    const status = res.payload.geocoded_status;
    const btn = aasOvTbody.querySelector(`[data-geo-aas="${CSS.escape(geoSinglePendingAasId)}"]`);
    if (btn) {
      btn.innerHTML = status === "ok"
        ? `<svg class="aas-ov-status-ok" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
        : `<svg class="aas-ov-status-no" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    }
    const entry = aasOverviewData.find(e => e.aas_id === geoSinglePendingAasId);
    if (entry) { entry.geocoded_status = status; entry.imported_at = entry.imported_at || new Date().toISOString().replace("T", " ").slice(0, 19); }
    showGdacsCountryHint(status === "ok" ? t("geoSingleSuccess") : t("geoSingleError"), status === "ok" ? "success" : "error");
  } else if (res.payload?.error === "NO_GEOCODING_PATHS") {
    showGdacsCountryHint(t("geoSingleNoPaths"), "error");
  }

  geoSinglePendingAasId = null;
});

// ── Single-AAS Import (without geocoding) ───────────────────
function openImportSingleModal(aasId) {
  importSinglePendingAasId = aasId;
  document.getElementById("import-single-title").textContent = t("importSingleTitle");
  document.getElementById("import-single-desc").textContent = t("importSingleDesc");
  document.getElementById("import-single-aas-id").textContent = aasId;
  importSingleCancelBtn.textContent = t("importSingleCancel");
  importSingleOkLabel.textContent = t("importSingleStart");
  importSingleOkBtn.disabled = false;
  importSingleModal.showModal();
}

importSingleCancelBtn.addEventListener("click", () => importSingleModal.close());
importSingleModal.addEventListener("click", (e) => { if (e.target === importSingleModal) importSingleModal.close(); });

importSingleOkBtn.addEventListener("click", async () => {
  if (!importSinglePendingAasId) return;
  importSingleOkBtn.disabled = true;
  importSingleOkLabel.textContent = "\u2026";

  const res = await apiRequest("/apps/resilience/api/aas/import-single", {
    method: "POST",
    body: { aas_id: importSinglePendingAasId },
  });

  importSingleModal.close();

  if (res.ok) {
    // Import-Button → grüner Haken
    const impBtn = aasOvTbody.querySelector(`[data-import-aas="${CSS.escape(importSinglePendingAasId)}"]`);
    if (impBtn) {
      impBtn.innerHTML = `<svg class="aas-ov-status-ok" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    }
    // Geo-Button → rotes X (Geodaten gelöscht)
    const geoBtn = aasOvTbody.querySelector(`[data-geo-aas="${CSS.escape(importSinglePendingAasId)}"]`);
    if (geoBtn) {
      geoBtn.innerHTML = `<svg class="aas-ov-status-no" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    }
    // Datum aktualisieren
    const row = impBtn?.closest("tr");
    if (row) {
      const dateTd = row.querySelectorAll("td")[4];
      if (dateTd) dateTd.textContent = res.payload.imported_at;
    }
    // Lokale Daten aktualisieren
    const entry = aasOverviewData.find(e => e.aas_id === importSinglePendingAasId);
    if (entry) {
      entry.imported_at = res.payload.imported_at;
      entry.geocoded_status = "";
    }
    // View-Button anzeigen (falls noch nicht vorhanden)
    if (row) {
      const viewCell = row.querySelector(".aas-ov-view-cell");
      if (viewCell && !viewCell.querySelector("button")) {
        viewCell.innerHTML = `<button class="aas-ov-view-btn" data-view-aas="${escapeHtml(importSinglePendingAasId)}" title="${t("aasOvView")}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>`;
      }
    }
    showGdacsCountryHint(t("importSingleSuccess"), "success");
  } else {
    showGdacsCountryHint(t("importSingleError"), "error");
  }

  importSinglePendingAasId = null;
});

// ── World Map Modal ──────────────────────────────────────────
dashAasMapBtn.addEventListener("click", () => openMapModal());
mapCloseBtn.addEventListener("click", () => mapModal.close());
mapModal.addEventListener("click", (e) => { if (e.target === mapModal) mapModal.close(); });

async function openMapModal() {
  document.getElementById("map-modal-title").textContent = t("mapTitle");
  mapFilterLabel.textContent = mapMatchesOnly ? t("mapFilterAll") : t("mapFilterMatches");
  mapFilterBtn.classList.toggle("active", mapMatchesOnly);
  mapDistBtn.style.display = mapMatchesOnly ? "" : "none";
  mapModal.showModal();

  if (!mapInstance) {
    mapInstance = L.map("map-container", { zoomControl: true, scrollWheelZoom: true })
      .setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 18,
    }).addTo(mapInstance);
  }

  setTimeout(() => mapInstance.invalidateSize(), 100);
  await loadMapData();
}

mapFilterBtn.addEventListener("click", () => {
  mapMatchesOnly = !mapMatchesOnly;
  mapFilterLabel.textContent = mapMatchesOnly ? t("mapFilterAll") : t("mapFilterMatches");
  mapFilterBtn.classList.toggle("active", mapMatchesOnly);
  mapDistBtn.style.display = mapMatchesOnly ? "" : "none";
  if (mapCachedData) renderMapLayers(mapCachedData);
});

mapDistBtn.addEventListener("click", () => {
  mapShowDist = !mapShowDist;
  mapDistBtn.classList.toggle("active", mapShowDist);
  if (mapCachedData) renderMapLayers(mapCachedData);
});

async function loadMapData() {
  const res = await apiRequest("/apps/resilience/api/gdacs/map-data");
  if (!res.ok || !res.payload) return;
  mapCachedData = res.payload;
  renderMapLayers(mapCachedData);
}

function renderMapLayers(data) {
  mapInstance.eachLayer(l => { if (!(l instanceof L.TileLayer)) mapInstance.removeLayer(l); });

  const { alerts, aas, matches, columns } = data;

  const matchByAas = {};
  for (const m of matches) (matchByAas[m.aas_id] ||= []).push(m);

  // Set of alert_ids that have matches (for filter mode)
  const matchedAlertIds = new Set(matches.map(m => m.alert_id));
  const matchedAasIds = new Set(matches.map(m => m.aas_id));

  const alertById = {};
  for (const a of alerts) alertById[a.alert_id] = a;

  // Which alerts/aas to show?
  const visAlerts = mapMatchesOnly ? alerts.filter(a => matchedAlertIds.has(a.alert_id)) : alerts;
  const visAas = mapMatchesOnly ? aas.filter(l => matchedAasIds.has(l.aas_id)) : aas;

  // Update header stats
  document.getElementById("map-stat-alerts-count").textContent = visAlerts.length;
  document.getElementById("map-stat-aas-count").textContent = visAas.length;

  // ── Polygons first (non-interactive, drawn below markers) ──
  const POLY_COLOR = "#059669";
  for (const alert of visAlerts) {
    if (!alert.polygons?.length) continue;
    for (const geom of alert.polygons) {
      L.geoJSON({ type: "Feature", geometry: { type: geom.type, coordinates: geom.coordinates } }, {
        style: { color: POLY_COLOR, weight: 2, fillColor: POLY_COLOR, fillOpacity: 0.12 },
        interactive: false,
      }).addTo(mapInstance);
    }
  }

  // ── Disaster dots (red) ──
  const ALERT_COLOR = "#dc2626";
  for (const alert of visAlerts) {
    if (alert.centroid_lat == null || alert.centroid_lon == null) continue;
    const tip = `<b>${escapeHtml(alert.name)}</b><br>${alert.eventtype} \u00b7 ${alert.alertlevel}<br>${escapeHtml(alert.country_name)}`;
    L.circleMarker([alert.centroid_lat, alert.centroid_lon], {
      radius: 7, color: ALERT_COLOR, fillColor: ALERT_COLOR, fillOpacity: 0.8, weight: 2,
    }).bindTooltip(tip, { direction: "top", offset: [0, -8] }).addTo(mapInstance);
  }

  // ── Suppliers (AAS): group by coordinates, show count ──
  const AAS_COLOR = "#4f46e5";
  const coordGroups = {};
  for (const loc of visAas) {
    const key = `${loc.direct_lat},${loc.direct_lon}`;
    (coordGroups[key] ||= []).push(loc);
  }

  for (const key of Object.keys(coordGroups)) {
    const group = coordGroups[key];
    const [lat, lon] = key.split(",").map(Number);
    const count = group.length;

    // Build tooltip for all entities at this location
    const tipParts = [];
    for (const loc of group) {
      const aasMatches = matchByAas[loc.aas_id] || [];
      let part = `<b>${escapeHtml(loc.aas_id)}</b>`;
      if (columns?.length && loc.columns_data) {
        for (const col of columns) {
          const path = typeof col === "string" ? col : col.path;
          const label = typeof col === "string" ? col.split("/").pop() : (col.label || col.path.split("/").pop());
          const val = loc.columns_data[path];
          if (val) part += `<br>${escapeHtml(label)}: ${escapeHtml(String(val))}`;
        }
      }
      if (loc.city_value || loc.country_value) {
        part += `<br>${escapeHtml(loc.city_value || "")}${loc.city_value && loc.country_value ? ", " : ""}${escapeHtml(loc.country_value || "")}`;
      }
      if (aasMatches.length) {
        part += `<br><b>${t("mapPopupAlerts")}:</b>`;
        for (const m of aasMatches) {
          const al = alertById[m.alert_id];
          if (!al) continue;
          part += `<br>\u00b7 ${escapeHtml(al.name)} (${m.match_tier}`;
          if (m.distance_km != null) part += `, ${m.distance_km} km`;
          part += `)`;
        }
      }
      tipParts.push(part);
    }
    const tip = tipParts.join(`<hr style="margin:4px 0;border:0;border-top:1px solid #dde4ed">`);

    // Marker: divIcon with count if >1, else circleMarker
    if (count > 1) {
      L.marker([lat, lon], {
        icon: L.divIcon({
          className: "map-aas-cluster",
          html: `${count}`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        }),
      }).bindTooltip(tip, { direction: "top", offset: [0, -12], maxWidth: 360 }).addTo(mapInstance);
    } else {
      L.circleMarker([lat, lon], {
        radius: 7, color: AAS_COLOR, fillColor: AAS_COLOR, fillOpacity: 0.85, weight: 2,
      }).bindTooltip(tip, { direction: "top", offset: [0, -8], maxWidth: 360 }).addTo(mapInstance);
    }

    // ── Distance lines with km label (only in matches-only mode) ──
    if (mapMatchesOnly && mapShowDist) {
      for (const loc of group) {
        const aasMatches = matchByAas[loc.aas_id] || [];
        for (const m of aasMatches) {
          if (m.match_tier !== "distance") continue;
          const al = alertById[m.alert_id];
          if (!al || al.centroid_lat == null) continue;
          L.polyline(
            [[lat, lon], [al.centroid_lat, al.centroid_lon]],
            { color: "#d97706", weight: 1.5, opacity: 0.6, dashArray: "6 4" }
          ).addTo(mapInstance);
          if (m.distance_km != null) {
            const midLat = (lat + al.centroid_lat) / 2;
            const midLon = (lon + al.centroid_lon) / 2;
            L.marker([midLat, midLon], {
              icon: L.divIcon({
                className: "map-dist-label",
                html: `${Math.round(m.distance_km)} km`,
                iconSize: [60, 16],
                iconAnchor: [30, 8],
              }),
              interactive: false,
            }).addTo(mapInstance);
          }
        }
      }
    }
  }

  // Auto-zoom
  const allPoints = [
    ...visAlerts.filter(a => a.centroid_lat != null).map(a => [a.centroid_lat, a.centroid_lon]),
    ...visAas.map(l => [l.direct_lat, l.direct_lon]),
  ];
  if (allPoints.length) mapInstance.fitBounds(L.latLngBounds(allPoints).pad(0.1));
}

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

// ── Geocoding polling ─────────────────────────────────────────────
let geocodingPollTimer = null;

function startGeocodingPolling() {
  if (geocodingPollTimer) return;
  globalImportStatus.hidden = false;
  globalImportStatus.className = "global-import-status";
  globalImportBar.style.width = "0%";
  globalImportText.textContent = "Geocoding: 0 / 0";

  geocodingPollTimer = setInterval(async () => {
    const result = await apiRequest("/apps/resilience/api/geocoding/status");
    if (!result.ok || !result.payload) return;
    const { running, total, done, errors } = result.payload;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    globalImportBar.style.width = pct + "%";
    globalImportText.textContent = `Geocoding: ${done} / ${total}`;

    if (!running) {
      clearInterval(geocodingPollTimer);
      geocodingPollTimer = null;
      if (errors > 0) {
        globalImportStatus.className = "global-import-status error";
        globalImportText.textContent = `${t("geocodingDone")} — ${errors} ${t("geocodingErrors")}`;
      } else {
        globalImportStatus.className = "global-import-status done";
        globalImportText.textContent = t("geocodingDone");
      }
      if (activePage === "aas-data" && activeAasNav === "overview") loadAasOverview();
      setTimeout(() => { globalImportStatus.hidden = true; }, 4000);
    }
  }, 2000);
}

// Check if geocoding is running on page load (survives F5)
(async () => {
  const result = await apiRequest("/apps/resilience/api/geocoding/status");
  if (result.ok && result.payload?.running) startGeocodingPolling();
})();

// ── Company Process polling ──────────────────────────────────────
let companyPollTimer = null;

function startCompanyProcessPolling() {
  if (companyPollTimer) return;
  globalImportStatus.hidden = false;
  globalImportStatus.className = "global-import-status";
  globalImportBar.style.width = "0%";
  globalImportText.textContent = "Enrichment — " + t("companyProcessStart") + "…";

  companyPollTimer = setInterval(async () => {
    const result = await apiRequest("/apps/resilience/api/company-process/status");
    if (!result.ok || !result.payload) return;
    const { running, total, done, errors, phase, batchDone, batchTotal, aliasesSoFar } = result.payload;

    if (phase === "extract") {
      globalImportBar.style.width = "5%";
      globalImportText.textContent = `Enrichment — ${t("companyProcessDesc")}…`;
    } else if (phase === "ai" && batchTotal > 0) {
      const pct = Math.round((batchDone / batchTotal) * 90) + 5; // 5-95%
      globalImportBar.style.width = pct + "%";
      globalImportText.textContent = `Enrichment — AI Aliases: ${batchDone} / ${batchTotal} Batches (${aliasesSoFar} ${t("aasOvCount")})`;
    } else if (phase === "save") {
      const pct = Math.round((done / total) * 5) + 95; // 95-100%
      globalImportBar.style.width = pct + "%";
      globalImportText.textContent = `Enrichment — ${done} / ${total}`;
    }

    if (!running) {
      clearInterval(companyPollTimer);
      companyPollTimer = null;
      globalImportBar.style.width = "100%";
      if (errors > 0) {
        globalImportStatus.className = "global-import-status error";
        globalImportText.textContent = `${t("companyProcessSuccess")} — ${errors} ${t("geocodingErrors")}`;
      } else {
        globalImportStatus.className = "global-import-status done";
        globalImportText.textContent = t("companyProcessSuccess");
      }
      if (activePage === "aas-data" && activeAasNav === "overview") loadAasOverview();
      setTimeout(() => { globalImportStatus.hidden = true; }, 4000);
    }
  }, 2000);
}

// Check if company process is running on page load
(async () => {
  const result = await apiRequest("/apps/resilience/api/company-process/status");
  if (result.ok && result.payload?.running) startCompanyProcessPolling();
})();

// Overview table click handler (copy, view, import, geo, AAS ID cell)
aasOvTbody.addEventListener("click", (e) => {
  // Import button
  const impBtn = e.target.closest(".aas-ov-import-btn");
  if (impBtn) {
    const aasId = impBtn.dataset.importAas;
    if (aasId) openImportSingleModal(aasId);
    return;
  }
  // Geocoding button → open wizard in geo-single mode
  const geoBtn = e.target.closest(".aas-ov-geo-btn");
  if (geoBtn) {
    const aasId = geoBtn.dataset.geoAas;
    if (aasId) openAasCmModal("geo-single", aasId);
    return;
  }
  // Company process button → open wizard in company-single mode
  const procBtn = e.target.closest(".aas-ov-process-row-btn");
  if (procBtn) {
    const aasId = procBtn.dataset.processAas;
    if (aasId) openAasCmModal("company-single", aasId);
    return;
  }
  // View imported data (eye icon)
  const viewBtn = e.target.closest(".aas-ov-view-btn");
  if (viewBtn) {
    loadImportedAas(viewBtn.dataset.viewAas);
    return;
  }
  // Copy AAS ID
  const copyBtn = e.target.closest(".aas-ov-copy-btn");
  if (copyBtn) {
    navigator.clipboard.writeText(copyBtn.dataset.copy).then(() => {
      copyBtn.classList.add("copied");
      setTimeout(() => copyBtn.classList.remove("copied"), 1200);
    });
    return;
  }
  // Click on AAS ID cell → load shell + submodels live
  const idCell = e.target.closest(".aas-ov-id-cell");
  if (idCell) {
    const tr = idCell.closest("tr.aas-ov-row");
    if (tr) loadAasShell(tr.dataset.sourceId, tr.dataset.aasId);
    return;
  }
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
  dashAasPage = 0;
  dashIndPage = 0;
  dashIndSortBy = "";
  dashIndSortDir = "asc";
  const dashNewsBody = document.getElementById("dash-news-body");
  const dashAlertsBody = document.getElementById("dash-alerts-body");

  const matchFilter = cachedDashMatchFilter.join(",");
  const [newsResult, alertsResult, aasOverviewResult, indEvalResult, scoreResult] = await Promise.all([
    apiRequest("/apps/resilience/api/news?limit=8"),
    apiRequest("/apps/resilience/api/gdacs/alerts?limit=8"),
    apiRequest(`/apps/resilience/api/gdacs/aas-overview?match_filter=${encodeURIComponent(matchFilter)}`),
    apiRequest("/apps/resilience/api/indicators/dashboard-evaluate"),
    apiRequest("/apps/resilience/api/score/dashboard-evaluate"),
  ]);

  // News tile
  if (newsResult.ok && newsResult.payload?.items?.length > 0) {
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
  if (alertsResult.ok && alertsResult.payload?.items?.length > 0) {
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

  // Score tile
  renderDashScore(scoreResult);

  // AAS Country Overview tile
  const dashAasBody = document.getElementById("dash-aas-body");
  const dashAasFooter = document.getElementById("dash-aas-footer");
  if (aasOverviewResult.ok && aasOverviewResult.payload && aasOverviewResult.payload.total > 0) {
    const { items, total, columns } = aasOverviewResult.payload;
    dashAasColumns = columns || [];
    for (const it of items) dashAasCache.set(it.aas_id, it);
    renderDashAasRows(items, dashAasColumns);
    // Pagination
    const pages = Math.ceil(total / 20);
    if (pages > 1) {
      dashAasFooter.hidden = false;
      document.getElementById("dash-aas-page-info").textContent = t("dashAasPage").replace("{page}", String(dashAasPage + 1)).replace("{pages}", String(pages));
      document.getElementById("dash-aas-prev").disabled = dashAasPage <= 0;
      document.getElementById("dash-aas-next").disabled = dashAasPage >= pages - 1;
    } else {
      dashAasFooter.hidden = true;
    }
  } else {
    dashAasBody.innerHTML = `<div class="dash-card-empty">${t("dashAasEmpty")}</div>`;
    dashAasFooter.hidden = true;
  }

  // Indicator Dashboard tile
  renderDashIndicators(indEvalResult);

  // Value tiles
  await loadVtTiles();
}

function renderDashScore(result) {
  const body = document.getElementById("dash-score-body");
  const titleEl = document.getElementById("dash-score-title");
  const items = result.ok ? result.payload?.items : [];
  const title = result.ok ? result.payload?.title : null;
  if (title) titleEl.textContent = title;
  else titleEl.textContent = t("dashScoreTitle");
  if (!items || !items.length) {
    body.innerHTML = `<div class="dash-card-empty">${t("dashScoreEmpty")}</div>`;
    return;
  }
  const maxTarget = Math.max(...items.map(it => it.target || 0), 1);
  let html = `<div class="score-bar-list">`;
  for (const it of items) {
    const pct = Math.min((it.target / maxTarget) * 100, 100);
    const showInside = pct >= 20;
    html += `<div class="score-bar-row">`;
    html += `<span class="score-bar-label" title="${escapeHtml(it.label)}">${escapeHtml(it.label)}</span>`;
    html += `<div class="score-bar-track">`;
    html += `<div class="score-bar-fill" style="width:${pct}%">`;
    if (showInside) html += `<span class="score-bar-value">${it.target}</span>`;
    html += `</div>`;
    html += `</div>`;
    if (!showInside) html += `<span class="score-bar-value-outside">${it.target}</span>`;
    html += `</div>`;
  }
  html += `</div>`;
  body.innerHTML = html;
}

let dashIndPage = 0;
let dashIndColumns = [];
let dashIndSortBy = "";
let dashIndSortDir = "asc";

function renderDashIndicators(result) {
  const body = document.getElementById("dash-indicators-body");
  const footer = document.getElementById("dash-ind-footer");
  if (!result.ok || !result.payload?.items?.length) {
    body.innerHTML = `<div class="dash-card-empty" id="dash-indicators-empty">${t("indDashNoConfig")}</div>`;
    footer.hidden = true;
    return;
  }
  const { items, indicator_names, columns, total } = result.payload;
  dashIndColumns = columns || [];
  const cols = dashIndColumns;
  const ids = indicator_names.map(n => n.indicator_id);

  // Helper for sortable header
  const sortTh = (sortKey, label, title) => {
    const active = dashIndSortBy === sortKey;
    const arrow = active ? (dashIndSortDir === "asc" ? " \u25B2" : " \u25BC") : "";
    const cls = `dash-ind-sortable${active ? " dash-ind-sort-active" : ""}`;
    return `<th class="${cls}" data-sort-col="${escapeHtml(sortKey)}" title="${escapeHtml(title || label)}" style="cursor:pointer">${escapeHtml(label)}${arrow}</th>`;
  };

  let html = `<div class="dash-ind-table-wrap"><table class="dash-ind-table"><thead><tr>`;
  // Column headers: custom columns or AAS ID
  if (cols.length) {
    for (const c of cols) {
      const p = typeof c === "string" ? c : c.path;
      const label = p.includes(".") ? p.split(".").pop() : p;
      html += sortTh(p, label, p);
    }
  } else {
    html += sortTh("_aas", "AAS", "AAS ID");
  }
  for (const n of indicator_names) html += sortTh(n.indicator_id, n.name, n.name);
  html += `</tr></thead><tbody>`;
  for (const item of items) {
    html += `<tr class="dash-ind-row" data-aas-id="${escapeHtml(item.aas_id)}">`;
    if (cols.length) {
      for (const c of cols) {
        const p = typeof c === "string" ? c : c.path;
        const val = (item.columns_data && item.columns_data[p]) || "";
        html += `<td title="${escapeHtml(p)}: ${escapeHtml(val)}" style="font-weight:500;white-space:nowrap">${escapeHtml(val) || "\u2014"}</td>`;
      }
    } else {
      html += `<td style="font-weight:500;white-space:nowrap">${escapeHtml(item.aas_id)}</td>`;
    }
    for (const id of ids) {
      const r = item.results?.[id];
      if (r) {
        const bg = r.color + "18";
        html += `<td><span class="dash-ind-cell" style="background:${bg}"><span class="dash-ind-dot" style="background:${escapeHtml(r.color)}"></span>${escapeHtml(r.label || "–")}</span></td>`;
      } else {
        html += `<td>–</td>`;
      }
    }
    html += `</tr>`;
  }
  html += `</tbody></table></div>`;
  body.innerHTML = html;

  // Pagination
  const pages = Math.ceil((total || items.length) / 20);
  if (pages > 1) {
    footer.hidden = false;
    document.getElementById("dash-ind-page-info").textContent = t("indDashPage").replace("{page}", String(dashIndPage + 1)).replace("{pages}", String(pages));
    document.getElementById("dash-ind-prev").disabled = dashIndPage <= 0;
    document.getElementById("dash-ind-next").disabled = dashIndPage >= pages - 1;
  } else {
    footer.hidden = true;
  }
}

async function loadDashIndPage(page) {
  dashIndPage = page;
  let url = `/apps/resilience/api/indicators/dashboard-evaluate?limit=20&offset=${page * 20}`;
  if (dashIndSortBy) url += `&sort=${encodeURIComponent(dashIndSortBy)}&sort_dir=${dashIndSortDir}`;
  const res = await apiRequest(url);
  renderDashIndicators(res);
}

document.getElementById("dash-ind-prev").addEventListener("click", () => { if (dashIndPage > 0) loadDashIndPage(dashIndPage - 1); });
document.getElementById("dash-ind-next").addEventListener("click", () => loadDashIndPage(dashIndPage + 1));

// Sort + row click handler (delegated on table)
document.getElementById("dash-indicators-body").addEventListener("click", (e) => {
  const th = e.target.closest(".dash-ind-sortable");
  if (th) {
    const col = th.dataset.sortCol;
    if (dashIndSortBy === col) {
      dashIndSortDir = dashIndSortDir === "asc" ? "desc" : "asc";
    } else {
      dashIndSortBy = col;
      dashIndSortDir = "asc";
    }
    dashIndPage = 0;
    loadDashIndPage(0);
    return;
  }
  const row = e.target.closest(".dash-ind-row");
  if (row && row.dataset.aasId) openIndDetailModal(row.dataset.aasId);
});

// ── Indicator Detail Modal ─────────────────────────────────
const indDetailModal = document.getElementById("ind-detail-modal");
document.getElementById("ind-detail-close").addEventListener("click", () => indDetailModal.close());
indDetailModal.addEventListener("click", (e) => { if (e.target === indDetailModal) indDetailModal.close(); });

async function openIndDetailModal(aasId) {
  const body = document.getElementById("ind-detail-body");
  body.innerHTML = `<div class="cd-loading" style="padding:3rem;text-align:center"><div class="cd-loading-spinner"></div></div>`;
  document.getElementById("ind-detail-title").textContent = t("indDetailTitle");
  document.getElementById("ind-detail-aas-id").textContent = aasId;
  indDetailModal.showModal();

  const res = await apiRequest(`/apps/resilience/api/indicators/dashboard-detail/${encodeURIComponent(aasId)}`);
  if (!res.ok || !res.payload) {
    body.innerHTML = `<div style="color:var(--muted);padding:2rem;text-align:center">Error</div>`;
    return;
  }
  const data = res.payload;
  let html = "";

  // 1. Columns (small boxes at top)
  const colEntries = Object.entries(data.columns_data || {}).filter(([, v]) => v);
  if (colEntries.length > 0) {
    html += `<div class="cd-section"><h4 class="cd-section-title">${escapeHtml(t("indDetailColumns"))}</h4><div class="ind-detail-cols">`;
    for (const [path, value] of colEntries) {
      const label = path.includes(".") ? path.split(".").pop() : path;
      html += `<div class="ind-detail-col-item"><span class="ind-detail-col-label">${escapeHtml(label)}</span><span class="ind-detail-col-value">${escapeHtml(String(value))}</span></div>`;
    }
    html += `</div></div>`;
  }

  // 2. Group indicators by class
  const byClass = new Map();
  for (const ind of data.indicators) {
    const cls = ind.class_name || "";
    if (!byClass.has(cls)) byClass.set(cls, []);
    byClass.get(cls).push(ind);
  }

  // 3. Render per class
  for (const [className, indicators] of byClass) {
    const totalScore = indicators.reduce((s, ind) => s + (Number(ind.result.score) || 0), 0);
    const avgScore = indicators.length ? (totalScore / indicators.length) : 0;
    html += `<div class="ind-detail-class-section">`;
    html += `<h4 class="ind-detail-class-title">`;
    html += `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    html += `${escapeHtml(className || t("indDetailNoClass"))} <span class="cd-badge">${indicators.length}</span>`;
    html += `<span class="ind-detail-class-score">${t("indDetailClassScore").replace("{score}", avgScore % 1 === 0 ? avgScore : avgScore.toFixed(1))}</span>`;
    html += `</h4>`;
    html += `<div class="ind-detail-list">`;
    for (const ind of indicators) {
      const r = ind.result;
      const bg = r.color + "18";
      html += `<div class="ind-detail-row">`;
      html += `<span class="ind-detail-card-dot" style="background:${escapeHtml(r.color)}"></span>`;
      html += `<span class="ind-detail-card-name">${escapeHtml(ind.name)}</span>`;
      html += `<span class="ind-detail-card-badge" style="background:${bg};color:${escapeHtml(r.color)}">${escapeHtml(r.label || "–")}</span>`;
      html += `<span class="ind-detail-card-score">${t("indDetailScore").replace("{score}", r.score ?? 0)}</span>`;
      html += `</div>`;
    }
    html += `</div></div>`;
  }

  body.innerHTML = html;
}

let dashAasPage = 0;
let dashAasColumns = [];
let dashAasSortBy = "";
let dashAasSortDir = "asc";
const dashAasCache = new Map();

function renderDashAasRows(items, columns) {
  const body = document.getElementById("dash-aas-body");
  const cols = columns || [];
  const showAasId = !cols.length;
  // Header row with sortable columns
  let colHeaders = "";
  if (showAasId) {
    colHeaders = `<span class="dash-aas-col-header">AAS ID</span>`;
  } else {
    colHeaders = cols.map(c => {
      const p = typeof c === "string" ? c : c.path;
      const label = p.includes(".") ? p.split(".").pop() : p;
      const active = dashAasSortBy === p;
      const arrow = active ? (dashAasSortDir === "asc" ? " \u25B2" : " \u25BC") : "";
      return `<span class="dash-aas-col-header dash-aas-sortable${active ? " dash-aas-sort-active" : ""}" data-sort-col="${escapeHtml(p)}" title="${escapeHtml(p)}">${escapeHtml(label)}${arrow}</span>`;
    }).join("");
  }
  const headerHtml = `<div class="dash-aas-row dash-aas-header">${colHeaders}<span class="dash-aas-alerts">Alerts</span></div>`;
  // Data rows
  const rowsHtml = items.map((row) => {
    let colCells = "";
    if (showAasId) {
      const shortId = row.aas_id.length > 40 ? "\u2026" + row.aas_id.slice(-36) : row.aas_id;
      colCells = `<span class="dash-aas-col-cell" title="${escapeHtml(row.aas_id)}">${escapeHtml(shortId)}</span>`;
    } else {
      colCells = cols.map(c => {
        const p = typeof c === "string" ? c : c.path;
        const val = (row.columns_data && row.columns_data[p]) || "";
        return `<span class="dash-aas-col-cell" title="${escapeHtml(p)}: ${escapeHtml(val)}">${escapeHtml(val) || "\u2014"}</span>`;
      }).join("");
    }
    const alertsHtml = row.alerts.map((a) => {
      const icon = GDACS_TYPE_ICONS[a.eventtype] || "";
      const ac = a.alertlevel === "Red" ? "alert-red" : a.alertlevel === "Orange" ? "alert-orange" : "alert-green";
      const link = a.url ? ` href="${escapeHtml(a.url)}" target="_blank" rel="noopener"` : "";
      const mt = a.match_tier || "country";
      const matchCls = `match-${mt}`;
      let matchTip = t("matchCountry");
      if (mt === "polygon") matchTip = t("matchPolygon");
      else if (mt === "distance") matchTip = t("matchDistance").replace("{km}", a.distance_km != null ? Math.round(a.distance_km) : "?");
      return `<a class="dash-aas-alert-chip ${matchCls}" title="${escapeHtml(matchTip)}"${link}><span class="match-dot"></span>${icon}<span class="alert-badge ${ac}">${escapeHtml(a.alertlevel)}</span></a>`;
    }).join("");
    return `<div class="dash-aas-row" data-aas-id="${escapeHtml(row.aas_id)}">${colCells}<span class="dash-aas-alerts">${alertsHtml}</span></div>`;
  }).join("");
  body.innerHTML = headerHtml + rowsHtml;
}

// Sort + row click handler (delegated)
document.getElementById("dash-aas-body").addEventListener("click", (e) => {
  const hdr = e.target.closest(".dash-aas-sortable");
  if (hdr) {
    const col = hdr.dataset.sortCol;
    if (dashAasSortBy === col) {
      dashAasSortDir = dashAasSortDir === "asc" ? "desc" : "asc";
    } else {
      dashAasSortBy = col;
      dashAasSortDir = "asc";
    }
    dashAasPage = 0;
    loadDashAasPage(0);
    return;
  }
  if (e.target.closest(".dash-aas-alert-chip[href]")) return;
  const row = e.target.closest(".dash-aas-row:not(.dash-aas-header)");
  if (row && row.dataset.aasId) openCompanyDetailModal(row.dataset.aasId);
});

async function loadDashAasPage(page) {
  dashAasPage = page;
  const mf = cachedDashMatchFilter.join(",");
  let url = `/apps/resilience/api/gdacs/aas-overview?limit=20&offset=${page * 20}&match_filter=${encodeURIComponent(mf)}`;
  if (dashAasSortBy) url += `&sort=${encodeURIComponent(dashAasSortBy)}&sort_dir=${dashAasSortDir}`;
  const res = await apiRequest(url);
  if (!res.ok || !res.payload) return;
  const { items, total, columns } = res.payload;
  dashAasColumns = columns || dashAasColumns;
  for (const it of items) dashAasCache.set(it.aas_id, it);
  renderDashAasRows(items, dashAasColumns);
  const pages = Math.ceil(total / 20);
  const footer = document.getElementById("dash-aas-footer");
  footer.hidden = pages <= 1;
  document.getElementById("dash-aas-page-info").textContent = t("dashAasPage").replace("{page}", String(page + 1)).replace("{pages}", String(pages));
  document.getElementById("dash-aas-prev").disabled = page <= 0;
  document.getElementById("dash-aas-next").disabled = page >= pages - 1;
}

document.getElementById("dash-aas-prev").addEventListener("click", () => { if (dashAasPage > 0) loadDashAasPage(dashAasPage - 1); });
document.getElementById("dash-aas-next").addEventListener("click", () => loadDashAasPage(dashAasPage + 1));

// ── Company Detail Modal ────────────────────────────────────────
cdModalClose.addEventListener("click", () => companyDetailModal.close());
companyDetailModal.addEventListener("click", (e) => { if (e.target === companyDetailModal) companyDetailModal.close(); });
companyDetailModal.addEventListener("close", () => {
  if (cdMapInstance) { cdMapInstance.remove(); cdMapInstance = null; }
  cdAlertLayerGroup = null;
  Object.values(cdPages).forEach(p => p.innerHTML = "");
});

function switchCdPage(name) {
  cdActivePage = name;
  cdSidebar.querySelectorAll(".cd-sidebar-btn").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.cdTab === name));
  Object.entries(cdPages).forEach(([key, el]) => { el.hidden = key !== name; });
  if (name === "location" && cdMapInstance) setTimeout(() => cdMapInstance.invalidateSize(), 50);
  if (name === "alerts" && !cdNewsLoaded) { cdNewsLoaded = true; loadCompanyNews(); }
  if (name === "gdelt" && !cdGdeltLoaded) { cdGdeltLoaded = true; loadGdeltData(); }
  if (name === "worldbank" && !cdWorldbankLoaded) { cdWorldbankLoaded = true; loadWorldBankData(); }
  if (name === "inform" && !cdInformLoaded) { cdInformLoaded = true; loadInformData(); }
}

function updateCdTooltips() {
  document.getElementById("cd-tab-location-tip").textContent = t("cdTabLocation");
  document.getElementById("cd-tab-alerts-tip").textContent = t("cdTabAlerts");
  document.getElementById("cd-tab-gdelt-tip").textContent = t("cdTabGdelt");
  document.getElementById("cd-tab-worldbank-tip").textContent = t("cdTabWorldbank");
  document.getElementById("cd-tab-inform-tip").textContent = t("cdTabInform");
}

cdSidebar.addEventListener("click", (e) => {
  const btn = e.target.closest(".cd-sidebar-btn");
  if (btn) switchCdPage(btn.dataset.cdTab);
});

async function openCompanyDetailModal(aasId) {
  // Reset
  Object.values(cdPages).forEach(p => p.innerHTML = "");
  cdNewsLoaded = false;
  cdGdeltLoaded = false;
  cdWorldbankLoaded = false;
  cdInformLoaded = false;
  cdCurrentAasId = aasId;
  cdCompanyName = "";
  cdCompanyAlias = "";
  switchCdPage("location");
  updateCdTooltips();

  // Phase 1: render page 1 (location) with ALL cached content
  const cached = dashAasCache.get(aasId);
  document.getElementById("cd-modal-title").textContent = t("cdTitle");
  document.getElementById("cd-modal-aas-id").textContent = aasId;
  const geo = {
    country_value: cached?.country_value || "",
    iso_code: cached?.iso_code || "",
    city_value: cached?.city_value || "",
    lat: cached?.lat ?? null,
    lon: cached?.lon ?? null,
  };
  const alerts = cached?.alerts || [];

  // Page 1: all content
  let html = renderLocationTab(geo);
  html += renderAlertsTab(alerts);
  html += renderDataTab(cached?.columns_data || {});
  html += `<div id="cd-sm-area"><div class="cd-sm-loading"><div class="cd-loading-spinner"></div></div></div>`;
  cdPageLocation.innerHTML = html;

  companyDetailModal.showModal();

  // Init Leaflet map
  cdAlertsVisible = true;
  if (geo.lat !== null && geo.lon !== null) {
    setTimeout(() => {
      const mapEl = document.getElementById("cd-map-container");
      if (!mapEl) return;
      if (cdMapInstance) { cdMapInstance.remove(); cdMapInstance = null; }
      cdMapInstance = L.map("cd-map-container", { zoomControl: true, scrollWheelZoom: true, dragging: true })
        .setView([geo.lat, geo.lon], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 18,
      }).addTo(cdMapInstance);
      L.marker([geo.lat, geo.lon]).addTo(cdMapInstance);

      // Alert markers layer
      cdAlertLayerGroup = L.layerGroup().addTo(cdMapInstance);
      for (const a of alerts) {
        if (a.centroid_lat == null || a.centroid_lon == null) continue;
        const icon = GDACS_TYPE_ICONS[a.eventtype] || "";
        const color = a.alertlevel === "Red" ? "#dc2626" : a.alertlevel === "Orange" ? "#ea580c" : "#16a34a";
        L.circleMarker([a.centroid_lat, a.centroid_lon], {
          radius: 7, color, fillColor: color, fillOpacity: 0.7, weight: 2,
        }).bindTooltip(`${icon} ${a.name || ""} (${a.alertlevel})`, { direction: "top", offset: [0, -8] })
          .addTo(cdAlertLayerGroup);
        L.polyline([[geo.lat, geo.lon], [a.centroid_lat, a.centroid_lon]], {
          color: "#d97706", weight: 1.5, opacity: 0.5, dashArray: "6 4",
        }).addTo(cdAlertLayerGroup);
      }

      const toggleBtn = document.getElementById("cd-alerts-toggle");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          cdAlertsVisible = !cdAlertsVisible;
          if (cdAlertsVisible) cdMapInstance.addLayer(cdAlertLayerGroup);
          else cdMapInstance.removeLayer(cdAlertLayerGroup);
          toggleBtn.classList.toggle("cd-alerts-toggle-off", !cdAlertsVisible);
        });
      }

      setTimeout(() => cdMapInstance.invalidateSize(), 50);
    }, 100);
  }

  // Phase 2: lazy-load shell meta + submodels
  const smContainer = document.getElementById("cd-sm-area");
  const res = await apiRequest(`/apps/resilience/api/company-detail/${encodeURIComponent(aasId)}`);
  if (!res.ok || !res.payload) {
    if (smContainer) smContainer.innerHTML = "";
    const metaArea = document.getElementById("cd-aas-meta-area");
    if (metaArea) metaArea.innerHTML = "";
    return;
  }
  const d = res.payload;

  const metaArea = document.getElementById("cd-aas-meta-area");
  if (metaArea) metaArea.innerHTML = renderAasMetaCard(d.shell, aasId);

  // Extract Company name + alias from submodels
  const companySm = d.submodels?.find(sm => sm.idShort === "Company");
  cdCompanyName = companySm?.properties?.find(p => p.idShort === "Name")?.value || "";
  cdCompanyAlias = companySm?.properties?.find(p => p.idShort === "Alias")?.value || "";

  if (smContainer) smContainer.innerHTML = renderSubmodelCards(d.submodels);

  // Expand/collapse handlers
  cdPageLocation.querySelectorAll("[data-toggle='cd-sm']").forEach(hdr => {
    hdr.addEventListener("click", () => {
      const body = hdr.nextElementSibling;
      const open = !body.hidden;
      body.hidden = open;
      hdr.classList.toggle("cd-sm-open", !open);
    });
  });
}

async function loadCompanyNews() {
  cdPageAlerts.innerHTML = `<div class="cd-loading"><div class="cd-loading-spinner"></div></div>`;

  // Build query from Company submodel: name + aliases via OR
  if (!cdCompanyName) {
    cdPageAlerts.innerHTML = `<div style="color:var(--muted);padding:2rem;text-align:center">${escapeHtml(t("cdNewsNoCompany"))}</div>`;
    return;
  }
  const parts = [`"${cdCompanyName}"`];
  if (cdCompanyAlias) {
    for (const a of cdCompanyAlias.split(",")) {
      const trimmed = a.trim();
      if (trimmed && trimmed.toLowerCase() !== cdCompanyName.toLowerCase()) parts.push(`"${trimmed}"`);
    }
  }
  const query = parts.join(" OR ");

  const res = await apiRequest(`/apps/resilience/api/company-news?q=${encodeURIComponent(query)}`);
  if (!res.ok || !res.payload?.items) {
    cdPageAlerts.innerHTML = `<div class="cd-error" style="color:var(--muted);padding:2rem;text-align:center">${escapeHtml(t("cdNewsError"))}</div>`;
    return;
  }
  const items = res.payload.items;
  if (items.length === 0) {
    cdPageAlerts.innerHTML = `<div class="cd-error" style="color:var(--muted);padding:2rem;text-align:center">${escapeHtml(t("cdNewsEmpty"))}</div>`;
    return;
  }

  let html = `<div class="cd-source-badge"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/></svg><span>${escapeHtml(t("srcGoogleNews"))}</span></div>`;
  html += `<div class="cd-section">
    <h4 class="cd-section-title">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
      ${escapeHtml(t("cdNewsTitle"))} <span class="cd-badge">${items.length}</span>
    </h4>
    <div class="cd-news-list">`;
  for (const item of items) {
    const date = formatDateShort(item.pubDate);
    let source = item.source || "";
    let title = item.title || "";
    const sourceUrl = item.sourceUrl || "";
    const content = item.content || "";
    // Google News appends " - Source" to the title
    if (!source && title.includes(" - ")) {
      const idx = title.lastIndexOf(" - ");
      source = title.slice(idx + 3);
      title = title.slice(0, idx);
    } else if (source && title.endsWith(` - ${source}`)) {
      title = title.slice(0, -(` - ${source}`).length);
    }
    // Favicon from source domain
    const domain = sourceUrl ? new URL(sourceUrl).hostname.replace(/^www\./, "") : "";
    const faviconUrl = domain ? `https://www.google.com/s2/favicons?sz=32&domain=${encodeURIComponent(domain)}` : "";
    html += `<div class="cd-news-item" data-news-expanded="false">
      <div class="cd-news-item-header" onclick="this.parentElement.dataset.newsExpanded = this.parentElement.dataset.newsExpanded === 'true' ? 'false' : 'true'">
        ${faviconUrl ? `<img class="cd-news-favicon" src="${escapeHtml(faviconUrl)}" width="20" height="20" alt="" loading="lazy">` : `<div class="cd-news-favicon-placeholder"></div>`}
        <div class="cd-news-item-body">
          <span class="cd-news-item-title">${escapeHtml(title)}</span>
          <div class="cd-news-item-meta">
            ${source ? `<span class="cd-news-source">${escapeHtml(source)}</span>` : ""}
            <span class="cd-news-date">${escapeHtml(date)}</span>
          </div>
        </div>
        <svg class="cd-news-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="cd-news-detail">
        <p class="cd-news-content">${content ? escapeHtml(content) : `<em>${escapeHtml(t("cdNewsNoContent"))}</em>`}</p>
        <a class="cd-news-link" href="${escapeHtml(item.link)}" target="_blank" rel="noopener">
          ${domain ? escapeHtml(domain) : "Google News"}
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    </div>`;
  }
  html += `</div></div>`;
  cdPageAlerts.innerHTML = html;
}

async function loadGdeltData() {
  cdPageGdelt.innerHTML = `<div class="cd-loading"><div class="cd-loading-spinner"></div></div>`;

  if (!cdCompanyName) {
    cdPageGdelt.innerHTML = `<div style="color:var(--muted);padding:2rem;text-align:center">${escapeHtml(t("gdeltNoCompany"))}</div>`;
    return;
  }

  // Build query from Company + Geocoding data
  const params = new URLSearchParams({ name: cdCompanyName });
  if (cdCompanyAlias) params.set("alias", cdCompanyAlias);
  const cached = cdCurrentAasId ? dashAasCache.get(cdCurrentAasId) : null;
  if (cached?.country_value) params.set("country", cached.country_value);

  const res = await apiRequest(`/apps/resilience/api/gdelt/company?${params.toString()}`);
  if (!res.ok) {
    const errKey = res.payload?.error === "NO_CREDENTIALS" ? "gdeltNoCredentials"
                 : res.payload?.error === "NO_COMPANY" ? "gdeltNoCompany" : "gdeltNoData";
    cdPageGdelt.innerHTML = `<div style="color:var(--muted);padding:2rem;text-align:center">${escapeHtml(t(errKey))}</div>`;
    return;
  }

  const { chart, mentions, total } = res.payload;
  if (!mentions || mentions.length === 0) {
    cdPageGdelt.innerHTML = `<div style="color:var(--muted);padding:2rem;text-align:center">${escapeHtml(t("gdeltNoData"))}</div>`;
    return;
  }

  let html = `<div class="cd-source-badge"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/></svg><span>${escapeHtml(t("srcGdelt"))}</span></div>`;
  // Chart section
  html += `<div class="cd-section gdelt-chart-section">
    <h4 class="cd-section-title">${escapeHtml(t("gdeltMentions"))} <span class="cd-badge">${total}</span></h4>
    <div class="gdelt-legend">
      <span><span class="gdelt-legend-dot" style="background:#6366f1"></span>${escapeHtml(t("gdeltMentions"))}</span>
      <span><span class="gdelt-legend-dot" style="background:#f59e0b"></span>${escapeHtml(t("gdeltSentiment"))}</span>
    </div>
    <canvas id="gdelt-chart-canvas" class="gdelt-chart-canvas" height="200"></canvas>
  </div>`;

  // Articles section
  html += `<div class="cd-section">
    <h4 class="cd-section-title">${escapeHtml(t("gdeltArticles"))} <span class="cd-badge">${mentions.length}</span></h4>
    <div class="cd-news-list">`;
  for (const m of mentions) {
    const dayStr = m.day ? `${m.day.slice(6, 8)}.${m.day.slice(4, 6)}.${m.day.slice(0, 4)}` : "";
    const toneCls = m.tone > 1 ? "gdelt-tone-positive" : m.tone < -1 ? "gdelt-tone-negative" : "gdelt-tone-neutral";
    const domain = m.url ? (() => { try { return new URL(m.url).hostname.replace(/^www\\./, ""); } catch { return ""; } })() : "";
    const faviconUrl = domain ? `https://www.google.com/s2/favicons?sz=32&domain=${encodeURIComponent(domain)}` : "";
    html += `<div class="cd-news-item" data-news-expanded="false">
      <div class="cd-news-item-header" onclick="this.parentElement.dataset.newsExpanded = this.parentElement.dataset.newsExpanded === 'true' ? 'false' : 'true'">
        ${faviconUrl ? `<img class="cd-news-favicon" src="${escapeHtml(faviconUrl)}" width="20" height="20" alt="" loading="lazy">` : `<div class="cd-news-favicon-placeholder"></div>`}
        <div class="cd-news-item-body">
          <span class="cd-news-item-title">${escapeHtml(m.source || domain || "—")}</span>
          <div class="cd-news-item-meta">
            <span class="cd-news-date">${escapeHtml(dayStr)}</span>
            <span class="gdelt-tone ${toneCls}">${m.tone > 0 ? "+" : ""}${m.tone}</span>
          </div>
        </div>
        <svg class="cd-news-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="cd-news-detail">
        <a class="cd-news-link" href="${escapeHtml(m.url)}" target="_blank" rel="noopener">
          ${escapeHtml(domain || m.url)}
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    </div>`;
  }
  html += `</div></div>`;

  cdPageGdelt.innerHTML = html;

  // Draw chart on canvas
  if (chart && chart.length > 0) {
    setTimeout(() => drawGdeltChart(chart), 50);
  }
}

function drawGdeltChart(chartData) {
  const canvas = document.getElementById("gdelt-chart-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const W = rect.width;
  const H = rect.height;

  const pad = { top: 20, right: 50, bottom: 30, left: 40 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  if (chartData.length === 0) return;

  const maxCount = Math.max(...chartData.map(d => d.count), 1);
  const tones = chartData.map(d => d.avgTone);
  const minTone = Math.min(...tones, -2);
  const maxTone = Math.max(...tones, 2);
  const toneRange = Math.max(maxTone - minTone, 1);

  const barW = Math.max(Math.floor(cw / chartData.length) - 2, 4);

  // Grid lines
  ctx.strokeStyle = "rgba(128,128,128,0.15)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (ch / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + cw, y);
    ctx.stroke();
  }

  // Bars
  for (let i = 0; i < chartData.length; i++) {
    const d = chartData[i];
    const x = pad.left + (i / chartData.length) * cw + 1;
    const barH = (d.count / maxCount) * ch;
    ctx.fillStyle = "rgba(99,102,241,0.6)";
    ctx.fillRect(x, pad.top + ch - barH, barW, barH);
  }

  // Tone line
  ctx.beginPath();
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 2;
  for (let i = 0; i < chartData.length; i++) {
    const d = chartData[i];
    const x = pad.left + (i / chartData.length) * cw + barW / 2;
    const y = pad.top + ch - ((d.avgTone - minTone) / toneRange) * ch;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Zero line for tone
  if (minTone < 0 && maxTone > 0) {
    const zeroY = pad.top + ch - ((0 - minTone) / toneRange) * ch;
    ctx.strokeStyle = "rgba(220,38,38,0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pad.left, zeroY);
    ctx.lineTo(pad.left + cw, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // X-axis labels (every few days)
  ctx.fillStyle = "var(--text-2, #6b7280)";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  const step = Math.max(1, Math.floor(chartData.length / 7));
  for (let i = 0; i < chartData.length; i += step) {
    const d = chartData[i];
    const x = pad.left + (i / chartData.length) * cw + barW / 2;
    const label = d.day.slice(6, 8) + "." + d.day.slice(4, 6);
    ctx.fillText(label, x, H - 5);
  }

  // Y-axis labels (left: count)
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (ch / 4) * i;
    const val = Math.round(maxCount * (1 - i / 4));
    ctx.fillText(String(val), pad.left - 5, y + 4);
  }

  // Y-axis labels (right: tone)
  ctx.textAlign = "left";
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (ch / 4) * i;
    const val = (maxTone - (i / 4) * toneRange).toFixed(1);
    ctx.fillText(val, W - pad.right + 5, y + 4);
  }
}

// ── Shared Score Bar Helper ───────────────────────────────────
function scoreColor(value, min, max, invert) {
  // invert=true: higher=worse (INFORM), invert=false: higher=better (World Bank governance)
  const pct = (value - min) / (max - min);
  if (invert) {
    if (pct <= 0.35) return "score-green";
    if (pct <= 0.65) return "score-yellow";
    return "score-red";
  }
  if (pct >= 0.6) return "score-green";
  if (pct >= 0.4) return "score-yellow";
  return "score-red";
}

function renderScoreBar(label, value, min, max, invert, suffix) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const color = scoreColor(value, min, max, invert);
  return `<div class="cd-score-row">
    <span class="cd-score-label">${escapeHtml(label)}</span>
    <div class="cd-score-track"><div class="cd-score-fill ${color}" style="width:${pct}%"></div></div>
    <span class="cd-score-value">${value.toFixed(2)}${suffix ? " " + escapeHtml(suffix) : ""}</span>
  </div>`;
}

// ── World Bank Tab ────────────────────────────────────────────
async function loadWorldBankData() {
  cdPageWorldbank.innerHTML = `<div class="cd-loading"><div class="cd-loading-spinner"></div></div>`;
  const cached = cdCurrentAasId ? dashAasCache.get(cdCurrentAasId) : null;
  const iso = cached?.iso_code || "";
  if (!iso) {
    cdPageWorldbank.innerHTML = `<div style="color:var(--muted);padding:2rem;text-align:center">${escapeHtml(t("wbNoCountry"))}</div>`;
    return;
  }
  const res = await apiRequest(`/apps/resilience/api/world-bank?iso=${encodeURIComponent(iso)}`);
  if (!res.ok || !res.payload) {
    cdPageWorldbank.innerHTML = `<div style="color:var(--muted);padding:2rem;text-align:center">${escapeHtml(t("wbNoData"))}</div>`;
    return;
  }
  const { country, governance, logistics } = res.payload;

  const WB_LABELS = {
    "CC.EST": t("wbCorruption"), "GE.EST": t("wbEffectiveness"), "PV.EST": t("wbStability"),
    "RQ.EST": t("wbRegulatory"), "RL.EST": t("wbRuleOfLaw"), "VA.EST": t("wbVoice"),
  };

  let html = `<div class="cd-source-badge"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/></svg><span>${escapeHtml(t("srcWorldBank"))}</span></div>`;
  html += `<div class="cd-risk-section">`;
  html += `<h4>${escapeHtml(t("wbTitle"))}${country ? ` — ${escapeHtml(country)}` : ""}</h4>`;
  for (const g of governance) {
    const label = WB_LABELS[g.id] || g.id;
    html += renderScoreBar(`${label} (${g.year})`, g.value, -2.5, 2.5, false, "");
  }
  html += `</div>`;

  if (logistics) {
    html += `<div class="cd-risk-section">`;
    html += `<h4>${escapeHtml(t("wbLogistics"))} (${logistics.year})</h4>`;
    html += renderScoreBar(t("wbLogistics"), logistics.value, 1, 5, false, "");
    html += `</div>`;
  }

  cdPageWorldbank.innerHTML = html;
}

// ── INFORM Risk Tab ───────────────────────────────────────────
async function loadInformData() {
  cdPageInform.innerHTML = `<div class="cd-loading"><div class="cd-loading-spinner"></div></div>`;
  const cached = cdCurrentAasId ? dashAasCache.get(cdCurrentAasId) : null;
  const iso = cached?.iso_code || "";
  if (!iso) {
    cdPageInform.innerHTML = `<div style="color:var(--muted);padding:2rem;text-align:center">${escapeHtml(t("informNoCountry"))}</div>`;
    return;
  }
  const res = await apiRequest(`/apps/resilience/api/inform-risk?iso=${encodeURIComponent(iso)}`);
  if (!res.ok || !res.payload) {
    cdPageInform.innerHTML = `<div style="color:var(--muted);padding:2rem;text-align:center">${escapeHtml(t("informNoData"))}</div>`;
    return;
  }
  const { overall, dimensions, details, workflowName } = res.payload;

  const INFORM_LABELS = {
    HA: t("informHazard"), VU: t("informVulnerability"), CC: t("informCoping"),
    "HA.NAT": t("informNatural"), "HA.HUM": t("informHuman"),
    "VU.SEV": t("informSocioEcon"), "VU.VGR": t("informVulnGroups"),
    "CC.INF": t("informInfra"), "CC.INS": t("informInstitutional"),
  };

  // Score color for overall badge
  const oc = overall <= 3.5 ? "score-green" : overall <= 6.5 ? "score-yellow" : "score-red";

  let html = `<div class="cd-source-badge"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>${escapeHtml(t("srcInform"))}</span></div>`;

  // Overall score
  html += `<div class="inform-overall">`;
  html += `<span class="inform-overall-score ${oc}">${overall.toFixed(1)}</span>`;
  html += `<span class="inform-overall-label">${escapeHtml(t("informTitle"))}<br><small style="opacity:0.6">${escapeHtml(workflowName)} &middot; 0-10</small></span>`;
  html += `</div>`;

  // Dimensions
  html += `<div class="cd-risk-section"><h4>${escapeHtml(t("informTitle"))}</h4>`;
  for (const dim of dimensions) {
    html += renderScoreBar(INFORM_LABELS[dim.id] || dim.name, dim.score, 0, 10, true, "");
  }
  html += `</div>`;

  // Details grouped by parent
  for (const dim of dimensions) {
    const children = details.filter(d => d.parent === dim.id);
    if (children.length === 0) continue;
    html += `<div class="cd-risk-section"><h4>${escapeHtml(INFORM_LABELS[dim.id] || dim.name)}</h4>`;
    for (const child of children) {
      html += renderScoreBar(INFORM_LABELS[child.id] || child.name, child.score, 0, 10, true, "");
    }
    html += `</div>`;
  }

  cdPageInform.innerHTML = html;
}

function renderLocationTab(geo) {
  let html = "";
  // Info Cards: Location + Coordinates
  html += `<div class="cd-info-grid">`;
  html += `<div class="cd-card">
    <div class="cd-card-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
    <div class="cd-card-content">
      <span class="cd-card-label">${escapeHtml(t("cdGeoTitle"))}</span>
      <span class="cd-card-value">${escapeHtml(geo.city_value || "-")}${geo.country_value ? `, ${escapeHtml(geo.country_value)}` : ""}${geo.iso_code ? ` <span class="cd-iso-badge">${escapeHtml(geo.iso_code)}</span>` : ""}</span>
    </div>
  </div>`;
  html += `<div class="cd-card">
    <div class="cd-card-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
    <div class="cd-card-content">
      <span class="cd-card-label">${escapeHtml(t("cdCoordinates"))}</span>
      <span class="cd-card-value">${geo.lat !== null ? `${geo.lat.toFixed(4)}, ${geo.lon.toFixed(4)}` : "-"}</span>
    </div>
  </div>`;
  html += `</div>`;
  // Map + Alert toggle
  if (geo.lat !== null && geo.lon !== null) {
    html += `<div class="cd-section">
      <div class="cd-section-title">
        <span>${escapeHtml(t("cdGeoTitle"))}</span>
        <button id="cd-alerts-toggle" class="cd-alerts-toggle" type="button" title="Alerts auf Karte">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
        </button>
      </div>
      <div id="cd-map-container" class="cd-map-container"></div>
    </div>`;
  }
  return html;
}

function renderAlertsTab(alerts) {
  if (!alerts || alerts.length === 0) {
    return `<div class="cd-error" style="color:var(--muted)">${escapeHtml(t("cdNoAlerts"))}</div>`;
  }
  let html = `<div class="cd-section">
    <h4 class="cd-section-title">${escapeHtml(t("cdAlertsTitle"))} <span class="cd-badge">${alerts.length}</span></h4>
    <div class="cd-alerts-list">`;
  for (const a of alerts) {
    const icon = GDACS_TYPE_ICONS[a.eventtype] || "";
    const ac = a.alertlevel === "Red" ? "alert-red" : a.alertlevel === "Orange" ? "alert-orange" : "alert-green";
    const mt = a.match_tier || "country";
    const matchCls = `match-${mt}`;
    let matchLabel = t("cdMatchCountry");
    if (mt === "polygon") matchLabel = t("cdMatchPolygon");
    else if (mt === "distance") matchLabel = t("cdMatchDistance").replace("{km}", a.distance_km != null ? Math.round(a.distance_km) : "?");
    html += `<div class="cd-alert-row ${matchCls}">
      <span class="cd-alert-icon">${icon}</span>
      <span class="cd-alert-name">${escapeHtml(a.name || "-")}</span>
      <span class="alert-badge ${ac}">${escapeHtml(a.alertlevel)}</span>
      <span class="cd-alert-match">${escapeHtml(matchLabel)}</span>
      <span class="cd-alert-date">${formatDateShort(a.fromdate)}</span>
      ${a.url ? `<a class="cd-alert-link" href="${escapeHtml(a.url)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ""}
    </div>`;
  }
  html += `</div></div>`;
  return html;
}

function renderDataTab(columns_data) {
  let html = "";
  const colEntries = Object.entries(columns_data || {}).filter(([, v]) => v);
  if (colEntries.length > 0) {
    html += `<div class="cd-section">
      <h4 class="cd-section-title">${escapeHtml(t("cdColumnsTitle"))}</h4>
      <div class="cd-columns-grid">`;
    for (const [path, value] of colEntries) {
      const label = path.includes(".") ? path.split(".").pop() : path;
      html += `<div class="cd-col-item">
        <span class="cd-col-label">${escapeHtml(label)}</span>
        <span class="cd-col-value">${escapeHtml(String(value))}</span>
      </div>`;
    }
    html += `</div></div>`;
  }
  // Placeholder for lazy-loaded AAS meta card
  html += `<div id="cd-aas-meta-area"></div>`;
  return html;
}

function renderAasMetaCard(shell, aasId) {
  const rows = [];
  if (shell.id) rows.push(["ID", shell.id]);
  if (shell.idShort) rows.push(["idShort", shell.idShort]);
  if (shell.assetKind) rows.push(["Asset Kind", shell.assetKind]);
  if (shell.assetType) rows.push(["Asset Type", shell.assetType]);
  if (shell.globalAssetId) rows.push(["Global Asset ID", shell.globalAssetId]);
  if (shell.submodelCount) rows.push(["Submodels", String(shell.submodelCount)]);
  let html = `<div class="cd-section">
    <div class="cd-sm-card">
      <div class="cd-sm-card-header" data-toggle="cd-sm">
        <span class="cd-sm-name">AAS</span>
        <span class="cd-sm-count">${rows.length} ${escapeHtml(t("cdSubmodelElements"))}</span>
        <svg class="cd-sm-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="cd-sm-card-body" hidden>
        <table class="cd-sm-table">`;
  for (const [label, value] of rows) {
    html += `<tr><td class="cd-sm-prop-name">${escapeHtml(label)}</td><td class="cd-sm-prop-value">${escapeHtml(value)}</td></tr>`;
  }
  html += `</table>
      </div>
    </div>
  </div>`;
  return html;
}

function renderSubmodelCards(submodels) {
  if (!submodels || !submodels.length) return "";
  let html = `<div class="cd-section">
    <h4 class="cd-section-title">${escapeHtml(t("cdSubmodelsTitle"))} <span class="cd-badge">${submodels.length}</span></h4>
    <div class="cd-sm-cards">`;
  for (const sm of submodels) {
    html += `<div class="cd-sm-card">
      <div class="cd-sm-card-header" data-toggle="cd-sm">
        <span class="cd-sm-name">${escapeHtml(sm.idShort || sm.id)}</span>
        <span class="cd-sm-count">${sm.properties.length} ${escapeHtml(t("cdSubmodelElements"))}</span>
        <svg class="cd-sm-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="cd-sm-card-body" hidden>
        <table class="cd-sm-table">`;
    for (const prop of sm.properties) {
      const depth = (prop.idShort.match(/\./g) || []).length;
      const shortName = prop.idShort.includes(".") ? prop.idShort.split(".").pop() : prop.idShort;
      const isGroup = prop.modelType === "Collection" || prop.modelType === "List";
      const typeLabel = isGroup ? (prop.modelType === "List" ? "List" : "Collection") : (prop.modelType === "MLP" ? "MLP" : "");
      if (isGroup) {
        html += `<tr class="cd-sm-group-row">
              <td class="cd-sm-prop-name" style="padding-left:${depth * 0.8}rem">${escapeHtml(shortName)} <span class="cd-sm-type-badge">${typeLabel} (${prop.childCount})</span></td>
              <td class="cd-sm-prop-value"></td>
            </tr>`;
      } else {
        html += `<tr>
              <td class="cd-sm-prop-name" style="padding-left:${depth * 0.8}rem">${escapeHtml(shortName)}</td>
              <td class="cd-sm-prop-value">${escapeHtml(prop.value || "-")}${typeLabel ? ` <span class="cd-sm-type-badge">${typeLabel}</span>` : ""}</td>
            </tr>`;
      }
    }
    html += `</table>
      </div>
    </div>`;
  }
  html += `</div></div>`;
  return html;
}

// Dashboard AAS Tile Settings modal
const dashAasSettingsModal = document.getElementById("dash-aas-settings-modal");
document.getElementById("dash-aas-settings-btn").addEventListener("click", () => {
  // Sync checkboxes with current filter
  document.getElementById("dash-filter-polygon").checked = cachedDashMatchFilter.includes("polygon");
  document.getElementById("dash-filter-distance").checked = cachedDashMatchFilter.includes("distance");
  document.getElementById("dash-filter-country").checked = cachedDashMatchFilter.includes("country");
  updateGdacsColsDisplay(cachedGdacsColumns);
  // Show extra sections + delete only when matching is configured
  document.getElementById("dash-aas-extra-sections").hidden = !cachedMatchingConfigured;
  document.getElementById("dash-aas-settings-delete").hidden = !cachedMatchingConfigured;
  dashAasSettingsModal.showModal();
});
document.getElementById("dash-aas-settings-close").addEventListener("click", () => dashAasSettingsModal.close());
document.getElementById("dash-aas-cols-btn").addEventListener("click", () => {
  dashAasSettingsModal.close();
  openAasCmModal("columns");
});
document.getElementById("dash-aas-settings-save").addEventListener("click", async () => {
  const filter = [];
  if (document.getElementById("dash-filter-polygon").checked) filter.push("polygon");
  if (document.getElementById("dash-filter-distance").checked) filter.push("distance");
  if (document.getElementById("dash-filter-country").checked) filter.push("country");
  cachedDashMatchFilter = filter;
  const btn = document.getElementById("dash-aas-settings-save");
  btn.disabled = true;
  await apiRequest("/apps/resilience/api/settings", {
    method: "PUT",
    body: { dash_aas_match_filter: filter },
  });
  btn.disabled = false;
  dashAasSettingsModal.close();
  dashAasPage = 0;
  loadDashboard();
});

// Delete all GDACS tile config
document.getElementById("dash-aas-settings-delete").addEventListener("click", async () => {
  const btn = document.getElementById("dash-aas-settings-delete");
  btn.disabled = true;
  await apiRequest("/apps/resilience/api/settings", {
    method: "PUT",
    body: {
      matching_params: { group_id: "", country_path: "", city_path: "", lat_path: "", lon_path: "" },
      gdacs_aas_columns: [],
      dash_aas_match_filter: ["polygon", "distance"],
    },
  });
  btn.disabled = false;
  updateMatchingDisplay("", { country: "", city: "", lat: "", lon: "" });
  cachedGdacsColumns = [];
  updateGdacsColsDisplay([]);
  cachedDashMatchFilter = ["polygon", "distance"];
  dashAasSettingsModal.close();
  dashAasPage = 0;
  loadDashboard();
});

// ── Indicator Dashboard Settings + Wizard ─────────────────────────────────
const dashIndSettingsModal = document.getElementById("dash-ind-settings-modal");
const indWizardModal = document.getElementById("ind-wizard-modal");
const indConfirmDialog = document.getElementById("ind-confirm-dialog");
let cachedIndDashConfig = {};

function updateIndColsDisplay(columns) {
  const textEl = document.getElementById("dash-ind-cols-text");
  if (!textEl) return;
  if (!columns || !columns.length) {
    textEl.className = "gdacs-aas-source-empty";
    textEl.textContent = t("indColsEmpty");
  } else {
    textEl.className = "gdacs-aas-source-filled";
    textEl.innerHTML = columns.map(c => {
      const p = typeof c === "string" ? c : c.path;
      const tp = typeof c === "string" ? "" : c.type;
      const typeHtml = tp ? ` <span class="gdacs-src-type">[${escapeHtml(tp)}]</span>` : "";
      return `<span class="gdacs-src-path">${escapeHtml(p)}${typeHtml}</span>`;
    }).join("");
  }
}

// Wizard state
let indWizardStep = 1;
let indWizardGroupId = null;
let indWizardGroupName = "";
let indWizardSelectedIndicators = []; // [{indicator_id, name, conditions: [{key, input, operator, value}]}]
let indWizardCurrentIndIdx = 0;
let indWizardMappings = {}; // { indicator_id: { ref_aas_id, condition_mappings: {"g0_c0": path} } }
let indWizardCurrentCondKey = null; // which condition key is being mapped (e.g. "g0_c0")
let indWizardCurrentCondType = null; // input type for type-compat filtering
let indWizardLoadedTree = null; // cached submodels for current ref AAS

// Operator labels for wizard summary
const IND_OP_LABELS = { "==": "=", "!=": "≠", ">": ">", "<": "<", ">=": "≥", "<=": "≤" };

// Compatible AAS valueTypes per indicator input type
const IND_NUMBER_TYPES = new Set(["xs:int", "xs:integer", "xs:double", "xs:float", "xs:decimal", "xs:long", "xs:short", "xs:byte", "xs:unsignedInt", "xs:unsignedLong", "xs:unsignedShort", "xs:unsignedByte", "xs:nonNegativeInteger", "xs:positiveInteger"]);
const IND_BOOL_TYPES = new Set(["xs:boolean"]);

function indTypeCompatible(indicatorInputType, aasValueType) {
  if (indicatorInputType === "text") return true;
  if (indicatorInputType === "number") return IND_NUMBER_TYPES.has(aasValueType);
  if (indicatorInputType === "boolean") return IND_BOOL_TYPES.has(aasValueType);
  return true;
}

// Open settings modal
document.getElementById("dash-ind-settings-btn").addEventListener("click", async () => {
  const res = await apiRequest("/apps/resilience/api/indicators/dashboard-config");
  const display = document.getElementById("dash-ind-config-display");
  const config = res.ok ? res.payload : {};
  cachedIndDashConfig = config;
  const colsSection = document.getElementById("dash-ind-cols-section");
  if (config.group_id && Array.isArray(config.indicators) && config.indicators.length) {
    // Resolve group name
    const grpRes = await apiRequest(`/apps/resilience/api/asset-groups/${config.group_id}`);
    const gName = grpRes.ok ? grpRes.payload.name : config.group_id;
    // Resolve indicator names
    const indRes = await apiRequest("/apps/resilience/api/indicators");
    const indMap = new Map();
    if (indRes.ok) for (const i of indRes.payload.indicators) indMap.set(i.indicator_id, i.name);
    let html = `<div class="dash-ind-config-group">${escapeHtml(gName)} — ${config.indicators.length} ${t("indDashConfigured")}</div>`;
    html += `<div class="dash-ind-config-list">`;
    for (const ic of config.indicators) {
      html += `<div class="dash-ind-config-item"><span class="ind-cfg-dot" style="background:var(--accent)"></span>${escapeHtml(indMap.get(ic.indicator_id) || ic.indicator_id)}</div>`;
    }
    html += `</div>`;
    display.innerHTML = html;
    document.getElementById("dash-ind-delete-btn").hidden = false;
    // Show column selection section
    colsSection.hidden = false;
    updateIndColsDisplay(config.columns || []);
  } else {
    display.innerHTML = `<span class="gdacs-aas-source-empty">${t("indDashNoConfig")}</span>`;
    document.getElementById("dash-ind-delete-btn").hidden = true;
    colsSection.hidden = true;
  }
  dashIndSettingsModal.showModal();
});
document.getElementById("dash-ind-settings-close").addEventListener("click", () => dashIndSettingsModal.close());

// Column selection button → open AAS CM modal in ind-columns mode
document.getElementById("dash-ind-cols-btn").addEventListener("click", () => {
  dashIndSettingsModal.close();
  openAasCmModal("ind-columns", cachedIndDashConfig.group_id);
});

// Configure button → open wizard
document.getElementById("dash-ind-configure-btn").addEventListener("click", () => {
  dashIndSettingsModal.close();
  openIndWizard();
});

// Delete all → confirm dialog
document.getElementById("dash-ind-delete-btn").addEventListener("click", () => {
  indConfirmDialog.showModal();
});
document.getElementById("ind-confirm-cancel").addEventListener("click", () => indConfirmDialog.close());
document.getElementById("ind-confirm-ok").addEventListener("click", async () => {
  indConfirmDialog.close();
  dashIndSettingsModal.close();
  await apiRequest("/apps/resilience/api/indicators/dashboard-config", {
    method: "PUT", body: { config: {} },
  });
  loadDashboard();
});

// ── Score Tile Settings Modal ───────────────────────────────────
const dashScoreSettingsModal = document.getElementById("dash-score-settings-modal");
let scoreCfgStep = 0;
let scoreCfgGroupId = null;
let scoreCfgGroupName = "";
let scoreCfgSelectedAas = [];
let scoreCfgLabelPath = "";
let scoreCfgTargetPath = "";
let scoreCfgActiveField = ""; // "label" or "target"
let scoreCfgTreeCache = null;

function showScoreCfgStep(step) {
  scoreCfgStep = step;
  document.getElementById("score-cfg-display").hidden = step !== 0;
  document.getElementById("score-step-1").hidden = step !== 1;
  document.getElementById("score-step-2").hidden = step !== 2;
  document.getElementById("score-step-3").hidden = step !== 3;
  document.getElementById("score-cfg-configure-btn").hidden = step !== 0;
  document.getElementById("score-cfg-delete-btn").hidden = step !== 0;
  document.getElementById("score-cfg-back-btn").hidden = step === 0;
  document.getElementById("score-cfg-next-btn").hidden = step !== 2;
  document.getElementById("score-cfg-save-btn").hidden = step !== 3 || !scoreCfgLabelPath || !scoreCfgTargetPath;
}

function updateScorePathRows() {
  const rows = document.getElementById("score-path-rows");
  rows.innerHTML = `
    <div class="score-path-row">
      <span class="score-path-label">${t("dashScoreLabel")}</span>
      <span class="score-path-value${scoreCfgLabelPath ? " score-path-set" : ""}">${scoreCfgLabelPath ? escapeHtml(scoreCfgLabelPath) : "–"}</span>
      <button class="score-path-btn" data-field="label" type="button">${t("indWizardSelectPath")}</button>
    </div>
    <div class="score-path-row">
      <span class="score-path-label">${t("dashScoreTarget")}</span>
      <span class="score-path-value${scoreCfgTargetPath ? " score-path-set" : ""}">${scoreCfgTargetPath ? escapeHtml(scoreCfgTargetPath) : "–"}</span>
      <button class="score-path-btn" data-field="target" type="button">${t("indWizardSelectPath")}</button>
    </div>`;
  document.getElementById("score-cfg-save-btn").hidden = !scoreCfgLabelPath || !scoreCfgTargetPath;
}

async function loadScoreTree(aasId) {
  const treeArea = document.getElementById("score-tree-area");
  const treeEl = document.getElementById("score-tree");
  const loading = document.getElementById("score-tree-loading");
  treeArea.hidden = false;
  treeEl.innerHTML = "";
  loading.hidden = false;

  if (!scoreCfgTreeCache || scoreCfgTreeCache.aasId !== aasId) {
    const res = await apiRequest(`/apps/resilience/api/aas-import/${encodeURIComponent(aasId)}`);
    loading.hidden = true;
    if (!res.ok || !res.payload) {
      treeEl.innerHTML = `<p class="aas-cm-error">${t("aasCmTreeError")}</p>`;
      return;
    }
    scoreCfgTreeCache = { aasId, submodels: res.payload.submodels || [] };
  } else {
    loading.hidden = true;
  }

  for (const sm of scoreCfgTreeCache.submodels) {
    const card = document.createElement("div");
    card.className = "aas-cm-sm-card";
    card.innerHTML = `<h4 class="aas-cm-sm-title">${escapeHtml(sm.idShort || sm.id)}</h4>`;
    const elHtml = renderSelectableEls(sm.submodelElements || [], 0, sm.idShort || "");
    card.insertAdjacentHTML("beforeend", elHtml);
    treeEl.appendChild(card);
  }
}

// ══════════════════════════════════════════════════════════════
// Dashboard Value Tiles — Edit Mode + Wizard + Rendering
// ══════════════════════════════════════════════════════════════

let dashEditMode = false;
let vtTilesConfig = [];
let vtTileData = [];

// Colors for value tiles
const VT_COLORS = ["#3b82f6","#8b5cf6","#ec4899","#f97316","#14b8a6","#22c55e","#ef4444","#eab308","#06b6d4","#6366f1"];

// Display types
const VT_DISPLAYS = [
  { id: "big-number", key: "vtBigNumber" },
  { id: "progress-bar", key: "vtProgressBar" },
  { id: "stat-card", key: "vtStatCard" },
  { id: "text-plain", key: "vtTextPlain" },
  { id: "text-badge", key: "vtTextBadge" },
  { id: "text-highlight", key: "vtTextHighlight" },
];

// ── Load + Render Tiles ─────────────────────────────────────
async function loadVtTiles() {
  const cfgRes = await apiRequest("/apps/resilience/api/value-tiles");
  vtTilesConfig = cfgRes.ok && Array.isArray(cfgRes.payload) ? cfgRes.payload : [];
  if (vtTilesConfig.length) {
    const dataRes = await apiRequest("/apps/resilience/api/value-tile-data");
    vtTileData = dataRes.ok && Array.isArray(dataRes.payload) ? dataRes.payload : [];
  } else {
    vtTileData = [];
  }
  renderVtGrid();
}

function renderVtGrid() {
  const ph = document.getElementById("dash-placeholders");
  const hasAnyTile = vtTilesConfig.length > 0;

  // Build 6 slots
  let html = "";
  for (let i = 0; i < 6; i++) {
    const tile = vtTilesConfig.find(t => t.slot === i);
    if (tile) {
      const data = vtTileData.find(d => d.slot === i);
      html += renderVtTileHtml(tile, data);
    } else if (dashEditMode) {
      html += `<div class="dash-placeholder-card" data-slot="${i}"><span class="dash-placeholder-icon">+</span></div>`;
    }
  }

  // Show grid if edit mode OR has tiles
  if (dashEditMode || hasAnyTile) {
    ph.hidden = false;
    ph.innerHTML = html;
    ph.classList.toggle("edit-active", dashEditMode);
  } else {
    ph.hidden = true;
    ph.innerHTML = "";
  }
}

function renderVtTileHtml(tile, data) {
  const label = escapeHtml(data?.label || tile.label_path || "—");
  const value = escapeHtml(data?.value || "—");
  const vname = escapeHtml(data?.value_name || (tile.value_path || "").split(".").pop() || "");
  const color = tile.color || "#3b82f6";
  const del = `<button class="dash-vt-delete-btn" data-slot="${tile.slot}" title="${t("vtDeleteBtn")}">&times;</button>`;
  const vnameHtml = vname ? `<div class="vt-vname">${vname}</div>` : "";

  let inner = "";
  switch (tile.display) {
    case "big-number":
      inner = `<div class="vt-big-number"><div class="vt-val">${value}</div>${vnameHtml}<div class="vt-lbl">${label}</div></div>`;
      break;
    case "progress-bar": {
      const num = parseFloat(data?.value) || 0;
      const pct = Math.min(Math.max(num, 0), 100);
      inner = `<div class="vt-progress"><div class="vt-progress-header"><span class="vt-lbl">${label}</span><span class="vt-val" style="color:${color}">${value}</span></div>${vnameHtml}<div class="vt-progress-track"><div class="vt-progress-bar" style="width:${pct}%;background:${color}"></div></div></div>`;
      break;
    }
    case "stat-card":
      inner = `<div class="vt-stat"><div class="vt-lbl">${label}</div><div class="vt-val" style="color:${color}">${value}</div>${vnameHtml}</div>`;
      break;
    case "text-plain":
      inner = `<div class="vt-text-plain"><div class="vt-lbl"><span class="vt-dot" style="background:${color}"></span>${label}</div><div class="vt-val">${value}</div>${vnameHtml}</div>`;
      break;
    case "text-badge":
      inner = `<div class="vt-text-badge"><div class="vt-lbl">${label}</div><span class="vt-badge" style="background:${color}20;color:${color}">${value}</span>${vnameHtml}</div>`;
      break;
    case "text-highlight":
      inner = `<div class="vt-text-highlight"><div class="vt-lbl">${label}</div><div class="vt-val">${value}</div>${vnameHtml}</div>`;
      break;
    default:
      inner = `<div class="vt-big-number"><div class="vt-val">${value}</div>${vnameHtml}<div class="vt-lbl">${label}</div></div>`;
  }

  return `<div class="dash-vt-tile vt-style-${tile.display}" data-slot="${tile.slot}" style="--vt-color:${color};--vt-color-light:${color}18">${del}${inner}</div>`;
}

// ── Edit Mode Toggle ────────────────────────────────────────
document.getElementById("dash-edit-btn").addEventListener("click", () => {
  dashEditMode = !dashEditMode;
  document.getElementById("dash-edit-btn").classList.toggle("active", dashEditMode);
  renderVtGrid();
});

// ── Grid Click Delegation ───────────────────────────────────
document.getElementById("dash-placeholders").addEventListener("click", (e) => {
  // Delete button
  const delBtn = e.target.closest(".dash-vt-delete-btn");
  if (delBtn) {
    vtDeleteTargetSlot = parseInt(delBtn.dataset.slot);
    document.getElementById("vt-confirm-text").textContent = t("vtDeleteConfirm");
    document.getElementById("vt-confirm-cancel").textContent = t("vtCancel");
    document.getElementById("vt-confirm-ok").textContent = t("vtDeleteBtn");
    document.getElementById("vt-confirm-dialog").showModal();
    return;
  }
  // Placeholder "+" card
  const card = e.target.closest(".dash-placeholder-card");
  if (card) {
    openVtWizard(parseInt(card.dataset.slot));
  }
});

// ── Delete Confirm ──────────────────────────────────────────
let vtDeleteTargetSlot = -1;
document.getElementById("vt-confirm-cancel").addEventListener("click", () => {
  document.getElementById("vt-confirm-dialog").close();
});
document.getElementById("vt-confirm-ok").addEventListener("click", async () => {
  document.getElementById("vt-confirm-dialog").close();
  vtTilesConfig = vtTilesConfig.filter(t => t.slot !== vtDeleteTargetSlot);
  await apiRequest("/apps/resilience/api/value-tiles", { method: "PUT", body: { config: vtTilesConfig } });
  vtTileData = vtTileData.filter(d => d.slot !== vtDeleteTargetSlot);
  renderVtGrid();
});

// ══════════════════════════════════════════════════════════════
// Value Tile Wizard
// ══════════════════════════════════════════════════════════════

let vtWizardStep = 1;
let vtSelectedAasId = null;
let vtActiveField = "label"; // "label" | "value"
let vtLabelPath = "";
let vtValuePath = "";
let vtDisplay = "big-number";
let vtColor = "";
let vtTargetSlot = 0;
let vtCachedAasList = [];
let vtCachedSubmodels = null;

const vtWizardModal = document.getElementById("vt-wizard-modal");

function openVtWizard(slot) {
  vtTargetSlot = slot;
  vtWizardStep = 1;
  vtSelectedAasId = null;
  vtActiveField = "label";
  vtLabelPath = "";
  vtValuePath = "";
  vtDisplay = "big-number";
  vtCachedSubmodels = null;
  // Auto-assign unused color
  const usedColors = vtTilesConfig.map(t => t.color);
  vtColor = VT_COLORS.find(c => !usedColors.includes(c)) || VT_COLORS[Math.floor(Math.random() * VT_COLORS.length)];
  showVtStep(1);
  vtWizardModal.showModal();
  loadVtAasList();
}

function showVtStep(step) {
  vtWizardStep = step;
  for (let s = 1; s <= 3; s++) {
    document.getElementById(`vt-step-${s}`).hidden = s !== step;
  }
  document.querySelectorAll("#vt-wizard-steps .aas-cm-step").forEach(sp => {
    const s = parseInt(sp.dataset.step);
    sp.classList.toggle("active", s === step);
    sp.classList.toggle("done", s < step);
  });
  document.getElementById("vt-wizard-back").hidden = step <= 1;
  document.getElementById("vt-wizard-next").hidden = step !== 2;
  document.getElementById("vt-wizard-next").disabled = !(vtLabelPath && vtValuePath);
  document.getElementById("vt-wizard-create").hidden = step !== 3;
  document.getElementById("vt-wizard-cancel").hidden = false;
}

// ── Step 1: AAS List ────────────────────────────────────────
async function loadVtAasList() {
  const list = document.getElementById("vt-aas-list");
  list.innerHTML = `<div class="aas-cm-loading">${t("vtLoading")}</div>`;
  const res = await apiRequest("/apps/resilience/api/aas-overview");
  if (!res.ok || !res.payload?.entries?.length) {
    list.innerHTML = `<div class="aas-cm-empty">${t("vtNoAas")}</div>`;
    vtCachedAasList = [];
    return;
  }
  // Deduplicate by aas_id (overview can have duplicates from multiple sources)
  const seen = new Set();
  vtCachedAasList = res.payload.entries.filter(e => {
    if (seen.has(e.aas_id)) return false;
    seen.add(e.aas_id);
    return true;
  });
  renderVtAasList("");
}

function renderVtAasList(filter) {
  const list = document.getElementById("vt-aas-list");
  const lf = filter.toLowerCase();
  const filtered = lf ? vtCachedAasList.filter(e => e.aas_id.toLowerCase().includes(lf) || (e.source_name || "").toLowerCase().includes(lf)) : vtCachedAasList;
  if (!filtered.length) {
    list.innerHTML = `<div class="aas-cm-empty">${t("vtNoAas")}</div>`;
    return;
  }
  list.innerHTML = filtered.map(e => {
    const shortId = e.aas_id.length > 50 ? "\u2026" + e.aas_id.slice(-45) : e.aas_id;
    return `<button type="button" class="aas-cm-select-item" data-aas-id="${escapeHtml(e.aas_id)}"><span class="aas-cm-select-label">${escapeHtml(shortId)}</span><span class="aas-cm-select-meta">${escapeHtml(e.source_name || "")}</span></button>`;
  }).join("");
}

document.getElementById("vt-aas-search").addEventListener("input", (e) => {
  renderVtAasList(e.target.value.trim());
});

document.getElementById("vt-aas-list").addEventListener("click", (e) => {
  const btn = e.target.closest(".aas-cm-select-item");
  if (!btn) return;
  vtSelectedAasId = btn.dataset.aasId;
  showVtStep(2);
  loadVtTree(vtSelectedAasId);
});

// ── Step 2: Tree + Path Fields ──────────────────────────────
async function loadVtTree(aasId) {
  const treeEl = document.getElementById("vt-tree");
  const loading = document.getElementById("vt-tree-loading");
  treeEl.innerHTML = "";
  loading.hidden = false;
  const res = await apiRequest(`/apps/resilience/api/company-detail/${encodeURIComponent(aasId)}`);
  loading.hidden = true;
  if (!res.ok || !res.payload?.submodels?.length) {
    treeEl.innerHTML = `<div class="aas-cm-empty">${t("vtNoAas")}</div>`;
    vtCachedSubmodels = null;
    return;
  }
  vtCachedSubmodels = res.payload.submodels;
  // Render clickable tree
  let html = "";
  for (const sm of vtCachedSubmodels) {
    html += `<div class="vt-tree-sm">`;
    html += `<div class="vt-tree-sm-header">${escapeHtml(sm.idShort || sm.id || "")}</div>`;
    if (sm.properties?.length) {
      html += `<div class="vt-tree-props">`;
      for (const prop of sm.properties) {
        if (prop.modelType === "Collection" || prop.modelType === "List") continue;
        const fullPath = sm.idShort + "." + prop.idShort;
        const val = prop.value || "";
        const shortVal = val.length > 40 ? val.slice(0, 37) + "\u2026" : val;
        html += `<button type="button" class="vt-tree-prop" data-path="${escapeHtml(fullPath)}"><span class="vt-tree-prop-name">${escapeHtml(prop.idShort)}</span><span class="vt-tree-prop-val">${escapeHtml(shortVal)}</span></button>`;
      }
      html += `</div>`;
    }
    html += `</div>`;
  }
  treeEl.innerHTML = html;
}

// Path field clicks
document.getElementById("vt-path-fields").addEventListener("click", (e) => {
  const field = e.target.closest(".vt-path-field");
  if (!field) return;
  vtActiveField = field.dataset.field;
  document.getElementById("vt-field-label").classList.toggle("active", vtActiveField === "label");
  document.getElementById("vt-field-value").classList.toggle("active", vtActiveField === "value");
});

// Tree property clicks
document.getElementById("vt-tree").addEventListener("click", (e) => {
  const prop = e.target.closest(".vt-tree-prop");
  if (!prop) return;
  const path = prop.dataset.path;
  if (vtActiveField === "label") {
    vtLabelPath = path;
    document.getElementById("vt-field-label-value").textContent = path;
    document.getElementById("vt-field-label").classList.add("filled");
    // Auto-switch to value field if not yet set
    if (!vtValuePath) {
      vtActiveField = "value";
      document.getElementById("vt-field-label").classList.remove("active");
      document.getElementById("vt-field-value").classList.add("active");
    }
  } else {
    vtValuePath = path;
    document.getElementById("vt-field-value-value").textContent = path;
    document.getElementById("vt-field-value").classList.add("filled");
  }
  // Highlight selected in tree
  document.querySelectorAll("#vt-tree .vt-tree-prop.selected").forEach(p => p.classList.remove("selected"));
  prop.classList.add("selected");
  // Enable/disable next
  document.getElementById("vt-wizard-next").disabled = !(vtLabelPath && vtValuePath);
});

// ── Step 3: Display + Color ─────────────────────────────────
function renderVtDisplayOptions() {
  const grid = document.getElementById("vt-display-grid");
  const previews = {
    "big-number": `<span class="vt-preview-big">42</span>`,
    "progress-bar": `<div class="vt-preview-bar"></div>`,
    "stat-card": `<span class="vt-preview-stat">42</span>`,
    "text-plain": `<span class="vt-preview-plain">Text</span>`,
    "text-badge": `<span class="vt-preview-badge">Badge</span>`,
    "text-highlight": `<span class="vt-preview-highlight">Value</span>`,
  };
  grid.innerHTML = VT_DISPLAYS.map(d =>
    `<div class="vt-display-option${d.id === vtDisplay ? " selected" : ""}" data-display="${d.id}"><div class="vt-display-option-preview">${previews[d.id]}</div><div class="vt-display-option-label">${t(d.key)}</div></div>`
  ).join("");

  // Color swatches
  const swatches = document.getElementById("vt-color-swatches");
  swatches.innerHTML = VT_COLORS.map(c =>
    `<button type="button" class="vt-color-swatch${c === vtColor ? " selected" : ""}" data-color="${c}" style="background:${c}"></button>`
  ).join("");
}

document.getElementById("vt-display-grid").addEventListener("click", (e) => {
  const opt = e.target.closest(".vt-display-option");
  if (!opt) return;
  vtDisplay = opt.dataset.display;
  document.querySelectorAll("#vt-display-grid .vt-display-option").forEach(o => o.classList.toggle("selected", o.dataset.display === vtDisplay));
});

document.getElementById("vt-color-swatches").addEventListener("click", (e) => {
  const sw = e.target.closest(".vt-color-swatch");
  if (!sw) return;
  vtColor = sw.dataset.color;
  document.querySelectorAll("#vt-color-swatches .vt-color-swatch").forEach(s => s.classList.toggle("selected", s.dataset.color === vtColor));
});

// ── Wizard Navigation ───────────────────────────────────────
document.getElementById("vt-wizard-back").addEventListener("click", () => {
  if (vtWizardStep === 2) {
    vtLabelPath = "";
    vtValuePath = "";
    document.getElementById("vt-field-label-value").textContent = t("vtFieldEmpty");
    document.getElementById("vt-field-value-value").textContent = t("vtFieldEmpty");
    document.getElementById("vt-field-label").classList.remove("filled");
    document.getElementById("vt-field-value").classList.remove("filled");
    vtActiveField = "label";
    document.getElementById("vt-field-label").classList.add("active");
    document.getElementById("vt-field-value").classList.remove("active");
    showVtStep(1);
  } else if (vtWizardStep === 3) {
    showVtStep(2);
  }
});

document.getElementById("vt-wizard-next").addEventListener("click", () => {
  if (vtWizardStep === 2 && vtLabelPath && vtValuePath) {
    renderVtDisplayOptions();
    showVtStep(3);
  }
});

document.getElementById("vt-wizard-cancel").addEventListener("click", () => {
  vtWizardModal.close();
});
document.getElementById("vt-wizard-close").addEventListener("click", () => {
  vtWizardModal.close();
});

document.getElementById("vt-wizard-create").addEventListener("click", async () => {
  const tile = {
    slot: vtTargetSlot,
    aas_id: vtSelectedAasId,
    label_path: vtLabelPath,
    value_path: vtValuePath,
    display: vtDisplay,
    color: vtColor,
  };
  // Replace if slot already used, otherwise push
  vtTilesConfig = vtTilesConfig.filter(t => t.slot !== vtTargetSlot);
  vtTilesConfig.push(tile);
  await apiRequest("/apps/resilience/api/value-tiles", { method: "PUT", body: { config: vtTilesConfig } });
  vtWizardModal.close();
  // Reload tile data
  const dataRes = await apiRequest("/apps/resilience/api/value-tile-data");
  vtTileData = dataRes.ok && Array.isArray(dataRes.payload) ? dataRes.payload : [];
  renderVtGrid();
});

// Open modal: load config, show display
document.getElementById("dash-score-settings-btn").addEventListener("click", async () => {
  const res = await apiRequest("/apps/resilience/api/score/dashboard-config");
  const config = res.ok ? res.payload : {};
  const display = document.getElementById("score-cfg-display");
  const deleteBtn = document.getElementById("score-cfg-delete-btn");

  if (config.group_id && Array.isArray(config.aas_ids) && config.aas_ids.length && config.label_path && config.target_path) {
    const grpRes = await apiRequest(`/apps/resilience/api/asset-groups/${config.group_id}`);
    const gName = grpRes.ok ? grpRes.payload.name : config.group_id;
    let html = `<div class="score-cfg-group">${escapeHtml(gName)} — ${config.aas_ids.length} AAS ${t("dashScoreConfigured")}</div>`;
    html += `<div class="score-cfg-list">`;
    html += `<div class="score-cfg-item"><span class="score-cfg-dot"></span>${t("dashScoreLabel")}: <strong>${escapeHtml(config.label_path)}</strong></div>`;
    html += `<div class="score-cfg-item"><span class="score-cfg-dot"></span>${t("dashScoreTarget")}: <strong>${escapeHtml(config.target_path)}</strong></div>`;
    html += `</div>`;
    display.innerHTML = html;
    deleteBtn.hidden = false;
  } else {
    display.innerHTML = `<span class="gdacs-aas-source-empty">${t("dashScoreEmpty")}</span>`;
    deleteBtn.hidden = true;
  }
  showScoreCfgStep(0);
  dashScoreSettingsModal.showModal();
});

document.getElementById("dash-score-settings-close").addEventListener("click", () => dashScoreSettingsModal.close());
dashScoreSettingsModal.addEventListener("click", (e) => { if (e.target === dashScoreSettingsModal) dashScoreSettingsModal.close(); });

// Configure → step 1
document.getElementById("score-cfg-configure-btn").addEventListener("click", async () => {
  scoreCfgGroupId = null;
  scoreCfgGroupName = "";
  scoreCfgSelectedAas = [];
  scoreCfgLabelPath = "";
  scoreCfgTargetPath = "";
  scoreCfgTreeCache = null;
  showScoreCfgStep(1);
  const res = await apiRequest("/apps/resilience/api/asset-groups");
  const list = document.getElementById("score-group-list");
  list.innerHTML = "";
  const groups = res.ok ? (res.payload.groups || []) : [];
  if (!groups.length) {
    list.innerHTML = `<span class="gdacs-aas-source-empty">${t("indWizardNoGroups")}</span>`;
    return;
  }
  for (const g of groups) {
    const btn = document.createElement("button");
    btn.className = "aas-cm-select-item";
    btn.textContent = `${g.name} (${g.member_count} AAS)`;
    btn.addEventListener("click", async () => {
      scoreCfgGroupId = g.group_id;
      scoreCfgGroupName = g.name;
      showScoreCfgStep(2);
      const mRes = await apiRequest(`/apps/resilience/api/asset-groups/${g.group_id}`);
      const members = mRes.ok ? (mRes.payload.members || []) : [];
      const aasList = document.getElementById("score-aas-list");
      aasList.innerHTML = "";
      for (const m of members) {
        const label = document.createElement("label");
        label.className = "score-checkbox-item";
        label.innerHTML = `<input type="checkbox" value="${escapeHtml(m.aas_id)}"><span>${escapeHtml(m.aas_id)}</span>`;
        aasList.appendChild(label);
      }
    });
    list.appendChild(btn);
  }
});

// Back button
document.getElementById("score-cfg-back-btn").addEventListener("click", () => {
  if (scoreCfgStep === 2) showScoreCfgStep(1);
  else if (scoreCfgStep === 3) showScoreCfgStep(2);
  else showScoreCfgStep(0);
});

// Next (step 2 → 3): show path selectors + load tree from first selected AAS
document.getElementById("score-cfg-next-btn").addEventListener("click", async () => {
  const checked = [...document.querySelectorAll("#score-aas-list input:checked")].map(cb => cb.value);
  if (!checked.length) return;
  scoreCfgSelectedAas = checked;
  scoreCfgLabelPath = "";
  scoreCfgTargetPath = "";
  showScoreCfgStep(3);
  updateScorePathRows();
  await loadScoreTree(checked[0]);
});

// Path button click (delegated)
document.getElementById("score-path-rows").addEventListener("click", (e) => {
  const btn = e.target.closest(".score-path-btn");
  if (!btn) return;
  scoreCfgActiveField = btn.dataset.field;
  const fieldLabel = scoreCfgActiveField === "label" ? t("dashScoreLabel") : t("dashScoreTarget");
  document.getElementById("score-tree-label").innerHTML = `<strong>${fieldLabel}</strong> — ${t("indWizardStep3bDesc")}`;
  document.getElementById("score-tree-area").hidden = false;
  // Highlight currently selected path
  document.getElementById("score-tree").querySelectorAll(".aas-cm-prop-selected").forEach(el => el.classList.remove("aas-cm-prop-selected"));
  const currentPath = scoreCfgActiveField === "label" ? scoreCfgLabelPath : scoreCfgTargetPath;
  if (currentPath) {
    const el = document.getElementById("score-tree").querySelector(`[data-idshort-path="${CSS.escape(currentPath)}"]`);
    if (el) el.classList.add("aas-cm-prop-selected");
  }
});

// Tree click handler
document.getElementById("score-tree").addEventListener("click", (e) => {
  const propEl = e.target.closest("[data-idshort-path]");
  if (!propEl || !scoreCfgActiveField) return;
  const path = propEl.dataset.idshortPath;

  // Update path
  if (scoreCfgActiveField === "label") scoreCfgLabelPath = path;
  else scoreCfgTargetPath = path;

  // Visual feedback
  document.getElementById("score-tree").querySelectorAll(".aas-cm-prop-selected").forEach(el => el.classList.remove("aas-cm-prop-selected"));
  propEl.classList.add("aas-cm-prop-selected");

  updateScorePathRows();
  scoreCfgActiveField = "";
  document.getElementById("score-tree-area").hidden = true;
});

// Save (step 3 → PUT config)
document.getElementById("score-cfg-save-btn").addEventListener("click", async () => {
  if (!scoreCfgLabelPath || !scoreCfgTargetPath) return;
  await apiRequest("/apps/resilience/api/score/dashboard-config", {
    method: "PUT",
    body: { config: { group_id: scoreCfgGroupId, aas_ids: scoreCfgSelectedAas, label_path: scoreCfgLabelPath, target_path: scoreCfgTargetPath } },
  });
  dashScoreSettingsModal.close();
  loadDashboard();
});

// Delete
document.getElementById("score-cfg-delete-btn").addEventListener("click", async () => {
  await apiRequest("/apps/resilience/api/score/dashboard-config", {
    method: "PUT", body: { config: {} },
  });
  dashScoreSettingsModal.close();
  loadDashboard();
});

// ── Wizard Logic ────────────────────────────────────────────────
function openIndWizard() {
  indWizardStep = 1;
  indWizardGroupId = null;
  indWizardGroupName = "";
  indWizardSelectedIndicators = [];
  indWizardCurrentIndIdx = 0;
  indWizardMappings = {};
  indWizardCurrentCondKey = null;
  indWizardCurrentCondType = null;
  indWizardLoadedTree = null;
  showIndWizardStep(1);
  loadIndWizardGroups();
  indWizardModal.showModal();
}

function showIndWizardStep(step) {
  indWizardStep = step;
  for (let s = 1; s <= 4; s++) {
    const el = document.getElementById(`ind-wizard-step-${s}`);
    if (el) el.hidden = s !== step;
  }
  // Step indicators
  document.querySelectorAll("#ind-wizard-steps .aas-cm-step").forEach(sp => {
    const s = parseInt(sp.dataset.step);
    sp.classList.toggle("active", s === step);
    sp.classList.toggle("done", s < step);
  });
  // Buttons
  const backBtn = document.getElementById("ind-wizard-back-btn");
  const nextBtn = document.getElementById("ind-wizard-next-btn");
  const saveBtn = document.getElementById("ind-wizard-save-btn");
  const cancelBtn = document.getElementById("ind-wizard-cancel-btn");
  backBtn.hidden = step <= 1;
  nextBtn.hidden = !(step === 2 || step === 3);
  saveBtn.hidden = step !== 4;
  cancelBtn.hidden = step === 4;
}

// Step 1: Groups
async function loadIndWizardGroups() {
  const res = await apiRequest("/apps/resilience/api/asset-groups");
  const list = document.getElementById("ind-wizard-group-list");
  const empty = document.getElementById("ind-wizard-group-empty");
  list.innerHTML = "";
  const groups = res.ok ? (res.payload.groups || []) : [];
  empty.hidden = groups.length > 0;
  for (const g of groups) {
    const btn = document.createElement("button");
    btn.className = "aas-cm-select-item";
    btn.textContent = `${g.name} (${g.member_count} AAS)`;
    btn.addEventListener("click", () => {
      indWizardGroupId = g.group_id;
      indWizardGroupName = g.name;
      showIndWizardStep(2);
      loadIndWizardIndicators();
    });
    list.appendChild(btn);
  }
}

// Step 2: Indicators (checkboxes)
async function loadIndWizardIndicators() {
  const res = await apiRequest("/apps/resilience/api/indicators");
  const list = document.getElementById("ind-wizard-indicator-list");
  const empty = document.getElementById("ind-wizard-indicator-empty");
  list.innerHTML = "";
  const indicators = res.ok ? (res.payload.indicators || []) : [];
  empty.hidden = indicators.length > 0;
  for (const ind of indicators) {
    const label = document.createElement("label");
    label.className = "ind-wizard-checkbox-item";
    label.innerHTML = `<input type="checkbox" value="${escapeHtml(ind.indicator_id)}"><span class="ind-wiz-name">${escapeHtml(ind.name)}</span><span class="ind-wiz-meta">${ind.group_count} ${ind.group_count === 1 ? "Gruppe" : "Gruppen"}</span>`;
    list.appendChild(label);
  }
}

// Next button (Step 2 → Step 3, Step 3 → advance mapping)
document.getElementById("ind-wizard-next-btn").addEventListener("click", async () => {
  if (indWizardStep === 3) {
    advanceIndWizardMapping();
    return;
  }
  if (indWizardStep === 2) {
    const checkboxes = document.querySelectorAll("#ind-wizard-indicator-list input[type=checkbox]:checked");
    if (!checkboxes.length) return;
    indWizardSelectedIndicators = [];
    for (const cb of checkboxes) {
      const id = cb.value;
      const res = await apiRequest(`/apps/resilience/api/indicators/${id}`);
      if (!res.ok) continue;
      const ind = res.payload;
      // Build flat list of all conditions with keys
      const conditions = [];
      for (let gi = 0; gi < (ind.groups || []).length; gi++) {
        const g = ind.groups[gi];
        for (let ci = 0; ci < (g.conditions || []).length; ci++) {
          const c = g.conditions[ci];
          conditions.push({
            key: `g${gi}_c${ci}`,
            input: c.input || "number",
            operator: c.operator || "==",
            value: c.value ?? "",
            groupLabel: g.output_label || `Gruppe ${gi + 1}`,
            groupColor: g.output_color || "#9ca3af",
          });
        }
      }
      indWizardSelectedIndicators.push({ indicator_id: id, name: ind.name, conditions });
      indWizardMappings[id] = { ref_aas_id: "", condition_mappings: {} };
    }
    indWizardCurrentIndIdx = 0;
    showIndWizardStep(3);
    showIndWizardMapping();
  }
});

// Show mapping for current indicator
function showIndWizardMapping() {
  const ind = indWizardSelectedIndicators[indWizardCurrentIndIdx];
  document.getElementById("ind-wizard-mapping-name").textContent = `${t("indWizardMappingFor")} ${ind.name}`;
  document.getElementById("ind-wizard-mapping-progress").textContent = `${indWizardCurrentIndIdx + 1} / ${indWizardSelectedIndicators.length}`;
  // Show AAS selection sub-step
  const aasSelect = document.getElementById("ind-wizard-aas-select");
  const inputMapping = document.getElementById("ind-wizard-input-mapping");
  aasSelect.hidden = false;
  inputMapping.hidden = true;
  loadIndWizardAasList();
}

// Step 3a: Load AAS items in group
async function loadIndWizardAasList() {
  const res = await apiRequest(`/apps/resilience/api/asset-groups/${indWizardGroupId}`);
  const list = document.getElementById("ind-wizard-aas-list");
  list.innerHTML = "";
  const members = res.ok ? (res.payload.members || []) : [];
  for (const m of members) {
    const btn = document.createElement("button");
    btn.className = "aas-cm-select-item";
    btn.textContent = m.aas_id;
    btn.addEventListener("click", () => {
      const ind = indWizardSelectedIndicators[indWizardCurrentIndIdx];
      indWizardMappings[ind.indicator_id].ref_aas_id = m.aas_id;
      // Move to input mapping
      document.getElementById("ind-wizard-aas-select").hidden = true;
      document.getElementById("ind-wizard-input-mapping").hidden = false;
      showIndWizardInputRows(m.aas_id);
    });
    list.appendChild(btn);
  }
}

// Step 3b: Condition mapping rows + tree
async function showIndWizardInputRows(aasId) {
  const ind = indWizardSelectedIndicators[indWizardCurrentIndIdx];
  const rowsContainer = document.getElementById("ind-wizard-input-rows");
  const treeArea = document.getElementById("ind-wizard-tree-area");
  treeArea.hidden = true;
  rowsContainer.innerHTML = "";

  // Build a row for each condition
  for (const cond of ind.conditions) {
    const row = document.createElement("div");
    row.className = "ind-wizard-input-row";
    row.dataset.condKey = cond.key;
    const existingPath = indWizardMappings[ind.indicator_id].condition_mappings[cond.key] || "";
    const opLabel = IND_OP_LABELS[cond.operator] || cond.operator;
    row.innerHTML =
      `<span class="iw-type-label">${escapeHtml(cond.input)}</span>` +
      `<span class="iw-cond-desc">${escapeHtml(opLabel)} ${escapeHtml(cond.value)}</span>` +
      `<span class="iw-path ${existingPath ? "iw-path-set" : ""}" data-cond-key="${escapeHtml(cond.key)}">${existingPath || t("indWizardSelectPath")}</span>` +
      `<button class="iw-select-btn" type="button" data-cond-key="${escapeHtml(cond.key)}" data-input-type="${escapeHtml(cond.input)}">${existingPath ? t("indWizardPathSet") : t("indWizardSelectPath")}</button>`;
    row.querySelector(".iw-select-btn").addEventListener("click", () => {
      indWizardCurrentCondKey = cond.key;
      indWizardCurrentCondType = cond.input;
      showIndWizardTree(aasId, cond.input);
    });
    rowsContainer.appendChild(row);
  }

  // If no conditions, auto-advance
  if (!ind.conditions.length) {
    advanceIndWizardMapping();
  }
}

async function showIndWizardTree(aasId, inputType) {
  const treeArea = document.getElementById("ind-wizard-tree-area");
  const treeEl = document.getElementById("ind-wizard-tree");
  const loading = document.getElementById("ind-wizard-tree-loading");
  const label = document.getElementById("ind-wizard-tree-label");
  treeArea.hidden = false;
  label.innerHTML = `<strong>${escapeHtml(inputType)}</strong> — ${t("indWizardStep3bDesc")}`;
  treeEl.innerHTML = "";
  loading.hidden = false;
  loading.textContent = t("indWizardTreeLoading");

  // Load tree (cache it)
  if (!indWizardLoadedTree || indWizardLoadedTree.aasId !== aasId) {
    const res = await apiRequest(`/apps/resilience/api/aas-import/${encodeURIComponent(aasId)}`);
    loading.hidden = true;
    if (!res.ok || !res.payload) {
      treeEl.innerHTML = `<p class="aas-cm-error">${t("indWizardTreeLoading")}</p>`;
      return;
    }
    indWizardLoadedTree = { aasId, submodels: res.payload.submodels || [] };
  } else {
    loading.hidden = true;
  }

  // Render tree with type filtering
  const submodels = indWizardLoadedTree.submodels;
  for (const sm of submodels) {
    const card = document.createElement("div");
    card.className = "aas-cm-sm-card";
    card.innerHTML = `<h4 class="aas-cm-sm-title">${escapeHtml(sm.idShort || sm.id)}</h4>`;
    const elHtml = renderSelectableEls(sm.submodelElements || [], 0, sm.idShort || "");
    card.insertAdjacentHTML("beforeend", elHtml);
    treeEl.appendChild(card);
  }

  // Mark incompatible items
  treeEl.querySelectorAll(".aas-cm-prop-item").forEach(item => {
    const vt = item.dataset.valueType || "";
    if (!indTypeCompatible(inputType, vt)) {
      item.classList.add("iw-disabled");
      item.title = t("indWizardTypeMismatch");
    }
  });
}

// Tree click handler for wizard
document.getElementById("ind-wizard-tree").addEventListener("click", (e) => {
  const propEl = e.target.closest("[data-idshort-path]");
  if (!propEl || propEl.classList.contains("iw-disabled")) return;
  const path = propEl.dataset.idshortPath;
  const condKey = indWizardCurrentCondKey;
  if (!condKey) return;

  const ind = indWizardSelectedIndicators[indWizardCurrentIndIdx];
  indWizardMappings[ind.indicator_id].condition_mappings[condKey] = path;

  // Update the row display
  const pathEl = document.querySelector(`.iw-path[data-cond-key="${condKey}"]`);
  if (pathEl) {
    pathEl.textContent = path;
    pathEl.classList.add("iw-path-set");
  }
  const selectBtn = document.querySelector(`.iw-select-btn[data-cond-key="${condKey}"]`);
  if (selectBtn) selectBtn.textContent = t("indWizardPathSet");

  // Hide tree
  document.getElementById("ind-wizard-tree-area").hidden = true;
  indWizardCurrentCondKey = null;
  indWizardCurrentCondType = null;

  // Check if all conditions mapped → auto-advance
  const allMapped = ind.conditions.every(c => indWizardMappings[ind.indicator_id].condition_mappings[c.key]);
  if (allMapped) {
    setTimeout(() => advanceIndWizardMapping(), 300);
  }
});

function advanceIndWizardMapping() {
  indWizardCurrentIndIdx++;
  indWizardLoadedTree = null;
  if (indWizardCurrentIndIdx < indWizardSelectedIndicators.length) {
    showIndWizardMapping();
  } else {
    // All mapped → Step 4
    showIndWizardStep(4);
    renderIndWizardSummary();
  }
}

// Step 4: Summary
function renderIndWizardSummary() {
  const container = document.getElementById("ind-wizard-summary");
  const successEl = document.getElementById("ind-wizard-success");
  successEl.hidden = true;
  container.hidden = false;
  let html = `<div class="dash-ind-config-group">${escapeHtml(indWizardGroupName)}</div>`;
  for (const ind of indWizardSelectedIndicators) {
    const m = indWizardMappings[ind.indicator_id];
    html += `<div class="ind-wizard-summary-card">`;
    html += `<h4>${escapeHtml(ind.name)}</h4>`;
    html += `<div class="iws-aas">${t("indWizardRefAas")}: ${escapeHtml(m.ref_aas_id)}</div>`;
    html += `<div class="iws-mapping">`;
    for (const cond of ind.conditions) {
      const path = m.condition_mappings[cond.key] || "–";
      const opLabel = IND_OP_LABELS[cond.operator] || cond.operator;
      html += `<span>${escapeHtml(cond.input)} ${escapeHtml(opLabel)} ${escapeHtml(cond.value)} → ${escapeHtml(path)}</span>`;
    }
    html += `</div></div>`;
  }
  container.innerHTML = html;
}

// Save button
document.getElementById("ind-wizard-save-btn").addEventListener("click", async () => {
  const btn = document.getElementById("ind-wizard-save-btn");
  btn.disabled = true;
  const config = {
    group_id: indWizardGroupId,
    indicators: indWizardSelectedIndicators.map(ind => ({
      indicator_id: ind.indicator_id,
      ref_aas_id: indWizardMappings[ind.indicator_id].ref_aas_id,
      condition_mappings: indWizardMappings[ind.indicator_id].condition_mappings,
    })),
  };
  const saveRes = await apiRequest("/apps/resilience/api/indicators/dashboard-config", {
    method: "PUT", body: { config },
  });
  btn.disabled = false;
  if (!saveRes.ok) {
    console.error("Indicator config save failed:", saveRes);
    return;
  }
  // Show success
  document.getElementById("ind-wizard-summary").hidden = true;
  document.getElementById("ind-wizard-success").hidden = false;
  document.getElementById("ind-wizard-save-btn").hidden = true;
  setTimeout(() => {
    indWizardModal.close();
    loadDashboard();
  }, 1200);
});

// Back button
document.getElementById("ind-wizard-back-btn").addEventListener("click", () => {
  if (indWizardStep === 2) {
    showIndWizardStep(1);
  } else if (indWizardStep === 3) {
    if (indWizardCurrentIndIdx > 0) {
      indWizardCurrentIndIdx--;
      indWizardLoadedTree = null;
      showIndWizardMapping();
    } else {
      showIndWizardStep(2);
    }
  } else if (indWizardStep === 4) {
    indWizardCurrentIndIdx = indWizardSelectedIndicators.length - 1;
    showIndWizardStep(3);
    showIndWizardMapping();
  }
});

// Cancel / Close
document.getElementById("ind-wizard-cancel-btn").addEventListener("click", () => indWizardModal.close());
document.getElementById("ind-wizard-close").addEventListener("click", () => indWizardModal.close());

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
      const coordTxt = a.centroid_lat != null ? `${a.centroid_lat.toFixed(2)}, ${a.centroid_lon.toFixed(2)}` : "\u2014";
      const polyBadge = a.polygon_fetched ? "\uD83D\uDDFA" : "";
      html += `<tr>
        <td style="width:32px;text-align:center;font-size:1.1rem">${icon}</td>
        <td style="font-weight:600">${escapeHtml(a.name || "-")}</td>
        <td><span class="alert-badge ${alertClass}">${escapeHtml(a.alertlevel)}</span></td>
        <td class="alerts-td-severity" style="color:var(--muted);font-size:0.78rem">${escapeHtml(a.severity || "-")}</td>
        <td style="font-size:0.72rem;color:var(--muted)">${coordTxt}</td>
        <td style="text-align:center;font-size:0.9rem" title="${a.polygon_fetched ? "Polygon" : ""}">${polyBadge}</td>
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
          <li><strong>Dashboard</strong> — Schnellübersicht mit News, GDACS Alerts und einer AAS-Risikotabelle mit farbigen Match-Qualitäts-Indikatoren.</li>
          <li><strong>News Feeds</strong> — Automatischer Abruf von Nachrichten aus konfigurierten RSS/Atom-Quellen.</li>
          <li><strong>GDACS Suche</strong> — Suche nach Naturkatastrophen weltweit über das Global Disaster Alert and Coordination System.</li>
          <li><strong>GDACS Alerts</strong> — Automatische Überwachung ausgewählter Länder auf Naturkatastrophen.</li>
          <li><strong>AAS Daten</strong> — Verwaltungsschalen importieren, in Gruppen organisieren und mit Geocoding-Koordinaten anreichern.</li>
          <li><strong>Geo-Matching</strong> — Smartes 3-Stufen-Matching (Polygon → Distanz → Land) zwischen GDACS-Alerts und AAS-Standorten.</li>
          <li><strong>Indikatoren</strong> — Definiere Resilienz-Indikatoren mit flexiblen UND/ODER-Regelgruppen.</li>
          <li><strong>Ländercodes</strong> — Mapping-Tabelle zwischen ISO-Codes, GDACS-Namen und AAS-Ländernamen.</li>
          <li><strong>AI Chat</strong> — KI-Assistent für Fragen zur App und den Daten.</li>
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
          <li><strong>Naturkatastrophen &amp; Lieferkettenrisiken</strong> — Zeigt AAS-Standorte mit zugeordneten Alerts. Konfigurierbare Spalten, Sortierung und Paginierung.</li>
        </ul>
        <h3>Alert-Chips mit Match-Qualität</h3>
        <p>Jeder Alert-Chip in der AAS-Tabelle zeigt die Genauigkeit der Zuordnung:</p>
        <ul>
          <li><span style="color:#059669">&#9679;</span> <strong>Grün (Polygon)</strong> — AAS-Standort liegt innerhalb des Alert-Polygons. Höchste Genauigkeit.</li>
          <li><span style="color:#d97706">&#9679;</span> <strong>Amber (Distanz)</strong> — AAS-Standort liegt innerhalb des konfigurierten Radius vom Alert-Zentroid.</li>
          <li><span style="color:#9ca3af">&#9679;</span> <strong>Grau (Land)</strong> — Zuordnung nur über Ländernamen. Niedrigste Genauigkeit.</li>
        </ul>
        <p>Alle drei Kacheln sind immer sichtbar, auch wenn keine Daten vorhanden sind.</p>
      `,
    },
    "aas-data": {
      title: "AAS Daten",
      html: `
        <h2>AAS Daten</h2>
        <p>Verwaltungsschalen-Daten (Asset Administration Shells) zu Lieferanten, Produkten und Materialien.</p>
        <h3>Übersicht</h3>
        <p>Die Übersicht zeigt alle importierten AAS IDs mit Quelle, Gruppe, Import-Status und Geocoding-Status.</p>
        <h3>Quellen</h3>
        <p>AAS-Quellen sind Server-Endpunkte (z.B. BaSyx-Server). Jede Quelle hat eine Basis-URL und eine Liste von AAS IDs und Item IDs.</p>
        <h3>Gruppen</h3>
        <p>AAS IDs können in Gruppen organisiert werden. Gruppen werden für die GDACS-Zuordnung und das Geo-Matching verwendet.</p>
        <h3>Zuordnung</h3>
        <p>Weise AAS IDs einer Gruppe zu. Die Zuordnung erfolgt über ein Dual-Panel-Interface mit verfügbaren und zugeordneten IDs.</p>
        <h3>Import</h3>
        <p>AAS-Daten werden im Hintergrund importiert. Der Import-Fortschritt wird in der Header-Leiste angezeigt. Ein Auto-Import-Intervall kann in den Einstellungen konfiguriert werden.</p>
        <h3>Geocoding</h3>
        <p>Über die Geocoding-Funktion werden AAS-Standorte mit Koordinaten angereichert:</p>
        <ol>
          <li>Wähle eine Gruppe und eine AAS aus.</li>
          <li>Navigiere im Submodel-Baum und wähle die Property für das <strong>Land</strong>.</li>
          <li>Wähle anschließend die Property für die <strong>Stadt</strong>.</li>
          <li>Klicke auf „Starten" — der Geocoding-Job läuft im Hintergrund über Nominatim.</li>
        </ol>
        <p>Die Koordinaten (Latitude/Longitude) werden als Geocoding-Submodel in der AAS gespeichert und für das Geo-Matching verwendet.</p>
      `,
    },
    "geo-matching": {
      title: "Geo-Matching",
      html: `
        <h2>GDACS-AAS Geo-Matching</h2>
        <p>Das Geo-Matching ordnet GDACS-Naturkatastrophen den AAS-Standorten zu — intelligent in drei Stufen.</p>
        <h3>3-Stufen-Matching</h3>
        <ol>
          <li><strong>Polygon-Match</strong> (höchste Genauigkeit) — Prüft ob die AAS-Koordinaten innerhalb des Alert-Polygons liegen. GDACS stellt für die meisten Alerts detaillierte Polygone bereit (Erdbeben-Intensitätszonen, Sturmradien, Überschwemmungsgebiete etc.).</li>
          <li><strong>Distanz-Match</strong> (mittlere Genauigkeit) — Berechnet die Entfernung (Haversine-Formel) zwischen AAS-Standort und Alert-Zentroid. Matcht wenn die Distanz unter dem konfigurierten Schwellwert liegt.</li>
          <li><strong>Land-Match</strong> (Fallback) — Klassisches Matching über ISO-Ländercodes. Wird verwendet wenn keine Koordinaten verfügbar sind.</li>
        </ol>
        <h3>Schwellwerte konfigurieren</h3>
        <p>In <strong>Einstellungen → GDACS → Matching-Radius</strong> kannst du pro Ereignistyp den Distanz-Schwellwert in km festlegen:</p>
        <ul>
          <li>🌍 <strong>EQ</strong> (Erdbeben) — Standard: 300 km</li>
          <li>🌀 <strong>TC</strong> (Sturm) — Standard: 500 km</li>
          <li>🌊 <strong>FL</strong> (Flut) — Standard: 200 km</li>
          <li>🌋 <strong>VO</strong> (Vulkan) — Standard: 100 km</li>
          <li>🔥 <strong>WF</strong> (Waldbrand) — Standard: 150 km</li>
          <li>☀️ <strong>DR</strong> (Dürre) — Standard: 1000 km</li>
        </ul>
        <h3>Matching-Parameter Wizard</h3>
        <p>Unter <strong>Einstellungen → GDACS → Matching-Parameter</strong> konfigurierst du 4 Pfade in einem Wizard:</p>
        <ol>
          <li><strong>Land</strong> — Pfad zum Ländernamen (optional, kann übersprungen werden)</li>
          <li><strong>Stadt</strong> — Pfad zum Stadtnamen (optional)</li>
          <li><strong>Latitude</strong> — Pfad zum Breitengrad (optional)</li>
          <li><strong>Longitude</strong> — Pfad zum Längengrad (optional)</li>
        </ol>
        <p>Das Matching nutzt pro AAS die beste verfügbare Genauigkeit:</p>
        <ul>
          <li><strong>Prio 1:</strong> Lat + Lon direkt vorhanden → Koordinaten-Matching</li>
          <li><strong>Prio 2:</strong> Stadt + Land → manuelles Geocoding → dann Koordinaten-Matching</li>
          <li><strong>Prio 3:</strong> Nur Land → ISO-Code-Vergleich</li>
        </ul>
        <h3>Automatische Berechnung</h3>
        <p>Die Matches werden automatisch neu berechnet nach:</p>
        <ul>
          <li>Neuen GDACS-Alert-Abrufen (inkl. Polygon-Fetch)</li>
          <li>Änderungen der Matching-Parameter</li>
          <li>Abschluss eines Geocoding-Jobs</li>
          <li>Änderung der Distanz-Schwellwerte</li>
        </ul>
      `,
    },
    "country-codes": {
      title: "Ländercodes",
      html: `
        <h2>Ländercodes</h2>
        <p>Die Ländercodes-Tabelle verwaltet das Mapping zwischen verschiedenen Namenskonventionen.</p>
        <h3>Spalten</h3>
        <ul>
          <li><strong>Alpha-2</strong> — ISO 3166-1 Alpha-2 Code (z.B. DE, US, TR)</li>
          <li><strong>Alpha-3</strong> — ISO 3166-1 Alpha-3 Code (z.B. DEU, USA, TUR)</li>
          <li><strong>Numeric</strong> — ISO 3166-1 numerischer Code</li>
          <li><strong>AAS</strong> — Ländername wie er in der AAS vorkommt</li>
          <li><strong>GDACS</strong> — Ländername wie er von GDACS verwendet wird</li>
        </ul>
        <h3>Funktionen</h3>
        <ul>
          <li><strong>Suche</strong> — Filtere die Tabelle nach beliebigem Text.</li>
          <li><strong>Import/Export</strong> — Sichere oder lade die Mappings als JSON-Datei.</li>
          <li><strong>AAS-Import</strong> — Übernimm Ländernamen automatisch aus importierten AAS-Daten.</li>
          <li><strong>Zurücksetzen</strong> — Setze alle Mappings auf die Standardwerte zurück.</li>
        </ul>
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
          <li><strong>Land hinzufügen</strong> — Gib einen englischen Ländernamen ein (z.B. „Germany"). Die Liste ist paginiert (10 pro Seite).</li>
          <li><strong>Matching-Parameter</strong> — Konfiguriere 4 Pfade (Land, Stadt, Lat, Lon) über den Wizard. Die Pfade werden für das 3-Stufen-Geo-Matching verwendet.</li>
          <li><strong>Matching-Radius</strong> — Konfiguriere pro Ereignistyp den Distanz-Schwellwert für das Geo-Matching.</li>
          <li><strong>Aufbewahrung / Intervall</strong> — Wie lange und wie oft GDACS-Daten abgerufen werden.</li>
        </ul>
        <h3>Dashboard Kachel-Einstellungen</h3>
        <ul>
          <li><strong>Match-Qualität Filter</strong> — Wähle welche Match-Typen (Polygon, Distanz, Land) auf dem Dashboard angezeigt werden.</li>
          <li><strong>Spaltenauswahl</strong> — Wähle AAS-Properties als Spalten. Ohne Spalten wird nur die AAS ID angezeigt.</li>
        </ul>
        <h3>AAS Import</h3>
        <ul>
          <li><strong>Auto-Import Intervall</strong> — Konfiguriere das automatische Import-Intervall (6/12/24 Std. oder Aus).</li>
        </ul>
        <h3>Ländercodes</h3>
        <p>Verwalte das Mapping zwischen ISO-Codes, AAS-Ländernamen und GDACS-Ländernamen.</p>
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
          <li><strong>Dashboard</strong> — Quick overview with news, GDACS alerts and an AAS risk table with colored match quality indicators.</li>
          <li><strong>News Feeds</strong> — Automatic retrieval of news from configured RSS/Atom sources.</li>
          <li><strong>GDACS Search</strong> — Search for natural disasters worldwide via the Global Disaster Alert and Coordination System.</li>
          <li><strong>GDACS Alerts</strong> — Automatic monitoring of selected countries for natural disasters.</li>
          <li><strong>AAS Data</strong> — Import asset administration shells, organize in groups and enrich with geocoding coordinates.</li>
          <li><strong>Geo-Matching</strong> — Smart 3-tier matching (polygon → distance → country) between GDACS alerts and AAS locations.</li>
          <li><strong>Indicators</strong> — Define resilience indicators with flexible AND/OR rule groups.</li>
          <li><strong>Country Codes</strong> — Mapping table between ISO codes, GDACS names and AAS country names.</li>
          <li><strong>AI Chat</strong> — AI assistant for questions about the app and data.</li>
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
          <li><strong>Natural Disasters &amp; Supply Chain Risks</strong> — Shows AAS locations with matched alerts. Configurable columns, sorting and pagination.</li>
        </ul>
        <h3>Alert Chips with Match Quality</h3>
        <p>Each alert chip in the AAS table shows the matching accuracy:</p>
        <ul>
          <li><span style="color:#059669">&#9679;</span> <strong>Green (Polygon)</strong> — AAS location is within the alert polygon. Highest accuracy.</li>
          <li><span style="color:#d97706">&#9679;</span> <strong>Amber (Distance)</strong> — AAS location is within the configured radius of the alert centroid.</li>
          <li><span style="color:#9ca3af">&#9679;</span> <strong>Gray (Country)</strong> — Matching only by country name. Lowest accuracy.</li>
        </ul>
        <p>All three tiles are always visible, even when no data is available.</p>
      `,
    },
    "aas-data": {
      title: "AAS Data",
      html: `
        <h2>AAS Data</h2>
        <p>Asset Administration Shell data for suppliers, products and materials.</p>
        <h3>Overview</h3>
        <p>The overview shows all imported AAS IDs with source, group, import status and geocoding status.</p>
        <h3>Sources</h3>
        <p>AAS sources are server endpoints (e.g. BaSyx servers). Each source has a base URL and a list of AAS IDs and Item IDs.</p>
        <h3>Groups</h3>
        <p>AAS IDs can be organized into groups. Groups are used for GDACS mapping and geo-matching.</p>
        <h3>Assignment</h3>
        <p>Assign AAS IDs to a group via a dual-panel interface with available and assigned IDs.</p>
        <h3>Import</h3>
        <p>AAS data is imported in the background. Import progress is shown in the header bar. An auto-import interval can be configured in settings.</p>
        <h3>Geocoding</h3>
        <p>The geocoding feature enriches AAS locations with coordinates:</p>
        <ol>
          <li>Select a group and an AAS.</li>
          <li>Navigate the submodel tree and select the property for the <strong>country</strong>.</li>
          <li>Then select the property for the <strong>city</strong>.</li>
          <li>Click "Start" — the geocoding job runs in the background via Nominatim.</li>
        </ol>
        <p>The coordinates (latitude/longitude) are stored as a Geocoding submodel in the AAS and used for geo-matching.</p>
      `,
    },
    "geo-matching": {
      title: "Geo-Matching",
      html: `
        <h2>GDACS-AAS Geo-Matching</h2>
        <p>Geo-matching assigns GDACS natural disasters to AAS locations — intelligently in three tiers.</p>
        <h3>3-Tier Matching</h3>
        <ol>
          <li><strong>Polygon Match</strong> (highest accuracy) — Checks if the AAS coordinates are within the alert polygon. GDACS provides detailed polygons for most alerts (earthquake intensity zones, storm radii, flood areas, etc.).</li>
          <li><strong>Distance Match</strong> (medium accuracy) — Calculates the distance (Haversine formula) between AAS location and alert centroid. Matches if the distance is below the configured threshold.</li>
          <li><strong>Country Match</strong> (fallback) — Classic matching via ISO country codes. Used when no coordinates are available.</li>
        </ol>
        <h3>Configure Thresholds</h3>
        <p>In <strong>Settings → GDACS → Matching Radius</strong> you can set the distance threshold per event type in km:</p>
        <ul>
          <li>🌍 <strong>EQ</strong> (Earthquake) — Default: 300 km</li>
          <li>🌀 <strong>TC</strong> (Cyclone) — Default: 500 km</li>
          <li>🌊 <strong>FL</strong> (Flood) — Default: 200 km</li>
          <li>🌋 <strong>VO</strong> (Volcano) — Default: 100 km</li>
          <li>🔥 <strong>WF</strong> (Wildfire) — Default: 150 km</li>
          <li>☀️ <strong>DR</strong> (Drought) — Default: 1000 km</li>
        </ul>
        <h3>Matching Parameter Wizard</h3>
        <p>Under <strong>Settings → GDACS → Matching Parameters</strong> you configure 4 paths in a wizard:</p>
        <ol>
          <li><strong>Country</strong> — Path to country name (optional, can be skipped)</li>
          <li><strong>City</strong> — Path to city name (optional)</li>
          <li><strong>Latitude</strong> — Path to latitude value (optional)</li>
          <li><strong>Longitude</strong> — Path to longitude value (optional)</li>
        </ol>
        <p>The matching uses the best available accuracy per AAS:</p>
        <ul>
          <li><strong>Priority 1:</strong> Lat + Lon directly available → coordinate matching</li>
          <li><strong>Priority 2:</strong> City + Country → manual geocoding → then coordinate matching</li>
          <li><strong>Priority 3:</strong> Only country → ISO code comparison</li>
        </ul>
        <h3>Automatic Computation</h3>
        <p>Matches are automatically recomputed after:</p>
        <ul>
          <li>New GDACS alert fetches (including polygon fetch)</li>
          <li>Changes to matching parameters</li>
          <li>Completion of a geocoding job</li>
          <li>Changes to distance thresholds</li>
        </ul>
      `,
    },
    "country-codes": {
      title: "Country Codes",
      html: `
        <h2>Country Codes</h2>
        <p>The country codes table manages the mapping between different naming conventions.</p>
        <h3>Columns</h3>
        <ul>
          <li><strong>Alpha-2</strong> — ISO 3166-1 Alpha-2 code (e.g. DE, US, TR)</li>
          <li><strong>Alpha-3</strong> — ISO 3166-1 Alpha-3 code (e.g. DEU, USA, TUR)</li>
          <li><strong>Numeric</strong> — ISO 3166-1 numeric code</li>
          <li><strong>AAS</strong> — Country name as used in the AAS</li>
          <li><strong>GDACS</strong> — Country name as used by GDACS</li>
        </ul>
        <h3>Functions</h3>
        <ul>
          <li><strong>Search</strong> — Filter the table by any text.</li>
          <li><strong>Import/Export</strong> — Backup or load mappings as JSON file.</li>
          <li><strong>AAS Import</strong> — Automatically import country names from imported AAS data.</li>
          <li><strong>Reset</strong> — Reset all mappings to default values.</li>
        </ul>
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
          <li><strong>Add Country</strong> — Enter an English country name (e.g. "Germany"). The list is paginated (10 per page).</li>
          <li><strong>Matching Parameters</strong> — Configure 4 paths (Country, City, Lat, Lon) via the wizard. Paths are used for 3-tier geo-matching.</li>
          <li><strong>Matching Radius</strong> — Configure per-event-type distance thresholds for geo-matching.</li>
          <li><strong>Retention / Interval</strong> — How long and how often GDACS data is fetched.</li>
        </ul>
        <h3>Dashboard Tile Settings</h3>
        <ul>
          <li><strong>Match Quality Filter</strong> — Choose which match types (Polygon, Distance, Country) are shown on the dashboard.</li>
          <li><strong>Column Selection</strong> — Choose AAS properties as columns. Without columns, only AAS ID is shown.</li>
        </ul>
        <h3>AAS Import</h3>
        <ul>
          <li><strong>Auto-Import Interval</strong> — Configure the automatic import interval (6/12/24 hours or Off).</li>
        </ul>
        <h3>Country Codes</h3>
        <p>Manage the mapping between ISO codes, AAS country names and GDACS country names.</p>
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

  // Preload settings so match filter, columns + matching display are ready before first dashboard load
  const preSettings = await apiRequest("/apps/resilience/api/settings");
  if (preSettings.ok && preSettings.payload) {
    const ps = preSettings.payload;
    cachedDashMatchFilter = ps.dash_aas_match_filter || ["polygon", "distance"];
    updateGdacsColsDisplay(ps.gdacs_aas_columns || []);
    if (ps.matching_group_id) {
      updateMatchingDisplay(ps.matching_group_name || ps.matching_group_id, {
        country: ps.matching_country_path || "", city: ps.matching_city_path || "",
        lat: ps.matching_lat_path || "", lon: ps.matching_lon_path || "",
      });
    }
  }

  navigateTo("dashboard");
}

init();

// ======================= CHAT WIDGET =======================

(async function initChatWidget() {
  const CW_CHAT_KEY = "resilience_cw_chatId";
  const cwArea = document.getElementById("chat-widget-area");
  const cwToggle = document.getElementById("chat-widget-toggle");
  const cwPanel = document.getElementById("chat-widget");
  const cwMessages = document.getElementById("chat-widget-messages");
  const cwForm = document.getElementById("chat-widget-form");
  const cwInput = document.getElementById("chat-widget-input");
  const cwSend = document.getElementById("chat-widget-send");
  const cwClear = document.getElementById("chat-widget-clear");
  const cwTag = document.getElementById("chat-widget-connector-tag");
  const cwModeToggle = document.getElementById("cw-mode-toggle");
  const cwModeLabel = document.getElementById("cw-mode-label");
  const cwSlashMenu = document.getElementById("cw-slash-menu");

  if (!cwArea) return;

  let cwChatId = localStorage.getItem(CW_CHAT_KEY) || null;
  let cwSending = false;
  let cwMode = "tools";
  let cwToolList = [];
  let cwSlashItems = [];
  let cwSlashIndex = 0;
  let cwSlashSelected = null;
  let cwProviderIsGemini = false;
  let cwInitialized = false;

  // 1. Check if user has AAS Chat access + API key
  try {
    const appsRes = await fetch("/api/apps", { credentials: "same-origin" });
    if (!appsRes.ok) return;
    const appsData = await appsRes.json();
    if (!(appsData.apps || []).some(a => a.id === "aas-chat")) return;

    const settingsRes = await fetch("/apps/aas-chat/api/settings", { credentials: "same-origin" });
    if (!settingsRes.ok) return;
    const settings = await settingsRes.json();
    if (!settings.has_api_key) return;
    cwProviderIsGemini = settings.provider === "gemini";
  } catch { return; }

  cwArea.hidden = false;

  // Load tool list for slash commands
  async function cwLoadTools() {
    try {
      const [aasRes, dtiRes] = await Promise.allSettled([
        fetch("/apps/aas-chat/api/mcp-tools", { credentials: "same-origin" }).then(r => r.ok ? r.json() : { tools: [] }),
        fetch("/apps/aas-chat/api/dti-tools", { credentials: "same-origin" }).then(r => r.ok ? r.json() : { tools: [] }),
      ]);
      const aas = aasRes.status === "fulfilled" ? (aasRes.value.tools || []) : [];
      const dti = dtiRes.status === "fulfilled" ? (dtiRes.value.tools || []) : [];
      cwToolList = [...aas, ...dti];
    } catch { cwToolList = []; }
  }

  // Ensure chat exists
  async function ensureChat() {
    if (cwChatId) {
      const res = await fetch("/apps/aas-chat/api/chats", { credentials: "same-origin" });
      if (res.ok) {
        const data = await res.json();
        if ((data.chats || []).some(c => c.chat_id === cwChatId)) return;
      }
    }
    const res = await fetch("/apps/aas-chat/api/chats", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Resilience Widget" })
    });
    if (res.ok) {
      const data = await res.json();
      cwChatId = data.chat_id;
      localStorage.setItem(CW_CHAT_KEY, cwChatId);
    }
  }

  // Load persisted messages
  async function cwLoadMessages() {
    if (!cwChatId) return;
    try {
      const res = await fetch(`/apps/aas-chat/api/messages?chatId=${cwChatId}`, { credentials: "same-origin" });
      if (!res.ok) return;
      const data = await res.json();
      cwMessages.innerHTML = "";
      for (const msg of data.messages || []) {
        cwAppendMsg(msg.role, msg.content);
      }
      cwMessages.scrollTop = cwMessages.scrollHeight;
    } catch { /* ignore */ }
  }

  // Restore connector tag
  async function cwRestoreTag() {
    if (!cwChatId) return;
    try {
      const res = await fetch(`/apps/aas-chat/api/connector-status?chatId=${cwChatId}`, { credentials: "same-origin" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.connected && data.name) {
        cwTag.textContent = data.name;
        cwTag.hidden = false;
      } else {
        cwTag.hidden = true;
      }
    } catch { cwTag.hidden = true; }
  }

  function cwEscape(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function cwAppendMsg(role, text) {
    const div = document.createElement("div");
    div.className = "cw-msg " + role;
    div.innerHTML = cwEscape(text);
    cwMessages.appendChild(div);
    return div;
  }

  // --- Mode toggle ---
  cwModeToggle.addEventListener("click", () => {
    cwMode = cwMode === "tools" ? "search" : "tools";
    cwModeLabel.textContent = cwMode === "tools" ? "MCP" : "WEB";
    cwModeToggle.classList.toggle("mode-web", cwMode === "search");
  });

  // --- Slash command menu ---
  function cwShowSlash() { cwSlashMenu.hidden = false; }
  function cwHideSlash() { cwSlashMenu.hidden = true; cwSlashItems = []; }

  function cwRenderSlash() {
    cwSlashMenu.innerHTML = "";
    cwSlashItems.forEach((tool, i) => {
      const div = document.createElement("div");
      div.className = "cw-slash-item" + (i === cwSlashIndex ? " active" : "");
      div.textContent = "/" + tool.name;
      div.addEventListener("mousedown", (e) => { e.preventDefault(); cwSelectSlash(i); });
      cwSlashMenu.appendChild(div);
    });
  }

  function cwSelectSlash(idx) {
    const tool = cwSlashItems[idx];
    if (!tool) return;
    cwSlashSelected = tool.name;
    cwInput.value = "/" + tool.name + " ";
    cwInput.focus();
    cwHideSlash();
    cwSend.disabled = false;
  }

  function cwHandleSlash() {
    const val = cwInput.value;
    if (cwSlashSelected) { cwHideSlash(); return; }
    if (!val.startsWith("/")) { cwHideSlash(); return; }
    if (val.indexOf(" ") > 0) { cwHideSlash(); return; }
    const query = val.slice(1).toLowerCase();
    cwSlashItems = cwToolList.filter(t => t.name.toLowerCase().includes(query));
    if (!cwSlashItems.length) { cwHideSlash(); return; }
    cwSlashIndex = 0;
    cwRenderSlash();
    cwShowSlash();
  }

  // --- Toggle open/close ---
  cwToggle.addEventListener("click", async () => {
    const isOpen = !cwPanel.hidden;
    cwPanel.hidden = isOpen;
    cwToggle.classList.toggle("open", !isOpen);
    if (!isOpen) {
      if (!cwInitialized) {
        cwInitialized = true;
        await Promise.all([ensureChat(), cwLoadTools()]);
      } else {
        await ensureChat();
      }
      await cwLoadMessages();
      await cwRestoreTag();
      cwInput.focus();
    }
  });

  // --- Auto-resize + slash ---
  cwInput.addEventListener("input", () => {
    cwSend.disabled = !cwInput.value.trim();
    cwInput.style.height = "auto";
    cwInput.style.height = Math.min(cwInput.scrollHeight, 80) + "px";
    if (cwSlashSelected && !cwInput.value.startsWith("/" + cwSlashSelected)) {
      cwSlashSelected = null;
    }
    cwHandleSlash();
  });

  // --- Send message ---
  async function cwSendMessage() {
    const text = cwInput.value.trim();
    if (!text || cwSending) return;

    let forceTool = null;
    let sendContent = text;
    const slashMatch = text.match(/^\/(\S+)(?:\s+([\s\S]+))?$/);
    if (slashMatch && cwToolList.some(t => t.name === slashMatch[1])) {
      forceTool = slashMatch[1];
      sendContent = slashMatch[2] || "";
    }
    cwSlashSelected = null;

    cwSending = true;
    cwSend.disabled = true;
    cwInput.value = "";
    cwInput.style.height = "auto";
    cwHideSlash();

    cwAppendMsg("user", text);
    cwMessages.scrollTop = cwMessages.scrollHeight;

    const typing = document.createElement("div");
    typing.className = "cw-typing";
    typing.textContent = "...";
    cwMessages.appendChild(typing);
    cwMessages.scrollTop = cwMessages.scrollHeight;

    try {
      await ensureChat();
      const body = { chatId: cwChatId, content: sendContent, mode: cwMode };
      if (forceTool) body.forceTool = forceTool;

      const res = await fetch("/apps/aas-chat/api/messages", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      typing.remove();

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          cwAppendMsg("assistant", data.reply);
        }
        if (data.connectorEvent) {
          if (data.connectorEvent.action === "connect" && data.connectorEvent.name) {
            cwTag.textContent = data.connectorEvent.name;
            cwTag.hidden = false;
          } else if (data.connectorEvent.action === "disconnect") {
            cwTag.hidden = true;
          }
        }
      } else {
        let errMsg = "Fehler";
        try { const err = await res.json(); errMsg = err.error || errMsg; } catch { /* ignore */ }
        cwAppendMsg("error", errMsg);
      }
    } catch {
      typing.remove();
      cwAppendMsg("error", "Netzwerkfehler");
    }

    cwMessages.scrollTop = cwMessages.scrollHeight;
    cwSending = false;
    cwSend.disabled = !cwInput.value.trim();
  }

  cwForm.addEventListener("submit", (e) => {
    e.preventDefault();
    cwSendMessage();
  });

  // --- Keyboard navigation ---
  cwInput.addEventListener("keydown", (e) => {
    if (!cwSlashMenu.hidden && cwSlashItems.length) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        cwSlashIndex = (cwSlashIndex + 1) % cwSlashItems.length;
        cwRenderSlash();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        cwSlashIndex = (cwSlashIndex - 1 + cwSlashItems.length) % cwSlashItems.length;
        cwRenderSlash();
        return;
      }
      if (e.key === "Tab" || (e.key === "Enter" && cwSlashItems.length)) {
        e.preventDefault();
        cwSelectSlash(cwSlashIndex);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        cwHideSlash();
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      cwSendMessage();
    }
  });

  // --- Clear chat ---
  cwClear.addEventListener("click", async () => {
    if (!cwChatId) return;
    try {
      await fetch(`/apps/aas-chat/api/messages?chatId=${cwChatId}`, {
        method: "DELETE",
        credentials: "same-origin"
      });
    } catch { /* ignore */ }
    cwMessages.innerHTML = "";
    cwTag.hidden = true;
  });

})(); // end initChatWidget

// ======================= SIMULATION WIZARD =======================

const SIM_MATERIALS = [
  { id: "alu", name: "Aluminium-Gehäuse", supplier: "MetalWorks GmbH, Stuttgart", qty: "2.400 Einheiten/Monat", delivery: "KW 12–14, 2026" },
  { id: "lithium", name: "Lithium-Zellen", supplier: "BatteryTech AG, München", qty: "5.000 Zellen/Monat", delivery: "KW 10–12, 2026" },
  { id: "copper", name: "Kupfer-Leiterplatten", supplier: "CircuitPro Ltd, Shenzhen", qty: "8.000 Stück/Monat", delivery: "KW 13–16, 2026" },
  { id: "steel", name: "Stahl-Chassis", supplier: "SteelForge GmbH, Essen", qty: "1.200 Einheiten/Monat", delivery: "KW 11–13, 2026" },
];

const SIM_DISRUPTIONS = [
  { id: "outage", icon: "\u26A0\uFE0F", nameDE: "Lieferausfall", nameEN: "Supplier outage", descDE: "Lieferant fällt 4 Wochen komplett aus", descEN: "Supplier unavailable for 4 weeks" },
  { id: "delay", icon: "\uD83D\uDE9A", nameDE: "Transportverzögerung", nameEN: "Transport delay", descDE: "+2 Wochen Lieferzeit", descEN: "+2 weeks delivery time" },
  { id: "quality", icon: "\uD83D\uDD0D", nameDE: "Qualitätsmangel", nameEN: "Quality issue", descDE: "20% Ausschuss-Quote", descEN: "20% rejection rate" },
  { id: "demand", icon: "\uD83D\uDCC8", nameDE: "Nachfrageanstieg", nameEN: "Demand surge", descDE: "+50% Bestellmenge unerwartet", descEN: "+50% unexpected order volume" },
  { id: "scarcity", icon: "\uD83E\uDEA8", nameDE: "Rohstoffknappheit", nameEN: "Raw material scarcity", descDE: "Preis +35%, Menge \u221225%", descEN: "Price +35%, quantity \u221225%" },
];

const SIM_MEASURES = [
  { id: "alt-supplier", icon: "\uD83D\uDD04", nameDE: "Alternativ-Lieferant", nameEN: "Alternative supplier", descDE: "Zweiten Lieferanten aktivieren", descEN: "Activate second supplier" },
  { id: "express", icon: "\u26A1", nameDE: "Expresslieferung", nameEN: "Express delivery", descDE: "Schnellere Lieferung (+Kosten)", descEN: "Faster delivery (+cost)" },
  { id: "stock", icon: "\uD83D\uDCE6", nameDE: "Lagerbestand erhöhen", nameEN: "Increase stock", descDE: "Sicherheitsbestand aufstocken", descEN: "Increase safety stock" },
  { id: "reduce", icon: "\uD83D\uDCC9", nameDE: "Bestellmenge reduzieren", nameEN: "Reduce order qty", descDE: "Bestellvolumen anpassen", descEN: "Adjust order volume" },
  { id: "replan", icon: "\uD83D\uDCCB", nameDE: "Produktionsplan anpassen", nameEN: "Adjust production", descDE: "Zeitplan flexibilisieren", descEN: "Flexible scheduling" },
];

let simStep = 0;
let simMaterial = null;
let simDisruptions = new Set();
let simMeasures = new Set();
let simResults = null;
let simCompareResults = null;

const simContent = document.getElementById("sim-content");
const simLoading = document.getElementById("sim-loading");
const simLoadingFill = document.getElementById("sim-loading-fill");
const simLoadingText = document.getElementById("sim-loading-text");
const simBackBtn = document.getElementById("sim-back-btn");
const simNextBtn = document.getElementById("sim-next-btn");
const simResimBtn = document.getElementById("sim-resim-btn");
const simFooter = document.getElementById("sim-footer");

function updateSimStepper() {
  document.querySelectorAll("#sim-steps .sim-step").forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.toggle("active", s === simStep);
    el.classList.toggle("done", s < simStep);
  });
  document.querySelectorAll("#sim-steps .sim-step-label").forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.toggle("active", s === simStep);
    el.classList.toggle("done", s < simStep);
    if (s === 0) el.textContent = t("simStep1");
    if (s === 1) el.textContent = t("simStep2");
    if (s === 2) el.textContent = t("simStep3");
  });
  document.querySelectorAll("#sim-steps .sim-step-line").forEach((el, i) => {
    el.classList.toggle("done", i < simStep);
  });
}

function renderSimStep(step) {
  simStep = step;
  updateSimStepper();
  simContent.style.animation = "none";
  void simContent.offsetHeight;
  simContent.style.animation = "";

  if (step === 0) renderSimCalibration();
  else if (step === 1) renderSimDisruptions();
  else if (step === 2) renderSimMeasuresStep();

  // Footer buttons
  simBackBtn.hidden = step === 0;
  simBackBtn.textContent = t("simBack");

  // Re-simulate button: visible after results are shown in step 1 or 2
  simResimBtn.hidden = !((step === 1 && simResults) || (step === 2 && simCompareResults));
  simResimBtn.textContent = t("simResimulate");

  if (step === 0) {
    simNextBtn.textContent = t("simNext");
    simNextBtn.hidden = false;
    simNextBtn.className = "btn btn-primary btn-sm";
  } else if (step === 1 && !simResults) {
    simNextBtn.textContent = t("simStartSim");
    simNextBtn.hidden = false;
    simNextBtn.className = "btn btn-primary btn-sm";
  } else if (step === 1 && simResults) {
    simNextBtn.textContent = t("simNext");
    simNextBtn.hidden = false;
    simNextBtn.className = "btn btn-primary btn-sm";
  } else if (step === 2 && !simCompareResults) {
    simNextBtn.textContent = t("simWithMeasures");
    simNextBtn.hidden = false;
    simNextBtn.className = "btn btn-primary btn-sm";
  } else if (step === 2 && simCompareResults) {
    simNextBtn.textContent = t("simFinish");
    simNextBtn.hidden = false;
    simNextBtn.className = "btn btn-secondary btn-sm";
  }
}

function renderSimCalibration() {
  const mat = simMaterial || SIM_MATERIALS[0];
  simMaterial = mat;
  let html = "";

  // Material selection
  html += `<div class="sim-section">`;
  html += `<div class="sim-section-title">${t("simMaterial")}</div>`;
  html += `<select class="sim-select" id="sim-material-select">`;
  SIM_MATERIALS.forEach(m => {
    html += `<option value="${m.id}" ${m.id === mat.id ? "selected" : ""}>${escapeHtml(m.name)}</option>`;
  });
  html += `</select>`;
  html += `<div class="sim-info-cards" id="sim-info-cards">`;
  html += renderInfoCards(mat);
  html += `</div></div>`;

  // Order data
  html += `<div class="sim-section">`;
  html += `<div class="sim-section-title">${t("simOrderData")}</div>`;
  html += `<div class="sim-form-grid">`;
  html += formRow(t("simOrderMaterial"), "sim-order-mat", "text", "4.800 Einheiten");
  html += formRow(t("simOrderQty"), "sim-order-qty", "text", "1.200 Einheiten");
  html += formRow(t("simOrderDate"), "sim-order-date", "date", "2026-03-15");
  html += `</div></div>`;

  // Simulation params
  html += `<div class="sim-section">`;
  html += `<div class="sim-section-title">${t("simParams")}</div>`;
  html += `<div class="sim-form-grid">`;
  html += formRow(t("simStock"), "sim-stock", "text", "800 Einheiten");
  html += formSelect(t("simBuffer"), "sim-buffer", ["10%", "20%", "30%"], 1);
  html += formSelect(t("simReliability"), "sim-reliability", ["85%", "90%", "95%", "99%"], 2);
  html += `</div></div>`;

  simContent.innerHTML = html;

  document.getElementById("sim-material-select").addEventListener("change", (e) => {
    simMaterial = SIM_MATERIALS.find(m => m.id === e.target.value) || SIM_MATERIALS[0];
    const cards = document.getElementById("sim-info-cards");
    cards.innerHTML = renderInfoCards(simMaterial);
  });
}

function renderInfoCards(mat) {
  return `
    <div class="sim-info-card">
      <div class="sim-info-card-icon">\uD83C\uDFED</div>
      <div class="sim-info-card-label">${t("simSupplier")}</div>
      <div class="sim-info-card-value">${escapeHtml(mat.supplier)}</div>
    </div>
    <div class="sim-info-card">
      <div class="sim-info-card-icon">\uD83D\uDCE6</div>
      <div class="sim-info-card-label">${t("simQty")}</div>
      <div class="sim-info-card-value">${escapeHtml(mat.qty)}</div>
    </div>
    <div class="sim-info-card">
      <div class="sim-info-card-icon">\uD83D\uDCC5</div>
      <div class="sim-info-card-label">${t("simDelivery")}</div>
      <div class="sim-info-card-value">${escapeHtml(mat.delivery)}</div>
    </div>`;
}

function formRow(label, id, type, value) {
  return `<div class="sim-form-row">
    <label class="sim-form-label" for="${id}">${label}</label>
    <input class="sim-form-input" id="${id}" type="${type}" value="${escapeHtml(value)}" />
  </div>`;
}

function formSelect(label, id, options, selectedIdx) {
  let html = `<div class="sim-form-row">
    <label class="sim-form-label" for="${id}">${label}</label>
    <select class="sim-form-input" id="${id}">`;
  options.forEach((o, i) => { html += `<option ${i === selectedIdx ? "selected" : ""}>${o}</option>`; });
  html += `</select></div>`;
  return html;
}

function renderSimDisruptions() {
  const isDE = locale === "de";
  let html = `<div class="sim-section">`;
  html += `<div class="sim-section-title">${t("simStep2")}</div>`;
  html += `<p style="font-size:0.82rem;color:var(--text-2);margin:0 0 0.75rem">${t("simSelectDisruptions")}</p>`;
  html += `<div class="sim-option-grid">`;
  SIM_DISRUPTIONS.forEach(d => {
    const sel = simDisruptions.has(d.id);
    html += `<div class="sim-option-card${sel ? " selected" : ""}" data-id="${d.id}">
      <input type="checkbox" class="sim-option-check" ${sel ? "checked" : ""} />
      <span class="sim-option-icon">${d.icon}</span>
      <div class="sim-option-body">
        <div class="sim-option-name">${escapeHtml(isDE ? d.nameDE : d.nameEN)}</div>
        <div class="sim-option-desc">${escapeHtml(isDE ? d.descDE : d.descEN)}</div>
      </div>
    </div>`;
  });
  html += `</div></div>`;

  if (simResults) {
    html += renderResultsHTML(simResults, t("simResults"));
  }

  simContent.innerHTML = html;

  simContent.querySelectorAll(".sim-option-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      if (simDisruptions.has(id)) simDisruptions.delete(id); else simDisruptions.add(id);
      card.classList.toggle("selected");
      card.querySelector(".sim-option-check").checked = simDisruptions.has(id);
    });
  });
}

function renderSimMeasuresStep() {
  const isDE = locale === "de";
  let html = `<div class="sim-section">`;
  html += `<div class="sim-section-title">${t("simStep3")}</div>`;
  html += `<p style="font-size:0.82rem;color:var(--text-2);margin:0 0 0.75rem">${t("simSelectMeasures")}</p>`;
  html += `<div class="sim-option-grid">`;
  SIM_MEASURES.forEach(m => {
    const sel = simMeasures.has(m.id);
    html += `<div class="sim-option-card${sel ? " selected" : ""}" data-id="${m.id}">
      <input type="checkbox" class="sim-option-check" ${sel ? "checked" : ""} />
      <span class="sim-option-icon">${m.icon}</span>
      <div class="sim-option-body">
        <div class="sim-option-name">${escapeHtml(isDE ? m.nameDE : m.nameEN)}</div>
        <div class="sim-option-desc">${escapeHtml(isDE ? m.descDE : m.descEN)}</div>
      </div>
    </div>`;
  });
  html += `</div></div>`;

  if (simCompareResults) {
    html += renderComparisonHTML(simResults, simCompareResults);
  }

  simContent.innerHTML = html;

  simContent.querySelectorAll(".sim-option-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      if (simMeasures.has(id)) simMeasures.delete(id); else simMeasures.add(id);
      card.classList.toggle("selected");
      card.querySelector(".sim-option-check").checked = simMeasures.has(id);
    });
  });
}

function generateFakeResults(disruptions) {
  let delay = 0, cost = 0, fulfill = 98, risk = 1.2;
  if (disruptions.has("outage")) { delay += 18; cost += 8400; fulfill -= 22; risk += 2.8; }
  if (disruptions.has("delay")) { delay += 9; cost += 3200; fulfill -= 8; risk += 1.5; }
  if (disruptions.has("quality")) { delay += 5; cost += 4800; fulfill -= 12; risk += 1.2; }
  if (disruptions.has("demand")) { delay += 7; cost += 6100; fulfill -= 15; risk += 1.8; }
  if (disruptions.has("scarcity")) { delay += 4; cost += 5600; fulfill -= 10; risk += 1.4; }
  fulfill = Math.max(fulfill, 15);
  risk = Math.min(risk, 9.5);
  return { delay, cost, fulfill, risk: Math.round(risk * 10) / 10 };
}

function generateFakeComparison(disruptions, measures) {
  const base = generateFakeResults(disruptions);
  let dReduce = 0, cReduce = 0, fBoost = 0, rReduce = 0;
  if (measures.has("alt-supplier")) { dReduce += 8; cReduce += 2000; fBoost += 12; rReduce += 1.5; }
  if (measures.has("express")) { dReduce += 5; cReduce -= 1200; fBoost += 6; rReduce += 0.8; }
  if (measures.has("stock")) { dReduce += 4; cReduce += 1800; fBoost += 8; rReduce += 1.0; }
  if (measures.has("reduce")) { dReduce += 2; cReduce += 3200; fBoost += 5; rReduce += 0.6; }
  if (measures.has("replan")) { dReduce += 3; cReduce += 1400; fBoost += 7; rReduce += 0.9; }
  return {
    delay: Math.max(base.delay - dReduce, 0),
    cost: Math.max(base.cost - cReduce, 0),
    fulfill: Math.min(base.fulfill + fBoost, 99),
    risk: Math.max(Math.round((base.risk - rReduce) * 10) / 10, 0.5),
  };
}

function renderResultsHTML(r, title) {
  const riskLabel = r.risk >= 7 ? "Hoch" : r.risk >= 4 ? "Mittel" : "Niedrig";
  let html = `<div class="sim-results">`;
  html += `<div class="sim-section-title">${title}</div>`;
  html += `<div class="sim-metric-grid">`;
  html += metricCard(t("simDelayDays"), `+${r.delay} ${locale === "de" ? "Tage" : "days"}`, "delta-negative");
  html += metricCard(t("simCostIncrease"), `+${r.cost.toLocaleString("de-DE")} \u20AC`, "delta-negative");
  html += metricCard(t("simFulfillment"), `${r.fulfill}%`, r.fulfill < 80 ? "delta-negative" : "");
  html += metricCard(t("simRiskScore"), `${riskLabel} (${r.risk}/10)`, r.risk >= 5 ? "delta-negative" : "");
  html += `</div>`;

  // Summary
  const summaryDE = `Die Simulation zeigt, dass bei den gewählten Störungsszenarien eine Lieferverzögerung von ${r.delay} Tagen und eine Kostenerhöhung von ${r.cost.toLocaleString("de-DE")} € zu erwarten sind. Die Erfüllungsquote sinkt auf ${r.fulfill}%. Der Risiko-Score liegt bei ${r.risk}/10.`;
  const summaryEN = `The simulation shows that with the selected disruption scenarios, a delivery delay of ${r.delay} days and a cost increase of €${r.cost.toLocaleString("en-US")} are expected. The fulfillment rate drops to ${r.fulfill}%. The risk score is ${r.risk}/10.`;
  html += `<div class="sim-summary">${locale === "de" ? summaryDE : summaryEN}</div>`;
  html += `</div>`;
  return html;
}

function renderComparisonHTML(before, after) {
  let html = `<div class="sim-results">`;
  html += `<div class="sim-section-title">${t("simComparison")}</div>`;
  html += `<div class="sim-metric-grid">`;
  html += metricCardCompare(t("simDelayDays"), `+${before.delay}d`, `+${after.delay}d`, after.delay < before.delay);
  html += metricCardCompare(t("simCostIncrease"), `+${before.cost.toLocaleString("de-DE")}\u20AC`, `+${after.cost.toLocaleString("de-DE")}\u20AC`, after.cost < before.cost);
  html += metricCardCompare(t("simFulfillment"), `${before.fulfill}%`, `${after.fulfill}%`, after.fulfill > before.fulfill);
  html += metricCardCompare(t("simRiskScore"), `${before.risk}`, `${after.risk}`, after.risk < before.risk);
  html += `</div>`;

  // Bar comparison
  const maxDelay = Math.max(before.delay, 30);
  html += `<div class="sim-bar-compare">`;
  html += `<div class="sim-bar-row"><span class="sim-bar-label-col">${t("simBefore")}</span><div class="sim-bar-track"><div class="sim-bar-fill-before" style="width:${(before.delay / maxDelay * 100)}%"></div></div><span class="sim-bar-val">+${before.delay}d</span></div>`;
  html += `<div class="sim-bar-row"><span class="sim-bar-label-col">${t("simAfter")}</span><div class="sim-bar-track"><div class="sim-bar-fill-after" style="width:${(after.delay / maxDelay * 100)}%"></div></div><span class="sim-bar-val">+${after.delay}d</span></div>`;
  html += `</div>`;

  const summaryDE = `Durch die gewählten Gegenmaßnahmen konnte die Lieferverzögerung von ${before.delay} auf ${after.delay} Tage reduziert werden. Die Erfüllungsquote verbessert sich von ${before.fulfill}% auf ${after.fulfill}%. Der Risiko-Score sinkt von ${before.risk} auf ${after.risk}.`;
  const summaryEN = `The selected countermeasures reduced the delivery delay from ${before.delay} to ${after.delay} days. The fulfillment rate improved from ${before.fulfill}% to ${after.fulfill}%. The risk score decreased from ${before.risk} to ${after.risk}.`;
  html += `<div class="sim-summary">${locale === "de" ? summaryDE : summaryEN}</div>`;
  html += `</div>`;
  return html;
}

function metricCard(label, value, cls) {
  return `<div class="sim-metric-card">
    <div class="sim-metric-label">${label}</div>
    <div class="sim-metric-value ${cls}">${value}</div>
  </div>`;
}

function metricCardCompare(label, before, after, improved) {
  const arrow = improved ? "\u2193" : "\u2191";
  const cls = improved ? "delta-positive" : "delta-negative";
  return `<div class="sim-metric-card">
    <div class="sim-metric-label">${label}</div>
    <div class="sim-metric-value">${after}</div>
    <div class="sim-metric-delta ${cls}">${before} ${arrow} ${after}</div>
  </div>`;
}

function fakeSimulate(durationMs, phases) {
  return new Promise(resolve => {
    simContent.hidden = true;
    simFooter.hidden = true;
    simLoading.hidden = false;
    simLoadingFill.style.width = "0%";
    simLoadingText.textContent = phases[0] || "";
    let elapsed = 0;
    const interval = 50;
    const timer = setInterval(() => {
      elapsed += interval;
      const pct = Math.min((elapsed / durationMs) * 100, 100);
      simLoadingFill.style.width = pct + "%";
      const phaseIdx = Math.min(Math.floor((elapsed / durationMs) * phases.length), phases.length - 1);
      simLoadingText.textContent = phases[phaseIdx] || "";
      if (elapsed >= durationMs) {
        clearInterval(timer);
        simLoading.hidden = true;
        simContent.hidden = false;
        simFooter.hidden = false;
        resolve();
      }
    }, interval);
  });
}

simNextBtn.addEventListener("click", async () => {
  if (simStep === 0) {
    // Step 1 → fake parametrize → Step 2
    const phasesDE = ["Parameter werden geladen…", "Lieferkette wird aufgebaut…", "Simulation wird parametriert…"];
    const phasesEN = ["Loading parameters…", "Building supply chain…", "Parametrizing simulation…"];
    await fakeSimulate(1500, locale === "de" ? phasesDE : phasesEN);
    simResults = null;
    simCompareResults = null;
    simDisruptions.clear();
    simMeasures.clear();
    renderSimStep(1);
  } else if (simStep === 1 && !simResults) {
    // Run disruption simulation
    if (simDisruptions.size === 0) return;
    const phasesDE = ["Störszenarien werden angewendet…", "Auswirkungen berechnen…", "Ergebnisse generieren…"];
    const phasesEN = ["Applying disruption scenarios…", "Calculating impacts…", "Generating results…"];
    await fakeSimulate(2000, locale === "de" ? phasesDE : phasesEN);
    simResults = generateFakeResults(simDisruptions);
    renderSimStep(1);
  } else if (simStep === 1 && simResults) {
    // Step 2 results shown → Step 3
    simCompareResults = null;
    simMeasures.clear();
    renderSimStep(2);
  } else if (simStep === 2 && !simCompareResults) {
    // Run measures simulation
    if (simMeasures.size === 0) return;
    const phasesDE = ["Gegenmaßnahmen werden angewendet…", "Neue Szenarien berechnen…", "Vergleich erstellen…"];
    const phasesEN = ["Applying countermeasures…", "Calculating new scenarios…", "Creating comparison…"];
    await fakeSimulate(2000, locale === "de" ? phasesDE : phasesEN);
    simCompareResults = generateFakeComparison(simDisruptions, simMeasures);
    renderSimStep(2);
  } else if (simStep === 2 && simCompareResults) {
    // Finish → reset
    simStep = 0;
    simMaterial = null;
    simResults = null;
    simCompareResults = null;
    simDisruptions.clear();
    simMeasures.clear();
    renderSimStep(0);
  }
});

simBackBtn.addEventListener("click", () => {
  if (simStep === 1) {
    simResults = null;
    renderSimStep(0);
  } else if (simStep === 2) {
    simCompareResults = null;
    renderSimStep(1);
  }
});

simResimBtn.addEventListener("click", async () => {
  if (simStep === 1) {
    simResults = null;
    renderSimStep(1);
    if (simDisruptions.size === 0) return;
    const phasesDE = ["Störszenarien werden angewendet…", "Auswirkungen berechnen…", "Ergebnisse generieren…"];
    const phasesEN = ["Applying disruption scenarios…", "Calculating impacts…", "Generating results…"];
    await fakeSimulate(2000, locale === "de" ? phasesDE : phasesEN);
    simResults = generateFakeResults(simDisruptions);
    renderSimStep(1);
  } else if (simStep === 2) {
    simCompareResults = null;
    renderSimStep(2);
    if (simMeasures.size === 0) return;
    const phasesDE = ["Gegenmaßnahmen werden angewendet…", "Neue Szenarien berechnen…", "Vergleich erstellen…"];
    const phasesEN = ["Applying countermeasures…", "Calculating new scenarios…", "Creating comparison…"];
    await fakeSimulate(2000, locale === "de" ? phasesDE : phasesEN);
    simCompareResults = generateFakeComparison(simDisruptions, simMeasures);
    renderSimStep(2);
  }
});
