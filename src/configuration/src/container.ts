import {
  createContainer, InjectionMode, AwilixContainer, asClass, asValue, asFunction
} from 'awilix'

import { createSequelize } from '@webalytic/ms-tools/lib/datasources'
import { Sequelize } from 'sequelize/types'

import createResourceModel, { ResourceModelStatic } from './infra/models/ResourceModel'
import ResourceMapper from './infra/ResourceMapper'
import ResourceRepository from './infra/ResourceRepository'

import ResourceService from './services/ResourceService'

export interface Dependencies {
  // ** DataSources
  sequelize: Sequelize

  // ** Sequelize Models
  ResourceModel: ResourceModelStatic

  // ** Repositories and Mappers
  resourceMapper: ResourceMapper
  resourceRepository: ResourceRepository

  // ** Services
  resourceService: ResourceService
}

export default (): AwilixContainer<Dependencies> => {
  // Create the container
  const container = createContainer<Dependencies>({ injectionMode: InjectionMode.PROXY })

  // ** DataSources
  container.register({
    sequelize: asValue(createSequelize())
  })

  // ** Sequelize Models
  container.register({
    ResourceModel: asFunction(createResourceModel).singleton()
  })

  // ** Repositories and Mappers
  container.register({
    resourceRepository: asClass(ResourceRepository).singleton(),
    resourceMapper: asClass(ResourceMapper).singleton()
  })

  // ** Services
  container.register({
    resourceService: asClass(ResourceService).singleton()
  })

  return container
}
