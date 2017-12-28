'use strict'

const BasicScheme = require('./auth/basic')
const BearerScheme = require('./auth/bearer')

exports.register = (server, options, next) => {
  server.auth.scheme(BasicScheme.name, BasicScheme.implementation)
  server.auth.scheme(BearerScheme.name, BearerScheme.implementation)
  next()
}

exports.register.attributes = {
  name: 'central-services-auth'
}

exports.UnauthorizedError = require('./auth/unauthorized')
