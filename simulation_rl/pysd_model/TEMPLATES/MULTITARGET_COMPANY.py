# ONLY FOR SYNTAX CHECKING, IS DELETED WHEN INSTANTIATED --> Template starting at PARAMETERS
from pysd.py_backend.statefuls import Integ
from pysd import Component
import numpy as np

component = Component()

#######################################################################
#          MULTITARGET For _PLACEHOLDER_PLACEHOLDER1           #
#######################################################################


#####################################################################
#                         STOCKS & FLOWS                            #
#####################################################################

##########
# Stocks
##########
_stock_offeneAufträge_Tracking_PLACEHOLDER_PLACEHOLDER1 = Integ(lambda: Kundenauftrag_PLACEHOLDER_PLACEHOLDER1() - Lieferung_PLACEHOLDER_PLACEHOLDER1(), 
                                 lambda: 0,
                                 "_stock_offeneAufträge_Tracking_PLACEHOLDER_PLACEHOLDER1")
@component.add(
    name="offeneAufträge_Tracking_PLACEHOLDER_PLACEHOLDER1",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_offeneAufträge_Tracking_PLACEHOLDER_PLACEHOLDER1": 1},
    other_deps={
        "_stock_offeneAufträge_Tracking_PLACEHOLDER_PLACEHOLDER1": {"initial": {}, 
                                     "step": {"Kundenauftrag_PLACEHOLDER_PLACEHOLDER1": 1,
                                              "Lieferung_PLACEHOLDER_PLACEHOLDER1": 1}}
    },
)
def offeneAufträge_Tracking_PLACEHOLDER_PLACEHOLDER1(): return _stock_offeneAufträge_Tracking_PLACEHOLDER_PLACEHOLDER1()

####################
# dynamic variables
####################

# Interfaces

# outputs - customer
@component.add(name="Lieferung_PLACEHOLDER_PLACEHOLDER1", 
               comp_type="Auxiliary", 
               depends_on={"Lieferung_PLACEHOLDER": 1, 
                           "LieferungTotal_PLACEHOLDER": 1, 
                           "LieferungStep_PLACEHOLDER_PLACEHOLDER1": 1})
def Lieferung_PLACEHOLDER_PLACEHOLDER1():
    return LieferungStep_PLACEHOLDER_PLACEHOLDER1() / max(LieferungTotal_PLACEHOLDER(), 1e-8) * Lieferung_PLACEHOLDER()

# inputs - customer
@component.add(name="Kundenauftrag_PLACEHOLDER_PLACEHOLDER1", 
               comp_type="Auxiliary", 
               depends_on=DEPEND_Kundenauftrag_PLACEHOLDER_PLACEHOLDER1)
def Kundenauftrag_PLACEHOLDER_PLACEHOLDER1():
    return TODO_Kundenauftrag_PLACEHOLDER_PLACEHOLDER1

# outputs - customer
@component.add(name="Auftragsbeschränkung_PLACEHOLDER_PLACEHOLDER1", 
               comp_type="Auxiliary", 
               depends_on={"Auftragsbeschränkung_PLACEHOLDER": 1})
def Auftragsbeschränkung_PLACEHOLDER_PLACEHOLDER1():
    return Auftragsbeschränkung_PLACEHOLDER()

# inputs - customer
@component.add(name="Lieferungsbeschränkung_PLACEHOLDER_PLACEHOLDER1", 
               comp_type="Auxiliary", 
               depends_on=DEPEND_Lieferungsbeschränkung_PLACEHOLDER_PLACEHOLDER1)
def Lieferungsbeschränkung_PLACEHOLDER_PLACEHOLDER1():
    return TODO_Lieferungsbeschränkung_PLACEHOLDER_PLACEHOLDER1


# intermediate
@component.add(name="LieferungStep_PLACEHOLDER_PLACEHOLDER1", 
               comp_type="Auxiliary", 
               depends_on={"Lieferungsbeschränkung_PLACEHOLDER_PLACEHOLDER1": 1, 
                           "offeneAufträge_Tracking_PLACEHOLDER_PLACEHOLDER1": 1})
def LieferungStep_PLACEHOLDER_PLACEHOLDER1():
    return min(Lieferungsbeschränkung_PLACEHOLDER_PLACEHOLDER1(), offeneAufträge_Tracking_PLACEHOLDER_PLACEHOLDER1())