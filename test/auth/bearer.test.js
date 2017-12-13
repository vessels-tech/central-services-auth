'use strict'

const Test = require('tape')
const Sinon = require('sinon')
const Bearer = require('../../src/auth/bearer')
const UnauthorizedError = require('../../src/auth/unauthorized')
const InvalidAuthorizationError = require('../../src/auth/invalid-authorization')

const authenticate = (request, reply, options = {}) => {
    return Bearer.authenticate(options)(request, reply)
}

const validRequest = (token = 'token') => {
    return {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
}

Test('Bearer scheme', schemeTest => {
    schemeTest.test('implementation should', implementationTest => {
        implementationTest.test('return scheme with authenticate method', test => {
            const result = Bearer.implementation()

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
                test.equal(e.scheme, 'Bearer')
                test.end()
            }

            authenticate(request, reply)
        })

        authenticateTest.test('reply with InvalidAuthorization if authorization does not have 2 parts', test => {
            const request = {
                headers: {
                    authorization: 'Bearer'
                }
            }

            const reply = (e) => {
                test.ok(e instanceof InvalidAuthorizationError)
                test.equal(e.message, 'Bad HTTP authorization header')
                test.end()
            }

            authenticate(request, reply)
        })

        authenticateTest.test('reply with InvalidAuthorization if token is empty', test => {
            const request = {
                headers: {
                    authorization: 'Bearer '
                }
            }

            const reply = (e) => {
                test.ok(e instanceof UnauthorizedError)
                test.equal(e.message, 'Missing token')
                test.end()
            }

            authenticate(request, reply)
        })

        authenticateTest.test('call options validate with token and continue reply with returned credentials', test => {
            const validateStub = Sinon.stub()
            const credentials = { user: 'Joe Schmoe' }
            validateStub.yields(null, true, credentials)
            const options = { validate: validateStub }
            const token = 'token'
            const request = validRequest(token)

            const reply = {
                continue: (creds) => {
                    test.ok(validateStub.calledWith(request, token))
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
                test.equal(e.message, 'Invalid token')
                test.end()
            }

            authenticate(validRequest(), reply, { validate: validateStub })
        })

        authenticateTest.end()
    })

    schemeTest.end()
})
