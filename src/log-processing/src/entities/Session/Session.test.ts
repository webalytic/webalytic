/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai'
import faker from 'faker'
import { session } from '@webalytic/ms-tools/shared/log-processing/session'
import moment from 'moment'
import Session, { SessionCreateProps } from './Session'
import { HitType, HitSessionControl, HitDataSource } from '../../constants'
import SessionCreatedEvent from './events/SessionCreatedEvent'
import SessionUpdatedEvent from './events/SessionUpdatedEvent'

describe('Session unit test', () => {
  function createSession(props?: Partial<SessionCreateProps>):Session {
    return Session.create({
      resourceId: faker.random.uuid(),
      clientId: faker.random.uuid(),
      userId: faker.random.uuid(),
      device: new session.Device(),
      geoNetwork: new session.GeoNetwork(),
      trafficSource: new session.TrafficSource(),
      customDimensions: [],
      customMetrics: [],
      ...props
    }, new session.Hit({
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      timestamp: moment().unix(),
      type: HitType.PAGEVIEW,
      dataSource: HitDataSource.SDK
    }))
  }

  describe('Session.create(...): Session', () => {
    it('Should return instance of Session', () => {
      const instance = createSession()

      expect(instance).not.be.equal(null)
      expect(instance).instanceOf(Session)
    })

    it('Should add SessionCreatedEvent', () => {
      const instance = createSession()

      const events = instance.getEvents()
      expect(events).not.be.equal(null)
      expect(events.length).to.be.equal(1)
      expect(events[0]).instanceOf(SessionCreatedEvent)
    })

    describe('Input validation', () => {
      function factoryToThrow(props: Partial<SessionCreateProps>) {
        return createSession.bind(createSession, props)
      }

      it('Should throw Should throw validationresourceId invalid pageview UUID and required', () => {
        expect(factoryToThrow({ resourceId: '' })).to.throw('ValidationError')
        expect(factoryToThrow({ resourceId: faker.random.word() })).to.throw('ValidationError')
      })

      it('Should throw validation errors, clientId can be between 1 and 64 size', () => {
        expect(factoryToThrow({ clientId: '' }))
          .to.throw('ValidationError')

        expect(factoryToThrow({ clientId: faker.random.alphaNumeric(65) }))
          .to.throw('ValidationError')
      })

      it('Should throw validation errors, userId can be between 0 and 64 size', () => {
        expect(factoryToThrow({ userId: faker.random.alphaNumeric(65) }))
          .to.throw('ValidationError')
      })
    })
  })

  describe('shouldBeEnd(...): boolean', () => {
    it('Should return TRUE, traffic source changed, pageview hit', () => {
      const instance = createSession()

      const newTrafficSource = new session.TrafficSource({
        source: 'new-source',
        campaign: 'new-campaign'
      })

      const hitTimestamp = instance.props.sessionStartTimestamp
      const result = instance.shouldBeEnd(newTrafficSource, '', HitType.PAGEVIEW, hitTimestamp)

      expect(result).to.be.equal(true)
    })

    it('Should return TRUE, traffic source not changed, session control equal start, pageview hit', () => {
      const instance = createSession()

      const newTrafficSource = new session.TrafficSource()
      const hitTimestamp = instance.props.sessionStartTimestamp

      const result = instance.shouldBeEnd(newTrafficSource, HitSessionControl.START, HitType.PAGEVIEW, hitTimestamp)

      expect(result).to.be.equal(true)
    })

    it('Should return TRUE, traffic source not changed, pageview hit from next day', () => {
      const instance = createSession()

      const newTrafficSource = new session.TrafficSource()
      const hitTimestamp = moment.unix(instance.props.sessionStartTimestamp).add(1, 'days').unix()

      const result = instance.shouldBeEnd(newTrafficSource, null, HitType.PAGEVIEW, hitTimestamp)

      expect(result).to.be.equal(true)
    })

    it('Should return FALSE, traffic source not changed, session control equal start, event hit', () => {
      const instance = createSession()

      const newTrafficSource = new session.TrafficSource()
      const hitTimestamp = instance.props.sessionStartTimestamp

      const result = instance.shouldBeEnd(newTrafficSource, HitSessionControl.START, HitType.EVENT, hitTimestamp)

      expect(result).to.be.equal(false)
    })

    it('Should return FALSE, traffic source changed, event hit', () => {
      const instance = createSession()

      const newTrafficSource = new session.TrafficSource({
        source: 'new-source',
        campaign: 'new-campaign'
      })

      const hitTimestamp = instance.props.sessionStartTimestamp
      const result = instance.shouldBeEnd(newTrafficSource, '', HitType.EVENT, hitTimestamp)

      expect(result).to.be.equal(false)
    })

    it('Should return FALSE, traffic source not changed, pageview hit', () => {
      const instance = createSession()

      const newTrafficSource = new session.TrafficSource()
      const hitTimestamp = instance.props.sessionStartTimestamp

      const result = instance.shouldBeEnd(newTrafficSource, '', HitType.PAGEVIEW, hitTimestamp)

      expect(result).to.be.equal(false)
    })
  })

  describe('addHit(...): boolean', () => {
    it('Should return TRUE, add valid pageview hit', () => {
      const instance = createSession()

      const result = instance.addHit(new session.Hit({
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        type: HitType.PAGEVIEW,
        dataSource: HitDataSource.SDK
      }))

      expect(result).to.be.equal(true)
    })

    it('Should update duration, add valid pageview hit', () => {
      const instance = createSession()

      const result = instance.addHit(new session.Hit({
        time: moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        timestamp: moment().add(10, 'minutes').unix(),
        type: HitType.PAGEVIEW,
        dataSource: HitDataSource.SDK
      }))

      expect(result).to.be.equal(true)
      expect(instance.props.duration).to.be.equal(10 * 60)
    })

    it('Should return TRUE, add valid event hit', () => {
      const instance = createSession()

      const result = instance.addHit(new session.Hit({
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        timestamp: moment().unix(),
        type: HitType.EVENT,
        dataSource: HitDataSource.SDK,
        eventAction: 'event-action',
        eventCategory: 'event-category',
        eventLabel: faker.random.word(),
        eventValue: faker.random.number({ min: 0, max: 9999999 })
      }))

      expect(result).to.be.equal(true)
    })

    it('Should throw validation, add invalid pageview hit', () => {
      const instance = createSession()

      const testFn = instance.addHit.bind(instance, new session.Hit({
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        timestamp: moment().unix(),
        type: faker.random.word(),
        dataSource: faker.random.word()
      }))

      expect(testFn).to.throw('ValidationError')
    })

    it('Should add SessionUpdatedEvent', () => {
      const instance = createSession()

      instance.addHit(new session.Hit({
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        timestamp: moment().unix(),
        type: HitType.PAGEVIEW,
        dataSource: HitDataSource.SDK
      }))

      const events = instance.getEvents()
      expect(events).not.be.equal(null)
      expect(events.length).to.be.equal(2)
      expect(events[0]).instanceOf(SessionCreatedEvent)
      expect(events[1]).instanceOf(SessionUpdatedEvent)
    })

    it('Should merge custom definitions', () => {
      const customDimensions = [new session.CustomDimension({ index: 1, name: 'test', value: 'test' })]
      const customMetrics = [new session.CustomMetric({ index: 1, name: 'test', value: 1 })]

      const instance = createSession({ customDimensions, customMetrics })

      instance.addHit(new session.Hit({
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        timestamp: moment().unix(),
        type: HitType.PAGEVIEW,
        dataSource: HitDataSource.SDK
      }), {
        customDimensions: [
          new session.CustomDimension({ index: 1, name: 'test', value: 'test2' }),
          new session.CustomDimension({ index: 4, name: 'test4', value: 'test4' })
        ],
        customMetrics: [
          new session.CustomMetric({ index: 1, name: 'test', value: 2 }),
          new session.CustomMetric({ index: 2, name: 'test2', value: 4 })
        ]
      })

      expect(instance.props.customDimensions).to.be.deep.equal([
        new session.CustomDimension({ index: 1, name: 'test', value: 'test' }),
        new session.CustomDimension({ index: 4, name: 'test4', value: 'test4' })
      ])

      expect(instance.props.customMetrics).to.be.deep.equal([
        new session.CustomMetric({ index: 1, name: 'test', value: 1 }),
        new session.CustomMetric({ index: 2, name: 'test2', value: 4 })
      ])
    })
  })
})
