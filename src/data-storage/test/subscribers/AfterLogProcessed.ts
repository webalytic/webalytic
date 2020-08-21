/* eslint-disable no-new */
import EventConsumer from '@webalytic/ms-tools/lib/infra/EventConsumer'
import faker from 'faker'
import moment from 'moment'
import { expect } from 'chai'
import AfterLogProcessed from '../../src/subscribers/AfterLogProcessed'
import SessionStorage from '../../src/infra/SessionStorage'
import { HitType } from '../../src/constants'

describe('AfterLogProcessed', () => {
  let afterLogProcessed: AfterLogProcessed
  let sessionStorage: SessionStorage
  let eventConsumer: EventConsumer

  before(async () => {
    sessionStorage = new SessionStorage()
    eventConsumer = new EventConsumer({
      server: process.env.NATS_SERVER || 'nats://localhost:4222',
      cluster: process.env.NATS_CLUSTER || 'webalytic',
      clientId: 'data-storage'
    })

    await eventConsumer.init()

    afterLogProcessed = new AfterLogProcessed({
      eventConsumer,
      sessionStorage
    })
  })

  after(async () => {
    await eventConsumer.destroy()
  })

  it('Should write records to SessionStorage', async () => {
    const evenPayload = {
      hit: {
        type: HitType.PAGEVIEW,
        pageUrl: faker.internet.url(),
        time: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      props: {
        resourceId: faker.random.uuid(),
        date: moment().format('YYYY-MM-DD'),
        sessionId: faker.random.uuid(),
        userId: faker.random.uuid(),
        clientId: faker.random.uuid(),
        sessionStartTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        totals: { hits: 1, pageviews: 1, events: 0 },
        trafficSource: {
          source: faker.random.word(),
          campaign: faker.random.word()
        },
        device: {},
        geoNetwork: {},
        duration: 0
      },
      prevProps: null
    }

    await afterLogProcessed.handler(evenPayload)

    const { data: [session] } = await sessionStorage.query('SELECT * FROM tracker.sessions')
    const { data: [hit] } = await sessionStorage.query('SELECT * FROM tracker.hits')

    expect(session).to.be.deep.equal({
      sign: 1,
      resourceId: evenPayload.props.resourceId,
      date: evenPayload.props.date,
      userId: evenPayload.props.userId,
      sessionId: evenPayload.props.sessionId,
      clientId: evenPayload.props.clientId,
      sessionStartTime: evenPayload.hit.time,
      duration: 0,
      totals_hits: 1,
      totals_pageviews: 1,
      totals_events: 0,
      trafficSource_campaign: evenPayload.props.trafficSource.campaign,
      trafficSource_keyword: '',
      trafficSource_medium: '',
      trafficSource_adContent: '',
      trafficSource_referralPath: '',
      trafficSource_source: evenPayload.props.trafficSource.source,
      device_browser: '',
      device_browserVersion: '',
      device_operatingSystem: '',
      device_operatingSystemVersion: '',
      device_deviceCategory: '',
      geoNetwork_country: 'unknown',
      geoNetwork_region: 'unknown',
      geoNetwork_city: 'unknown'
    })

    expect(hit).to.be.deep.equal({
      resourceId: evenPayload.props.resourceId,
      date: evenPayload.props.date,
      time: evenPayload.hit.time,
      position: 1,
      userId: evenPayload.props.userId,
      sessionId: evenPayload.props.sessionId,
      clientId: evenPayload.props.clientId,
      type: 'pageview',
      dataSource: '',
      page_url: evenPayload.hit.pageUrl,
      event_category: '',
      event_action: '',
      event_label: '',
      event_value: 0,
      transaction_id: '',
      transaction_transactionAffiliation: '',
      transaction_transactionRevenue: 0,
      transaction_productAction: '',
      'products.productSKU': [],
      'products.productName': [],
      'products.productBrand': [],
      'products.productCategory': [],
      'products.productVariant': [],
      'products.productPrice': [],
      'products.productQuantity': [],
      'products.productCouponCode': []
    })
  })
})
