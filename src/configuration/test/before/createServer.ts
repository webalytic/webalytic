import { Server, ServerCredentials } from 'grpc'
import createServer, { getAddress } from '../../src/server'
import createContainer from '../../src/container'

export default (): Server => {
  const container = createContainer()
  const server = container.build(createServer)

  server.bind(getAddress(), ServerCredentials.createInsecure())
  server.start()
  return server
}
