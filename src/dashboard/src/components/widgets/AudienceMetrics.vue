<template>
  <b-card
    no-body
    class="audience-widget"
  >
    <b-card-body>
      <b-card-title>
        Website Audience Metrics
      </b-card-title>
      <b-card-sub-title>
        Audience to which the users belonged while on the current date range
      </b-card-sub-title>
      <hr>
      <audience-metrics-summary />

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
.audience-widget .echarts {
  width: 100% !important;
  height: 200 !important;
}
</style>

<script>
/* eslint-disable max-len */
// import gql from 'graphql-tag'
import echarts from 'echarts'
import audienceMetricsFakeData from './audienceMetricsFakeData'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import AudienceMetricsSummary from './AudienceMetricsSummary.vue'

export default {
  components: {
    AudienceMetricsSummary
  },
  // apollo: {
  //   load: {
  //     query: gql`
  //       query load($measures: [String!], $dimensions: [String], $timeDimensions: [TimeDimensionInput], $order: JSON) {
  //         load(measures: $measures, dimensions: $dimensions, timeDimensions: $timeDimensions, order: $order)
  //       }`,
  //     variables: {
  //       measures: ['Sessions.count', 'Sessions.pageviews', 'Sessions.events'],
  //       timeDimensions: [{
  //         dimension: 'Sessions.date'
  //       }],
  //       dimensions: ['Sessions.date'],
  //       order: {
  //         'Sessions.date': 'asc'
  //       }
  //     }
  //   }
  // },
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
          right: '50px',
          bottom: '12%'
        },
        xAxis: {
          splitNumber: 10,
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
        series: [
          {
            showSymbol: false,
            name: 'Sessions',
            type: 'line',
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
            type: 'line',
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
            type: 'line',
            smooth: false,
            data: this.loadFake.map((row) => ({
              name: 'd',
              value: [
                row['Sessions.date'],
                row['Sessions.events']
              ]
            }))
          }
          // {
          //   showSymbol: false,
          //   name: 'Visitors',
          //   type: 'bar',
          //   smooth: false,
          //   data: this.loadFake.map((row) => ({
          //     name: 'd',
          //     value: [
          //       row['Sessions.date'],
          //       row['Sessions.events']
          //     ]
          //   }))
          // }
        ]
      }
    }
  }
}
</script>
