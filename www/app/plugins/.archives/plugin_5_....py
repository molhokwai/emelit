# -*- coding: utf-8 -*-

###########
## AUTH  ##
###########
from gluon.tools import Auth, Crud, Service, PluginManager, prettydate
auth = Auth(db)
crud, service, plugins = Crud(db), Service(), PluginManager()

# Extra fields
module_kwargs['_refs'] = {
        'Field': Field,
        'IS_IN_SET': IS_IN_SET,
        'IS_NOT_EMPTY': IS_NOT_EMPTY,
        'IS_IN_DB': IS_IN_DB,
        'SQLFORM': SQLFORM,
}
module_kwargs['_auth'] = auth
from plugin_9_auth_helpers.extra_fields.main import AuthExtraFields
auth_extra_fields = AuthExtraFields(**module_kwargs)
auth_extra_fields()
 
## create all tables needed by auth if not custom tables
auth.define_tables(username=True, signature=False)
## extra fields rules
auth_extra_fields.callbacks()

## all tables/records signed
db._common_fields.append(auth.signature)

## custom auths
import re
custom_auth_controllers = ['plugin_projectmia']

#########################
## VERSIONING/AUDITING ##
#########################
auth.enable_record_versioning(db)

