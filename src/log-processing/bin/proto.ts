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
buildClasess()

// **
function clearSharedDir() {
  rimraf.sync(`${SHARED_DIR}/log-processing/*`)
  rimraf.sync(`${SHARED_DIR}/log-collector/*`)
  rimraf.sync(`${SHARED_DIR}/geoip/*`)
}

function buildClasess() {
  const PROTO_DIR = getProtoDir()
  const PROTO_FILES = [
    {
      filePrefix: '/geoip/geoip',
      protos: [
        '/geoip/geoip.proto'
      ]
    },
    {
      filePrefix: '/log-processing/session',
      protos: [
        '/log-processing/session.proto'
      ]
    },
    {
      filePrefix: '/log-processing/log_processing_events',
      protos: [
        '/log-processing/session.proto',
        '/log-processing/log_processing_events.proto'
      ]
    },
    {
      filePrefix: '/log-collector/log_collector_events',
      protos: [
        '/log-processing/session.proto',
        '/log-collector/log_collector_events.proto'
      ]
    }
  ]

  // eslint-disable-next-line no-restricted-syntax
  for (const fileObj of PROTO_FILES) {
    const { filePrefix, protos } = fileObj
    const js = `${SHARED_DIR}${filePrefix}.js`
    const ts = `${SHARED_DIR}${filePrefix}.d.ts`
    const proto = protos.map((x) => {
      shell.exec(`cp ${PROTO_DIR}${x} ${SHARED_DIR}${x}`)
      return `${PROTO_DIR}${x}`
    }).join(' ')

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
