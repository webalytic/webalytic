/* eslint-disable import/prefer-default-export */
import { createFastesValidationError } from '@webalytic/ms-tools/lib/errors'
import { resource } from '@shared/configuration/resource'
// Todo: "import ... from ..." throw TypeError: fastest_validator_1.default is not a constructor
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Validator = require('fastest-validator')

const v = new Validator()

const createResourceSchema = {
  name: { type: 'string', min: 1, max: 64 },
  category: { type: 'enum', values: Object.values(resource.ResourceCategory) },
  defaultWebsiteUrl: { type: 'url' }
}

const createResourceCheck = v.compile(createResourceSchema)

export function createInputValidate(data: resource.ICreateResourceInput): void {
  const isValid = createResourceCheck(data)
  if (isValid !== true) throw createFastesValidationError(isValid)
}
