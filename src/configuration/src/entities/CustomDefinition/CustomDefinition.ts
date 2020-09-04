/* eslint-disable camelcase */
import { custom_definition } from '@webalytic/ms-tools/shared/configuration/custom_definition'
import { v4 as uuidV4 } from 'uuid'

import { createInputValidate, updateInputValidate } from './Validator'
import BaseEntity from '../BaseEntity'

export default class CustomDefinition extends BaseEntity<custom_definition.CustomDefinitionProps> {
  static create(data: custom_definition.ICreateCustomDefinitionInput): CustomDefinition {
    createInputValidate(data)

    const id = uuidV4()
    const props = new custom_definition.CustomDefinitionProps({
      id,
      ...data
    })

    return new CustomDefinition(id, props)
  }

  update(data: custom_definition.IUpdateCustomDefinitionInput): void {
    updateInputValidate(data)

    this.props = new custom_definition.CustomDefinitionProps({
      ...this.props,
      ...data
    })
  }
}
