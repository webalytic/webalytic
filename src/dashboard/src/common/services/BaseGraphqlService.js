/* eslint-disable class-methods-use-this */
import apolloClient from '../apolloClient'

export default class BaseGraphqlService {
  async callApi({ query, variables }) {
    const res = await apolloClient.query({
      fetchPolicy: 'no-cache',
      query,
      variables
    })

    return res.data
  }
}
