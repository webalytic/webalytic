import { AwilixContainer } from 'awilix'
import * as express from 'express'
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing'

import createContainer, { Dependencies } from '../../src/container'
import createApp from '../../src/app'
import createServer from '../../src/server'

type ApplicationWithContainer = {
  container: AwilixContainer<Dependencies>
  app: express.Application
  testClient: ApolloServerTestClient
}

export default (): ApplicationWithContainer => {
  const container = createContainer()
  const app = container.build(createApp)
  const server = createServer(app)

  return {
    container,
    app,
    testClient: createTestClient(server)
  }
}
