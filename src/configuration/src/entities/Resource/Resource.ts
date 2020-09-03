import { resource } from '@webalytic/ms-tools/shared/configuration/resource'
import { v4 as uuidV4 } from 'uuid'
import moment from 'moment'

import { createInputValidate, updateInputValidate } from './Validator'
import BaseEntity from '../BaseEntity'

export default class Resource extends BaseEntity<resource.ResourceProps> {
  static create(data: resource.ICreateResourceInput): Resource {
    createInputValidate(data)

    const id = uuidV4()
    const props = new resource.ResourceProps({
      id,
      ...data,
      createTime: moment().unix(),
      updateTime: moment().unix()
    })

    return new Resource(id, props)
  }

  update(data: resource.IUpdateResourceInput): void {
    updateInputValidate(data)

    this.props = new resource.ResourceProps({
      ...this.props,
      ...data,
      updateTime: moment().unix()
    })
  }
}
