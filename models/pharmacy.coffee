mongoose = require 'mongoose'
ObjectId = mongoose.Schema.Types.ObjectId
Mixed = mongoose.Schema.Types.Mixed

schema = new mongoose.Schema
	_id:
		type: String
		required: true
	name:
		type: String
		required: true
	city:
		type: String
		required: true
	address:
		type: String
		required: true
	loc: [
		type: Number
	]
,
	collection: 'pharmacy'

schema.index
	loc: '2d'

module.exports = mongoose.model 'Pharmacy', schema