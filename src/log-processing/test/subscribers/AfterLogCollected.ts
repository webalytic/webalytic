import { AwilixContainer } from 'awilix'
import { expect } from 'chai'
import faker from 'faker'
import moment from 'moment'

import { ILogCollectedEventPayload } from '@webalytic/ms-tools/shared/log-collector/log_collector_events'
import EventConsumer from '@webalytic/ms-tools/lib/infra/EventConsumer'
import EventProducer from '@webalytic/ms-tools/lib/infra/EventProducer'
import { ILogProcessedEventPayload } from '@webalytic/ms-tools/shared/log-processing/log_processing_events'
import { Server } from 'grpc'
import createContainer, { Dependencies } from '../../src/container'

import AfterLogCollected from '../../src/subscribers/AfterLogCollected'
import { HitType } from '../../src/constants'
import { createCustomDefinitionService } from '../before/createMocks'

let eventConsumer:EventConsumer = null
let eventProducer:EventProducer = null
let container: AwilixContainer<Dependencies> = null
let customDefinitionServiceMock: Server
const resourceId = faker.random.uuid()

const INDEX_OF_EVENT_CHANNEL = 1

describe('AfterLogCollected', () => {
  before(async () => {
    container = createContainer()
    eventConsumer = container.cradle.eventConsumer
    eventProducer = container.cradle.eventProducer

    customDefinitionServiceMock = createCustomDefinitionService(resourceId)
    customDefinitionServiceMock.start()

    await Promise.all([
      eventConsumer.init(),
      eventProducer.init()
    ])

    // eslint-disable-next-line no-new
    new AfterLogCollected(INDEX_OF_EVENT_CHANNEL, container.cradle)
  })

  after(async () => {
    await Promise.all([
      eventConsumer.destroy(),
      eventProducer.destroy(),
      container.cradle.redis.quit(),
      new Promise((resolve) => {
        customDefinitionServiceMock.tryShutdown(() =>
          resolve())
      })
    ])
  })

  async function createConsumerOnceSubscribe(consumer: EventConsumer): Promise<ILogProcessedEventPayload> {
    const channelName = 'LogProcessedEvent'
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Nats event timeout'))
      }, 2000)

      consumer.subscribe(channelName, 'log-processing-test', (msg) => {
        clearTimeout(timer)
        resolve(JSON.parse(msg.getData()))
      })
    })
  }

  it('Should send LogProcessedEvent', async () => {
    const logCollectedEventPayload: ILogCollectedEventPayload = {
      resourceId,
      clientId: faker.random.uuid(),
      userAgent: faker.internet.userAgent(),
      userId: faker.random.uuid(),
      campaignName: faker.random.word(),
      campaignSource: faker.random.word(),
      hit: {
        type: HitType.PAGEVIEW,
        pageUrl: faker.internet.url(),
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        timestamp: moment().unix(),
        customDimensions: [{ index: 1, value: 'dimension1' }],
        customMetrics: [{ index: 1, value: 1 }]
      }
    }

    await eventProducer.send(`LogCollectedEvent:${INDEX_OF_EVENT_CHANNEL}`, logCollectedEventPayload)

    const consumerPromise = createConsumerOnceSubscribe(eventConsumer)

    const eventPayload: ILogProcessedEventPayload = await consumerPromise

    expect(eventPayload).not.to.be.equal(null)
    expect(eventPayload.hit).to.be.deep.equal({
      ...logCollectedEventPayload.hit,
      customDimensions: [{ index: 1, name: 'dim1', value: 'dimension1' }],
      customMetrics: [{ index: 1, name: 'met1', value: 1 }]
    })

    expect(eventPayload.props).to.deep.include({
      resourceId: logCollectedEventPayload.resourceId,
      date: moment().format('YYYY-MM-DD'),
      sessionId: eventPayload.props.sessionId,
      userId: logCollectedEventPayload.userId,
      clientId: logCollectedEventPayload.clientId,
      sessionStartTime: logCollectedEventPayload.hit.time,
      totals: { hits: 1, pageviews: 1, events: 0 },
      trafficSource: {
        source: logCollectedEventPayload.campaignSource,
        campaign: logCollectedEventPayload.campaignName
      },
      device: container.cradle.parser.getDevice(logCollectedEventPayload.userAgent).toJSON(),
      geoNetwork: (await container.cradle.parser.getGeoNetwork(logCollectedEventPayload.userAgent)).toJSON(),
      duration: 0,
      customMetrics: [{ index: 1, name: 'met1', value: 1 }]
    })
  })
})
