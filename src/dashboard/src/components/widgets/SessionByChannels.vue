<template>
  <b-card
    no-body
    class="sessions-by-channels-widget"
  >
    <b-card-body>
      <b-card-title>
        Sessions by channel
      </b-card-title>
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
.sessions-by-channels-widget .echarts {
  width: 100% !important;
  height: 170px !important;
}
</style>

<script>
/* eslint-disable max-len */

import echarts from 'echarts'

import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import { fetchWithTimeDimensions } from '../../services/LoadService'

export default {
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
          height: '150px',
          left: '0%',
          right: '14%',
          bottom: '12%'
        },
        xAxis: {
          splitNumber: 2,
          type: 'time',
          // minInterval: 3600 * 24 * 1000,
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
        color: ['#3366d6', '#5c79dd', '#7a8ce4', '#95a0eb', '#aeb5f2', '#c6caf9', '#dee0ff'],
        series: Object.values(this.load.reduce((byChannel, row) => {
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
  async created() {
    this.load = await fetchWithTimeDimensions({
      measures: ['Sessions.count'],
      dimensions: ['Sessions.date', 'Sessions.channel']
    })
  }
}
</script>
