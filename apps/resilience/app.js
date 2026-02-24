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
    dashAasTitle: "Naturkatastrophen & Lieferkettenrisiken",
    dashAasEmpty: "Keine betroffenen Standorte erkannt.",
    dashAasUpdated: "Aktualisiert: {time}",
    dashAasPage: "Seite {page} von {pages}",
    dashAasCountryHeader: "Land",
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
    settingsNavFeeds: "News Feeds",
    settingsNavGdacs: "GDACS",
    settingsNavAasImport: "AAS Import",
    settingsNavCountryCodes: "Ländercodes",
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
    dashAasTitle: "Natural Disasters & Supply Chain Risks",
    dashAasEmpty: "No affected locations detected.",
    dashAasUpdated: "Updated: {time}",
    dashAasPage: "Page {page} of {pages}",
    dashAasCountryHeader: "Country",
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
    settingsNavFeeds: "News Feeds",
    settingsNavGdacs: "GDACS",
    settingsNavAasImport: "AAS Import",
    settingsNavCountryCodes: "Country Codes",
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
  document.getElementById("gdacs-matching-label").textContent = t("matchingLabel");
  document.getElementById("gdacs-matching-btn-label").textContent = t("matchingBtn");
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
  document.getElementById("dash-aas-settings-save").textContent = t("dashAasSettingsSave");
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

  // Dashboard tile labels
  document.getElementById("dash-news-title").textContent = t("dashNewsTitle");
  document.getElementById("dash-news-link").textContent = t("dashNewsLink");
  document.getElementById("dash-news-empty").textContent = t("dashNewsEmpty");
  document.getElementById("dash-alerts-title").textContent = t("dashAlertsTitle");
  document.getElementById("dash-alerts-link").textContent = t("dashAlertsLink");
  document.getElementById("dash-alerts-empty").textContent = t("dashAlertsEmpty");
  document.getElementById("dash-aas-title").textContent = t("dashAasTitle");
  document.getElementById("dash-aas-empty").textContent = t("dashAasEmpty");

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
let cachedDashMatchFilter = ["polygon", "distance"];

async function loadSettings() {
  const result = await apiRequest("/apps/resilience/api/settings");
  if (!result.ok || !result.payload) return;

  const { retention_days, refresh_minutes, feeds, gdacs_refresh_minutes, gdacs_retention_days, gdacs_countries, import_interval_hours, gdacs_aas_columns, gdacs_distance_thresholds, matching_group_id, matching_group_name, matching_country_path, matching_city_path, matching_lat_path, matching_lon_path, dash_aas_match_filter } = result.payload;
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

  // GDACS distance thresholds
  if (gdacs_distance_thresholds) {
    try {
      const th = typeof gdacs_distance_thresholds === "string" ? JSON.parse(gdacs_distance_thresholds) : gdacs_distance_thresholds;
      for (const [type, km] of Object.entries(th)) {
        const inp = document.getElementById(`threshold-${type}`);
        if (inp) inp.value = String(km);
      }
    } catch (_) { /* ignore parse errors */ }
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
function updateMatchingDisplay(groupName, paths) {
  const el = document.getElementById("gdacs-matching-paths");
  if (!groupName && !paths.country && !paths.city && !paths.lat && !paths.lon) {
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

  if (nav === "feeds" || nav === "gdacs" || nav === "aas-import") {
    loadSettings();
  } else if (nav === "country-codes") {
    loadCountryMappings();
  }
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
  const maxSteps = (aasCmMode === "picker" || aasCmMode === "columns" || aasCmMode === "geocoding" || aasCmMode === "matching" || aasCmMode === "geo-single") ? 3 : 4;
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
  aasCmBackBtn.hidden = step <= 1 || aasCmMode === "geo-single";
  // In geo-single mode, hide all step indicators (only 1 visible step)
  if (aasCmMode === "geo-single") {
    aasCmSteps.hidden = true;
  } else {
    aasCmSteps.hidden = false;
  }
  aasCmApplyBtn.hidden = true;
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
  const titles = { picker: t("gdacsAasSourceLabel"), columns: t("gdacsColsLabel"), geocoding: t("geocodingTitle"), matching: t("matchingLabel"), import: t("aasCmTitle"), "geo-single": t("geocodingTitle") };
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

  if (mode === "geo-single" && aasId) {
    // Skip steps 1+2, jump directly to tree
    aasCmGeoSingleAasId = aasId;
    showAasCmStep(3);
    loadAasCmTree(aasId);
  } else {
    showAasCmStep(1);
    loadAasCmGroups();
  }
  aasCmModal.showModal();
}

document.getElementById("cm-aas-import-btn").addEventListener("click", () => openAasCmModal("import"));
document.getElementById("gdacs-matching-btn").addEventListener("click", () => openAasCmModal("matching"));
document.getElementById("aas-ov-geocoding-btn").addEventListener("click", () => openAasCmModal("geocoding"));

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
  } else if (aasCmMode === "columns") {
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
      pathDisplay.textContent = t("gdacsColsCount").replace("{n}", aasCmSelectedPaths.length);
      pathDisplay.hidden = false;
      aasCmApplyBtn.hidden = false;
      aasCmApplyBtn.textContent = t("gdacsColsBtn");
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
    aasCmApplyBtn.textContent = aasCmMode === "picker" ? t("gdacsAasSourceBtn") : t("aasCmApply");
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
      showGdacsCountryHint(t("matchingSaved"), "success");
      setTimeout(hideGdacsCountryHint, 3000);
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
    tr.innerHTML = `<td class="aas-ov-id-cell">${escapeHtml(idDisplay)}</td><td class="aas-ov-copy-cell"><button class="aas-ov-copy-btn" data-copy="${escapeHtml(entry.aas_id)}" title="Copy AAS ID"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></td><td>${escapeHtml(entry.source_name)}</td><td>${grpDisplay}</td><td>${impDisplay}</td><td class="aas-ov-status-cell">${importBtn}</td><td class="aas-ov-geo-cell">${geoBtn}</td><td class="aas-ov-view-cell">${viewBtn}</td>`;
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
  const dashNewsBody = document.getElementById("dash-news-body");
  const dashAlertsBody = document.getElementById("dash-alerts-body");

  const matchFilter = cachedDashMatchFilter.join(",");
  const [newsResult, alertsResult, aasOverviewResult] = await Promise.all([
    apiRequest("/apps/resilience/api/news?limit=8"),
    apiRequest("/apps/resilience/api/gdacs/alerts?limit=8"),
    apiRequest(`/apps/resilience/api/gdacs/aas-overview?match_filter=${encodeURIComponent(matchFilter)}`),
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

  // AAS Country Overview tile
  const dashAasBody = document.getElementById("dash-aas-body");
  const dashAasFooter = document.getElementById("dash-aas-footer");
  if (aasOverviewResult.ok && aasOverviewResult.payload && aasOverviewResult.payload.total > 0) {
    const { items, total, columns } = aasOverviewResult.payload;
    dashAasColumns = columns || [];
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
}

let dashAasPage = 0;
let dashAasColumns = [];
let dashAasSortBy = "";
let dashAasSortDir = "asc";

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
    return `<div class="dash-aas-row">${colCells}<span class="dash-aas-alerts">${alertsHtml}</span></div>`;
  }).join("");
  body.innerHTML = headerHtml + rowsHtml;
}

// Sort click handler (delegated)
document.getElementById("dash-aas-body").addEventListener("click", (e) => {
  const hdr = e.target.closest(".dash-aas-sortable");
  if (!hdr) return;
  const col = hdr.dataset.sortCol;
  if (dashAasSortBy === col) {
    dashAasSortDir = dashAasSortDir === "asc" ? "desc" : "asc";
  } else {
    dashAasSortBy = col;
    dashAasSortDir = "asc";
  }
  dashAasPage = 0;
  loadDashAasPage(0);
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

// Dashboard AAS Tile Settings modal
const dashAasSettingsModal = document.getElementById("dash-aas-settings-modal");
document.getElementById("dash-aas-settings-btn").addEventListener("click", () => {
  // Sync checkboxes with current filter
  document.getElementById("dash-filter-polygon").checked = cachedDashMatchFilter.includes("polygon");
  document.getElementById("dash-filter-distance").checked = cachedDashMatchFilter.includes("distance");
  document.getElementById("dash-filter-country").checked = cachedDashMatchFilter.includes("country");
  updateGdacsColsDisplay(cachedGdacsColumns);
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
})();
