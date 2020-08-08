import * as dotenv from 'dotenv'
import createLogger from '@webalytic/ms-tools/lib/logger'

import createServer from './server'

dotenv.config()
const logger = createLogger('geoip')

const address = createServer()
logger.info(`Start grpc server on ${address}`)
