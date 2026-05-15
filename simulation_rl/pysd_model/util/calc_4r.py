import numpy as np
from scipy.optimize import minimize
import pandas as pd

BOUNDS = [
    (0.1, 1.0),    # params[0]
    (1e-3, 10), # params[1]
    (-0.499, 0.499),  # params[2]
    (-0.01, None),# params[3]

    (0.1, 1.0),    # params[4]
    (1e-3, 10), # params[5]
    (-0.499, 0.499),  # params[6]
    (-0.01, None) # params[7]
]


def dis_rec_fn(x, p):
    return (
        p[0] / (1 + np.exp(-p[1] * (x - p[2]))) +
        p[4] / (1 + np.exp( p[5] * (x - p[6])))
    )


def objective_function(p, y, from_, to_):
    span = to_ - from_

    i = np.arange(from_, to_)
    x = (i - from_) / span - 0.5
    err = ((y[i] - dis_rec_fn(x, p)) ** 2).sum() * 100

    return err


def optimize_function(y, from_, to_, k):
    init = np.array([
        y[from_] + k / 1000,
        100.0 - k / 1000,
        0.4 - k / 1000,
        0.0 + k / 1000,
        y[to_] + k / 1000,
        100.0 - k / 1000,
        -0.4 + k / 1000,
        0.0 + k / 1000
    ])

    res = minimize(
        objective_function,
        init,
        args=(y, from_, to_),
        method="L-BFGS-B",
        bounds=BOUNDS,
        options={
            "maxiter": 10000,
            "ftol": 1e-15,      # function tolerance
            "gtol": 1e-12,      # gradient tolerance (CRITICAL)
            "maxls": 50,        # more line-search steps
        }
    )
    return res

def run_optimization(df, x0, search_start=100, search_end=180, bound_add=10, search_thresh=5):

    # --- find minimum ---
    argmin = np.argmin(df[int(search_start - x0):int(search_end - x0)])
    argmin += int(search_start - x0)
    valmin = df[argmin]

    # --- expand right ---
    last = valmin
    for i in range(argmin + 1, len(df)):
        if df[i] < valmin:
            valmin = df[i]
            argmin = i
        to_ = min(i + bound_add, len(df) - 1)
        if (i - argmin > search_thresh) and (df[i] - last < 0.01):
            break
        last = df[i]

    # --- expand left ---
    last = valmin
    for i in range(argmin - 1, -1, -1):
        if df[i] < valmin:
            valmin = df[i]
            argmin = i
        from_ = max(i - bound_add, 0)
        if (argmin - i > search_thresh) and (df[i] - last < 0.01):
            break
        last = df[i]

    for k in range(100):
        try:
            res = optimize_function(df, from_, to_, k)
            # don't accept error mean > 0.5
            # if res.fun >= (to_ - from_) / 2:
            #     continue

            # print(res)

            p = res.x
            
            predicted_r = list(zip(range(x0, x0 + len(df)), p[0] / (1 + np.exp(-p[1]*((np.arange(x0, x0 + len(df)) - from_) / (to_ - from_) - 0.5 - p[2])))))
            predicted_d = list(zip(range(x0, x0 + len(df)), p[4] / (1 + np.exp( p[5]*((np.arange(x0, x0 + len(df)) - from_) / (to_ - from_) - 0.5 - p[6])))))
            predicted_f = list(zip(range(x0, x0 + len(df)), dis_rec_fn((np.arange(x0, x0 + len(df)) - from_) / (to_ - from_) - 0.5, p)))

            # parameter ordering
            ad, bd, cd, dd = p[4], -p[5], p[6], p[7]
            ar, br, cr, dr = p[0],  p[1], p[2], p[3]

            cd0, cr0 = cd, cr
            cd = (cd + 0.5) * (to_ - from_) + from_
            cr = (cr + 0.5) * (to_ - from_) + from_

            Robustness = (-bd / 4) / (cd - from_)
            Redundancy = 1 - valmin
            Resourcefulness = (cr - from_) / (br / 4) / 1000

            X1 = (np.log(1/0.95 - 1) / -bd + cd0 + 0.5) * (to_ - from_)
            X2 = (np.log(1/0.95 - 1) / -br + cr0 + 0.5) * (to_ - from_)
            Rapidity = X2 - X1

            if min(Robustness, Redundancy, Resourcefulness, Rapidity) > 0:
                return np.array([Robustness, Redundancy, Resourcefulness, Rapidity]), predicted_d, predicted_r, predicted_f

        except Exception:
            pass

    return None
