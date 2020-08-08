import { createServer, Server } from 'http'

import { Application } from './app'

export default (app: Application): Promise<Server> => {
  // Create HTTP server.
  const server = createServer(app)
  const port = 3000
  const host = '0.0.0.0'

  return new Promise((resolve) => {
    server.listen(port, host, () =>
      resolve(server))
  })
}
