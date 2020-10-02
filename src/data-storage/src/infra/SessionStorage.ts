import moment from 'moment'

import { createClickhouse } from '@webalytic/ms-tools/lib/datasources'
import { session } from '@webalytic/ms-tools/shared/log-processing/session'

export default class SessionStorage {
  private clickhouse = createClickhouse()

  async query(sql: string): Promise<any> {
    return this.clickhouse.querying(sql, { dataObjects: true })
  }

  async insert(hit: session.Hit, props: session.SessionProps): Promise<void> {
    await this.writeSession([
      this.sessionToTabSeparated(props)
    ])
    await this.writeHit(this.hitToTabSeparated(props, hit))
  }

  async update(hit: session.Hit, props: session.SessionProps, prevProps: Partial<session.SessionProps>): Promise<void> {
    await this.writeSession([
      this.sessionToTabSeparated(new session.SessionProps({ ...props, ...prevProps }), true),
      this.sessionToTabSeparated(props)
    ])
    await this.writeHit(this.hitToTabSeparated(props, hit))
  }

  private async writeSession(rows: any): Promise<void> {
    await new Promise((resolve, reject) => {
      const writableStream = this.clickhouse.query('INSERT INTO tracker.sessions FORMAT TabSeparated', (err) => {
        if (err) { reject(err) } else { resolve() }
      })
      writableStream.write(rows.join('\n'))
      writableStream.end()
    })
  }

  private async writeHit(row: any[]): Promise<void> {
    await new Promise((resolve, reject) => {
      const writableStream = this.clickhouse.query('INSERT INTO tracker.hits FORMAT TabSeparated', (err) => {
        if (err) { reject(err) } else { resolve() }
      })
      writableStream.write(row)
      writableStream.end()
    })
  }

  private sessionToTabSeparated(props: session.SessionProps, isPrevious = false): string {
    const valuesForCh = [
      isPrevious ? -1 : 1,
      props.resourceId,
      props.date,
      props.userId || '',
      props.sessionId,
      props.clientId || '',
      moment.unix(props.sessionStartTimestamp).format('YYYY-MM-DD HH:mm:ss'),
      props.duration,

      props.totals.hits,
      props.totals.pageviews,
      props.totals.events,

      props.trafficSource.campaign,
      props.trafficSource.keyword || '',
      props.trafficSource.medium || '',
      props.trafficSource.content || '',
      props.trafficSource.referralPath || '',
      props.trafficSource.source || '',

      props.device.browser || '',
      props.device.browserVersion || '',
      props.device.operatingSystem || '',
      props.device.operatingSystemVersion || '',
      props.device.deviceCategory || '',

      props.geoNetwork.country || 'unknown',
      props.geoNetwork.region || 'unknown',
      props.geoNetwork.city || 'unknown'
    ]

    return valuesForCh.join('\t')
  }

  private hitToTabSeparated(props: session.SessionProps, hit: session.Hit): any[] {
    const position = props.totals.hits

    const valuesForCh = [
      props.resourceId,
      props.date,
      moment.unix(hit.timestamp).format('YYYY-MM-DD HH:mm:ss'),
      position,
      props.userId || '',
      props.sessionId,
      props.clientId,

      hit.type,
      hit.dataSource || '',

      hit.pageUrl || '',

      hit.eventCategory || '',
      hit.eventAction || '',
      hit.eventLabel || '',
      hit.eventValue || 0,

      hit.transactionId || '',
      hit.transactionAffiliation || '',
      hit.transactionRevenue || 0,
      hit.productAction || '',

      ...hit.productsList.reduce((acc, product) => {
        acc[0].push(product.productSku)
        acc[1].push(product.productName)
        acc[2].push(product.productBrand)
        acc[3].push(product.productCategory)
        acc[4].push(product.productVariant)
        acc[5].push(product.productPrice)
        acc[6].push(product.productQuantity)
        acc[7].push(product.productCouponCode)

        return acc
      }, ([...new Array(8)]).map(() =>
        [])).map((arr) =>
        JSON.stringify(arr).replace(/"/g, "'"))
    ]

    return valuesForCh
  }
}
