_ = require 'lodash'
async = require 'async'

Model = require '../../lib/model'

View = require '../../lib/view'

exports.index = (req, res) ->
	View.render 'user/main/index', res