/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import { ServerCredentials, Server } from 'grpc'

import {
  createMock as createMockCustomDefinition,
  getAddresInfo
} from '@webalytic/ms-tools/lib/grpc/configuration/CustomDefinitionService'

import {
  ListCustomDefinitionsResponse
} from '@webalytic/ms-tools/shared/configuration/custom_definition_service'
import { custom_definition } from '@webalytic/ms-tools/shared/configuration/custom_definition'

export function createCustomDefinitionService(resourceId: string): Server {
  const addresInfo = getAddresInfo()

  const mock = createMockCustomDefinition([
    {
      method: 'ListCustomDefinitions',
      cases: [{
        request: { filter: { resourceId }, limit: 400 },
        response: new ListCustomDefinitionsResponse({
          customDefinitions: [
            {
              index: 1,
              scope: custom_definition.CustomDefinitionScope.HIT,
              name: 'dim1',
              type: custom_definition.CustomDefinitionType.DIMENSION
            },
            {
              index: 1,
              scope: custom_definition.CustomDefinitionScope.SESSION,
              name: 'met1',
              type: custom_definition.CustomDefinitionType.METRIC
            }
          ]
        })
      }]
    }
  ])

  mock.bind(`${addresInfo.address}:${addresInfo.port}`, ServerCredentials.createInsecure())

  return mock
}
