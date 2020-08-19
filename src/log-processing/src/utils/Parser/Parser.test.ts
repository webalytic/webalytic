/* eslint-disable import/no-extraneous-dependencies */
import { createServer, Server } from 'http'
import { expect } from 'chai'
import faker from 'faker'
import { session } from '@webalytic/ms-tools/shared/log-processing/session'
import Parser from './Parser'

let servers: Server[]
function factoryGeoServer({ success }): Promise<Server> {
  const hostname = '127.0.0.1'
  const port = success ? 3000 : 3001

  const server = createServer((req, res) => {
    res.statusCode = success ? 200 : 204
    if (success) {
      res.setHeader('Content-Type', 'application/json')
      res.write(JSON.stringify({ Country: 'RU', City: 'Moskow' }))
    }

    res.end()
  })

  return new Promise((resolve) => {
    server.listen(port, hostname, () =>
      resolve(server))
  })
}

describe('Parser unit test', () => {
  before(async () => {
    servers = await Promise.all([
      factoryGeoServer({ success: true }),
      factoryGeoServer({ success: false })
    ])
  })

  after(() => {
    servers.forEach((server) =>
      server.close())
  })

  describe('Check constructor', () => {
    it('Create instance, not be equal', () => {
      const parser = new Parser()
      expect(parser).not.be.equal(null)
    })
  })

  const emptyTrafficSource = {
    campaignSource: '',
    campaignContent: '',
    campaignKeyword: '',
    campaignMedium: '',
    campaignId: '',
    campaignName: ''
  }
  describe('getTrafficSource', () => {
    it('Send empty return TrafficSource', () => {
      const parser = new Parser()
      const trafficSource = parser.getTrafficSource(emptyTrafficSource, '', '')

      expect(trafficSource.toJSON()).to.be.deep.equal(new session.TrafficSource().toJSON())
    })

    it('Return TrafficSource, send campaign props,not be null, ', () => {
      const parser = new Parser()
      const trafficSource = parser.getTrafficSource({
        ...emptyTrafficSource,
        campaignSource: 'source',
        campaignName: 'campaign',
        campaignMedium: 'cpa'
      }, '', '')

      expect(trafficSource).not.be.equal(null)
    })

    it('Return TrafficSource, send utm params in document location, not be null, ', () => {
      const parser = new Parser()
      const trafficSource = parser.getTrafficSource({
        ...emptyTrafficSource
      }, [
        faker.internet.url(),
        'utm_source=source&utm_campaign=campaign&utm_medium=cpa'
      ].join('?'), '')

      expect(trafficSource).not.be.equal(null)
    })

    it('Return TrafficSource, send referrer, not be null, ', () => {
      const parser = new Parser()
      const trafficSource = parser.getTrafficSource({
        ...emptyTrafficSource
      },
      faker.internet.url(),
      faker.internet.url())

      expect(trafficSource).not.be.equal(null)
    })

    it('Return TrafficSource, send referrer with search engine, not be null, ', () => {
      const parser = new Parser()
      const trafficSource = parser.getTrafficSource({
        ...emptyTrafficSource
      },
      faker.internet.url(),
      'https://www.google.com?q=keyword')

      expect(trafficSource).not.be.equal(null)
    })
  })

  describe('getGeoNetwork', () => {
    it('Return GeoNetwork, not be null', () => {
      const parser = new Parser()
      const geoNetwork = parser.getGeoNetwork(faker.internet.ip())
      expect(geoNetwork).not.be.equal(null)
    })

    it('Return GeoNetwork, with success geo server, not be null', () => {
      process.env.GEOIP_URL = 'http://127.0.0.1:3000'
      const parser = new Parser()
      const geoNetwork = parser.getGeoNetwork(faker.internet.ip())
      expect(geoNetwork).not.be.equal(null)
    })

    it('Return GeoNetwork, with error geo server, not be null', () => {
      process.env.GEOIP_URL = 'http://127.0.0.1:3001'
      const parser = new Parser()
      const geoNetwork = parser.getGeoNetwork(faker.internet.ip())
      expect(geoNetwork).not.be.equal(null)
    })
  })

  describe('getDevice', () => {
    it('Return Device, not be null', () => {
      const parser = new Parser()
      const device = parser.getDevice(faker.internet.userAgent())
      expect(device).not.be.equal(null)
      expect(device).to.have.keys([
        'browser',
        'browserVersion',
        'operatingSystem',
        'operatingSystemVersion',
        'deviceCategory'
      ])
    })
  })
})
