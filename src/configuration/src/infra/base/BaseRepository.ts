import {
  Model, FindOptions, WhereOptions, Order
} from 'sequelize'
import BaseEntity from 'entities/BaseEntity'
import BaseMapper from './BaseMapper'
import { BaseModelStatic } from './BaseModel'

export interface FindAllParams<IFilter>{
    filter?: IFilter
    limit?: number
    offset?: number
    orderBy?: string
}

export default abstract class BaseRepositrory<ModelInstance extends Model, Entity extends BaseEntity<any>, IFilter> {
  constructor(
    protected model: typeof Model & BaseModelStatic<ModelInstance>,
    protected mapper: BaseMapper<ModelInstance, Entity>
  ) {
    this.model = model
    this.mapper = mapper
  }

  abstract prepareWhere(filter: IFilter): WhereOptions

  public prepareFindOptions(params: FindAllParams<IFilter>): FindOptions {
    const {
      filter, limit = 10, offset = 0, orderBy
    } = params

    // Prepare WhereOptions
    const where: WhereOptions = this.prepareWhere(filter)

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

  async findOne(filter: IFilter): Promise<Entity> {
    const options: FindOptions = this.prepareFindOptions({ filter })
    const row = await this.model.findOne(options)

    return row ? this.mapper.toEntity(row) : null
  }

  async findAll(params: FindAllParams<IFilter>): Promise<Entity[]> {
    const data = await this.model.findAll(this.prepareFindOptions(params))

    return data.map((row) =>
      this.mapper.toEntity(row))
  }

  async save(instance: Entity): Promise<boolean> {
    let activeRecord = await this.model.findOne({ where: { id: instance.id } })
    if (!activeRecord) activeRecord = this.mapper.toModel(instance)
    else Object.assign(activeRecord, instance.props)

    await activeRecord.save()
    return true
  }

  async count(filter: IFilter): Promise<number> {
    const count = await this.model.count(this.prepareFindOptions({ filter }))
    return count
  }
}
