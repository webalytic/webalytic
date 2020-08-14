import { QueryResourcesArgs, ResourcesListResponse } from '@webalytic/graphql-types'

import {
  createClient as createResourceServiceClient
} from '@webalytic/ms-tools/lib/grpc/configuration/ResourceService'

const client = createResourceServiceClient()

export default () =>
  async (_, args: QueryResourcesArgs): Promise<ResourcesListResponse> => {
    const { count, resources } = await client.listResources(args)

    return {
      count,
      resources: resources.map((resource) =>
        ({
          ...resource,
          createTime: resource.createTime as number,
          updateTime: resource.updateTime as number
        }))
    }
  }
