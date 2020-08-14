import { MutationResourceCreateArgs, Resource } from '@webalytic/graphql-types'

import {
  createClient as createResourceServiceClient
} from '@webalytic/ms-tools/lib/grpc/configuration/ResourceService'

const client = createResourceServiceClient()

export default () =>
  async (_, args: MutationResourceCreateArgs): Promise<Resource> => {
    const { instance } = await client.createResource(args)

    return {
      ...instance,
      createTime: +instance.createTime.toString(),
      updateTime: +instance.updateTime.toString()
    }
  }
