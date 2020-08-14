import { merge } from 'lodash'
import { makeExecutableSchema, gql } from 'apollo-server'
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'

import { coreReportingApiTypeDefs, coreReportingApiResolvers } from './core-reporting-api'
import { managementApiTypeDefs, managementApiResolvers } from './management-api'

export default makeExecutableSchema({
  typeDefs: [
    gql`
      scalar JSON
      scalar JSONObject
      
      type Query
      type Mutation
    `,
    coreReportingApiTypeDefs,
    managementApiTypeDefs
  ],
  resolvers: merge(
    {
      JSON: GraphQLJSON,
      JSONObject: GraphQLJSONObject,
      Query: {},
      Mutation: {}
    },
    coreReportingApiResolvers,
    managementApiResolvers
  )
})
