<template>
  <div>
    <!-- Page Heading -->
    <h1 class="h3 mb-4 text-gray-800">
      Dashboard
    </h1>

    <b-row>
      <b-col>
        <audience-metrics />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-row>
          <b-col>
            <bounce-rate-metrics />
          </b-col>
          <b-col>
            <visitors-metrics />
          </b-col>
          <b-col>
            <session-by-channels />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<style scoped>
.row {
    margin-bottom: 30px;
}
</style>
<script>
import AudienceMetrics from '../components/widgets/AudienceMetrics.vue'
import VisitorsMetrics from '../components/widgets/VisitorsMetrics.vue'
import BounceRateMetrics from '../components/widgets/BounceRateMetrics.vue'
import SessionByChannels from '../components/widgets/SessionByChannels.vue'

export default {
  name: 'IndexPage',
  components: {
    AudienceMetrics,
    VisitorsMetrics,
    BounceRateMetrics,
    SessionByChannels
  }
}
</script>
