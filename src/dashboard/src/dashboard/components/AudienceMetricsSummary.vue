<template>
  <b-card
    no-body
    class="border-0"
  >
    <div class="d-flex flex-row">
      <div class="mr-3">
        <summary-card
          label="Sessions"
          :value="summary['Sessions.count'] | number-short"
        />
      </div>
      <div class="mr-3">
        <summary-card
          label="Page Views"
          :value="summary['Sessions.pageviews'] | number-short"
        />
      </div>
      <div>
        <summary-card
          label="Events"
          :value="summary['Sessions.events'] | number-short"
        />
      </div>
    </div>
  </b-card>
</template>

<script>
import SummaryCard from './SummaryCard.vue'

export default {
  components: {
    SummaryCard
  },
  props: {
    total: {
      type: Array,
      required: true
    }
  },

  computed: {
    summary() {
      return this.total.length ? this.total[0] : {
        'Sessions.count': 0, 'Sessions.pageviews': 0, 'Sessions.events': 0
      }
    }
  }
}
</script>
