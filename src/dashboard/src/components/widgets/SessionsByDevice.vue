<template>
  <b-card
    no-body
    class="sessions-by-device-widget"
  >
    <b-card-body>
      <b-card-title>
        Sessions by device
      </b-card-title>
      <sessions-by-device-summary />
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
.sessions-by-device-widget .echarts {
  width: 100% !important;
  height: 150px !important;
}
</style>

<script>
/* eslint-disable max-len */
// import gql from 'graphql-tag'
import audienceMetricsFakeData from './audienceMetricsFakeData'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import SessionsByDeviceSummary from './SessionsByDeviceSummary.vue'

export default {
  components: {
    SessionsByDeviceSummary
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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          bottom: -5,
          icon: 'circle'
        },
        color: ['#3366d6', '#95a0eb', '#dee0ff'],
        series: [
          {
            name: 'Sessions',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '15',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: 'Desktop' },
              { value: 310, name: 'Mobile' },
              { value: 234, name: 'Tablet' }
            ]
          }
        ]
      }
    }
  }
}
</script>
