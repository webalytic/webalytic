<template>
  <b-card title="Summary">
    <b-card-body v-if="summary">
      <b-row>
        <b-col>
          <summary-widget-card
            label="Sessions"
            :value="summary['Sessions.count']"
          />
        </b-col>
        <b-col>
          <summary-widget-card
            label="PageViews"
            :value="summary['Sessions.pageviews']"
          />
        </b-col>
        <b-col>
          <summary-widget-card
            label="Events"
            :value="summary['Sessions.events']"
          />
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import gql from 'graphql-tag'
import SummaryWidgetCard from './SummaryWidgetCard.vue'

export default {
  components: {
    SummaryWidgetCard
  },
  apollo: {
    load: {
      query: gql`
        query load($measures: [String!], $dimensions: [String]) {
          load(measures: $measures, dimensions: $dimensions)
        }`,
      variables: {
        measures: ['Sessions.count', 'Sessions.pageviews', 'Sessions.events'],
        dimensions: []
      }
    }
  },
  computed: {
    summary() {
      return this.load ? this.load[0] : null
    }
  }
}
</script>
