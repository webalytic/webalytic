/* eslint-disable global-require */
import dotenv from 'dotenv'
import { StartedTestContainer } from 'testcontainers'

import createNatsStreaming from './before/createNatsStreaming'
import createRedis from './before/createRedis'

let natsStreamingContainer: StartedTestContainer
let redisContainer: StartedTestContainer

process.env.NODE_ENV = 'test'

dotenv.config()

describe('Log processing', () => {
  before(async () => {
    natsStreamingContainer = await createNatsStreaming()
    redisContainer = await createRedis()
  })

  after(async () => {
    await Promise.all([
      natsStreamingContainer.stop(),
      redisContainer.stop()
    ])
  })

  describe('Subscribers', () => {
    require('./subscribers/AfterLogCollected')
  })
})
