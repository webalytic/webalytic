import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'

export default async (): Promise<StartedTestContainer> => {
  const CLUSTER_ID = 'test-cluster'
  const natsStreamingContainer = await (
    new GenericContainer('nats-streaming', '0.17.0-linux')
      .withExposedPorts(4222)
      .withWaitStrategy(Wait.forLogMessage('Streaming Server is ready'))
      .start()
  )

  const host = natsStreamingContainer.getContainerIpAddress()
  const port = natsStreamingContainer.getMappedPort(4222)

  process.env.NATS_SERVER = `nats://${host}:${port}`
  process.env.NATS_CLUSTER = CLUSTER_ID

  return natsStreamingContainer
}
