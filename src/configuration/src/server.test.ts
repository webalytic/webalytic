import { Server } from 'grpc'
import { expect } from 'chai'

import createServer from './server'

describe('server.ts', () => {
  it('Should create object instanceOf Server', () => {
    expect(createServer()).instanceOf(Server)
  })
})
