express = require 'express'

Main = require './user/main'
Advices = require './user/advices'

Router = express.Router()

#

Router.get '/', Main.index

#

Router.get '/advices', Advices.index

#

exports.Router = Router