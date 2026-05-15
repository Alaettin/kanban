"""
verify_simulation.py — Beweis-Test: zwei Läufe mit extremen Werten zeigen,
dass die Simulation die Inputs wirklich nutzt.

Ruft web_simulation.py mit Min- und Max-Parametern auf, jeweils mit Erdbeben.
Druckt Ergebnisse nebeneinander.
"""
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
WRAPPER = os.path.join(HERE, "web_simulation.py")

# Python from the venv next to simulation_rl/
PYTHON = sys.executable

DISRUPTION = "Erdbeben"

# Extreme low parameters — sehr fragile Lieferkette
CONFIG_MIN = {
    "step": "disruption",
    "disruption_type": DISRUPTION,
    "user_overrides": {
        "LagerLimit_MQ": 10000,
        "Sicherheitsbestand_MQ": 0,
        "ProductionLimit_MQ": 1000,
        "MaterialOrderDelay_MQ": 0.9,
        "LagerLimit_Lieferant": 10000,
        "Sicherheitsbestand_Lieferant": 0,
        "ProductionLimit_Lieferant": 1000,
    },
    "final_time": 365,
    "locale": "de",
}

# Extreme high parameters — sehr robuste Lieferkette
CONFIG_MAX = {
    "step": "disruption",
    "disruption_type": DISRUPTION,
    "user_overrides": {
        "LagerLimit_MQ": 300000,
        "Sicherheitsbestand_MQ": 100000,
        "ProductionLimit_MQ": 30000,
        "MaterialOrderDelay_MQ": 0.1,
        "LagerLimit_Lieferant": 300000,
        "Sicherheitsbestand_Lieferant": 100000,
        "ProductionLimit_Lieferant": 30000,
    },
    "final_time": 365,
    "locale": "de",
}


def run_one(label, config):
    print(f"\n=== {label} ==================================")
    print(f"Inputs: {json.dumps(config['user_overrides'], indent=2)}")
    print(f"Disruption: {config['disruption_type']}")
    print(f"Starte Wrapper-Prozess (PID coming from subprocess)…")

    proc = subprocess.Popen(
        [PYTHON, WRAPPER],
        cwd=HERE,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    out, err = proc.communicate(input=json.dumps(config).encode("utf-8"))
    if proc.returncode != 0:
        print(f"FEHLER (exit {proc.returncode}):")
        print(err.decode("utf-8", errors="replace"))
        return None

    if err:
        print("stderr:", err.decode("utf-8", errors="replace").strip())

    data = json.loads(out.decode("utf-8"))
    if not data.get("ok"):
        print("Sim-Fehler:", data.get("error"))
        return None

    m = data["metrics"]
    print(f"\n  Robustness     = {m['robustness']:.4f}")
    print(f"  Redundancy     = {m['redundancy']:.4f}")
    print(f"  Resourcefulness= {m['resourcefulness']:.4f}")
    print(f"  Rapidity       = {m['rapidity']:.4f}")
    print(f"  Score          = {m['score']:.4f}")
    print(f"  Min-Productivity = {m['min_productivity']:.4f} (Tag {m['min_day']})")
    return m


def main():
    print("=" * 70)
    print("BEWEIS-TEST: Zwei Sim-Läufe mit extrem unterschiedlichen Parametern.")
    print("Wenn die Sim die Inputs wirklich nutzt, müssen sich die Ergebnisse")
    print("deutlich unterscheiden.")
    print("=" * 70)

    a = run_one("LAUF A — fragile Lieferkette (MIN-Werte)", CONFIG_MIN)
    b = run_one("LAUF B — robuste Lieferkette (MAX-Werte)", CONFIG_MAX)

    if not (a and b):
        print("\nAbbruch: mindestens ein Lauf hat keine Ergebnisse geliefert.")
        sys.exit(1)

    print("\n" + "=" * 70)
    print("VERGLEICH")
    print("=" * 70)
    print(f"{'Metrik':<22} {'MIN (fragil)':>15} {'MAX (robust)':>15} {'Delta':>12}")
    print("-" * 66)
    for label, key in [
        ("Robustness",       "robustness"),
        ("Redundancy",       "redundancy"),
        ("Resourcefulness",  "resourcefulness"),
        ("Rapidity",         "rapidity"),
        ("Score",            "score"),
        ("Min-Productivity", "min_productivity"),
    ]:
        va, vb = a[key], b[key]
        delta = vb - va
        print(f"{label:<22} {va:>15.4f} {vb:>15.4f} {delta:>+12.4f}")

    score_a, score_b = a["score"], b["score"]
    if abs(score_b - score_a) < 0.5:
        print(
            "\nWARNUNG: Die Scores sind fast identisch (< 0,5 Differenz). "
            "Das könnte bedeuten, dass das Erdbeben so heftig ist, "
            "dass selbst extreme Parameter wenig Effekt haben — oder dass "
            "Parameter-Mapping nicht wirkt. Bitte prüfen."
        )
    else:
        print(f"\nERGEBNIS: Deutlicher Unterschied (Score-Delta = {score_b - score_a:+.2f}). "
              "=> Die Simulation nutzt die Inputs nachweislich.")


if __name__ == "__main__":
    main()
