import gql from 'graphql-tag'

export const CUSTOM_DEFINITIONS_QUERY = gql`
  query getCustomDefinition($filter: CustomDefinitionFilter, $limit: Int, $offset: Int, $orderBy: String) {
    customDefinitions(filter: $filter, limit: $limit, offset: $offset, orderBy: $orderBy ){
      count
      customDefinitions {
        id
        resourceId
        index
        name
        scope
        type
        active
      }
    }
  }
`

export const CUSTOM_DEFINITION_CREATE_MUTATION = gql`
  mutation($data: CustomDefinitionCreateInput) {
    customDefinitionCreate(data: $data){
      id
      name
    }
  }
`

export const CUSTOM_DEFINITION_UPDATE_MUTATION = gql`
  mutation($id: String, $data: CustomDefinitionUpdateInput) {
    customDefinitionUpdate(id: $id, data: $data){
      id
      name
    }
  }
`

export const CustomDefinitionScope = {
  HIT: 1,
  SESSION: 2
}

export const CustomDefinitionType = {
  DIMENSION: 1,
  METRIC: 2
}
