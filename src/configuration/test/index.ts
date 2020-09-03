/* eslint-disable global-require */
import { Server } from 'grpc'
import createInfra, { InfraContainers } from './before/createInfra'
import createServer from '../src'

let infra: InfraContainers
let server: Server

describe('Configuration', () => {
  before(async () => {
    infra = await createInfra()
    server = createServer()
  })

  after(async () => {
    await Promise.all([
      infra.postgres.stop(),
      new Promise((resolve) =>
        server.tryShutdown(() =>
          resolve()))
    ])
  })

  require('./services/ResourceService')
  require('./services/CustomDefinitionService')
})
