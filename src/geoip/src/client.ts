import { credentials } from 'grpc'
import { GeoipClient } from '@shared/services/geoip/geoip_grpc_pb'

export default (): GeoipClient =>
  new GeoipClient('localhost:50051', credentials.createInsecure(), {
    'grpc.keepalive_time_ms': 120000,
    'grpc.http2.min_time_between_pings_ms': 120000,
    'grpc.keepalive_timeout_ms': 20000,
    'grpc.http2.max_pings_without_data': 0,
    'grpc.keepalive_permit_without_calls': 1
  })
