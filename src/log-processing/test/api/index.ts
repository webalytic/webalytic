import * as qs from 'querystring'
import * as request from 'supertest'
import { v4 as uuidV4 } from 'uuid'
import createContainer from '../../src/container'
import createApp from '../../src/api/app'
import cleanUp from '../cleanUp'

process.env.NODE_ENV = 'test'

const container = createContainer()
const app = container.build(createApp)

describe('Api', () => {
  before(async () => {
    await cleanUp()
  })

  const resourceId = uuidV4()
  const clientId = '555'

  describe('/', () => {
    it('Should return 204 on root route', async () => {
      await request(app)
        .get('/')
        .expect(200)
    })
  })

  describe('/collect', () => {
    it('Should return 204', async () => {
      const dlSearhParams = {
        utm_source: 'source_test',
        utm_campaign: 'campaign_test'
      }

      const params = {
        tid: resourceId,
        cid: clientId,
        t: 'pageview',
        dl: `https://mydemo.com/home?${qs.stringify(dlSearhParams)}`
      }

      await request(app)
        .get('/collect')
        .query(params)
        .expect(204)
    })
  })

  after(async () => {
    await cleanUp()
  })
})
