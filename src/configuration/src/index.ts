import { ServerCredentials } from 'grpc'
import * as dotenv from 'dotenv'
import createLogger from '@webalytic/ms-tools/lib/logger'

import createServer, { getAddress } from './server'

function main() {
  dotenv.config()

  const logger = createLogger('geoip')
  const server = createServer()

  const address = getAddress()
  server.bind(address, ServerCredentials.createInsecure())
  server.start()

  logger.info(`Start grpc server on ${address}`)
}

main()
