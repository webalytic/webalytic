/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as path from 'path'
import * as shell from 'shelljs'
import * as rimraf from 'rimraf'
import * as fs from 'fs'

// https://github.com/shelljs/shelljs/issues/469
process.env.PATH += (path.delimiter + path.join(process.cwd(), 'node_modules', '.bin'))

const SHARED_DIR = path.join(__dirname, '../shared')

clearSharedDir()
buildService()
buildClasess()

// **
function clearSharedDir() {
  rimraf.sync(`${SHARED_DIR}/configuration/*`)
}

function buildService() {
  const PROTO_DIR = getProtoDir()
  const PROTOC_GEN_TS_PATH = path.join(__dirname, '../node_modules/.bin/protoc-gen-ts')
  const PROTO_FILES = [
    `${PROTO_DIR}/configuration/resource.proto`,
    `${PROTO_DIR}/configuration/resource_service.proto`
  ].join(' ')

  // https://github.com/agreatfool/grpc_tools_node_protoc_ts/tree/master/examples
  shell.exec('grpc_tools_node_protoc '
+ `--plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" `
+ `--grpc_out="${SHARED_DIR}" `
+ `--js_out="import_style=commonjs,binary:${SHARED_DIR}" `
+ `--ts_out="${SHARED_DIR}" `
+ `--proto_path ${PROTO_DIR} ${PROTO_FILES}`)
}

function buildClasess() {
  const PROTO_DIR = getProtoDir()
  const PROTO_FILES = [
    {
      filePrefix: '/configuration/resource',
      protos: [
        '/configuration/resource.proto'
      ]
    }
  ]

  // eslint-disable-next-line no-restricted-syntax
  for (const fileObj of PROTO_FILES) {
    const { filePrefix, protos } = fileObj
    const js = `${SHARED_DIR}${filePrefix}.js`
    const ts = `${SHARED_DIR}${filePrefix}.d.ts`
    const proto = protos.map((x) =>
      `${PROTO_DIR}${x}`).join(' ')

    shell.exec('pbjs '
    + '-t static-module '
    + '-w commonjs '
    + `-o ${js} ${proto}`)

    shell.exec(`pbts -o ${ts} ${js}`)
  }
}

function getProtoDir() {
  let result = path.join(__dirname, '../node_modules/@webalytic/protorepo')

  // Todo: bad code, need solution with clean require protobuf files
  try {
    fs.statSync(result)
  } catch (error) {
    result = path.join(__dirname, '../../../node_modules/@webalytic/protorepo')
  }

  return result
}