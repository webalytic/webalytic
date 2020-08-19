<template>
  <b-card
    no-body
    class="bounce-rate-widget shadow mb-4"
  >
    <b-card-body>
      <b-card-title>
        Bounce Rate
      </b-card-title>

      <summary-card
        v-show="!processing"
        label="Total"
        :value="total | percent"
      />

      <b-spinner
        v-show="processing"
        label="Spinning"
      />

      <div v-show="!processing">
        <v-chart
          :options="options"
          autoresize
        />
      </div>
    </b-card-body>
  </b-card>
</template>

<style>
.bounce-rate-widget {
  min-width: 135px;
}
.bounce-rate-widget .echarts {
  width: 100% !important;
  height: 150px !important;
}
</style>

<script>
/* eslint-disable max-len */
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import CoreReportingService from '@/common/services/CoreReportingService'

import SummaryCard from './SummaryCard.vue'
import BaseChartOptions from './BaseChartOptions'
import DataLoaderMixin from '../mixins/DataLoaderMixin'

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
      return this.data.reduce((sum, row) => sum + +row['Sessions.bounceRate'], 0) / this.data.length
    },
    options() {
      return {
        ...BaseChartOptions,
        xAxis: {
          ...BaseChartOptions.xAxis,
          min: this.filter.dateRange.startDate,
          max: this.filter.dateRange.endDate
        },
        grid: {
          show: false,
          height: '130px',
          left: '0%',
          right: '8%',
          bottom: '12%'
        },
        color: ['#3366d6'],
        series: [
          {
            showSymbol: false,
            name: 'Bounce rate',
            type: 'line',
            barWidth: '60%',
            smooth: false,
            data: this.data.map((row) => ({
              name: 'd',
              value: [
                row['Sessions.date'],
                row['Sessions.bounceRate']
              ]
            }))
          }
        ]
      }
    }
  },
  methods: {
    async fetchData() {
      this.processing = true

      this.data = await CoreReportingService.callQueryEngine({
        measures: ['Sessions.bounceRate'],
        dimensions: ['Sessions.date']
      }, this.filter)

      this.processing = false
    }
  }
}
</script>
