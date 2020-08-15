<template>
  <div>
    <!-- Page Heading -->
    <h1 class="h3 mb-4 text-gray-800">
      Dashboard
    </h1>

    <b-row>
      <b-col
        lg="8"
        md="6"
        sm="12"
      >
        <audience-metrics />
      </b-col>
      <b-col
        lg="4"
        md="6"
        sm="12"
      >
        <sessions-by-device />
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
import SessionsByDevice from '../components/widgets/SessionsByDevice.vue'

export default {
  name: 'IndexPage',
  components: {
    AudienceMetrics,
    VisitorsMetrics,
    BounceRateMetrics,
    SessionByChannels,
    SessionsByDevice
  }
}
</script>
