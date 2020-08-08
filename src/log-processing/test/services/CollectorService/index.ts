import * as qs from 'querystring'
import * as request from 'supertest'
import { expect } from 'chai'
import { v4 as uuidV4 } from 'uuid'
import createContainer from '../../../src/container'

import cleanUp from '../../cleanUp'

process.env.NODE_ENV = 'test'

const container = createContainer()

const { collectorService } = container.cradle

// Todo: Тесты не тестируют, нужно писать тесты разного уровня
describe('CollectorService', () => {
  before(async () => {
    await cleanUp()
  })

  describe('addHitToBuffer(data: AddHitInput): Promise<void>', () => {
    it('Should throw Error, unknown Resource', () => {
      //
    })
  })

  describe('addHitToSession(data: AddHitInput): Promise<void>', () => {
    it('Should throw Error, invalid AddHitInput', () => {
      //
    })

    it('Should throw Error, unknown Resource', () => {
      //
    })

    it('Should create session', () => {
      //
    })

    it('Should continue session', () => {
      //
    })

    it('Should re-create session', () => {
      //
    })
  })

  after(async () => {
    await cleanUp()
  })
})
