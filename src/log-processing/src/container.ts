import {
  createContainer, InjectionMode, AwilixContainer, asClass, asValue, asFunction
} from 'awilix'

import EventProducer from '@webalytic/ms-tools/lib/infra/EventProducer'
import EventConsumer from '@webalytic/ms-tools/lib/infra/EventConsumer'

import Service from './Service'

import Parser from './utils/Parser'
import SessionRepository from './infra/SessionRepository'
import createSubscribers, { SubscribersManager } from './subscribers'

export interface Dependencies {
  // ** Services
  service: Service
  parser: Parser
  sessionRepository: SessionRepository
  eventProducer: EventProducer
  eventConsumer: EventConsumer
  subscribers: SubscribersManager
}

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

export default (): AwilixContainer<Dependencies> => {
  // Create the container
  const container = createContainer<Dependencies>({ injectionMode: InjectionMode.PROXY })

  container.register({
    parser: asClass(Parser).singleton(),
    sessionRepository: asClass(SessionRepository).singleton(),
    eventProducer: asValue(eventProducer),
    eventConsumer: asValue(eventConsumer)
  })

  container.register({
    service: asClass(Service).singleton()
  })

  container.register({
    subscribers: asFunction(createSubscribers).singleton()
  })

  return container
}
