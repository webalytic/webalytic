import * as express from 'express'
import { AwilixContainer } from 'awilix'
import { expect } from 'chai'
import request from 'supertest'
import * as faker from 'faker'

import EventConsumer from '@webalytic/ms-tools/lib/infra/EventConsumer'
import { ILogCollectedEventPayload } from '@shared/events/log-collector-events'
import createApp from '../before/createApp'
import createConsumer from '../before/createConsumer'
import { Dependencies } from '../../src/container'

let container: AwilixContainer<Dependencies>
let app: express.Application
let eventConsumer: EventConsumer

describe('MainController', () => {
  before(async () => {
    const containerWithApp = createApp()
    container = containerWithApp.container
    app = containerWithApp.app

    eventConsumer = createConsumer()
    await eventConsumer.init()
  })

  after(async () => {
    await container.cradle.eventProducer.destroy()
    await eventConsumer.destroy()
  })

  describe('.index()', () => {
    it('Should status 200, body OK, [GET] /', async () => {
      const result = await request(app)
        .get('/')

      expect(result.status).to.be.equal(200)
      expect(result.text).to.be.equal('OK')
    })
  })

  describe('.collect()', () => {
    it('Should status 204, [GET] /collect', async () => {
      const result = await request(app)
        .get('/collect')

      expect(result.status).to.be.equal(204)
    })

    it('Should status 204, [GET] /collect?some=testIsCool', async () => {
      const result = await request(app)
        .get('/collect')
        .query({ some: 'testIsCool' })

      expect(result.status).to.be.equal(204)
    })

    function createConsumerOnceSubscribe(clientId: string): Promise<ILogCollectedEventPayload> {
      const channelName = container.cradle.logCollectorService.getChannelNameByClientId(clientId)

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() =>
          reject(new Error('Nats event timeout')), 2000)
        eventConsumer.subscribe(channelName, 'log-collector-test', (msg) => {
          clearTimeout(timer)
          resolve(JSON.parse(msg.getData()))
        })
      })
    }

    it('Should status 204, send payload to event bus [GET] /collect?tid=...&cid=...&t=pageview', async () => {
      const queryMeasurementProtocol = {
        tid: faker.random.uuid(),
        cid: faker.random.uuid(),
        uid: faker.random.uuid(),
        sc: 'start',
        ua: faker.internet.userAgent(),
        dr: faker.internet.url(),
        t: 'pageview',
        dataSource: 'sdk',
        pageUrl: faker.internet.url()
      }
      const consumerPromise = createConsumerOnceSubscribe(queryMeasurementProtocol.cid)

      const result = await request(app)
        .get('/collect')
        .query(queryMeasurementProtocol)

      expect(result.status).to.be.equal(204)

      const eventPayload: ILogCollectedEventPayload = await consumerPromise

      expect(eventPayload).to.include({
        resourceId: queryMeasurementProtocol.tid,
        clientId: queryMeasurementProtocol.cid,
        userId: queryMeasurementProtocol.uid,
        sessionControl: queryMeasurementProtocol.sc,
        ip: '::ffff:127.0.0.1',
        userAgent: queryMeasurementProtocol.ua,
        documentReferrer: queryMeasurementProtocol.dr
      })

      expect(eventPayload.hit).to.include({
        type: queryMeasurementProtocol.t,
        eventValue: 0,
        transactionRevenue: 0
      })
    })
  })
})
