### copied from detectron2 by facebook ###

from ast import literal_eval

_VALID_TYPES = {tuple, list, str, int, float, bool, type(None)}

def merge_config_with_args(cfg, cfg_list):
    print("ADD ARGS: ", cfg_list)
    for full_key, v in zip(cfg_list[0::2], cfg_list[1::2]):
        key_list = full_key.split(".")
        d = cfg
        for subkey in key_list[:-1]:
            if subkey not in d:
                print("Non-existent key, adding: {}".format(full_key))
                d[subkey] = {}
            d = d[subkey]
        subkey = key_list[-1]
        value = decode_cfg_value(v)
        if subkey not in d: 
            print("Non-existent key, adding: {}".format(full_key))
        else:
            value = check_and_coerce_cfg_value_type(value, d[subkey], subkey, full_key)
        d[subkey] = value

    print("MERGED: ", cfg)

    return cfg

def decode_cfg_value(value):
        """
        Decodes a raw config value (e.g., from a yaml config files or command
        line argument) into a Python object.

        If the value is a dict, it will be interpreted as a new CfgNode.
        If the value is a str, it will be evaluated as literals.
        Otherwise it is returned as-is.
        """
        # All remaining processing is only applied to strings
        if not isinstance(value, str):
            return value
        # Try to interpret `value` as a:
        #   string, number, tuple, list, dict, boolean, or None
        try:
            value = literal_eval(value)
        # The following two excepts allow v to pass through when it represents a
        # string.
        #
        # Longer explanation:
        # The type of v is always a string (before calling literal_eval), but
        # sometimes it *represents* a string and other times a data structure, like
        # a list. In the case that v represents a string, what we got back from the
        # yaml parser is 'foo' *without quotes* (so, not '"foo"'). literal_eval is
        # ok with '"foo"', but will raise a ValueError if given 'foo'. In other
        # cases, like paths (v = 'foo/bar' and not v = '"foo/bar"'), literal_eval
        # will raise a SyntaxError.
        except ValueError:
            pass
        except SyntaxError:
            pass
        return value

def check_and_coerce_cfg_value_type(replacement, original, key, full_key):
    """Checks that `replacement`, which is intended to replace `original` is of
    the right type. The type is correct if it matches exactly or is one of a few
    cases in which the type can be easily coerced.
    """
    original_type = type(original)
    replacement_type = type(replacement)

    # The types must match (with some exceptions)
    if replacement_type == original_type:
        return replacement

    # If either of them is None, allow type conversion to one of the valid types
    if (replacement_type == type(None) and original_type in _VALID_TYPES) or (
        original_type == type(None) and replacement_type in _VALID_TYPES
    ):
        return replacement

    # Cast replacement from from_type to to_type if the replacement and original
    # types match from_type and to_type
    def conditional_cast(from_type, to_type):
        if replacement_type == from_type and original_type == to_type:
            return True, to_type(replacement)
        else:
            return False, None

    # Conditionally casts
    # list <-> tuple
    casts = [(tuple, list), (list, tuple)]
    # For py2: allow converting from str (bytes) to a unicode string
    try:
        casts.append((str, unicode))  # noqa: F821
    except Exception:
        pass

    for (from_type, to_type) in casts:
        converted, converted_value = conditional_cast(from_type, to_type)
        if converted:
            return converted_value

    print(
        "WARNING: Type mismatch ({} vs. {}) with values ({} vs. {}) for config key: {} --> Returning original!".format(
            original_type, replacement_type, original, replacement, full_key
        )
    )

    return original