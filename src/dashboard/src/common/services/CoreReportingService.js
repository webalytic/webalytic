/* eslint-disable class-methods-use-this */
import gql from 'graphql-tag'
import BaseGraphqlService from './BaseGraphqlService'

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

class CoreReportingService extends BaseGraphqlService {
  async callQueryEngine(variables, filter = []) {
    const { load } = await this.callApi({
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

    return load
  }
}

export default new CoreReportingService()
