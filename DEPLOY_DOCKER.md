# Docker Deploy (Single Container)

## 1) Environment
Create `.env` from template:

```bash
cp .env.example .env
```

Set at least:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `PUBLIC_BASE_URL` (for example `https://kanban.deinedomain.de`)

`GOOGLE_CALLBACK_URL` can stay empty. It is auto-generated as:
`PUBLIC_BASE_URL/auth/google/callback`.

## 2) Google Console
In Google OAuth Client, add redirect URI:

`https://deine-domain/auth/google/callback`

If testing only via IP/HTTP:

`http://DEINE_IP/auth/google/callback`

## 3) Build + Start

```bash
docker compose up --build -d
```

## 4) Update

```bash
git pull
docker compose up --build -d
```

## 5) Logs / Status

```bash
docker compose ps
docker compose logs -f workspace
```
