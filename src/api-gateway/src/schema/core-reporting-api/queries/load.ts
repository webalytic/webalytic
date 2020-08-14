import axios from 'axios'
import { QueryLoadArgs } from '@webalytic/graphql-types'

export default () =>
  async (_, args: QueryLoadArgs): Promise<any> => {
    const host = process.env.DATA_STORAGE_HOST || '0.0.0.0'
    const port = +(process.env.DATA_STORAGE_PORT || 3000)

    const res = await axios({
      method: 'GET',
      url: `http://${host}:${port}/cubejs-api/v1/load`,
      params: {
        query: JSON.stringify({
          ...args,
          filters: [],
          limit: 100,
          offset: 0
        })
      }
    })

    return res.data.data
  }
