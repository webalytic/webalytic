import { resource } from '@webalytic/ms-tools/shared/configuration/resource'
import moment from 'moment'

import Resource from '../entities/Resource/Resource'
import { ResourceModelStatic, IResourceModel } from './models/ResourceModel'
import { Dependencies } from '../container'

export default class ResourceMapper {
  private ResourceModel: ResourceModelStatic

  constructor({ ResourceModel }: Dependencies) {
    this.ResourceModel = ResourceModel
  }

  toModel(instance: Resource): IResourceModel {
    return this.ResourceModel.build({
      ...instance.props,
      createTime: new Date(+instance.props.createTime * 1000),
      updateTime: new Date(+instance.props.updateTime * 1000)
    })
  }

  toEntity(row: IResourceModel): Resource {
    return new Resource(
      row.id,
      new resource.ResourceProps({
        ...row,
        category: resource.ResourceCategory[row.category],
        createTime: moment(row.createTime).unix(),
        updateTime: moment(row.updateTime).unix()
      })
    )
  }
}
