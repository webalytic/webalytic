import { credentials, loadPackageDefinition, Client } from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

import { ResourceService } from '@shared/configuration/resource_service'
import { getAddress } from '../../src/server'

const packageDefinition = protoLoader.loadSync([
  `${__dirname}/../../shared/configuration/resource.proto`,
  `${__dirname}/../../shared/configuration/resource_service.proto`
])

const protoDescriptor: any = loadPackageDefinition(packageDefinition)

export default (): ResourceService => {
  const client: Client = new protoDescriptor.ResourceService(getAddress(), credentials.createInsecure())

  const rpcImpl = (method, requestData, callback) => {
    client.makeUnaryRequest(
      `/ResourceService/${method.name}`,
      (arg) =>
        arg,
      (arg) =>
        arg,
      requestData,
      null,
      {},
      callback
    )
  }

  return ResourceService.create(rpcImpl, false, false)
}
