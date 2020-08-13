import {
  FindOptions, WhereOptions, Op, Order
} from 'sequelize'

import { resource } from '@shared/configuration/resource'
import { IListResourcesRequest } from '@shared/configuration/resource_service'

import { Dependencies } from '../container'
import { ResourceModelStatic } from './models/ResourceModel'
import ResourceMapper from './ResourceMapper'
import Resource from '../entities/Resource/Resource'

type FindAllParams = IListResourcesRequest

export default class ResourceRepository {
  private ResourceModel: ResourceModelStatic

  private resourceMapper: ResourceMapper

  constructor(deps: Dependencies) {
    this.ResourceModel = deps.ResourceModel
    this.resourceMapper = deps.resourceMapper
  }

  private prepareFindOptions(params: FindAllParams): FindOptions {
    const {
      filter = {}, limit = 10, offset = 0, orderBy
    } = params

    // Prepare WhereOptions
    const where: WhereOptions = {}
    if (filter.id) {
      if (Array.isArray(filter.id)) where.id = { [Op.in]: filter.id }
      else where.id = filter.id
    }
    if (filter.name) where.name = { [Op.like]: `%${filter.name}%` }

    // Prepare order
    const order: string[][] = orderBy && orderBy.split(',').map((x:string) =>
      x.split(':'))

    return {
      where,
      order: order as Order,
      limit,
      offset,
      raw: true
    }
  }

  async findOne(filter: resource.IResourceFilter): Promise<Resource> {
    const options: FindOptions = this.prepareFindOptions({ filter })
    const row = await this.ResourceModel.findOne(options)

    return row ? this.resourceMapper.toEntity(row) : null
  }

  // Todo: implement cursor and orderBy logic
  async findAll(params: FindAllParams): Promise<Resource[]> {
    const data = await this.ResourceModel.findAll(this.prepareFindOptions(params))

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

  async count(filter: resource.IResourceFilter): Promise<number> {
    const count = await this.ResourceModel.count(this.prepareFindOptions({ filter }))
    return count
  }
}
