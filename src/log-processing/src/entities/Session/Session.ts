import moment from 'moment'
import { v4 as uuidV4 } from 'uuid'
import { session } from '@webalytic/ms-tools/shared/log-processing/session'

import { HitSessionControl, HitType, TrafficSourceSystemValues } from '../../constants'

import SessionCreatedEvent from './events/SessionCreatedEvent'
import SessionUpdatedEvent from './events/SessionUpdatedEvent'
import { createInputValidate, addHitInputValidatte } from './Validator'

export interface SessionCreateProps {
  resourceId: string
  userId: string
  clientId: string
  trafficSource: session.TrafficSource
  device: session.Device
  geoNetwork: session.GeoNetwork
}

export type SessionEvent = SessionUpdatedEvent | SessionCreatedEvent

export default class Session {
  props: session.SessionProps

  hits: session.Hit[]

  private events: SessionEvent[] = []

  get resourceId():string {
    return this.props.resourceId
  }

  get clientId():string {
    return this.props.clientId
  }

  get date(): string {
    return this.props.date
  }

  get trafficSource(): session.TrafficSource {
    return new session.TrafficSource(this.props.trafficSource)
  }

  constructor(props: session.SessionProps, hits: session.Hit[]) {
    this.props = props
    this.hits = hits
  }

  static create(data: SessionCreateProps, hitProps: session.IHit): Session {
    createInputValidate(data, hitProps)

    const hit = new session.Hit(hitProps)

    const props = new session.SessionProps({
      ...data,
      trafficSource: new session.TrafficSource(data.trafficSource || {
        source: TrafficSourceSystemValues.DIRECT,
        campaign: TrafficSourceSystemValues.DIRECT,
        medium: TrafficSourceSystemValues.NONE,
        content: TrafficSourceSystemValues.NOT_SET,
        keyword: TrafficSourceSystemValues.NOT_SET
      }),
      date: moment().format('YYYY-MM-DD'),
      sessionId: uuidV4(),
      sessionStartTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      totals: new session.SessionTotals({
        hits: 1,
        pageviews: hit.type === HitType.PAGEVIEW ? 1 : 0
      })
    })

    const instance = new Session(props, [hit])

    const sessionCreatedEvent = new SessionCreatedEvent(hit, instance.props)
    instance.events.push(sessionCreatedEvent)

    return instance
  }

  public addHit(hitProps: session.IHit): boolean {
    addHitInputValidatte(hitProps)

    const prevProps = new session.SessionProps(this.props.toJSON())
    const hit = new session.Hit(hitProps)

    this.props.totals.hits += 1

    if (hit.type === HitType.PAGEVIEW) {
      this.props.totals.pageviews += 1
    }

    this.hits.push(hit)

    const sessionUpdatedEvent = new SessionUpdatedEvent(hit, this.props, prevProps)
    this.events.push(sessionUpdatedEvent)

    return true
  }

  public shouldBeEnd(newTrafficSource: session.TrafficSource | null, sessionControl: string, hitType: string): boolean {
    return hitType === HitType.PAGEVIEW && (
      sessionControl === HitSessionControl.START
      || this.date !== moment().format('YYYY-MM-DD')
      || (newTrafficSource && !this.trafficSourceEql(newTrafficSource))
    )
  }

  private trafficSourceEql(newTrafficSource: session.TrafficSource): boolean {
    return JSON.stringify(newTrafficSource.toJSON()) === JSON.stringify(this.trafficSource.toJSON())
  }

  public getEvents(): SessionEvent[] {
    return this.events.splice(0, this.events.length)
  }
}
