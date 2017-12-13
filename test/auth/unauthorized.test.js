'use strict'

const Test = require('tape')

const UnauthorizedError = require('../../src/auth/unauthorized')
const ErrorCategory = require('@mojaloop/central-services-shared').ErrorCategory

Test('UnauthorizedError test', errorTest => {
  errorTest.test('constructor should', ctorTest => {
    ctorTest.test('set defaults', test => {
      let error = new UnauthorizedError()
      test.equal(error.category, ErrorCategory.UNAUTHORIZED)
      test.equal(error.message, 'Unauthorized')
      test.equal(error.scheme, 'Basic')
      test.equal(error.payload.id, 'UnauthorizedError')
      test.equal(error.payload.message, 'Unauthorized')
      test.equal(error.headers['WWW-Authenticate'], 'Basic error="Unauthorized"')
      test.end()
    })

    ctorTest.test('set message and scheme', test => {
      const message = 'some message'
      const scheme = 'Bearer'
      let error = new UnauthorizedError(message, scheme)
      test.equal(error.scheme, scheme)
      test.equal(error.message, message)
      test.equal(error.payload.message, message)
      test.equal(error.headers['WWW-Authenticate'], `${scheme} error="${message}"`)
      test.end()
    })
    ctorTest.end()
  })
  errorTest.end()
})
