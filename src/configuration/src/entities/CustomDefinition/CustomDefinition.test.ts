/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai'
import faker from 'faker'
import { custom_definition } from '@webalytic/ms-tools/shared/configuration/custom_definition'
import CustomDefinition from './CustomDefinition'

describe('CustomDefinition unit test', () => {
  function createCustomDefinition(props?: Partial<custom_definition.ICreateCustomDefinitionInput>):CustomDefinition {
    return CustomDefinition.create({
      name: faker.random.word(),
      scope: custom_definition.CustomDefinitionScope.HIT,
      type: custom_definition.CustomDefinitionType.DIMENSION,
      ...props
    })
  }

  describe('CustomDefinition.create(...): CustomDefinition', () => {
    it('Should return instance of CustomDefinition', () => {
      const instance = createCustomDefinition()

      expect(instance).not.be.equal(null)
      expect(instance).instanceOf(CustomDefinition)
    })

    describe('Input validation', () => {
      function factoryToThrow(props: Partial<custom_definition.ICreateCustomDefinitionInput>) {
        return createCustomDefinition.bind(createCustomDefinition, props)
      }

      it('Should throw ValidationError, empty name', () => {
        expect(factoryToThrow({ name: '' })).to.throw('ValidationError')
      })

      it('Should throw ValidationError, type invalid value', () => {
        const props = { type: custom_definition.CustomDefinitionType.EMPTY_TYPE }
        expect(factoryToThrow(props)).to.throw('ValidationError')
      })

      it('Should throw ValidationError, scope invalid value', () => {
        const props = { scope: custom_definition.CustomDefinitionScope.EMPTY_SCOPE }
        expect(factoryToThrow(props)).to.throw('ValidationError')
      })
    })
  })
})
