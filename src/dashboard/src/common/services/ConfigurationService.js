/* eslint-disable class-methods-use-this */
import gql from 'graphql-tag'

import BaseGraphqlService from './BaseGraphqlService'

const RESOURCES_QUERY = gql`
  query getResources($filter: ResourceFilter, $limit: Int, $offset: Int, $orderBy: String) {
    resources(filter: $filter, limit: $limit, offset: $offset, orderBy: $orderBy ){
      count
      resources {
        id
        name
        category
        defaultWebsiteUrl
        createTime
        updateTime
      }
    }
  }
`

const RESOURCE_UPDATE_MUTATION = gql`
  mutation($id: String, $data: ResourceUpdateInput) {
    resourceUpdate(id: $id, data: $data){
      id
      name
      category
      defaultWebsiteUrl
      createTime
      updateTime
    }
  }
`

const RESOURCE_CREATE_MUTATION = gql`
  mutation($data: ResourceCreateInput) {
    resourceCreate(data: $data){
      id
      name
      category
      defaultWebsiteUrl
      createTime
      updateTime
    }
  }
`

class ConfigurationService extends BaseGraphqlService {
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
}

export default new ConfigurationService()
