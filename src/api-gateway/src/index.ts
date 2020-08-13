import * as dotenv from 'dotenv'
import * as cluster from 'cluster'
import { cpus } from 'os'
import createLogger from '@webalytic/ms-tools/lib/logger'

import createContainer from './container'
import createApp from './app'
import createServer from './server'

dotenv.config()

const numCPUs = cpus().length
const logger = createLogger('api-gateway')

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
  const port = +(process.env.API_GATEWAY_PORT || 3000)
  const host = process.env.API_GATEWAY_HOST || '0.0.0.0'

  createServer(app)

  const server = app.listen(port, host, () => {
    logger.info(`Start server on http://${host}:${port}, worker ${process.pid} started`)
  })
}
