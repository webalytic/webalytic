import Subscriber from '@webalytic/ms-tools/lib/ddd/Subscriber'
import Logger from '@webalytic/ms-tools/lib/logger'
import { ILogCollectedEventPayload } from '@webalytic/ms-tools/shared/log-collector/log_collector_events'

import { Dependencies } from '../container'
import AddHitInput from '../inputs/AddHitInput'
import Service from '../Service'

import { HitType, HitDataSource } from '../constants'

const logger = Logger('log-processing/AfterLogCollected')

export default class AfterLogCollected extends Subscriber {
  private service: Service

  constructor(index: number, { eventConsumer, service }: Dependencies) {
    super({
      event: `LogCollectedEvent:${index}`,
      durableName: 'log-processing',
      eventConsumer
    })

    this.service = service
  }

  async handler(payload: ILogCollectedEventPayload): Promise<void> {
    logger.debug('AfterLogCollected')
    logger.debug(payload)

    const data: AddHitInput = {
      resourceId: payload.resourceId,
      clientId: payload.clientId,
      userId: payload.userId,

      // ** Session
      sessionControl: payload.sessionControl,
      ip: payload.ip,
      userAgent: payload.userAgent,

      // ** Traffic Sources
      documentReferrer: payload.documentReferrer,
      campaignName: payload.campaignName,
      campaignSource: payload.campaignSource,
      campaignMedium: payload.campaignMedium,
      campaignKeyword: payload.campaignKeyword,
      campaignContent: payload.campaignContent,
      campaignId: payload.campaignId,

      // ** System Info
      screenResolution: payload.screenResolution,
      viewportSize: payload.viewportSize,

      // ** Hit
      hit: {
        time: payload.hit.time,
        type: payload.hit.type as HitType,
        dataSource: payload.hit.dataSource as HitDataSource,

        // ** Pageview
        pageUrl: payload.hit.pageUrl,

        // ** Events
        eventCategory: payload.hit.eventCategory,
        eventAction: payload.hit.eventAction,
        eventLabel: payload.hit.eventLabel,
        eventValue: payload.hit.eventValue,

        // ** Enhanced E-Commerce
        transactionId: payload.hit.transactionId,
        transactionAffiliation: payload.hit.transactionAffiliation,
        transactionRevenue: payload.hit.transactionRevenue,
        productAction: payload.hit.productAction,
        productsList: payload.hit.productsList
          ? payload.hit.productsList.map((product) =>
            ({
              productSKU: product.productSku,
              productName: product.productName,
              productBrand: product.productBrand,
              productCategory: product.productCategory,
              productVariant: product.productVariant,
              productPrice: product.productPrice,
              productQuantity: product.productQuantity,
              productCouponCode: product.productCouponCode
            }))
          : [],

        // ** Custom dimensions and metrics
        customDimensions: payload.hit.customDimensions || [],
        customMetrics: payload.hit.customMetrics || []
      },

      // ** Content Information
      documentLocation: payload.documentLocation
    }

    try {
      await this.service.addHitToSession(data)
    } catch (error) {
      logger.error(error)
      if (error.details) logger.error(JSON.stringify(error.details))
    }
  }
}
