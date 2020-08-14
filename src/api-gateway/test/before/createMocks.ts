/* eslint-disable import/prefer-default-export */
import { createMock, getAddresInfo } from '@webalytic/ms-tools/lib/grpc/configuration/ResourceService'
import { CreateResourceResponse } from '@webalytic/ms-tools/shared/configuration/resource_service'
import { ServerCredentials } from 'grpc'
import moment from 'moment'
import faker from 'faker'

export function createResourceService(resourceId): any {
  const addresInfo = getAddresInfo()

  const mock = createMock([
    {
      method: 'ListResources',
      cases: [{
        request: { },
        response: { }
      }]
    },
    {
      method: 'CreateResource',
      cases: [{
        request: { data: {} },
        response: new CreateResourceResponse({
          instance: {
            id: faker.random.uuid(),
            updateTime: moment().unix(),
            createTime: moment().unix()
          }
        })
      }]
    },
    {
      method: 'UpdateResource',
      cases: [{
        request: {
          id: resourceId,
          data: {}
        },
        response: {
          instance: {
            id: resourceId,
            updateTime: moment().unix(),
            createTime: moment().unix()
          }
        }
      }]
    }
  ])

  mock.bind(`${addresInfo.address}:${addresInfo.port}`, ServerCredentials.createInsecure())

  return mock
}
