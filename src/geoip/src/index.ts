import * as dotenv from 'dotenv'
import createLogger from '@webalytic/ms-tools/lib/logger'

import { createServer } from '@webalytic/ms-tools/lib/grpc-clients/geoip/GeoipService'
import GeoipService from 'GeoipService'

dotenv.config()
const logger = createLogger('geoip')

const address = createServer(new GeoipService())

logger.info(`Start grpc server on ${address}`)
