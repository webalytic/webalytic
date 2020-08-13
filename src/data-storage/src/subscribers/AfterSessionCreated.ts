import EventConsumer from '@webalytic/ms-tools/lib/infra/EventConsumer'
import Subscriber from '@webalytic/ms-tools/lib/ddd/Subscriber'
import Logger from '@webalytic/ms-tools/lib/logger'

import { ISessionCreatedEventPayload } from '@shared/log-processing/log_processing_events'
import { session } from '@shared/log-processing/session'

import SessionStorage from '../infra/SessionStorage'

const logger = Logger('data-storage/AfterSessionCreated')

interface IDeps{
  eventConsumer: EventConsumer
  sessionStorage: SessionStorage
}

export default class AfterSessionCreated extends Subscriber {
  private sessionStorage: SessionStorage

  constructor({ eventConsumer, sessionStorage }: IDeps) {
    super({
      event: 'SessionCreatedEvent',
      durableName: 'data-storage',
      eventConsumer
    })

    this.sessionStorage = sessionStorage
  }

  async handler({ props, hit }: ISessionCreatedEventPayload): Promise<void> {
    logger.info('AfterSessionCreated')
    logger.debug({ props, hit })

    await this.sessionStorage.insert(
      new session.Hit(hit),
      new session.SessionProps(props)
    )
  }
}
