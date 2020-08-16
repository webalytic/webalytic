/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'
import apolloClient from '../apolloClient'

const LOAD_QUERY = gql`
  query load($measures: [String!], $dimensions: [String], $timeDimensions: [TimeDimensionInput], $order: JSON) {
    load(measures: $measures, dimensions: $dimensions, timeDimensions: $timeDimensions, order: $order)
  }`

export async function fetchWithTimeDimensions(variables) {
  const res = await apolloClient.query({
    query: LOAD_QUERY,
    variables: {
      measures: variables.measures,
      timeDimensions: [{
        dimension: 'Sessions.date'
      }],
      dimensions: variables.dimensions,
      order: {
        'Sessions.date': 'asc'
      }
    }
  })

  return res.data.load
}
