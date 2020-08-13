/* eslint-disable no-await-in-loop */
import dotenv from 'dotenv'
import faker from 'faker'
import moment from 'moment'

import EventProducer from '@webalytic/ms-tools/lib/infra/EventProducer'
import { session } from '@webalytic/ms-tools/shared/log-processing/session'
import { SessionCreatedEventPayload } from '@webalytic/ms-tools/shared/log-processing/log_processing_events'

import { HitType, HitDataSource } from './constants'

dotenv.config()

async function main() {
  const eventProducer = new EventProducer({
    server: process.env.NATS_SERVER || 'nats://localhost:4222',
    cluster: process.env.NATS_CLUSTER || 'webalytic',
    clientId: 'data-storage-generator'
  })
  await eventProducer.init()

  const isProcessing = true

  while (isProcessing) {
    const time = moment().subtract(1, 'days')

    const payload = new SessionCreatedEventPayload({
      props: new session.SessionProps({
        resourceId: '49c4d5b7-e8de-42a8-841f-3d4c20d16990',
        date: time.format('YYYY-MM-DD'),
        sessionId: faker.random.uuid(),
        sessionStartTime: time.format('YYYY-MM-DD HH:mm:ss'),
        totals: {
          hits: 1,
          pageviews: 1
        },
        userId: faker.random.uuid(),
        clientId: faker.random.uuid(),
        trafficSource: {
          source: '',
          campaign: '',
          content: '',
          keyword: '',
          medium: ''
        },
        device: {
          operatingSystem: '',
          operatingSystemVersion: '',
          browser: '',
          browserVersion: '',
          deviceCategory: ''
        },
        geoNetwork: {
          country: 'RU',
          region: '',
          city: 'Moscow'
        }
      }),
      hit: new session.Hit({
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
    })

    eventProducer.send('SessionCreatedEvent', payload.toJSON())

    await new Promise((resolve) =>
      setTimeout(() =>
        resolve(), 100))
  }
}

main()
