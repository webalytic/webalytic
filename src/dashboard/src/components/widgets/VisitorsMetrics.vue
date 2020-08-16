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
              label="Visitors"
              :value="totalVisitors | number"
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
      load: [],
      total: []
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
            name: 'Visitors',
            type: 'bar',
            barWidth: '60%',
            smooth: false,
            data: this.load.map((row) => ({
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
  async created() {
    this.load = await fetchWithTimeDimensions({
      measures: ['Sessions.visitors'],
      dimensions: ['Sessions.date']
    })

    this.total = await fetchWithTimeDimensions({
      measures: ['Sessions.visitors']
    })
  }
}
</script>
