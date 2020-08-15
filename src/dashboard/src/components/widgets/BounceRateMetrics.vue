<template>
  <b-card
    no-body
    class="visitors-widget"
  >
    <b-card-body>
      <bounce-rate-metrics-summary />
      <v-chart
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
.visitors-widget .echarts {
  width: 100% !important;
  height: 150px !important;
}
</style>

<script>
/* eslint-disable max-len */
// import gql from 'graphql-tag'
import echarts from 'echarts'
import audienceMetricsFakeData from './audienceMetricsFakeData'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import BounceRateMetricsSummary from './BounceRateMetricsSummary.vue'

export default {
  components: {
    BounceRateMetricsSummary
  },

  data() {
    return {
      load: [],
      loadFake: audienceMetricsFakeData()
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
          height: '150px',
          left: '0%',
          right: '8%',
          bottom: '12%'
        },
        xAxis: {
          show: true,
          splitNumber: 2,
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
          min: 0,
          max: 100,
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
        color: ['#3366d6'],
        series: [
          {
            showSymbol: false,
            name: 'Bounce rate',
            type: 'line',
            barWidth: '60%',
            smooth: false,
            data: this.loadFake.map((row) => ({
              name: 'd',
              value: [
                row['Sessions.date'],
                (row['Sessions.events'] * 100) / 8000
              ]
            }))
          }
        ]
      }
    }
  }
}
</script>
