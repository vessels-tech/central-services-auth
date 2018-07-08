'use strict'

const UnauthorizedError = require('./unauthorized')
const InvalidAuthorizationError = require('./invalid-authorization')

const authenticate = ({validate}) => {
  return function (request, reply) {
    const headers = request.headers
    const authorization = headers.authorization

    if (!authorization) {
      return reply(new UnauthorizedError('Missing authorization', 'Bearer'))
    }

    const parts = authorization.split(' ')
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return reply(new InvalidAuthorizationError())
    }

    const token = parts[1]
    if (!token) {
      return reply(new UnauthorizedError('Missing token', 'Bearer'))
    }

    validate(request, token, (err, isValid, credentials) => {
      credentials = credentials || null

      if (err) {
        return reply(err)
      }

      if (!isValid) {
        return reply(new UnauthorizedError('Invalid token', 'Bearer'))
      }

      return reply.continue({credentials: credentials})
    })
  }
}

module.exports = {
  authenticate,
  name: 'bearer',
  implementation: (server, options = {}) => {
    return {
      authenticate: authenticate(options)
    }
  }
}
