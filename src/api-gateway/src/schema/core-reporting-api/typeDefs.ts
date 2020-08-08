import { gql } from 'apollo-server'

export default gql`
  input TimeDimensionInput {
    dimension: String
    dateRange: [String]
    granularity: String
  }

  extend type Query {
    load(measures: [String!], dimensions: [String], timeDimensions: [TimeDimensionInput], order: JSON): JSON
  }
`
