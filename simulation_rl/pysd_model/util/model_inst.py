import pysd
from pysd.py_backend.model import Model

from collections import deque
import networkx as nx
import matplotlib.pyplot as plt
from collections import defaultdict
import os

import sys
sys.setrecursionlimit(10000)
import warnings


FACTOR_X = 1
FACTOR_Y = 1
FACTOR_X_INTER = 0.15
FACTOR_Y_INTER = 0.2


class Node:
    name = None
    children = None
    x = 0
    y = 0

    def __repr__(self):
        return f"{self.name} -> [{', '.join([c.name for c in self.children])}]"

    def pos(self):
        return f"{self.name}: [{self.x}, {self.y}]"


class SDModel(Model):
    def __init__(self, sc_name, model_dict, data_files=None, data_files_encoding=None, initialize=True, missing_values="warning"):

        py_model_file, self.model_dict = create_model(sc_name, model_dict)

        super().__init__(py_model_file, data_files, data_files_encoding, initialize, missing_values)

        self._params = get_model_params(self)

    def run(self, params=None, return_columns=None, return_timestamps=None, initial_condition='original', final_time=None, time_step=None, saveper=None, reload=False, progress=False, flatten_output=True, cache_output=True, output_file=None, print_params=True):
        
        used_params = {}
        for k, v in params.items():
            if k in self._params:
                used_params[k] = v
            else:
                if print_params: print(f"WARNING: parameter {k} not found in params of model!")

        if print_params: 
            print("*****\nSet Parameters:\n")
            for p, v in used_params.items():
                print(f"\t{p}={v}")
            print("\n\n*****\nUnset Parameters:\n")
            for p in list(set(self._params) - set(used_params)):
                print(f"\t{p}")
            print("******")
        
        with warnings.catch_warnings():
            warnings.filterwarnings(
                "ignore",
                message="Replacing a constant value with a time-dependent value.*",
                category=UserWarning,
            )
            return super().run(used_params, return_columns, return_timestamps, initial_condition, final_time, time_step, saveper, reload, progress, flatten_output, cache_output, output_file)

    def initialize(self):
        super().initialize()
        # reset/initialize delays
        # TODO: Delays should be reworked to stateful for auto reset
        for _, el in self.components.__dict__.items():
            if "DelayedValueQueue" in str(el.__class__):
                el.initialize()

    def draw(self):
        # Directed graph
        sc_graph = self.model_dict

        # Build directed graph
        G = nx.DiGraph()
        roots = []
        for node, data in sc_graph.items():
            for out_node in data.get('OUT', []):
                G.add_edge(node, out_node)
                if out_node not in sc_graph.keys():
                    roots.append(out_node)
        for node, data in sc_graph.items():
            in_dict = data.get('IN', {})
            for src_nodes in in_dict.values():
                for src_node in src_nodes:
                    if "WORLD" in src_node:
                        G.add_edge(src_node, node)

        # Step 1: Compute levels
        levels = {}
        def assign_level(node, current_level):
            if node in levels:
                levels[node] = max(levels[node], current_level)
            else:
                levels[node] = current_level
            for child in G.predecessors(node):
                assign_level(child, current_level + 1)

        for root in roots:
            assign_level(root, 0)

        max_level = max(levels.values())
        levels = {k: max_level - l for k, l in levels.items()}

        # Step 2: Group nodes by level
        level_nodes = defaultdict(list)
        for node, level in levels.items():
            level_nodes[level].append(node)

        # Step 3: Assign x/y coordinates
        pos = {}

        for level in sorted(level_nodes.keys()):
            node_pos = level_nodes[level]
            for i, node in enumerate(node_pos):
                # Default evenly spaced vertical position
                y = 1 - 2*i/(len(node_pos)-1) if len(node_pos)>1 else 0
                
                # # Shift vertically if this node shares a child with nodes on previous levels
                # for child in G.successors(node):
                #     for prev_level in range(level):
                #         for sibling in level_nodes[prev_level]:
                #             if child in G.successors(sibling):
                #                 # Avoid exact overlap by shifting y slightly
                #                 y -= 0.1
                pos[node] = (level, y)

        node_graph = {}

        def traverse_node(n, child=None, visited=[]):
            for k in ["Eingang", "Lieferung", "Kundenauftrag", "Bestellung"]:
                if n.startswith(f"{k}_"):
                    if n in node_graph.keys():
                        if child is not None and not child in node_graph[n]:
                            node_graph[n].append(child)
                    else:
                        node_graph[n] = [child] if child is not None else []
                    child = n
                    
            visited.append(n)

            for parent in (self.dependencies[n]['step'].keys() if 'step' in self.dependencies[n] else self.dependencies[n].keys()):
                if parent == "time" or parent == child or parent in visited:
                    continue
                traverse_node(parent, child, visited)


        for n in self.dependencies.keys():
            traverse_node(n, None, [n])

        print("\n".join(k + ": " + ", ".join(v) for k, v in node_graph.items()))

        # figure out companies
        pos.update({f"{k}_{c}": 
                    [
                        FACTOR_X * pos[c][0] + (FACTOR_X_INTER if k  in ["Kundenauftrag", "Lieferung"] else -FACTOR_X_INTER),
                        FACTOR_Y * pos[c][1] + (FACTOR_Y_INTER if k in ["Eingang", "Lieferung"] else -FACTOR_Y_INTER)
                    ] 
                    for c in levels.keys() 
                    for k in ["Eingang", "Lieferung", "Kundenauftrag", "Bestellung"]})
        
        for comp, inout_dict in sc_graph.items():
            
            accum_y = 0
            for ware, suppliers in inout_dict["IN"].items():
                for el, factor in [("Eingang", 1), ("Bestellung", -1)]:
                    x, y = pos[f"{el}_{comp}"]

                    pos[f"{el}_{comp}_{ware}"] = [x - 1 * FACTOR_X_INTER, y + factor * accum_y * FACTOR_Y_INTER]

                    for i, sup in enumerate(sorted(suppliers, key=lambda s: pos[s][1])):
                        pos[f"{el}_{comp}_{sup}"] = [x - 2 * FACTOR_X_INTER, 
                                                      y + factor * (accum_y + i) * FACTOR_Y_INTER]

                accum_y += len(suppliers)

            for i, customer in enumerate(sorted(inout_dict["OUT"], key=lambda s: pos[s][1])):
                for el, factor in [("Lieferung", 1), ("Kundenauftrag", -1)]:
                    x, y = pos[f"{el}_{comp}"]
                    pos[f"{el}_{comp}_{customer}"] = [x + 1 * FACTOR_X_INTER, 
                                                        y + factor * (accum_y + i) * FACTOR_Y_INTER]
        
        print("\n".join(k + ": " + ", ".join(map(str, v)) for k, v in pos.items()))

        for node in pos.keys():
            for parent in set([n for n in node_graph.keys() if node in node_graph[n]]):
                G.add_edge(parent.replace("_", "\n"), node.replace("_", "\n"))

        plt.figure()

        mapping = {n: str(n).replace("_", "\n") for n in G.nodes()}
        G = nx.relabel_nodes(G, mapping)
        total_pos = {k.replace("_", "\n"): v for k, v in pos.items()}

        special_edges = [(a.replace("_", "\n"), b.replace("_", "\n")) for a in levels.keys() for b in levels.keys() 
                         if (a.replace("_", "\n"), b.replace("_", "\n")) in G.edges()]
        normal_edges = [e for e in G.edges() if e not in special_edges]
        
        # dashed edges
        nx.draw_networkx_edges(
            G,
            pos=total_pos,
            edgelist=special_edges,
            style="solid",
            arrows=True,
            width=1,
            edge_color="red",
        )
        nx.draw_networkx_edges(
            G,
            pos=total_pos,
            edgelist=normal_edges,
            style="dashed",
            arrows=True,
            width=0.4
        )

        # nodes
        nx.draw_networkx_nodes(
            G,
            pos=total_pos,
            node_size=500
        )

        # smaller font
        nx.draw_networkx_labels(
            G,
            pos=total_pos,
            font_size=4
        )
        plt.show()
    

def get_model_params(model):
     return [k for k in model.dependencies.keys() 
             if hasattr(model.components, k) and hasattr(getattr(model.components, k), "type") and getattr(model.components, k).type == "Constant"]

def create_model(sc_name, model_dict):

    # load templates: model (settings), company (supply chain), world (for end nodes)
    TEMPLATE_DIR = os.path.dirname(__file__) + "/../TEMPLATES"
    with open(f"{TEMPLATE_DIR}/MODEL.py", "r", encoding="utf-8") as f:
        PREREQUISITES = f.read()

    with open(f"{TEMPLATE_DIR}/COMPANY.py", "r", encoding="utf-8") as f:
        COMPANY = "\n".join(f.read().splitlines()[11:])

    WORLD = {'IN': None, 'OUT': None}
    for inout in WORLD.keys():
        with open(f"{TEMPLATE_DIR}/WORLD_{inout}.py", "r", encoding="utf-8") as f:
            WORLD[inout] = "\n".join(f.read().splitlines()[7:])
    
    with open(f"{TEMPLATE_DIR}/MULTISOURCING_UND_COMPANY.py", "r", encoding="utf-8") as f:
        MULTISOURCING_UND_COMPANY = "\n".join(f.read().splitlines()[7:])

    with open(f"{TEMPLATE_DIR}/MULTISOURCING_ODER_COMPANY.py", "r", encoding="utf-8") as f:
        MULTISOURCING_ODER_COMPANY = "\n".join(f.read().splitlines()[7:])
    with open(f"{TEMPLATE_DIR}/MULTISOURCING_ODER_COMMON.py", "r", encoding="utf-8") as f:
        MULTISOURCING_ODER_COMMON = "\n".join(f.read().splitlines()[7:])
        
    with open(f"{TEMPLATE_DIR}/MULTITARGET_COMPANY.py", "r", encoding="utf-8") as f:
        MULTITARGET_COMPANY = "\n".join(f.read().splitlines()[7:])
    with open(f"{TEMPLATE_DIR}/MULTITARGET_COMMON.py", "r", encoding="utf-8") as f:
        MULTITARGET_COMMON = "\n".join(f.read().splitlines()[7:])

    # prepare supply chain
    SC = {}
    for comp, materials_dict in model_dict.items():

        if comp in SC.keys():
            SC[comp]["IN"] = materials_dict
        else:
            SC[comp] = {"IN": materials_dict, "OUT": []}

        for _, suppliers in materials_dict.items():
            for sup in suppliers:
                if sup == "WORLD":
                    continue

                if sup in SC.keys():
                    SC[sup]["OUT"].append(comp)
                else:
                    SC[sup] = {"IN": {}, "OUT": [comp]}

    # add WORLD as supplier/customer to end nodes
    for company_name, inout_dict in SC.items():
        if len(inout_dict["IN"]) < 1:
            inout_dict["IN"]["TEMP_WARE"] = [f"WORLD_{company_name}"]
        if len(inout_dict["OUT"]) < 1:
            inout_dict["OUT"] = [f"WORLD_{company_name}"]

    # write supply chain model to named file
    fname = os.path.dirname(__file__) + f"/../models/{sc_name}.py"
    with open(fname, "w", encoding="utf-8") as f:
        # first write settings
        f.write(PREREQUISITES)
        f.write("\n\n\n")

        # then write supply chain
        for company_name, inout_dict in SC.items():
            company_template = str(COMPANY)
            company_template = company_template.replace("_PLACEHOLDER", f"_{company_name}")

            def get_sup_name(supplier, company_name):
                if "WORLD" in supplier:
                    return supplier
                return f"{supplier}_{company_name}" if len(SC[supplier]["OUT"]) > 1 else supplier
            def get_cust_name(sup, comp):
                if "WORLD" in comp:
                    return comp
                for ware, suppliers in SC[comp]["IN"].items():
                    warenplaceholder = f"_{ware}" if len(SC[comp]["IN"]) > 1 else ""
                    if sup in suppliers:
                        if len(suppliers) > 1:
                            return f"{comp}_{sup}"
                        else:
                            return f"{comp}{warenplaceholder}"
            
            ##############
            # handling out
            ##############

            if len(inout_dict["OUT"]) > 1:
                customers = inout_dict["OUT"]
                for customer in customers:
                    t_mult = str(MULTITARGET_COMPANY)

                    # create company source for all customers --> handle multi-sourcing with get_cust_name(company_name, customer)
                    cust_placeholder = get_cust_name(company_name, customer)
                    for var_name, target_name in [("Lieferungsbeschränkung_PLACEHOLDER_PLACEHOLDER1", "FreierLagerplatz"), 
                                                    ("Kundenauftrag_PLACEHOLDER_PLACEHOLDER1", "Bestellung")]:
                        t_mult = t_mult.replace(f"TODO_{var_name}", f"{target_name}_{cust_placeholder}()")
                        t_mult = t_mult.replace(f"DEPEND_{var_name}", "{" + f'"{target_name}_{cust_placeholder}": 1' + "}")

                    t_mult = t_mult.replace("_PLACEHOLDER1", f"_{customer}")
                    t_mult = t_mult.replace("_PLACEHOLDER", f"_{company_name}")
                    f.write(t_mult)
                    f.write("\n\n")
                
                # create connection from customers to common
                t_mult = str(MULTITARGET_COMMON)
                
                TODO_LieferungTotal = " + ".join([f"LieferungStep_{company_name}_{customer}()" for customer in customers])
                DEPEND_LieferungTotal = '{' + ', '.join([f'"LieferungStep_{company_name}_{customer}": 1' for customer in customers]) + "}"
                
                t_mult = t_mult.replace("TODO_LieferungTotal", TODO_LieferungTotal)
                t_mult = t_mult.replace("DEPEND_LieferungTotal", DEPEND_LieferungTotal)

                t_mult = t_mult.replace("_PLACEHOLDER1", f"_{customer}")
                t_mult = t_mult.replace("_PLACEHOLDER", f"_{company_name}")
                f.write(t_mult)
                f.write("\n\n")
                
                # connect multitarget to source company
                var_name = "Kundenauftrag"
                company_template = company_template.replace(f"TODO_{var_name}", " + ".join([f'{var_name}_{get_sup_name(company_name, customer)}()' for customer in customers]))
                company_template = company_template.replace(f"DEPEND_{var_name}", "{" + ", ".join([f'"{var_name}_{get_sup_name(company_name, customer)}": 1' for customer in customers]) + "}")

                var_name = "Lieferungsbeschränkung"
                company_template = company_template.replace(f"TODO_{var_name}", " + ".join([f'min({var_name}_{get_sup_name(company_name, customer)}(), offeneAufträge_Tracking_{get_sup_name(company_name, customer)}())' for customer in customers]))
                company_template = company_template.replace(f"DEPEND_{var_name}", "{" + ", ".join([f'"{var_name}_{get_sup_name(company_name, customer)}": 1, "offeneAufträge_Tracking_{get_sup_name(company_name, customer)}": 1' for customer in customers]) + "}")

            else:
                # create company source for customer --> handle multi-sourcing with get_cust_name(company_name, inout_dict['OUT'][0])
                for var_name, target_name in [("Lieferungsbeschränkung", "FreierLagerplatz"), ("Kundenauftrag", "Bestellung")]:
                    out_ = 'OUT'
                    company_template = company_template.replace(f"TODO_{var_name}", f"{target_name}_{get_cust_name(company_name, inout_dict[out_][0])}()")
                    company_template = company_template.replace(f"DEPEND_{var_name}", "{" + f'"{target_name}_{get_cust_name(company_name, inout_dict[out_][0])}": 1' + "}")
            
            
            ##############
            # handling in
            ##############

            # handle multi-waren and multi-sourcing
            waren = inout_dict["IN"].keys()
            for ware in waren:
                
                ##############
                # multi waren:
                ##############

                # only append ware to nodes if there is need for multiple warenstränge, otherwise won't be created
                warenplaceholder = ""
                if len(waren) > 1:
                    # connect multi waren to target company
                    var_name = "Eingang"
                    TODO_EingangTotal = "min(" + ", ".join([f"Lieferbestand_{company_name}_{ware}()/Multiplikator_{company_name}_{ware}()" for ware in waren]) + ")"
                    DEPEND_EingangTotal = '{' + ', '.join([f'"Lieferbestand_{company_name}_{ware}": 1, "Multiplikator_{company_name}_{ware}": 1' for ware in waren]) + "}"
                                        
                    company_template = company_template.replace(f"TODO_{var_name}", TODO_EingangTotal)
                    company_template = company_template.replace(f"DEPEND_{var_name}", DEPEND_EingangTotal)

                    var_name = "MöglicheAufträge"
                    TODO_MöglicheAufträge = "min(" + ", ".join([f"MöglicheAufträge_{company_name}_{ware}()/Multiplikator_{company_name}_{ware}()" for ware in waren]) + ")"
                    DEPEND_MöglicheAufträge = '{' + ', '.join([f'"MöglicheAufträge_{company_name}_{ware}": 1, "Multiplikator_{company_name}_{ware}": 1' for ware in waren]) + "}"
                                        
                    company_template = company_template.replace(f"TODO_{var_name}", TODO_MöglicheAufträge)
                    company_template = company_template.replace(f"DEPEND_{var_name}", DEPEND_MöglicheAufträge)

                    warenplaceholder = f"_{ware}"
                
                #################
                # multi sourcing:
                #################

                suppliers = inout_dict["IN"][ware]
                if len(suppliers) > 1:

                    for supplier in suppliers:
                        t_mult = str(MULTISOURCING_ODER_COMPANY)

                        # create company source for all suppliers --> handle multi-targetting with get_sup_name(supplier, company_name)
                        sup_placeholder = get_sup_name(supplier, company_name)
                        for var_name, target_name in [("MöglicheAufträge_PLACEHOLDER_PLACEHOLDER1", "Auftragsbeschränkung"), 
                                                      ("Eingang_PLACEHOLDER_PLACEHOLDER1", "Lieferung")]:
                            t_mult = t_mult.replace(f"TODO_{var_name}", f"{target_name}_{sup_placeholder}()")
                            t_mult = t_mult.replace(f"DEPEND_{var_name}", "{" + f'"{target_name}_{sup_placeholder}": 1' + "}")

                        t_mult = t_mult.replace("_WARENPLACEHOLDER", warenplaceholder)
                        t_mult = t_mult.replace("_PLACEHOLDER1", f"_{supplier}")
                        t_mult = t_mult.replace("_PLACEHOLDER", f"_{company_name}")
                        f.write(t_mult)
                        f.write("\n\n")
                    
                    # create connection from suppliers to common
                    t_mult = str(MULTISOURCING_ODER_COMMON)
                    
                    TODO_offeneBestellung = f"max(0, Bestellung_PLACEHOLDER{warenplaceholder}() - (" + " + ".join([f"BestellungStep_{company_name}_{supplier}()" for supplier in suppliers]) + "))"
                    DEPEND_offeneBestellung = '{' + f'"Bestellung_PLACEHOLDER{warenplaceholder}": 1, ' + ', '.join([f'"BestellungStep_{company_name}_{supplier}": 1' for supplier in suppliers]) + "}"
                    
                    t_mult = t_mult.replace("TODO_offeneBestellung", TODO_offeneBestellung)
                    t_mult = t_mult.replace("DEPEND_offeneBestellung", DEPEND_offeneBestellung)

                    TODO_VirtuelleBestellung = f"Bestellung_PLACEHOLDER{warenplaceholder}() + (" + " + ".join([f"fehlendeBestellungen_{company_name}_{supplier}()" for supplier in suppliers]) + ")"
                    DEPEND_VirtuelleBestellung = '{' + f'"Bestellung_PLACEHOLDER{warenplaceholder}": 1, ' + ', '.join([f'"fehlendeBestellungen_{company_name}_{supplier}": 1' for supplier in suppliers]) + "}"

                    t_mult = t_mult.replace("TODO_VirtuelleBestellung", TODO_VirtuelleBestellung)
                    t_mult = t_mult.replace("DEPEND_VirtuelleBestellung", DEPEND_VirtuelleBestellung)

                    t_mult = t_mult.replace("_WARENPLACEHOLDER", warenplaceholder)
                    t_mult = t_mult.replace("_PLACEHOLDER1", f"_{supplier}")
                    t_mult = t_mult.replace("_PLACEHOLDER", f"_{company_name}")
                    f.write(t_mult)
                    f.write("\n\n")                    

                    if len(waren) > 1:
                        # connect multi sourcing to target ware
                        t_mult = str(MULTISOURCING_UND_COMPANY)

                        var_name = "Eingang"
                        t_mult = t_mult.replace(f"TODO_{var_name}_PLACEHOLDER_WARENPLACEHOLDER", " + ".join([f'{var_name}_{get_cust_name(supplier, company_name)}()' for supplier in suppliers]))
                        t_mult = t_mult.replace(f"DEPEND_{var_name}_PLACEHOLDER_WARENPLACEHOLDER", "{" + ", ".join([f'"{var_name}_{get_cust_name(supplier, company_name)}": 1' for supplier in suppliers]) + "}")

                        var_name = "MöglicheAufträge"
                        t_mult = t_mult.replace(f"TODO_{var_name}_PLACEHOLDER_WARENPLACEHOLDER", " + ".join([f'({var_name}_{get_cust_name(supplier, company_name)}() if (Anteil_{get_cust_name(supplier, company_name)}() > 0) else 0)' for supplier in suppliers]))
                        t_mult = t_mult.replace(f"DEPEND_{var_name}_PLACEHOLDER_WARENPLACEHOLDER", "{" + ", ".join([f'"{var_name}_{get_cust_name(supplier, company_name)}": 1, "Anteil_{get_cust_name(supplier, company_name)}": 1' for supplier in suppliers]) + "}")
                        
                        t_mult = t_mult.replace("_WARENPLACEHOLDER", warenplaceholder)
                        t_mult = t_mult.replace("_PLACEHOLDER", f"_{company_name}")
                        f.write(t_mult)
                        f.write("\n\n")
                
                    else:
                        # connect multi sourcing to target company
                        var_name = "Eingang"
                        company_template = company_template.replace(f"TODO_{var_name}", " + ".join([f'{var_name}_{get_cust_name(supplier, company_name)}()' for supplier in suppliers]))
                        company_template = company_template.replace(f"DEPEND_{var_name}", "{" + ", ".join([f'"{var_name}_{get_cust_name(supplier, company_name)}": 1' for supplier in suppliers]) + "}")

                        var_name = "MöglicheAufträge"
                        company_template = company_template.replace(f"TODO_{var_name}", " + ".join([f'({var_name}_{get_cust_name(supplier, company_name)}() if (Anteil_{get_cust_name(supplier, company_name)}() > 0) else 0)' for supplier in suppliers]))
                        company_template = company_template.replace(f"DEPEND_{var_name}", "{" + ", ".join([f'"{var_name}_{get_cust_name(supplier, company_name)}": 1, "Anteil_{get_cust_name(supplier, company_name)}": 1' for supplier in suppliers]) + "}")
                
                else:
                    if len(waren) > 1:
                        # connect multi sourcing to target ware
                        t_mult = str(MULTISOURCING_UND_COMPANY)

                        for var_name, target_name in [("MöglicheAufträge_PLACEHOLDER_WARENPLACEHOLDER", "Auftragsbeschränkung"), 
                                                    ("Eingang_PLACEHOLDER_WARENPLACEHOLDER", "Lieferung")]:
                            t_mult = t_mult.replace(f"TODO_{var_name}", f"{target_name}_{get_sup_name(suppliers[0], company_name)}()")
                            t_mult = t_mult.replace(f"DEPEND_{var_name}", "{" + f'"{target_name}_{get_sup_name(suppliers[0], company_name)}": 1' + "}")

                        t_mult = t_mult.replace("_WARENPLACEHOLDER", warenplaceholder)
                        t_mult = t_mult.replace("_PLACEHOLDER", f"_{company_name}")

                        f.write(t_mult)
                        f.write("\n\n")
                
                    else:
                        # connect multi sourcing to target company
                        # create company source for supplier --> handle multi-targetting with get_sup_name(suppliers[0], company_name)
                        for var_name, target_name in [("MöglicheAufträge", "Auftragsbeschränkung"), 
                                                    ("Eingang", "Lieferung")]:
                            company_template = company_template.replace(f"TODO_{var_name}", f"{target_name}_{get_sup_name(suppliers[0], company_name)}()")
                            company_template = company_template.replace(f"DEPEND_{var_name}", "{" + f'"{target_name}_{get_sup_name(suppliers[0], company_name)}": 1' + "}")
                
            f.write(company_template)
            f.write("\n\n\n")
        
        # finally write world wrapper for end nodes
        for company_name, inout_dict in SC.items():

            if f"WORLD_{company_name}" in inout_dict['OUT']:
                # switch around inout for world's perspective        
                f.write(WORLD["IN"].replace(f"_PLACEHOLDER_IN", f"_{company_name}"))
                f.write("\n\n\n")
            
            for material_name, suppliers in inout_dict['IN'].items():
                if f"WORLD_{company_name}" in suppliers:
                    # switch around inout for world's perspective        
                    f.write(WORLD["OUT"].replace(f"_PLACEHOLDER_OUT", f"_{company_name}"))
                    f.write("\n\n\n")
    
    return fname, SC

if __name__ == "__main__":
    test_model = {
        # "Wird beliefert": ["Von"]
        # KEIN WORLD!
        "MQ": {"Holz": ["Lieferant", "Anderer"],
               "Eisen": ["EisenLieferant"]},
        "Lieferant": {"Holz": ["Anderer"]},
        "EisenLieferant": {"Eisen": ["Quelle"]}
    }
    
    create_model("test", test_model)

