import { ServerCredentials } from 'grpc'
import * as dotenv from 'dotenv'
import createLogger from '@webalytic/ms-tools/lib/logger'

import createServer, { getAddress } from './server'
import createContainer from './container'

function main() {
  dotenv.config()

  const container = createContainer()

  const logger = createLogger('configuration')
  const server = container.build(createServer)

  const address = getAddress()
  server.bind(address, ServerCredentials.createInsecure())
  server.start()

  logger.info(`Start grpc server on ${address}`)
}

main()
