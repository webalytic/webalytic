import { gql } from 'apollo-server'

export default gql`
  type Resource {
    id: String
    name: String
    category: Int
    defaultWebsiteUrl: String
    createTime: Int
    updateTime: Int
  }

  type ResourcesListResponse {
    count: Int
    resources: [Resource]
  }

  input ResourceFilter {
    id: String
    name: String
  }

  input ResourceCreateInput {
    name: String
    category: Int
    defaultWebsiteUrl: String
  }

  input ResourceUpdateInput {
    name: String
    category: Int
    defaultWebsiteUrl: String
  }

  extend type Query {
    resources(filter: ResourceFilter, limit: Int, offset: Int, orderBy: String ): ResourcesListResponse
  }

  extend type Mutation {
    resourceCreate(data: ResourceCreateInput): Resource
    resourceUpdate(id: String, data: ResourceUpdateInput): Resource
  }
`
