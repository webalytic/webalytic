// Todo: add test errors

import { ApolloServerTestClient } from 'apollo-server-testing'
import { gql } from 'apollo-server'
import { expect } from 'chai'
import faker from 'faker'
import { Server } from 'grpc'
import createApp from '../../before/createApp'
import { createResourceService } from '../../before/createMocks'

let testClient: ApolloServerTestClient
let resourceServiceMock: Server
const resourceId = faker.random.uuid()

describe('Management Api', () => {
  before(() => {
    const containerWithApp = createApp()
    testClient = containerWithApp.testClient

    resourceServiceMock = createResourceService(resourceId)
    resourceServiceMock.start()
  })

  after((done) => {
    resourceServiceMock.tryShutdown(() => {
      done()
    })
  })

  describe('resources', () => {
    const RESOURCES_QUERY = gql`
      query getResources($filter: ResourceFilter, $limit: Int, $offset: Int, $orderBy: String) {
        resources(filter: $filter, limit: $limit, offset: $offset, orderBy: $orderBy ){
          count
          resources {
            id
            name
            category
            defaultWebsiteUrl
            createTime
            updateTime
          }
        }
      }
    `

    it('Should return count, resources', async () => {
      const res = await testClient.query({
        query: RESOURCES_QUERY,
        variables: {
          data: {
            filter: {},
            limit: 10,
            offset: 0,
            orderBy: ''
          }
        }
      })

      expect(res.errors).to.be.equal(undefined)
      expect(res.data).not.be.equal(null)
      expect(res.data.count).not.be.equal(null)
      expect(res.data.resources).not.be.equal(null)
    })
  })

  describe('resourceCreate', () => {
    const RESOURCE_CREATE_MUTATION = gql`
    mutation($data: ResourceCreateInput) {
      resourceCreate(data: $data){
        id
        name
        category
        defaultWebsiteUrl
        createTime
        updateTime
      }
    }
  `

    it('Should return resource', async () => {
      const res = await testClient.query({
        query: RESOURCE_CREATE_MUTATION,
        variables: {
          data: {}
        }
      })

      expect(res.errors).to.be.equal(undefined)
      expect(res.data).not.be.equal(null)
    })
  })

  describe('resourceUpdate', () => {
    const RESOURCE_UPDATE_MUTATION = gql`
    mutation($id: String, $data: ResourceUpdateInput) {
      resourceUpdate(id: $id, data: $data){
        id
        name
        category
        defaultWebsiteUrl
        createTime
        updateTime
      }
    }
  `

    it('Should return resource', async () => {
      const res = await testClient.query({
        query: RESOURCE_UPDATE_MUTATION,
        variables: {
          id: resourceId,
          data: {}
        }
      })

      expect(res.errors).to.be.equal(undefined)
      expect(res.data).not.be.equal(null)
    })
  })
})
