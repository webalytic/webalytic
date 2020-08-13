import dotenv from 'dotenv'
import cluster from 'cluster'
import { cpus } from 'os'
import { AddressInfo } from 'net'
import createLogger from '@webalytic/ms-tools/lib/logger'

import createSubscribers from './subscribers'

import createApp from '../src/api/app'
import createServer from '../src/api/server'

dotenv.config()

const numCPUs = cpus().length
const logger = createLogger('data-storage')

if (cluster.isMaster) {
  logger.info(`Master ${process.pid} is running`)

  // Fork workers.
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork()
  }

  cluster.on('exit', (worker) =>
    logger.info(`worker ${worker.process.pid} died`))

  const subscribers = createSubscribers()
  subscribers
    .onInit()
    .then(() => {
      logger.info('Init subscribers')
    })
} else {
  const app = createApp()
  createServer(app).then((server) => {
    const info: AddressInfo = server.address() as AddressInfo
    logger.info(`Start server on http://${info.address}:${info.port}, worker ${process.pid} started`)
  })
}
