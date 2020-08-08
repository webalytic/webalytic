import { ApolloServer } from 'apollo-server-express'
import { Application } from './app'
import schema from './schema'

export default (host: string, port: number, app: Application): Promise<ApolloServer> => {
  // Create HTTP server.
  const server = new ApolloServer({ schema })

  server.applyMiddleware({ app, path: '/graphql' })

  return new Promise((resolve) => {
    app.listen(port, host, () =>
      resolve(server))
  })
}
