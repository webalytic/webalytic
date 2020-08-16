/* eslint-disable @typescript-eslint/no-var-requires */
import { createClickhouse } from '@webalytic/ms-tools/lib/datasources'

const clickhouse = createClickhouse()

module.exports = {
  up: async () => {
    await clickhouse.querying('CREATE DATABASE tracker')
    await clickhouse.querying(`
      CREATE TABLE tracker.sessions (
        sign Int8,
        resourceId UUID,
        date Date,
        userId String,
        sessionId UUID,
        clientId String,
        sessionStartTime DateTime,
        duration UInt32,

        totals_hits UInt32,
        totals_pageviews UInt32,
        totals_events UInt32,

        trafficSource_campaign LowCardinality(String),
        trafficSource_keyword String,
        trafficSource_medium String,
        trafficSource_adContent String,
        trafficSource_referralPath String,
        trafficSource_source String,

        device_browser LowCardinality(String),
        device_browserVersion LowCardinality(String),
        device_operatingSystem LowCardinality(String),
        device_operatingSystemVersion LowCardinality(String),
        device_deviceCategory LowCardinality(String),

        geoNetwork_country LowCardinality(String),
        geoNetwork_region LowCardinality(String),
        geoNetwork_city LowCardinality(String)
      )
      ENGINE = CollapsingMergeTree(sign)
      PARTITION BY toYYYYMM(date)
      ORDER BY (resourceId, date, MD5(userId), MD5(clientId), sessionId)
      SAMPLE BY MD5(userId) SETTINGS index_granularity = 8192;
    `)

    await clickhouse.querying(`
      CREATE TABLE tracker.hits (
        resourceId UUID,
        date Date,
        position UInt16,
        userId String,
        sessionId UUID,
        clientId String,

        type LowCardinality(String),
        dataSource LowCardinality(String),

        page_url String,

        event_category String,
        event_action String,
        event_label String,
        event_value UInt32,

        transaction_id String,
        transaction_transactionAffiliation LowCardinality(String),
        transaction_transactionRevenue UInt32,
        transaction_productAction LowCardinality(String),

        products Nested (
          productSKU String,
          productName String,
          productBrand String,
          productCategory String,
          productVariant String,
          productPrice UInt32,
          productQuantity UInt32,
          productCouponCode String
        )
      )
      ENGINE = MergeTree()
      PARTITION BY toYYYYMM(date)
      ORDER BY (resourceId, date, MD5(userId), sessionId) SAMPLE BY MD5(userId) SETTINGS index_granularity = 8192;
    `)

    await clickhouse.querying('ALTER TABLE tracker.hits ADD COLUMN time DateTime AFTER date;')
  },
  down: async () => {
    await clickhouse.querying('DROP TABLE IF EXISTS tracker.hits')
    await clickhouse.querying('DROP TABLE IF EXISTS tracker.sessions')
  }
}
