import {
  sendUnaryData, ServerUnaryCall
} from 'grpc'

import { ConfigurationService, IConfigurationServer } from '@shared/services/configuration/configuration_grpc_pb'
import {
  ListResourcesRequest,
  ListResourcesResponse,
  CreateResourceRequest,
  CreateResourceResponse,
  UpdateResourceRequest,
  UpdateResourceResponse
} from '@shared/services/configuration/configuration_pb'

class Configuration implements IConfigurationServer {
  public listResources(
    call: ServerUnaryCall<ListResourcesRequest>,
    callback: sendUnaryData<ListResourcesResponse>
  ): void {
    // const req: ListResourcesRequest = call.request
    const res: ListResourcesResponse = new ListResourcesResponse()

    callback(null, res)
  }

  public createResource(
    call: ServerUnaryCall<CreateResourceRequest>,
    callback: sendUnaryData<CreateResourceResponse>
  ): void {
    // const req: ListResourcesRequest = call.request
    const res: CreateResourceResponse = new CreateResourceResponse()

    callback(null, res)
  }

  public updateResource(
    call: ServerUnaryCall<UpdateResourceRequest>,
    callback: sendUnaryData<UpdateResourceResponse>
  ): void {
    // const req: ListResourcesRequest = call.request
    const res: UpdateResourceResponse = new UpdateResourceResponse()

    callback(null, res)
  }
}

export {
  Configuration,
  ConfigurationService
}
