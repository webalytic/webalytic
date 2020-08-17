import { gql } from 'apollo-server'

export default gql`
  input FilterInput {
    member: String
    operator: String
    values: [String]
  }

  input TimeDimensionInput {
    dimension: String
    dateRange: [String]
    granularity: String
  }

  extend type Query {
    load(
      measures: [String!],  
      dimensions: [String], 
      timeDimensions: [TimeDimensionInput], 
      filters: [FilterInput],
      order: JSON
    ): JSON
  }
`
