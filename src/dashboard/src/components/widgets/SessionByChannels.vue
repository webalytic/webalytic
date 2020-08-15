<template>
  <b-card
    no-body
    class="sessions-by-channels-widget"
  >
    <b-card-body>
      <b-card-title>
        Sessions by channels
      </b-card-title>
    </b-card-body>

    <v-chart
      :options="options"
      autoresize
    />
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
  height: 270 !important;
}
</style>

<script>
/* eslint-disable max-len */
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/polar'

export default {
  computed: {
    options() {
      return {
        grid: {
          show: false,
          height: '270px',
          left: '0%',
          right: '0%',
          bottom: '0%'
        },
        color: ['#f6c95e', '#6f4d7b', '#ffa055', '#0b84a5', '#cb4630', '#9dd866', '#8dddd0'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['Organic search', 'Email', 'Referral', 'Social', 'Other']
        },
        series: [
          {
            name: 'Channel',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: 'Organic search' },
              { value: 310, name: 'Email' },
              { value: 234, name: 'Referral' },
              { value: 135, name: 'Social' },
              { value: 1548, name: 'Other' }
            ]
          }
        ]
      }
    }
  }
}
</script>
