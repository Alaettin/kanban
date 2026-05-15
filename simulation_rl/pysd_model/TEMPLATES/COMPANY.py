# ONLY FOR SYNTAX CHECKING, IS DELETED WHEN INSTANTIATED --> Template starting at PARAMETERS
from pysd.py_backend.statefuls import Integ
from pysd import Component
import numpy as np

component = Component()
time_step = lambda: None
time = lambda: None
DelayedValueQueue = lambda: None
f_osci = lambda: None

#######################################################################
#                           COMPANY_PLACEHOLDER                       #
#######################################################################

#######################################################################
#                           PARAMETERS                                #
#######################################################################

@component.add(name="MaterialOrderDelay_PLACEHOLDER", comp_type="Constant")
def MaterialOrderDelay_PLACEHOLDER():
    return 0.9

@component.add(name="LagerLimit_PLACEHOLDER", comp_type="Constant")
def LagerLimit_PLACEHOLDER():
    return 10000

@component.add(name="ProductionDelay_PLACEHOLDER", comp_type="Constant")
def ProductionDelay_PLACEHOLDER():
    return 0.9


@component.add(name="CoverageLimit_PLACEHOLDER", comp_type="Constant")
def CoverageLimit_PLACEHOLDER():
    return 10000


@component.add(name="ProductionLimit_PLACEHOLDER", comp_type="Constant")
def ProductionLimit_PLACEHOLDER():
    return 10000


@component.add(name="readytoshipDelay_PLACEHOLDER", comp_type="Constant")
def readytoshipDelay_PLACEHOLDER():
    return 1

@component.add(name="LimitfinishedInventory_PLACEHOLDER", comp_type="Constant")
def LimitfinishedInventory_PLACEHOLDER():
    return 10000


@component.add(name="Sicherheitsbestand_PLACEHOLDER", comp_type="Constant")
def Sicherheitsbestand_PLACEHOLDER():
    return 5000


@component.add(name="Eingangslager_start_PLACEHOLDER", comp_type="Constant")
def Eingangslager_start_PLACEHOLDER():
    return 0


@component.add(name="TotalCustomerOrder_start_PLACEHOLDER", comp_type="Constant")
def TotalCustomerOrder_start_PLACEHOLDER():
    return 0


@component.add(name="delayTimeShipping_amp_PLACEHOLDER", comp_type="Constant")
def delayTimeShipping_amp_PLACEHOLDER():
    return 1.0


@component.add(name="MA_Flex_amp_PLACEHOLDER", comp_type="Constant")
def MA_Flex_amp_PLACEHOLDER():
    return 1.0


@component.add(name="delayTimeProduction_amp_PLACEHOLDER", comp_type="Constant")
def delayTimeProduction_amp_PLACEHOLDER():
    return 1.0


@component.add(name="MA_Flex_freq_PLACEHOLDER", comp_type="Constant")
def MA_Flex_freq_PLACEHOLDER():
    return 1


@component.add(name="MA_Flex_shift_PLACEHOLDER", comp_type="Constant")
def MA_Flex_shift_PLACEHOLDER():
    return 0.0


@component.add(name="MA_Flex_offset_PLACEHOLDER", comp_type="Constant")
def MA_Flex_offset_PLACEHOLDER():
    return 1.0


@component.add(name="delayTimeShipping_freq_PLACEHOLDER", comp_type="Constant")
def delayTimeShipping_freq_PLACEHOLDER():
    return 1.0


@component.add(name="delayTimeShipping_shift_PLACEHOLDER", comp_type="Constant")
def delayTimeShipping_shift_PLACEHOLDER():
    return 0.0


@component.add(name="delayTimeShipping_offset_PLACEHOLDER", comp_type="Constant")
def delayTimeShipping_offset_PLACEHOLDER():
    return 0.0


@component.add(name="delayTimeProduction_freq_PLACEHOLDER", comp_type="Constant")
def delayTimeProduction_freq_PLACEHOLDER():
    return 1.0


@component.add(name="delayTimeProduction_shift_PLACEHOLDER", comp_type="Constant")
def delayTimeProduction_shift_PLACEHOLDER():
    return 0.0


@component.add(name="delayTimeProduction_offset_PLACEHOLDER", comp_type="Constant")
def delayTimeProduction_offset_PLACEHOLDER():
    return 0.0

# EinrangReal can be fed as input to the model in the .run function call to simplify calculations
@component.add(name="EingangReal_PLACEHOLDER",
                comp_type="Constant",
                comp_subtype="Normal")
def EingangReal_PLACEHOLDER():
    return 0

# AusgangReal can be fed as input to the model in the .run function call to simplify calculations
@component.add(name="AusgangReal_PLACEHOLDER",
                comp_type="Constant",
                comp_subtype="Normal")
def AusgangReal_PLACEHOLDER():
    return 0

#####################################################################
#                        COMPANY STOCKS & FLOWS                     #
#####################################################################

##########
# Stocks
##########

_stock_TotalCustomerOrder_PLACEHOLDER = Integ(lambda: CustomerOrderRate_PLACEHOLDER(), 
                                 lambda: TotalCustomerOrder_start_PLACEHOLDER() + Eingangslager_start_PLACEHOLDER(), 
                                 "_stock_TotalCustomerOrder_PLACEHOLDER")
@component.add(
    name="TotalCustomerOrder_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_TotalCustomerOrder_PLACEHOLDER": 1},
    other_deps={
        "_stock_TotalCustomerOrder_PLACEHOLDER": {"initial": {"TotalCustomerOrder_start_PLACEHOLDER": 1, 
                                                  "Eingangslager_start_PLACEHOLDER": 1}, 
                                     "step": {"CustomerOrderRate_PLACEHOLDER": 1}}
    },
)
def TotalCustomerOrder_PLACEHOLDER(): return _stock_TotalCustomerOrder_PLACEHOLDER()


_stock_TotalMaterialOrder_PLACEHOLDER = Integ(lambda: MaterialOrderRate_PLACEHOLDER(), 
                                 lambda: Eingangslager_start_PLACEHOLDER(), 
                                 "_stock_TotalMaterialOrder_PLACEHOLDER")
@component.add(
    name="TotalMaterialOrder_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_TotalMaterialOrder_PLACEHOLDER": 1},
    other_deps={
        "_stock_TotalMaterialOrder_PLACEHOLDER": {"initial": {"Eingangslager_start_PLACEHOLDER": 1}, 
                                     "step": {"MaterialOrderRate_PLACEHOLDER": 1}}
    },
)
def TotalMaterialOrder_PLACEHOLDER(): return _stock_TotalMaterialOrder_PLACEHOLDER()


_stock_MaterialOrderChange_PLACEHOLDER = Integ(lambda: ((min(MaterialOrderTarget_PLACEHOLDER(), FreeSpace_PLACEHOLDER()) - MaterialOrderRate_PLACEHOLDER()) * MaterialOrderDelay_PLACEHOLDER() * MA_Flexibilität_PLACEHOLDER()) if ((MaterialOrderTarget_PLACEHOLDER() > 0) and (MaterialOrderChange_PLACEHOLDER() < FreeSpace_PLACEHOLDER())) else -MaterialOrderChange_PLACEHOLDER(), 
                                  lambda: 0, 
                                  "_stock_MaterialOrderChange_PLACEHOLDER")
@component.add(
    name="MaterialOrderChange_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_MaterialOrderChange_PLACEHOLDER": 1},
    other_deps={
        "_stock_MaterialOrderChange_PLACEHOLDER": {"initial": {}, 
                                      "step": {"MaterialOrderTarget_PLACEHOLDER": 1, 
                                               "FreeSpace_PLACEHOLDER": 1, 
                                               "MaterialOrderRate_PLACEHOLDER": 1, 
                                               "MaterialOrderDelay_PLACEHOLDER": 1, 
                                               "MA_Flexibilität_PLACEHOLDER": 1,
                                               "MaterialOrderChange_PLACEHOLDER": 1}}
    },
)
def MaterialOrderChange_PLACEHOLDER(): return _stock_MaterialOrderChange_PLACEHOLDER()


_stock_Eingangslager_PLACEHOLDER = Integ(lambda:  MaterialEntranceRate_PLACEHOLDER() - (productionRate_PLACEHOLDER() if (ProductionTarget_PLACEHOLDER() > 0) else Eingangslager_PLACEHOLDER()), 
                            lambda: Eingangslager_start_PLACEHOLDER(), 
                            "_stock_Eingangslager_PLACEHOLDER")
@component.add(
    name="Eingangslager_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_Eingangslager_PLACEHOLDER": 1},
    other_deps={
        "_stock_Eingangslager_PLACEHOLDER": {
            "initial": {"Eingangslager_start_PLACEHOLDER": 1}, 
            "step": {"MaterialEntranceRate_PLACEHOLDER": 1, 
                     "productionRate_PLACEHOLDER": 1, 
                     "ProductionTarget_PLACEHOLDER": 1,
                     "Eingangslager_PLACEHOLDER": 1}}
    },
)
def Eingangslager_PLACEHOLDER(): return _stock_Eingangslager_PLACEHOLDER()


_stock_EingangslagerAccum_PLACEHOLDER = Integ(lambda: MaterialEntranceRate_PLACEHOLDER(), 
                                 lambda: Eingangslager_start_PLACEHOLDER(),
                                 "_stock_EingangslagerAccum_PLACEHOLDER")
@component.add(
    name="EingangslagerAccum_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_EingangslagerAccum_PLACEHOLDER": 1},
    other_deps={
        "_stock_EingangslagerAccum_PLACEHOLDER": {"initial": {"Eingangslager_start_PLACEHOLDER": 1},
                                     "step": {"MaterialEntranceRate_PLACEHOLDER": 1}}
    },
)
def EingangslagerAccum_PLACEHOLDER(): return _stock_EingangslagerAccum_PLACEHOLDER()


_stock_in_production_PLACEHOLDER = Integ(lambda: productionRate_PLACEHOLDER() - productionRateDelay_PLACEHOLDER(), 
                            lambda: 0, 
                            "_stock_in_production_PLACEHOLDER")
@component.add(
    name="in_production_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_in_production_PLACEHOLDER": 1},
    other_deps={
        "_stock_in_production_PLACEHOLDER": {"initial": {}, 
                                "step": {"productionRate_PLACEHOLDER": 1,
                                         "productionRateDelay_PLACEHOLDER": 1}}
    },
)
def in_production_PLACEHOLDER(): return _stock_in_production_PLACEHOLDER()


_stock_Produktionsanpassungsverrechnung_PLACEHOLDER = Integ(lambda: ((min(ProductionTarget_PLACEHOLDER(), ProductionMax_PLACEHOLDER()) - productionRate_PLACEHOLDER()) * ProductionDelay_PLACEHOLDER() * MA_Flexibilität_PLACEHOLDER()) if ((ProductionTarget_PLACEHOLDER() > 0) and (Produktionsanpassungsverrechnung_PLACEHOLDER() < ProductionMax_PLACEHOLDER())) else -Produktionsanpassungsverrechnung_PLACEHOLDER(), 
                            lambda: 0, 
                            "_stock_Produktionsanpassungsverrechnung_PLACEHOLDER")
@component.add(
    name="Produktionsanpassungsverrechnung_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_Produktionsanpassungsverrechnung_PLACEHOLDER": 1},
    other_deps={
        "_stock_Produktionsanpassungsverrechnung_PLACEHOLDER": {"initial": {}, 
                                "step": {"ProductionTarget_PLACEHOLDER": 1,
                                         "ProductionMax_PLACEHOLDER": 1,
                                         "productionRate_PLACEHOLDER": 1,
                                         "ProductionDelay_PLACEHOLDER": 1,
                                         "MA_Flexibilität_PLACEHOLDER": 1,
                                         "Produktionsanpassungsverrechnung_PLACEHOLDER": 1}}
    },
)
def Produktionsanpassungsverrechnung_PLACEHOLDER(): return _stock_Produktionsanpassungsverrechnung_PLACEHOLDER()


_stock_inter_prod_PLACEHOLDER = Integ(lambda: productionRateDelay_PLACEHOLDER() - flow_inter_prod_PLACEHOLDER(), 
                            lambda: 0, 
                            "_stock_inter_prod_PLACEHOLDER")
@component.add(
    name="inter_prod_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_inter_prod_PLACEHOLDER": 1},
    other_deps={
        "_stock_inter_prod_PLACEHOLDER": {"initial": {}, 
                                "step": {"productionRateDelay_PLACEHOLDER": 1,
                                         "flow_inter_prod_PLACEHOLDER": 1}}
    },
)
def inter_prod_PLACEHOLDER(): return _stock_inter_prod_PLACEHOLDER()


_stock_CustomerOrderProduced_PLACEHOLDER = Integ(lambda: flow_inter_prod_PLACEHOLDER() - (ShippingRate_PLACEHOLDER() if (CustomerOrderProduced_PLACEHOLDER() > 0) else CustomerOrderProduced_PLACEHOLDER()), 
                            lambda: 0, 
                            "_stock_CustomerOrderProduced_PLACEHOLDER")
@component.add(
    name="CustomerOrderProduced_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_CustomerOrderProduced_PLACEHOLDER": 1},
    other_deps={
        "_stock_CustomerOrderProduced_PLACEHOLDER": {"initial": {}, 
                                "step": {"flow_inter_prod_PLACEHOLDER": 1,
                                         "ShippingRate_PLACEHOLDER": 1,
                                         "CustomerOrderProduced_PLACEHOLDER": 1}}
    },
)
def CustomerOrderProduced_PLACEHOLDER(): return _stock_CustomerOrderProduced_PLACEHOLDER()


_stock_CustomerOrderProducedAccum_PLACEHOLDER = Integ(lambda: productionRate_PLACEHOLDER(), 
                            lambda: 0, 
                            "_stock_CustomerOrderProducedAccum_PLACEHOLDER")
@component.add(
    name="CustomerOrderProducedAccum_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_CustomerOrderProducedAccum_PLACEHOLDER": 1},
    other_deps={
        "_stock_CustomerOrderProducedAccum_PLACEHOLDER": {"initial": {}, 
                                "step": {"productionRateDelay_PLACEHOLDER": 1}}
    },
)
def CustomerOrderProducedAccum_PLACEHOLDER(): return _stock_CustomerOrderProducedAccum_PLACEHOLDER()


_stock_in_shipping_PLACEHOLDER = Integ(lambda: ShippingRate_PLACEHOLDER() - ShippingRateDelay_PLACEHOLDER(), 
                            lambda: 0, 
                            "_stock_in_shipping_PLACEHOLDER")
@component.add(
    name="in_shipping_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_in_shipping_PLACEHOLDER": 1},
    other_deps={
        "_stock_in_shipping_PLACEHOLDER": {"initial": {}, 
                                "step": {"ShippingRate_PLACEHOLDER": 1,
                                         "ShippingRateDelay_PLACEHOLDER": 1}}
    },
)
def in_shipping_PLACEHOLDER(): return _stock_in_shipping_PLACEHOLDER()


_stock_ShippingChange_PLACEHOLDER = Integ(lambda: ((min(CustomerOrderProduced_PLACEHOLDER(), ShippingLimit_PLACEHOLDER()) - ShippingRate_PLACEHOLDER()) * readytoshipDelay_PLACEHOLDER() * MA_Flexibilität_PLACEHOLDER()) if ((CustomerOrderProduced_PLACEHOLDER() > 0) and (ShippingChange_PLACEHOLDER() < ShippingLimit_PLACEHOLDER())) else -ShippingChange_PLACEHOLDER(), 
                            lambda: 0, 
                            "_stock_ShippingChange_PLACEHOLDER")
@component.add(
    name="ShippingChange_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_ShippingChange_PLACEHOLDER": 1},
    other_deps={
        "_stock_ShippingChange_PLACEHOLDER": {"initial": {}, 
                                "step": {"CustomerOrderProduced_PLACEHOLDER": 1,
                                         "ShippingLimit_PLACEHOLDER": 1,
                                         "ShippingRate_PLACEHOLDER": 1,
                                         "readytoshipDelay_PLACEHOLDER": 1,
                                         "MA_Flexibilität_PLACEHOLDER": 1,
                                         "ShippingChange_PLACEHOLDER": 1}}
    },
)
def ShippingChange_PLACEHOLDER(): return _stock_ShippingChange_PLACEHOLDER()


_stock_inter_ship_PLACEHOLDER = Integ(lambda: ShippingRateDelay_PLACEHOLDER() - inter_ship_flow_PLACEHOLDER(), 
                            lambda: 0, 
                            "_stock_inter_ship_PLACEHOLDER")
@component.add(
    name="inter_ship_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_inter_ship_PLACEHOLDER": 1},
    other_deps={
        "_stock_inter_ship_PLACEHOLDER": {"initial": {}, 
                                "step": {"ShippingRateDelay_PLACEHOLDER": 1,
                                         "inter_ship_flow_PLACEHOLDER": 1}}
    },
)
def inter_ship_PLACEHOLDER(): return _stock_inter_ship_PLACEHOLDER()


_stock_TotalShipped_PLACEHOLDER = Integ(lambda: inter_ship_flow_PLACEHOLDER(), 
                            lambda: 0, 
                            "_stock_TotalShipped_PLACEHOLDER")
@component.add(
    name="TotalShipped_PLACEHOLDER",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_stock_TotalShipped_PLACEHOLDER": 1},
    other_deps={
        "_stock_TotalShipped_PLACEHOLDER": {"initial": {}, 
                                "step": {"inter_ship_flow_PLACEHOLDER": 1}}
    },
)
def TotalShipped_PLACEHOLDER(): return _stock_TotalShipped_PLACEHOLDER()


########
# Flows
########

@component.add(name="CustomerOrderRate_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"Kundenauftrag_PLACEHOLDER": 1})
def CustomerOrderRate_PLACEHOLDER():
    return Kundenauftrag_PLACEHOLDER()


@component.add(name="MaterialOrderRate_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"MaterialOrderChange_PLACEHOLDER": 1,
                           "MaterialOrderTarget_PLACEHOLDER": 1,
                           "FreeSpace_PLACEHOLDER": 1,
                           "MöglicheAufträge_PLACEHOLDER": 1})
def MaterialOrderRate_PLACEHOLDER():
    return max(min((MaterialOrderChange_PLACEHOLDER() if (MaterialOrderTarget_PLACEHOLDER() > 0) else 0), min(FreeSpace_PLACEHOLDER(), MöglicheAufträge_PLACEHOLDER())), 0)


@component.add(name="MaterialEntranceRate_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"Eingang_PLACEHOLDER": 1})
def MaterialEntranceRate_PLACEHOLDER():
    return Eingang_PLACEHOLDER()


@component.add(name="productionRate_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"Produktionsanpassungsverrechnung_PLACEHOLDER": 1,
                           "ProductionTarget_PLACEHOLDER": 1,
                           "ProductionMax_PLACEHOLDER": 1})
def productionRate_PLACEHOLDER():
    return max(min((Produktionsanpassungsverrechnung_PLACEHOLDER() if (ProductionTarget_PLACEHOLDER() > 0) else 0), ProductionMax_PLACEHOLDER()), 0)


@component.add(name="productionRateDelay_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"productionRate_PLACEHOLDER": 1,
                           "delayTimeProduction__PLACEHOLDER": 1,
                           "in_production_PLACEHOLDER": 1})
def productionRateDelay_PLACEHOLDER():
    return max(min(prod_delay_PLACEHOLDER.update(productionRate_PLACEHOLDER(), delayTimeProduction__PLACEHOLDER()), in_production_PLACEHOLDER() / time_step()), 0)


@component.add(name="flow_inter_prod_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"productionRateDelay_PLACEHOLDER": 1,
                           "inter_prod_PLACEHOLDER": 1,
                           "LimitfinishedInventory_PLACEHOLDER": 1,
                           "CustomerOrderProduced_PLACEHOLDER": 1})
def flow_inter_prod_PLACEHOLDER():
    return max(min(productionRateDelay_PLACEHOLDER() + inter_prod_PLACEHOLDER(), (LimitfinishedInventory_PLACEHOLDER() - CustomerOrderProduced_PLACEHOLDER()) / time_step()), 0)


@component.add(name="ShippingRate_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"ShippingChange_PLACEHOLDER": 1,
                           "CustomerOrderProduced_PLACEHOLDER": 1,
                           "ShippingLimit_PLACEHOLDER": 1})
def ShippingRate_PLACEHOLDER():
    return max(min((ShippingChange_PLACEHOLDER() if (CustomerOrderProduced_PLACEHOLDER() > 0) else 0), ShippingLimit_PLACEHOLDER() / time_step()), 0)


@component.add(name="ShippingRateDelay_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"ShippingRate_PLACEHOLDER": 1,
                           "delayTimeShipping__PLACEHOLDER": 1,
                           "in_shipping_PLACEHOLDER": 1})
def ShippingRateDelay_PLACEHOLDER():
    return max(min(ship_delay_PLACEHOLDER.update(ShippingRate_PLACEHOLDER(), delayTimeShipping__PLACEHOLDER()), in_shipping_PLACEHOLDER() / time_step()), 0)


@component.add(name="inter_ship_flow_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"ShippingRateDelay_PLACEHOLDER": 1,
                           "inter_ship_PLACEHOLDER": 1,
                           "Lieferungsbeschränkung_PLACEHOLDER": 1})
def inter_ship_flow_PLACEHOLDER():
    return max(min(ShippingRateDelay_PLACEHOLDER() + inter_ship_PLACEHOLDER(), Lieferungsbeschränkung_PLACEHOLDER()), 0)

####################
# dynamic variables
####################

# interfaces

# outputs - supplier
@component.add(name="Bestellung_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"MaterialOrderRate_PLACEHOLDER": 1})
def Bestellung_PLACEHOLDER():
    return MaterialOrderRate_PLACEHOLDER()

@component.add(name="FreierLagerplatz_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"FreeSpace_PLACEHOLDER": 1})
def FreierLagerplatz_PLACEHOLDER():
    return FreeSpace_PLACEHOLDER()

# outputs - customer
@component.add(name="Lieferung_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"inter_ship_flow_PLACEHOLDER": 1})
def Lieferung_PLACEHOLDER():
    return inter_ship_flow_PLACEHOLDER()

@component.add(name="Auftragsbeschränkung_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"AuftragsLimit_PLACEHOLDER": 1,
                           "TotalCustomerOrder_PLACEHOLDER": 1,
                           "TotalShipped_PLACEHOLDER": 1})
def Auftragsbeschränkung_PLACEHOLDER():
    return max(0, AuftragsLimit_PLACEHOLDER() - (TotalCustomerOrder_PLACEHOLDER() - TotalShipped_PLACEHOLDER()))

# inputs - supplier
@component.add(name="MöglicheAufträge_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on=DEPEND_MöglicheAufträge)
def MöglicheAufträge_PLACEHOLDER():
    return TODO_MöglicheAufträge

@component.add(name="Eingang_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on=DEPEND_Eingang)
def Eingang_PLACEHOLDER():
    return TODO_Eingang

# inputs - customer
@component.add(name="Lieferungsbeschränkung_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on=DEPEND_Lieferungsbeschränkung)
def Lieferungsbeschränkung_PLACEHOLDER():
    return TODO_Lieferungsbeschränkung


@component.add(name="Kundenauftrag_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on=DEPEND_Kundenauftrag)
def Kundenauftrag_PLACEHOLDER():
    return TODO_Kundenauftrag

# calcs
@component.add(name="MaterialOrderTarget_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"TotalCustomerOrder_PLACEHOLDER": 1,
                           "Sicherheitsbestand_PLACEHOLDER": 1,
                           "TotalMaterialOrder_PLACEHOLDER": 1})
def MaterialOrderTarget_PLACEHOLDER():
    return TotalCustomerOrder_PLACEHOLDER() + Sicherheitsbestand_PLACEHOLDER() - TotalMaterialOrder_PLACEHOLDER()


@component.add(name="AuftragsLimit_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"ProductionLimit_PLACEHOLDER": 1})
def AuftragsLimit_PLACEHOLDER():
    return 60 * ProductionLimit_PLACEHOLDER()


@component.add(name="FreeSpace_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"LagerLimit_PLACEHOLDER": 1,
                           "Eingangslager_PLACEHOLDER": 1})
def FreeSpace_PLACEHOLDER():
    return max(0, LagerLimit_PLACEHOLDER() - Eingangslager_PLACEHOLDER())


@component.add(name="ProductionTarget_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"Eingangslager_PLACEHOLDER": 1,
                           "TotalCustomerOrder_PLACEHOLDER": 1,
                           "CustomerOrderProducedAccum_PLACEHOLDER": 1})
def ProductionTarget_PLACEHOLDER():
    return min(Eingangslager_PLACEHOLDER(), TotalCustomerOrder_PLACEHOLDER() - CustomerOrderProducedAccum_PLACEHOLDER())


@component.add(name="ProductionMax_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"ProductionLimit_PLACEHOLDER": 1,
                           "in_production_PLACEHOLDER": 1,
                           "LimitfinishedInventory_PLACEHOLDER": 1,
                           "CustomerOrderProduced_PLACEHOLDER": 1,
                           "inter_prod_PLACEHOLDER": 1})
def ProductionMax_PLACEHOLDER():
    return min(ProductionLimit_PLACEHOLDER() - in_production_PLACEHOLDER(), LimitfinishedInventory_PLACEHOLDER() - CustomerOrderProduced_PLACEHOLDER() - inter_prod_PLACEHOLDER())


@component.add(name="MA_Flex__PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"MA_Flex_amp_PLACEHOLDER": 1,
                           "MA_Flex_freq_PLACEHOLDER": 1,
                           "MA_Flex_shift_PLACEHOLDER": 1,
                           "MA_Flex_offset_PLACEHOLDER": 1,
                           "time": 1})
def MA_Flex__PLACEHOLDER():
    return f_osci(MA_Flex_amp_PLACEHOLDER(), MA_Flex_freq_PLACEHOLDER(), MA_Flex_shift_PLACEHOLDER(), MA_Flex_offset_PLACEHOLDER(), 0.1, 0.9)


@component.add(name="MA_Flexibilität_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"MA_Flex__PLACEHOLDER": 1})
def MA_Flexibilität_PLACEHOLDER():
    return MA_Flex__PLACEHOLDER() if MA_Flex__PLACEHOLDER() > 0 else 1


@component.add(name="delayTimeProduction__PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"delayTimeProduction_amp_PLACEHOLDER": 1,
                           "delayTimeProduction_freq_PLACEHOLDER": 1,
                           "delayTimeProduction_shift_PLACEHOLDER": 1,
                           "delayTimeProduction_offset_PLACEHOLDER": 1,
                           "time": 1})
def delayTimeProduction__PLACEHOLDER():
    return f_osci(delayTimeProduction_amp_PLACEHOLDER(), delayTimeProduction_freq_PLACEHOLDER(), delayTimeProduction_shift_PLACEHOLDER(), delayTimeProduction_offset_PLACEHOLDER(), 1, 365)


@component.add(name="ShippingLimit_PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"CoverageLimit_PLACEHOLDER": 1,
                           "in_shipping_PLACEHOLDER": 1,
                           "Lieferungsbeschränkung_PLACEHOLDER": 1})
def ShippingLimit_PLACEHOLDER():
    return min(CoverageLimit_PLACEHOLDER() - in_shipping_PLACEHOLDER(), Lieferungsbeschränkung_PLACEHOLDER())


@component.add(name="delayTimeShipping__PLACEHOLDER", 
               comp_type="Auxiliary", 
               depends_on={"delayTimeShipping_amp_PLACEHOLDER": 1,
                           "delayTimeShipping_freq_PLACEHOLDER": 1,
                           "delayTimeShipping_shift_PLACEHOLDER": 1,
                           "delayTimeShipping_offset_PLACEHOLDER": 1,
                           "time": 1})
def delayTimeShipping__PLACEHOLDER():
    return f_osci(delayTimeShipping_amp_PLACEHOLDER(), delayTimeShipping_freq_PLACEHOLDER(), delayTimeShipping_shift_PLACEHOLDER(), delayTimeShipping_offset_PLACEHOLDER(), 1, 365)


prod_delay_PLACEHOLDER = DelayedValueQueue(1)
ship_delay_PLACEHOLDER = DelayedValueQueue(1)