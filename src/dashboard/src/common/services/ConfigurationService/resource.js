import gql from 'graphql-tag'

export const RESOURCES_QUERY = gql`
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

export const RESOURCE_UPDATE_MUTATION = gql`
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

export const RESOURCE_CREATE_MUTATION = gql`
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
