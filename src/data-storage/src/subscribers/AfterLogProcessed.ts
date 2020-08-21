import EventConsumer from '@webalytic/ms-tools/lib/infra/EventConsumer'
import Subscriber from '@webalytic/ms-tools/lib/ddd/Subscriber'
import Logger from '@webalytic/ms-tools/lib/logger'

import { ILogProcessedEventPayload } from '@webalytic/ms-tools/shared/log-processing/log_processing_events'
import { session } from '@webalytic/ms-tools/shared/log-processing/session'

import SessionStorage from '../infra/SessionStorage'

const logger = Logger('data-storage/AfterLogProcessed')

interface IDeps{
  eventConsumer: EventConsumer
  sessionStorage: SessionStorage
}

export default class AfterLogProcessed extends Subscriber {
  private sessionStorage: SessionStorage

  constructor({ eventConsumer, sessionStorage }: IDeps) {
    super({
      event: 'LogProcessedEvent',
      durableName: 'data-storage',
      eventConsumer
    })

    this.sessionStorage = sessionStorage
  }

  async handler({ hit, props, prevProps }: ILogProcessedEventPayload): Promise<void> {
    logger.debug('AfterLogProcessed')
    logger.debug({ props, hit })

    if (prevProps) {
      await this.sessionStorage.update(
        new session.Hit(hit),
        new session.SessionProps(props),
        new session.SessionProps(prevProps)
      )
    } else {
      await this.sessionStorage.insert(
        new session.Hit(hit),
        new session.SessionProps(props)
      )
    }
  }
}
