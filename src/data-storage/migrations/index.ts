/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/first */
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

import { createSequelize } from '@webalytic/ms-tools/lib/datasources'

import Umzug from 'umzug'
import SequelizeStorage from 'umzug/lib/storages/SequelizeStorage'

const sequelize = createSequelize()
const SCHEMA = 'data-storage'

async function main() {
  try {
    await sequelize.query(`CREATE SCHEMA ${SCHEMA}`)
  } catch (error) {
    // schema already exists
  }

  const umzug = new Umzug({
    migrations: {
      pattern: /\.ts$/,
      path: path.join(__dirname, '/commands'),
      params: [
        sequelize.getQueryInterface()
      ]
    },
    storage: new SequelizeStorage({ sequelize, schema: SCHEMA })
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
