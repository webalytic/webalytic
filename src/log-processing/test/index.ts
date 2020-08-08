/* eslint-disable global-require */
import * as dotenv from 'dotenv'

process.env.NODE_ENV = 'test'
dotenv.config()

describe('Integrations tests', () => {
  require('./services/CollectorService')
  require('./api')
})
