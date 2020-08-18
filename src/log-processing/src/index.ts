/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
import dotenv from 'dotenv'
import createLogger from '@webalytic/ms-tools/lib/logger'
import createContainer from './container'

dotenv.config()

const container = createContainer()
const logger = createLogger('log-processing')

const { eventProducer, eventConsumer, subscribers } = container.cradle

async function main() {
  await eventConsumer.init()
  logger.info('EventConsumer init')
  await eventProducer.init()
  logger.info('EventProducer init')

  await subscribers.init()
  logger.info('Subscribers init')

  process.on('SIGINT', async () => {
    logger.info('SIGINT signal received.')

    await eventConsumer.destroy()
    await eventProducer.destroy()

    logger.info('Processing closed')
    process.exit(0)
  })
}

main()
