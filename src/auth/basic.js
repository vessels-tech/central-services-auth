'use strict'

const UnauthorizedError = require('./unauthorized')
const InvalidAuthorizationError = require('./invalid-authorization')
const Encoding = require('@mojaloop/central-services-shared').Encoding

exports.name = 'basic'

exports.authenticate = ({validate}) => {
  return (request, reply) => {
    const headers = request.headers
    const authorization = headers.authorization

    if (!authorization) {
      return reply(new UnauthorizedError('Missing authorization'))
    }

    const parts = authorization.split(' ')
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'basic') {
      return reply(new InvalidAuthorizationError())
    }

    const credentials = Encoding.fromBase64(parts[1])
    const credentialsParts = credentials.split(':')
    if (credentialsParts.length !== 2) {
      return reply(new InvalidAuthorizationError())
    }

    const username = credentialsParts[0]
    const password = credentialsParts[1]

    if (!username) {
      return reply(new UnauthorizedError('Missing username'))
    }

    validate(request, username, password, (err, isValid, credentials) => {
      credentials = credentials || null
      if (err) {
        return reply(err)
      }

      if (!isValid) {
        return reply(new UnauthorizedError('Bad username or password'))
      }

      return reply.continue({credentials: credentials})
    })
  }
}

exports.implementation = (server, options = {}) => {
  return {
    authenticate: this.authenticate(options)
  }
}
