import { ApolloServerTestClient } from 'apollo-server-testing'
import { gql } from 'apollo-server'
import { expect } from 'chai'
import nock from 'nock'

import createApp from '../../before/createApp'

let testClient: ApolloServerTestClient
let dataStorageApiMock: nock.Scope

describe('Core Reporting Api', () => {
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

  before(() => {
    const containerWithApp = createApp()
    testClient = containerWithApp.testClient

    const query = JSON.stringify({
      measures: ['Sessions.count'],
      dimensions: ['Sessions.date'],
      limit: 100,
      offset: 0
    })

    dataStorageApiMock = nock('http://0.0.0.0:3000')
      .get(`/cubejs-api/v1/load?query=${encodeURIComponent(query)}`)
      .reply(200, {
        data: {
          load: [{
            'Sessions.count': 10,
            'Sessions.pageviews': 10,
            'Sessions.events': 10
          }]
        }
      })
  })

  after(() => {
    dataStorageApiMock.done()
  })

  it('Should return load result from data-storage', async () => {
    const res = await testClient.query({
      query: LOAD_QUERY,
      variables: {
        measures: ['Sessions.count'],
        dimensions: ['Sessions.date']
      }
    })

    expect(res.errors).to.be.equal(undefined)
    expect(res.data).not.be.equal(null)
    expect(res.data.load).not.be.equal(null)
    expect(res.data.load.load).to.be.deep.equal([{
      'Sessions.count': 10,
      'Sessions.pageviews': 10,
      'Sessions.events': 10
    }])
  })
})
