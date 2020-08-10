import EventProducer from '@webalytic/ms-tools/lib/infra/EventProducer'
import { LogCollectedEventPayload } from '@shared/events/log-collector-events'
import { Dependencies } from '../container'

export default class {
  private eventProducer: EventProducer

  private countOfShards: number

  constructor({ eventProducer }: Dependencies) {
    this.countOfShards = +(process.env.LOG_COLLECTOR_SHARDS || 10)
    this.eventProducer = eventProducer
  }

  public getChannelNameByClientId(clientId: string): string {
    const index = clientId.split('')
      .reduce((sum, char) =>
        sum + char.charCodeAt(0), 0) % this.countOfShards

    return `LogCollectedEvent:${index}`
  }

  public async collect(payload: LogCollectedEventPayload): Promise<void> {
    const { resourceId, clientId } = payload
    if (!resourceId || !clientId) throw new Error()
    // Todo: validation input data

    // Todo: implement invariant - resourceId should be exists

    const channelName = this.getChannelNameByClientId(payload.clientId)

    await this.eventProducer.send(channelName, payload.toJSON())
  }
}
