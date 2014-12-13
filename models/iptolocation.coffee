mongoose = require 'mongoose'
ObjectId = mongoose.Schema.Types.ObjectId
Mixed = mongoose.Schema.Types.Mixed

schema = new mongoose.Schema
	_id:
		type: ObjectId
		required: true
	longipstart:
		type: Number
		index: true
		required: true
	longipend:
		type: Number
		index: true
		required: true
	code:
		type: String
		required: true
	name:
		type: String
		required: true
,
	collection: 'iptolocation'

module.exports = mongoose.model 'Iptolocation', schema