import { QueryCustomDefinitionsArgs, CustomDefinitionsListResponse } from '@webalytic/graphql-types'
import { createClient } from '@webalytic/ms-tools/lib/grpc/configuration/CustomDefinitionService'

const client = createClient()

export default () =>
  async (_, args: QueryCustomDefinitionsArgs): Promise<CustomDefinitionsListResponse> => {
    const { count, customDefinitions } = await client.listCustomDefinitions(args)

    return {
      count,
      customDefinitions: customDefinitions.map((item) =>
        ({ ...item }))
    }
  }
