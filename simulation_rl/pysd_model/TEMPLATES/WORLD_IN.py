# ONLY FOR SYNTAX CHECKING, IS DELETED WHEN INSTANTIATED --> Template starting at PARAMETERS
from pysd.py_backend.statefuls import Integ
from pysd import Component
import numpy as np

component = Component()

#######################################################################
#                       WORLD IN For _PLACEHOLDER_IN                   #
#######################################################################

# Marktnachfrage is the input to the model and should be set as parameter in the .run function call
@component.add(name="Marktnachfrage_WORLD_PLACEHOLDER_IN",
                comp_type="Constant",
                comp_subtype="Normal")
def Marktnachfrage_WORLD_PLACEHOLDER_IN():
    return 0

@component.add(name="FreierLagerplatz_WORLD_PLACEHOLDER_IN", 
                comp_type="Constant",
                comp_subtype="Normal")
def FreierLagerplatz_WORLD_PLACEHOLDER_IN():
    return 1e6


####################
# dynamic variables
####################

@component.add(name="Bestellung_WORLD_PLACEHOLDER_IN", 
               comp_type="Auxiliary", 
               depends_on={"Marktnachfrage_WORLD_PLACEHOLDER_IN": 1, "Lieferungsbeschränkung_PLACEHOLDER_IN": 1})
def Bestellung_WORLD_PLACEHOLDER_IN():
    return min(Marktnachfrage_WORLD_PLACEHOLDER_IN(), Lieferungsbeschränkung_PLACEHOLDER_IN())


@component.add(name="Lieferungsrate_WORLD_PLACEHOLDER_IN", 
               comp_type="Auxiliary", 
               depends_on={"Lieferung_PLACEHOLDER_IN": 1})
def Lieferungsrate_WORLD_PLACEHOLDER_IN():
    return Lieferung_PLACEHOLDER_IN()


###########
# stocks for evaluation
###########

_stock_TotalLieferung_WORLD_PLACEHOLDER_IN = Integ(lambda: Lieferungsrate_WORLD_PLACEHOLDER_IN(), 
                                 lambda: 0, 
                                 "_stock_TotalLieferung_WORLD_PLACEHOLDER_IN")
@component.add(
    name="TotalLieferung_WORLD_PLACEHOLDER_IN",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_TotalLieferung_WORLD_PLACEHOLDER_IN": 1},
    other_deps={
        "_stock_TotalLieferung_WORLD_PLACEHOLDER_IN": {"initial": {}, 
                                                       "step": {"Lieferungsrate_WORLD_PLACEHOLDER_IN": 1}}
    },
)
def TotalLieferung_WORLD_PLACEHOLDER_IN(): return _stock_TotalLieferung_WORLD_PLACEHOLDER_IN()


_stock_TotalNachfrage_WORLD_PLACEHOLDER_IN = Integ(lambda: Marktnachfrage_WORLD_PLACEHOLDER_IN(), 
                                 lambda: 0, 
                                 "_stock_TotalNachfrage_WORLD_PLACEHOLDER_IN")
@component.add(
    name="TotalNachfrage_WORLD_PLACEHOLDER_IN",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_TotalNachfrage_WORLD_PLACEHOLDER_IN": 1},
    other_deps={
        "_stock_TotalNachfrage_WORLD_PLACEHOLDER_IN": {"initial": {}, 
                                                       "step": {"Marktnachfrage_WORLD_PLACEHOLDER_IN": 1}}
    },
)
def TotalNachfrage_WORLD_PLACEHOLDER_IN(): return _stock_TotalNachfrage_WORLD_PLACEHOLDER_IN()