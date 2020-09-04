import { MutationCustomDefinitionCreateArgs, CustomDefinition } from '@webalytic/graphql-types'
import { createClient } from '@webalytic/ms-tools/lib/grpc/configuration/CustomDefinitionService'

const client = createClient()

export default () =>
  async (_, args: MutationCustomDefinitionCreateArgs): Promise<CustomDefinition> => {
    const { instance } = await client.createCustomDefinition(args)

    return { ...instance }
  }
