import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import { createSequelize } from '@webalytic/ms-tools/lib/datasources'
import migration from '../../migrations'

async function createPostgres(): Promise<StartedTestContainer> {
  process.env.POSTGRES_TIMEZONE = '00:00'
  process.env.POSTGRES_DATABASE = 'tracker'
  process.env.POSTGRES_USERNAME = 'tracker'
  process.env.POSTGRES_PASSWORD = 'tracker'

  const container = await (
    new GenericContainer('postgres', '12.2')
      .withExposedPorts(5432)
      .withEnv('POSTGRES_USER', process.env.POSTGRES_USERNAME)
      .withEnv('POSTGRES_PASSWORD', process.env.POSTGRES_PASSWORD)
      .withEnv('POSTGRES_DB', process.env.POSTGRES_DATABASE)
      .start()
  )

  process.env.POSTGRES_HOST = container.getContainerIpAddress()
  process.env.POSTGRES_PORT = container.getMappedPort(5432).toString()

  return container
}

async function createClickhouse(): Promise<StartedTestContainer> {
  const container = await (
    new GenericContainer('yandex/clickhouse-server', '20.3.5.21')
      .withExposedPorts(8123)
      .start()
  )

  process.env.CLICKHOUSE_HOST = container.getContainerIpAddress()
  process.env.CLICKHOUSE_PORT = container.getMappedPort(8123).toString()

  process.env.CUBEJS_DB_HOST = container.getContainerIpAddress()
  process.env.CUBEJS_DB_PORT = container.getMappedPort(8123).toString()
  process.env.CUBEJS_DB_NAME = 'tracker'
  process.env.CUBEJS_DB_TYPE = 'clickhouse'
  process.env.CUBEJS_DB_USER = 'default'
  process.env.CUBEJS_DB_PASS = ''
  process.env.CUBEJS_API_SECRET = 'token'

  return container
}

async function createNatsStreaming():Promise<StartedTestContainer> {
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

export type InfraContainers = {
  clickhouse: StartedTestContainer
  natsStreaming: StartedTestContainer
  postgres: StartedTestContainer
}

export default async (): Promise<InfraContainers> => {
  const [clickhouse, natsStreaming, postgres] = await Promise.all([
    createClickhouse(),
    createNatsStreaming(),
    createPostgres()
  ])

  const sequelize = createSequelize()
  await migration(sequelize)
  await sequelize.close()

  return {
    clickhouse,
    natsStreaming,
    postgres
  }
}
