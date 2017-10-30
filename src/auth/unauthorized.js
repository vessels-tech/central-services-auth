'use strict'

const Shared = require('@mojaloop/central-services-shared')
const BaseError = Shared.BaseError
const ErrorCategory = Shared.ErrorCategory

class UnauthorizedError extends BaseError {
  constructor (message = 'Unauthorized', scheme = 'Basic') {
    super(ErrorCategory.UNAUTHORIZED, message)
    this.scheme = scheme
    this.headers['WWW-Authenticate'] = `${scheme} error="${message}"`
  }
}

module.exports = UnauthorizedError
