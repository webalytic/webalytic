cube('Sessions', {
  sql: 'SELECT * FROM tracker.sessions',

  joins: {

  },

  measures: {
    count: {
      sql: `sum(sign)`,
      type: `number`
    },
    pageviews: {
      sql: `sum(sign * totals_pageviews)`,
      type: `number`
    },
    events: {
      sql: `sum(sign * (totals_hits - totals_pageviews))`,
      type: `number`
    }
  },

  dimensions: {
    date: {
      sql: `${CUBE}."date"`,
      type: `time`
    },
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
