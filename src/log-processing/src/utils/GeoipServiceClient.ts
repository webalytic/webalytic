/* eslint-disable consistent-return */
import { credentials, Metadata, ServiceError } from 'grpc'

import { GeoipClient } from '@shared/services/geoip/geoip_grpc_pb'
import { LookUpRequest, LookUpResponse } from '@shared/services/geoip/geoip_pb'
import GeoNetwork from '../entities/Session/valueObjects/GeoNetwork'

export default class GeoipServiceClient {
  private readonly client: GeoipClient = new GeoipClient('localhost:50051', credentials.createInsecure());

  public async lookup(ipAdress: string): Promise<GeoNetwork> {
    const param: LookUpRequest = new LookUpRequest()
    param.setIp(ipAdress)

    return new Promise((resolve, reject): void => {
      this.client.lookup(param, new Metadata(), (err: ServiceError | null, res: LookUpResponse) => {
        if (err) {
          return reject(err)
        }

        resolve({
          country: res.getCountry(),
          region: '',
          city: res.getCity()
        })
      })
    })
  }
}
