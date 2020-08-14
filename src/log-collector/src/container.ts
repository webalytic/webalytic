import {
  createContainer, InjectionMode, AwilixContainer, asClass, asValue
} from 'awilix'

import EventProducer from '@webalytic/ms-tools/lib/infra/EventProducer'
import { ResourceService } from '@webalytic/ms-tools/shared/configuration/resource_service'
import {
  createClient as createResourceServiceClient
} from '@webalytic/ms-tools/lib/grpc/configuration/ResourceService'

import MainController from './controllers/MainController'
import SdkController from './controllers/SdkController'
import LogCollectorService from './services/LogCollectorService'

export interface Dependencies {
    // ** External services
    resourceService: ResourceService

    // ** Events
    eventProducer: EventProducer

    // ** MicrosService Clients
    logCollectorService: LogCollectorService

    // ** Controllers
    mainController: MainController
    sdkController: SdkController
  }

export default (): AwilixContainer<Dependencies> => {
  // Create the container
  const container = createContainer<Dependencies>({ injectionMode: InjectionMode.PROXY })

  container.register({
    resourceService: asValue(createResourceServiceClient())
  })

  container.register({
    eventProducer: asValue(new EventProducer({
      server: process.env.NATS_SERVER || 'nats://localhost:4222',
      cluster: process.env.NATS_CLUSTER || 'webalytic',
      clientId: `log-collector${Math.floor(Math.random() * 999999)}`
    }))
  })

  container.register({
    logCollectorService: asClass(LogCollectorService).singleton()
  })

  container.register({
    mainController: asClass(MainController).singleton(),
    sdkController: asClass(SdkController).singleton()
  })

  return container
}
