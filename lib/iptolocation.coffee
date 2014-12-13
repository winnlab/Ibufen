async = require 'async'
google_geocoding = require 'google-geocoding'
iplocation = require 'iplocation'

Model = require './model'
Logger = require './logger'
View = require './view'

string = require '../utils/string'

exports.addIptolocation = (data, callback) ->
	Model 'Iptolocation', 'update', callback, data, data, upsert: true

exports.findAll = (req, res) ->
	findOptions =
		'$or': [
			code: 'UA'
		,
			code: 'BY'
		,
			code: 'RU'
		,
			code: 'GE'
		,
			code: 'AM'
		,
			code: 'AZ'
		,
			code: 'KZ'
		,
			code: 'UZ'
		,
			code: 'KG'
		]
	
	async.waterfall [
		(next) ->
			Model 'Iptolocation', 'find', next, findOptions, '-__v', lean: true
		(docs) ->
			res.send docs
	], (err) ->
		error = err.message or err
		Logger.log 'info', "Error in lib/iptolocation/findAll: #{error}"
		View.ajaxResponse res, err