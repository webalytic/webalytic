import EventConsumer from '@webalytic/ms-tools/lib/infra/EventConsumer'

export default (): EventConsumer =>
  new EventConsumer({
    server: process.env.NATS_SERVER,
    cluster: process.env.NATS_CLUSTER,
    clientId: `log-collector-test${Math.floor(Math.random() * 999999)}`
  })
