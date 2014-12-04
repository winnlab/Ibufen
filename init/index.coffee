async = require 'async'
_ = require 'underscore'
_.str = require 'underscore.string'

require './database'

Logger = require '../lib/logger'
Migrate = require './migrate'
Application = require './application'
AuthStartegies = require './auth'
ModelPreloader = require './mpload'

port = 80

_.mixin _.str.exports()

async.waterfall [
	(next) ->
		Logger.log 'info', 'Pre initialization succeeded'
		Logger.init next
	(next) ->
		Logger.log 'info', 'Logger is initializated'
		
		ModelPreloader "#{process.cwd()}/models/", next
	(next) ->
		Logger.log 'info', 'Models are preloaded'
		
		Logger.log 'info', 'Processing Migrate...'
		Migrate.init next
	(next) ->
		Logger.log 'info', 'Migrate is initializated'
		
		Application.init port, next
	(appPort, next) ->
		Logger.log 'info', "Application is binded to #{appPort}"
		
		AuthStartegies.init next
	(next) ->
		Logger.log 'info', 'Auth is initializated'
], (err) ->
	Logger.error 'Init error: ', err