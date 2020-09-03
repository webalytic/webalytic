import customDefinitions from './queries/customDefinitions'
import customDefinitionCreate from './mutations/customDefinitionCreate'
import customDefinitionUpdate from './mutations/customDefinitionUpdate'

export default {
  Query: {
    customDefinitions: customDefinitions()
  },
  Mutation: {
    customDefinitionCreate: customDefinitionCreate(),
    customDefinitionUpdate: customDefinitionUpdate()
  }
}
