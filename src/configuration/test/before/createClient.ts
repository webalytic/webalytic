import { credentials } from 'grpc'
import { ResourceServiceClient } from '@shared/configuration/resource_service_grpc_pb'
import { getAddress } from '../../src/server'

export default (): ResourceServiceClient =>
  new ResourceServiceClient(getAddress(), credentials.createInsecure(), {
    'grpc.keepalive_time_ms': 120000,
    'grpc.http2.min_time_between_pings_ms': 120000,
    'grpc.keepalive_timeout_ms': 20000,
    'grpc.http2.max_pings_without_data': 0,
    'grpc.keepalive_permit_without_calls': 1
  })
