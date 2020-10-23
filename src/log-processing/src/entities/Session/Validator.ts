/* eslint-disable import/prefer-default-export */
import { createFastesValidationError } from '@webalytic/ms-tools/lib/errors'
import { session } from '@webalytic/ms-tools/shared/log-processing/session'
import { SessionCreateProps } from './Session'
import { HitType, HitDataSource } from '../../constants'

// Todo: "import ... from ..." throw TypeError: fastest_validator_1.default is not a constructor
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Validator = require('fastest-validator')

const v = new Validator()
const createSessionSchema = {
  resourceId: { type: 'uuid' },
  clientId: { type: 'string', min: 1, max: 64 },
  userId: {
    type: 'string', min: 0, max: 64, optional: true
  }
}
const createSessionCheck = v.compile(createSessionSchema)

const createHitSchema = {
  time: { type: 'string', pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/ },
  timestamp: { type: 'number', min: 0, max: 4294967295 }, // UInt32
  type: { type: 'string', enum: Object.values(HitType) },
  dataSource: { type: 'string', enum: Object.values(HitDataSource), optional: true },
  pageUrl: { type: 'url', empty: true },
  eventCategory: {
    type: 'string', max: 64, optional: true
  },
  eventAction: {
    type: 'string', max: 64, optional: true
  },
  eventLabel: {
    type: 'string', max: 64, optional: true
  },
  eventValue: {
    type: 'number', optional: true, min: 0, max: 4294967295 // UInt32
  },
  transactionId: { type: 'string', max: 64, optional: true },
  transactionAffiliation: { type: 'string', max: 64, optional: true },
  transactionRevenue: { type: 'number', max: 64, optional: true },
  productAction: { type: 'string', max: 64, optional: true },
  productsList: {
    type: 'array',
    items: {
      type: 'object',
      props: {
        productSku: { type: 'string', max: 64, optional: true },
        productName: { type: 'string', max: 128, optional: true },
        productBrand: { type: 'string', max: 128, optional: true },
        productCategory: { type: 'string', max: 256, optional: true },
        productVariant: { type: 'string', max: 128, optional: true },
        productPrice: {
          type: 'number', optional: true, min: 0, max: 4294967295 // UInt32
        },
        productQuantity: {
          type: 'number', optional: true, positive: true, max: 4294967295 // UInt32
        },
        productCouponCode: { type: 'string', max: 128, optional: true }
      }
    },
    default: [],
    optional: true
  }
}
const createHitCheck = v.compile(createHitSchema)

export function createInputValidate(data: SessionCreateProps, hitProps: session.IHit): void{
  const isValidSession = createSessionCheck(data)
  if (isValidSession !== true) throw createFastesValidationError(isValidSession)

  const isValidHit = createHitCheck(hitProps)
  if (isValidHit !== true) throw createFastesValidationError(isValidHit)
}

export function addHitInputValidatte(hitProps: session.IHit): void {
  const isValidHit = createHitCheck(hitProps)
  if (isValidHit !== true) throw createFastesValidationError(isValidHit)
}
