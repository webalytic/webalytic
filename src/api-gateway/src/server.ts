import { ApolloServer } from 'apollo-server-express'
import { Application } from './app'
import schema from './schema'

export default (app: Application): ApolloServer => {
  // Create HTTP server.
  const server = new ApolloServer({
    schema,
    formatError: (err) =>
      // Todo: handle errors
      err

  })

  server.applyMiddleware({ app, path: '/graphql' })

  return server
}
