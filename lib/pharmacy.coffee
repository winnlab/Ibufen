async = require 'async'
google_geocoding = require 'google-geocoding'
iplocation = require 'iplocation'

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
	searchData =
		loc:
			$near: []
			$maxDistance: 0.1
	
	data =
		lng: 0
		lat: 0
		pharmacy: []
	
	async.waterfall [
		(next) ->
			if req.body.lng && req.body.lat
				data.lng = req.body.lng
				data.lat = req.body.lat
				
				return next null, null
			
			ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
			timeout = true
			
			iplocation.get ip, (result) ->
				console.log result
				timeout = false
				next null, result
			
			setTimeout () ->
				if timeout
					return View.ajaxResponse res, null, data
			, 3000
		(iplocation, next) ->
			if iplocation
				data.lng = iplocation.longitude
				data.lat = iplocation.latitude
			
			searchData.loc['$near'] = [data.lng, data.lat]
			
			Model 'Pharmacy', 'find', next, searchData, null, lean: true
		(docs) ->
			data.pharmacy = docs
			
			View.ajaxResponse res, null, data
	], (err) ->
		error = err.message or err
		Logger.log 'info', "Error in lib/pharmacy/near: #{error}"
		View.ajaxResponse res, err