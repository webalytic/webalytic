/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv'
import * as path from 'path'
import { sequelize } from '@webalytic/ms-tools/lib/datasources'

dotenv.config()

const Umzug = require('umzug')

async function main() {
  const umzug = new Umzug({
    migrations: {
      pattern: /\.ts$/,
      path: path.join(__dirname, '/commands'),
      params: [
        sequelize.getQueryInterface()
      ]
    },
    storage: 'sequelize',
    storageOptions: {
      sequelize
    }
  })

  const METHOD_UP = 'up'
  const METHOD_DOWN = 'down'
  const methods = new Set([METHOD_UP, METHOD_DOWN])
  const method = process.argv[2] || METHOD_UP
  if (!methods.has(method)) throw new Error(`Unknown method: ${method}`)

  await umzug[method]()

  process.exit(0)
}

main()
