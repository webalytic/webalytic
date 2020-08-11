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
const SERVICES_DIR = path.join(SHARED_DIR, '/services')
const EVENTS_DIR = path.join(SHARED_DIR, '/events')
const VO_DIR = path.join(SHARED_DIR, '/value-objects')
const PROTOC_GEN_TS_PATH = path.join(__dirname, '../node_modules/.bin/protoc-gen-ts')

const PROTO_FILES = [
  `${PROTO_DIR}/geoip/geoip.proto`
].join(' ')

rimraf.sync(`${SERVICES_DIR}/*`)
rimraf.sync(`${EVENTS_DIR}/*`)
rimraf.sync(`${VO_DIR}/*`)

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/tree/master/examples
shell.exec('grpc_tools_node_protoc '
  + `--plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" `
  + `--grpc_out="${SERVICES_DIR}" `
  + `--js_out="import_style=commonjs,binary:${SERVICES_DIR}" `
  + `--ts_out="${SERVICES_DIR}" `
  + `--proto_path ${PROTO_DIR} ${PROTO_FILES}`)

const PROTO_EVENTS = [
  {
    js: `${EVENTS_DIR}/log-collector-events.js`,
    ts: `${EVENTS_DIR}/log-collector-events.d.ts`,
    proto: [
      `${PROTO_DIR}/shared/session.proto`,
      `${PROTO_DIR}/log-collector/log_collector_events.proto`
    ].join(' ')
  },
  {
    js: `${EVENTS_DIR}/log-processing-events.js`,
    ts: `${EVENTS_DIR}/log-processing-events.d.ts`,
    proto: [
      `${PROTO_DIR}/shared/session.proto`,
      `${PROTO_DIR}/log-processing/log_processing_events.proto`
    ].join(' ')
  },
  {
    js: `${VO_DIR}/session.js`,
    ts: `${VO_DIR}/session.d.ts`,
    proto: [
      `${PROTO_DIR}/shared/session.proto`
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
