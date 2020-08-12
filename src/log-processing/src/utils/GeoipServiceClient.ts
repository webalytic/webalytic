/* eslint-disable consistent-return */
import { credentials, Metadata, ServiceError } from 'grpc'

import { GeoipClient } from '@shared/geoip/geoip_grpc_pb'
import { LookUpRequest, LookUpResponse } from '@shared/geoip/geoip_pb'
import { session } from '@shared/log-processing/seesion'

export default class GeoipServiceClient {
  private readonly client: GeoipClient

  constructor() {
    const host: string = process.env.GEOIP_HOST || 'localhost'
    const port: number = +(process.env.GEOIP_PORT || 50051)

    this.client = new GeoipClient(`${host}:${port}`, credentials.createInsecure())
  }

  public async lookup(ipAdress: string): Promise<session.GeoNetwork> {
    const param: LookUpRequest = new LookUpRequest()
    param.setIp(ipAdress)

    return new Promise((resolve, reject): void => {
      this.client.lookUp(param, new Metadata(), (err: ServiceError | null, res: LookUpResponse) => {
        if (err) {
          return reject(err)
        }

        resolve(new session.GeoNetwork({
          country: res.getCountry(),
          region: '',
          city: res.getCity()
        }))
      })
    })
  }
}
