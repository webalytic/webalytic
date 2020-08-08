import { Server, ServerCredentials } from 'grpc'
import { Geoip, GeoipService } from './service'

export default (): string => {
  const port = +(process.env.GEOIP_PORT || 50051)
  const server: Server = new Server({
    'grpc.max_receive_message_length': -1,
    'grpc.max_send_message_length': -1
  })

  const address = `0.0.0.0:${port}`
  server.addService(GeoipService, new Geoip())
  server.bind(address, ServerCredentials.createInsecure())
  server.start()

  return address
}
