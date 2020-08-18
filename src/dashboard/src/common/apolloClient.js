import ApolloClient from 'apollo-boost'

export default new ApolloClient({
  uri: process.env.API_URL
    ? `${process.env.API_URL}/graphql`
    : '/api/graphql'
})
