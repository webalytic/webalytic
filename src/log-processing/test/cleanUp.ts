import { redis } from '@webalytic/ms-tools/lib/datasources'

export default async function cleanUp(): Promise<void> {
  await redis.flushdb()
}
