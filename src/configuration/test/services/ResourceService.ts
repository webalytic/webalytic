import { expect } from 'chai'
import faker from 'faker'

import { Server } from 'grpc'
import { AwilixContainer } from 'awilix'
import { createClient } from '@webalytic/ms-tools/lib/grpc-clients/configuration/ResourceService'
import { resource } from '@webalytic/ms-tools/shared/configuration/resource'
import {
  ListResourcesRequest,
  ResourceService,
  CreateResourceRequest,
  UpdateResourceRequest
} from '@webalytic/ms-tools/shared/configuration/resource_service'

import createInfra, { InfraContainers } from '../before/createInfra'
import createServer from '../before/createServer'

import cleanUp from '../cleanUp'

import createContainer, { Dependencies } from '../../src/container'

describe('ResourceService', () => {
  let server: Server
  let container: AwilixContainer<Dependencies>
  let client: ResourceService
  let infra: InfraContainers

  before(async () => {
    infra = await createInfra()

    container = createContainer()
    server = createServer(container)
    client = createClient()
  })

  beforeEach(async () => {
    await cleanUp(container.cradle)
  })

  after(async () => {
    await Promise.all([
      infra.postgres.stop(),
      new Promise((resolve) =>
        server.tryShutdown(() =>
          resolve()))
    ])
  })

  function createValidInput() {
    return {
      name: faker.random.word(),
      category: resource.ResourceCategory.ARTS_AND_ENTERTAINMENT,
      defaultWebsiteUrl: faker.internet.url()
    }
  }

  async function createResource(): Promise<resource.IResourceProps> {
    const resp = await client.createResource(new CreateResourceRequest({
      data: createValidInput()
    }))

    return resp.instance
  }

  describe('ListResources', () => {
    it('Should return count, cursor, resourcesList', async () => {
      const resp = await client.listResources(new ListResourcesRequest())

      expect(resp.count).that.is.a('number')
      expect(resp.resources).that.is.a('array')
    })

    it('Should return resources list, filter by id', async () => {
      const instances = await Promise.all([
        createResource(),
        createResource()
      ])

      const resp = await client.listResources(new ListResourcesRequest({
        filter: {
          id: instances[0].id
        }
      }))

      expect(resp.count).to.be.equal(1)
      expect(resp.resources.length).to.be.equal(1)
      expect(resp.resources[0]).to.be.deep.equal(instances[0])
    })

    it('Should return resources list, filter by name', async () => {
      const instances = await Promise.all([
        createResource(),
        createResource()
      ])

      const resp = await client.listResources(new ListResourcesRequest({
        filter: {
          name: instances[1].name
        }
      }))

      expect(resp.count).to.be.equal(1)
      expect(resp.resources.length).to.be.equal(1)
      expect(resp.resources[0]).to.be.deep.equal(instances[1])
    })

    it('Should return resources list, orderBy', async () => {
      const instances = await Promise.all([
        createResource(),
        createResource(),
        createResource()
      ])

      const req = new ListResourcesRequest({ orderBy: 'id:desc' })
      const res = await client.listResources(req)

      instances.sort((a, b) =>
        (a.id < b.id ? 1 : -1))

      expect(res.resources).to.be.deep.equal(instances)
    })

    it('Should return resources list, offset', async () => {
      const instances = await Promise.all([createResource(), createResource()])
      const req = new ListResourcesRequest({
        offset: 1,
        orderBy: 'id:desc'
      })

      const res = await client.listResources(req)

      instances.sort((a, b) =>
        (a.id < b.id ? 1 : -1))

      expect(res.resources).to.be.deep.equal(instances.slice(1))
    })
  })

  describe('CreateResource', () => {
    it('Should return created instance', async () => {
      const req = new CreateResourceRequest({ data: createValidInput() })

      const res = await client.createResource(req)

      expect(res.instance.name).that.is.a('string')
      expect(res.instance.category).that.is.a('number')
      expect(res.instance.defaultWebsiteUrl).that.is.a('string')
    })

    it('Should throw ValidationError', async () => {
      try {
        const req = new CreateResourceRequest({
          data: {
            name: 'weq',
            category: resource.ResourceCategory.ARTS_AND_ENTERTAINMENT,
            defaultWebsiteUrl: faker.random.word()
          }
        })

        await client.createResource(req)

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
    it('Should return updated instance', async () => {
      const instance = await createResource()
      const req = new UpdateResourceRequest({
        id: instance.id,
        data: createValidInput()
      })

      const res = await client.updateResource(req)

      expect(res.instance.name).that.is.a('string')
      expect(res.instance.category).that.is.a('number')
      expect(res.instance.defaultWebsiteUrl).that.is.a('string')
    })

    it('Should throw ValidationError', async () => {
      try {
        const instance = await createResource()
        const req = new UpdateResourceRequest({
          id: instance.id,
          data: {
            defaultWebsiteUrl: faker.random.word()
          }
        })

        await client.updateResource(req)

        throw new Error('Should be throw ValidationError!')
      } catch (error) {
        expect(error.message).to.include('ValidationError')
      }
    })

    it('Should throw NotFoundError', async () => {
      try {
        const req = new UpdateResourceRequest({
          id: faker.random.uuid(),
          data: createValidInput()
        })

        await client.updateResource(req)

        throw new Error('Should be throw NotFoundError!')
      } catch (error) {
        expect(error.message).to.include('NotFoundError')
      }
    })
  })
})
