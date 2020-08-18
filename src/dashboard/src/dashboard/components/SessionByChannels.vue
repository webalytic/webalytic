<template>
  <b-card
    no-body
    class="sessions-by-channels-widget shadow"
  >
    <b-card-body>
      <b-card
        no-body
        class="border-0"
      >
        <div
          class="d-flex flex-row"
        >
          <div class="pr-3 pl-3">
            <summary-card
              label="Sessions by channel"
              :value="total | number"
            />
          </div>
        </div>
      </b-card>

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
  height: 150px !important;
}
</style>

<script>
/* eslint-disable max-len */

import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import CoreReportingService from '@/common/services/CoreReportingService'

import BaseChartOptions from './BaseChartOptions'
import DataLoaderMixin from '../mixins/DataLoaderMixin'
import SummaryCard from './SummaryCard.vue'

export default {
  components: {
    SummaryCard
  },
  mixins: [DataLoaderMixin],
  data() {
    return {
      processing: true,
      data: []
    }
  },
  computed: {
    total() {
      return this.data.reduce((sum, row) => sum + +row['Sessions.count'], 0)
    },
    options() {
      return {
        ...BaseChartOptions,
        grid: {
          show: false,
          height: '130px',
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
