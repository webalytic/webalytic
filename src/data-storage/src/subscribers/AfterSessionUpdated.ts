import EventConsumer from '@webalytic/ms-tools/lib/infra/EventConsumer'
import Subscriber from '@webalytic/ms-tools/lib/ddd/Subscriber'
import Logger from '@webalytic/ms-tools/lib/logger'
import { ISessionUpdatedEventPayload } from '@shared/events/log-processing-events'
import { session } from '@shared/value-objects/session'
import SessionStorage from '../infra/SessionStorage'

const logger = Logger('data-storage/AfterSessionUpdated')

interface IDeps{
  eventConsumer: EventConsumer
  sessionStorage: SessionStorage
}

export default class AfterSessionUpdated extends Subscriber {
  private sessionStorage: SessionStorage

  constructor({ eventConsumer, sessionStorage }: IDeps) {
    super({
      event: 'SessionUpdatedEvent',
      durableName: 'data-storage',
      eventConsumer
    })

    this.sessionStorage = sessionStorage
  }

  async handler({ props, prevProps, hit }: ISessionUpdatedEventPayload): Promise<void> {
    logger.info('AfterSessionUpdated')
    logger.debug({ props, prevProps, hit })

    await this.sessionStorage.update(
      new session.Hit(hit),
      new session.SessionProps(props),
      new session.SessionProps(prevProps)
    )
  }
}
