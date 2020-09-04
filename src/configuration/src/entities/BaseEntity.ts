/* eslint-disable no-underscore-dangle */

export interface BaseProps {
  id: string
}

export default class BaseEntity<Props extends BaseProps> {
  private _id: string

  private _props: Props

  constructor(id: string, props: Props) {
    this._id = id
    this._props = props
  }

  get id(): string {
    return this._id
  }

  get props(): Props {
    return this._props
  }

  set props(props: Props) {
    this._props = props
  }
}
