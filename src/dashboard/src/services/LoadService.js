/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'
import apolloClient from '../apolloClient'

const LOAD_QUERY = gql`
  query load(
    $measures: [String!], 
    $dimensions: [String], 
    $timeDimensions: [TimeDimensionInput], 
    $filters: [FilterInput],
    $order: JSON) {
      load(
        measures: $measures, 
        dimensions: $dimensions, 
        timeDimensions: $timeDimensions, 
        filters: $filters,
        order: $order
      )
  }`

function prepareFiltersForQueryEngine(filter) {
  return [{
    member: 'Sessions.date',
    operator: 'gte',
    values: [
      filter.dateRange.startDate
    ]
  }, {
    member: 'Sessions.date',
    operator: 'lte',
    values: [
      filter.dateRange.endDate
    ]
  }]
}

export async function callQueryEngine(variables, filter = []) {
  const res = await apolloClient.query({
    query: LOAD_QUERY,
    variables: {
      measures: variables.measures || [],
      filters: prepareFiltersForQueryEngine(filter),
      timeDimensions: variables.timeDimensions || [],
      dimensions: variables.dimensions || [],
      order: {
        'Sessions.date': 'asc'
      }
    }
  })

  return res.data.load
}
