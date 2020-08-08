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
const PROTOC_GEN_TS_PATH = path.join(__dirname, '../node_modules/.bin/protoc-gen-ts')

const PROTO_FILES = [
  `${PROTO_DIR}/geoip/geoip.proto`
].join(' ')

rimraf.sync(`${SERVICES_DIR}/*`)

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/tree/master/examples
shell.exec('grpc_tools_node_protoc '
  + `--plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" `
  + `--grpc_out="${SERVICES_DIR}" `
  + `--js_out="import_style=commonjs,binary:${SERVICES_DIR}" `
  + `--ts_out="${SERVICES_DIR}" `
  + `--proto_path ${PROTO_DIR} ${PROTO_FILES}`)
