import { ServerCredentials } from 'grpc'
import dotenv from 'dotenv'
import createLogger from '@webalytic/ms-tools/lib/logger'

import { createServer, getAddresInfo } from '@webalytic/ms-tools/lib/grpc/geoip/GeoipService'
import GeoipService from 'GeoipService'

dotenv.config()
const logger = createLogger('geoip')

const server = createServer(new GeoipService())

const addresInfo = getAddresInfo()
const host = `0.0.0.0:${addresInfo.port}`

server.bind(host, ServerCredentials.createInsecure())
server.start()

logger.info(`Start grpc server on ${host}`)
