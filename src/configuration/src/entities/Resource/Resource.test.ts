/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai'
import faker from 'faker'
import { resource } from '@shared/configuration/resource'
import Resource from './Resource'

describe('Resource unit test', () => {
  function createResource(props?: Partial<resource.ICreateResourceInput>):Resource {
    return Resource.create({
      name: faker.random.word(),
      defaultWebsiteUrl: faker.internet.url(),
      category: resource.ResourceCategory.ARTS_AND_ENTERTAINMENT,
      ...props
    })
  }

  describe('Resource.create(...): Resource', () => {
    it('Should return instance of Resource', () => {
      const instance = createResource()

      expect(instance).not.be.equal(null)
      expect(instance).instanceOf(Resource)
    })

    describe('Input validation', () => {
      function factoryToThrow(props: Partial<resource.ICreateResourceInput>) {
        return createResource.bind(createResource, props)
      }

      it('Should throw ValidationError,  empty name', () => {
        expect(factoryToThrow({ name: '' })).to.throw('ValidationError')
      })

      it('Should throw ValidationError, defaultWebsiteUrl invalid url', () => {
        expect(factoryToThrow({ defaultWebsiteUrl: faker.random.word() })).to.throw('ValidationError')
      })

      it('Should throw ValidationError, category invalid', () => {
        expect(factoryToThrow({ category: 1000 })).to.throw('ValidationError')
      })
    })
  })
})
