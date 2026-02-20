# Workspace Platform

A self-hosted workspace platform with modular apps, Google OAuth authentication, and role-based access control.

## Apps

### Kanban Board
Project management with drag & drop Kanban boards. Create columns, cards, and collaborate with team members via invite links.

- Drag & drop cards between columns
- Project sharing with roles (Owner, Editor, Viewer)
- Activity feed with real-time updates
- Multi-language support (DE / EN)

### DTI Connector
Data management system for structured product data. Define hierarchies, data models, manage files, and expose data via REST API.

- Multi-connector architecture with per-connector API keys
- Hierarchy levels, model datapoints, multi-language assets
- File uploads with EN/DE language variants
- Import/Export (ZIP, Excel, CSV)
- Connector sharing with invite links and role-based access
- External API for third-party integrations
- Interactive API documentation page

### Card Scanner
Business card scanner with OCR text recognition. Photograph or upload business cards, extract structured contact data, and manage a personal card collection.

- Camera capture (webcam) and image upload
- OCR via Tesseract.js with Otsu binarization preprocessing
- Automatic field extraction (name, company, position, phone, email, website, address)
- Image storage with thumbnail preview in list view
- Full CRUD with inline delete from list
- Multi-language support (DE / EN)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Server | Express 4 |
| Database | SQLite |
| Auth | Google OAuth 2.0 |
| Frontend | Vanilla HTML / CSS / JS |
| Deployment | Docker + Docker Compose |

No frameworks, no ORMs, no build tools. Pure vanilla stack.

## Getting Started

### Prerequisites
- Node.js 20+ or Docker
- Google OAuth credentials ([Google Cloud Console](https://console.cloud.google.com/apis/credentials))

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Alaettin/kanban.git
   cd kanban
   ```

2. Create `.env` from example:
   ```bash
   cp .env.example .env
   ```

3. Configure `.env`:
   ```env
   PORT=3000
   NODE_ENV=production
   PUBLIC_BASE_URL=https://your-domain.com
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

4. Add the OAuth redirect URI in Google Cloud Console:
   ```
   https://your-domain.com/auth/google/callback
   ```

### Run with Docker (recommended)

```bash
docker compose up --build -d
```

### Run locally

```bash
npm install
npm start
```

The app will be available at `http://localhost:3000`.

## Updating

```bash
git pull && docker compose up -d --build
```

## Project Structure

```
.
├── server.js              # Entry point
├── shared/
│   ├── auth.js            # Google OAuth + session management
│   ├── db.js              # SQLite async wrapper
│   └── app-registry.js    # App registration
├── platform/
│   ├── login.html         # Login page
│   ├── dashboard.*        # App launcher
│   └── admin/             # Admin panel
├── apps/
│   ├── kanban/            # Kanban Board app
│   ├── dti-connector/     # DTI Connector app
│   └── card-scanner/      # Card Scanner app
├── data/                  # SQLite DB + uploaded files (gitignored)
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Roles & Permissions

### Platform-level
| Role | Permissions |
|------|------------|
| Superadmin | Full access, user management, bypasses all guards |
| Admin | User management, role & app access assignment |
| User | Access to assigned apps only |

### Per-resource (Projects / Connectors)
| Role | Permissions |
|------|------------|
| Owner | Full control, sharing, deletion |
| Editor | Read & write data |
| Viewer | Read-only access |

## License

Private repository.
