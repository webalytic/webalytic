import { createRedis } from '@webalytic/ms-tools/lib/datasources'

const redis = createRedis()

export default async function cleanUp(): Promise<void> {
  await redis.flushdb()
}
