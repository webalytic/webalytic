<template>
  <b-card
    no-body
    class="audience-widget"
  >
    <b-card-body>
      <b-card-title>
        Website Audience Metrics
      </b-card-title>
      <audience-metrics-summary />

      <v-chart
        :options="options"
        autoresize
      />
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
import echarts from 'echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import AudienceMetricsSummary from './AudienceMetricsSummary.vue'

import { fetchWithTimeDimensions } from '../../services/LoadService'

export default {
  components: {
    AudienceMetricsSummary
  },
  data() {
    return {
      load: []
    }
  },
  computed: {
    options() {
      return {
        animation: false,
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          show: false,
          height: '100px',
          left: '0%',
          right: '40px',
          bottom: '12%'
        },
        xAxis: {
          splitNumber: 10,
          type: 'time',
          minInterval: 3600 * 24 * 1000,
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#8d8d8d'
            }
          },
          axisLabel: {
            showMinLabel: false,
            showMaxLabel: false,
            formatter(value) {
              return echarts.format.formatTime('yyyy-MM-dd', value)
            }
          }
        },
        yAxis: {
          position: 'right',
          show: true,
          type: 'value',
          axisLabel: {
            inside: false,
            showMaxLabel: false,
            showMinLabel: false
          },
          axisLine: {
            lineStyle: {
              color: '#8d8d8d'
            },
            show: false
          },
          splitLine: {
            show: false
          },
          z: 10
        },
        color: ['#3366d6', '#915dd1', '#cb50be', '#f446a2', '#ff4d7f', '#ff655b', '#ff8536', '#ffa600'],
        series: [['Session', 'count'], ['PageViews', 'pageviews'], ['Events', 'events']].map(([name, field]) => ({
          showSymbol: false,
          name,
          type: 'line',
          smooth: false,
          data: this.load.map((row) => ({
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
  async created() {
    this.load = await fetchWithTimeDimensions({
      measures: ['Sessions.count', 'Sessions.pageviews', 'Sessions.events'],
      dimensions: ['Sessions.date']
    })
  }
}
</script>
