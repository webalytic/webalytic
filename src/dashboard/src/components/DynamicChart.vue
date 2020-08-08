/* eslint-disable no-mixed-operators */

<template>
  <b-card title="Dynamic by last 30 days">
    <v-chart :options="options" />
  </b-card>
</template>

<style>
/**
 * The default size is 600px×400px, for responsive charts
 * you may need to set percentage values as follows (also
 * don't forget to provide a size for the container).
 */
.echarts {
  width: 100% !important;
  height: 100%;
}
</style>

<script>
import gql from 'graphql-tag'
import echarts from 'echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'

export default {
  apollo: {
    load: {
      query: gql`
        query load($measures: [String!], $dimensions: [String], $timeDimensions: [TimeDimensionInput], $order: JSON) {
          load(measures: $measures, dimensions: $dimensions, timeDimensions: $timeDimensions, order: $order)
        }`,
      variables: {
        measures: ['Sessions.count', 'Sessions.pageviews', 'Sessions.events'],
        timeDimensions: [{
          dimension: 'Sessions.date'
        }],
        dimensions: ['Sessions.date'],
        order: {
          'Sessions.date': 'asc'
        }
      }
    }
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
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          type: 'plain'
        },
        grid: {
          show: false,
          left: '3%',
          right: '3%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          minInterval: 3600 * 24 * 1000,
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter(value) {
              return echarts.format.formatTime('yyyy-MM-dd', value)
              // And other formatter tool (e.g. moment) can be used here.
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        color: ['#42b5fd', '#958ccb', '#ffc221', '#758191'],
        series: [{
          name: 'Sessions',
          type: 'line',
          smooth: false,
          // areaStyle: {
          //   color: "#42b5fd",
          //   opacity: 0.5
          // },
          data: this.load.map((row) => ({
            name: 'd',
            value: [
              row['Sessions.date'],
              row['Sessions.count']
            ]
          }))
        }, {
          name: 'PageViews',
          type: 'line',
          // areaStyle: {
          //   color: "#958ccb",
          //   opacity: 0.5
          // },
          smooth: false,
          data: this.load.map((row) => ({
            name: 'd',
            value: [
              row['Sessions.date'],
              row['Sessions.pageviews']
            ]
          }))
        },
        {
          name: 'Events',
          type: 'line',
          smooth: false,
          // areaStyle: {
          //   color: "#ffc221",
          //   opacity: 0.5
          // },
          data: this.load.map((row) => ({
            name: 'd',
            value: [
              row['Sessions.date'],
              row['Sessions.events']
            ]
          }))
        }]
      }
    }
  }
}
</script>
