<template>
  <b-card
    no-body
    class="visitors-widget shadow mb-4"
  >
    <b-card-body>
      <b-card-title>
        Visitors
      </b-card-title>

      <summary-card
        v-show="!processing"
        label="Total"
        :value="totalVisitors | number-short"
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
.visitors-widget {
  min-width: 135px;
}
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
import DataLoaderMixin from '../mixins/DataLoaderMixin'
import BaseChartOptions from './BaseChartOptions'

export default {
  components: {
    SummaryCard
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
        grid: {
          show: false,
          height: '150px',
          left: '0%',
          right: '14%',
          bottom: '12%'
        },
        color: ['#3366d6'],
        series: [
          {
            showSymbol: false,
            name: 'Visitors',
            type: 'bar',
            barWidth: '60%',
            smooth: false,
            data: this.data.map((row) => ({
              name: 'd',
              value: [
                row['Sessions.date'],
                row['Sessions.visitors']
              ]
            }))
          }
        ]
      }
    },
    totalVisitors() {
      return this.total.length ? this.total[0]['Sessions.visitors'] : 0
    }

  },
  methods: {
    async fetchData() {
      this.processing = true
      const [data, total] = await Promise.all([
        CoreReportingService.callQueryEngine({
          measures: ['Sessions.visitors'],
          dimensions: ['Sessions.date']
        }, this.filter),
        CoreReportingService.callQueryEngine({
          measures: ['Sessions.visitors']
        }, this.filter)
      ])

      this.data = data
      this.total = total

      this.processing = false
    }
  }

}
</script>
