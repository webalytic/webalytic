import { ApolloServer } from 'apollo-server-express'
import { Application } from './app'
import schema from './schema'

export default (app: Application): ApolloServer => {
  // Create HTTP server.
  const server = new ApolloServer({ schema })

  server.applyMiddleware({ app, path: '/graphql' })

  return server
}
