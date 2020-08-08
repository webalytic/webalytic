import {
  createContainer, InjectionMode, AwilixContainer, asClass
} from 'awilix'

import MainController from './controllers/MainController'

export interface Dependencies {
    // ** Controllers
    mainController: MainController

  }

export default (): AwilixContainer<Dependencies> => {
  // Create the container
  const container = createContainer<Dependencies>({ injectionMode: InjectionMode.PROXY })

  container.register({
    mainController: asClass(MainController).singleton()

  })

  return container
}
