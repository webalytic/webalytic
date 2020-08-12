import {
  sendUnaryData, ServerUnaryCall
} from 'grpc'

import {
  ResourceServiceService as IResourceService,
  IResourceServiceServer
} from '@shared/configuration/resource_service_grpc_pb'

import {
  ListResourcesRequest,
  ListResourcesResponse,
  CreateResourceRequest,
  CreateResourceResponse,
  UpdateResourceRequest,
  UpdateResourceResponse
} from '@shared/configuration/resource_service_pb'

import { ResourceProps } from '@shared/configuration/resource_pb'

type ListResourcesCall = ServerUnaryCall<ListResourcesRequest>
type ListResourcesCallback = sendUnaryData<ListResourcesResponse>

class ResourceService implements IResourceServiceServer {
  // *
  // * ListResources
  // *
  public listResources(call: ListResourcesCall, callback: ListResourcesCallback): void {
    // const req: ListResourcesRequest = call.request
    const res: ListResourcesResponse = new ListResourcesResponse()
    res.setCount(0)
    // Todo: implement listResources

    callback(null, res)
  }

  // *
  // * CreateResources
  // *
  public createResource(
    call: ServerUnaryCall<CreateResourceRequest>,
    callback: sendUnaryData<CreateResourceResponse>
  ): void {
    // const req: ListResourcesRequest = call.request
    const res: CreateResourceResponse = new CreateResourceResponse()

    // Todo: implement createResource

    callback(null, res)
  }

  // *
  // * UpdateResource
  // *
  public updateResource(
    call: ServerUnaryCall<UpdateResourceRequest>,
    callback: sendUnaryData<UpdateResourceResponse>
  ): void {
    // const req: ListResourcesRequest = call.request
    const res: UpdateResourceResponse = new UpdateResourceResponse()

    // Todo: implement createResource

    callback(null, res)
  }
}

export {
  ResourceService,
  IResourceService
}
