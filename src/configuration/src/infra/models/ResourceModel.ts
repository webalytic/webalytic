/* eslint-disable @typescript-eslint/ban-types */
import {
  UUID, STRING, Model, BuildOptions, SMALLINT
} from 'sequelize'

import { Dependencies } from '../../container'

export interface IResourceModel extends Model {
  readonly id: string
  name: string
  category: string
  defaultWebsiteUrl: string
  options: object
  createTime: number
  updateTime: number
}

export type ResourceModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): IResourceModel
  create(data?: object, options?: BuildOptions): IResourceModel
  build(data?: object): IResourceModel
}

export default ({ sequelize }: Dependencies): ResourceModelStatic =>
  sequelize.define(
    'ResourceModel',
    {
      id: {
        type: UUID,
        primaryKey: true
      },
      name: {
        type: STRING(64),
        allowNull: false
      },
      category: {
        type: SMALLINT(),
        allowNull: false
      },
      defaultWebsiteUrl: {
        type: STRING(512),
        allowNull: false
      },
      createTime: {
        type: 'TIMESTAMP',
        allowNull: false
      },
      updateTime: {
        type: 'TIMESTAMP',
        allowNull: true
      }
    },
    {
      timestamps: false,
      tableName: 'resources',
      schema: 'configuration'
    }
  ) as ResourceModelStatic
