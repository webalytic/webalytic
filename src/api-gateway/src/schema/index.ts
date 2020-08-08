import { merge } from 'lodash'
import { makeExecutableSchema, gql } from 'apollo-server'
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'

import { coreReportingApiTypeDefs, coreReportingApiResolvers } from './core-reporting-api'

export default makeExecutableSchema({
  typeDefs: [
    gql`
      scalar JSON
      scalar JSONObject
      
      type Query
    `,
    coreReportingApiTypeDefs
  ],
  resolvers: merge({
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    Query: {}
  },
  coreReportingApiResolvers)
})
