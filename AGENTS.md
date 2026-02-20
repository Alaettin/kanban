# AGENTS.md

## Purpose
This repository contains a multi-app workspace platform with Google login, role-based access control, and SQLite persistence.
Apps: Kanban Board, DTI Connector, Card Scanner.
Use this file as the default operating guide for any coding agent working in this project.

## Project Snapshot
- Runtime: Node.js
- Backend: Express (`server.js`)
- Frontend: Vanilla HTML/CSS/JS (per app: `index.html`, `styles.css`, `app.js`)
- Database: SQLite (`data/platform.db`)
- Auth: Google OAuth 2.0 + cookie sessions
- Platform: Dashboard with app launcher, admin panel, user management
- Collaboration: shared projects/connectors, invites, member roles (`owner`, `editor`, `viewer`)

## Important Files

### Platform
- `server.js`: Entry point, app registration, admin API, static routes
- `shared/auth.js`: Google OAuth, session management, middleware
- `shared/db.js`: SQLite async wrapper
- `shared/app-registry.js`: App registration system
- `platform/dashboard.*`: App launcher (dashboard)
- `platform/login.html`: Login page
- `platform/admin/`: Admin panel (user management, role & app access)

### Kanban Board (`apps/kanban/`)
- `routes.js`: Project/board API, invites, members, activities
- `app.js`: Board UI, drag & drop, project sync, member management
- `index.html` / `styles.css`: Board layout and styles

### DTI Connector (`apps/dti-connector/`)
- `routes.js`: Connector CRUD, hierarchy, model, assets, files, sharing, external API
- `app.js`: Connector management UI, import/export
- `index.html` / `styles.css` / `docs.html`: UI and API docs

### Card Scanner (`apps/card-scanner/`)
- `routes.js`: Card CRUD, image storage and retrieval
- `app.js`: OCR (Tesseract.js), image preprocessing, business card text parsing, webcam/upload
- `index.html` / `styles.css`: Card list with thumbnails, edit form, image modal

### Config
- `package.json`: Scripts and dependencies
- `.env.example`: Required env var template

## Required Environment Variables
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL` (local: `http://localhost:3000/auth/google/callback`)

## Runbook
1. Install dependencies: `npm install`
2. Configure environment variables (for example `.env`)
3. Start app: `npm start`
4. Open: `http://localhost:3000`

## API Contract (Current)

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
- See `apps/dti-connector/routes.js` for full route list

### Card Scanner (`/apps/card-scanner/`)
- `GET /api/cards` — list cards (without image blob)
- `POST /api/cards` — create card (with image base64)
- `PUT /api/cards/:scanId` — update card fields
- `DELETE /api/cards/:scanId` — delete card
- `GET /api/cards/:scanId/image` — get card image

## Data Model Notes

### Platform tables
- `users`, `sessions`, `oauth_states`, `user_roles`, `user_app_access`

### Kanban tables
- `projects`, `project_members`, `project_invites`, `project_activities`, `user_state`

### DTI Connector tables
- `dti_connectors`, `dti_api_keys`, `dti_hierarchy_levels`, `dti_model_datapoints`
- `dti_files`, `dti_assets`, `dti_asset_values`
- `dti_connector_members`, `dti_connector_invites`

### Card Scanner tables
- `card_scans` (scan_id, user_id, name, company, position, phone, email, website, address, raw_text, image, created_at)

## UX/Behavior Notes
- Sync indicator is a circle near avatar (green/yellow/red states).
- Project sharing uses a link-based modal.
- Member management modal supports staged changes with explicit `Uebernehmen`.
- Role changes/removals are owner-only.
- Removed members lose project visibility on sync.
- Activity panel opens from the right as an overlay (board layout does not shift).

## Coding Rules For Agents
- Keep stack simple (no framework migration unless requested).
- Prefer localized edits over rewrites.
- Preserve German UI labels/copy style unless localization work is requested.
- Keep API behavior backward-safe unless user requested breaking changes.
- When changing roles/invites/projects, update both backend route and frontend handling.

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
5. DTI Connector: connector CRUD, hierarchy/model editing, file upload, API docs.
6. Card Scanner: webcam/upload capture, OCR processing, card list with thumbnails, image preview modal, delete with confirmation.
7. Admin panel: user roles, app access toggling, user deletion.

## Deployment Notes
- Recommended: Linux VPS + Nginx + PM2 + HTTPS.
- Add production callback URI in Google OAuth settings.
- SQLite file must be on persistent storage with backups.

## Notes
- No formal automated tests in repo yet.
- Favor small manual validations and concise change summaries.
