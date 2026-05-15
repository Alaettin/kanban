"""
Python model 'supply_chain.py'
Native PySD-style implementation for company
"""

from pathlib import Path
import numpy as np

from pysd.py_backend.statefuls import Integ
from pysd import Component

__pysd_version__ = "3.14.3"

__data = {"scope": None, "time": lambda: 0}

_root = Path(__file__).parent


component = Component()

#######################################################################
#                          CONTROL VARIABLES                          #
#######################################################################

_control_vars = {
    "initial_time": lambda: 0,
    "final_time": lambda: 50,
    "time_step": lambda: 0.0625,
    "saveper": lambda: time_step(),
}


def _init_outer_references(data):
    for key in data:
        __data[key] = data[key]


@component.add(name="Time")
def time():
    """
    Current time of the model.
    """
    return __data["time"]()


@component.add(
    name="FINAL TIME", units="Day", comp_type="Constant", comp_subtype="Normal"
)
def final_time():
    """
    The final time for the simulation.
    """
    return __data["time"].final_time()


@component.add(
    name="INITIAL TIME", units="Day", comp_type="Constant", comp_subtype="Normal"
)
def initial_time():
    """
    The initial time for the simulation.
    """
    return __data["time"].initial_time()


@component.add(
    name="SAVEPER",
    units="Day",
    limits=(0.0, np.nan),
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time_step": 1},
)
def saveper():
    """
    The frequency with which output is stored.
    """
    return __data["time"].saveper()

 
@component.add(
    name="TIME STEP",
    units="Day",
    limits=(0.0, np.nan),
    comp_type="Constant",
    comp_subtype="Normal",
)
def time_step():
    """
    The time step for the simulation.
    """
    return __data["time"].time_step()

############
# AUXILIARY
############

def f_osci(p_amp, p_freq, p_shift, p_offset, min_, max_):
    return max(min(p_amp * np.sin(p_freq * time() - p_shift) + p_offset, max_), min_)


class DelayedValueQueue:
    def __init__(self, day_factor: float):
        """
        day_factor: minimal amount of delay used
        """
        self.day_factor = day_factor

        self.max_l = int(day_factor * 1000.0)
        self.val_arr = [0.0] * self.max_l

        self.last_val = 0.0
        self.last_sched = 0.0
        self.last_time = 0.0

    def update(self, val: float, schedtime: float) -> float:
        schedtime = max(schedtime, 1.0 / self.day_factor)

        current_time = time()
        time_diff = current_time - self.last_time

        if time_diff > 0:
            idx = int((self.last_time + self.last_sched) * self.day_factor) % self.max_l
            self.val_arr[idx] += self.last_val * time_diff * self.day_factor

        self.last_val = val
        self.last_sched = schedtime
        self.last_time = current_time

        return self.val_arr[int(current_time * self.day_factor) % self.max_l]

    def initialize(self):
        self.val_arr = [0.0] * self.max_l