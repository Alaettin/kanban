# ONLY FOR SYNTAX CHECKING, IS DELETED WHEN INSTANTIATED --> Template starting at PARAMETERS
from pysd.py_backend.statefuls import Integ
from pysd import Component
import numpy as np

component = Component()

#######################################################################
#          MULTISOURCING_ODER COMMON For _PLACEHOLDER                 #
#######################################################################

# Common
@component.add(name="LieferungTotal_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on=DEPEND_LieferungTotal)
def LieferungTotal_PLACEHOLDER():
    return TODO_LieferungTotal