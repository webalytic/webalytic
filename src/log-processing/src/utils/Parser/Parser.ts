/* eslint-disable no-underscore-dangle */
import { UAParser } from 'ua-parser-js'

import { session } from '@shared/log-processing/seesion'
import SearchEngines from './SearchEngines'

import { TrafficSourceSystemValues } from '../../constants'
import GeoipServiceClient from '../GeoipServiceClient'

interface SearchEngineData {
  name: string
  keyword: string
}

interface CampaignSource {
  campaignSource: string
  campaignName: string
  campaignMedium: string
  campaignKeyword: string
  campaignContent: string
  campaignId: string
}

export default class Parser {
  private geoipServiceClient: GeoipServiceClient

  constructor() {
    this.geoipServiceClient = new GeoipServiceClient()
  }

  getDevice(userAgent: string): session.Device {
    const result = new UAParser(userAgent).getResult()

    return new session.Device({
      browser: result.browser.name || '',
      browserVersion: result.browser.major || '',
      operatingSystem: result.os.name || '',
      operatingSystemVersion: result.os.version || '',
      deviceCategory: result.device.type || ''
    })
  }

  async getGeoNetwork(ipAdress: string): Promise<session.GeoNetwork> {
    let result: session.IGeoNetwork = {
      country: '',
      city: ''
    }

    try {
      result = await this.geoipServiceClient.lookup(ipAdress)
    } catch (err) {
      // Todo: необходимо реализовать сбор ошибок, например через sentry.io
    }

    return new session.GeoNetwork(result)
  }

  getTrafficSource(
    campaignSource: CampaignSource,
    documentLocation: string,
    documentReferrer: string
  ): session.TrafficSource {
    return new session.TrafficSource(
      this._getByCampaignSource(campaignSource)
    || this._getByDocumentLocation(documentLocation)
    || this._getByDocumentReferrer(documentReferrer)
    )
  }

  private _getByCampaignSource(data: CampaignSource): session.ITrafficSource | null {
    let result: session.ITrafficSource = null

    if (data.campaignSource) {
      result = {
        source: data.campaignSource,
        campaign: data.campaignName,
        medium: data.campaignMedium,
        keyword: data.campaignKeyword,
        content: data.campaignContent
      }
    }

    return result
  }

  private _getByDocumentLocation(documentLocation: string): session.ITrafficSource | null {
    let result: session.ITrafficSource = null

    if (documentLocation) {
      const { searchParams } = new URL(documentLocation)
      const source = searchParams.get('utm_source')
      if (source) {
        result = {
          source,
          campaign: searchParams.get('utm_campaign'),
          medium: searchParams.get('utm_medium'),
          keyword: searchParams.get('utm_keyword'),
          content: searchParams.get('utm_content')
        }
      }
    }

    return result
  }

  private _getByDocumentReferrer(documentReferrer: string): session.ITrafficSource | null {
    let result: session.ITrafficSource = null

    if (documentReferrer) {
      const referrer = new URL(documentReferrer)
      const searchEngineData = this._getSearchEngineDataByReferrer(referrer)

      if (searchEngineData) {
        result = {
          source: searchEngineData.name,
          campaign: TrafficSourceSystemValues.NOT_SET,
          medium: TrafficSourceSystemValues.ORGANIC,
          keyword: searchEngineData.keyword || TrafficSourceSystemValues.NOT_PROVIDED,
          content: TrafficSourceSystemValues.NOT_SET
        }
      } else if (!this._isIgnoredReferrer(referrer)) {
        result = {
          source: referrer.hostname,
          campaign: TrafficSourceSystemValues.NOT_SET,
          medium: TrafficSourceSystemValues.REFERRAL,
          keyword: TrafficSourceSystemValues.NOT_SET,
          content: referrer.pathname,
          referralPath: referrer.pathname
        }
      }
    }

    return result
  }

  private _getSearchEngineDataByReferrer(referrer: URL): SearchEngineData | null {
    let result: SearchEngineData = null

    const searchEngine = SearchEngines.find((se) =>
      se.hostnames.includes(referrer.hostname))

    if (searchEngine) {
      const queryParam = searchEngine.queryParams.find((key) =>
        referrer.searchParams.get(key))

      result = {
        name: searchEngine.name,
        keyword: referrer.searchParams.get(queryParam)
      }
    }

    return result
  }

  private _isIgnoredReferrer(referrer: URL): boolean {
    // Todo: Здесь должна быть проверка на список игнорируемых referrer
    // https://support.google.com/analytics/answer/2795830?hl=ru

    return false
  }
}
