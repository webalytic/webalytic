import { Server, ServerCredentials } from 'grpc'
import createServer, { getAddress } from '../../src/server'

export default (): Server => {
  const server = createServer()

  server.bind(getAddress(), ServerCredentials.createInsecure())
  server.start()
  return server
}
