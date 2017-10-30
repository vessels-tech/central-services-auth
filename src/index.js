'use strict'

const BasicScheme = require('./auth/basic')

exports.register = (server, options, next) => {
  server.auth.scheme(BasicScheme.name, BasicScheme.implementation)
  next()
}

exports.register.attributes = {
  name: 'central-services-auth'
}
