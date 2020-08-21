import createInfra, { InfraContainers } from './before/createInfra'

/* eslint-disable global-require */
describe('Data storage', () => {
  let infra: InfraContainers
  let exitCode = 1
  before(async () => {
    infra = await createInfra()
  })

  // eslint-disable-next-line func-names
  after(async () => {
    await Promise.all([
      infra.clickhouse.stop(),
      infra.natsStreaming.stop(),
      infra.postgres.stop()
    ])

    // Todo: need fix cubejs-server-core and close process problem
    setTimeout(() => {
      process.exit(exitCode)
    }, 2000)
  })

  describe('Query Engine', () => {
    require('./api')
  })

  describe('Subsribers', () => {
    require('./subscribers/AfterLogProcessed')
  })

  // Todo: need fix cubejs-server-core and close process problem
  describe('End', () => {
    it('Last test case, set exitCode = 0, fix bug extend express with cubejs-server-core', () => {
      exitCode = 0
    })
  })
})
