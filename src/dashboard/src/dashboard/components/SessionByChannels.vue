<template>
  <b-card
    no-body
    class="sessions-by-channels-widget shadow mb-4"
  >
    <b-card-body>
      <b-card-title>
        Sessions by channel
      </b-card-title>

      <summary-card
        label="Total"
        :value="total | number-short"
      />

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
.sessions-by-channels-widget {
  min-width: 300px;
}
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

      const dateByDates = Object.values(this.data.reduce((obj, row) => {
        const date = row['Sessions.date']
        // eslint-disable-next-line no-param-reassign
        if (!obj[date]) obj[date] = []
        obj[date].push(row)
        return obj
      }, {})).map((arr) => {
        arr.sort((a, b) => (+a['Sessions.count'] - +b['Sessions.count'] > 0 ? -1 : 1))
        const limit = 5
        const date = arr[0]['Sessions.date']
        const topData = arr.slice(0, limit)
        const otherData = arr.length > limit
          ? arr.slice(limit).reduce((obj, item) => {
          // eslint-disable-next-line no-param-reassign
            obj['Sessions.count'] += +item['Sessions.count']
            return obj
          }, {
            'Sessions.date': date,
            'Sessions.channel': 'other',
            'Sessions.count': 0
          })
          : null

        return [...topData, ...(otherData ? [otherData] : [])]
      }).flat()

      this.data = dateByDates

      this.processing = false
    }
  }
}
</script>
