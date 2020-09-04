import { gql } from 'apollo-server'

export default gql`
  type CustomDefinition {
    id: String
    resourceId: String
    index: Int
    name: String
    type: Int
    scope: Int
    active: Boolean
  }

  type CustomDefinitionsListResponse {
    count: Int
    customDefinitions: [CustomDefinition]
  }

  input CustomDefinitionFilter {
    id: String
    resourceId: String
    name: String
  }

  input CustomDefinitionCreateInput {
    name: String
    resourceId: String
    type: Int
    scope: Int
    active: Boolean
  }

  input CustomDefinitionUpdateInput {
    name: String
    scope: Int
    active: Boolean
  }

  extend type Query {
    customDefinitions(filter: CustomDefinitionFilter, limit: Int, offset: Int, orderBy: String ): 
      CustomDefinitionsListResponse
  }

  extend type Mutation {
    customDefinitionCreate(data: CustomDefinitionCreateInput): CustomDefinition
    customDefinitionUpdate(id: String, data: CustomDefinitionUpdateInput): CustomDefinition
  }
`
