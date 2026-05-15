import numpy as np
import matplotlib.pyplot as plt
import argparse, json, os

if __name__ == "__main__" and __package__ is None or __package__ == "":
    from models import ResilienceModel, DISRUPTIONS
    from util.cfg_util import merge_config_with_args
else:
    from .models import ResilienceModel, DISRUPTIONS


if __name__ == "__main__":

    ap = argparse.ArgumentParser(description="Resilience script")
    ap.add_argument('-c', '--cfg_path', type=str, default="default_sim_config.json", help="path to cfg")
    ap.add_argument('--noplot', action='store_true', help="Disable plotting")
    ap.add_argument(
        "opts",
        help="Modify config using the command-line",
        default=None,
        nargs=argparse.REMAINDER,
    )
    args = ap.parse_args()

    # Overwrite/update with JSON config if provided
    with open(args.cfg_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    # Merge with command line arguments
    if args.opts: config = merge_config_with_args(config, args.opts)

    # Load parameters from file
    params_path = config.get("default_params", "")
    init_params = {}
    if os.path.exists(params_path):
        with open(params_path, "r", encoding="utf-8") as f:
            if params_path.endswith(".txt"):
                # tab-separated txt
                init_params = {el.split("\t")[0]: float(el.split("\t")[1]) for el in f.read().splitlines() if len(el) > 0 and "\t" in el}
            else:
                # assume json
                init_params = json.load(f)
    else:
        print(f"Warning: Params file {params_path} not found.")

    target_company = config["target_company"]

    model = ResilienceModel(
        config["supply_chain"], 
        init_params,
        config["data_path"],
        config["data_map"],
        target_company,
        None
    )

    disruption_type = config.get("disruption_type", "VariableDisruption")
    if disruption_type in DISRUPTIONS:
        model.set_disruption(DISRUPTIONS[disruption_type])
    else:
        print(f"Warning: Disruption type {disruption_type} not found.")

    results, target = model.run(
        final_time=config.get("final_time", 365), 
        time_step=config.get("time_step", 0.0625), 
        saveper=config.get("saveper", 1)
    )
    
    if not args.noplot:
        results[[f"Eingang_{target_company}", f"Lieferung_{target_company}"]].plot()
        results[["productivity", "productivity_real", "predicted_d", "predicted_r", "predicted_f"]].plot()
        plt.xlabel("Time")
        plt.ylabel("Units")
        plt.legend()
        plt.show()

