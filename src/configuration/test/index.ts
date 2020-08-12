import { Server, ClientUnaryCall } from 'grpc'
import { expect } from 'chai'

import { ResourceServiceClient } from '@shared/configuration/resource_service_grpc_pb'
import { ListResourcesRequest, ListResourcesResponse } from '@shared/configuration/resource_service_pb'
import createServer from './before/createServer'
import createClient from './before/createClient'

describe('Configuration', () => {
  describe('ResourceService', () => {
    let server: Server
    let client: ResourceServiceClient

    before(() => {
      server = createServer()
      client = createClient()
    })

    after((done) => {
      server.tryShutdown(() => {
        done()
      })
    })

    describe('ListResources', () => {
      it('Should return count, cursor, resourcesList', async () => {
        const req = new ListResourcesRequest()

        const result: ListResourcesResponse = await new Promise((resolve, reject) => {
          client.listResources(req, (err, res: ListResourcesResponse) => {
            if (err) reject(err)
            else resolve(res)
          })
        })

        expect(result.getCount()).that.is.a('number')
        expect(result.getCursor()).that.is.a('string')
        expect(result.getResourcesList()).that.is.a('array')
      })
    })

    // it('createResource', () => {
    //   //
    // })

    // it('updateResource', () => {
    //   //
    // })
  })
})
