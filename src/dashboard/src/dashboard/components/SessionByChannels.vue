<template>
  <b-card
    no-body
    class="sessions-by-channels-widget shadow"
  >
    <b-card-body>
      <b-card-title>
        Sessions by channel
      </b-card-title>

      <b-spinner
        v-show="processing"
        label="Spinning"
      />

      <v-chart
        v-show="!processing"
        :options="options"
        autoresize
      />
    </b-card-body>
  </b-card>
</template>

<style>
/**
 * The default size is 600px×400px, for responsive charts
 * you may need to set percentage values as follows (also
 * don't forget to provide a size for the container).
 */
.sessions-by-channels-widget .echarts {
  width: 100% !important;
  height: 170px !important;
}
</style>

<script>
/* eslint-disable max-len */

import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import CoreReportingService from '@/common/services/CoreReportingService'

import BaseChartOptions from './BaseChartOptions'
import DataLoaderMixin from '../mixins/DataLoaderMixin'

export default {
  mixins: [DataLoaderMixin],
  data() {
    return {
      processing: true,
      data: []
    }
  },
  computed: {
    options() {
      return {
        ...BaseChartOptions,
        grid: {
          show: false,
          height: '150px',
          left: '0%',
          right: '14%',
          bottom: '12%'
        },
        color: ['#3366d6', '#5c79dd', '#7a8ce4', '#95a0eb', '#aeb5f2', '#c6caf9', '#dee0ff'],
        series: Object.values(this.data.reduce((byChannel, row) => {
          // eslint-disable-next-line no-param-reassign
          if (!byChannel[row['Sessions.channel']]) byChannel[row['Sessions.channel']] = []
          byChannel[row['Sessions.channel']].push(row)
          return byChannel
        }, {})).map((rows) => ({
          showSymbol: false,
          name: rows[0]['Sessions.channel'],
          type: 'bar',
          stack: 'one',
          smooth: false,
          data: rows.map((row) => ({
            name: 'd',
            value: [
              row['Sessions.date'],
              row['Sessions.count']
            ]
          }))
        }))
      }
    }

  },
  methods: {
    async fetchData() {
      this.processing = true

      this.data = await CoreReportingService.callQueryEngine({
        measures: ['Sessions.count'],
        dimensions: ['Sessions.date', 'Sessions.channel']
      }, this.filter)

      this.processing = false
    }
  }
}
</script>
