import { Application } from 'express'
import path from 'path'
import CubejsServerCore from '@cubejs-backend/server-core/core'

import createLogger from '@webalytic/ms-tools/lib/logger'

const logger = createLogger('cube-js')

export default async function addCubeJs(app: Application): Promise<any> {
  const cubeServer = CubejsServerCore.create({
    apiSecret: 'default_api_secret',
    dbType: 'clickhouse',
    devServer: false,
    logger: (msg, params) => {
      logger.debug(`${msg}: ${JSON.stringify(params)}`)
    },
    schemaPath: path.join('src/api/cubejs', 'schema')
  })

  await cubeServer.initApp(app)
  return cubeServer
}
