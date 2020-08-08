/* eslint-disable no-new */

import EventConsumer from '@webalytic/ms-tools/lib/infra/EventConsumer'
import SessionStorage from '../infra/SessionStorage'

import AfterSessionCreated from './AfterSessionCreated'
import AfterSessionUpdated from './AfterSessionUpdated'

export default (): any => {
  const eventConsumer = new EventConsumer({
    server: process.env.NATS_SERVER || 'nats://localhost:4222',
    cluster: process.env.NATS_CLUSTER || 'webalytic',
    clientId: 'data-storage'
  })

  const sessionStorage = new SessionStorage()

  return {
    async onInit(): Promise<void> {
      await eventConsumer.init()

      new AfterSessionCreated({
        eventConsumer,
        sessionStorage
      })

      new AfterSessionUpdated({
        eventConsumer,
        sessionStorage
      })
    },
    async onDestroy(): Promise<void> {
      await eventConsumer.destroy()
    }
  }
}
