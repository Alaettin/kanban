from bayes_opt import BayesianOptimization
from bayes_opt.logger import JSONLogger
from bayes_opt.event import Events
from bayes_opt.util import UtilityFunction

from utils.bayes_util import OptimizationWrapper, CSVLogger, TBLogger, log_transformed, BayesOptEventBridge, BayesOptAdapter, load_logs
import optuna
import logging
import pandas as pd

optuna.logging.disable_default_handler()
optuna.logging.set_verbosity(optuna.logging.CRITICAL)

logging.getLogger("optuna").setLevel(logging.CRITICAL)

import argparse, datetime, json, os, time
import numpy as np

from pysd_model.util.cfg_util import merge_config_with_args
from cfg import load_experiment_config 
from tensorboardX import SummaryWriter


######################
# main function
# ####################


def main(cfg_path, opt_args=None):

    t_start_fe = datetime.datetime.now()

    cfg_path = os.path.abspath(cfg_path)
    
    # Load configuration using the new loader
    experiment_config = load_experiment_config(cfg_path)
    
    with open(cfg_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    # merge with arguments (supports dot notation for nested keys, e.g. optimization.name)
    if opt_args: config = merge_config_with_args(config, opt_args)

    # Extract config groups
    opt = config.get("optimization", {})
    bayes_tpe = config.get("bayes_tpe_params", {})
    pygad_cfg = config.get("pygad_params", {})

    # retrieve params or set default
    out_path = os.path.abspath(opt.get("out_path", "out"))
    in_path = opt.get("in_path", "")
    name = opt.get("name", "opt")
    num_threads = opt.get("num_threads", 1)
    default_params_path = opt.get("default_params", "")
    optimizer_type = opt.get("optimizer", "tpe_bayes")

    # Bayes/TPE params
    num_iter_tpe_per_param = bayes_tpe.get("num_iter_tpe_per_param", 100)
    param_importance_threshold = bayes_tpe.get("param_importance_threshold", 1)
    num_iter_bayes = bayes_tpe.get("num_iter_bayes_per_param", 50)

    default_params = {}
    if default_params_path:
        with open(default_params_path, "r", encoding="utf-8") as f:
            default_params = json.load(f)

    
    # Create output folders
    ts = str(datetime.datetime.now().strftime('%Y%m%d_%H%M%S'))

    t_path = os.path.join(out_path, ts + ("_" if len(name) > 0 else "") + name)
    if 'SIM_PATH' in opt.keys() and opt['SIM_PATH'] != "":
        t_path = t_path + "--" + os.path.split(opt['SIM_PATH'])[-1]
    os.makedirs(t_path, exist_ok=False)

    # sleep so folders with timestamps will be generated in correct order
    time.sleep(2)

    # Dump parameters
    with open(os.path.join(t_path, "sim_settings.json"), "w", encoding='utf-8') as outfile:
        json.dump({"SIM_PATH": t_path, **config, "default_params": default_params}, outfile, indent=4)
    
    # copy cfg for reproducability
    with open(os.path.join(t_path, "cfg.py"), "w", encoding='utf-8') as outfile:
        with open("cfg.py", "r", encoding='utf-8') as infile:
            outfile.write(infile.read())

    writer = SummaryWriter(t_path)
    
    print("DEFAULT PARAMETERS: ")
    print(json.dumps(default_params, indent=4))

    # Retrieve complex objects from experiment_config
    # TUNE_PARAMS, LOSS_FN, MODEL_PATH_OR_SC, SIM_TYPE, DATA_PATH, DATA_MAP, TARGET_COMPANY, DISRUPTION
    
    wrapped_opt = OptimizationWrapper(
        experiment_config["MODEL_PATH_OR_SC"],
        experiment_config["SIM_TYPE"],
        default_params, 
        experiment_config["TUNE_PARAMS"], 
        experiment_config["LOSS_FN"], 
        experiment_config["DATA_PATH"], 
        experiment_config["DATA_MAP"], 
        experiment_config["TARGET_COMPANY"], 
        experiment_config["DISRUPTION"],
        num_threads
    )

    trackers = [
        JSONLogger(path=os.path.join(t_path, "al_opt.json")),
        CSVLogger(
            path=os.path.join(t_path, "al_opt_transformed.csv"),
            sep=";",
            decimal=",",
            transform_fn=lambda data: log_transformed(data, wrapped_opt),
        ),
        TBLogger(writer),
    ]

    # Build a flat parameters dict for the optimizer functions
    parameters = {
        "out_path": out_path,
        "in_path": in_path,
        "name": name,
        "num_threads": num_threads,
        "optimizer": optimizer_type,
        "num_iter_tpe_per_param": num_iter_tpe_per_param,
        "param_importance_threshold": param_importance_threshold,
        "num_iter_bayes": num_iter_bayes,
        **pygad_cfg,
    }

    # Dispatch to the selected optimizer
    if optimizer_type == "pygad":
        run_pygad(wrapped_opt, trackers, parameters, t_path)
    elif optimizer_type == "tpe_bayes":
        run_tpe_bayes(wrapped_opt, trackers, parameters, experiment_config, t_path)
    else:
        raise ValueError(f"Unknown optimizer type: {optimizer_type}. Choose 'tpe_bayes' or 'pygad'.")

    writer.close()

    # Save time
    t_end_fe = datetime.datetime.now()
    print(f"Optimization took: {t_end_fe - t_start_fe}.", flush=True)


######################
# TPE + Bayesian GP
# ####################

def run_tpe_bayes(wrapped_opt, trackers, parameters, experiment_config, t_path):

    tune_params_dict = experiment_config["TUNE_PARAMS"]

    sampler = optuna.samplers.TPESampler(
        n_startup_trials=len(tune_params_dict) * (parameters["num_iter_tpe_per_param"] // 10),
        multivariate=True,
        consider_prior=True,
    )

    study = optuna.create_study(
        sampler=sampler,
        direction="maximize",
    )
    bridge = BayesOptEventBridge(trackers)

    n_trials_done = 0
    if parameters["in_path"]:
        print("Loading logs")
        distributions = {k: (optuna.distributions.FloatDistribution(v[0], v[1]) if isinstance(v[0], float) or isinstance(v[1], float) else optuna.distributions.IntDistribution(v[0], v[1])) for k, v in wrapped_opt.get_tune_dict().items()}
        with open(parameters["in_path"], "r", encoding='utf-8') as f:
            data = [json.loads(line) for line in f.read().splitlines()]
            n_trials_done = len(data)
            for entry in data:
                trial = optuna.create_trial(
                    params=entry["params"],
                    value=entry["target"],
                    distributions=distributions
                )
                study.add_trial(trial)
                
    print("Starting TPE optimization")
    wrapped_opt.pbar.set_description("TPE optimization")
    wrapped_opt.pbar.total += max(len(tune_params_dict) * parameters["num_iter_tpe_per_param"], 0)
    wrapped_opt.step = n_trials_done
    
    study.optimize(
        wrapped_opt,
        n_trials=max(len(tune_params_dict) * parameters["num_iter_tpe_per_param"] - n_trials_done, 0),
        callbacks=[bridge],
    )

    bridge.close()

    trials = sorted(study.trials, key=lambda t: t.value, reverse=True)
    
    # parameter anova
    if parameters["param_importance_threshold"] < 1:
        print("Identifying most important parameters")
        importances = optuna.importance.get_param_importances(study)

        selected = []
        cum = 0.0

        for p, imp in importances.items():
            selected.append(p)
            cum += imp
            if cum >= parameters["param_importance_threshold"]:
                break
        print("Selected", selected, "\n\nusing median of best iterations for unimportant parameters")
        
        # set default params based on median of top 10 trials for not important params
        elite = trials[:10]
        
        unimportant_keys = [name for name in importances.keys() if name not in selected]
        unimportant_vals = np.median(np.array([[t.params[name] for t in elite] for name in unimportant_keys]), axis=1)
        new_defaults = {k: unimportant_vals[i] for i, k in enumerate(unimportant_keys)}

        # update the wrapped optimization and remove unimportant keys
        wrapped_opt.default_params.update(new_defaults)
        for k in unimportant_keys: wrapped_opt.tune_params.pop(k)
    else:
        if len(study.trials) > 0:
            selected = list(study.best_params.keys())
        else:
            selected = [None]
            print("\n\n***\nOnly bayesian optimization\n***\n")
        
    optimizer = BayesianOptimization(
        f=wrapped_opt,
        pbounds=wrapped_opt.get_tune_dict(),
    )

    log_for_bayes = [{"target": e.value, "params": {k: v for k, v in e.params.items() if k in selected}} for e in trials]

    # continue with best samples from TPE
    load_logs(optimizer, logs=[log_for_bayes], threshold=min(len(selected) * (parameters["num_iter_bayes"] // 5), 100))

    for tracker in trackers:
        optimizer.subscribe(Events.OPTIMIZATION_STEP, tracker)
        
    print("Starting bayesian optimization (gaussian process) to refine parameters")
    print(selected, parameters["num_iter_bayes"], len(selected) * parameters["num_iter_bayes"], wrapped_opt.pbar.total)
    wrapped_opt.pbar.set_description("Bayesian optimization")
    wrapped_opt.pbar.total += len(selected) * parameters["num_iter_bayes"] + (0 if len(selected) * parameters["num_iter_bayes"] == 1 else 5)

    optimizer.maximize(
        init_points=0 if len(selected) * parameters["num_iter_bayes"] == 1 else 5,
        n_iter=len(selected) * parameters["num_iter_bayes"]
    )

    print("Best Parameter Setting : {}".format(optimizer.max["params"]))
    print("Best Target Value      : {}".format(optimizer.max["target"]))

    with open(os.path.join(t_path, "final_params.json"), "w", encoding='utf-8') as f:
        json.dump(wrapped_opt.update_params(optimizer.max["params"]), f, indent=4, default=custom_json)


######################
# PyGAD Genetic Alg.
# ####################

def run_pygad(wrapped_opt, trackers, parameters, t_path):
    import pygad

    tune_dict = wrapped_opt.get_tune_dict()
    param_names = list(tune_dict.keys())
    num_params = len(param_names)

    # Build gene_space and gene_type from tune_params
    gene_space = []
    gene_type_list = []
    for name in param_names:
        lo, hi = tune_dict[name]
        gene_space.append({"low": lo, "high": hi})
        if isinstance(lo, int) and isinstance(hi, int):
            gene_type_list.append(int)
        else:
            gene_type_list.append(float)

    # Keep a separate immutable copy for type casting in the fitness function.
    # PyGAD internally mutates gene_type entries (e.g. int → [int, None]),
    # so gene_type_list becomes unusable as callables after GA.__init__.
    type_casters = tuple(gene_type_list)

    # PyGAD config with defaults
    num_generations = parameters.get("num_generations", 200)
    sol_per_pop = parameters.get("sol_per_pop", 50)
    num_parents_mating = min(parameters.get("num_parents_mating", max(sol_per_pop // 2, 2)), sol_per_pop)
    crossover_type = parameters.get("crossover_type", "single_point")
    mutation_type = parameters.get("mutation_type", "random")
    mutation_percent_genes = parameters.get("mutation_percent_genes", 10)
    parent_selection_type = parameters.get("parent_selection_type", "sss")
    keep_elitism = parameters.get("keep_elitism", 2)

    total_evals = num_generations * sol_per_pop
    wrapped_opt.pbar.set_description("PyGAD optimization")
    wrapped_opt.pbar.total += total_evals

    # Adapter for logging
    adapter = BayesOptAdapter()
    for t in trackers:
        t.update(Events.OPTIMIZATION_START, adapter)

    best_solution_params = None
    best_target = -np.inf

    def fitness_func(ga_instance, solution, solution_idx):
        nonlocal best_solution_params, best_target

        # Map array solution to named parameters
        named_params = {}
        for i, name in enumerate(param_names):
            val = type_casters[i](solution[i])
            named_params[name] = val

        # OptimizationWrapper returns negated loss (maximisation)
        target = wrapped_opt(**named_params)

        # Track best
        if target > best_target:
            best_target = target
            best_solution_params = named_params.copy()

        # Log via trackers
        entry = {"target": target, "params": named_params}
        adapter.res.append(entry)
        if adapter.max is None or target > adapter.max["target"]:
            adapter.max = entry
        for t in trackers:
            t.update(Events.OPTIMIZATION_STEP, adapter)

        return target

    def on_generation(ga_instance):
        gen = ga_instance.generations_completed
        best_fitness = ga_instance.best_solution(pop_fitness=ga_instance.last_generation_fitness)[1]
        print(f"Generation {gen}/{num_generations} | Best fitness: {best_fitness:.6f}")

    ga_instance = pygad.GA(
        num_generations=num_generations,
        num_parents_mating=num_parents_mating,
        fitness_func=fitness_func,
        sol_per_pop=sol_per_pop,
        num_genes=num_params,
        gene_space=gene_space,
        gene_type=gene_type_list,
        crossover_type=crossover_type,
        mutation_type=mutation_type,
        mutation_percent_genes=mutation_percent_genes,
        parent_selection_type=parent_selection_type,
        keep_elitism=keep_elitism,
        on_generation=on_generation,
        suppress_warnings=True,
    )

    print(f"Starting PyGAD optimization: {num_generations} generations, {sol_per_pop} solutions/pop, {num_params} genes")
    ga_instance.run()

    # Fire end event
    for t in trackers:
        t.update(Events.OPTIMIZATION_END, adapter)

    # Report best
    solution, solution_fitness, _ = ga_instance.best_solution()
    final_named = {}
    for i, name in enumerate(param_names):
        final_named[name] = type_casters[i](solution[i])

    print("Best Parameter Setting : {}".format(final_named))
    print("Best Target Value      : {}".format(solution_fitness))

    with open(os.path.join(t_path, "final_params.json"), "w", encoding='utf-8') as f:
        json.dump(wrapped_opt.update_params(final_named), f, indent=4, default=custom_json)


######################
# Helpers
# ####################

def custom_json(obj):
    if isinstance(obj, pd.Series):
        return obj.tolist()
    else:
        return obj


if __name__ == '__main__':
    import multiprocessing as mp
    mp.set_start_method("spawn")  # safer on some platforms (esp. Windows)

    ap = argparse.ArgumentParser(description="Training of Simulation script")
    ap.add_argument('-c', '--cfg_path', type=str, default="experiment_cfg.json", help="path to cfg")

    ap.add_argument(
        "opts",
        help="Modify config using the command-line",
        default=None,
        nargs=argparse.REMAINDER,
    )

    args = ap.parse_args()

    main(cfg_path=args.cfg_path, opt_args=args.opts)