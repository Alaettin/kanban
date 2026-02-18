# AGENTS.md

## Purpose
This repository contains a local-first Kanban web app with Google login and SQLite persistence. Use this file as the default operating guide for any coding agent working in this project.

## Project Snapshot
- Runtime: Node.js
- Backend: Express (`server.js`)
- Frontend: Vanilla HTML/CSS/JS (`index.html`, `styles.css`, `app.js`)
- Database: SQLite file at `data/kanban.db`
- Authentication: Google OAuth 2.0 + cookie session

## Important Files
- `server.js`: API, auth flow, session handling, SQLite setup
- `app.js`: full board UI logic, state management, drag/drop, filters, modal logic, remote sync
- `index.html`: board UI structure and templates
- `login.html`: login page
- `styles.css`: all styling
- `start-kanban.bat`: local startup helper (sets OAuth env vars and runs app)
- `package.json`: dependencies and npm scripts

## Runbook
1. Install dependencies: `npm install`
2. Start app: `npm start`
3. Open: `http://localhost:3000`

Alternative:
- Windows helper: `start-kanban.bat`

## API Contract
- `GET /api/me`: current authenticated user
- `GET /api/state`: user board state
- `PUT /api/state`: persist board state (`{ state: object }`)
- `POST /auth/logout`: logout
- `GET /auth/google`: start OAuth login
- `GET /auth/google/callback`: OAuth callback

All `/api/*` board endpoints require a valid session cookie (`sid`).

## Data Model Notes
- Main persisted board payload is JSON stored in `user_state.state_json`.
- Frontend canonical shape:
  - `state.activeProjectId`
  - `state.projects[]`
  - project: `{ id, name, columns[] }`
  - column: `{ id, title, cards[] }`
  - card includes fields like `title`, `description`, `priority`, `dueDate`, `assignee`, `tags`, `progress`, `checklist`
- `app.js` already includes migration/normalization logic; keep it backward compatible when adding fields.

## Coding Rules For Agents
- Keep stack simple: no framework migration unless explicitly requested.
- Prefer minimal, localized edits over rewrites.
- When touching state shape:
  - update normalizers/migrations in `app.js`
  - ensure render paths tolerate old payloads
- Preserve German UI copy style used in existing UI.
- Keep endpoint behavior stable unless user asks for API changes.

## Security Rules
- Never hardcode new credentials/secrets in committed code.
- If changing auth/bootstrap, prefer environment variables over literals.
- Treat `start-kanban.bat` secrets as local dev values; do not propagate them to docs or new files.
- Keep cookies `HttpOnly`, `SameSite=Lax`, and `Secure` in production behavior.

## Verification Checklist
After meaningful changes, run:
1. `npm start` boots without errors.
2. Login page loads at `/` when not authenticated.
3. Board loads at `/board` after login.
4. Create/edit/move/delete cards works.
5. Project and column operations still work.
6. Reload persists board state.
7. Logout returns to login page.

## Out of Scope By Default
- Replacing SQLite
- Converting frontend to React/Vue/etc.
- Changing auth provider away from Google
- Large CSS redesign without explicit request

## Notes
- There is currently no formal automated test suite in this repo.
- Favor small manual validations and clear change summaries.
