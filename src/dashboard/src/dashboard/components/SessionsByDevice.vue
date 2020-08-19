<template>
  <b-card
    no-body
    class="sessions-by-device-widget shadow mb-4"
  >
    <b-card-body>
      <b-card-title>
        Sessions by device
      </b-card-title>

      <b-spinner
        v-show="processing"
        label="Spinning"
      />

      <div v-show="!processing">
        <div class="d-flex flex-row">
          <div
            v-for="item in data"
            :key="item['Sessions.deviceCategory']"
            class="mr-3"
          >
            <summary-card
              :label="normalizeDeviceCategory(item['Sessions.deviceCategory']) | ucFirst"
              :value="item['Sessions.count'] | number-short"
            />
          </div>
        </div>

        <v-chart
          :options="options"
          autoresize
        />
      </div>
    </b-card-body>
  </b-card>
</template>

<style>
.sessions-by-device-widget {
  min-width: 300px;
}
.sessions-by-device-widget .echarts {
  width: 100% !important;
  height: 150px !important;
}
</style>

<script>
/* eslint-disable max-len */
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import CoreReportingService from '@/common/services/CoreReportingService'

import SummaryCard from './SummaryCard.vue'
import DataLoaderMixin from '../mixins/DataLoaderMixin'

export default {
  components: {
    SummaryCard
  },
  mixins: [DataLoaderMixin],
  data() {
    return {
      processing: true,
      data: []
    }
  },
  computed: {

    options() {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        // legend: {
        //   bottom: -5,
        //   icon: 'circle'
        // },
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
                fontSize: '10'
              }
            },
            labelLine: {
              show: false
            },
            data: this.data.map((item) => ({
              value: item['Sessions.count'],
              name: this.normalizeDeviceCategory(item['Sessions.deviceCategory'])
            }))
          }
        ]
      }
    }
  },
  methods: {
    normalizeDeviceCategory(category) {
      return category || 'unknown'
    },
    async fetchData() {
      this.processing = true

      this.data = await CoreReportingService.callQueryEngine({
        measures: ['Sessions.count'],
        dimensions: ['Sessions.deviceCategory']
      }, this.filter)

      this.data.sort((a, b) => (+a['Sessions.count'] - +b['Sessions.count'] > 0 ? -1 : 1))

      const topData = this.data.slice(0, 3)
      const otherData = this.data.length > 3
        ? this.data.slice(3).reduce((obj, item) => {
          // eslint-disable-next-line no-param-reassign
          obj['Sessions.count'] += +item['Sessions.count']
          return obj
        }, {
          'Sessions.deviceCategory': 'other',
          'Sessions.count': 0
        })
        : null

      this.data = [...topData, ...(otherData ? [otherData] : [])]
      this.processing = false
    }
  }
}
</script>
