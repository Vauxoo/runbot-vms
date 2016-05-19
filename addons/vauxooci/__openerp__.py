# -*- coding: utf-8 -*-
{
    'name': "Runbot Frontend",
    'summary': """Improvements and rewrite the runbot frontend.""",
    'author': "Vaxuoo",
    'website': "http://www.vauxoo.com",
    'category': 'Runbot',
    'version': '0.0.3',
    'application': True,
    'depends': [
        'mail',
        'website_portal',
        'runbot_travis2docker',
        'theme_material',
    ],
    'data': [
        'views/assets.xml',
        'views/layout.xml',
        'views/templates.xml',
        'views/views.xml',
    ],
    'demo': [
        'demo/demo.xml',
    ],
}
