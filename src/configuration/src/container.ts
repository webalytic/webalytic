import {
  createContainer, InjectionMode, AwilixContainer, asClass, asValue, asFunction
} from 'awilix'

import { createSequelize } from '@webalytic/ms-tools/lib/datasources'
import { Sequelize } from 'sequelize/types'

import createResourceModel, { ResourceModelStatic } from './infra/Resource/ResourceModel'
import ResourceMapper from './infra/Resource/ResourceMapper'
import ResourceRepository from './infra/Resource/ResourceRepository'
import ResourceService from './services/ResourceService'

import createCustomDefinitionModel,
{ CustomDefinitionModelStatic } from './infra/CustomDefinition/CustomDefinitionModel'
import CustomDefinitionMapper from './infra/CustomDefinition/CustomDefinitionMapper'
import CustomDefinitionRepository from './infra/CustomDefinition/CustomDefinitionRepository'
import CustomDefinitionService from './services/CustomDefinitionService'

export interface Dependencies {
  // ** DataSources
  sequelize: Sequelize

  // ** Resources
  ResourceModel: ResourceModelStatic
  resourceMapper: ResourceMapper
  resourceRepository: ResourceRepository
  resourceService: ResourceService

  // ** Custom definition
  CustomDefinitionModel: CustomDefinitionModelStatic
  customDefinitionRepository: CustomDefinitionRepository
  customDefinitionMapper: CustomDefinitionMapper
  customDefinitionService: CustomDefinitionService
}

export default (): AwilixContainer<Dependencies> => {
  // Create the container
  const container = createContainer<Dependencies>({ injectionMode: InjectionMode.PROXY })

  // ** DataSources
  container.register({
    sequelize: asValue(createSequelize())
  })

  // ** Resources
  container.register({
    ResourceModel: asFunction(createResourceModel).singleton(),
    resourceRepository: asClass(ResourceRepository).singleton(),
    resourceMapper: asClass(ResourceMapper).singleton(),
    resourceService: asClass(ResourceService).singleton()
  })

  // ** Custom definition
  container.register({
    CustomDefinitionModel: asFunction(createCustomDefinitionModel).singleton(),
    customDefinitionRepository: asClass(CustomDefinitionRepository).singleton(),
    customDefinitionMapper: asClass(CustomDefinitionMapper).singleton(),
    customDefinitionService: asClass(CustomDefinitionService).singleton()
  })

  return container
}
