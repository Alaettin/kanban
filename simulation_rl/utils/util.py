import numpy as np
from utils.constants import SPLIT_STR, SPLIT_STR_PARAM

#######################
# Params tuning utils
#######################

class ParamTransform:
    def __init__(self, *funs, bounds=[0, 1], conditional_id=-1) -> None:
        self.funs = funs
        if not self.funs:
            self.funs = [lambda x: x]
        self.bounds = bounds
        self.id = conditional_id
    
    def __call__(self, val, idx=0):
        return self.funs[idx](val)
    
    def __len__(self):
        return len(self.funs)

class ConditionalParam:
    def __init__(self, true_val, false_val, *funs, use_val_as_true=False, value_tranfsorm_fun=None) -> None:
        self.funs = funs
        self.true_val = true_val
        self.false_val = false_val
        self.use_val_as_true = use_val_as_true
        self.value_tranfsorm_fun = value_tranfsorm_fun
        
        assert self.value_tranfsorm_fun is None or self.use_val_as_true, "Value can only be transformed if used as true"
    
    def __call__(self, val, idx=0):
        if self.use_val_as_true:
            self.true_val = val if self.value_tranfsorm_fun is None else self.value_tranfsorm_fun(val)
        return self.funs[idx][0](val)

    def __getitem__(self, idx=0):
        return self.funs[idx][1]
    
    def __len__(self):
        return len(self.funs)
    

def intify(x, min_x=0, max_x=1):
    return min([int(x * (max_x - min_x + 1)), max_x])

######################
# dict iteration utils
# ####################

def unzip_key(d, v, k, unzip_all=False):
    if isinstance(v, dict):
        d.update(recurse_dict(v, k, unzip_all=unzip_all))
    elif isinstance(v, list):
        for i in range(len(v)):
            unzip_key(d, v[i], k + SPLIT_STR_PARAM + str(i), unzip_all=unzip_all)
    elif isinstance(v, ParamTransform):
        if len(v) > 1:
            for i in range(len(v)):
                d[k + SPLIT_STR_PARAM + str(i)] = v.bounds
        else:
            d[k] = v.bounds
    elif unzip_all:
        d[k] = v

def recurse_dict(d, keys="", unzip_all=False):
    d_new = {}
    for k, v in d.items():
        keys_new = keys + (SPLIT_STR if len(keys) > 0 else "") + k
        unzip_key(d_new, v, keys_new, unzip_all=unzip_all)
        
    return d_new

def eval_param(d1, d2, v, k, id):
    if isinstance(v, dict):
        found, value = get_param_value(d1[k], d2[k], id)
        if found:
            return found, value
    elif isinstance(v, list):
        for i, el in enumerate(v):
            found, value = eval_param(d1[k], d2[k], el, i, id)
            if found:
                return found, value
    elif isinstance(v, ParamTransform):
        if id == v.id:
            return True, d1[k]
    return False, None
def get_param_value(d1, d2, id=-1):
    for k, v in d2.items():
        found, value = eval_param(d1, d2, v, k, id)
        if found:
            return found, value
    return False, None

def eval_condition(d1, d2, v, k, d1_orig, d2_orig):
    if isinstance(v, dict):
        recursive_eval_dict(d1[k], d2[k], d1_orig, d2_orig)
    elif isinstance(v, list):
        for i, el in enumerate(v):
            eval_condition(d1[k], d2[k], el, i, d1_orig, d2_orig)
    elif isinstance(v, ConditionalParam):
        is_true = True
        for i in range(len(v)):
            found, val = get_param_value(d1_orig, d2_orig, v[i])
            if not found: 
                print("Conditional Param pair ", v, " not found!")
            # else:
            #     print("Conditional Param pair ", v, " found with value ", val, " evaluated to ", v(val))
            is_true = is_true and found and v(val)
        d1[k] = v.true_val if is_true else v.false_val

def recursive_eval_dict(d1, d2, d1_orig=None, d2_orig=None):
    for k, v in d2.items():
        eval_condition(d1, d2, v, k, d1_orig if d1_orig is not None else d1, d2_orig if d2_orig is not None else d2)


def recursive_update_dict(d1, d2):
    for k, v in d2.items():
        if k not in d1.keys():
            d1[k] = d2[k]
        elif isinstance(v, dict):
            recursive_update_dict(d1[k], d2[k])
        else:
            d1[k] = d2[k]

def recursive_deactivate_dict(d):
    if isinstance(d, dict):
        l = list(d.keys())
        for k in l:
            v = d[k]
            if isinstance(v, dict):
                if "deactivate" in v.keys() and v["deactivate"]:
                    if isinstance(d, dict):
                        d.pop(k)
                    else:
                        del k
                else:
                    if "deactivate" in v.keys():
                        v.pop("deactivate")
                    recursive_deactivate_dict(v)
            elif isinstance(v, list):
                recursive_deactivate_dict(v)
    elif isinstance(d, list):
        i = 0
        while i < len(d):
            v = d[i]
            if isinstance(v, dict):
                if "deactivate" in v.keys() and v["deactivate"]:
                    del d[i]
                    i -= 1
                else:
                    if "deactivate" in v.keys():
                        v.pop("deactivate")
                    recursive_deactivate_dict(v)
            elif isinstance(v, list):
                recursive_deactivate_dict(v)
            i += 1

    return d


def get_val(d, *keys):
    for k in keys: d = d[k]
    return d

def jsonify(npobj):
    if isinstance(npobj, (np.int_, np.intc, np.intp, np.int8,
                            np.int16, np.int32, np.int64, np.uint8,
                            np.uint16, np.uint32, np.uint64)):

        return int(npobj)

    elif isinstance(npobj, (np.float_, np.float16, np.float32, np.float64)):
        return float(npobj)

    elif isinstance(npobj, (np.complex_, np.complex64, np.complex128)):
        return {'real': npobj.real, 'imag': npobj.imag}

    elif isinstance(npobj, (np.ndarray,)):
        return [jsonify(np_subobj) for np_subobj in npobj]

    elif isinstance(npobj, (np.bool_)):
        return bool(npobj)

    elif isinstance(npobj, (np.void)): 
        return None
    else:
        return str(npobj)
    