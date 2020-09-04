/* eslint-disable camelcase */
import { custom_definition } from '@webalytic/ms-tools/shared/configuration/custom_definition'

import { Dependencies } from '../../container'
import CustomDefinition from '../../entities/CustomDefinition/CustomDefinition'

import { CustomDefinitionModelInstance } from './CustomDefinitionModel'
import BaseMapper from '../base/BaseMapper'

export default class CustomDefinitionMapper extends BaseMapper<CustomDefinitionModelInstance, CustomDefinition> {
  constructor({ CustomDefinitionModel }: Dependencies) {
    super(CustomDefinitionModel)
  }

  toEntity(row: CustomDefinitionModelInstance): CustomDefinition {
    return new CustomDefinition(
      row.id,
      new custom_definition.CustomDefinitionProps({
        ...row
      })
    )
  }
}
