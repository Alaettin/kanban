@echo off
setlocal

cd /d "%~dp0"

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

echo Starte Kanban Server...
start "" http://localhost:3000
call npm start

endlocal
