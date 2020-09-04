/* eslint-disable @typescript-eslint/ban-types */
import { BuildOptions, Model } from 'sequelize'

export interface BaseModelStatic<ModelInstance> extends Model {
  new (values?: object, options?: BuildOptions): ModelInstance
  create(data?: object, options?: BuildOptions): ModelInstance
  build(data?: object): ModelInstance
}
