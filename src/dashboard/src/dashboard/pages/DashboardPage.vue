<template>
  <div>
    <!-- Page Heading -->
    <div class="d-flex justify-content-between">
      <h1 class="h3 mb-4 text-gray-800">
        Dashboard
      </h1>

      <date-range-filter />
    </div>

    <b-row>
      <b-col
        lg="8"
        md="12"
        sm="12"
      >
        <audience-metrics />
      </b-col>
      <b-col
        lg="4"
        md="12"
        sm="12"
      >
        <sessions-by-device />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        lg="4"
        md="12"
        sm="12"
      >
        <bounce-rate-metrics />
      </b-col>
      <b-col
        lg="4"
        md="12"
        sm="12"
      >
        <visitors-metrics />
      </b-col>
      <b-col
        lg="4"
        md="12"
        sm="12"
      >
        <session-by-channels />
      </b-col>
    </b-row>
  </div>
</template>

<script>

import Vue from 'vue'

import DateRangeFilter from '@/common/components/filters/DateRangeFilter.vue'

import AudienceMetrics from '../components/AudienceMetrics.vue'
import VisitorsMetrics from '../components/VisitorsMetrics.vue'
import BounceRateMetrics from '../components/BounceRateMetrics.vue'
import SessionByChannels from '../components/SessionByChannels.vue'
import SessionsByDevice from '../components/SessionsByDevice.vue'

export default Vue.extend({
  name: 'IndexPage',
  components: {
    DateRangeFilter,
    AudienceMetrics,
    VisitorsMetrics,
    BounceRateMetrics,
    SessionByChannels,
    SessionsByDevice
  }
})
</script>
