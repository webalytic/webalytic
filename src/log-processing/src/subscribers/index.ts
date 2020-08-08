/* eslint-disable no-new */

import AfterLogCollected from './AfterLogCollected'
import { Dependencies } from '../container'

const countOfShards = +(process.env.LOG_COLLECTOR_SHARDS || 10)

export interface SubscribersManager {
  init(): Promise<void>
}

export default (deps: Dependencies): SubscribersManager =>
  ({
    async init(): Promise<void> {
      for (let index = 0; index < countOfShards; index += 1) {
        new AfterLogCollected(index, deps)
      }
    }
  })
