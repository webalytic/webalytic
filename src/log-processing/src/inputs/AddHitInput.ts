import { createFastesValidationError } from '@webalytic/ms-tools/lib/errors'
import { session } from '@shared/log-processing/seesion'

import { HitType, HitDataSource } from '../constants'

// Todo: "import ... from ..." throw TypeError: fastest_validator_1.default is not a constructor
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Validator = require('fastest-validator')

export default interface AddHitInput {
  // ** General
  resourceId: string

  // ** User
  clientId: string
  userId: string

  // ** Session
  sessionControl: string
  ip: string
  userAgent: string

  // ** Traffic Sources
  documentReferrer: string
  campaignName: string
  campaignSource: string
  campaignMedium: string
  campaignKeyword: string
  campaignContent: string
  campaignId: string

  // ** System Info
  screenResolution: string // Example 800x800
  viewportSize: string // Example 123x456

  // ** Hit
  hit: session.IHit

  // ** Content Information
  documentLocation: string
}

const v = new Validator()

// Todo: need define more detail in validation
const schema = {
  resourceId: { type: 'string', min: 1, max: 255 },
  clientId: { type: 'string', min: 1, max: 255 },
  hit: {
    $$type: 'object',
    type: { type: 'enum', values: [HitType.PAGEVIEW, HitType.EVENT] },
    dataSource: { type: 'enum', values: [HitDataSource.SDK, HitDataSource.APP], optional: true }
  }
}

const check = v.compile(schema)

export function addHitInputValidate(data: AddHitInput): void{
  const isValid = check(data)

  if (isValid !== true) throw createFastesValidationError(isValid)
}
