# ONLY FOR SYNTAX CHECKING, IS DELETED WHEN INSTANTIATED --> Template starting at PARAMETERS
from pysd.py_backend.statefuls import Integ
from pysd import Component
import numpy as np

component = Component()

#######################################################################
#          MULTISOURCING_ODER For _PLACEHOLDER_PLACEHOLDER1_WARENPLACEHOLDER  #
#######################################################################

@component.add(name="Anteil_PLACEHOLDER_PLACEHOLDER1",
                comp_type="Constant",
                comp_subtype="Normal")
def Anteil_PLACEHOLDER_PLACEHOLDER1():
    return 0


#####################################################################
#                         STOCKS & FLOWS                            #
#####################################################################

##########
# Stocks
##########
_stock_fehlendeBestellungen_PLACEHOLDER_PLACEHOLDER1 = Integ(lambda: Bestellung_PLACEHOLDER_PLACEHOLDER1() - Eingang_PLACEHOLDER_PLACEHOLDER1(), 
                                 lambda: 0,
                                 "_stock_fehlendeBestellungen_PLACEHOLDER_PLACEHOLDER1")
@component.add(
    name="fehlendeBestellungen_PLACEHOLDER_PLACEHOLDER1",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_fehlendeBestellungen_PLACEHOLDER_PLACEHOLDER1": 1},
    other_deps={
        "_stock_fehlendeBestellungen_PLACEHOLDER_PLACEHOLDER1": {"initial": {}, 
                                     "step": {"Bestellung_PLACEHOLDER_PLACEHOLDER1": 1,
                                              "Eingang_PLACEHOLDER_PLACEHOLDER1": 1}}
    },
)
def fehlendeBestellungen_PLACEHOLDER_PLACEHOLDER1(): return _stock_fehlendeBestellungen_PLACEHOLDER_PLACEHOLDER1()



####################
# dynamic variables
####################

# Interfaces

# inputs - supplier
@component.add(name="Eingang_PLACEHOLDER_PLACEHOLDER1", 
               comp_type="Auxiliary", 
               depends_on=DEPEND_Eingang_PLACEHOLDER_PLACEHOLDER1)
def Eingang_PLACEHOLDER_PLACEHOLDER1():
    return TODO_Eingang_PLACEHOLDER_PLACEHOLDER1

# outputs - supplier
@component.add(name="Bestellung_PLACEHOLDER_PLACEHOLDER1", 
               comp_type="Auxiliary", 
               depends_on={"Bestellung_PLACEHOLDER_WARENPLACEHOLDER": 1, 
                           "offeneBestellung_PLACEHOLDER_WARENPLACEHOLDER": 1, 
                           "BestellungStep_PLACEHOLDER_PLACEHOLDER1": 1, 
                           "MöglicheAufträge_PLACEHOLDER_PLACEHOLDER1": 1})
def Bestellung_PLACEHOLDER_PLACEHOLDER1():
    return min(min(Bestellung_PLACEHOLDER_WARENPLACEHOLDER(), offeneBestellung_PLACEHOLDER_WARENPLACEHOLDER() + BestellungStep_PLACEHOLDER_PLACEHOLDER1()), MöglicheAufträge_PLACEHOLDER_PLACEHOLDER1())

# inputs - supplier
@component.add(name="MöglicheAufträge_PLACEHOLDER_PLACEHOLDER1", 
               comp_type="Auxiliary", 
               depends_on=DEPEND_MöglicheAufträge_PLACEHOLDER_PLACEHOLDER1)
def MöglicheAufträge_PLACEHOLDER_PLACEHOLDER1():
    return TODO_MöglicheAufträge_PLACEHOLDER_PLACEHOLDER1

# outputs - supplier
@component.add(name="FreierLagerplatz_PLACEHOLDER_PLACEHOLDER1", 
               comp_type="Auxiliary", 
               depends_on={"FreierLagerplatz_PLACEHOLDER_WARENPLACEHOLDER": 1, 
                           "Anteil_PLACEHOLDER_PLACEHOLDER1": 1})
def FreierLagerplatz_PLACEHOLDER_PLACEHOLDER1():
    return FreierLagerplatz_PLACEHOLDER_WARENPLACEHOLDER() * Anteil_PLACEHOLDER_PLACEHOLDER1()

# intermediate
@component.add(name="BestellungStep_PLACEHOLDER_PLACEHOLDER1", 
               comp_type="Auxiliary", 
               depends_on={"MöglicheAufträge_PLACEHOLDER_PLACEHOLDER1": 1, 
                           "Anteil_PLACEHOLDER_PLACEHOLDER1": 1, 
                           "VirtuelleBestellung_PLACEHOLDER_WARENPLACEHOLDER": 1, 
                           "fehlendeBestellungen_PLACEHOLDER_PLACEHOLDER1": 1})
def BestellungStep_PLACEHOLDER_PLACEHOLDER1():
    return max(0, min(MöglicheAufträge_PLACEHOLDER_PLACEHOLDER1(), Anteil_PLACEHOLDER_PLACEHOLDER1() * VirtuelleBestellung_PLACEHOLDER_WARENPLACEHOLDER() - fehlendeBestellungen_PLACEHOLDER_PLACEHOLDER1()))