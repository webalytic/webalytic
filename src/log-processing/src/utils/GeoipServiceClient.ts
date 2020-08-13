import { credentials, loadPackageDefinition, Client } from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

import { Geoip } from '@shared/geoip/geoip'

const packageDefinition = protoLoader.loadSync([
  `${__dirname}/../../shared/geoip/geoip.proto`
])

const protoDescriptor: any = loadPackageDefinition(packageDefinition)

export default (): Geoip => {
  const host: string = process.env.GEOIP_HOST || 'localhost'
  const port: number = +(process.env.GEOIP_PORT || 50051)

  const client: Client = new protoDescriptor.Geoip(`${host}:${port}`, credentials.createInsecure())

  const rpcImpl = (method, requestData, callback) => {
    client.makeUnaryRequest(
      `/Geoip/${method.name}`,
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

  return Geoip.create(rpcImpl, false, false)
}
