import express from 'express'
import { AwilixContainer } from 'awilix'
import { expect } from 'chai'
import request from 'supertest'

import createApp from '../before/createApp'
import { Dependencies } from '../../src/container'

let container: AwilixContainer<Dependencies>
let app: express.Application

describe('SdkController routes', () => {
  before(() => {
    const containerWithApp = createApp()
    container = containerWithApp.container
    app = containerWithApp.app
  })

  after(async () => {
    await container.cradle.eventProducer.destroy()
  })

  it('Should return status 200', async () => {
    const result = await request(app)
      .get('/sdk.js')

    expect(result.status).to.be.equal(200)
  })

  it('Should return headers content-type, content-length, cache-control', async () => {
    const result = await request(app)
      .get('/sdk.js')

    expect(result.header).to.include({
      'content-type': 'application/javascript',
      'content-length': '2503',
      'cache-control': 'public, max-age=7200'
    })
  })
})
