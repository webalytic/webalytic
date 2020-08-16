<template>
  <b-card
    no-body
    class="visitors-widget"
  >
    <b-card-body>
      <b-card
        no-body
        class="border-0"
      >
        <div class="d-flex flex-row">
          <div class="pr-3 pl-3">
            <summary-card
              label="Bounce Rate"
              :value="total | percent"
            />
          </div>
        </div>
      </b-card>

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
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import SummaryCard from './SummaryCard.vue'
import { fetchWithTimeDimensions } from '../../services/LoadService'

export default {
  components: {
    SummaryCard
  },

  data() {
    return {
      load: []
    }
  },
  computed: {
    total() {
      return this.load.reduce((sum, row) => sum + +row['Sessions.bounceRate'], 0) / this.load.length
    },
    options() {
      return {
        animation: false,
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          show: false,
          height: '130px',
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
            data: this.load.map((row) => ({
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
  async created() {
    this.load = await fetchWithTimeDimensions({
      measures: ['Sessions.bounceRate'],
      dimensions: ['Sessions.date']
    })
  }
}
</script>
