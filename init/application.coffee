http = require 'http'

express = require 'express'
async = require 'async'
passport = require 'passport'
roles = require 'roles'

cookieParser = require 'cookie-parser'
bodyParser = require 'body-parser'
methodOverride = require 'method-override' 

Ajax = require '../lib/ajax'
Auth = require '../lib/auth'
View = require '../lib/view'

adminController = require '../controllers/admin'
userController = require '../controllers/user'

locals = require './locals'

routes = () ->
	@use userController.Router
	@use '/', userController.Router
	@use '/admin', adminController.Router

configure = () ->
	@use '/js', express.static "#{__dirname}/../public/js"
	@use '/img', express.static "#{__dirname}/../public/img"
	@use '/css', express.static "#{__dirname}/../public/css"
	@use '/fonts', express.static "#{__dirname}/../public/fonts"
	@use '/robots.txt', (req, res)->
		res.set 'Content-Type', 'text/plain'
		res.send "User-agent: *\nDisallow: /"
	
	@use View.compiler {root: '/views'}
	
	@use bodyParser()
	@use cookieParser 'LmAK3VNuA6'
	@use passport.initialize()
	@use passport.session()
	@use '/admin', Auth.isAuth
	@use methodOverride()
	@use View.globals

	@use '/admin', (req, res, next) ->
		Ajax.isAjax req, res, next, adminController.layoutPage

exports.init = (port, callback) ->
	exports.express = app = express()
	exports.server = @server = http.Server app

	app.locals = locals

	configure.apply app
	routes.apply app
	
	@server.listen port
	
	callback null, port