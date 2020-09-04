// Todo: add test errors

import { ApolloServerTestClient } from 'apollo-server-testing'
import { gql } from 'apollo-server'
import { expect } from 'chai'
import faker from 'faker'
import { Server } from 'grpc'
import createApp from '../../../before/createApp'
import { createCustomDefinitionService } from '../../../before/createMocks'

let testClient: ApolloServerTestClient
let serviceMock: Server
const customDefinitionId = faker.random.uuid()

describe('CustomDefinition endpoints', () => {
  before(() => {
    const containerWithApp = createApp()
    testClient = containerWithApp.testClient

    serviceMock = createCustomDefinitionService(customDefinitionId)
    serviceMock.start()
  })

  after((done) => {
    serviceMock.tryShutdown(() => {
      done()
    })
  })

  describe('customDefinitions', () => {
    const QUERY = gql`
      query getCustomDefinition($filter: CustomDefinitionFilter, $limit: Int, $offset: Int, $orderBy: String) {
        customDefinitions(filter: $filter, limit: $limit, offset: $offset, orderBy: $orderBy ){
          count
          customDefinitions {
            id
            resourceId
            name
            scope
            type
            active
          }
        }
      }
    `

    it('Should return count, customDefinitions', async () => {
      const res = await testClient.query({
        query: QUERY,
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

  describe('customDefinitionCreate', () => {
    const MUTATION = gql`
    mutation($data: CustomDefinitionCreateInput) {
      customDefinitionCreate(data: $data){
        id
        name
      }
    }
  `

    it('Should return customDefinition', async () => {
      const res = await testClient.query({
        query: MUTATION,
        variables: {
          data: {}
        }
      })

      expect(res.errors).to.be.equal(undefined)
      expect(res.data).not.be.equal(null)
    })
  })

  describe('customDefinitionUpdate', () => {
    const MUTATION = gql`
    mutation($id: String, $data: CustomDefinitionUpdateInput) {
      customDefinitionUpdate(id: $id, data: $data){
        id
        name
      }
    }
  `

    it('Should return customDefinition', async () => {
      const res = await testClient.query({
        query: MUTATION,
        variables: {
          id: customDefinitionId,
          data: {}
        }
      })

      expect(res.errors).to.be.equal(undefined)
      expect(res.data).not.be.equal(null)
    })
  })
})
