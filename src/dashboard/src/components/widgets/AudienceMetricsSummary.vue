<template>
  <b-card
    no-body
    class="border-0"
  >
    <div class="d-flex flex-row">
      <div class="pr-3 pl-3">
        <summary-card
          label="Sessions"
          :value="summary['Sessions.count'] | number"
        />
      </div>
      <div class="pr-3 pl-3">
        <summary-card
          label="Page Views"
          :value="summary['Sessions.pageviews'] | number"
        />
      </div>
      <div class="pr-3 pl-3">
        <summary-card
          label="Events"
          :value="summary['Sessions.events'] | number"
        />
      </div>
    </div>
  </b-card>
</template>

<script>
import SummaryCard from './SummaryCard.vue'
import { fetchWithTimeDimensions } from '../../services/LoadService'

export default {
  components: {
    SummaryCard
  },
  data() {
    return {
      load: []
    }
  },
  computed: {
    summary() {
      return this.load.length ? this.load[0] : {
        'Sessions.count': 0, 'Sessions.pageviews': 0, 'Sessions.events': 0
      }
    }
  },
  async created() {
    this.load = await fetchWithTimeDimensions({
      measures: ['Sessions.count', 'Sessions.pageviews', 'Sessions.events']
    })
  }
}
</script>
