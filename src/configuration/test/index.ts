import { Server } from 'grpc'
import { expect } from 'chai'
import faker from 'faker'

import {
  ListResourcesRequest, ResourceService, CreateResourceRequest, UpdateResourceRequest
} from '@shared/configuration/resource_service'
import { resource } from '@shared/configuration/resource'

import createInfra, { InfraContainers } from './before/createInfra'
import createServer from './before/createServer'
import createClient from './before/createClient'

describe('Configuration', () => {
  describe('ResourceService', () => {
    let server: Server
    let client: ResourceService
    let infra: InfraContainers

    before(async () => {
      infra = await createInfra()
      server = createServer()
      client = createClient()
    })

    after(async () => {
      await Promise.all([
        infra.postgres.stop(),
        new Promise((resolve) =>
          server.tryShutdown(() =>
            resolve()))
      ])
    })

    describe('ListResources', () => {
      it('Should return count, cursor, resourcesList', async () => {
        const resp = await client.listResources(new ListResourcesRequest())

        expect(resp.count).that.is.a('number')
        expect(resp.cursor).that.is.a('string')
        expect(resp.resources).that.is.a('array')
      })
    })

    describe('CreateResource', () => {
      it('Should return instance of resource', async () => {
        const resp = await client.createResource(new CreateResourceRequest({
          data: {
            name: faker.random.word(),
            category: resource.ResourceCategory.ARTS_AND_ENTERTAINMENT,
            defaultWebsiteUrl: faker.internet.url()
          }
        }))

        expect(resp.instance.name).that.is.a('string')
        expect(resp.instance.category).that.is.a('number')
        expect(resp.instance.defaultWebsiteUrl).that.is.a('string')
      })

      it('Should throw ValidationError', async () => {
        try {
          await client.createResource(new CreateResourceRequest({
            data: {
              name: 'weq',
              category: resource.ResourceCategory.ARTS_AND_ENTERTAINMENT,
              defaultWebsiteUrl: faker.random.word()
            }
          }))

          throw new Error('Should be throw ValidationError!')
        } catch (error) {
          expect(error.message).to.include('ValidationError')
          expect(error.code).to.be.equal(400)

          const details = JSON.parse(error.metadata.get('details')[0])
          expect(details).to.be.deep.equal([{
            type: 'url',
            field: 'defaultWebsiteUrl',
            message: "The 'defaultWebsiteUrl' field must be a valid URL."
          }])
        }
      })
    })

    describe('UpdateResource', () => {
      it('Should throw NotFoundError', async () => {
        try {
          await client.updateResource(new UpdateResourceRequest({
            id: faker.random.uuid(),
            data: {
              name: faker.random.word(),
              category: resource.ResourceCategory.ARTS_AND_ENTERTAINMENT,
              defaultWebsiteUrl: faker.internet.url()
            }
          }))

          throw new Error('Should be throw NotFoundError!')
        } catch (error) {
          expect(error.message).to.include('NotFoundError')
        }
      })
    })
  })
})
