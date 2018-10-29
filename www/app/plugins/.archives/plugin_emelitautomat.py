# -*- coding: utf-8 -*-

##############
## OPENAUTH ##
##############
from plugin_9_auth_helpers.open_auth.main import OpenAuthWrapper
open_auth_wrapper = OpenAuthWrapper(**module_kwargs)
open_auth_wrapper()


####################
## MULTIPLE LOGIN ##
####################
from plugin_9_auth_helpers.multiple_login.main import MultipleLoginWrapper
multiple_login_wrapper = MultipleLoginWrapper(**module_kwargs)(open_auth_wrapper)


##################
## AUTH HELPER  ##
##################
from plugin_9_auth_helpers.main import AuthHelper  
auth_helper = AuthHelper(**module_kwargs)
auth_helper()

