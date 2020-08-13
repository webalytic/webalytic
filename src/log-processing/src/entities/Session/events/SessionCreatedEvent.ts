import { SessionCreatedEventPayload } from '@shared/log-processing/log_processing_events'
import { session } from '@shared/log-processing/session'
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
