/* eslint-disable no-delete-var */
/* eslint-disable no-new */
import express from 'express'
import { expect } from 'chai'
import request from 'supertest'

import createApp from '../../src/api/app'

describe('Api query engine', () => {
  let app: express.Application

  before(async () => {
    app = await createApp()
  })

  it('Should return data from cube-js engine', async () => {
    const res = await request(app)
      .get('/cubejs-api/v1/load')
      .query({
        query: JSON.stringify({
          measures: ['Sessions.count'],
          dimensions: ['Sessions.date'],
          renewQuery: true,
          limit: 100,
          offset: 0
        })
      })

    expect(res.status).to.be.equal(200)
    expect(res.body.query).to.be.deep.equal({
      measures: ['Sessions.count'],
      dimensions: ['Sessions.date'],
      renewQuery: true,
      limit: 100,
      offset: 0,
      rowLimit: 100,
      timezone: 'UTC',
      filters: [],
      timeDimensions: []
    })
    expect(res.body.data).to.be.deep.equal([])
  })
})
