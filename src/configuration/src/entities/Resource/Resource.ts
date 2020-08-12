import { resource } from '@shared/configuration/resource'
import { v4 as uuidV4 } from 'uuid'
import moment from 'moment'

import { createInputValidate } from './Validator'

export default class Resource {
  id: string

  props: resource.ResourceProps

  constructor(id: string, props: resource.ResourceProps) {
    this.id = id
    this.props = props
  }

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
}
