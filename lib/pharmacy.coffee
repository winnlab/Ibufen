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