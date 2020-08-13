import { Server, ServerCredentials } from 'grpc'
import { AwilixContainer } from 'awilix'
import createServer, { getAddress } from '../../src/server'
import { Dependencies } from '../../src/container'

export default (container: AwilixContainer<Dependencies>): Server => {
  const server = container.build(createServer)

  server.bind(getAddress(), ServerCredentials.createInsecure())
  server.start()
  return server
}
