import {
  FindOptions, WhereOptions, Op
} from 'sequelize'

import { resource } from '@shared/configuration/resource'

import { Dependencies } from '../container'
import { ResourceModelStatic } from './models/ResourceModel'
import ResourceMapper from './ResourceMapper'
import Resource from '../entities/Resource/Resource'

export default class ResourceRepository {
  private ResourceModel: ResourceModelStatic

  private resourceMapper: ResourceMapper

  constructor(deps: Dependencies) {
    this.ResourceModel = deps.ResourceModel
    this.resourceMapper = deps.resourceMapper
  }

  private prepareFindOptions(where: resource.IResourceFilter): FindOptions {
    const whereForSequelize: WhereOptions = {}

    if (where.id) {
      if (Array.isArray(where.id)) whereForSequelize.id = { [Op.in]: where.id }
      else whereForSequelize.id = where.id
    }

    if (where.name) whereForSequelize.name = { [Op.like]: `%${where.name}%` }

    return {
      where: whereForSequelize,
      raw: true
    }
  }

  async findOne(filter: resource.IResourceFilter): Promise<Resource> {
    const options: FindOptions = this.prepareFindOptions(filter)
    const row = await this.ResourceModel.findOne(options)

    return row ? this.resourceMapper.toEntity(row) : null
  }

  // Todo: implement cursor and orderBy logic
  async findAll(filter: resource.IResourceFilter, limit: number, cursor: string, orderBy: any): Promise<Resource[]> {
    const options: FindOptions = {
      ...this.prepareFindOptions(filter),
      limit
    }

    const data = await this.ResourceModel.findAll(options)
    return data.map((row) =>
      this.resourceMapper.toEntity(row))
  }

  async save(instance: Resource): Promise<boolean> {
    let activeRecord = await this.ResourceModel.findOne({ where: { id: instance.id } })
    if (!activeRecord) activeRecord = this.resourceMapper.toModel(instance)
    else Object.assign(activeRecord, instance.props)

    await activeRecord.save()
    return true
  }
}
