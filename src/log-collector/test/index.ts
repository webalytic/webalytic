/* eslint-disable global-require */
/* eslint-disable consistent-return */
import { StartedTestContainer } from 'testcontainers'

import createNatsStreaming from './before/createNatsStreaming'

let natsStreamingContainer: StartedTestContainer

describe('Log-collector', () => {
  before(async () => {
    natsStreamingContainer = await createNatsStreaming()
  })

  after(async () => {
    await natsStreamingContainer.stop()
  })

  require('./controllers/mainController')
  require('./controllers/sdkController')
})
