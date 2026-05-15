"""
Generate params.txt for a given supply chain structure and Anteil values.

Usage:
    python generate_params.py <sc_config.json> [--output params.txt]

The JSON config file should look like:

{
    "mq_params": {
        "MaterialOrderDelay_MQ": 0.827,
        "delayTimeShipping_amp_MQ": 0.5,
        ...
    },
    "materials": {
        "Holz": {
            "multiplikator": 2,
            "suppliers": {
                "Lieferant": {"anteil": 0.7},
                "Anderer":   {"anteil": 0.3}
            }
        },
        "Kunststoff": {
            "multiplikator": 2,
            "suppliers": {
                "Lieferant5": {
                    "anteil": 0.6,
                    "materials": {
                        "Rohstoff": {
                            "multiplikator": 1,
                            "suppliers": {
                                "SubLief1": {"anteil": 0.5},
                                "SubLief2": {"anteil": 0.5}
                            }
                        }
                    }
                }
            }
        }
    }
}

Suppliers can be nested to any depth via the "materials" key.
You can also override individual supplier parameters by adding them to the
supplier dict (any key other than "anteil" and "materials" is treated as a
param override):

    "Lieferant": {"anteil": 0.7, "ProductionDelay": 0.9, "LagerLimit": 250000}
"""

import json
import sys
import argparse
from pathlib import Path

# ── Default MQ (target company) parameters ────────────────────────────────
DEFAULT_MQ_PARAMS = {
    "MaterialOrderDelay_MQ":        0.827,
    "delayTimeShipping_amp_MQ":     0.5,
    "LagerLimit_MQ":                231391,
    "ProductionDelay_MQ":           0.777,
    "CoverageLimit_MQ":             19473,
    "ProductionLimit_MQ":           30000,
    "readytoshipDelay_MQ":          0.783,
    "LimitfinishedInventory_MQ":    77389,
    "MA_Flex_amp_MQ":               0.9,
    "Sicherheitsbestand_MQ":        88121,
    "delayTimeProduction_amp_MQ":   3.279,
    "MA_Flex_freq_MQ":              0.838,
    "MA_Flex_shift_MQ":             8.074,
    "MA_Flex_offset_MQ":            0.586,
    "delayTimeShipping_freq_MQ":    0.147,
    "delayTimeShipping_shift_MQ":   24.477,
    "delayTimeShipping_offset_MQ":  1,
    "delayTimeProduction_freq_MQ":  0.267,
    "delayTimeProduction_shift_MQ": 0.073,
    "delayTimeProduction_offset_MQ":2.372,
    "Eingangslager_start_MQ":       95000,
    "TotalCustomerOrder_start_MQ":  179000,
}

# ── Default supplier parameters (suffix will be replaced) ─────────────────
# These are the "template" values shared by all suppliers by default.
DEFAULT_SUPPLIER_PARAMS = {
    "Sicherheitsbestand":        39978,
    "MaterialOrderDelay":        0.788,
    "LagerLimit":                213964,
    "ProductionDelay":           0.708,
    "CoverageLimit":             26565,
    "ProductionLimit":           30000,
    "readytoshipDelay":          0.71,
    "LimitfinishedInventory":    300000,
    "delayTimeShipping_amp":     2.949,
    "MA_Flex_amp":               0.663,
    "delayTimeProduction_amp":   2.697,
    "MA_Flex_freq":              0.419,
    "MA_Flex_shift":             20.634,
    "MA_Flex_offset":            0.588,
    "delayTimeShipping_freq":    0.212,
    "delayTimeShipping_shift":   5.12,
    "delayTimeShipping_offset":  2.071,
    "delayTimeProduction_freq":  0.034,
    "delayTimeProduction_shift": 2.927,
    "delayTimeProduction_offset":3.157,
    "Eingangslager_start":       7000,
    "TotalCustomerOrder_start":  216000,
}

# Keys in a supplier dict that are NOT param overrides
_RESERVED_KEYS = {"anteil", "materials"}


def _fmt(value):
    """Format a numeric value: drop trailing zeros for floats, keep ints."""
    if isinstance(value, float) and value == int(value):
        return str(int(value))
    return str(value)


def _extract_supply_chain(materials: dict, parent: str, sc_map: dict):
    """
    Recursively extract the flattened supply chain structure.
    Populates sc_map: { company_name: { material_name: [suppliers] } }
    """
    if not materials:
        return

    if parent not in sc_map:
        sc_map[parent] = {}

    for mat_name, mat_cfg in materials.items():
        suppliers_dict = mat_cfg.get("suppliers", {})
        supplier_names = list(suppliers_dict.keys())

        # Record this parent's material -> suppliers
        sc_map[parent][mat_name] = supplier_names

        # Recurse for each supplier
        for sup_name, sup_cfg in suppliers_dict.items():
            sub_materials = sup_cfg.get("materials")
            if sub_materials:
                _extract_supply_chain(sub_materials, sup_name, sc_map)


def _emit_materials(lines: list[str], parent: str, materials: dict):
    """Recursively emit Multiplikator / Anteil / supplier-param blocks."""
    for mat_name, mat_cfg in materials.items():
        mult = mat_cfg.get("multiplikator", 1)
        lines.append(f"Multiplikator_{parent}_{mat_name}\t{_fmt(mult)}")
        lines.append("")

        suppliers = mat_cfg.get("suppliers", {})
        for sup_name, sup_cfg in suppliers.items():
            # Anteil line
            anteil = sup_cfg.get("anteil", 1)
            lines.append(f"Anteil_{parent}_{sup_name}\t{_fmt(anteil)}")

            # Supplier parameters (with optional overrides)
            for param_base, default_val in DEFAULT_SUPPLIER_PARAMS.items():
                val = sup_cfg.get(param_base, default_val)
                lines.append(f"{param_base}_{sup_name}\t{_fmt(val)}")
            lines.append("")

            # ── Recurse if this supplier itself has materials ──────────
            sub_materials = sup_cfg.get("materials")
            if sub_materials:
                _emit_materials(lines, sup_name, sub_materials)


def update_sim_config(sc_structure: dict):
    """Update default_sim_config.json with the new flattened supply chain."""
    config_path = Path(__file__).parent / "default_sim_config.json"
    if not config_path.exists():
        print(f"Warning: {config_path} not found. Skipping SC sync.")
        return

    try:
        with open(config_path, "r", encoding="utf-8") as f:
            config = json.load(f)

        config["supply_chain"] = sc_structure

        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=4, ensure_ascii=False)
        print(f"Done: Updated supply chain in {config_path}")
    except Exception as e:
        print(f"Error updating sim config: {e}")


def generate_params(cfg: dict) -> tuple[str, dict]:
    """Build the full params.txt content and extract SC structure."""
    lines: list[str] = []
    sc_structure = {}

    # ── 1. MQ parameters ──────────────────────────────────────────────────
    mq = cfg.get("mq_params", DEFAULT_MQ_PARAMS)
    for key, val in mq.items():
        lines.append(f"{key}\t{_fmt(val)}")
    lines.append("")  # blank separator

    # ── 2. Materials (recursive) ──────────────────────────────────────────
    materials = cfg.get("materials", {})
    _emit_materials(lines, "MQ", materials)
    _extract_supply_chain(materials, "MQ", sc_structure)

    # Remove trailing blank lines
    while lines and lines[-1] == "":
        lines.pop()

    return "\n".join(lines) + "\n", sc_structure


def main():
    parser = argparse.ArgumentParser(
        description="Generate params.txt for a supply-chain configuration."
    )
    parser.add_argument(
        "config",
        help="Path to the SC config JSON file.",
    )
    parser.add_argument(
        "-o", "--output",
        default=None,
        help="Output path for params.txt (default: pysd_model/data/params.txt).",
    )
    args = parser.parse_args()

    cfg_path = Path(args.config)
    with open(cfg_path, encoding="utf-8") as f:
        cfg = json.load(f)

    content, sc_structure = generate_params(cfg)
    update_sim_config(sc_structure)

    if args.output:
        out_path = Path(args.output)
    else:
        out_path = Path(__file__).parent / "data" / "params.txt"

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(content, encoding="utf-8")
    print(f"Done: Wrote {len(content.splitlines())} lines -> {out_path}")


if __name__ == "__main__":
    main()
