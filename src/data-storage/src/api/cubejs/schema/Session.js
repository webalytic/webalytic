cube('Sessions', {
  sql: 'SELECT * FROM tracker.sessions',
  refreshKey: {
    every: `1 seconds`
  },
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
      sql: `sum(sign * totals_events)`,
      type: `number`
    },
    durationAvg: {
      sql: `sum(duration * sign) / sum(sign)`,
      type: `number`
    },
    visitors: {
      sql: `uniq(clientId)`,
      type: `number`
    },
    bounceRate:{
      sql: `round((100 - (uniqIf(sessionId, duration > 0) * 100) / sum(sign)), 2)`,
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

    browser: {
      sql: `${CUBE}."device_browser"`,
      type: 'string'
    },

    browserVersion: {
      sql: `${CUBE}."device_browserVersion"`,
      type: 'string'
    },

    operatingSystem: {
      sql: `${CUBE}."device_operatingSystem"`,
      type: 'string'
    },

    operatingSystemVersion: {
      sql: `${CUBE}."device_operatingSystemVersion"`,
      type: 'string'
    },

    deviceCategory: {
      sql: `${CUBE}."device_deviceCategory"`,
      type: 'string'
    },

    source: {
      sql: `${CUBE}."trafficSource_source"`,
      type: 'string'
    },

    channel: {
      sql: `${CUBE}."trafficSource_medium"`,
      type: 'string'
    }
  }
})
