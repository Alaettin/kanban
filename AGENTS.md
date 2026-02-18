# AGENTS.md

## Purpose
This repository contains a multi-user Kanban app with Google login, shared projects, role-based access, SQLite persistence, and an activity feed.
Use this file as the default operating guide for any coding agent working in this project.

## Project Snapshot
- Runtime: Node.js
- Backend: Express (`server.js`)
- Frontend: Vanilla HTML/CSS/JS (`index.html`, `styles.css`, `app.js`)
- Database: SQLite (`data/kanban.db`)
- Auth: Google OAuth 2.0 + cookie sessions
- Collaboration: shared projects, invites, member roles (`owner`, `editor`, `viewer`)

## Important Files
- `server.js`: API routes, auth/session flow, SQLite schema and maintenance jobs
- `app.js`: board UI, project sync, invites, member management, role-aware UI, activity panel
- `index.html`: board layout, share/member modals, activity panel, templates
- `styles.css`: all UI styles including sync status, management modals, and activity overlay
- `login.html`: login page
- `package.json`: scripts and dependencies
- `.env.example`: required env var template

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
Auth/User:
- `GET /api/me`
- `POST /auth/logout`
- `GET /auth/google`
- `GET /auth/google/callback`

Projects:
- `GET /api/projects`
- `GET /api/projects/summary` (lightweight polling)
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `PATCH /api/projects/:projectId` (rename)
- `PUT /api/projects/:projectId/state`
- `DELETE /api/projects/:projectId` (owner only)

Invites:
- `POST /api/projects/:projectId/invites`
- `POST /api/invites/:token/accept`
- `GET /invite/:token` (redirect helper)

Members/Roles:
- `GET /api/projects/:projectId/members`
- `PATCH /api/projects/:projectId/members/:userId` (`editor`/`viewer`, owner only)
- `DELETE /api/projects/:projectId/members/:userId` (owner only, owner cannot be removed)

Activity:
- `GET /api/projects/:projectId/activities`
- `POST /api/projects/:projectId/activities`

## Data Model Notes
Primary collaborative model:
- `projects`
- `project_members`
- `project_invites`
- `project_activities`
- `sessions`
- `oauth_states`
- `users`

Legacy table still present for migration compatibility:
- `user_state`

Frontend canonical state:
- `state.activeProjectId`
- `state.projects[]`
- project: `{ id, name, columns[] }`
- column: `{ id, title, cards[] }`
- card fields: `title`, `description`, `priority`, `dueDate`, `assignee`, `tags`, `progress`, `checklist`

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
1. `node --check app.js` and `node --check server.js` succeed.
2. `npm start` boots without runtime errors.
3. Login flow works.
4. Shared project edits sync to another user without manual page refresh.
5. Member role update via `Uebernehmen` works.
6. Member removal hides project for removed user.
7. Owner cannot be removed.
8. Share invite links can be generated and accepted.
9. Activity panel loads and refreshes entries.

## Deployment Notes
- Recommended: Linux VPS + Nginx + PM2 + HTTPS.
- Add production callback URI in Google OAuth settings.
- SQLite file must be on persistent storage with backups.

## Notes
- No formal automated tests in repo yet.
- Favor small manual validations and concise change summaries.
