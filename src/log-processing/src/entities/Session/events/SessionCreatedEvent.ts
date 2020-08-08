import { SessionCreatedEventPayload } from '@shared/events/log-processing-events'
import { session } from '@shared/value-objects/session'
import BaseEvent from './BaseEvent'

export default class SessionCreatedEvent extends BaseEvent {
  public payload: SessionCreatedEventPayload

  constructor(hit: session.Hit, props: session.SessionProps) {
    super('SessionCreatedEvent')

    this.payload = new SessionCreatedEventPayload({
      props,
      hit
    })
  }
}
