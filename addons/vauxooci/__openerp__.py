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
        'runbot_travis2docker',
        'theme_material',
    ],
    'data': [
        'views/templates.xml',
    ],
    'demo': [
        'demo/demo.xml',
    ],
}
