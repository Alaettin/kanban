# Plan: PySD-Simulation in die Resilience-App integrieren (Variante 2 — Plotly + reale Inputs)

## Context

Die Resilience-App in der Kanban-Plattform (`apps/resilience/`) hat einen 3-Stepper-Wizard, der bisher nur mit Mock-Daten arbeitet. Die echte Supply-Chain-Simulation aus `simulation_rl/` (PySD, kalibriert auf MQ.xlsx, mit 8 Disruption-Szenarien und 4-R-Resilience-Score) wird dahinter geschaltet — inklusive **interaktiver Plotly-Diagramme**. Der User klickt sich durch die 3 Schritte, sieht zoombare Charts und echte Berechnungen.

### Drei wichtige Entscheidungen mit dem User getroffen

1. **Deployment:** Docker (per docker-compose) — Python 3.11 + venv kommen ins Image, `simulation_rl/` als Volume.
2. **History:** erst später — keine DB-Persistenz, Sims werden nur einmal angezeigt. Spart 0,5 Tage. Kann später als Erweiterung kommen.
3. **UI-Inputs:** Alle Mock-Konzepte (4 Materialien, generische Maßnahmen, Info-Cards) werden **komplett ersetzt** durch Inputs, die direkt auf reale PySD-Parameter mappen. Keine Mock-Reste.

### Out of Scope

- Multi-Modell (User lädt eigene Excel)
- Optimierungslauf (`main.py`, 10–30 Min)
- Multi-User mit isolierten Working Dirs

---

## Architektur-Überblick

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER                                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ apps/resilience/index.html + app.js + Plotly.js         │   │
│  │   Stepper Wizard (3 Steps) + Plot-Container              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │ POST /api/resilience/simulation/run  │
│                          │ GET  /api/resilience/simulation/:id  │
└──────────────────────────▼──────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│  EXPRESS BACKEND (Docker-Container)                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ apps/resilience/routes.js                                │   │
│  │   - Sequentielle Job-Queue (eine Sim gleichzeitig)       │   │
│  │   - child_process.spawn("python", ["web_simulation.py"]) │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │ stdin/stdout (JSON)                  │
└──────────────────────────▼──────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│  PYTHON SUBPROZESS (im selben Docker-Container)                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ simulation_rl/web/web_simulation.py                      │   │
│  │   - liest JSON von stdin                                 │   │
│  │   - ruft ResilienceModel/CalibrationModel/SCModel auf    │   │
│  │   - schreibt JSON nach stdout (Plotly-Traces + Metriken) │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## UI-Inputs: Mock raus, real rein

### Step 1 — "Modell + Parameter" (vorher: Kalibrierung mit Material-Dropdown)

**Raus:**
- Material-Dropdown (Alu/Lithium/Kupfer/Stahl)
- Info-Cards "Lieferant / Menge / Lieferdatum"
- Bestelldatum-Picker
- "Lieferanten-Zuverlässigkeit"-Dropdown

**Rein:**
- **Info-Banner** oben: "MQ-Hersteller — kalibriert auf reale Excel-Daten (365 Tage)" — Kontext, kein Input.
- **5 reale Parameter** als Slider mit Number-Input daneben:

| Label im UI | Maps to | Bereich | Default |
|---|---|---|---|
| Lagerlimit | `LagerLimit_MQ` | 10.000–300.000 | 230.000 |
| Sicherheitsbestand | `Sicherheitsbestand_MQ` | 0–100.000 | 50.000 |
| Produktionskapazität | `ProductionLimit_MQ` | 1.000–30.000 | 15.000 |
| Bestellverzögerung | `MaterialOrderDelay_MQ` | 0,1–0,9 | 0,5 |
| Multi-Sourcing-Anteil | `Anteil_MQ_Lieferant` | 0–100% | 100% |

- **Button "Modell prüfen"** → Backend rechnet Kalibrierung. Frontend zeigt:
  - **Loss-Wert** in einer Card: "0,52 — das Modell weicht im 95-%-Fall um 52 % von den realen Daten ab"
  - **2 Plotly-Charts:** Wareneingang Sim vs. Real, Versand Sim vs. Real

### Step 2 — "Störung wählen" (vorher: 5 Mock-Disruptions mit Multi-Select)

**Raus:**
- Qualitätsmangel, Nachfrageanstieg (haben kein PySD-Äquivalent)
- Multi-Select (echte Disruptions sind nicht kombinierbar)

**Rein: 8 echte Disruptions als Cards (Single-Select)**

| Card im UI | PySD-Disruption (in `DISRUPTIONS`) | Was passiert |
|---|---|---|
| ⚠️ MA-Knappheit | `MA_Knappheit` | Personalausfall 2 Wochen |
| 🚧 Grenzschließung | `Grenzschließung` | Kein Versand 10 Tage |
| 📦 Container-Mangel | `Containershortage` | Lieferzeit-Schock, 3 Wochen |
| ❄️ Wintersturm | `Wintersturm` | Multi-Parameter, 2 Wochen |
| 🏚️ Lagertechnik-Ausfall | `Lagertechnik` | 3 Wochen |
| 🌍 Erdbeben | `Erdbeben` | 3 Phasen, 50 Tage |
| 💻 Hackerangriff | `Hacker` | 60 Tage |
| 🎲 Zufalls-Disruption | `VariableDisruption` | Stress-Test |

- **Button "Krise simulieren"** → Backend rechnet `ResilienceModel`. Frontend zeigt:
  - **4 große Metric-Cards:** Robustness / Redundancy / Resourcefulness / Rapidity + Gesamt-Score
  - **Plotly-Chart 1:** Lieferfähigkeit über 365 Tage mit eingefärbter Disruption-Phase + Recovery-Phase (rot/orange Rectangles)
  - **Plotly-Chart 2:** 4-R-Balken als Bar-Chart

### Step 3 — "Maßnahmen testen" (vorher: 5 generische Maßnahmen mit Multi-Select)

**Raus:**
- "Alternativ-Lieferant", "Expresslieferung", "Produktionsplan anpassen" als abstrakte Checkboxen

**Rein: 5 konkrete Parameter-Verstärker als Slider mit "vorher → nachher"-Anzeige**

| Slider im UI | Maps to | Bereich | Default |
|---|---|---|---|
| Lagerlimit-Faktor | × `LagerLimit_*` | ×1,0 bis ×2,0 | ×1,0 |
| Sicherheitsbestand-Faktor | × `Sicherheitsbestand_*` | ×1,0 bis ×3,0 | ×1,0 |
| Versandgeschwindigkeit | × `readytoshipDelay_*` | ×0,5 bis ×1,5 | ×1,0 |
| Produktionskapazität-Faktor | × `ProductionLimit_*` | ×1,0 bis ×2,0 | ×1,0 |
| Multi-Sourcing-Split | `Anteil_*` | 0–100% | 100% |

- **Button "Vergleichen"** → Backend ruft Wrapper **2 ×** auf (vorher ohne Overrides, nachher mit). Frontend zeigt:
  - **4 Metric-Cards mit Delta-Pfeilen** (↑/↓ vs. den Step-2-Werten)
  - **Plotly-Chart:** 2 Lieferfähigkeitskurven überlagert (Original gestrichelt grau, Optimiert durchgezogen grün)

---

## Phase 1 — Backend-Vorbereitung (½ Tag)

### 1.1 Endpoints

| Methode | Pfad | Zweck |
|---|---|---|
| `POST` | `/api/resilience/simulation/run` | startet Simulation (sync ~5–30 s) |
| `GET`  | `/api/resilience/simulation/:simId` | holt Status + Ergebnis + Plots aus dem RAM |
| `GET`  | `/api/resilience/simulations` | Liste der letzten Sims (für Debug, später History) |
| `DELETE` | `/api/resilience/simulation/:simId` | aus dem RAM-Cache entfernen |

**Auth-Middleware:** `auth.requireAuth, resolveWorkspace, writeGuard()` für POST/DELETE.

### 1.2 Job-Queue (einfach gehalten)

```js
let currentJob = null;  // { simId, child, startedAt }
const simResults = new Map();  // simId → { metrics, plots, expires }

function isJobBusy() { return currentJob !== null; }
```

- Max. 1 aktive Sim gleichzeitig, sonst `429 Too Many Requests`.
- Ergebnisse 15 Minuten im RAM, dann verworfen.
- Reicht für Single-User-Tests; später ggf. `bullmq` nachrüsten.

### 1.3 Subprozess-Aufruf

```js
const { spawn } = require("child_process");

function runPySim(config) {
  return new Promise((resolve, reject) => {
    const child = spawn("python3", ["/app/simulation_rl/web/web_simulation.py"], {
      cwd: "/app/simulation_rl/web"
    });
    let stdout = "", stderr = "";
    const timeout = setTimeout(() => child.kill("SIGKILL"), 60_000);
    child.stdout.on("data", d => { stdout += d; });
    child.stderr.on("data", d => { stderr += d; });
    child.on("close", code => {
      clearTimeout(timeout);
      if (code === 0) resolve(JSON.parse(stdout));
      else reject(new Error(`Python exit ${code}: ${stderr}`));
    });
    child.stdin.write(JSON.stringify(config));
    child.stdin.end();
  });
}
```

---

## Phase 2 — Python-Wrapper (1 Tag)

### 2.1 Neuer Ordner

```
simulation_rl/
└── web/
    ├── web_simulation.py     ← neuer Wrapper
    └── README.md             ← API-Doku
```

### 2.2 Wrapper-Logik

`web_simulation.py`:

1. Liest **JSON von stdin**:
   ```json
   {
     "step": "disruption",
     "supply_chain": { "MQ": { "Alles": ["Lieferant"] } },
     "user_overrides": {
       "LagerLimit_MQ": 250000,
       "Sicherheitsbestand_MQ": 60000
     },
     "disruption_type": "Erdbeben",
     "final_time": 365,
     "locale": "de"
   }
   ```

2. Wählt das passende Modell:
   - `step == "calibration"` → `CalibrationModel`
   - `step == "disruption"` → `ResilienceModel` mit Disruption
   - `step == "measures"` → 2× `ResilienceModel` (Original + mit Overrides)

3. Führt `.run()` aus (~5–30 Sekunden).

4. Konvertiert DataFrame-Spalten in **Plotly-Trace-Format**:
   ```python
   def to_plotly_trace(series, name, color, dash=None):
       return {
           "type": "scatter",
           "mode": "lines",
           "x": list(range(len(series))),
           "y": series.tolist(),
           "name": name,
           "line": {"color": color, "dash": dash} if dash else {"color": color},
       }
   ```

5. Schreibt **JSON nach stdout**:
   ```json
   {
     "ok": true,
     "metrics": {
       "robustness": 0.13, "redundancy": 0.84,
       "resourcefulness": 0.01, "rapidity": 45.65,
       "score": 87.69, "min_productivity": 0.17, "min_day": 130
     },
     "plots": {
       "productivity": { "traces": [], "layout": {} },
       "fourR_bars": { "traces": [], "layout": {} }
     }
   }
   ```

6. Bei Fehler: `{"ok": false, "error": "..."}` + Exit-Code 1.

### 2.3 Reuse, was schon da ist

- `pysd_model/models.py::SCModel/CalibrationModel/ResilienceModel/DISRUPTIONS`
- `pysd_model/util/calc_4r.py::run_optimization`
- `cfg_default_pysd.json` (voroptimierte Parameter)
- `pysd_model/data/MQ.xlsx` (Realdaten)

---

## Phase 3 — Frontend Plotly + UI-Komplettumbau (1,5 Tage)

### 3.1 Plotly einbinden

Lokal hosten (wegen Docker-Air-Gap):
```html
<script src="vendor/plotly-2.35.min.js" charset="utf-8"></script>
```

### 3.2 HTML-Komplettumbau

In `apps/resilience/index.html`, `<section id="page-simulation">` (Z. 467–506) komplett ersetzen mit:
- Neue Slider-Container für Step 1 (5 Slider)
- Neue Disruption-Card-Grid für Step 2 (8 Cards)
- Neue Maßnahmen-Slider-Container für Step 3 (5 Slider)
- Plot-Container `#sim-plot-1`, `#sim-plot-2` pro Step

### 3.3 app.js Umbau (Z. 9029–9466)

**Löschen:**
- `SIM_MATERIALS`, `SIM_DISRUPTIONS`, `SIM_MEASURES` (Mock-Arrays)
- `generateFakeResults()`, `generateFakeComparison()`, `fakeSimulate()`
- `renderResultsHTML()`, `renderComparisonHTML()` (werden durch Plotly ersetzt)
- `renderSimCalibration()`, `renderSimDisruptions()`, `renderSimMeasuresStep()` neu schreiben

**Neu:**
- `SIM_PARAMS` (Slider-Definitionen für Step 1 + Step 3)
- `SIM_DISRUPTIONS_REAL` (8 echte Disruptions mit Mapping)
- `runSimulation(step, payload)` — API-Call mit Loading-State
- `renderPlot(containerId, plotSpec)` — Plotly.react Wrapper
- `renderMetricCards(metrics)` — 4-R-Cards + Score
- `renderSliders(config, state)` — Slider-Bauer
- `applyDisruptionSelection(card)` — Single-Select-Toggle

### 3.4 i18n-Strings

In das `I18N`-Objekt (Z. 139–900) für jede neue UI-Stelle DE + EN Strings:
- Slider-Labels, Hover-Tooltips
- Plot-Titel, Achsenbeschriftungen (kommen aus Backend, lokalisiert via `locale`)
- Status-Texte ("Modell prüfen", "Krise simulieren", "Vergleichen")

---

## Phase 4 — Step 1 zusammenstecken (½ Tag)

User-Flow:
1. User sieht 5 Slider mit Defaults.
2. Verschiebt z.B. Lagerlimit auf 250.000.
3. Klick "Modell prüfen" → POST mit `step: "calibration"`, `user_overrides: {...}`.
4. Loading-Overlay läuft (Spinner + "Das kann bis zu 30 Sekunden dauern").
5. Antwort kommt zurück → Loss-Wert-Card erscheint + 2 Plotly-Charts.
6. User kann Slider neu setzen und "Modell prüfen" nochmal klicken.

**Verifikation:** Default-Werte → Loss ~**0,52** ✓

---

## Phase 5 — Step 2 zusammenstecken (½ Tag)

User-Flow:
1. User sieht 8 Disruption-Cards, eine wählbar (Single-Select).
2. Klick auf "Erdbeben"-Card → hervorgehoben.
3. Klick "Krise simulieren" → POST mit `step: "disruption"`, `disruption_type: "Erdbeben"`, plus die Parameter-Overrides aus Step 1.
4. Antwort → 4 Metric-Cards + 2 Plotly-Charts erscheinen.

**Verifikation:** Erdbeben gewählt → Score ~**87,7**, Min-Productivity **0,17 bei Tag 130** ✓

---

## Phase 6 — Step 3 zusammenstecken (½ Tag)

User-Flow:
1. User sieht 5 Maßnahmen-Slider mit Default ×1,0.
2. Verschiebt z.B. Lagerlimit-Faktor auf ×1,5.
3. Klick "Vergleichen" → POST mit `step: "measures"`, `disruption_type: "Erdbeben"`, `user_overrides: {...}`, `measure_overrides: {...}`.
4. Backend ruft Wrapper **2 ×** auf (sequenziell, im selben Sub-Prozess pooled).
5. Antwort → Vergleichs-Anzeige (4 Cards mit Deltas + überlagerte Kurven).

**Verifikation:** Lagerlimit-Faktor ×1,5 → Score steigt sichtbar, Redundancy-Balken größer ✓

---

## Docker-Setup-Änderungen

### `Dockerfile`

```dockerfile
# vorhandenes node-Image bleibt
FROM node:20

# Python 3.11 + venv ergänzen
RUN apt-get update && apt-get install -y \
    python3.11 python3.11-venv \
    && rm -rf /var/lib/apt/lists/*

# Simulation-Code reinkopieren
COPY simulation_rl /app/simulation_rl

# venv + Dependencies bauen
RUN python3.11 -m venv /app/simulation_rl/.venv \
    && /app/simulation_rl/.venv/bin/pip install --upgrade pip \
    && /app/simulation_rl/.venv/bin/pip install -r /app/simulation_rl/requirements.txt

# Symlink, damit "python3" auf den venv-Python zeigt
RUN ln -sf /app/simulation_rl/.venv/bin/python3 /usr/local/bin/python3-sim

# (Rest vom Dockerfile bleibt)
```

Im Express-Subprozess-Aufruf dann `/usr/local/bin/python3-sim` statt `python3` verwenden, damit garantiert der venv-Python aktiv ist.

### `docker-compose.yml`

```yaml
services:
  kanban:
    # vorhandene Konfig bleibt
    volumes:
      - ./data:/app/data
      - ./simulation_rl:/app/simulation_rl:ro   # NEU: Sim-Code read-only mounten
```

**Build-Zeit-Warnung:** Erstes `docker compose build` dauert mit PySD + numpy + scipy ~3–5 Minuten zusätzlich.

---

## Stolpersteine

1. **Subprozess-Sicherheit:** JSON-Schema-Validierung am Endpoint (z. B. via `ajv`). Whitelisting der Disruption-Werte (`["Erdbeben", "Hacker", ...]`) und Parameter-Namen. Niemals User-Strings als Shell-Args.
2. **PySD schreibt `pysd_model/models/MQ_sc.py`:** Bei zwei parallelen Calls → File-Korruption. Job-Queue (Phase 1.2) verhindert das.
3. **Plotly-Bundle 3 MB:** einmalig laden, gecacht. Alternativ `plotly-basic-2.x.min.js` (~1 MB, reicht für Linecharts/Bars).
4. **Memory ~100 MB pro Sim:** Job-Queue mit max. 1 active job (Phase 1.2) deckt das ab.
5. **Docker-Build-Zeit:** PySD + numpy + scipy dauern ~3–5 Min beim ersten Build. CI-Caching für `pip` lohnt sich.
6. **Excel-Datei:** `MQ.xlsx` muss im Image vorhanden sein (über `COPY simulation_rl`).
7. **i18n:** Frontend setzt `locale: "de"` oder `"en"` im Payload. Wrapper liefert lokalisierte Plot-Titel zurück.

---

## Verifikation

| Phase | Test | Erwartung |
|---|---|---|
| 2 | `python3 web_simulation.py < test_input.json` | JSON mit `metrics` + `plots` |
| 1 | `curl -X POST /api/resilience/simulation/run` | gleiche Antwort wie Phase 2 |
| 3 | Statisches Test-JSON ins UI laden | Plotly-Charts erscheinen, Zoom/Hover funktionieren |
| 4 | Default-Slider → "Modell prüfen" | Loss **0,52** |
| 5 | Erdbeben wählen | Score **87,7**, Min-Productivity **0,17 bei Tag 130** |
| 6 | Lagerlimit ×1,5 → "Vergleichen" | Score steigt sichtbar, Redundancy-Balken größer |

**Vergleichswerte stehen fest** (aus den manuellen Standalone-Tests in `Simulation_Erklaerung.docx`):
- Calibration Loss: **0,5216**
- Erdbeben Score: **87,69**
- Erdbeben Productivity-Min: **0,17 (Tag 130)**

Diese Zahlen müssen aus dem Web-UI mit denselben Inputs identisch wiederkommen.

---

## Kritische Dateien

### Edits
- `apps/resilience/routes.js` — 4 Endpoints, Subprozess-Helper, Job-Queue
- `apps/resilience/app.js` — Mock-Funktionen Z. 9029–9466 komplett ersetzen
- `apps/resilience/index.html` — HTML-Umbau `<section id="page-simulation">` (Z. 467–506)
- `apps/resilience/styles.css` — `.sim-plot`, Slider-Styles, Disruption-Card-Grid
- `Dockerfile` — Python 3.11 + venv ergänzen
- `docker-compose.yml` — `simulation_rl/` als Volume mounten

### Neue Dateien
- `simulation_rl/web/web_simulation.py`
- `simulation_rl/web/README.md`
- `apps/resilience/vendor/plotly-2.35.min.js`

### Wiederverwendet
- `simulation_rl/pysd_model/models.py` — `SCModel`, `CalibrationModel`, `ResilienceModel`, `DISRUPTIONS`
- `simulation_rl/pysd_model/util/calc_4r.py` — `run_optimization`
- `simulation_rl/cfg_default_pysd.json`, `simulation_rl/pysd_model/data/MQ.xlsx`

---

## Geschätzte Zeit: 4,5 Tage

| Phase | Aufwand |
|---|---|
| 1 Backend-Vorbereitung | 0,5 Tage |
| 2 Python-Wrapper | 1 Tag |
| 3 Frontend Plotly + UI-Umbau | 1,5 Tage |
| 4 Step 1 zusammenstecken | 0,5 Tage |
| 5 Step 2 zusammenstecken | 0,5 Tage |
| 6 Step 3 zusammenstecken | 0,5 Tage |
| **Summe** | **4,5 Tage** |

Phase 7 (History) wurde explizit weggelassen. Phase 8 (Optimierung im Hintergrund) optional, +3–5 Tage.

---

## Empfohlene Implementierungs-Reihenfolge

1. **Phase 2 lokal:** `web_simulation.py` mit Test-JSON, **ohne Web-UI**.
2. **Phase 1:** Express-Endpoint dahinter, mit `curl` testen.
3. **Phase 3:** Plotly + UI-Umbau, mit statischem Test-JSON aus Phase 2.
4. **Phase 4:** Step 1 komplett zusammenstecken. Wenn das läuft, sind 5 + 6 nur noch Variationen.
5. **Phasen 5 + 6** nacheinander.
6. **Docker-Anpassung:** kann parallel zu 4–6 laufen, sobald lokal alles funktioniert.
