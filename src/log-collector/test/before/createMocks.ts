/* eslint-disable import/prefer-default-export */
import { createMock, getAddresInfo } from '@webalytic/ms-tools/lib/grpc/configuration/ResourceService'
import { ServerCredentials } from 'grpc'

export function createResourceService(resourceId: string): any {
  const addresInfo = getAddresInfo()

  const mock = createMock([
    {
      method: 'ListResources',
      cases: [{
        request: { filter: { id: resourceId } },
        response: {
          resources: [{ id: resourceId }]
        }
      }]

    },
    {
      method: 'CreateResource',
      cases: [{
        request: { },
        response: { }
      }]
    },
    {
      method: 'UpdateResource',
      cases: [{
        request: { },
        response: { }
      }]
    }
  ])

  mock.bind(`${addresInfo.address}:${addresInfo.port}`, ServerCredentials.createInsecure())

  return mock
}
