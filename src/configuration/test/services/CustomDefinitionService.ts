/* eslint-disable camelcase */
import { expect } from 'chai'
import faker from 'faker'

import { AwilixContainer } from 'awilix'
import { createClient } from '@webalytic/ms-tools/lib/grpc/configuration/CustomDefinitionService'
import { custom_definition } from '@webalytic/ms-tools/shared/configuration/custom_definition'
import {
  ListCustomDefinitionsRequest,
  CustomDefinitionService,
  CreateCustomDefinitionRequest,
  UpdateCustomDefinitionRequest
} from '@webalytic/ms-tools/shared/configuration/custom_definition_service'

import Resource from 'entities/Resource/Resource'
import { resource } from '@webalytic/ms-tools/shared/configuration/resource'
import CustomDefinition from 'entities/CustomDefinition/CustomDefinition'
import cleanUp from '../cleanUp'

import createContainer, { Dependencies } from '../../src/container'

describe('CustomDefinitionService', () => {
  let container: AwilixContainer<Dependencies>
  let client: CustomDefinitionService

  const resourceProps = new resource.ResourceProps({
    name: faker.random.word(),
    category: resource.ResourceCategory.ARTS_AND_ENTERTAINMENT,
    defaultWebsiteUrl: faker.internet.url()
  })
  const resourceInstance: Resource = new Resource(faker.random.uuid(), resourceProps)

  before(async () => {
    container = createContainer()
    client = createClient()
  })

  beforeEach(async () => {
    await cleanUp(container.cradle)
    await container.cradle.resourceRepository.save(resourceInstance)
  })

  function createValidInput() {
    return {
      name: faker.random.word(),
      resourceId: resourceInstance.id,
      scope: custom_definition.CustomDefinitionScope.HIT,
      type: custom_definition.CustomDefinitionType.DIMENSION,
      active: true
    }
  }

  async function createCustomDefinition(): Promise<custom_definition.ICustomDefinitionProps> {
    const req = new CreateCustomDefinitionRequest({ data: createValidInput() })
    const resp = await client.createCustomDefinition(req)

    return resp.instance
  }

  describe('ListCustomDefinitions', () => {
    it('Should return count, customDefinitions', async () => {
      const resp = await client.listCustomDefinitions(new ListCustomDefinitionsRequest())

      expect(resp.count).that.is.a('number')
      expect(resp.customDefinitions).that.is.a('array')
    })

    it('Should return customDefinitions, filter by id', async () => {
      const instances = await Promise.all([
        createCustomDefinition(),
        createCustomDefinition()
      ])

      const req = new ListCustomDefinitionsRequest({ filter: { id: instances[0].id } })
      const resp = await client.listCustomDefinitions(req)

      expect(resp.count).to.be.equal(1)
      expect(resp.customDefinitions.length).to.be.equal(1)
      expect(resp.customDefinitions[0]).to.be.deep.equal(instances[0])
    })

    it('Should return customDefinitions, filter by name', async () => {
      const instances = await Promise.all([
        createCustomDefinition(),
        createCustomDefinition()
      ])

      const req = new ListCustomDefinitionsRequest({ filter: { name: instances[1].name } })
      const resp = await client.listCustomDefinitions(req)

      expect(resp.count).to.be.equal(1)
      expect(resp.customDefinitions.length).to.be.equal(1)
      expect(resp.customDefinitions[0]).to.be.deep.equal(instances[1])
    })

    it('Should return resources list, orderBy', async () => {
      const instances = await Promise.all([
        createCustomDefinition(),
        createCustomDefinition(),
        createCustomDefinition()
      ])

      const req = new ListCustomDefinitionsRequest({ orderBy: 'id:desc' })
      const res = await client.listCustomDefinitions(req)

      instances.sort((a, b) =>
        (a.id < b.id ? 1 : -1))

      expect(res.customDefinitions).to.be.deep.equal(instances)
    })

    it('Should return resources list, offset', async () => {
      const instances = await Promise.all([createCustomDefinition(), createCustomDefinition()])
      const req = new ListCustomDefinitionsRequest({
        offset: 1,
        orderBy: 'id:desc'
      })

      const res = await client.listCustomDefinitions(req)

      instances.sort((a, b) =>
        (a.id < b.id ? 1 : -1))

      expect(res.customDefinitions).to.be.deep.equal(instances.slice(1))
    })
  })

  describe('CreateCustomDefinition', () => {
    it('Should return created instance', async () => {
      const req = new CreateCustomDefinitionRequest({ data: createValidInput() })

      const res = await client.createCustomDefinition(req)

      expect(res.instance.name).that.is.a('string')
      expect(res.instance.index).that.is.a('number')
      expect(res.instance.scope).that.is.a('number')
      expect(res.instance.type).that.is.a('number')
    })

    it('Should throw ValidationError, resourceId not found', async () => {
      try {
        const req = new CreateCustomDefinitionRequest({
          data: {
            ...createValidInput(),
            resourceId: faker.random.uuid()
          }
        })

        await client.createCustomDefinition(req)

        throw new Error('Should be throw Error!')
      } catch (error) {
        expect(error.message).to.include('ValidationError')
        expect(error.code).to.be.equal(400)
        const details = JSON.parse(error.metadata.get('details')[0])

        expect(details).to.be.deep.equal([{
          type: 'notFound',
          field: 'resourceId',
          message: 'Resource not found'
        }])
      }
    })

    it('Should throw ValidationError, index greater than 200', async () => {
      try {
        const lastCustomDefinition = new CustomDefinition(
          faker.random.uuid(),
          new custom_definition.CustomDefinitionProps({
            ...createValidInput(),
            index: 200
          })
        )
        await container.cradle.customDefinitionRepository.save(lastCustomDefinition)

        const req = new CreateCustomDefinitionRequest({ data: createValidInput() })
        await client.createCustomDefinition(req)

        throw new Error('Should be throw Error!')
      } catch (error) {
        expect(error.message).to.include('ValidationError')
        expect(error.code).to.be.equal(400)
        const details = JSON.parse(error.metadata.get('details')[0])

        expect(details).to.be.deep.equal([{
          type: 'max',
          field: 'index',
          message: 'Index should be less than 200'
        }])
      }
    })

    it('Should throw ValidationError, check scope and type', async () => {
      try {
        const req = new CreateCustomDefinitionRequest({
          data: {
            name: 'weq',
            scope: -1,
            type: -1
          }
        })

        await client.createCustomDefinition(req)

        throw new Error('Should be throw Error!')
      } catch (error) {
        expect(error.message).to.include('ValidationError')
        expect(error.code).to.be.equal(400)

        const details = JSON.parse(error.metadata.get('details')[0])

        expect(details).to.be.deep.equal([
          {
            type: 'enumValue',
            field: 'scope',
            message: "The 'scope' field value '1, 2' does not match any of the allowed values."
          },
          {
            type: 'enumValue',
            field: 'type',
            message: "The 'type' field value '1, 2' does not match any of the allowed values."
          }
        ])
      }
    })
  })

  describe('UpdateCustomDefinition', () => {
    it('Should return updated instance', async () => {
      const instance = await createCustomDefinition()
      const req = new UpdateCustomDefinitionRequest({
        id: instance.id,
        data: createValidInput()
      })

      const res = await client.updateCustomDefinition(req)

      expect(res.instance.name).that.is.a('string')
      expect(res.instance.scope).that.is.a('number')
      expect(res.instance.type).that.is.a('number')
    })

    it('Should throw ValidationError', async () => {
      try {
        const instance = await createCustomDefinition()
        const req = new UpdateCustomDefinitionRequest({
          id: instance.id,
          data: { name: '' }
        })

        await client.updateCustomDefinition(req)

        throw new Error('Should be throw Error!')
      } catch (error) {
        expect(error.message).to.include('ValidationError')
      }
    })

    it('Should throw NotFoundError', async () => {
      try {
        const req = new UpdateCustomDefinitionRequest({
          id: faker.random.uuid(),
          data: createValidInput()
        })

        await client.updateCustomDefinition(req)

        throw new Error('Should be throw Error!')
      } catch (error) {
        expect(error.message).to.include('NotFoundError')
      }
    })
  })
})
