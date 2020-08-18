/* eslint-disable no-underscore-dangle */
import { createRedis } from '@webalytic/ms-tools/lib/datasources'
import EventProducer from '@webalytic/ms-tools/lib/infra/EventProducer'
import { session } from '@webalytic/ms-tools/shared/log-processing/session'
import Session from '../entities/Session/Session'
import { Dependencies } from '../container'

interface ISessionPersistance {
  props: session.ISessionProps
  hits: session.IHit[]
}
export default class SessionRepository {
  private eventProducer: EventProducer

  private redis = createRedis()

  constructor({ eventProducer }: Dependencies) {
    this.eventProducer = eventProducer
  }

  private persistanceToDomain(data: ISessionPersistance): Session {
    // Todo: not safe, need refactoring, use data-mapper pattern, class SessionMapper
    const { hits, props } = data

    try {
      const instance = new Session(
        new session.SessionProps(props),
        hits.map((hit) =>
          new session.Hit(hit))
      )
      return instance
    } catch (error) {
      return null
    }
  }

  async get(resourceId: string, clientId: string): Promise<Session | null> {
    const key = this._getKey(resourceId, clientId)
    const data = await this.redis.get(key)

    return data ? this.persistanceToDomain(JSON.parse(data)) : null
  }

  async save(instance: Session): Promise<void> {
    const key = this._getKey(instance.resourceId, instance.clientId)
    const multi = await this.redis.multi()

    multi.set(key, JSON.stringify({
      props: instance.props.toJSON(),
      hits: instance.hits.map((hit) =>
        hit.toJSON())
    }))
    multi.expire(key, 30 * 60)

    try {
      await Promise.all(instance.getEvents().map((e) =>
        this.eventProducer.send(e.event, e.payload.toJSON())))

      await multi.exec()
    } catch (error) {
      await multi.discard()
      throw error
    }
  }

  private _getKey(resourceId: string, clientId: string): string {
    return `sessions:${resourceId}:${clientId}`
  }
}
