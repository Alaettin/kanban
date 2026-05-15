import matplotlib.pyplot as plt
import pandas as pd
import copy
import argparse, json, os

if __name__ == "__main__" and __package__ is None or __package__ == "":
    from models import SCModel
    from util.cfg_util import merge_config_with_args
else:
    from .models import SCModel


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Simulation script")
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

    model = SCModel(
        config["supply_chain"], 
        init_params, 
        config["data_path"],
        config["data_map"],
        config["target_company"]
    )
    if not args.noplot:
        model.draw()

    results, _ = model.run(
        final_time=config.get("final_time", 365), 
        time_step=config.get("time_step", 0.0625), 
        saveper=config.get("saveper", 1)
    )

    print(list(zip(list(results.columns), list(results.iloc[-1]))))

    if not args.noplot:
        target_company = config["target_company"]
        results[[f"Lieferungsrate_WORLD_{target_company}", f"Marktnachfrage_WORLD_{target_company}"]].plot()

        # plot multisourcing
        cols = [c for c in [f"offeneBestellung_{target_company}_Holz", f"VirtuelleBestellung_{target_company}_Holz", f"fehlendeBestellungen_{target_company}_Anderer", f"fehlendeBestellungen_{target_company}_Lieferant"] if c in results.columns]
        if cols: results[cols].plot()
        
        cols = [c for c in [f"Eingang_{target_company}", f"Eingang_{target_company}_Lieferant", f"Eingang_{target_company}_Anderer"] if c in results.columns]
        if cols: results[cols].plot()
        
        cols = [c for c in [f"Bestellung_{target_company}", f"Bestellung_{target_company}_Lieferant", f"Bestellung_{target_company}_Anderer"] if c in results.columns]
        if cols: results[cols].plot()

        # plot all companies
        for key in ["Eingang", "Lieferung", "Kundenauftrag", "Bestellung"]:
            results[[el for el in results.columns if f"{key}_" in el and el.count("_") == 1]].plot()

        plt.xlabel("Time")
        plt.ylabel("Units")
        plt.legend()
        plt.show()




