# -*- coding: utf-8 -*-

###################
##      MIA      ##
###################
import os

APP_PATH = os.path.join(request.env.web2py_path, 'applications', request.application)
PRIVATE_PATH = os.path.join(APP_PATH, 'private/plugin_mystream/spreadsheet_api/')
JSON_DB_PATH = os.path.join(PRIVATE_PATH, 'data')

plugin_projectmia = {
    'config': {
        'MAIN_SPREADSHEET_ID' : '1mKJ7r6i51_XWbzzT7aG1CodzXl4RTJxFIn3FuwA-3rE',
        'RANGE_NAMES' : {
            'SchoolsAndUniversities' : ['Schools & Universities!A5:H', lambda _map, row, validate: validate(_map, row, 1)],
            'Students' : ['Students!A5:L', lambda _map, row, validate: validate(_map, row, 2)],
            'Team' : ['Team & Partners!A5:L20', lambda _map, row, validate: validate(_map, row, 2)],
            'Partners' : ['Team & Partners!A22:L', lambda _map, row, validate: validate(_map, row, 2)],
            'ActivityList' : ['Activities!A5:L18', lambda _map, row, validate: validate(_map, row, 1)],
            'Activities' : ['Activities!A20:M', lambda _map, row, validate: validate(_map, row, 1)],
            'ActivitiesStudents' : ['Activities - Students!A5:K', lambda _map, row, validate: validate(_map, row, 1)],
        },
        'APP_PATH': APP_PATH,
        'PRIVATE_PATH' : PRIVATE_PATH,
        'JSON_DB_PATH': JSON_DB_PATH,
        'default_object_template' : 'obj_plugin_projectmia_ALL',
        'object_display' : {
            'obj_plugin_projectmia_ALL' : lambda objects: objects.pop('Activities', None),
        },
    },
    'methods': {
        'format_username' : lambda name: ''.join(filter(lambda x: str.isalpha(x) or x in ('-', '_'), 
                                                      name.lower().encode('ascii', 'ignore').replace(' ', '-'))),
        'get_student_piccontainer_id': lambda username: 'student_picture-%s' % username,
        'get_student_form_id': lambda username: 'student_form-%s' % username,        
    },
    'defaults' : {
        'student_picture_url' : URL('static' '/plugin_theme_projectmia/images/students_avatar__depositphotos_145517561_stock_illustration_student_avatar_mini_line_icon.jpg'),
    },
}

# DB
db.define_table('projectmia_students',
    Field('username', 'string', unique=True, required=True),
    Field('picture', 'upload', requires=IS_IMAGE()),
    format='%(username)s'
)


# METAS
if request.controller == 'plugin_projectmia':
    response.title = T('MIA - Model Initiative for Academics')
    response.subtitle = T('Model Initiative for Academics')
    response.meta.description = XML(T('We are Model Initiative of Academics, a Student Awareness, Competitiveness &amp; Leadership organization.'))
    response.meta.keywords = XML(T('student, organization, leadership, initiative, academic, preparatory, awareness, competitiveness, cameroon, africa'))

# MENU
# @TODO : Refactoring → move to plugin_common, point all plugins using method
def is_active_menu_link(c, f, a=[]):
    return request.controller == c and request.function == f and (a == ['*'] or request.args == a)

if request.controller == 'plugin_projectmia':
    # MENU
    response.menu = [
        (T('Home'), is_active_menu_link('plugin_projectmia', 'landing', a=['view', 'home']), \
                        URL(r=request, c='plugin_projectmia', f='landing', args=['view', 'home']), []),
        (T('Mission Statement'), is_active_menu_link('plugin_projectmia', 'page', a=['view', 'mission_statement']), \
                        URL(r=request, c='plugin_projectmia', f='page', args=['view', 'mission_statement']), []),
        (T('Activities'), is_active_menu_link('plugin_projectmia', 'page', a=['view', 'activities']), \
                        URL(r=request, c='plugin_projectmia', f='page', args=['view', 'activities']), []),
        (T('Our Students\' Results'), is_active_menu_link('plugin_projectmia', 'page', a=['view', 'students']), \
                        URL(r=request, c='plugin_projectmia', f='page', args=['view', 'students']), []),
        (T('Team &amp; Partners'), is_active_menu_link('plugin_projectmia', 'page', a=['view', 'team_and_partners']), \
                        URL(r=request, c='plugin_projectmia', f='page', args=['view', 'team_and_partners']), []),
        (T('Contact'), is_active_menu_link('plugin_projectmia', 'page', a=['view', 'contact']), \
                        URL(r=request, c='plugin_projectmia', f='page', args=['view', 'contact']), []),
    ]
    
    if auth.user or request.env.HTTP_HOST.find('127.0.0.1')>=0:
        response.menu += [
            (T('Admin'), is_active_menu_link('plugin_projectmia', 'admin', a=['view', 'admin']), \
                            URL(r=request, c='plugin_projectmia', f='admin', args=['view', 'admin']), [])]
        
        is_admin = auth.has_membership(role='admin')
        if is_admin:
            #response.menu.append((T('Edit'), is_active_menu_link('plugin_projectmia', 'grid', a=['*']), \
            #                URL(r=request, c='plugin_projectmia', f='grid'), []))
            #response.menu.append((T('Private'), is_active_menu_link('plugin_projectmia', 'index', a=['*']), \
            #                URL(r=request, c='plugin_projectmia', f='index', args=['tag', 'private']), []))
            pass

        #response.menu.append((T('Simple app'), is_active_menu_link('plugin_projectmia', 'simple_app', a=['*']), \
        #                    URL(r=request, c='plugin_projectmia', f='simple_app'), []))
