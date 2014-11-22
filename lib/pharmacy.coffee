async = require 'async'
google_geocoding = require 'google-geocoding'
_ = require 'lodash'

Model = require './model'
Logger = require './logger'
View = require './view'

string = require '../utils/string'

exports.addPharmacy = (data, callback) ->
	async.waterfall [
		(next) ->
			str = string.escape data.city + ', ' + data.address
			
			console.log str
			
			google_geocoding.geocode str, next
		(location, next) ->
			console.log location
			
			searchData =
				address: data.address
				city: data.city
				name: data.name
			
			if location
				data.loc = [location.lng, location.lat]
			
			Model 'Pharmacy', 'update', next, searchData, data, upsert: true
		() ->
			setTimeout callback, 3000
	], callback

exports.near = (req, res) ->
	async.waterfall [
		(next) ->
			searchData =
				loc:
					$near: [req.body.lng, req.body.lat]
					$maxDistance: 0.1
			
			Model 'Pharmacy', 'find', next, searchData, null, lean: true
		(docs) ->
			data =
				pharmacy: docs
			
			View.ajaxResponse res, null, data
	], (err) ->
		error = err.message or err
		Logger.log 'info', "Error in lib/pharmacy/near: #{error}"
		View.ajaxResponse res, err