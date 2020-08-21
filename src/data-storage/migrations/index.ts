/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/first */
import path from 'path'
import Umzug from 'umzug'
import SequelizeStorage from 'umzug/lib/storages/SequelizeStorage'
import { Sequelize } from 'sequelize/types'

const SCHEMA = 'data_storage'

export const METHOD_UP = 'up'
export const METHOD_DOWN = 'down'

const METHODS = {
  [METHOD_UP]: METHOD_UP,
  [METHOD_DOWN]: METHOD_DOWN
}

export default async function migration(sequelize: Sequelize, method = METHOD_UP): Promise<void> {
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

  if (!(method in METHODS)) throw new Error(`Unknown method: ${method}`)

  await umzug[method]()
}
