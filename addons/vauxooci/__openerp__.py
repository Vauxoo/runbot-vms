# -*- coding: utf-8 -*-
{
    'name': "Runbot Frontend",
    'summary': """Improvements and rewrite the runbot frontend.""",
    'author': "Vaxuoo",
    'website': "http://www.yourcompany.com",
    'category': 'Runbot',
    'version': '0.1',
    'application': True,
    'depends': [
        'mail',
        'runbot_travis2docker',
        'theme_material',
    ],
    'data': [
        'views/assets.xml',
        'views/layout.xml',
        'views/templates.xml',
    ],
    'demo': [
        'demo/demo.xml',
    ],
}
