
from utils.util import ParamTransform, ConditionalParam, intify
from utils.al_sims import SimInstance, SimInstanceThreaded, SimInstanceRay

from pysd_model.models import CalibrationModel as SimInstancePySDCalibration, ResilienceModel as SimInstancePySDResilience, SCModel as SimInstancePySDSC, DISRUPTIONS

import numpy as np
import json


################################
# Loss Funktionen zur Optimierung
################################

def al_calib(sim):
    return sim.outputs("_ds_AkkumProd")[0].y_values[-1]

def pysd_calibrate(results):
    return max(np.percentile(np.abs(results["EingangslagerAccum_MQ"] / results["EingangReal_MQ"] - 1), 95),
               np.percentile(np.abs(results["TotalShipped_MQ"] / results["AusgangReal_MQ"] - 1), 95))

def pysd_resilience(Robustness, Redundancy, Resourcefulness, Rapidity):
    return Robustness + Resourcefulness + 50 * Redundancy + Rapidity


#######################
# Params tuning dict
#######################

TUNE_PARAMS_BASE = {
    # UNTERNEHMEN
    "MaterialOrderDelay": ParamTransform(bounds=[0.1, 0.9]),
    "ProductionDelay": ParamTransform(bounds=[0.1, 0.9]),
    "readytoshipDelay": ParamTransform(bounds=[0.1, 0.9]),
    
    "LagerLimit": ParamTransform(int, bounds=[10000, 300000]),
    "CoverageLimit": ParamTransform(int, bounds=[1000, 30000]),
    "ProductionLimit": ParamTransform(int, bounds=[1000, 30000]),
    "LimitfinishedInventory": ParamTransform(int, bounds=[10000, 300000]),
    "Sicherheitsbestand": ParamTransform(int, bounds=[0, 100000]),
    
    "delayTimeShipping_amp": ParamTransform(bounds=[0.1, 7.0]),
    "delayTimeShipping_freq": ParamTransform(bounds=[0.01, 1.0]),
    "delayTimeShipping_shift": ParamTransform(bounds=[0.0, 30.0]),
    "delayTimeShipping_offset": ParamTransform(bounds=[1.0, 30.0]),

    "MA_Flex_amp": ParamTransform(bounds=[0.1, 0.9]),
    "MA_Flex_freq": ParamTransform(bounds=[0.01, 1.0]),
    "MA_Flex_shift": ParamTransform(bounds=[0.0, 30.0]),
    "MA_Flex_offset": ParamTransform(bounds=[0.1, 0.9]),

    "delayTimeProduction_amp": ParamTransform(bounds=[0.1, 7.0]),
    "delayTimeProduction_freq": ParamTransform(bounds=[0.01, 1.0]),
    "delayTimeProduction_shift": ParamTransform(bounds=[0.0, 30.0]),
    "delayTimeProduction_offset": ParamTransform(bounds=[1.0, 30.0]),

    # STARTBEDINGUNGEN
    "TotalCustomerOrder_start": ParamTransform(int, bounds=[0, 300000]),
    "Eingangslager_start": ParamTransform(int, bounds=[0, 100000]),
}

LOSS_FNS = {
    "al_calib": al_calib,
    "pysd_calibrate": pysd_calibrate,
    "pysd_resilience": pysd_resilience,
    "none": lambda *args: -1
}

SIM_TYPES = {
    "SimInstance": SimInstance,
    "SimInstanceThreaded": SimInstanceThreaded,
    "SimInstanceRay": SimInstanceRay,
    "SimInstancePySDCalibration": SimInstancePySDCalibration,
    "SimInstancePySDResilience": SimInstancePySDResilience,
    "SimInstancePySDSC": SimInstancePySDSC
}

def load_experiment_config(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    sim_cfg = config.get("sim_config", {})
    data_cfg = config.get("data", {})
    opt_cfg = config.get("optimization", {})
    al_cfg = config.get("anylogic_config", {})

    sim_type_name = opt_cfg.get("sim_type")
    sim_type = SIM_TYPES.get(sim_type_name)
    if not sim_type:
        raise ValueError(f"Unknown sim_type: {sim_type_name}")
    
    loss_fn_name = opt_cfg.get("loss_fn")
    loss_fn = LOSS_FNS.get(loss_fn_name)
    if not loss_fn:
         raise ValueError(f"Unknown loss_fn: {loss_fn_name}")

    disruption = sim_cfg.get("disruption")
    if disruption:
        if isinstance(disruption, str) and disruption in DISRUPTIONS:
             disruption = DISRUPTIONS[disruption]


    tune_params = TUNE_PARAMS_BASE.copy()
    model_path_or_sc = None
    
    # Logic from original cfg.py
    if sim_type in (SimInstance, SimInstanceRay, SimInstanceThreaded):
        tune_params = {
            # UNTERNEHMEN = Parameter (siehe oben)
            **tune_params,

            # LIEFERANT = Parameter_1 (als suffix)
            **{f"{k}1": v for k, v in tune_params.items()}
        }
        model_path_or_sc = al_cfg.get("model_path")
        
    elif sim_type in (SimInstancePySDCalibration, SimInstancePySDResilience, SimInstancePySDSC):
        sc = sim_cfg.get("sc", {})
        sc_full = {}
        for comp, materials_dict in sc.items():

            if comp in sc_full.keys():
                sc_full[comp]["IN"] = materials_dict
            else:
                sc_full[comp] = {"IN": materials_dict, "OUT": []}

            for _, suppliers in materials_dict.items():
                for sup in suppliers:
                    if sup == "WORLD":
                        continue

                    if sup in sc_full.keys():
                        sc_full[sup]["OUT"].append(comp)
                    else:
                        sc_full[sup] = {"IN": {}, "OUT": [comp]}

        # prepare supply chain tune params
        tune_params_full = {}
        for comp, inout_dict in sc_full.items():
            materials_dict = inout_dict["IN"]
            tune_params_full.update(**{f"{k}_{comp}": v for k, v in tune_params.items()})
            for mat, suppliers in materials_dict.items():
                if len(suppliers) > 1:
                    tune_params_full.update(**{f"Anteil_{comp}_{sup}": ParamTransform(bounds=[0.0, 1.0]) for sup in suppliers})
            
        tune_params = tune_params_full
        model_path_or_sc = sc
    else:
        raise NotImplementedError(f"Simulation backend type {sim_type} not implemented!")

    # Reduce TUNE_PARAMS if optimizable_params is set
    optimizable_params = opt_cfg.get("optimizable_params")
    if optimizable_params:
        print(f"Filtering TUNE_PARAMS based on optimizable_params: {optimizable_params}")
        # Substring match logic: keep k if any string in optimizable_params is found in k
        original_count = len(tune_params)
        tune_params = {
            k: v 
            for k, v in tune_params.items() 
            if any(op in k for op in optimizable_params)
        }
        print(f"Reduced TUNE_PARAMS from {original_count} to {len(tune_params)} items.")

    return {
        "SIM_TYPE": sim_type,
        "LOSS_FN": loss_fn,
        "TUNE_PARAMS": tune_params,
        "MODEL_PATH_OR_SC": model_path_or_sc,
        "TARGET_COMPANY": sim_cfg.get("target_company"),
        "DATA_PATH": data_cfg.get("data_path"),
        "DATA_MAP": data_cfg.get("data_map"),
        "DISRUPTION": disruption,
        "JAVA_PATH": al_cfg.get("java_path"),
        "MODEL_PATH": al_cfg.get("model_path"),
    }

