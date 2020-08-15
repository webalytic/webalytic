<template>
  <b-card
    no-body
    class="border-0"
  >
    <div class="d-flex flex-row">
      <div class="pr-3 pl-3">
        <summary-card
          label="Desktop"
          :value="summary['Sessions.count'] | number"
        />
      </div>
      <div class="pr-3 pl-3">
        <summary-card
          label="Mobile"
          :value="summary['Sessions.pageviews'] | number"
        />
      </div>
      <div class="pr-3 pl-3">
        <summary-card
          label="Tablet"
          :value="summary['Sessions.events'] | number"
        />
      </div>
    </div>
  </b-card>
</template>

<script>
// import gql from 'graphql-tag'
import SummaryCard from './SummaryCard.vue'

export default {
  components: {
    SummaryCard
  },
  // apollo: {
  //   load: {
  //     query: gql`
  //       query load($measures: [String!], $dimensions: [String]) {
  //         load(measures: $measures, dimensions: $dimensions)
  //       }`,
  //     variables: {
  //       measures: ['Sessions.count', 'Sessions.pageviews', 'Sessions.events'],
  //       dimensions: []
  //     }
  //   }
  // },
  computed: {
    summary() {
      return this.load ? this.load[0] : {
        'Sessions.visitors': 3430, 'Sessions.count': 4523, 'Sessions.pageviews': 6234, 'Sessions.events': 3123
      }
    }
  }
}
</script>
