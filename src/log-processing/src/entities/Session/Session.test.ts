/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai'
import * as faker from 'faker'
import { session } from '@shared/value-objects/session'
import Session from './Session'

describe('Session unit test', () => {
  describe('Check factory method', () => {
    it('Create instance, not be equal', () => {
      const instance = Session.create({
        resourceId: faker.random.uuid(),
        clientId: faker.random.uuid(),
        userId: faker.random.uuid(),
        device: new session.Device(),
        geoNetwork: new session.GeoNetwork(),
        trafficSource: new session.TrafficSource()
      }, new session.Hit())

      expect(instance).not.be.equal(null)
    })
  })
})
