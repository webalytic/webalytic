import {
  createContainer, InjectionMode, AwilixContainer, asClass, asValue, asFunction
} from 'awilix'

import EventProducer from '@webalytic/ms-tools/lib/infra/EventProducer'
import EventConsumer from '@webalytic/ms-tools/lib/infra/EventConsumer'

import { createRedis } from '@webalytic/ms-tools/lib/datasources'
import ConfigurationService from './services/ConfigurationService'
import LogProcessingService from './services/LogProcessingService'

import Parser from './utils/Parser'
import SessionRepository from './infra/SessionRepository'
import createSubscribers, { SubscribersManager } from './subscribers'

export interface Dependencies {
  // ** External services
  configurationService: ConfigurationService

  // ** Services
  logProcessingService: LogProcessingService

  // ** Utils
  parser: Parser

  // ** Infra
  sessionRepository: SessionRepository
  eventProducer: EventProducer
  eventConsumer: EventConsumer
  subscribers: SubscribersManager
  redis: any
}

export default (): AwilixContainer<Dependencies> => {
  const natsOpts = {
    server: process.env.NATS_SERVER || 'nats://localhost:4222',
    cluster: process.env.NATS_CLUSTER || 'webalytic'
  }

  const eventProducer = new EventProducer({
    ...natsOpts,
    clientId: `log-processing-producer-${Math.floor(Math.random() * 999999)}`
  })

  const eventConsumer = new EventConsumer({
    ...natsOpts,
    clientId: 'log-processing-consumer'
  })

  // Create the container
  const container = createContainer<Dependencies>({ injectionMode: InjectionMode.PROXY })

  container.register({
    redis: asValue(createRedis())
  })

  container.register({
    parser: asClass(Parser).singleton(),
    sessionRepository: asClass(SessionRepository).singleton(),
    eventProducer: asValue(eventProducer),
    eventConsumer: asValue(eventConsumer)
  })

  container.register({
    configurationService: asClass(ConfigurationService).singleton(),
    logProcessingService: asClass(LogProcessingService).singleton()
  })

  container.register({
    subscribers: asFunction(createSubscribers).singleton()
  })

  return container
}
