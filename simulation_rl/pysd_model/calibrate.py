import matplotlib.pyplot as plt
import numpy as np
import copy
import argparse, json, os

if __name__ == "__main__" and __package__ is None or __package__ == "":
    from models import CalibrationModel
    from util.cfg_util import merge_config_with_args
else:
    from .models import CalibrationModel


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Calibration script")
    ap.add_argument('-c', '--cfg_path', type=str, default="default_sim_config.json", help="path to cfg")
    ap.add_argument('--noplot', action='store_true', help="Disable plotting")
    ap.add_argument(
        "opts",
        help="Modify config using the command-line",
        default=None,
        nargs=argparse.REMAINDER,
    )
    args = ap.parse_args()

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
    
    model = CalibrationModel(
        config["supply_chain"], 
        init_params, 
        config["data_path"],
        config["data_map"],
        target_company,
        lambda results: max(np.percentile(np.abs(results[f"EingangslagerAccum_{target_company}"] / results[f"EingangReal_{target_company}"] - 1), 95), 
                            np.percentile(np.abs(results[f"TotalShipped_{target_company}"] / results[f"AusgangReal_{target_company}"] - 1), 95))
    )

    results, target = model.run(
        final_time=config.get("final_time", 365), 
        time_step=config.get("time_step", 0.0625), 
        saveper=config.get("saveper", 1)
    )
    print("target", target)
    
    if not args.noplot:
        plot_cols = [f"EingangReal_{target_company}", f"AusgangReal_{target_company}", f"EingangslagerAccum_{target_company}", f"TotalShipped_{target_company}"]
        results[[c for c in plot_cols if c in results.columns]].plot()
        plt.xlabel("Time")
        plt.ylabel("Units")
        plt.legend()
        plt.show()

