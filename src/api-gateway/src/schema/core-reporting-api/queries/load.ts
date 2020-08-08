import axios from 'axios'

interface LoadParams {
  measures: string[]
  dimensions: string[]
  timeDimensions: any[]
  order: any
}
export default () =>
  async (_, {
    measures, dimensions, timeDimensions, order
  }: LoadParams): Promise<any> => {
    const host = process.env.DATA_STORAGE_HOST || '0.0.0.0'
    const port = +(process.env.DATA_STORAGE_PORT || 3000)

    const res = await axios({
      method: 'GET',
      url: `http://${host}:${port}/cubejs-api/v1/load`,
      params: {
        query: JSON.stringify({
          measures,
          dimensions,
          filters: [],
          order,
          timeDimensions,
          limit: 100,
          offset: 0
        })
      }
    })

    return res.data.data
  }
