#!/usr/bin/env python
# -*- coding: utf8 -*-
import os


###############
#   HELPERS   #
###############
class MacroPathHelper():
    _dict = {}
    def __init__(self, config, action):
        for name in config:
            self._dict[name] = config[name]
        self.action = action

    def __getattr__(self, name):
        import os
        if name in ('output'):
            path = os.path.join(self.path, self.action)
            if not os.path.exists(path):
                os.makedirs(path)
            return os.path.join(self.path, self.action, self._dict[name])

        if name in ('script_path', 'git_script_path', 'after_upload_url'):
            return self._dict[name]

        elif name not in ('path'):
            return os.path.join(self.path, self._dict[name])

        else:
            return os.path.join(self._dict['path'])

    def get_command_path(self, which='download'):
        return os.path.join(self.path, self._dict['commands'][which])

    def get_transfer_path(self, plugin_name, which='download'):
        return str(self._dict[which] % plugin_name)\
              .replace('web2py.plugin_', 'web2py.plugin.')
