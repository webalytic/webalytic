/* eslint-disable camelcase */
import { ServerUnaryCall, Metadata } from 'grpc'
import {
  CustomDefinitionService,
  ListCustomDefinitionsRequest,
  ListCustomDefinitionsResponse,
  CreateCustomDefinitionRequest,
  CreateCustomDefinitionResponse,
  UpdateCustomDefinitionRequest,
  UpdateCustomDefinitionResponse
} from '@webalytic/ms-tools/shared/configuration/custom_definition_service'

import { custom_definition } from '@webalytic/ms-tools/shared/configuration/custom_definition'
import { ValidationError } from '@webalytic/ms-tools/lib/errors'

import { Dependencies } from '../container'
import CustomDefinition from '../entities/CustomDefinition/CustomDefinition'
import CustomDefinitionRepository from '../infra/CustomDefinition/CustomDefinitionRepository'
import ResourceRepository from '../infra/Resource/ResourceRepository'

type CreateCustomDefinitionCall = ServerUnaryCall<CreateCustomDefinitionRequest>
type CreateCustomDefinitionCallback = CustomDefinitionService.CreateCustomDefinitionCallback

type ListCustomDefinitionsCall = ServerUnaryCall<ListCustomDefinitionsRequest>
type ListCustomDefinitionsCallback = CustomDefinitionService.ListCustomDefinitionsCallback

type UpdateCustomDefinitionCall = ServerUnaryCall<UpdateCustomDefinitionRequest>
type UpdateCustomDefinitionCallback = CustomDefinitionService.UpdateCustomDefinitionCallback

export default class {
  private customDefinitionRepository: CustomDefinitionRepository

  private resourceRepository: ResourceRepository

  constructor(deps: Dependencies) {
    this.customDefinitionRepository = deps.customDefinitionRepository

    this.resourceRepository = deps.resourceRepository
  }

  public async ListCustomDefinitions(
    call: ListCustomDefinitionsCall,
    callback: ListCustomDefinitionsCallback
  ): Promise<void> {
    let res: ListCustomDefinitionsResponse = null
    let err = null

    try {
      const [data, count] = await Promise.all([
        this.customDefinitionRepository.findAll(call.request),
        this.customDefinitionRepository.count(call.request.filter)
      ])

      res = new ListCustomDefinitionsResponse({
        count,
        customDefinitions: data.map((x) =>
          x.props)
      })
    } catch (error) {
      err = this.handleError(error)
    }

    callback(err, res)
  }

  async CreateCustomDefinition(
    call: CreateCustomDefinitionCall,
    callback: CreateCustomDefinitionCallback
  ): Promise<void> {
    let res: CreateCustomDefinitionResponse = null
    let err = null

    try {
      const { data } = call.request

      await this.testResourceExistsInvariant(data.resourceId)
      const index = await this.getNextIndex(data.resourceId, data.type)

      const instance = CustomDefinition.create({
        ...call.request.data,
        index
      })
      await this.customDefinitionRepository.save(instance)

      res = new CreateCustomDefinitionResponse({ instance: instance.props })
    } catch (error) {
      err = this.handleError(error)
    }

    callback(err, res)
  }

  private async testResourceExistsInvariant(resourceId: string): Promise<void> {
    const resource = await this.resourceRepository.findOne({ id: resourceId })
    if (!resource) {
      throw new ValidationError([{
        type: 'notFound',
        field: 'resourceId',
        message: 'Resource not found'
      }])
    }
  }

  private async getNextIndex(resourceId: string, type: custom_definition.CustomDefinitionType): Promise<number> {
    const INDEX_LIMIT = 200

    const [customDefinition] = await this.customDefinitionRepository.findAll({
      filter: {
        resourceId,
        type
      },
      limit: 1,
      orderBy: 'index:desc'
    })

    const nextIndex = customDefinition ? customDefinition.props.index + 1 : 1
    if (nextIndex >= INDEX_LIMIT) {
      throw new ValidationError([{
        type: 'max',
        field: 'index',
        message: 'Index should be less than 200'
      }])
    }
    return nextIndex
  }

  async UpdateCustomDefinition(
    call: UpdateCustomDefinitionCall,
    callback: UpdateCustomDefinitionCallback
  ): Promise<void> {
    let res: UpdateCustomDefinitionResponse = null
    let err = null
    try {
      const instance = await this.customDefinitionRepository.findOne({ id: call.request.id })
      if (!instance) throw new Error('NotFoundError')

      instance.update(call.request.data)
      await this.customDefinitionRepository.save(instance)

      res = new UpdateCustomDefinitionResponse({ instance: instance.props })
    } catch (error) {
      err = this.handleError(error)
    }

    callback(err, res)
  }

  private handleError(error: any): any {
    const metadata = new Metadata()
    if (error.details) metadata.set('details', JSON.stringify(error.details))

    return {
      code: error.code,
      message: error.message,
      status: error.status,
      metadata
    } as any
  }
}
