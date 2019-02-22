'use strict'

const Test = require('tape')
const Sinon = require('sinon')
const Basic = require('../../src/auth/basic')
const UnauthorizedError = require('../../src/auth/unauthorized')
const InvalidAuthorizationError = require('../../src/auth/invalid-authorization')
const Encoding = require('@mojaloop/central-services-shared').Encoding

let authenticate = (request, reply, options = {}) => {
  return Basic.authenticate(options)(request, reply)
}

let validRequest = (username = 'username', password = 'password') => {
  return {
    headers: {
      authorization: 'Basic ' + Encoding.toBase64(username + ':' + password)
    }
  }
}

Test('Basic scheme', schemeTest => {
  schemeTest.test('implementation should', implementationTest => {
    implementationTest.test('return scheme with authenticate method', test => {
      let result = Basic.implementation()

      test.ok(result.authenticate)
      test.equal(typeof result.authenticate, 'function')
      test.end()
    })
    implementationTest.end()
  })

  schemeTest.test('authenticate should', authenticateTest => {
    authenticateTest.test('reply with Unauthorized if request authorization header missing', test => {
      const request = { headers: {} }
      const reply = (e) => {
        test.ok(e instanceof UnauthorizedError)
        test.equal(e.message, 'Missing authorization')
        test.equal(e.scheme, 'Basic')
        test.end()
      }

      authenticate(request, reply)
    })

    authenticateTest.test('reply with InvalidAuthorization if authorization does not have 2 parts', test => {
      const request = {
        headers: {
          authorization: 'Basic'
        }
      }

      const reply = (e) => {
        test.ok(e instanceof InvalidAuthorizationError)
        test.equal(e.message, 'Bad HTTP authorization header')
        test.end()
      }

      authenticate(request, reply)
    })

    authenticateTest.test('reply with InvalidAuthorization if credentials does not contain colon', test => {
      let request = {
        headers: {
          authorization: 'Basic somebadvalue'
        }
      }
      let reply = (e) => {
        test.ok(e instanceof InvalidAuthorizationError)
        test.equal(e.message, 'Bad HTTP authorization header')
        test.end()
      }

      authenticate(request, reply)
    })

    authenticateTest.test('reply with Unauthorized if credentials does not contain username', test => {
      let request = {
        headers: {
          authorization: 'Basic ' + Encoding.toBase64(':nousername')
        }
      }

      let reply = (e) => {
        test.ok(e instanceof UnauthorizedError)
        test.equal(e.message, 'Missing username')
        test.end()
      }

      authenticate(request, reply)
    })

    authenticateTest.test('call options validate with username and password and continue reply with returned credentials', test => {
      let validateStub = Sinon.stub()
      let credentials = { user: 'Joe Schmoe' }
      validateStub.yields(null, true, credentials)
      let options = { validate: validateStub }
      let username = 'username'
      let password = 'password'
      let request = validRequest(username, password)

      let reply = {
        continue: (creds) => {
          test.ok(validateStub.calledWith(request, username, password))
          test.equal(creds.credentials, credentials)
          test.end()
        }
      }

      authenticate(request, reply, options)
    })

    authenticateTest.test('reply with error if validate returns error', test => {
      let error = new Error()
      let validateStub = Sinon.stub()
      validateStub.yields(error)
      let request = validRequest()

      let reply = (e) => {
        test.equal(e, error)
        test.end()
      }

      authenticate(request, reply, { validate: validateStub })
    })

    authenticateTest.test('reply with Unauthorized if validate returns invalid', test => {
      let validateStub = Sinon.stub()
      validateStub.yields(null, false)

      let reply = (e) => {
        test.ok(e instanceof UnauthorizedError)
        test.equal(e.message, 'Bad username or password')
        test.end()
      }

      authenticate(validRequest(), reply, { validate: validateStub })
    })

    authenticateTest.end()
  })

  schemeTest.end()
})
