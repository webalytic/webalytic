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
  customDimensions: session.CustomDimension[]
  customMetrics: session.CustomMetric[]
}

export type SessionEvent = SessionUpdatedEvent | SessionCreatedEvent

interface CustomDefinitions {
  customDimensions: session.CustomDimension[]
  customMetrics: session.CustomMetric[]
}

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

  private incrementTotals(type: string): void {
    this.props.totals.hits += 1

    if (type === HitType.PAGEVIEW) {
      this.props.totals.pageviews += 1
    }

    if (type === HitType.EVENT) {
      this.props.totals.events += 1
    }
  }

  private calcNewDuration(hitProps: session.IHit): void {
    // Todo: handle opt_noninteraction hits
    this.props.duration = hitProps.timestamp - this.props.sessionStartTimestamp
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
      date: moment.unix(hit.timestamp).format('YYYY-MM-DD'),
      sessionId: uuidV4(),
      sessionStartTime: moment.unix(hit.timestamp).format('YYYY-MM-DD HH:mm:ss'),
      sessionStartTimestamp: hit.timestamp,
      totals: new session.SessionTotals({
        hits: 1,
        pageviews: hit.type === HitType.PAGEVIEW ? 1 : 0,
        events: hit.type === HitType.EVENT ? 1 : 0
      }),
      duration: 0
    })

    const instance = new Session(props, [hit])

    const sessionCreatedEvent = new SessionCreatedEvent(hit, instance.props)
    instance.events.push(sessionCreatedEvent)

    return instance
  }

  public addHit(hitProps: session.IHit, sessionCustomDefinition?: CustomDefinitions): boolean {
    addHitInputValidatte(hitProps)

    // Todo add types
    function mergeCustomDefinition(currentDefinitions: any, newDefinitions: any) {
      return [
        ...currentDefinitions,
        ...newDefinitions.filter((newItem) =>
          !currentDefinitions.find((prevItem) =>
            newItem.index === prevItem.index))]
    }

    if (sessionCustomDefinition) {
      this.props.customDimensions = mergeCustomDefinition(
        this.props.customDimensions,
        sessionCustomDefinition.customDimensions
      )
      this.props.customMetrics = mergeCustomDefinition(
        this.props.customMetrics,
        sessionCustomDefinition.customMetrics
      )
    }

    const prevProps = new session.SessionProps(this.props.toJSON())
    const hit = new session.Hit(hitProps)

    this.incrementTotals(hit.type)
    this.calcNewDuration(hit)
    this.hits.push(hit)

    const sessionUpdatedEvent = new SessionUpdatedEvent(hit, this.props, prevProps)
    this.events.push(sessionUpdatedEvent)

    return true
  }

  public shouldBeEnd(
    newTrafficSource: session.TrafficSource | null,
    sessionControl: string,
    hitType: string,
    hitTimestamp: number
  ): boolean {
    return hitType === HitType.PAGEVIEW && (
      sessionControl === HitSessionControl.START
      || this.date !== moment.unix(hitTimestamp).format('YYYY-MM-DD')
      || (!this.trafficSourceIsEmpty(newTrafficSource) && !this.trafficSourceEql(newTrafficSource))
      || moment.duration(moment.unix(hitTimestamp).diff(moment.unix(this.getLastHit().timestamp))).asMinutes() >= 30
    )
  }

  private trafficSourceIsEmpty(newTrafficSource: session.TrafficSource): boolean {
    return JSON.stringify(newTrafficSource.toJSON()) === JSON.stringify(new session.TrafficSource().toJSON())
  }

  private trafficSourceEql(newTrafficSource: session.TrafficSource): boolean {
    return JSON.stringify(newTrafficSource.toJSON()) === JSON.stringify(this.trafficSource.toJSON())
  }

  private getLastHit(): session.Hit {
    return this.hits.sort((a, b) =>
      (a.timestamp < b.timestamp ? 1 : -1))[0]
  }

  public getEvents(): SessionEvent[] {
    return this.events.splice(0, this.events.length)
  }
}
