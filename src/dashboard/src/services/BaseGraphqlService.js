/* eslint-disable class-methods-use-this */
import apolloClient from '../apolloClient'

export default class BaseGraphqlService {
  async callApi({ query, variables }) {
    const res = await apolloClient.query({ query, variables })
    return res.data
  }
}
