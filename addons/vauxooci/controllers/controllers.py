# -*- coding: utf-8 -*-
from openerp import http

# class RunbotFrontend(http.Controller):
#     @http.route('/runbot_frontend/runbot_frontend/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/runbot_frontend/runbot_frontend/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('runbot_frontend.listing', {
#             'root': '/runbot_frontend/runbot_frontend',
#             'objects': http.request.env['runbot_frontend.runbot_frontend'].search([]),
#         })

#     @http.route('/runbot_frontend/runbot_frontend/objects/<model("runbot_frontend.runbot_frontend"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('runbot_frontend.object', {
#             'object': obj
#         })