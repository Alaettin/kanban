try:
    import ray
    RAY_INSTALLED = True
except ImportError:
    print("Running without ray install, run 'pip install ray' if ray needs to be used")
    RAY_INSTALLED = False

try:
    from alpyne.sim import AnyLogicSim, logging
except ImportError:
    print("Running without alpyne install, follow https://github.com/the-anylogic-company/Alpyne if using an AnyLogic model")

import time

class SimInstance:
    def __init__(self, sim_path, loss_fn, nr):
        from cfg import JAVA_PATH
        self.loss_fn = loss_fn
        self.sim_path = sim_path
        self.java_path = JAVA_PATH
        
        self.sim = AnyLogicSim(self.sim_path,
            auto_finish=True,  # sets engine to FINISHED if stop condition is met
        #   engine_overrides=dict(stop_time=1000, seed=next_num),
        #   config_defaults=dict(rate_per_sec=1.5, machine_types=["A", "A", "A"])
            java_exe=self.java_path,
            # max_server_await_time=20
            java_log_level=logging.ERROR,
            py_log_level=logging.ERROR,
            max_server_await_time=60
        )

    def run(self, params: dict):
        # start a new episode and continue running it until hitting the end
        _ = self.sim.reset(**params)  # omitted values use the defaults above

        # specifying the output name(s) returns an iterable of values
        return self.loss_fn(self.sim)
    
    def refresh(self):
        self.sim._quit_app()
        self.sim = AnyLogicSim(self.sim_path,
            auto_finish=True,  # sets engine to FINISHED if stop condition is met
        #   engine_overrides=dict(stop_time=1000, seed=next_num),
        #   config_defaults=dict(rate_per_sec=1.5, machine_types=["A", "A", "A"])
            java_exe=self.java_path,
            # max_server_await_time=20
            java_log_level=logging.ERROR,
            py_log_level=logging.ERROR,
            max_server_await_time=60
        )


class SimInstanceThreaded(SimInstance):
    def __init__(self, sim_path, loss_fn, nr):
        time.sleep(nr / 10)
        super().__init__(sim_path, loss_fn, nr)


if RAY_INSTALLED:
    @ray.remote
    class SimInstanceRay(SimInstance):
        def __init__(self, sim_path, loss_fn, nr):
            super().__init__(sim_path, loss_fn, nr)
else:
    class SimInstanceRay(SimInstance):
        pass