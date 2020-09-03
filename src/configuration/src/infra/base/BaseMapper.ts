import { Model } from 'sequelize'
import { BaseModelStatic } from '../base/BaseModel'
import BaseEntity from '../../entities/BaseEntity'

export default abstract class BaseMapper<ModelInstance extends Model, Entity extends BaseEntity<any>> {
  constructor(protected modelStatic: typeof Model & BaseModelStatic<ModelInstance>) {
    this.modelStatic = modelStatic
  }

  toModel(instance: Entity): ModelInstance {
    return this.modelStatic.build({
      id: instance.id,
      ...instance.props
    })
  }

  abstract toEntity(row: ModelInstance): Entity
}
