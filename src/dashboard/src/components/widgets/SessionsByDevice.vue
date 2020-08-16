<template>
  <b-card
    no-body
    class="sessions-by-device-widget"
  >
    <b-card-body>
      <b-card-title>
        Sessions by device
      </b-card-title>

      <div class="d-flex flex-row">
        <div
          v-for="item in load"
          :key="item['Sessions.deviceCategory']"
          class="pr-3 pl-3"
        >
          <summary-card
            :label="normalizeDeviceCategory(item['Sessions.deviceCategory']) | ucFirst"
            :value="item['Sessions.count'] | number"
          />
        </div>
      </div>

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
import gql from 'graphql-tag'
import audienceMetricsFakeData from './audienceMetricsFakeData'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'

import SummaryCard from './SummaryCard.vue'

export default {
  components: {
    SummaryCard
  },
  apollo: {
    load: {
      query: gql`
        query load($measures: [String!], $dimensions: [String], $timeDimensions: [TimeDimensionInput], $order: JSON) {
          load(measures: $measures, dimensions: $dimensions, timeDimensions: $timeDimensions, order: $order)
        }`,
      variables: {
        measures: ['Sessions.count'],
        dimensions: ['Sessions.deviceCategory']
      }
    }
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
            data: this.load.map((item) => ({
              value: item['Sessions.count'],
              name: item['Sessions.deviceCategory']
            }))
          }
        ]
      }
    }
  },
  methods: {
    normalizeDeviceCategory(category) {
      return category || 'unknown'
    }
  }
}
</script>
