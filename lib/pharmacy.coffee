async = require 'async'
google_geocoding = require 'google-geocoding'
_ = require 'lodash'

Model = require './model'

string = require '../utils/string'

exports.addPharmacy = (data, callback) ->
	async.waterfall [
		(next) ->
			str = string.escape data.city + ', ' + data.address
			
			console.log str
			
			google_geocoding.geocode str, next
		(location, next) ->
			console.log location
			
			_.extend data, location
			
			Model 'Pharmacy', 'update', next, data, data, upsert: true
		() ->
			setTimeout callback, 3000
	], callback