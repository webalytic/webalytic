import {
  sendUnaryData, ServerUnaryCall
} from 'grpc'

import { GeoipService, IGeoipServer } from '@shared/services/geoip/geoip_grpc_pb'
import { LookUpRequest, LookUpResponse } from '@shared/services/geoip/geoip_pb'

import maxmind from './maxmindReader'

class Geoip implements IGeoipServer {
  public lookUp(call: ServerUnaryCall<LookUpRequest>, callback: sendUnaryData<LookUpResponse>): void {
    const req: LookUpRequest = call.request
    const res: LookUpResponse = new LookUpResponse()

    const ip = req.getIp()
    const result = maxmind.get(ip)

    res.setCountry(result.country.iso_code)
    res.setCity(result.city.names.en)

    callback(null, res)
  }
}

export {
  Geoip,
  GeoipService
}
