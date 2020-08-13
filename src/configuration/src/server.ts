import { Server, loadPackageDefinition } from 'grpc'

import * as protoLoader from '@grpc/proto-loader'
import { Dependencies } from './container'

export default (deps: Dependencies): Server => {
  const packageDefinition = protoLoader.loadSync([
    `${__dirname}/../shared/configuration/resource.proto`,
    `${__dirname}/../shared/configuration/resource_service.proto`
  ])

  const protoDescriptor: any = loadPackageDefinition(packageDefinition)

  const server: Server = new Server({
    'grpc.max_receive_message_length': -1,
    'grpc.max_send_message_length': -1
  })

  server.addService(
    protoDescriptor.ResourceService.service,
    deps.resourceService
  )

  return server
}

export function getAddress(): string {
  const port = +(process.env.CONFIGURATION_PORT || 50051)
  const address = `0.0.0.0:${port}`

  return address
}
