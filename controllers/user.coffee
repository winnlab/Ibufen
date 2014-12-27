express = require 'express'

Main = require './user/main'
Advices = require './user/advices'

Pharmacy = require '../lib/pharmacy'
Iptolocation = require '../lib/iptolocation'

Router = express.Router()

#

Router.get '/', Main.index
Router.get '/video', Main.index

#

Router.get '/advices', Advices.index

#

Router.post '/pharmacy_near', Pharmacy.near

#

# Router.get '/pharmacy_findAll', Pharmacy.findAll

#

Router.get '/iptolocation_findAll', Iptolocation.findAll

#

exports.Router = Router