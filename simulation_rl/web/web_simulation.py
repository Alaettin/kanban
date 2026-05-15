"""
web_simulation.py — Wrapper für die Resilience-App im Kanban-Frontend.

Reads JSON from stdin, runs the appropriate PySD model, writes JSON to stdout.

Input format:
{
  "step": "calibration" | "disruption" | "measures",
  "user_overrides": { "LagerLimit_MQ": 250000, ... },
  "disruption_type": "Erdbeben",        # only for disruption/measures
  "measure_overrides": { ... },         # only for measures
  "final_time": 365,
  "locale": "de" | "en"
}

Output format (success):
{
  "ok": true,
  "metrics": { ... },
  "plots": { "plot_id": { "traces": [...], "layout": {...} }, ... }
}

Output format (error):
{ "ok": false, "error": "...", "traceback": "..." }
Exit code 1 on error.
"""
import json
import os
import sys
import traceback

# Make the parent simulation_rl/pysd_model importable, regardless of cwd
HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(HERE)            # simulation_rl/
PYSD_DIR = os.path.join(PROJECT_ROOT, "pysd_model")
sys.path.insert(0, PYSD_DIR)
os.chdir(PYSD_DIR)  # PySD writes models/ relative to cwd

import numpy as np

from models import SCModel, CalibrationModel, ResilienceModel, DISRUPTIONS
from util.calc_4r import run_optimization


# ----------------------------------------------------------------------
# i18n
# ----------------------------------------------------------------------
LABELS = {
    "de": {
        "title_calibration_eingang": "Wareneingang MQ — Simulation vs. Realität",
        "title_calibration_ausgang": "Versand MQ — Simulation vs. Realität",
        "title_productivity": "Lieferfähigkeit über 365 Tage",
        "title_productivity_compare": "Lieferfähigkeit: Original vs. mit Maßnahmen",
        "title_fourR": "Die 4 R's",
        "title_fourR_compare": "4 R's: Vorher vs. Nachher",
        "axis_day": "Tag",
        "axis_value": "Wert",
        "axis_units": "Einheiten",
        "axis_productivity": "Lieferfähigkeit",
        "legend_real": "Real (Excel)",
        "legend_sim": "Simulation",
        "legend_orig": "Original",
        "legend_optimized": "Mit Maßnahmen",
        "legend_demand": "Nachfrage",
        "shape_disruption": "Störung aktiv",
        "shape_recovery": "Erholung",
        "label_robustness": "Robustness",
        "label_redundancy": "Redundancy",
        "label_resourcefulness": "Resourcefulness",
        "label_rapidity": "Rapidity",
        "label_before": "Vorher",
        "label_after": "Nachher",
    },
    "en": {
        "title_calibration_eingang": "Goods receipt MQ — Simulation vs. Reality",
        "title_calibration_ausgang": "Shipment MQ — Simulation vs. Reality",
        "title_productivity": "Delivery rate over 365 days",
        "title_productivity_compare": "Delivery rate: original vs. with measures",
        "title_fourR": "The 4 R's",
        "title_fourR_compare": "4 R's: before vs. after",
        "axis_day": "Day",
        "axis_value": "Value",
        "axis_units": "Units",
        "axis_productivity": "Delivery rate",
        "legend_real": "Real (Excel)",
        "legend_sim": "Simulation",
        "legend_orig": "Original",
        "legend_optimized": "With measures",
        "legend_demand": "Demand",
        "shape_disruption": "Disruption active",
        "shape_recovery": "Recovery",
        "label_robustness": "Robustness",
        "label_redundancy": "Redundancy",
        "label_resourcefulness": "Resourcefulness",
        "label_rapidity": "Rapidity",
        "label_before": "Before",
        "label_after": "After",
    },
}


# ----------------------------------------------------------------------
# Topology defaults
# ----------------------------------------------------------------------
# Multi-tier supply chain for calibration (matches pysd_model/default_sim_config.json)
TOPO_MULTITIER = {
    "MQ": {
        "Holz": ["HolzLief1", "HolzLief2"],
        "Eisen": ["EisenLief1", "EisenLief2"],
        "Kunststoff": ["KunstLief1"],
    },
    "HolzLief1": {
        "Rundholz": ["Saege1", "Saege2"],
        "Kantholz": ["Blatt1", "Blatt2"],
    },
    "Saege1": {"Stammholz": ["Forst1", "Forst2"]},
    "Blatt1": {"Kern": ["Pflanze1", "Pflanze2"]},
    "EisenLief1": {"Erz": ["Mine1", "Mine2"]},
    "Mine1": {"Rohstoff": ["Abbau1"]},
}

# Simple MQ ← Lieferant for disruption/measures (matches resilience_cfg.json)
TOPO_SIMPLE = {"MQ": {"Alles": ["Lieferant"]}}

DATA_MAP = {
    "geschätzte verteilung der bestellung pro tag": "Marktnachfrage_WORLD_MQ",
    "eingang interpolliert": "EingangReal_MQ",
    "warenausgang interpolliert": "AusgangReal_MQ",
}

DATA_PATH = "data/MQ.xlsx"

# Parameter file paths (relative to pysd_model/)
PARAMS_TXT = "data/params.txt"                       # for multi-tier topology
PARAMS_JSON_SIMPLE = "../cfg_default_pysd.json"      # for simple topology


def load_params_txt(path):
    """Load tab-separated parameter file (used for multi-tier topology)."""
    params = {}
    with open(path, "r", encoding="utf-8") as f:
        for line in f.read().splitlines():
            if "\t" in line:
                k, v = line.split("\t", 1)
                params[k] = float(v)
    return params


def load_params_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# ----------------------------------------------------------------------
# Plotly trace builders
# ----------------------------------------------------------------------
def trace_line(x, y, name, color, dash=None, width=2):
    line = {"color": color, "width": width}
    if dash:
        line["dash"] = dash
    return {
        "type": "scatter",
        "mode": "lines",
        "x": list(x),
        "y": [None if (v is None or (isinstance(v, float) and (np.isnan(v) or np.isinf(v)))) else float(v) for v in y],
        "name": name,
        "line": line,
    }


def trace_bar(labels, values, color, name=None):
    return {
        "type": "bar",
        "x": list(labels),
        "y": [float(v) for v in values],
        "name": name or "",
        "marker": {"color": color},
    }


def disruption_shape(x0, x1, label_text):
    return {
        "type": "rect",
        "xref": "x", "yref": "paper",
        "x0": x0, "x1": x1, "y0": 0, "y1": 1,
        "fillcolor": "rgba(220, 38, 38, 0.18)",
        "line": {"width": 0},
        "layer": "below",
    }


def recovery_shape(x0, x1):
    return {
        "type": "rect",
        "xref": "x", "yref": "paper",
        "x0": x0, "x1": x1, "y0": 0, "y1": 1,
        "fillcolor": "rgba(245, 158, 11, 0.12)",
        "line": {"width": 0},
        "layer": "below",
    }


def get_disruption_span(disruption_dict):
    """Extract earliest start day and latest end day from a disruption."""
    all_spans = []
    for company, params in disruption_dict.items():
        for pname, pdis in params.items():
            spans = pdis["span"]
            resolved = [s() if callable(s) else s for s in spans]
            all_spans.append((resolved[0], resolved[-1]))
    if not all_spans:
        return None
    start = min(s[0] for s in all_spans)
    end = max(s[1] for s in all_spans)
    return start, end


# ----------------------------------------------------------------------
# Step handlers
# ----------------------------------------------------------------------
def run_calibration(user_overrides, final_time, L):
    """Step 1: Calibration model.

    Uses the SIMPLE topology (MQ ← Lieferant) + cfg_default_pysd.json, the same
    setup as the optimization (main.py with optimize_calibration_cfg.json) and as
    the production experiment_cfg_calibrate.json. This ensures that values found
    by Auto-Optimize actually carry over to manual "Modell prüfen" runs.
    """
    init_params = load_params_json(PARAMS_JSON_SIMPLE)
    applied_overrides = dict(user_overrides or {})
    init_params.update(applied_overrides)
    target_company = "MQ"

    def loss_fn(r):
        return max(
            np.percentile(np.abs(r[f"EingangslagerAccum_{target_company}"] / r[f"EingangReal_{target_company}"] - 1), 95),
            np.percentile(np.abs(r[f"TotalShipped_{target_company}"] / r[f"AusgangReal_{target_company}"] - 1), 95),
        )

    model = CalibrationModel(TOPO_SIMPLE, init_params, DATA_PATH, DATA_MAP, target_company, loss_fn)
    results, target = model.run(final_time=final_time, time_step=0.0625, saveper=1, print_params=False)

    days = list(results.index)
    plots = {
        "calibration_eingang": {
            "traces": [
                trace_line(days, results["EingangReal_MQ"], L["legend_real"], "#dc2626", width=2),
                trace_line(days, results["EingangslagerAccum_MQ"], L["legend_sim"], "#2563eb", dash="dash", width=2),
            ],
            "layout": {
                "title": L["title_calibration_eingang"],
                "xaxis": {"title": L["axis_day"]},
                "yaxis": {"title": L["axis_units"]},
                "hovermode": "x unified",
            },
        },
        "calibration_ausgang": {
            "traces": [
                trace_line(days, results["AusgangReal_MQ"], L["legend_real"], "#dc2626", width=2),
                trace_line(days, results["TotalShipped_MQ"], L["legend_sim"], "#2563eb", dash="dash", width=2),
            ],
            "layout": {
                "title": L["title_calibration_ausgang"],
                "xaxis": {"title": L["axis_day"]},
                "yaxis": {"title": L["axis_units"]},
                "hovermode": "x unified",
            },
        },
    }

    return {
        "metrics": {
            "loss": float(target),
            "loss_pct": float(target * 100),
        },
        "plots": plots,
        "received_config": {
            "step": "calibration",
            "topology": "simple (MQ ← Lieferant)",
            "final_time": final_time,
            "user_overrides_applied": applied_overrides,
            "effective_params_sample": {
                k: float(init_params[k]) for k in applied_overrides.keys() if k in init_params
            },
            "data_source": DATA_PATH,
            "base_params_source": PARAMS_JSON_SIMPLE,
        },
    }


def run_disruption(user_overrides, disruption_type, final_time, L):
    """Step 2: Resilience model with selected disruption."""
    if disruption_type not in DISRUPTIONS:
        raise ValueError(f"Unknown disruption_type: {disruption_type}")

    init_params = load_params_json(PARAMS_JSON_SIMPLE)
    applied_overrides = dict(user_overrides or {})
    init_params.update(applied_overrides)

    model = ResilienceModel(TOPO_SIMPLE, init_params, DATA_PATH, DATA_MAP, "MQ", None)
    model.set_disruption(DISRUPTIONS[disruption_type])

    results, score = model.run(final_time=final_time, time_step=0.0625, saveper=1, print_params=False)

    # 4 R's
    r4 = run_optimization(results["productivity"], 0)
    if r4 is None:
        R = Red = Re = Ra = 0.0
    else:
        (R, Red, Re, Ra), _, _, _ = r4

    days = list(results.index)
    prod = results["productivity"].tolist()

    # disruption span for shading
    span = get_disruption_span(DISRUPTIONS[disruption_type])
    shapes = []
    if span:
        # disruption phase (red): from start to mid
        # recovery phase (orange): mid to end
        start, end = span
        mid = (start + end) // 2
        shapes.append(disruption_shape(start, mid, L["shape_disruption"]))
        shapes.append(recovery_shape(mid, end))

    min_idx = int(np.argmin(prod))
    min_val = float(prod[min_idx])

    plots = {
        "productivity": {
            "traces": [
                trace_line(days, prod, L["axis_productivity"], "#2563eb", width=2),
            ],
            "layout": {
                "title": L["title_productivity"],
                "xaxis": {"title": L["axis_day"]},
                "yaxis": {"title": L["axis_productivity"], "range": [0, max(1.6, max(prod) * 1.05)]},
                "shapes": shapes,
                "hovermode": "x unified",
            },
        },
        "fourR_bars": {
            "traces": [
                trace_bar(
                    [L["label_robustness"], L["label_redundancy"], L["label_resourcefulness"], L["label_rapidity"]],
                    [R, Red, Re, Ra],
                    color="#2563eb",
                ),
            ],
            "layout": {
                "title": L["title_fourR"],
                "xaxis": {"title": ""},
                "yaxis": {"title": L["axis_value"]},
            },
        },
    }

    return {
        "metrics": {
            "robustness": float(R),
            "redundancy": float(Red),
            "resourcefulness": float(Re),
            "rapidity": float(Ra),
            "score": float(R + Re + 50 * Red + Ra),
            "min_productivity": min_val,
            "min_day": min_idx,
        },
        "plots": plots,
        "received_config": {
            "step": "disruption",
            "topology": "simple (MQ ← Lieferant)",
            "disruption_type": disruption_type,
            "disruption_span_days": list(span) if span else None,
            "final_time": final_time,
            "user_overrides_applied": applied_overrides,
            "effective_params_sample": {
                k: float(init_params[k]) for k in applied_overrides.keys() if k in init_params
            },
        },
    }


def run_measures(user_overrides, measure_overrides, disruption_type, final_time, L):
    """Step 3: Run two resilience simulations (with and without measure overrides)."""
    if disruption_type not in DISRUPTIONS:
        raise ValueError(f"Unknown disruption_type: {disruption_type}")

    base_params = load_params_json(PARAMS_JSON_SIMPLE)
    applied_user = dict(user_overrides or {})
    base_params.update(applied_user)

    applied_measures = dict(measure_overrides or {})
    measured_params = dict(base_params)
    measured_params.update(applied_measures)

    def _run(p):
        model = ResilienceModel(TOPO_SIMPLE, p, DATA_PATH, DATA_MAP, "MQ", None)
        model.set_disruption(DISRUPTIONS[disruption_type])
        results, _ = model.run(final_time=final_time, time_step=0.0625, saveper=1, print_params=False)
        r4 = run_optimization(results["productivity"], 0)
        if r4 is None:
            return results, (0.0, 0.0, 0.0, 0.0)
        (R, Red, Re, Ra), _, _, _ = r4
        return results, (float(R), float(Red), float(Re), float(Ra))

    res_before, m_before = _run(base_params)
    res_after, m_after = _run(measured_params)

    days = list(res_before.index)
    prod_b = res_before["productivity"].tolist()
    prod_a = res_after["productivity"].tolist()

    span = get_disruption_span(DISRUPTIONS[disruption_type])
    shapes = []
    if span:
        start, end = span
        mid = (start + end) // 2
        shapes.append(disruption_shape(start, mid, L["shape_disruption"]))
        shapes.append(recovery_shape(mid, end))

    R_b, Red_b, Re_b, Ra_b = m_before
    R_a, Red_a, Re_a, Ra_a = m_after

    plots = {
        "productivity_compare": {
            "traces": [
                trace_line(days, prod_b, L["legend_orig"], "#9ca3af", dash="dash"),
                trace_line(days, prod_a, L["legend_optimized"], "#059669", width=2.5),
            ],
            "layout": {
                "title": L["title_productivity_compare"],
                "xaxis": {"title": L["axis_day"]},
                "yaxis": {"title": L["axis_productivity"], "range": [0, max(1.6, max(max(prod_a), max(prod_b)) * 1.05)]},
                "shapes": shapes,
                "hovermode": "x unified",
            },
        },
        "fourR_compare": {
            "traces": [
                trace_bar(
                    [L["label_robustness"], L["label_redundancy"], L["label_resourcefulness"], L["label_rapidity"]],
                    [R_b, Red_b, Re_b, Ra_b],
                    color="#9ca3af",
                    name=L["label_before"],
                ),
                trace_bar(
                    [L["label_robustness"], L["label_redundancy"], L["label_resourcefulness"], L["label_rapidity"]],
                    [R_a, Red_a, Re_a, Ra_a],
                    color="#059669",
                    name=L["label_after"],
                ),
            ],
            "layout": {
                "title": L["title_fourR_compare"],
                "xaxis": {"title": ""},
                "yaxis": {"title": L["axis_value"]},
                "barmode": "group",
            },
        },
    }

    score_b = R_b + Re_b + 50 * Red_b + Ra_b
    score_a = R_a + Re_a + 50 * Red_a + Ra_a

    return {
        "metrics": {
            "before": {
                "robustness": R_b, "redundancy": Red_b,
                "resourcefulness": Re_b, "rapidity": Ra_b,
                "score": score_b,
                "min_productivity": float(min(prod_b)),
            },
            "after": {
                "robustness": R_a, "redundancy": Red_a,
                "resourcefulness": Re_a, "rapidity": Ra_a,
                "score": score_a,
                "min_productivity": float(min(prod_a)),
            },
            "delta_score": float(score_a - score_b),
        },
        "plots": plots,
        "received_config": {
            "step": "measures",
            "topology": "simple (MQ ← Lieferant)",
            "disruption_type": disruption_type,
            "final_time": final_time,
            "user_overrides_applied": applied_user,
            "measure_overrides_applied": applied_measures,
            "effective_before_sample": {k: float(base_params[k]) for k in applied_user.keys() if k in base_params},
            "effective_after_sample": {k: float(measured_params[k]) for k in {**applied_user, **applied_measures}.keys() if k in measured_params},
        },
    }


# ----------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------
def main():
    try:
        # Read stdin as raw bytes so we can strip BOM from any encoding
        raw_bytes = sys.stdin.buffer.read()
        if not raw_bytes:
            raise ValueError("No input received on stdin")
        # try utf-8-sig first (handles plain UTF-8 + UTF-8 BOM), then UTF-16
        try:
            raw = raw_bytes.decode("utf-8-sig")
        except UnicodeDecodeError:
            raw = raw_bytes.decode("utf-16")
        if not raw.strip():
            raise ValueError("No input received on stdin")
        cfg = json.loads(raw)

        step = cfg.get("step")
        if step not in ("calibration", "disruption", "measures"):
            raise ValueError(f"Invalid step: {step!r}")

        locale = cfg.get("locale", "de")
        L = LABELS.get(locale, LABELS["de"])

        user_overrides = cfg.get("user_overrides") or {}
        disruption_type = cfg.get("disruption_type")
        measure_overrides = cfg.get("measure_overrides") or {}
        final_time = int(cfg.get("final_time", 365))

        # Stderr diagnostic — gets forwarded to Express server log
        sys.stderr.write(f"received step={step} disruption={disruption_type} "
                         f"user_overrides={user_overrides} measure_overrides={measure_overrides}\n")
        sys.stderr.flush()

        if step == "calibration":
            result = run_calibration(user_overrides, final_time, L)
        elif step == "disruption":
            result = run_disruption(user_overrides, disruption_type, final_time, L)
        else:
            result = run_measures(user_overrides, measure_overrides, disruption_type, final_time, L)

        output = {"ok": True, **result}
        sys.stdout.write(json.dumps(output))
        sys.stdout.flush()
        sys.exit(0)

    except Exception as e:
        err = {
            "ok": False,
            "error": str(e),
            "traceback": traceback.format_exc(),
        }
        sys.stdout.write(json.dumps(err))
        sys.stdout.flush()
        sys.exit(1)


if __name__ == "__main__":
    main()
