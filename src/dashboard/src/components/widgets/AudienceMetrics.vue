<template>
  <b-card
    no-body
    class="audience-widget shadow"
  >
    <b-card-body>
      <b-card-title>
        Website Audience Metrics
      </b-card-title>

      <b-spinner
        v-show="processing"
        label="Spinning"
      />

      <div v-show="!processing">
        <audience-metrics-summary :total="total" />

        <v-chart
          :options="options"
          autoresize
        />
      </div>
    </b-card-body>
  </b-card>
</template>

<style>
.audience-widget .echarts {
  width: 100% !important;
  height: 150 !important;
}
</style>

<script>
/* eslint-disable max-len */

import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import AudienceMetricsSummary from './AudienceMetricsSummary.vue'
import CoreReportingSerivce from '../../services/CoreReportingSerivce'
import BaseChartOptions from './BaseChartOptions'
import DataLoaderMixin from '../../mixins/DataLoaderMixin'

export default {
  components: {
    AudienceMetricsSummary
  },
  mixins: [DataLoaderMixin],
  data() {
    return {
      processing: true,
      data: [],
      total: []
    }
  },
  computed: {
    options() {
      return {
        ...BaseChartOptions,
        color: ['#3366d6', '#915dd1', '#cb50be', '#f446a2', '#ff4d7f', '#ff655b', '#ff8536', '#ffa600'],
        series: [['Session', 'count'], ['PageViews', 'pageviews'], ['Events', 'events']].map(([name, field]) => ({
          showSymbol: false,
          name,
          type: 'line',
          smooth: false,
          data: this.data.map((row) => ({
            name: 'd',
            value: [
              row['Sessions.date'],
              row[`Sessions.${field}`]
            ]
          }))
        }))
      }
    }
  },
  methods: {
    async fetchData() {
      this.processing = true
      const measures = ['Sessions.count', 'Sessions.pageviews', 'Sessions.events']

      const [data, total] = await Promise.all([
        CoreReportingSerivce.callQueryEngine({ measures, dimensions: ['Sessions.date'] }, this.filter),
        CoreReportingSerivce.callQueryEngine({ measures }, this.filter)
      ])

      this.data = data
      this.total = total

      this.processing = false
    }
  }
}
</script>
