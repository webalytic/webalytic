/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai'
import * as faker from 'faker'
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
      ...props
    }, new session.Hit({
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
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
      const result = instance.shouldBeEnd(newTrafficSource, '', HitType.PAGEVIEW)

      expect(result).to.be.equal(true)
    })

    it('Should return FALSE, traffic source changed, event hit', () => {
      const instance = createSession()

      const newTrafficSource = new session.TrafficSource({
        source: 'new-source',
        campaign: 'new-campaign'
      })
      const result = instance.shouldBeEnd(newTrafficSource, '', HitType.EVENT)

      expect(result).to.be.equal(false)
    })

    it('Should return FALSE, traffic source not changed, pageview hit', () => {
      const instance = createSession()

      const newTrafficSource = new session.TrafficSource()
      const result = instance.shouldBeEnd(newTrafficSource, '', HitType.PAGEVIEW)

      expect(result).to.be.equal(false)
    })

    it('Should return TRUE, traffic source not changed, session control equal start, pageview hit', () => {
      const instance = createSession()

      const newTrafficSource = new session.TrafficSource()
      const result = instance.shouldBeEnd(newTrafficSource, HitSessionControl.START, HitType.PAGEVIEW)

      expect(result).to.be.equal(true)
    })

    it('Should return FALSE, traffic source not changed, session control equal start, event hit', () => {
      const instance = createSession()

      const newTrafficSource = new session.TrafficSource()
      const result = instance.shouldBeEnd(newTrafficSource, HitSessionControl.START, HitType.PAGEVIEW)

      expect(result).to.be.equal(true)
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

    it('Should return TRUE, add valid event hit', () => {
      const instance = createSession()

      const result = instance.addHit(new session.Hit({
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
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
        type: faker.random.word(),
        dataSource: faker.random.word()
      }))

      expect(testFn).to.throw('ValidationError')
    })

    it('Should add SessionUpdatedEvent', () => {
      const instance = createSession()

      instance.addHit(new session.Hit({
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        type: HitType.PAGEVIEW,
        dataSource: HitDataSource.SDK
      }))

      const events = instance.getEvents()
      expect(events).not.be.equal(null)
      expect(events.length).to.be.equal(2)
      expect(events[0]).instanceOf(SessionCreatedEvent)
      expect(events[1]).instanceOf(SessionUpdatedEvent)
    })
  })
})
