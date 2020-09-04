import { MutationCustomDefinitionUpdateArgs, CustomDefinition } from '@webalytic/graphql-types'

import { createClient } from '@webalytic/ms-tools/lib/grpc/configuration/CustomDefinitionService'

const client = createClient()

export default () =>
  async (_, args: MutationCustomDefinitionUpdateArgs): Promise<CustomDefinition> => {
    const { instance } = await client.updateCustomDefinition(args)

    return { ...instance }
  }
