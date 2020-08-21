/* eslint-disable @typescript-eslint/ban-types */

import express from 'express'
import addCubeJs from './cubejs'

export default async function createApp(): Promise<express.Application> {
  const app = express()

  await addCubeJs(app)

  return app
}

export { Application } from 'express'
