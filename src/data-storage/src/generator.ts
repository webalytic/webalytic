/* eslint-disable no-await-in-loop */
import dotenv from 'dotenv'
import faker from 'faker'
import moment from 'moment'

import EventProducer from '@webalytic/ms-tools/lib/infra/EventProducer'
import { session } from '@webalytic/ms-tools/shared/log-processing/session'
import {
  SessionCreatedEventPayload,
  SessionUpdatedEventPayload
} from '@webalytic/ms-tools/shared/log-processing/log_processing_events'

import { HitType, HitDataSource } from './constants'

dotenv.config()

const maxByDayOfWeek = {
  1: 350,
  2: 400,
  3: 460,
  4: 480,
  5: 470,
  6: 410,
  7: 400
}

async function main() {
  const time = moment().subtract(7, 'days')

  const eventProducer = new EventProducer({
    server: process.env.NATS_SERVER || 'nats://localhost:4222',
    cluster: process.env.NATS_CLUSTER || 'webalytic',
    clientId: 'data-storage-generator'
  })
  await eventProducer.init()

  let isProcessing = true
  let counter = 0
  while (isProcessing) {
    const props = new session.SessionProps({
      resourceId: '49c4d5b7-e8de-42a8-841f-3d4c20d16990',
      date: time.format('YYYY-MM-DD'),
      sessionId: faker.random.uuid(),
      sessionStartTime: time.format('YYYY-MM-DD HH:mm:ss'),
      totals: {
        hits: 1,
        pageviews: 1
      },
      duration: 0,
      userId: faker.random.uuid(),
      clientId: faker.random.uuid(),
      trafficSource: {
        source: faker.random.arrayElement(['google', 'yandex', 'social', 'direct']),
        campaign: '',
        content: '',
        keyword: '',
        medium: faker.random.arrayElement(['cpa', 'referral', 'cpc', 'email', 'organic'])
      },
      device: {
        operatingSystem: faker.random.arrayElement(['Mac os', 'Windows', 'Android']),
        operatingSystemVersion: '',
        browser: faker.random.arrayElement(['Chrome', 'Safari', 'FireFox']),
        browserVersion: '',
        deviceCategory: faker.random.arrayElement(['tablet', 'desktop', 'mobile'])
      },
      geoNetwork: {
        country: 'RU',
        region: '',
        city: 'Moscow'
      }
    })

    const hit = new session.Hit({
      time: time.format('YYYY-MM-DD HH:mm:ss'),
      type: HitType.PAGEVIEW,
      dataSource: HitDataSource.SDK,

      // ** Pageview
      pageUrl: faker.internet.url(),

      // ** Events
      eventCategory: '',
      eventAction: '',
      eventLabel: '',
      eventValue: 0,

      // ** Enhanced E-Commerce
      transactionId: '',
      transactionAffiliation: '',
      transactionRevenue: 0,
      productAction: '',
      productsList: []
    })

    const payload = new SessionCreatedEventPayload({ props, hit })
    await eventProducer.send('SessionCreatedEvent', payload.toJSON())

    if (faker.random.boolean()) {
      await new Promise((resolve) =>
        setTimeout(() =>
          resolve(), 200))
      const type = faker.random.arrayElement([HitType.PAGEVIEW, HitType.EVENT])
      const payloadUpdated = new SessionUpdatedEventPayload({
        prevProps: props,
        props: {
          ...props,
          duration: 10,
          totals: {
            hits: props.totals.hits + 1,
            events: type === HitType.EVENT ? props.totals.events + 1 : props.totals.events,
            pageviews: type === HitType.PAGEVIEW ? props.totals.pageviews + 1 : props.totals.pageviews
          }
        },
        hit: {
          ...hit,
          type,
          time: time.clone().add(10, 'seconds').format('YYYY-MM-DD HH:mm:ss')
        }
      })
      await eventProducer.send('SessionUpdatedEvent', payloadUpdated.toJSON())
    }

    counter += 1
    const week = time.format('E')
    if (counter > (maxByDayOfWeek[week] - faker.random.number(100)) / 100) {
      time.add(1, 'days')
      counter = 0
    }
    isProcessing = time.unix() < moment().unix()
  }
}

main()
