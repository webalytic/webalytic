/* eslint-disable @typescript-eslint/ban-types */

import * as express from 'express'
import addCubeJs from './cubejs'

export default function createApp(): express.Application {
  const app = express()

  addCubeJs(app)

  return app
}

export { Application } from 'express'
