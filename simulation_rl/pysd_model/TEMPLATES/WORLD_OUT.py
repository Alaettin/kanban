# ONLY FOR SYNTAX CHECKING, IS DELETED WHEN INSTANTIATED --> Template starting at PARAMETERS
from pysd.py_backend.statefuls import Integ, Delay
from pysd import Component
import numpy as np

component = Component()

#######################################################################
#                       WORLD OUT For _PLACEHOLDER_OUT                 #
#######################################################################

@component.add(name="Auftragsbeschränkung_WORLD_PLACEHOLDER_OUT",
                comp_type="Constant",
                comp_subtype="Normal")
def Auftragsbeschränkung_WORLD_PLACEHOLDER_OUT():
    return 1e6


####################
# dynamic variables
####################

@component.add(name="Lieferung_WORLD_PLACEHOLDER_OUT", 
               comp_type="Auxiliary", 
               depends_on={"FreierLagerplatz_PLACEHOLDER_OUT": 1,
                           "Bestellung_PLACEHOLDER_OUT": 1})
def Lieferung_WORLD_PLACEHOLDER_OUT():
    return min(FreierLagerplatz_PLACEHOLDER_OUT(), Bestellung_PLACEHOLDER_OUT())
