import { AwilixContainer } from 'awilix'
import * as express from 'express'

import createContainer, { Dependencies } from '../../src/container'
import createApp from '../../src/app'

type ApplicationWithContainer = {
  container: AwilixContainer<Dependencies>
  app: express.Application
}

export default (): ApplicationWithContainer => {
  const container = createContainer()
  const app = container.build(createApp)

  return {
    container,
    app
  }
}
