# ONLY FOR SYNTAX CHECKING, IS DELETED WHEN INSTANTIATED --> Template starting at PARAMETERS
from pysd.py_backend.statefuls import Integ
from pysd import Component
import numpy as np

component = Component()

#######################################################################
#     MULTISOURCING_ODER COMMON For _PLACEHOLDER_WARENPLACEHOLDER                 #
#######################################################################

# Common
@component.add(name="offeneBestellung_PLACEHOLDER_WARENPLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on=DEPEND_offeneBestellung)
def offeneBestellung_PLACEHOLDER_WARENPLACEHOLDER():
    return TODO_offeneBestellung

@component.add(name="VirtuelleBestellung_PLACEHOLDER_WARENPLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on=DEPEND_VirtuelleBestellung)
def VirtuelleBestellung_PLACEHOLDER_WARENPLACEHOLDER():
    return TODO_VirtuelleBestellung