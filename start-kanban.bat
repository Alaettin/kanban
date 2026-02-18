@echo off
setlocal

cd /d "%~dp0"

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
