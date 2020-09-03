import { resource } from '@webalytic/ms-tools/shared/configuration/resource'
import moment from 'moment'

import Resource from '../../entities/Resource/Resource'
import { ResourceModelInstance } from './ResourceModel'
import { Dependencies } from '../../container'
import BaseMapper from '../base/BaseMapper'

export default class ResourceMapper extends BaseMapper<ResourceModelInstance, Resource> {
  constructor({ ResourceModel }: Dependencies) {
    super(ResourceModel)
  }

  toModel(instance: Resource): ResourceModelInstance {
    return this.modelStatic.build({
      id: instance.id,
      ...instance.props,
      createTime: new Date(+instance.props.createTime * 1000),
      updateTime: new Date(+instance.props.updateTime * 1000)
    })
  }

  toEntity(row: ResourceModelInstance): Resource {
    return new Resource(
      row.id,
      new resource.ResourceProps({
        ...row,
        createTime: moment(row.createTime).unix(),
        updateTime: moment(row.updateTime).unix()
      })
    )
  }
}
