<template>
  <b-card
    no-body
    class="border-0"
  >
    <div class="d-flex flex-row">
      <div class="pr-3 pl-3">
        <summary-card
          label="Visitors"
          :value="summary['Sessions.visitors'] | number"
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
  computed: {
    summary() {
      return this.load ? this.load[0] : {
        'Sessions.visitors': 3430, 'Sessions.count': 4523, 'Sessions.pageviews': 6234, 'Sessions.events': 3123
      }
    }
  }
}
</script>
