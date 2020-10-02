import { getClientIp } from 'request-ip'
import moment from 'moment'

import LogCollectorService from 'services/LogCollectorService'
import {
  LogCollectedEventPayload,
  ILogCollectedEventPayload
} from '@webalytic/ms-tools/shared/log-collector/log_collector_events'
import createLogger from '@webalytic/ms-tools/lib/logger'
import { Request, Response } from '../types'
import { Dependencies } from '../container'

const logger = createLogger('log-collector/MainController')

enum CUSTOM_DEFINITION_PREFIX {
  DIMENSION = 'cd',
  METRIC = 'cm'
}
export default class MainController {
  private logCollectorService: LogCollectorService

  constructor({ logCollectorService }: Dependencies) {
    this.logCollectorService = logCollectorService
  }

  index(req: Request, res: Response): void {
    res.write('OK')
    res.end()
  }

  async collect(req: Request, res: Response): Promise<void> {
    const url = new URL(`http://127.0.0.1${req.url}`)
    const query = new URLSearchParams(url.search)
    // const cacheBuster = query.get('z')

    const baseHeaderProps = {
      ip: query.get('uip') || getClientIp(req),
      userAgent: query.get('ua') || req.headers['user-agent']
    }

    const data: ILogCollectedEventPayload = {
      // ** General
      resourceId: query.get('tid'),

      // ** User
      clientId: query.get('cid'),
      userId: query.get('uid'),

      // ** Session
      sessionControl: query.get('sc'),
      ...baseHeaderProps,

      // ** Traffic Sources
      documentReferrer: query.get('dr'),
      campaignName: query.get('cn'),
      campaignSource: query.get('cs'),
      campaignMedium: query.get('cm'),
      campaignKeyword: query.get('ck'),
      campaignContent: query.get('cc'),
      campaignId: query.get('ci'),

      // ** System Info
      screenResolution: query.get('sr'), // Example 800x800
      viewportSize: query.get('vp'), // Example 123x456

      hit: {
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        timestamp: moment().unix(),
        type: query.get('t'),
        dataSource: query.get('ds'),
        pageUrl: query.get('dl'),

        // ** Events
        eventCategory: query.get('ec'),
        eventAction: query.get('ea'),
        eventLabel: query.get('el'),
        eventValue: +query.get('ev') || 0,

        // ** Enhanced E-Commerce
        transactionId: query.get('ti'),
        transactionAffiliation: query.get('ta'),
        transactionRevenue: +query.get('tr') || 0,
        productAction: query.get('pa'), // detail, click, add, remove, checkout, checkout_option, purchase, refund
        productsList: [...query.keys()]
          .filter((key) =>
            /ˆpr([1-9]|[1-9][0-9]|[1][0-9][0-9])id$/.test(key))
          .map((idKey) => {
            const propPrefix = idKey.replace('id', '')
            const product = {
              productSKU: query.get(`${propPrefix}id`), // Example: P12345
              productName: query.get(`${propPrefix}nm`), // Example: Brand T-Shirt
              productBrand: query.get(`${propPrefix}br`), // Example: Brand
              productCategory: query.get(`${propPrefix}ca`), // Example: Apparel/Mens/T-Shirts
              productVariant: query.get(`${propPrefix}va`), // Example: Black
              productPrice: +query.get(`${propPrefix}pr`) || 0, // Example: 29.03
              productQuantity: +query.get(`${propPrefix}qt`) || 0, // Example: 2.5
              productCouponCode: query.get(`${propPrefix}cc`) // Example: SUMMER_SALE13
            }

            return product
          }),
        customDimensions: this.getDefinition(query, req, baseHeaderProps, CUSTOM_DEFINITION_PREFIX.DIMENSION)
          .map(({ key, value }) =>
            ({
              index: +key.replace('cd', ''),
              value
            })),
        customMetrics: this.getDefinition(query, req, baseHeaderProps, CUSTOM_DEFINITION_PREFIX.METRIC)
          .map(({ key, value }) =>
            ({
              index: +key.replace('cm', ''),
              value: +value
            }))
      },

      // ** Content Information
      documentLocation: query.get('dl')
    }

    try {
      await this.logCollectorService.collect(new LogCollectedEventPayload(data))
    } catch (error) {
      logger.debug(error)
    }

    res.status(204).end()
  }

  private getDefinition(
    query: URLSearchParams,
    req: Request,
    baseHeaderProps: any,
    prefix: CUSTOM_DEFINITION_PREFIX
  ): {key:string; value: string}[] {
    const result = []
    const isMetric = prefix === CUSTOM_DEFINITION_PREFIX.METRIC
    const regExp = new RegExp(`^${prefix}([1-9]|[1-9][0-9]|[1][0-9][0-9])$`)
    // eslint-disable-next-line no-restricted-syntax
    for (const key of [...query.keys()]) {
      // eslint-disable-next-line no-restricted-globals
      if (regExp.test(key) && (!isMetric || !isNaN(+query.get(key)))) {
        result.push({
          key,
          value: this.replaceMacrosInCustomDefinition(query.get(key), baseHeaderProps, req)
        })
      }
    }
    return result
  }

  private replaceMacrosInCustomDefinition(value: string, baseHeaderProps: any, req: Request) {
    return value
      .replace('{USER_AGENT}', baseHeaderProps.userAgent)
      .replace('{IP_ADDRESS}', baseHeaderProps.ip)
      .replace(
        /^{H_(.*)}$/,
        (_, p): string =>
          (req.headers[(p || '').toLowerCase()] || '').toString()
      )
  }
}
