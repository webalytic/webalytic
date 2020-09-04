/* eslint-disable class-methods-use-this */

import BaseGraphqlService from '../BaseGraphqlService'
import { RESOURCES_QUERY, RESOURCE_CREATE_MUTATION, RESOURCE_UPDATE_MUTATION } from './resource'
import { CUSTOM_DEFINITIONS_QUERY, CUSTOM_DEFINITION_CREATE_MUTATION, CUSTOM_DEFINITION_UPDATE_MUTATION } from './customDefinition'

class ConfigurationService extends BaseGraphqlService {
  // ** Methods related Resource

  async resources() {
    const { resources } = await this.callApi({
      query: RESOURCES_QUERY,
      variables: {}
    })

    return resources.resources
  }

  async resourceUpdate(id, data) {
    const { resourceUpdate } = await this.callApi({
      query: RESOURCE_UPDATE_MUTATION,
      variables: {
        id,
        data
      }
    })

    return resourceUpdate
  }

  async resourceCreate(data) {
    const { resourceCreate } = await this.callApi({
      query: RESOURCE_CREATE_MUTATION,
      variables: {
        data
      }
    })

    return resourceCreate
  }

  // ** Methods related CustomDefinition

  async customDefinitions(variables = {}) {
    const { customDefinitions } = await this.callApi({
      query: CUSTOM_DEFINITIONS_QUERY,
      variables: {
        limit: 10,
        offset: 0,
        filter: {},
        orderBy: 'index:asc',
        ...variables
      }
    })

    return customDefinitions.customDefinitions
  }

  async customDefinitionCreate(data) {
    const { customDefinitionCreate } = await this.callApi({
      query: CUSTOM_DEFINITION_CREATE_MUTATION,
      variables: {
        data
      }
    })

    return customDefinitionCreate
  }

  async customDefinitionUpdate(id, data) {
    const { customDefinitionUpdate } = await this.callApi({
      query: CUSTOM_DEFINITION_UPDATE_MUTATION,
      variables: {
        id,
        data
      }
    })

    return customDefinitionUpdate
  }
}

export default new ConfigurationService()
