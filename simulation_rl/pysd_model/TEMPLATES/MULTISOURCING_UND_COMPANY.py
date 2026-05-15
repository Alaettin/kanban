# ONLY FOR SYNTAX CHECKING, IS DELETED WHEN INSTANTIATED --> Template starting at PARAMETERS
from pysd.py_backend.statefuls import Integ
from pysd import Component
import numpy as np

component = Component()

#######################################################################
#          MULTISOURCING_UND For _PLACEHOLDER_WARENPLACEHOLDER           #
#######################################################################

@component.add(name="Multiplikator_PLACEHOLDER_WARENPLACEHOLDER",
                comp_type="Constant",
                comp_subtype="Normal")
def Multiplikator_PLACEHOLDER_WARENPLACEHOLDER():
    return 1


#####################################################################
#                         STOCKS & FLOWS                            #
#####################################################################

##########
# Stocks
##########
_stock_Lieferbestand_PLACEHOLDER_WARENPLACEHOLDER = Integ(lambda: Eingang_PLACEHOLDER_WARENPLACEHOLDER() - (Eingang_PLACEHOLDER() * Multiplikator_PLACEHOLDER_WARENPLACEHOLDER()), 
                                 lambda: 0,
                                 "_stock_Lieferbestand_PLACEHOLDER_WARENPLACEHOLDER")
@component.add(
    name="Lieferbestand_PLACEHOLDER_WARENPLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_Lieferbestand_PLACEHOLDER_WARENPLACEHOLDER": 1},
    other_deps={
        "_stock_Lieferbestand_PLACEHOLDER_WARENPLACEHOLDER": {"initial": {}, 
                                     "step": {"Eingang_PLACEHOLDER_WARENPLACEHOLDER": 1,
                                              "Eingang_PLACEHOLDER": 1,
                                              "Multiplikator_PLACEHOLDER_WARENPLACEHOLDER": 1}}
    },
)
def Lieferbestand_PLACEHOLDER_WARENPLACEHOLDER(): return _stock_Lieferbestand_PLACEHOLDER_WARENPLACEHOLDER()



####################
# dynamic variables
####################

# Interfaces

# inputs - supplier
@component.add(name="Eingang_PLACEHOLDER_WARENPLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on=DEPEND_Eingang_PLACEHOLDER_WARENPLACEHOLDER)
def Eingang_PLACEHOLDER_WARENPLACEHOLDER():
    return TODO_Eingang_PLACEHOLDER_WARENPLACEHOLDER

# outputs - supplier
@component.add(name="Bestellung_PLACEHOLDER_WARENPLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"Bestellung_PLACEHOLDER": 1, 
                           "Multiplikator_PLACEHOLDER_WARENPLACEHOLDER": 1, 
                           "MöglicheAufträge_PLACEHOLDER_WARENPLACEHOLDER": 1})
def Bestellung_PLACEHOLDER_WARENPLACEHOLDER():
    return min(Multiplikator_PLACEHOLDER_WARENPLACEHOLDER() * Bestellung_PLACEHOLDER(), MöglicheAufträge_PLACEHOLDER_WARENPLACEHOLDER())

# inputs - supplier
@component.add(name="MöglicheAufträge_PLACEHOLDER_WARENPLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on=DEPEND_MöglicheAufträge_PLACEHOLDER_WARENPLACEHOLDER)
def MöglicheAufträge_PLACEHOLDER_WARENPLACEHOLDER():
    return TODO_MöglicheAufträge_PLACEHOLDER_WARENPLACEHOLDER

# outputs - supplier
@component.add(name="FreierLagerplatz_PLACEHOLDER_WARENPLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"FreierLagerplatz_PLACEHOLDER": 1, 
                           "Multiplikator_PLACEHOLDER_WARENPLACEHOLDER": 1,
                           "Lieferbestand_PLACEHOLDER_WARENPLACEHOLDER": 1})
def FreierLagerplatz_PLACEHOLDER_WARENPLACEHOLDER():
    return FreierLagerplatz_PLACEHOLDER() * Multiplikator_PLACEHOLDER_WARENPLACEHOLDER() - Lieferbestand_PLACEHOLDER_WARENPLACEHOLDER()
