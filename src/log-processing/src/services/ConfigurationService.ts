/* eslint-disable camelcase */
import { CustomDefinitionService } from '@webalytic/ms-tools/shared/configuration/custom_definition_service'
import {
  createClient as createCustomDefinitionServiceClient
} from '@webalytic/ms-tools/lib/grpc/configuration/CustomDefinitionService'

import { custom_definition } from '@webalytic/ms-tools/shared/configuration/custom_definition'
import { session } from '@webalytic/ms-tools/shared/log-processing/session'

type resourceId = string
type index = number
type CustomDefinitionByIndex = Record<index, custom_definition.ICustomDefinitionProps>
type CustomDefinitionCache = {
  time: Date
  customDimensions: CustomDefinitionByIndex
  customMetrics: CustomDefinitionByIndex
}
type CustomDefinitionByResource = Record<resourceId, CustomDefinitionCache>

interface CustomDefinitionResult {
  customDimensions: session.CustomDimension[]
  customMetrics: session.CustomMetric[]
}

interface CustomDefinitionByScope {
  [custom_definition.CustomDefinitionScope.HIT]: CustomDefinitionResult
  [custom_definition.CustomDefinitionScope.SESSION]: CustomDefinitionResult
}

export default class {
  private customDefinitionService: CustomDefinitionService

  private customDefinitions: CustomDefinitionByResource = {}

  constructor() {
    this.customDefinitionService = createCustomDefinitionServiceClient()
  }

  public async extendCustomDefinition(resourceId: string, hit: session.IHit):
    Promise<CustomDefinitionByScope> {
    const customDefinitions = await this.getCustomDefition(resourceId)

    function mapDefinition(arrDefinition, definitionSetting): custom_definition.ICustomDefinitionProps[] {
      return arrDefinition
        .filter((item) =>
          definitionSetting[item.index])
        .map((item): custom_definition.ICustomDefinitionProps =>
          ({
            ...item,
            name: definitionSetting[item.index].name
          }))
    }

    const customDimensions = mapDefinition(hit.customDimensions, customDefinitions.customDimensions).map((x) =>
      new session.CustomDimension(x))

    const customMetrics = mapDefinition(hit.customMetrics, customDefinitions.customMetrics).map((x) =>
      new session.CustomMetric(x))

    return {
      [custom_definition.CustomDefinitionScope.HIT]: {
        customDimensions,
        customMetrics
      },
      [custom_definition.CustomDefinitionScope.SESSION]: {
        customDimensions: customDimensions.filter((i) =>
          customDefinitions.customDimensions[i.index].scope === custom_definition.CustomDefinitionScope.SESSION),
        customMetrics: customMetrics.filter((i) =>
          customDefinitions.customMetrics[i.index].scope === custom_definition.CustomDefinitionScope.SESSION)
      }
    }
  }

  private async getCustomDefition(resourceId: string): Promise<CustomDefinitionCache> {
    let result = this.customDefinitions[resourceId]
    if (!result || result.time <= new Date(new Date().getTime() + 5 * 1000)) {
      const listReq = { filter: { resourceId } }

      const { customDefinitions } = await this.customDefinitionService.listCustomDefinitions(listReq)

      const customDimensions = customDefinitions
        .filter((i) =>
          i.type === custom_definition.CustomDefinitionType.DIMENSION)
        .reduce((obj:CustomDefinitionByIndex, i) => {
          // eslint-disable-next-line no-param-reassign
          Object.assign(obj, { [i.index]: i })
          return obj
        }, {})

      const customMetrics = customDefinitions
        .filter((i) =>
          i.type === custom_definition.CustomDefinitionType.METRIC)
        .reduce((obj:CustomDefinitionByIndex, i) => {
          // eslint-disable-next-line no-param-reassign
          Object.assign(obj, { [i.index]: i })
          return obj
        }, {})

      result = {
        time: new Date(),
        customDimensions,
        customMetrics
      }

      this.customDefinitions[resourceId] = result
    }
    return result
  }
}
