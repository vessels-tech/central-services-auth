'use strict'

const Test = require('tape')
const Sinon = require('sinon')
const AuthModule = require('../src/index')
const BasicAuth = require('../src/auth/basic')
const BearerAuth = require('../src/auth/bearer')

Test('Auth module', moduleTest => {
  moduleTest.test('register should', registerTest => {
    registerTest.test('register basic auth scheme', test => {
      const schemeSpy = Sinon.spy()
      const server = {
        auth: {
          scheme: schemeSpy
        }
      }

      const next = () => {
        test.ok(schemeSpy.calledWith('basic', BasicAuth.implementation))
        test.end()
      }

      AuthModule.register(server, null, next)
    })

    registerTest.test('register bearer auth scheme', test => {
      const schemeSpy = Sinon.spy()
      const server = {
        auth: {
          scheme: schemeSpy
        }
      }

      const next = () => {
        test.ok(schemeSpy.calledWith('bearer', BearerAuth.implementation))
        test.end()
      }

      AuthModule.register(server, null, next)
    })

    registerTest.end()
  })

  moduleTest.test('name should be central-services-auth', test => {
    test.equal(AuthModule.register.attributes.name, 'central-services-auth')
    test.end()
  })

  moduleTest.end()
})
