mongoose = require 'mongoose'
async = require 'async'

opts =
	server: { auto_reconnect: true, primary:null, poolSize: 50 },
	user: 'admin'
	pass: 'UCLZk2ddmQa8CsH'
	host: 'localhost'
	port: '27017'
	database: 'Ibufen'
	primary: null

connString = 'mongodb://' + opts.user + ':' + opts.pass + '@' + opts.host + ':' + opts.port + '/' + opts.database + '?auto_reconnect=true'

mongoose.connect connString, opts

mongoose.connection.on 'error', (err) ->
	console.log 'MongoDB connection error:', err