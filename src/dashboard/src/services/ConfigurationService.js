// import gql from 'graphql-tag'
// import apolloClient from '../apolloClient'

// const RESOURCES_QUERY = gql`
//   query getResources($filter: ResourceFilter, $limit: Int, $offset: Int, $orderBy: String) {
//     resources(filter: $filter, limit: $limit, offset: $offset, orderBy: $orderBy ){
//       count
//       resources {
//         id
//         name
//         category
//         defaultWebsiteUrl
//         createTime
//         updateTime
//       }
//     }
//   }
// `

// export function resources() {
//   const res = await apolloClient.query({
//     query: LOAD_QUERY,
//     variables: {
//       measures: variables.measures || [],
//       filters: prepareFiltersForQueryEngine(filter),
//       timeDimensions: variables.timeDimensions || [],
//       dimensions: variables.dimensions || [],
//       order: {
//         'Sessions.date': 'asc'
//       }
//     }
//   })
// }

// const RESOURCE_CREATE_MUTATION = gql`
//   mutation($data: ResourceCreateInput) {
//     resourceCreate(data: $data){
//       id
//       name
//       category
//       defaultWebsiteUrl
//       createTime
//       updateTime
//     }
//   }
// `

// export function resourceCreate() {}

// const RESOURCE_UPDATE_MUTATION = gql`
//   mutation($id: String, $data: ResourceUpdateInput) {
//     resourceUpdate(id: $id, data: $data){
//       id
//       name
//       category
//       defaultWebsiteUrl
//       createTime
//       updateTime
//     }
//   }
// `

// export function resourceUpdate() {}
