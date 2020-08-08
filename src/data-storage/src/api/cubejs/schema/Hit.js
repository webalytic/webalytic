cube('Hits', {
  sql: 'SELECT * FROM tracker.hits',

  joins: {

  },

  measures: {
    count: {
      sql: `count()`,
      type: `number`
    }
  },

  dimensions: {
    resourceId: {
      sql: `${CUBE}."resourceId"`,
      type: 'string'
    },

    userId: {
      sql: `${CUBE}."userId"`,
      type: 'string'
    },

    sessionId: {
      sql: `${CUBE}."sessionId"`,
      type: 'string'
    },
  }
})
