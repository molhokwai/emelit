# -*- coding: utf-8 -*-

####################
## COMMON HELPER  ##
####################
from plugin_4_common.helper.main import CommonHelper
h = CommonHelper(**module_kwargs)
h()
module_kwargs['_h'] = h


#######################
## FIRST TIME HELPER ##
#######################
from plugin_4_common.first_time.main import FirstTimeHelper 
first = FirstTimeHelper(**module_kwargs)
first()


#######################
##  OBJECT HELPERS   ##
#######################
class DictToObj(object):
    """
    Dict to Object
    @src    https://stackoverflow.com/questions/1305532/convert-nested-python-dict-to-object
    """
    def __init__(self, d):
        for a, b in d.items():
            if isinstance(b, (list, tuple)):
               setattr(self, a, [DictToObj(x) if isinstance(x, dict) else x for x in b])
            else:
               setattr(self, a, DictToObj(b) if isinstance(b, dict) else b)
