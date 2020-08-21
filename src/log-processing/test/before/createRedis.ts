import { GenericContainer, StartedTestContainer } from 'testcontainers'

export default async (): Promise<StartedTestContainer> => {
  const container = await (
    new GenericContainer('redis', '5')
      .withCmd(['redis-server', '--requirepass auth'])
      .withExposedPorts(6379)
      .start()
  )

  const host = container.getContainerIpAddress()
  const port = container.getMappedPort(6379)

  process.env.REDIS_HOST = host
  process.env.REDIS_PORT = `${port}`
  process.env.REDIS_PASSWORD = 'auth'

  return container
}
