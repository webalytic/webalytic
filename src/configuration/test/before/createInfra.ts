import { GenericContainer, StartedTestContainer } from 'testcontainers'
import { createSequelize } from '@webalytic/ms-tools/lib/datasources'
import migration from '../../migrations'

export type InfraContainers = {
  postgres: StartedTestContainer
}

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

  const sequelize = createSequelize()
  await migration(sequelize)
  await sequelize.close()

  return container
}

export default async (): Promise<InfraContainers> => {
  const postgres = await createPostgres()

  return {
    postgres
  }
}
