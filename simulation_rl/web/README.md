# `web_simulation.py` — JSON-Wrapper für die Resilience-App

Dieses Skript ist der **Brücken-Layer** zwischen dem Node.js-Backend der Kanban-Plattform und der PySD-Simulation. Es liest **JSON von stdin**, ruft das passende Modell auf (`SCModel` / `CalibrationModel` / `ResilienceModel`) und schreibt das Ergebnis als **JSON nach stdout** — inklusive Plotly-Trace-Definitionen, die das Frontend direkt rendern kann.

## Schnellstart (lokal)

```powershell
# vom Projekt-Root aus
cmd /c '"..\.venv\Scripts\python.exe" web_simulation.py < test_calibration.json > out.json'
```

## Input-Format

```json
{
  "step": "calibration" | "disruption" | "measures",
  "user_overrides": { "LagerLimit_MQ": 250000, "Sicherheitsbestand_MQ": 60000 },
  "disruption_type": "Erdbeben",
  "measure_overrides": { "LagerLimit_MQ": 350000 },
  "final_time": 365,
  "locale": "de"
}
```

| Feld | Wann nötig | Erklärung |
|---|---|---|
| `step` | immer | `"calibration"` (Sim vs. Realdaten), `"disruption"` (Krise), `"measures"` (Vergleich vorher/nachher) |
| `user_overrides` | optional | Dictionary `{paramName: value}` — überschreibt einzelne PySD-Parameter |
| `disruption_type` | nur disruption/measures | einer von 8 Werten — siehe unten |
| `measure_overrides` | nur measures | wie `user_overrides`, aber für den "nachher"-Lauf |
| `final_time` | optional | Default 365 Tage |
| `locale` | optional | `"de"` (default) oder `"en"` — beeinflusst Plot-Titel und Legenden |

### Erlaubte `disruption_type`-Werte

`MA_Knappheit`, `Grenzschließung`, `Containershortage`, `Wintersturm`, `Lagertechnik`, `Erdbeben`, `Hacker`, `VariableDisruption`

## Output-Format (Erfolg)

```json
{
  "ok": true,
  "metrics": { /* siehe pro Step unten */ },
  "plots": {
    "<plot_id>": {
      "traces": [ /* Plotly trace objects */ ],
      "layout": { "title": "...", "xaxis": {...}, "yaxis": {...}, "shapes": [...] }
    }
  }
}
```

### Output je Step

| Step | `metrics` Felder | `plots` Keys |
|---|---|---|
| `calibration` | `loss`, `loss_pct` | `calibration_eingang`, `calibration_ausgang` |
| `disruption` | `robustness`, `redundancy`, `resourcefulness`, `rapidity`, `score`, `min_productivity`, `min_day` | `productivity`, `fourR_bars` |
| `measures` | `before {…}`, `after {…}`, `delta_score` | `productivity_compare`, `fourR_compare` |

## Output-Format (Fehler)

```json
{
  "ok": false,
  "error": "Invalid step: 'bogus'",
  "traceback": "Traceback (most recent call last): ..."
}
```

Exit-Code 1 bei Fehler, sonst 0.

## Verifikations-Werte (Default-Inputs)

| Step | Erwartung |
|---|---|
| `calibration` (Defaults) | `loss ≈ 0,52` |
| `disruption` (Erdbeben, Defaults) | `score ≈ 87,7`, `min_productivity ≈ 0,17`, `min_day ≈ 130` |
| `measures` (Erdbeben, Lager ×1,5) | `delta_score ≈ +0,07` (kleines Delta, Erdbeben ist sehr heftig) |

## Architektur-Notes

- Das Skript setzt `sys.path` und `cwd` automatisch auf `simulation_rl/pysd_model/`, damit PySD die Realdaten (`data/MQ.xlsx`) und Templates findet. Es kann von jedem cwd aus aufgerufen werden.
- Lesen von stdin ist **BOM-tolerant** (`utf-8-sig` zuerst, dann `utf-16` als Fallback) — wichtig für Aufrufe aus PowerShell.
- Output-Größen: `calibration ≈ 33 KB`, `disruption ≈ 10 KB`, `measures ≈ 20 KB`.

## Topologien

| Step | Topologie | Warum |
|---|---|---|
| `calibration` | mehrstufig (MQ ← HolzLief/EisenLief/KunstLief ← Saege/Blatt/…) | Wie in `pysd_model/default_sim_config.json` — passt zur Excel-Realdaten-Kalibrierung |
| `disruption` / `measures` | simpel (`MQ ← Lieferant`) | Alle Disruption-Definitionen in `DISRUPTIONS` referenzieren das Unternehmen `Lieferant` |
