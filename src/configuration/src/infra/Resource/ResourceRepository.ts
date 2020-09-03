import { WhereOptions, Op } from 'sequelize'

import { resource } from '@webalytic/ms-tools/shared/configuration/resource'

import { Dependencies } from '../../container'
import Resource from '../../entities/Resource/Resource'

import { ResourceModelInstance } from './ResourceModel'
import BaseRepository from '../base/BaseRepository'

class ResourceRepository extends BaseRepository<ResourceModelInstance, Resource, resource.IResourceFilter> {
  constructor({ ResourceModel, resourceMapper }: Dependencies) {
    super(ResourceModel, resourceMapper)
  }

  prepareWhere(filter: resource.IResourceFilter): WhereOptions {
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

export default ResourceRepository
