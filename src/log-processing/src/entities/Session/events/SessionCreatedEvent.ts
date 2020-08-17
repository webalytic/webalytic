import { LogProcessedEventPayload } from '@webalytic/ms-tools/shared/log-processing/log_processing_events'
import { session } from '@webalytic/ms-tools/shared/log-processing/session'
import BaseEvent from './BaseEvent'

export default class SessionCreatedEvent extends BaseEvent {
  public payload: LogProcessedEventPayload

  constructor(hit: session.Hit, props: session.SessionProps) {
    super()

    this.payload = new LogProcessedEventPayload({
      props,
      hit
    })
  }
}
