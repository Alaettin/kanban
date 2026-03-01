@echo off
setlocal

cd /d "%~dp0"

rem Google OAuth Werte bitte in .env setzen (nicht hier hardcoden)
set "GOOGLE_CLIENT_ID=358370832959-h4583nn3spij14blmp3r0406ahagedch.apps.googleusercontent.com"
set "GOOGLE_CLIENT_SECRET=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"
set "GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js wurde nicht gefunden. Bitte zuerst Node.js installieren.
  pause
  exit /b 1
)

if not exist "node_modules\express" (
  echo Installiere Abhaengigkeiten...
  call npm install
  if errorlevel 1 (
    echo npm install ist fehlgeschlagen.
    pause
    exit /b 1
  )
)

rem ── EDC Docker Container starten ──────────────────────────
where docker >nul 2>&1
if errorlevel 1 (
  echo [EDC] Docker nicht gefunden - EDC Container werden nicht gestartet.
  echo [EDC] Du kannst sie spaeter manuell ueber die App starten.
  goto :start_server
)

echo [EDC] Starte EDC Container (Provider + Consumer)...
docker compose -p edc -f "apps\edc-connector\docker\docker-compose.yml" up -d
if errorlevel 1 (
  echo [EDC] Container-Start fehlgeschlagen - weiter ohne EDC.
) else (
  echo [EDC] Container gestartet (Provider CP+DP, Consumer CP+DP)
)

:start_server
echo Starte Workspace Server...
start "" http://localhost:3000
call npm start

rem ── EDC Container stoppen beim Beenden ────────────────────
where docker >nul 2>&1
if not errorlevel 1 (
  echo [EDC] Stoppe EDC Container...
  docker compose -p edc -f "apps\edc-connector\docker\docker-compose.yml" down
)

endlocal
