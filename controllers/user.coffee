express = require 'express'

Main = require './user/main'
Advices = require './user/advices'

Pharmacy = require '../lib/pharmacy'

Router = express.Router()

#

Router.get '/', Main.index

#

Router.get '/advices', Advices.index

#

Router.post '/pharmacy_near', Pharmacy.near

#

Router.get '/pharmacy_findAll', Pharmacy.findAll

#

exports.Router = Router