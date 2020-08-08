import { gql } from 'apollo-server'
import { createTestClient } from 'apollo-server-testing'

import { expect } from 'chai'
import createServer from '../../src/server'

describe('Core Reporting Api', () => {
  const FETCH_SUMMARY_STAT = gql`
    query fetchSummaryStat {
      summary {
        sessions
        pageviews
        events
      }
    }
`

  it('Fetch summary stat', async () => {
    const server = createServer()
    const { query } = createTestClient(server)
    const res = await query({ query: FETCH_SUMMARY_STAT })
    expect(res.errors).to.be.equal(undefined)
    expect(res.data).not.be.equal(null)
    expect(res.data.summary).to.have.property('sessions')
    expect(res.data.summary).to.have.property('pageviews')
    expect(res.data.summary).to.have.property('events')
  })
})
