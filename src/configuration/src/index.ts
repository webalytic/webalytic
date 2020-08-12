import { ServerCredentials } from 'grpc'
import * as dotenv from 'dotenv'
import createLogger from '@webalytic/ms-tools/lib/logger'

import createServer from './server'

function main() {
  dotenv.config()

  const logger = createLogger('geoip')
  const server = createServer()

  const port = +(process.env.CONFIGURATION_PORT || 50051)
  const address = `0.0.0.0:${port}`

  server.bind(address, ServerCredentials.createInsecure())
  server.start()

  logger.info(`Start grpc server on ${address}`)
}

main()
