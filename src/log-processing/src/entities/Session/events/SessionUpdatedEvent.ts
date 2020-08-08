import { SessionUpdatedEventPayload } from '@shared/events/log-processing-events'
import { session } from '@shared/value-objects/session'
import BaseEvent from './BaseEvent'

export default class SessionUpdatedEvent extends BaseEvent {
  public payload: SessionUpdatedEventPayload

  constructor(hit: session.Hit, props: session.SessionProps, prevProps: session.SessionProps) {
    super('SessionUpdatedEvent')

    this.payload = new SessionUpdatedEventPayload({
      props,
      prevProps,
      hit
    })
  }
}
