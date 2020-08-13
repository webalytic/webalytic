import { ServerUnaryCall, Metadata } from 'grpc'
import {
  Geoip as GeoipService,
  LookUpRequest,
  LookUpResponse
} from '@webalytic/ms-tools/shared/geoip/geoip'

import maxmind from './maxmindReader'

type LookUpCall = ServerUnaryCall<LookUpRequest>
type LookUpCallback = GeoipService.LookUpCallback

export default class {
  async LookUp(
    call: LookUpCall,
    callback: LookUpCallback
  ): Promise<void> {
    let res: LookUpResponse = null
    let err = null

    try {
      const result = maxmind.get(call.request.ip)

      res = new LookUpResponse({
        country: result.country.iso_code,
        city: result.city.names.en

      })
    } catch (error) {
      err = this.handleError(error)
    }

    callback(err, res)
  }

  private handleError(error: any): any {
    const metadata = new Metadata()
    if (error.details) metadata.set('details', JSON.stringify(error.details))

    return {
      code: error.code,
      message: error.message,
      status: error.status,
      metadata
    } as any
  }
}
