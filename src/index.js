'use strict'

const BasicScheme = require('./auth/basic')
const BearerScheme = require('./auth/bearer')

exports.plugin = {
  name: 'central-services-auth',
  register: function (server) {
    server.auth.scheme(BasicScheme.name, BasicScheme.implementation)
    server.auth.scheme(BearerScheme.name, BearerScheme.implementation)
  }
}

exports.UnauthorizedError = require('./auth/unauthorized')
