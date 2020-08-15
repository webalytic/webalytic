<template>
  <b-card
    no-body
    class="sessions-by-channels-widget"
  >
    <b-card-body>
      <b-card-title>
        Sessions by channels
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
  height: 270px !important;
}
</style>

<script>
/* eslint-disable max-len */

import echarts from 'echarts'
import audienceMetricsFakeData from './audienceMetricsFakeData'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'

export default {
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
          height: '250px',
          left: '0%',
          right: '10%',
          bottom: '10%'
        },
        xAxis: {
          splitNumber: 4,
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
        series: [
          {
            showSymbol: false,
            name: 'Sessions',
            type: 'bar',
            stack: 'one',
            smooth: false,
            data: this.loadFake.map((row) => ({
              name: 'd',
              value: [
                row['Sessions.date'],
                row['Sessions.count']
              ]
            }))
          }, {
            showSymbol: false,
            name: 'PageViews',
            type: 'bar',
            stack: 'one',
            smooth: false,
            data: this.loadFake.map((row) => ({
              name: 'd',
              value: [
                row['Sessions.date'],
                row['Sessions.pageviews']
              ]
            }))
          },
          {
            showSymbol: false,
            name: 'Events',
            type: 'bar',
            stack: 'one',
            smooth: false,
            data: this.loadFake.map((row) => ({
              name: 'd',
              value: [
                row['Sessions.date'],
                row['Sessions.events']
              ]
            }))
          },
          {
            showSymbol: false,
            name: 'Visitors',
            type: 'bar',
            stack: 'one',
            smooth: false,
            data: this.loadFake.map((row) => ({
              name: 'd',
              value: [
                row['Sessions.date'],
                row['Sessions.visitors']
              ]
            }))
          }
        ]
      }
    }

  }
}
</script>
