_ = require 'lodash'
async = require 'async'

Model = require '../../lib/model'

View = require '../../lib/view'

exports.index = (req, res) ->
	console.log ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
	View.render 'user/main/index', res