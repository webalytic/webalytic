/* eslint-disable @typescript-eslint/no-var-requires */
import * as path from 'path'
import * as shell from 'shelljs'
import * as rimraf from 'rimraf'
import * as fs from 'fs'

// https://github.com/shelljs/shelljs/issues/469
process.env.PATH += (path.delimiter + path.join(process.cwd(), 'node_modules', '.bin'))

let PROTO_DIR = path.join(__dirname, '../node_modules/@webalytic/protorepo')

// Todo: bad code, need solution with clean require protobuf files
try {
  fs.statSync(PROTO_DIR)
} catch (error) {
  PROTO_DIR = path.join(__dirname, '../../../node_modules/@webalytic/protorepo')
}

const SHARED_DIR = path.join(__dirname, '../shared')
const EVENTS_DIR = path.join(SHARED_DIR, '/events')

rimraf.sync(`${EVENTS_DIR}/*`)

const PROTO_EVENTS = [
  {
    js: `${EVENTS_DIR}/log-collector-events.js`,
    ts: `${EVENTS_DIR}/log-collector-events.d.ts`,
    proto: [
      `${PROTO_DIR}/shared/session.proto`,
      `${PROTO_DIR}/log-collector/log-collector-events.proto`
    ].join(' ')
  },
  {
    js: `${EVENTS_DIR}/log-processing-events.js`,
    ts: `${EVENTS_DIR}/log-processing-events.d.ts`,
    proto: [
      `${PROTO_DIR}/shared/session.proto`,
      `${PROTO_DIR}/log-processing/log-processing-events.proto`
    ].join(' ')
  }
]

// eslint-disable-next-line no-restricted-syntax
for (const protoEvent of PROTO_EVENTS) {
  shell.exec('pbjs '
  + '-t static-module '
  + '-w commonjs '
  + `-o ${protoEvent.js} ${protoEvent.proto}`)

  shell.exec(`pbts -o ${protoEvent.ts} ${protoEvent.js}`)
}
