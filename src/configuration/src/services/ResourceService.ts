import { ServerUnaryCall, Metadata } from 'grpc'
import {
  ResourceService,
  ListResourcesRequest,
  ListResourcesResponse,
  CreateResourceRequest,
  CreateResourceResponse,
  UpdateResourceRequest,
  UpdateResourceResponse
} from '@shared/configuration/resource_service'

import { Dependencies } from '../container'
import Resource from '../entities/Resource/Resource'
import ResourceRepository from '../infra/ResourceRepository'

type CreateResourceCall = ServerUnaryCall<CreateResourceRequest>
type CreateResourceCallback = ResourceService.CreateResourceCallback

type ListResourcesCall = ServerUnaryCall<ListResourcesRequest>
type ListResourcesCallback = ResourceService.ListResourcesCallback

type UpdateResourceCall = ServerUnaryCall<UpdateResourceRequest>
type UpdateResourceCallback = ResourceService.UpdateResourceCallback

export default class {
  private resourceRepository: ResourceRepository

  constructor(deps: Dependencies) {
    this.resourceRepository = deps.resourceRepository
  }

  public async ListResources(
    call: ListResourcesCall,
    callback: ListResourcesCallback
  ): Promise<void> {
    let res: ListResourcesResponse = null
    let err = null

    try {
      const [data, count] = await Promise.all([
        this.resourceRepository.findAll(call.request),
        this.resourceRepository.count(call.request.filter)
      ])

      res = new ListResourcesResponse({
        count,
        resources: data.map((x) =>
          x.props)
      })
    } catch (error) {
      err = this.handleError(error)
    }

    callback(err, res)
  }

  async CreateResource(call: CreateResourceCall, callback: CreateResourceCallback): Promise<void> {
    let res: CreateResourceResponse = null
    let err = null

    try {
      const instance = Resource.create(call.request.data)
      await this.resourceRepository.save(instance)

      res = new CreateResourceResponse({ instance: instance.props })
    } catch (error) {
      err = this.handleError(error)
    }

    callback(err, res)
  }

  async UpdateResource(
    call: UpdateResourceCall,
    callback: UpdateResourceCallback
  ): Promise<void> {
    let res: UpdateResourceResponse = null
    let err = null
    try {
      const instance = await this.resourceRepository.findOne({ id: call.request.id })
      if (!instance) throw new Error('NotFoundError')

      instance.update(call.request.data)

      res = new UpdateResourceResponse({ instance: instance.props })
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
