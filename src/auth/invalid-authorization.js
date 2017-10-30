'use strict'

const Shared = require('@mojaloop/central-services-shared')
const BaseError = Shared.BaseError
const ErrorCategory = Shared.ErrorCategory

class InvalidAuthorizationError extends BaseError {
  constructor () {
    super(ErrorCategory.BAD_REQUEST, 'Bad HTTP authorization header')
  }
}

module.exports = InvalidAuthorizationError
