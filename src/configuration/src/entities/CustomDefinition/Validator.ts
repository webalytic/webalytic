/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import { createFastesValidationError } from '@webalytic/ms-tools/lib/errors'
import { custom_definition } from '@webalytic/ms-tools/shared/configuration/custom_definition'
// Todo: "import ... from ..." throw TypeError: fastest_validator_1.default is not a constructor
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Validator = require('fastest-validator')

const v = new Validator()

// ** CreateInput Validate
const { EMPTY_SCOPE, ...ScopeValues } = custom_definition.CustomDefinitionScope
const { EMPTY_TYPE, ...TypeValues } = custom_definition.CustomDefinitionType

const createSchema = {
  name: { type: 'string', min: 1, max: 64 },
  scope: { type: 'enum', values: Object.values(ScopeValues) },
  type: { type: 'enum', values: Object.values(TypeValues) }
}
const createCheck = v.compile(createSchema)

export function createInputValidate(data: custom_definition.ICreateCustomDefinitionInput): void {
  const isValid = createCheck(data)
  if (isValid !== true) throw createFastesValidationError(isValid)
}

// ** UpdateInput Validate
// ** updateResourceSchema clone createResourceSchema
const updateSchema = {
  name: { ...createSchema.name, optional: true },
  scope: { ...createSchema.scope, optional: true }
}
const updateCheck = v.compile(updateSchema)
export function updateInputValidate(data: custom_definition.IUpdateCustomDefinitionInput): void {
  const isValid = updateCheck(data)
  if (isValid !== true) throw createFastesValidationError(isValid)
}
