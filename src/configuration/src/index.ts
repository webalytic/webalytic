import { ServerCredentials } from 'grpc'
import dotenv from 'dotenv'

import createLogger from '@webalytic/ms-tools/lib/logger'
import {
  createServer,
  getAddresInfo
} from '@webalytic/ms-tools/lib/grpc/configuration/ResourceService'

import createContainer from './container'

function main() {
  dotenv.config()

  const container = createContainer()

  const logger = createLogger('configuration')

  const server = createServer(container.cradle.resourceService)

  const addresInfo = getAddresInfo()
  const host = `0.0.0.0:${addresInfo.port}`

  server.bind(host, ServerCredentials.createInsecure())
  server.start()

  logger.info(`Start grpc server on ${host}`)
}

main()
