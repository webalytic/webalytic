import { Server, ServerCredentials } from 'grpc'
import { AwilixContainer } from 'awilix'

import {
  createServer,
  getAddresInfo
} from '@webalytic/ms-tools/lib/grpc-clients/configuration/ResourceService'

import { Dependencies } from '../../src/container'

export default (container: AwilixContainer<Dependencies>): Server => {
  const server = createServer(container.cradle.resourceService)

  const addressInfo = getAddresInfo()
  const host = `${addressInfo.address}:${addressInfo.port}`

  server.bind(host, ServerCredentials.createInsecure())
  server.start()

  return server
}
