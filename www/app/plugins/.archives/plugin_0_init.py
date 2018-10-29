# -*- coding: utf-8 -*-

############
## CONFIG ##
############
import gluon
module_kwargs = {
   '_gluon' : gluon,
   '_response': response,
   '_request': request,
   '_session': session,
   '_auth': None,
   '_mail': None,
   '_db': db,
   '_T': T,
   '_XML': XML,
   '_URL': URL,
   '_A': A,
   '_refs': None,
   '_mail_helper': None,
   '_lang_helper': None,
}
from plugin_1_config.main import Config
config = Config(**module_kwargs)()
module_kwargs['_config'] = config
