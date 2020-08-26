import express from 'express'
import { AwilixContainer } from 'awilix'
import { expect } from 'chai'
import request from 'supertest'
import faker from 'faker'
import { Server } from 'grpc'

import { ILogCollectedEventPayload } from '@webalytic/ms-tools/shared/log-collector/log_collector_events'

import createApp from '../before/createApp'
import createConsumer from '../before/createConsumer'
import { Dependencies } from '../../src/container'
import { createResourceService } from '../before/createMocks'

let container: AwilixContainer<Dependencies>
let app: express.Application
let resourceServiceMock: Server

const resourceId = faker.random.uuid()

describe('MainController', () => {
  before(async () => {
    resourceServiceMock = createResourceService(resourceId)
    resourceServiceMock.start()

    const containerWithApp = createApp()
    container = containerWithApp.container
    app = containerWithApp.app
  })

  after(async () => {
    await container.cradle.eventProducer.destroy()
    await new Promise((resolve) => {
      resourceServiceMock.tryShutdown(() =>
        resolve())
    })
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

    async function createConsumerOnceSubscribe(eventConsumer, clientId: string): Promise<ILogCollectedEventPayload> {
      const channelName = container.cradle.logCollectorService.getChannelNameByClientId(clientId)
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error('Nats event timeout'))
          eventConsumer.destroy()
        }, 2000)

        eventConsumer.subscribe(channelName, 'log-collector-test', (msg) => {
          clearTimeout(timer)
          resolve(JSON.parse(msg.getData()))
          eventConsumer.destroy()
        })
      })
    }

    const queryMeasurementProtocol = {
      tid: resourceId,
      cid: faker.random.uuid(),
      uid: faker.random.uuid(),
      sc: 'start',
      ua: faker.internet.userAgent(),
      dr: faker.internet.url(),
      t: 'pageview',
      dataSource: 'sdk',
      pageUrl: faker.internet.url()
    }

    it('Should status 204, send payload to event bus [GET] /collect?tid=...&cid=...&t=pageview', async () => {
      const result = await request(app)
        .get('/collect')
        .query(queryMeasurementProtocol)

      expect(result.status).to.be.equal(204)
    })

    it('Should send payload to event bus [GET] /collect?tid=...&cid=...&t=pageview', async () => {
      const eventConsumer = createConsumer()
      await eventConsumer.init()

      const consumerPromise = createConsumerOnceSubscribe(eventConsumer, queryMeasurementProtocol.cid)

      await request(app)
        .get('/collect')
        .query({
          ...queryMeasurementProtocol,
          cd1: 'dimension1',
          cd155: 'dimension155',
          cm1: '1',
          cm132: '132'
        })

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

      expect(eventPayload.hit.customDimensions).to.deep.equal([
        { index: 1, value: 'dimension1' },
        { index: 155, value: 'dimension155' }
      ])

      expect(eventPayload.hit.customMetrics).to.deep.equal([
        { index: 1, value: 1 },
        { index: 132, value: 132 }
      ])
    })

    it('Should don`t send payload, unknown resourceId [GET] /collect?tid=...&cid=...&t=pageview', async () => {
      const eventConsumer = createConsumer()
      await eventConsumer.init()
      const consumerPromise = createConsumerOnceSubscribe(eventConsumer, queryMeasurementProtocol.cid)

      await request(app)
        .get('/collect')
        .query({
          ...queryMeasurementProtocol,
          tid: faker.random.uuid()
        })

      try {
        await consumerPromise
        throw new Error('Should throw timeout error')
      } catch (error) {
        expect(error.message).to.be.equal('Nats event timeout')
      }
    })
  })
})
