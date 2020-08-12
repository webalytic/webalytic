import { Server } from 'grpc'
import { ResourceService, IResourceService } from './services/ResourceService'

export default (): Server => {
  const server: Server = new Server({
    'grpc.max_receive_message_length': -1,
    'grpc.max_send_message_length': -1
  })

  server.addService(IResourceService, new ResourceService())

  return server
}
