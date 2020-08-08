import { Application } from 'express'
import * as path from 'path'
import * as CubejsServerCore from '@cubejs-backend/server-core/core'

import createLogger from '@webalytic/ms-tools/lib/logger'

const logger = createLogger('cube-js')

export default function addCubeJs(app: Application): void {
  CubejsServerCore.create({
    apiSecret: 'default_api_secret',
    dbType: 'clickhouse',
    devServer: false,
    logger: (msg, params) => {
      logger.info(`${msg}: ${JSON.stringify(params)}`)
    },
    schemaPath: path.join('src/api/cubejs', 'schema')
  }).initApp(app)
}
