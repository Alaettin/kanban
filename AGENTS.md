# AGENTS.md

## Purpose
This repository contains a multi-app workspace platform with Google login, role-based access control, and SQLite persistence.
Apps: Kanban Board, DTI Connector, Card Scanner, AAS Chat, Knowledge Base, Resilience.
Use this file as the default operating guide for any coding agent working in this project.

## Project Snapshot
- Runtime: Node.js 20
- Backend: Express 4 (`server.js`)
- Frontend: Vanilla HTML/CSS/JS (per app: `index.html`, `styles.css`, `app.js`)
- Database: SQLite (`data/platform.db`)
- Auth: Google OAuth 2.0 + cookie sessions (14-day TTL)
- Platform: Dashboard with app launcher, admin panel, user management
- Collaboration: shared projects/connectors, invites, member roles (`owner`, `editor`, `viewer`)
- Deployment: Docker + Docker Compose, port 3000
- i18n: DE + EN (locale switcher on dashboard and in apps)

## Important Files

### Platform
- `server.js`: Entry point, app registration, admin API, static routes
- `shared/auth.js`: Google OAuth, session management, middleware (`requireAuth`, `requireAdmin`, `requireAppAccess`)
- `shared/db.js`: SQLite async wrapper (`open`, `run`, `get`, `all`)
- `shared/app-registry.js`: App registration system (`register`, `getApps`, `getApp`)
- `platform/dashboard.*`: App launcher (dashboard)
- `platform/login.html`: Login page
- `platform/admin/`: Admin panel (user management, role & app access)

### Kanban Board (`apps/kanban/`)
- `routes.js`: Project/board API, invites, members, activities
- `app.js`: Board UI, drag & drop, project sync, member management
- `index.html` / `styles.css`: Board layout and styles

### DTI Connector (`apps/dti-connector/`)
- `routes.js`: Connector CRUD, hierarchy, model, assets, files, sharing, external API
- `app.js`: Connector management UI, import/export, drag & drop hierarchy
- `index.html` / `styles.css` / `docs.html`: UI and Swagger-like API docs
- File storage: `data/dti-files/{user_id}/{connector_id}/{file_id}_{lang}{ext}`

### Card Scanner (`apps/card-scanner/`)
- `routes.js`: Card CRUD, image storage and retrieval
- `app.js`: OCR (Tesseract.js), image preprocessing, business card text parsing, webcam/upload
- `index.html` / `styles.css`: Card list with thumbnails, edit form, image modal

### AAS Chat (`apps/aas-chat/`)
- `routes.js`: Chat API, LLM integration (Gemini + Groq), DTI Connector tool executor, KB MCP pool, settings, connector status
- `app.js`: Chat UI, slash-command autocomplete, connector panel, tool log rendering (AAS/DTI/KB labels), mode toggle
- `index.html` / `styles.css`: ChatGPT-style interface with sidebar, settings (3 MCP toggles: AAS, DTI, KB), docs page
- `mcp-server.mjs`: MCP server for AAS Repository Server tools (stdio transport)
- `AAS-MCP.md`: MCP integration documentation

### Knowledge Base (`apps/knowledge-base/`)
- `routes.js`: Document CRUD, file upload (Multer), text extraction (PDF/DOCX/Excel/TXT), AI description generation, settings
- `app.js`: Document list UI, search + pagination, upload, edit, AI description, settings
- `index.html` / `styles.css`: Document library with cards, edit view, settings modal (accent: amber #f59e0b)
- `mcp-server.mjs`: MCP server with 2 tools (`listDocuments`, `readDocument`), env: `KB_USER_ID` + `KB_BASE_PROMPT`
- File storage: `data/kb-files/{user_id}/{doc_id}{ext}`

### Resilience (`apps/resilience/`)
- `routes.js`: Settings, feeds CRUD, news API, GDACS search/alerts/refresh, AAS sources/IDs/groups/overview/import, indicators/indicator-classes, country mappings, background jobs (feed refresh, GDACS refresh, import scheduler, cleanup)
- `app.js`: Multi-page SPA (Dashboard, Indicators, GDACS Search, AAS Data, News Feeds, GDACS Alerts, Settings, Docs), i18n DE+EN, inline editing
- `index.html` / `styles.css`: All pages with internal navbars (docs-layout pattern)
- **Pages:** Dashboard (overview cards), Indicators (classes + indicator CRUD with rule groups), GDACS Search (live search + country filter), AAS Daten (overview/sources/groups/assign with internal nav), News Feeds (table + search + pagination), GDACS Alerts (country-grouped alerts), Settings (general + country codes with internal nav), Dokumentation
- **DB Tables:** `resilience_settings`, `resilience_feeds`, `resilience_feed_items`, `resilience_gdacs_countries`, `resilience_gdacs_alerts`, `resilience_aas_sources`, `resilience_aas_source_ids`, `resilience_aas_groups`, `resilience_aas_imports`, `resilience_indicator_classes`, `resilience_indicators`, `resilience_country_mappings`
- **Background Jobs (server.js):** `refreshAllFeeds()` + `refreshAllGdacsAlerts()` every 60s, `cleanupExpiredItems()` + `cleanupGdacsAlerts()` per-user retention, `scheduleImports()` per-user auto-import interval
- **Server-side import:** In-memory `importJobs` map, `POST /api/aas-import` starts background job, `GET /api/aas-import-status` for polling, survives browser refresh
- **Features:** RSS/Atom/JSON feed aggregation, GDACS disaster alerts with country watchlist, AAS shell+submodel import with progress, indicator rule engine (OR-groups with AND-conditions), country name mapping (ISO↔AAS↔GDACS)

### Config
- `package.json`: Scripts and dependencies
- `.env.example`: Required env var template
- `Dockerfile` / `docker-compose.yml`: Docker deployment
- `.dockerignore` / `.gitignore`: Ignore rules

## Dependencies
- `express` (^4.21.2) — Web framework
- `sqlite3` (^5.1.7) — Database
- `multer` (^2.0.2) — File upload
- `archiver` (^7.0.1) — ZIP creation
- `unzipper` (^0.12.3) — ZIP extraction
- `pdf-parse` (^1.1.1) — PDF text extraction
- `mammoth` (^1.9.0) — DOCX text extraction (Knowledge Base)
- `xlsx` (^0.18.5) — Excel text extraction (Knowledge Base)
- `rss-parser` — RSS/Atom feed parsing (Resilience)
- `@modelcontextprotocol/sdk` (^1.26.0) — MCP client/server for AAS Chat + Knowledge Base

## Required Environment Variables
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL` (local: `http://localhost:3000/auth/google/callback`)

## Runbook
1. Install dependencies: `npm install`
2. Configure environment variables (`.env`)
3. Start app: `npm start`
4. Open: `http://localhost:3000`

## API Contract

### Platform
- `GET /api/me` — current user info
- `GET /api/apps` — apps the user has access to
- `POST /auth/logout`
- `GET /auth/google` / `GET /auth/google/callback`

### Admin (`/api/admin/`)
- `GET /api/admin/users`
- `PUT /api/admin/users/:userId/role`
- `PUT /api/admin/users/:userId/access`
- `DELETE /api/admin/users/:userId`

### Kanban Board (`/apps/kanban/`)
- `GET/POST /api/projects`
- `GET/PATCH/DELETE /api/projects/:projectId`
- `PUT /api/projects/:projectId/state`
- `POST /api/projects/:projectId/invites`
- `POST /api/invites/:token/accept`
- `GET/PATCH/DELETE /api/projects/:projectId/members/:userId`
- `GET/POST /api/projects/:projectId/activities`

### DTI Connector (`/apps/dti-connector/`)
- Connector CRUD, hierarchy, model, assets, files, sharing, external API
- External API: `/api/v1/:apiKey/Product/...` endpoints
- See `apps/dti-connector/routes.js` for full route list

### Card Scanner (`/apps/card-scanner/`)
- `GET /api/cards` — list cards (without image blob)
- `POST /api/cards` — create card (with image base64)
- `PUT /api/cards/:scanId` — update card fields
- `DELETE /api/cards/:scanId` — delete card
- `GET /api/cards/:scanId/image` — get card image

### AAS Chat (`/apps/aas-chat/`)
- `GET /api/messages` — list chat messages (with tool_log JSON)
- `POST /api/messages` — send message to LLM (supports `forceTool` for slash commands)
- `DELETE /api/messages` — clear chat history
- `GET /api/settings` — get user settings (provider, model, masked API key, enabled_mcps)
- `PUT /api/settings` — save settings (including enabled_mcps array)
- `GET /api/mcp-tools` — list AAS MCP tools (cached)
- `GET /api/dti-tools` — list DTI connector tool definitions
- `GET /api/kb-tools` — list Knowledge Base tool definitions
- `GET /api/connector-status` — get active connector state (for page restore)
- `POST /api/connector-disconnect` — disconnect active connector

### Knowledge Base (`/apps/knowledge-base/`)
- `GET /api/documents` — list all user's documents
- `POST /api/documents` — upload document (multipart, text extraction)
- `PUT /api/documents/:docId` — update title/description
- `DELETE /api/documents/:docId` — delete document + file
- `GET /api/documents/:docId/content` — get extracted text content
- `POST /api/documents/:docId/generate-description` — AI-generate description (uses Gemini API key from AAS Chat settings)
- `GET /api/settings` — get KB settings (base_prompt)
- `PUT /api/settings` — save KB settings

### Resilience (`/apps/resilience/`)
- `GET/PUT /api/settings` — user settings (retention, refresh intervals, import interval)
- `POST /api/feeds` — add RSS/Atom/JSON feed
- `DELETE /api/feeds/:feedId` — remove feed
- `GET /api/news?limit=&offset=&q=` — paginated news items with search
- `GET /api/news/:itemId` — single news item detail
- `DELETE /api/news` — purge all news
- `GET /api/gdacs/search?days=&eventlist=&alertlevel=&country=` — live GDACS search
- `GET /api/gdacs/alerts?limit=&offset=&country_id=` — stored GDACS alerts (filtered by retention)
- `POST /api/gdacs/alerts/refresh` — trigger manual alert refresh
- `DELETE /api/gdacs/alerts` — purge all alerts
- `POST /api/gdacs/countries` — add watchlist country
- `DELETE /api/gdacs/countries/:countryId` — remove watchlist country
- `GET /api/aas-sources` — list AAS sources with ID counts
- `POST /api/aas-sources` — add AAS source
- `DELETE /api/aas-sources/:sourceId` — remove AAS source
- `GET /api/aas-sources/:sourceId/ids` — list source IDs
- `POST /api/aas-sources/:sourceId/ids` — add AAS IDs (batch)
- `DELETE /api/aas-source-ids/:idId` — remove single AAS ID
- `GET /api/aas-groups` — list AAS groups
- `POST /api/aas-groups` — create group
- `DELETE /api/aas-groups/:groupId` — delete group
- `GET /api/aas-overview?limit=&offset=&q=` — paginated AAS overview (with import status)
- `PUT /api/aas-overview/assign` — assign/unassign AAS IDs to groups
- `POST /api/aas-import` — start server-side import job
- `GET /api/aas-import-status` — poll import progress
- `GET /api/aas-import/:aasId` — get imported shell+submodels from DB
- `GET /api/indicator-classes` — list indicator classes
- `POST /api/indicator-classes` — create class
- `DELETE /api/indicator-classes/:classId` — delete class
- `GET /api/indicators` — list indicators
- `POST /api/indicators` — create/update indicator
- `DELETE /api/indicators/:indicatorId` — delete indicator
- `GET /api/country-mappings?limit=&offset=&q=` — paginated country mappings
- `PUT /api/country-mappings/:isoCode` — update country mapping (AAS/GDACS names)

## AAS Chat — MCP Tool Sources

The AAS Chat integrates 3 MCP servers, each togglable via settings checkboxes (`enabled_mcps` JSON array):
- **AAS** — AAS Repository Server tools (stdio transport via `mcp-server.mjs`)
- **DTI** — DTI Connector tools (16 tools, inline executor)
- **KB** — Knowledge Base tools (2 tools, stdio transport via `knowledge-base/mcp-server.mjs`)

Tool source routing: `DTI_TOOL_NAMES.has() ? "dti" : KB_TOOL_NAMES.has() ? "kb" : "aas"`

## AAS Chat — DTI Connector Tools (16 total)

### Connection Tools (always available)
| Tool | Description | Params |
|------|-------------|--------|
| `listConnectors` | Lists all user's connectors | — |
| `connectConnector` | Connect by name/ID (fuzzy search) | `nameOrId` |
| `disconnectConnector` | Disconnect active connector | — |
| `createConnector` | Create new connector (user = owner) | `name` |

### Hierarchy Tools (require connected connector)
| Tool | Description | Params |
|------|-------------|--------|
| `getHierarchyLevels` | Get hierarchy levels | — |
| `setHierarchyLevels` | Replace all hierarchy levels | `levels[]` |

### Model Tools (require connected connector)
| Tool | Description | Params |
|------|-------------|--------|
| `getModelDatapoints` | Get datapoint schema | — |
| `setModelDatapoints` | Replace all datapoints | `datapoints[]` (id, name, type) |
| `addModelDatapoint` | Add single datapoint | `id`, `name`, `type` |
| `removeModelDatapoint` | Remove datapoint + values | `dpId` |

### Asset Tools (require connected connector)
| Tool | Description | Params |
|------|-------------|--------|
| `listAssets` | List all assets | — |
| `createAsset` | Create asset (alphanumeric ID) | `asset_id` |
| `deleteAsset` | Delete asset + all values | `asset_id` |
| `renameAsset` | Rename asset | `asset_id`, `new_asset_id` |
| `getAssetValues` | Get all values (de/en) | `asset_id` |
| `setAssetValues` | Replace all values | `asset_id`, `values[]` (key, lang, value) |

### Tool Execution Modes
- **LLM-driven**: LLM selects and calls tools based on user intent
- **Slash commands**: User types `/toolName` to force a specific tool
- **Direct execution**: Valid JSON after slash command bypasses LLM entirely
- **LLM fallback**: Free-text after slash command uses LLM for data transformation

### LLM Providers
- **Google Gemini**: 2.5 Flash, 2.5 Flash Lite, 2.5 Pro (maxOutputTokens: 65536)
- **Groq**: Llama 3.1 8B, Llama 3.3 70B, Mixtral 8x7B
- Mode toggle: "Tool" (MCP + DTI + KB tools) vs "WEB" (Google Search, Gemini only)

## AAS Chat — Knowledge Base Tools (2 total)

| Tool | Description | Params |
|------|-------------|--------|
| `listDocuments` | List all documents in user's KB | — |
| `readDocument` | Read extracted text of a document | `doc_id` |

## Data Model

### Platform tables
- `users`, `sessions`, `oauth_states`, `user_roles`, `user_app_access`

### Kanban tables
- `projects`, `project_members`, `project_invites`, `project_activities`, `user_state`

### DTI Connector tables
- `dti_connectors`, `connector_members`, `connector_invites`
- `dti_hierarchy_levels`, `dti_model_datapoints`
- `dti_files`, `dti_assets`, `dti_asset_values`

### Card Scanner tables
- `card_scans` (scan_id, user_id, name, company, position, phone, email, website, address, raw_text, image, created_at)

### AAS Chat tables
- `aas_chat_messages` (message_id, user_id, role, content, tool_log JSON, created_at)
- `aas_chat_settings` (user_id, provider, model, api_key, aas_url, system_prompt, active_connector_id, enabled_mcps JSON)

### Knowledge Base tables
- `kb_documents` (doc_id, user_id, title, description, original_name, mime_type, file_size, content_text, created_at, updated_at)
- `kb_settings` (user_id, base_prompt)

### Resilience tables
- `resilience_settings` (user_id PK, retention_days, refresh_minutes, gdacs_refresh_minutes, gdacs_retention_days, import_interval_hours)
- `resilience_feeds` (feed_id, user_id, url, title, last_fetched_at, last_error, created_at)
- `resilience_feed_items` (item_id, feed_id, user_id, guid, title, link, description, content, pub_date, created_at; UNIQUE(feed_id, guid))
- `resilience_gdacs_countries` (country_id, user_id, name, created_at)
- `resilience_gdacs_alerts` (alert_id, user_id, country_id FK, eventid, eventtype, name, country, alertlevel, alertscore, severity, fromdate, todate, url, fetched_at)
- `resilience_aas_sources` (source_id, user_id, name, base_url, created_at)
- `resilience_aas_source_ids` (id, source_id FK, aas_id, group_id FK nullable, created_at)
- `resilience_aas_groups` (group_id, user_id, name, created_at)
- `resilience_aas_imports` (user_id+aas_id PK, source_id, shell_data TEXT, submodels_data TEXT, imported_at)
- `resilience_indicator_classes` (class_id, user_id, name, UNIQUE(user_id, name))
- `resilience_indicators` (indicator_id, user_id, name, class_id FK nullable, input_type, input_label, rule_groups JSON, default_label, default_color, default_score)
- `resilience_country_mappings` (user_id+iso_code PK, aas_names, gdacs_names)

## UX/Behavior Notes
- Sync indicator is a circle near avatar (green/yellow/red states).
- Project sharing uses a link-based modal.
- Member management modal supports staged changes with explicit `Uebernehmen`.
- Role changes/removals are owner-only.
- Removed members lose project visibility on sync.
- Activity panel opens from the right as an overlay (board layout does not shift).
- AAS Chat: Connector panel (right frame) shows connected connector info, role, stats, activity log. Logs persist across page reloads (restored from tool_log in DB). Cleared on disconnect or chat clear.
- AAS Chat: Tool log summary labeled "Communication" (amber) with tool call count + token usage. Log item labels: MCP/AAS (green), Connector (blue), KB (amber), LLM (purple), Tokens (red).
- AAS Chat: Copy button on all chat bubbles (hover-reveal, top-right corner).
- AAS Chat: Slash-command autocomplete popup with keyboard navigation (arrows/enter/tab/escape), scrolling description text on overflow.

## Coding Rules For Agents
- Keep stack simple (no framework migration unless requested).
- Prefer localized edits over rewrites.
- Preserve German UI labels/copy style unless localization work is requested.
- Keep API behavior backward-safe unless user requested breaking changes.
- When changing roles/invites/projects, update both backend route and frontend handling.
- When adding DTI tools: add definition to `DTI_TOOLS_CONNECTED` (routes.js), add case to `executeDtiTool()` (routes.js), add to system prompt in `buildDtiPromptSection()` (routes.js), add to `CONNECTOR_TOOL_NAMES` (app.js).
- When adding KB tools: add to `mcp-server.mjs` tool list, add tool name to `KB_TOOL_NAMES` (aas-chat/routes.js), add to `KB_TOOL_NAMES_CLIENT` (aas-chat/app.js).
- Gemini quirks: use maxOutputTokens 65536 (thinking tokens count against limit), handle MALFORMED_FUNCTION_CALL with retry, handle empty replies with tool-result fallback.
- System prompt: intent-based tool selection (ersetzen/setzen → setModelDatapoints, hinzufügen → addModelDatapoint), no tools for text formatting questions.

## Security Rules
- Never commit secrets.
- Keep `.env` local only; commit `.env.example` only.
- Keep cookies `HttpOnly`, `SameSite=Lax`, `Secure` in production.
- Do not re-introduce credentials into `start-kanban.bat`.

## Verification Checklist
After meaningful changes, verify:
1. `node --check server.js` succeeds.
2. `npm start` boots without runtime errors.
3. Login flow works, dashboard shows assigned apps.
4. Kanban: board drag & drop, project sharing, member management.
5. DTI Connector: connector CRUD, hierarchy/model editing, file upload, assets, API docs.
6. Card Scanner: webcam/upload capture, OCR processing, card list with thumbnails, image preview modal, delete with confirmation.
7. AAS Chat: message send/receive, tool calls (MCP + DTI + KB), slash commands, connector panel, settings save/load, mode toggle, KB toggle.
8. Knowledge Base: document upload (PDF/DOCX/Excel/TXT), text extraction, AI description, search + pagination, settings.
9. Resilience: feed management, news aggregation, GDACS search/alerts, AAS sources/groups/import, indicators with rule groups, country mappings, settings with retention/intervals.
10. Admin panel: user roles, app access toggling (incl. knowledge-base), user deletion.

## Deployment Notes
- Docker: `docker-compose up -d` (port 3000, volume: `./data:/app/data`)
- Production: Linux VPS + Nginx + PM2 + HTTPS
- Add production callback URI in Google OAuth settings.
- SQLite file must be on persistent storage with backups.

## Notes
- No formal automated tests in repo yet.
- Favor small manual validations and concise change summaries.
