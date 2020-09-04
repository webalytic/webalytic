import { ServerCredentials, Server } from 'grpc'
import dotenv from 'dotenv'
import createLogger from '@webalytic/ms-tools/lib/logger'

import {
  createService as createResourceService,
  getAddresInfo
} from '@webalytic/ms-tools/lib/grpc/configuration/ResourceService'

import {
  createService as createCustomDefinitionService
} from '@webalytic/ms-tools/lib/grpc/configuration/CustomDefinitionService'

import createContainer from './container'

export default function createServer(): Server {
  dotenv.config()

  const container = createContainer()

  const logger = createLogger('configuration')

  const server: Server = new Server({
    'grpc.max_receive_message_length': -1,
    'grpc.max_send_message_length': -1
  })

  server.addService(createResourceService(), container.cradle.resourceService)
  server.addService(createCustomDefinitionService(), container.cradle.customDefinitionService)

  const addresInfo = getAddresInfo()
  const host = `0.0.0.0:${addresInfo.port}`

  server.bind(host, ServerCredentials.createInsecure())
  server.start()

  logger.info(`Start grpc server on ${host}`)

  return server
}

if (require.main === module) createServer()
