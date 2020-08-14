import resources from './queries/resources'
import resourceCreate from './mutations/resourceCreate'
import resourceUpdate from './mutations/resourceUpdate'

export default {
  Query: {
    resources: resources()
  },
  Mutation: {
    resourceCreate: resourceCreate(),
    resourceUpdate: resourceUpdate()
  }
}
