/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/first */
import dotenv from 'dotenv'
import { createSequelize } from '@webalytic/ms-tools/lib/datasources'
import migration, { METHOD_UP } from '../migrations'

async function main() {
  dotenv.config()

  const sequelize = createSequelize()
  const method = process.argv[2] || METHOD_UP

  await migration(sequelize, method)

  await sequelize.close()
  process.exit()
}

main()
