import EventProducer from '@webalytic/ms-tools/lib/infra/EventProducer'
import { ResourceService } from '@webalytic/ms-tools/shared/configuration/resource_service'
import { LogCollectedEventPayload } from '@webalytic/ms-tools/shared/log-collector/log_collector_events'
import { createFastesValidationError } from '@webalytic/ms-tools/lib/errors'

import { Dependencies } from '../container'

// Todo: "import ... from ..." throw TypeError: fastest_validator_1.default is not a constructor
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Validator = require('fastest-validator')

const v = new Validator()
const payloadSchema = {
  $$strict: false,
  resourceId: { type: 'uuid' },
  clientId: { type: 'string', min: 1, max: 64 }
}
const payloadCheck = v.compile(payloadSchema)

export default class {
  private eventProducer: EventProducer

  private countOfShards: number

  private resourceService: ResourceService

  constructor({ eventProducer, resourceService }: Dependencies) {
    this.countOfShards = +(process.env.LOG_COLLECTOR_SHARDS || 10)
    this.eventProducer = eventProducer
    this.resourceService = resourceService
  }

  public getChannelNameByClientId(clientId: string): string {
    const index = clientId.split('')
      .reduce((sum, char) =>
        sum + char.charCodeAt(0), 0) % this.countOfShards

    return `LogCollectedEvent:${index}`
  }

  private async shouldResourceExist(resourceId: string): Promise<void> {
    const { resources } = await this.resourceService.listResources({
      filter: { id: resourceId }
    })
    if (!resources.length) throw new Error('Unknown resourceId')
  }

  private shouldValidPayload(payload: LogCollectedEventPayload): void {
    const isValid = payloadCheck(payload)
    if (isValid !== true) throw createFastesValidationError(isValid)
  }

  public async collect(payload: LogCollectedEventPayload): Promise<void> {
    this.shouldValidPayload(payload)
    await this.shouldResourceExist(payload.resourceId)

    const channelName = this.getChannelNameByClientId(payload.clientId)

    await this.eventProducer.send(channelName, payload.toJSON())
  }
}
