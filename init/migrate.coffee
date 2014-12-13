async = require 'async'

metaMigrate = require '../meta/migrate'
# pharmacy = require '../meta/pharmacy'
# iptolocation = require '../meta/iptolocation'

# Pharmacy = require '../lib/pharmacy'
# Iptolocation = require '../lib/iptolocation'

checkMigration = (migrate, callback) ->
	Model = require '../models/' + migrate.modelName

	async.each migrate.data, (data, next) ->
		Model.findByIdAndUpdate data._id, data, upsert: true, next
	, callback

exports.init = (callback)->
	console.time 'Info: Migration took'
	async.parallel
		core: (next) ->
			async.each metaMigrate, checkMigration, next
		# pharmacy: (next) ->
			# async.eachSeries pharmacy, Pharmacy.addPharmacy, next
		# iptolocation: (next) ->
			# async.eachSeries iptolocation, Iptolocation.addIptolocation, next
	, (err, results) ->
		console.timeEnd 'Info: Migration took'
		
		if err
			console.log err
			callback err
		else
			callback null