/* eslint-disable @typescript-eslint/ban-types */
import express from 'express'

import createRouter from './router'
import { Dependencies } from './container'

export default function createApp(deps: Dependencies): express.Application {
  const app = express()

  app.use(createRouter(deps))

  return app
}

export { Application } from 'express'
