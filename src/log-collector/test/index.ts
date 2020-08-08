/* eslint-disable consistent-return */

import { expect } from 'chai'
import * as request from 'supertest'

import createContainer from '../src/container'
import createApp from '../src/app'

const container = createContainer()
const app = container.build(createApp)

describe('Log-collector', () => {
  after(() => {
    process.exit(0)
  })

  it('Send valid data, should response { status: 204 }', async () => {
    const result = await request(app)
      .get('/collect')
      .query({
        userId: 1,
        title: 'test is cool'
      })

    expect(result.status).to.be.equal(204)
  })
})
