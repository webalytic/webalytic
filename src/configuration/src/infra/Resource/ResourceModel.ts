/* eslint-disable @typescript-eslint/ban-types */
import {
  UUID, STRING, Model, SMALLINT, DATE
} from 'sequelize'

import { resource } from '@webalytic/ms-tools/shared/configuration/resource'
import { Dependencies } from '../../container'
import { BaseModelStatic } from '../base/BaseModel'

export interface IResourceModel extends
  Model<resource.IResourceProps>,
  Omit<resource.IResourceProps, 'createTime'|'updateTime'> {
  readonly id: string
  createTime: string
  updateTime: string
}

export type ResourceModelInstance = typeof Model & IResourceModel

export type ResourceModelStatic = typeof Model & BaseModelStatic<ResourceModelInstance>

export default ({ sequelize }: Dependencies): ResourceModelStatic => {
  const ResourceModel = sequelize.define(
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
        type: DATE,
        allowNull: false
      },
      updateTime: {
        type: DATE,
        allowNull: true
      }
    },
    {
      timestamps: false,
      tableName: 'resources',
      schema: 'configuration'
    }
  ) as ResourceModelStatic

  return ResourceModel
}
