import * as dotenv from 'dotenv'
import * as cluster from 'cluster'
import { cpus } from 'os'
import createLogger from '@webalytic/ms-tools/lib/logger'

import { AddressInfo } from 'net'
import { Server } from 'http'
import createContainer from './container'
import createApp from './app'
import createServer from './server'

dotenv.config()

const numCPUs = cpus().length
const logger = createLogger('log-collector')

if (cluster.isMaster) {
  logger.info(`Master ${process.pid} is running`)

  // Fork workers.
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork()
  }

  cluster.on('exit', (worker) =>
    logger.info(`worker ${worker.process.pid} died`))
} else {
  const container = createContainer()
  const app = container.build(createApp)

  createServer(app).then((server: Server) => {
    const addressInfo: AddressInfo = server.address() as AddressInfo
    logger.info(`Start server on http://${addressInfo.address}:${addressInfo.port}, worker ${process.pid} started`)

    process.on('SIGINT', async () => {
      server.close(() => {
        logger.info('Server closed')
        process.exit(0)
      })
    })
  })
}
