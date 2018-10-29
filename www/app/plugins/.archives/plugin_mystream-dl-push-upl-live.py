# -*- coding: utf-8 -*-

###################
##   MY STREAM   ##
###################
import datetime

# LOAD
def _plugin_mystream_page_load(args=[], _vars={}):
    return LOAD('plugin_mystream', 'page.load',  args=args, vars=_vars, ajax=True, target='block_center')
plugin_mystream_page_load = _plugin_mystream_page_load

def _plugin_mystream(args=[], _vars={}):
    return LOAD('plugin_mystream', 'index.load',  args=args, vars=_vars, ajax=True, target='block_center')
plugin_mystream = _plugin_mystream


# BEGIN: LIST STRING VAALIDATOR WIDGET
# src: http://www.web2pyslices.com/slice/show/1419/liststring-validator-and-widget
# @ToDo: Fix and refactor (see https://molhokwai.pythonanywhere.com/admin/edit/emelit/models/plugin_editable_jqgrid.py)?
class TAGS_LIST:
    def __init__(self, separator=',', error_message='This is not a valid list!'):
        self.separator = separator
        self.e = error_message

    def __call__(self,value):
        try:
            list = value.split(self.separator)
            return (list, None)
        except:
            return (value, self.e)

    def formatter(self, value):
        tags = ''
        for tag in value:
            tags += '%(tag)s%(sep)s ' % {'tag':tag,'sep':self.separator}
        return tags

def tags_widget(field, value, **attributes):
    id = "%s_%s" % (field._tablename, field.name)   # form field
    idu = id + '_u'       #user field
    idl = id + '_l'       #list display
    script = SCRIPT(
                    'function parse() {var s = ""; $("#%(idl)s > li").each(function(){s+=$(this).html()+",";});  $("#%(id)s").val(s)}' % {'id':id,'idl':idl},
                    'function addTag(tag){var item=$(document.createElement("li")); item.text(tag); item.click(function(){item.remove(); parse();}); $("#%(idl)s").append(item); }' % {'idl':idl},
                    'function init() {list = $("#%(id)s").val().split(","); list.pop(); $.each(list, function(index,item){addTag(item)}); }' % {'id':id},
                    '$(document).ready(function (){init();});')
    inp_user = INPUT(_id=idu,
                     _onkeyup='if (event.keyCode==32) {addTag($(this).val()); parse(); $(this).val("");}' % {'idu':idu})
    inp_hiden = INPUT(
                 _type="hidden",
                 _name=field.name,
                 _id=id,
                 _class=field.type,
                 _value=value,
                 requires=field.requires,
                 )
    list = UL(_id=idl)
    return DIV(script,inp_user,list,inp_hiden)
# END: LIST STRING VAALIDATOR WIDGET

mystream_langs = ['en', 'fr']

# DB
dui = db(db.auth_user.username == 'MayouNkensa').select() # default_user_id
dui = dui[0].id if len(dui) else 1
db.define_table('my_stream',
    Field('name',       'string',       required=True,  default=T('post')),
    Field('description',   'text',      required=True,  widget=ckeditor.widget),
    Field('media',   'upload'),
    Field('lang',   'string',           required=True,  default='en'),
    Field('date_time', 'datetime',      required=True,  default=datetime.datetime.now(),
                                        represent = lambda date_time,row: date_time.strftime('%a %d %b %Y - %H:%M')),
    Field('tags',  'list:string',       required=True, default=[]),
    Field('auth_user',  db.auth_user,   required=True,  default=dui),
    Field('search_full_text',  'text', readable=False, writable=False, default=''),
    format='%(auth_user)s %(name)s'
)
db.my_stream.lang.requires = IS_IN_SET(mystream_langs, zero=T('choose one'), error_message=T('must be "en" or "fr"'))
db.my_stream.description.default = """
        <p>&nbsp;...&nbsp;</p>
        <p><em><small>see source for double column layout</small></em></p>
        <div class="card-text-left col-lg-6">
            ←|
        </div>
        <div class="card-text-right col-lg-6">
            |→
        </div>
        <div class="clear"><p>&nbsp;</p></div>
"""
db.my_stream._after_update.append(
    lambda row, fields:\
        row.update_naive(search_full_text = '%s ## %s ## %s' % (fields['name'], fields['description'], str(fields['tags']))))
db.define_table('my_stream_dummy', db.my_stream)


# @TODO : Refactoring → move to plugin_common, point all plugins using method
def is_active_menu_link(c, f, a=[]):
    return request.controller == c and request.function == f and (a == ['*'] or request.args == a)

if request.controller == 'plugin_mystream':
    # MENU
    response.menu = [
        (T('Main'), is_active_menu_link('plugin_mystream', 'index', a=['*']), \
                        URL(r=request, c='plugin_mystream', f='index'), []),
    ]
    if auth.user:
        response.menu = [
            (T('Main'), is_active_menu_link('plugin_mystream', 'index', a=['*']), \
                            URL(r=request, c='plugin_mystream', f='index'), [])]

        is_admin = auth.has_membership(role='admin')
        if is_admin:
            response.menu.append((T('Edit'), is_active_menu_link('plugin_mystream', 'grid', a=['*']), \
                            URL(r=request, c='plugin_mystream', f='grid'), []))
            response.menu.append((T('Private'), is_active_menu_link('plugin_mystream', 'index', a=['*']), \
                            URL(r=request, c='plugin_mystream', f='index', args=['tag', 'private']), []))

        response.menu.append((T('Simple app'), is_active_menu_link('plugin_mystream', 'simple_app', a=['*']), \
                            URL(r=request, c='plugin_mystream', f='simple_app'), []))


module_kwargs
