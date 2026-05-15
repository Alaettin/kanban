import pysd
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import copy
import os

if __name__ == "__main__" and __package__ is None or __package__ == "":
    from util.model_inst import create_model, SDModel
    from util.calc_4r import run_optimization
else:
    from .util.model_inst import create_model, SDModel
    from .util.calc_4r import run_optimization


class SCModel:
    def __init__(self, supply_chain, init_params, data_path, data_map, target_company, error_fn=None):
        self.params = init_params
        self.target_company = target_company
        self.error_fn = error_fn

        # load data
        data = pd.read_excel(data_path, "daten")

        # set params for nachfrage and output
        for k, v in data_map.items():
            if k in data.columns:
                data_k = data[k]
                data_k = data_k[data_k != 0]
                self.params[v] = data_k
        
        # create model and run SD
        self.model = SDModel(f"{self.target_company}_sc", supply_chain)

    def run(self, update_params={}, final_time=365, time_step=0.0625, saveper=1, return_columns=None, print_params=True):
        
        params = copy.deepcopy(self.params)
        for k, v in update_params.items():
            params[k] = v

        return (self.model.run(final_time=final_time, time_step=time_step, saveper=saveper, params=params, print_params=print_params, return_columns=return_columns), 0)

    def draw(self):
        self.model.draw()


class CalibrationModel(SCModel):
    def __init__(self, supply_chain, init_params, data_path, data_map, target_company, error_fn=None):
        super().__init__(supply_chain, init_params, data_path, data_map, target_company, error_fn)
    
    def run(self, update_params={}, final_time=365, time_step=0.0625, saveper=1, print_params=True, return_columns=None):
        
        params = copy.deepcopy(self.params)
        for k, v in update_params.items():
            params[k] = v

        results = self.model.run(final_time=final_time, time_step=time_step, saveper=saveper, params=params, print_params=print_params, return_columns=return_columns)
        
        calibration_error = self.error_fn(results)
        return (results, calibration_error)


class ResilienceModel(SCModel):
    def __init__(self, supply_chain, init_params, data_path, data_map, target_company, error_fn=None):
        super().__init__(supply_chain, init_params, data_path, data_map, target_company, error_fn)
        self.disruption_params = {}
    
    def set_disruption(self, disruption_dict_, dis_factor=11):
        
        disruption_dict = copy.deepcopy(disruption_dict_)
        for company, company_dict in disruption_dict.items():
            for param_name, param_dis in company_dict.items():
                param_dis["span"] = [s if isinstance(s, (int, float)) else s() for s in param_dis["span"]]

        def get_event_params(init_param, param_dis):
            # first add intermediate time step for event start
            spans = list(param_dis["span"])
            spans.insert(1, (spans[0] + spans[1]) // 2)

            event_params = []
            old_goal = init_param
            for i, (s0, s1) in enumerate(zip(spans[:-1], spans[1:])):
                span = int(s1 - s0)
                if span <= 0: continue
                vals = np.linspace(1, span + 1, span) if i == 0 else np.linspace(span + 1, 1, span)

                goal = param_dis["goals"][i](init_param)
                event_params += ((goal - (goal - old_goal) * dis_factor ** -vals) if i == 0 else 
                                 (old_goal + (goal - old_goal) * dis_factor ** -vals)).tolist()
                old_goal = goal
            
            return event_params

        self.disruption_params = {
            f"{param_name}_{company}":
            pd.Series(
                [self.params.get(f"{param_name}_{company}", 0)] * int(param_dis["span"][0]) + 
                get_event_params(self.params.get(f"{param_name}_{company}", 0), param_dis) +
                [self.params.get(f"{param_name}_{company}", 0)] * (365 - int(param_dis["span"][-1])))
            for company, company_dict in disruption_dict.items()
            for param_name, param_dis in company_dict.items()
        }
    
    def run(self, update_params={}, final_time=365, time_step=0.0625, saveper=1, productivity_window=14, print_params=True, return_columns=None):
        
        params = copy.deepcopy(self.params)
        for k, v in update_params.items():
            params[k] = v
        for k, v in self.disruption_params.items():
            params[k] = v

        results = self.model.run(final_time=final_time, time_step=time_step, saveper=saveper, params=params, print_params=print_params, return_columns=return_columns)

        # calculate 4r's
        target_comp = self.target_company
        lieferungen = np.array([0] * productivity_window + list(results[f"TotalLieferung_WORLD_{target_comp}"]))
        nachfragen = np.array([0] * productivity_window + list(results[f"TotalNachfrage_WORLD_{target_comp}"]))
        lieferungen_real = np.array([0] * productivity_window + list(results[f"AusgangReal_{target_comp}"]))

        sum_lieferung_window = lieferungen[productivity_window:] - lieferungen[:-productivity_window]
        sum_nachfrage_window = nachfragen[productivity_window:] - nachfragen[:-productivity_window]
        sum_lieferung_real_window = lieferungen_real[productivity_window:] - lieferungen_real[:-productivity_window]

        productivity = (sum_lieferung_window[productivity_window:] / np.maximum(sum_nachfrage_window[:-productivity_window], 0.0000001))
        productivity[:productivity_window] = 1

        productivity_real = (sum_lieferung_real_window[productivity_window:] / np.maximum(sum_nachfrage_window[:-productivity_window], 0.0000001))
        productivity_real[:productivity_window] = 1

        results["productivity"] = np.concatenate([np.ones(len(results) - len(productivity)), productivity])
        results["productivity_real"] = np.concatenate([np.ones(len(results) - len(productivity_real)), productivity_real])

        r4 = run_optimization(results["productivity"], 0)

        if r4 is None:
            target = 0
        else:
            r4, predicted_d, predicted_r, predicted_f = r4
            Robustness, Redundancy, Resourcefulness, Rapidity = r4
            target = Robustness + Resourcefulness + 50 * Redundancy + Rapidity if self.error_fn is None else self.error_fn(Robustness, Redundancy, Resourcefulness, Rapidity)

            results["predicted_d"] = np.array(predicted_d)[:, 1]
            results["predicted_r"] = np.array(predicted_r)[:, 1]
            results["predicted_f"] = np.array(predicted_f)[:, 1]
        
        return results, target


RNG = np.random.default_rng()

DISRUPTIONS = {
    "MA_Knappheit": {
        "Lieferant": {
            "MA_Flex_offset": {"span": [100, 114], "goals": [lambda x: x * 0, lambda x: x]},
            "CoverageLimit": {"span": [100, 114], "goals": [lambda x: x * 0, lambda x: x]},
            "ProductionLimit": {"span": [100, 114], "goals": [lambda x: x * 0, lambda x: x]},
        }
    },
    "Grenzschließung": {
        "Lieferant": {
            "CoverageLimit": {"span": [100, 110], "goals": [lambda x: x * 0, lambda x: x]},
        }
    },
    "Containershortage": {
        "Lieferant": {
            "readytoshipDelay": {"span": [100, 121], "goals": [lambda x: x * 0.1, lambda x: x]},
            "CoverageLimit": {"span": [100, 121], "goals": [lambda x: x * 0.1, lambda x: x]},
        }
    },
    "Wintersturm": {
        "Lieferant": {
            "MA_Flex_offset": {"span": [100, 115], "goals": [lambda x: x * 0.1, lambda x: x]},
            "CoverageLimit": {"span": [100, 115], "goals": [lambda x: x * 0.1, lambda x: x]},
            "ProductionLimit": {"span": [100, 115], "goals": [lambda x: x * 0.1, lambda x: x]},
        }
    },
    "Lagertechnik": {
        "Lieferant": {
            "LagerLimit": {"span": [100, 120], "goals": [lambda x: x * 0.1, lambda x: x]},
            "ProductionLimit": {"span": [100, 115], "goals": [lambda x: x * 0.1, lambda x: x]},
        }
    },
    "Erdbeben": {
        "Lieferant": {
            "readytoshipDelay": {"span": [100, 110, 150], "goals": [lambda x: x * 0.1, lambda x: x * 0.5, lambda x: x]},
            "ProductionDelay": {"span": [100, 110, 150], "goals": [lambda x: x * 0.1, lambda x: x * 0.5, lambda x: x]},
            "ProductionLimit": {"span": [100, 110, 150], "goals": [lambda x: x * 0.1, lambda x: x * 0.5, lambda x: x]},
            "Sicherheitsbestand": {"span": [100, 110, 150], "goals": [lambda x: x * 0.1, lambda x: x * 0.5, lambda x: x]},
            "LimitfinishedInventory": {"span": [100, 110, 150], "goals": [lambda x: x * 0.1, lambda x: x * 0.5, lambda x: x]},
            "LagerLimit": {"span": [100, 110, 150], "goals": [lambda x: x * 0.1, lambda x: x * 0.5, lambda x: x]},
            "MA_Flex_offset": {"span": [100, 110, 150], "goals": [lambda x: x * 0.1, lambda x: x * 0.5, lambda x: x]},
            "CoverageLimit": {"span": [100, 110, 150], "goals": [lambda x: x * 0.1, lambda x: x * 0.5, lambda x: x]},
        }
    },
    "Hacker": {
        "Lieferant": {
            "MaterialOrderDelay": {"span": [90, 150], "goals": [lambda x: x * 0, lambda x: x]},
            "LagerLimit": {"span": [90, 150], "goals": [lambda x: x * 0, lambda x: x]},
        }
    },
    "VariableDisruption": {
        "Lieferant": {
            "MA_Flex_offset":           {"span": [lambda: int(np.random.rand() * 20 + 90), lambda: int(np.random.rand() * 30 + 110)], "goals": [lambda x: x * RNG.triangular(0, 0.9, 1), lambda x: x]},
            "MaterialOrderDelay":       {"span": [lambda: int(np.random.rand() * 20 + 90), lambda: int(np.random.rand() * 30 + 110)], "goals": [lambda x: x * RNG.triangular(0, 0.9, 1), lambda x: x]},
            "LagerLimit":               {"span": [lambda: int(np.random.rand() * 20 + 90), lambda: int(np.random.rand() * 30 + 110)], "goals": [lambda x: x * RNG.triangular(0, 0.9, 1), lambda x: x]},
            "ProductionLimit":          {"span": [lambda: int(np.random.rand() * 20 + 90), lambda: int(np.random.rand() * 30 + 110)], "goals": [lambda x: x * RNG.triangular(0, 0.9, 1), lambda x: x]},
            "LimitfinishedInventory":   {"span": [lambda: int(np.random.rand() * 20 + 90), lambda: int(np.random.rand() * 30 + 110)], "goals": [lambda x: x * RNG.triangular(0, 0.9, 1), lambda x: x]},
            "ProductionDelay":          {"span": [lambda: int(np.random.rand() * 20 + 90), lambda: int(np.random.rand() * 30 + 110)], "goals": [lambda x: x * RNG.triangular(0, 0.9, 1), lambda x: x]},
            "readytoshipDelay":         {"span": [lambda: int(np.random.rand() * 20 + 90), lambda: int(np.random.rand() * 30 + 110)], "goals": [lambda x: x * RNG.triangular(0, 0.9, 1), lambda x: x]},
        }
    },
}
