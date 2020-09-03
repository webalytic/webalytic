/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-types */
import {
  UUID, STRING, Model, SMALLINT, BOOLEAN
} from 'sequelize'

import { custom_definition } from '@webalytic/ms-tools/shared/configuration/custom_definition'
import { BaseModelStatic } from '../base/BaseModel'

import { Dependencies } from '../../container'

export interface ICustomDefinitionModel extends Model<custom_definition.ICustomDefinitionProps> {
  readonly id: string
}

export type CustomDefinitionModelInstance = typeof Model & ICustomDefinitionModel

export type CustomDefinitionModelStatic = typeof Model & BaseModelStatic<CustomDefinitionModelInstance>

export default ({ sequelize }: Dependencies): CustomDefinitionModelStatic =>
  sequelize.define('CustomDefinition', {
    id: {
      type: UUID,
      primaryKey: true
    },
    resourceId: {
      type: UUID,
      allowNull: false
    },
    index: {
      type: SMALLINT,
      allowNull: false
    },
    type: {
      type: SMALLINT,
      allowNull: false
    },
    scope: {
      type: SMALLINT,
      allowNull: false
    },
    name: {
      type: STRING(64),
      allowNull: false
    },
    active: {
      type: BOOLEAN,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'customDefinitions',
    schema: 'configuration'
  }) as CustomDefinitionModelStatic
