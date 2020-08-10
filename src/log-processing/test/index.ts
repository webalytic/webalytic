/* eslint-disable global-require */
import * as dotenv from 'dotenv'

process.env.NODE_ENV = 'test'
dotenv.config()

describe('Integrations tests', () => {
  // Todo: start nats, redis, send and check events
})
