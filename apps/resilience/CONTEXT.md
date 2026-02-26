# Resilience App — Context Reference

## Tech Stack
- Backend: Node.js + Express, SQLite (shared/db.js), Auth via shared/auth.js
- Frontend: Vanilla HTML/CSS/JS, Leaflet.js (maps), i18n DE+EN
- Files: `apps/resilience/` → routes.js (~3800 LOC), app.js (~8800 LOC), index.html (~1700 LOC), styles.css (~5000 LOC), iso-countries.js

## Database Tables (18)

| Table | PK | Purpose |
|---|---|---|
| `resilience_settings` | user_id | App config (retention, refresh, geocoding paths, BQ creds, dashboard configs) |
| `resilience_feeds` | feed_id | RSS/Atom/JSON feed URLs |
| `resilience_feed_items` | item_id | Parsed news items from feeds |
| `resilience_gdacs_countries` | country_id | Monitored GDACS countries |
| `resilience_gdacs_alerts` | alert_id | Stored GDACS alerts (UNIQUE: user_id+eventid) |
| `resilience_gdacs_polygons` | user_id+eventid | GeoJSON polygon geometries |
| `resilience_gdacs_aas_map` | user_id+aas_id | AAS ↔ GDACS country mapping cache |
| `resilience_gdacs_aas_matches` | user_id+aas_id+alert_id | 3-tier match results (polygon/distance/country) |
| `resilience_indicator_classes` | class_id | Indicator categories |
| `resilience_indicators` | indicator_id | Custom indicators with rules |
| `resilience_indicator_groups` | group_id | OR-linked rule groups per indicator |
| `resilience_indicator_conditions` | condition_id | AND-linked conditions in groups |
| `resilience_aas_sources` | source_id | AAS repository servers (name, base_url, item_prefix) |
| `resilience_aas_source_ids` | entry_id | AAS IDs per source (UNIQUE: source_id+aas_id), entry_type=aas|item |
| `resilience_aas_imports` | user_id+aas_id | Cached shell + submodel JSON snapshots |
| `resilience_asset_groups` | group_id | User-defined asset groups |
| `resilience_asset_group_members` | group_id+aas_id | AAS → group assignments |
| `resilience_country_mappings` | user_id+iso_code | ISO2/Alpha3/numeric with aas_names, gdacs_names |

## Pages (Sidebar Navigation)

| Page ID | Purpose | Sub-Nav |
|---|---|---|
| `page-dashboard` | Grid tiles: news, alerts, score, indicators, AAS overview | — |
| `page-indicators` | Custom resilience indicators | classes \| indicators |
| `page-gdacs` | GDACS disaster search | — |
| `page-ai-mapping` | AI Enrichment (placeholder) | — |
| `page-simulation` | 3-step simulation wizard (fake data) | Stepper: Kalibrierung → Störungen → Gegenmaßnahmen |
| `page-aas-data` | AAS imports, sources, groups | overview \| sources \| groups \| assign |
| `page-news-feeds` | RSS news list/detail | — |
| `page-gdacs-alerts` | GDACS alert table | — |
| `page-settings` | App configuration | feeds \| gdacs \| aas-import \| country-codes \| gdelt-bq \| danger-zone |
| `page-docs` | Documentation | overview + topic pages |

## Key API Endpoints

**Settings:** `GET/PUT /api/settings`
**Feeds:** `POST /api/feeds`, `DELETE /api/feeds/:id`, `POST /api/feeds/refresh`
**News:** `GET /api/news`, `DELETE /api/news`, `GET /api/news/:id`
**GDACS:** `GET /api/gdacs/search`, `GET/POST/DELETE /api/gdacs/countries`, `GET/DELETE /api/gdacs/alerts`, `POST /api/gdacs/alerts/refresh`, `GET /api/gdacs/map-data`
**Indicators:** `GET/POST /api/indicator-classes`, `GET/POST /api/indicators`, `GET/PUT/DELETE /api/indicators/:id`, `GET/PUT /api/indicators/dashboard-config`, `GET /api/indicators/dashboard-evaluate`
**Score:** `GET/PUT /api/score/dashboard-config`, `GET /api/score/dashboard-evaluate`
**AAS Sources:** `GET/POST /api/aas-sources`, `GET/PUT/DELETE /api/aas-sources/:id`, `POST /api/aas-sources/:id/ids`, `POST /api/aas-sources/:id/ids/import`
**AAS Overview:** `GET /api/aas-overview`, `POST /api/aas-import`, `GET /api/aas-import-status`
**Geocoding:** `POST /api/geocoding/run`, `POST /api/geocoding/run-single`, `GET /api/geocoding/status`
**Company:** `POST /api/company-process/run`, `GET /api/company-detail/:aasId`
**Enrichment:** `GET /api/gdelt/company`, `GET /api/world-bank`, `GET /api/inform-risk`
**Country Mappings:** `GET/PUT /api/country-mappings`, `POST /api/country-mappings/reset`, `GET /api/country-mappings/export`
**Asset Groups:** `GET/POST /api/asset-groups`, `GET/PUT/DELETE /api/asset-groups/:id`
**Danger Zone:** `POST /api/delete-all-data`

## External APIs
- **GDACS:** `gdacs.org/gdacsapi` — disaster alerts, polygons
- **Nominatim:** `nominatim.openstreetmap.org/search` — geocoding (1 req/s)
- **Gemini/Groq:** AI country mapping, company alias generation
- **BigQuery:** GDELT media analysis via service account
- **World Bank:** Governance indicators by country
- **INFORM Risk:** Risk index data by country

## Background Jobs
- `refreshAllFeeds()` — respects user refresh_minutes
- `cleanupExpiredItems()` — respects retention_days
- `refreshAllGdacsAlerts()` — respects gdacs_refresh_minutes
- `cleanupGdacsAlerts()` — respects gdacs_retention_days
- `scheduleUserImport()` — recurring AAS import (import_interval_hours)
- `runGeocodingJob()` — Nominatim batch geocode (1.1s rate limit)
- `runCompanyProcessJob()` — AI alias extraction in batches of 50

## Frontend Patterns

**Navigation:** `navigateTo(page)` → shows `.page-section`, calls load function
**Sub-Nav:** `switchSettingsNav(tab)`, `switchAasNav(nav)`, `switchIndNav(nav)`
**API Helper:** `apiRequest(path, {method, body})` → JSON fetch, auto-redirect on 401
**i18n:** `t(key)` → lookup in `I18N[locale]`, fallback to DE
**Locale Variable:** `locale` (not `currentLocale`)
**Modals:** `.hidden` attribute toggle, company detail has 5 tab pages (location, alerts, gdelt, worldbank, inform)
**Wizards:** Indicator dashboard config, score config, matching params, simulation wizard

## 3-Tier GDACS ↔ AAS Matching
1. **Polygon** — point-in-polygon test (lat/lon from Geocoding submodel)
2. **Distance** — Haversine ≤ threshold (EQ:300km, TC:500km, FL:200km, VO:100km, WF:150km, DR:1000km)
3. **Country** — ISO code match via country_mappings

## AAS Data Extraction
- `extractFirstValue(submodels, path)` — walk dot-separated idShort path
- Example: `"Identification.Country"` → Property value from AAS submodel tree

## Quick Checklist for Changes
1. **New page:** sidebar button (data-page) + `<section>` + `navigateTo()` case + i18n
2. **New setting:** ALTER TABLE migration + GET/PUT in /api/settings + HTML input + i18n
3. **New API:** route in mountRoutes() + requireAuth + frontend apiRequest()
4. **Version bump:** `?v=XX` on CSS + JS in index.html
5. **Syntax check:** `node --check app.js` + `node --check routes.js`
