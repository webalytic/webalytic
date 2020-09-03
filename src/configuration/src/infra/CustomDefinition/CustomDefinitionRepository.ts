/* eslint-disable camelcase */
import { WhereOptions, Op } from 'sequelize'

import { custom_definition } from '@webalytic/ms-tools/shared/configuration/custom_definition'

import { Dependencies } from '../../container'
import CustomDefinition from '../../entities/CustomDefinition/CustomDefinition'

import { CustomDefinitionModelInstance } from './CustomDefinitionModel'
import BaseRepository from '../base/BaseRepository'

class CustomDefinitionRepository extends BaseRepository<
  CustomDefinitionModelInstance,
  CustomDefinition,
  custom_definition.ICustomDefinitionFilter
  > {
  constructor({ CustomDefinitionModel, customDefinitionMapper }: Dependencies) {
    super(CustomDefinitionModel, customDefinitionMapper)
  }

  prepareWhere(filter: custom_definition.ICustomDefinitionFilter): WhereOptions {
    const where: WhereOptions = {}
    if (filter) {
      if (filter.id) {
        if (Array.isArray(filter.id)) where.id = { [Op.in]: filter.id }
        else where.id = filter.id
      }
      if (filter.name) where.name = { [Op.like]: `%${filter.name}%` }
    }

    return where
  }
}

export default CustomDefinitionRepository
