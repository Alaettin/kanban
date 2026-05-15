from concurrent.futures import ThreadPoolExecutor, as_completed
import os, tqdm, copy
import numpy as np
import pandas as pd
import multiprocessing as mp

from bayes_opt.logger import _Tracker
from bayes_opt.event import Events
from bayes_opt.util import NotUniqueError
import time, json

try:
    import ray
except ImportError:
    print("Running without ray install, run 'pip install ray' if ray needs to be used")

from pysd_model.models import CalibrationModel as SimInstancePySDCalibration, ResilienceModel as SimInstancePySDResilience, SCModel as SimInstancePySDSC

from utils.al_sims import SimInstance, SimInstanceThreaded, SimInstanceRay
from utils.util import SPLIT_STR, SPLIT_STR_PARAM, recursive_update_dict, recurse_dict, recursive_deactivate_dict, recursive_eval_dict, ParamTransform, ConditionalParam


######################
# bayes opt wrapper
# ####################   


class OptimizationWrapper:
    def __init__(self, sim_path_or_supply_chain, sim_class_type, default_params, tune_params, loss_fn, data_path, data_map, target_company, disruption, num_threads=1, constraints={}) -> None:
        self.default_params = default_params
        self.tune_params = tune_params
        self.loss_fn = loss_fn
        self.sim_path_or_supply_chain = sim_path_or_supply_chain
        self.disruption = disruption
        self.data_map = data_map

        self.num_gpus = num_threads
        self.num_fails = 0

        self.sim_class_type = sim_class_type

        if self.sim_class_type is SimInstanceRay:
            
            # Start Ray runtime
            ray.init()

            # Create actor instances in parallel
            self.sims = [SimInstanceRay.remote(sim_path_or_supply_chain, loss_fn, i) for i in range(num_threads)]
        elif self.sim_class_type is SimInstanceThreaded:
            # Create actor instances
            with ThreadPoolExecutor(max_workers=num_threads) as executor:
                # Submit all tasks
                futures = [executor.submit(SimInstanceThreaded, sim_path_or_supply_chain, loss_fn, i) for i in range(num_threads)]

                # Retrieve results as they finish
                self.sims = [future.result() for future in as_completed(futures)] 
        elif self.sim_class_type is SimInstance:
            # Create actor instances
            self.sims = [SimInstance(sim_path_or_supply_chain, loss_fn, i) for i in range(num_threads)]
        elif self.sim_class_type in (SimInstancePySDCalibration, SimInstancePySDResilience, SimInstancePySDSC):
            # Create actor instances --> hack and use same instance always, shouldn't make a difference for pysd
            self.sims = [self.sim_class_type(sim_path_or_supply_chain, self.default_params, data_path, self.data_map, target_company, self.loss_fn)] * num_threads
        else:
            raise NotImplementedError(f"Sim Instance type {self.sim_class_type} not yet implemented!")

        self.constraints = constraints

        self.current_training = ""

        self.pbar = tqdm.tqdm(total=0, desc="Optimizing SIM ...")
        self.step = 0
        self.best = np.inf

    def __call__(self, *args, **kwds):
        if len(args) > 0:
            # optuna
            trial = args[0]
            kwds = {k: (trial.suggest_float(k, v[0], v[1]) if isinstance(v[0], float) or isinstance(v[1], float) else trial.suggest_int(k, v[0], v[1])) for k, v in self.get_tune_dict().items()}
        
        params = self.update_params(kwds)

        loss = np.inf
            
        # check constraints
        for c, fun in self.constraints.items():
            c_s = c.split(SPLIT_STR)
            d = copy.deepcopy(params)
            for k in c_s[:-1]:
                d = d[k]
            if not fun(d[c_s[-1]]):
                # return np.inf in case constraint is violated
                return -loss
        
        if self.sim_class_type is SimInstanceRay:
            # cycle through sims for loading improvements
            if self.step > 1 and len(self.sims) > 4:
                self.sims[((self.step - 1) + len(self.sims)) % len(self.sims)].refresh.remote()

            sim = self.sims[self.step % len(self.sims)]
            self.step += 1

            loss = ray.get(sim.run.remote(params))

        elif self.sim_class_type is SimInstanceThreaded:
            # switch through sims for loading improvements
            sim = self.sims[self.step % len(self.sims)]
            self.step += 1

            loss = sim.run(params)

            # refresh sims every threads x 8 runs
            if self.step % (len(self.sims) * 8) == 0:
                # Create actor instances
                for s in self.sims: s.sim._quit_app()
                self.sims = [self.sim_class_type(self.sim_path_or_supply_chain, self.loss_fn) for _ in range(len(self.sims))]

        elif self.sim_class_type is SimInstance:
            # switch through sims for loading improvements
            sim = self.sims[self.step % len(self.sims)]
            self.step += 1

            loss = sim.run(params)

            # refresh sims every threads x 8 runs
            
            if self.step % (len(self.sims) * 8) == 0:
                # Create actor instances
                for s in self.sims: s.sim._quit_app()
                self.sims = [self.sim_class_type(self.sim_path_or_supply_chain, self.loss_fn) for _ in range(len(self.sims))]

        elif self.sim_class_type in (SimInstancePySDCalibration, SimInstancePySDResilience, SimInstancePySDSC):
            # switch through sims for loading improvements
            sim = self.sims[self.step % len(self.sims)]
            self.step += 1

            if self.disruption:
                sim.set_disruption(self.disruption)

            _, loss = sim.run(params, print_params=self.step==1)

        else:
            raise NotImplementedError(f"Run method for sim type {self.sim_class_type} not yet implemented!")
        
        self.best = min(loss, self.best)

        self.pbar.set_postfix({"loss": loss, "best": self.best}, refresh=False)
        self.pbar.update(1)
        
        return -loss

    def get_tune_dict(self):
        return recurse_dict(self.tune_params)

    # update with tuning
    def update_params(self, kwds, default_params=None, tune_params=None):

        d1_raw = copy.deepcopy(self.default_params if default_params is None else default_params)
        d2_raw = copy.deepcopy(self.tune_params if tune_params is None else tune_params)

        recursive_update_dict(d1_raw, d2_raw)

        for k, v in kwds.items():

            d1 = d1_raw

            kes = k.split(SPLIT_STR)
            for k_s in kes[:-1]:
                d1 = d1[k_s if SPLIT_STR_PARAM not in k_s else k_s.split(SPLIT_STR_PARAM)[0]]
                if SPLIT_STR_PARAM in k_s:
                    k_head, k_param = k_s.split(SPLIT_STR_PARAM)
                    d1 = d1[int(k_param)]
            
            if SPLIT_STR_PARAM in kes[-1]:
                k_head, k_param = kes[-1].split(SPLIT_STR_PARAM)
                if isinstance(d1[k_head], ParamTransform):
                    d1[k_head] = [d1[k_head]] * len(d1[k_head])
                d1[k_head][int(k_param)] = d1[k_head][int(k_param)](v, int(k_param))
            else:
                d1[kes[-1]] = d1[kes[-1]](v)

        # evaluate conditions
        d2_raw = copy.deepcopy(self.tune_params if tune_params is None else tune_params)
        recursive_eval_dict(d1_raw, d2_raw)

        # remove inactive dicts
        recursive_deactivate_dict(d1_raw)

        return d1_raw



def log_transformed(data: dict, opt: OptimizationWrapper):
    target = data.pop("target")
    params = opt.update_params(data["params"] if "params" in data.keys() else data, {}, None)
    pars = {"target": target, "runname": opt.current_training, **params}
    return recurse_dict(pars, unzip_all=True)


class CSVLogger(_Tracker):
    """
    Logger that outputs steps to CSV.

    Parameters
    ----------
    path : str or bytes or os.PathLike
        Path to the file to write to.

    reset : bool
        Whether to overwrite the file if it already exists.

    """

    def __init__(self, path, sep=";", decimal=",", reset=True, transform_fn=None):
        self._path = path
        if reset:
            try:
                os.remove(self._path)
            except OSError:
                pass
        super().__init__()

        self.df = None
        self.sep = sep
        self.decimal = decimal
        self.transform_fn = transform_fn


    def update(self, event, instance):
        """
        Handle incoming events.

        Parameters
        ----------
        event : str
            One of the values associated with `Events.OPTIMIZATION_START`,
            `Events.OPTIMIZATION_STEP` or `Events.OPTIMIZATION_END`.
            
        instance : bayesian_optimization.BayesianOptimization
            The instance associated with the step.

        """
        if event == Events.OPTIMIZATION_STEP:
            data = dict(instance.res[-1])

            now, time_elapsed, time_delta = self._time_metrics()
            data["datetime"] = {
                "datetime": now,
                "elapsed": time_elapsed,
                "delta": time_delta,
            }

            if "allowed" in data: # fix: github.com/fmfn/BayesianOptimization/issues/361
                data["allowed"] = bool(data["allowed"])
            
            if "constraint" in data and isinstance(data["constraint"], np.ndarray):
                data["constraint"] = data["constraint"].tolist()

            if self.transform_fn:
                data = self.transform_fn(data)
            else:
                data = recurse_dict(data, unzip_all=True)

            df = pd.DataFrame(columns=data.keys(), data=[data.values()])
            if self.df is not None:
                self.df = pd.concat([self.df, df])
            else:
                self.df = df
            
            success = False
            i = 0
            while not success and i < 100:
                try:
                    self.df.to_csv(self._path, sep=self.sep, decimal=self.decimal)
                    success = True
                except Exception as e:
                    self.df.to_csv(self._path + f"_bckp{i}", sep=self.sep, decimal=self.decimal)
                i += 1


        self._update_tracker(event, instance)


class TBLogger(_Tracker):
    """
    Logger that outputs steps to CSV.

    Parameters
    ----------
    path : str or bytes or os.PathLike
        Path to the file to write to.

    reset : bool
        Whether to overwrite the file if it already exists.

    """

    def __init__(self, writer):
        super().__init__()

        self._writer = writer
        self._step = 1


    def update(self, event, instance):
        """
        Handle incoming events.

        Parameters
        ----------
        event : str
            One of the values associated with `Events.OPTIMIZATION_START`,
            `Events.OPTIMIZATION_STEP` or `Events.OPTIMIZATION_END`.
            
        instance : bayesian_optimization.BayesianOptimization
            The instance associated with the step.

        """
        if event == Events.OPTIMIZATION_STEP:
            data = dict(instance.res[-1])

            now, time_elapsed, time_delta = self._time_metrics()
            data["datetime"] = {
                "datetime": now,
                "elapsed": time_elapsed,
                "delta": time_delta,
            }

            if "allowed" in data: # fix: github.com/fmfn/BayesianOptimization/issues/361
                data["allowed"] = bool(data["allowed"])
            
            if "constraint" in data and isinstance(data["constraint"], np.ndarray):
                data["constraint"] = data["constraint"].tolist()

            # self._writer.add_hparams(data["params"], {"target": float(data["target"])})
            self._writer.add_scalar("loss", data["target"], self._step)

            self._step += 1

        self._update_tracker(event, instance)


def load_logs(optimizer, logs, threshold):
    """Load previous ...

    Parameters
    ----------
    optimizer : BayesianOptimizer
        Optimizer the register the previous observations with.

    logs : str or bytes or os.PathLike
        File to load the logs from.

    Returns
    -------
    The optimizer with the state loaded.
    
    """
    if isinstance(logs, str):
        logs = [logs]

    for log in logs:
        if isinstance(log, str):
            with open(log, "r", encoding='utf-8') as j:
                iterations = [json.loads(iteration) for iteration in j.read().splitlines()]
        else:
            iterations = log
        
        iterations_sorted = sorted(iterations, key=lambda iteration: iteration["target"], reverse=True)
        if threshold < 1:
            threshold = len(iterations_sorted) * threshold
        iterations_sorted = iter(iterations_sorted)

        i = 0
        while True:
            try:
                iteration = next(iterations_sorted)
            except StopIteration:
                break

            try:
                optimizer.register(
                    params=iteration["params"],
                    target=iteration["target"],
                    constraint_value=(
                        iteration["constraint"]
                        if optimizer.is_constrained else None
                    )
                )
                i += 1
                if i > threshold:
                    break
            except NotUniqueError:
                continue

    return optimizer


class BayesOptAdapter:
    """
    Emulates bayesian_optimization.BayesianOptimization
    just enough for existing loggers.
    """

    def __init__(self):
        self.res = []
        self._start_time = time.time()
        self.max = None

class BayesOptEventBridge:
    def __init__(self, trackers):
        self.instance = BayesOptAdapter()
        self.trackers = trackers

        # fire OPTIMIZATION_START once
        for t in self.trackers:
            t.update(Events.OPTIMIZATION_START, self.instance)

    def __call__(self, study, trial):
        # convert Optuna trial → BayesOpt-style result
        entry = {
            "target": trial.value,
            "params": dict(trial.params),
        }

        self.instance.res.append(entry)
        
        # maintain optimizer.max
        if (
            self.instance.max is None
            or entry["target"] > self.instance.max["target"]
        ):
            self.instance.max = entry

        for t in self.trackers:
            t.update(Events.OPTIMIZATION_STEP, self.instance)

    def close(self):
        for t in self.trackers:
            t.update(Events.OPTIMIZATION_END, self.instance)
