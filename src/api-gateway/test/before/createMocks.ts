/* eslint-disable import/prefer-default-export */
import {
  createMock as createMockResource,
  getAddresInfo
} from '@webalytic/ms-tools/lib/grpc/configuration/ResourceService'
import { CreateResourceResponse } from '@webalytic/ms-tools/shared/configuration/resource_service'

import {
  createMock as createMockCustomDefinition
} from '@webalytic/ms-tools/lib/grpc/configuration/CustomDefinitionService'
import { CreateCustomDefinitionResponse } from '@webalytic/ms-tools/shared/configuration/custom_definition_service'

import { ServerCredentials } from 'grpc'
import moment from 'moment'
import faker from 'faker'

export function createResourceService(resourceId): any {
  const addresInfo = getAddresInfo()

  const mock = createMockResource([
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

export function createCustomDefinitionService(customDefinitionId): any {
  const addresInfo = getAddresInfo()

  const mock = createMockCustomDefinition([
    {
      method: 'ListCustomDefinitions',
      cases: [{
        request: { },
        response: { }
      }]
    },
    {
      method: 'CreateCustomDefinition',
      cases: [{
        request: { data: {} },
        response: new CreateCustomDefinitionResponse({
          instance: {
            id: faker.random.uuid()
          }
        })
      }]
    },
    {
      method: 'UpdateCustomDefinition',
      cases: [{
        request: {
          id: customDefinitionId,
          data: {}
        },
        response: {
          instance: new CreateCustomDefinitionResponse({
            instance: {
              id: customDefinitionId
            }
          })
        }
      }]
    }
  ])

  mock.bind(`${addresInfo.address}:${addresInfo.port}`, ServerCredentials.createInsecure())

  return mock
}
