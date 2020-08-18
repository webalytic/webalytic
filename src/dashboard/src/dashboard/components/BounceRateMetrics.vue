<template>
  <b-card
    no-body
    class="visitors-widget shadow"
  >
    <b-card-body>
      <b-card
        no-body
        class="border-0"
      >
        <div
          v-show="!processing"
          class="d-flex flex-row"
        >
          <div class="pr-3 pl-3">
            <summary-card
              label="Bounce Rate"
              :value="total | percent"
            />
          </div>
        </div>
      </b-card>

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
/**
 * The default size is 600px×400px, for responsive charts
 * you may need to set percentage values as follows (also
 * don't forget to provide a size for the container).
 */
.visitors-widget .echarts {
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
