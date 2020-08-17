<template>
  <b-card
    no-body
    class="sessions-by-device-widget"
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
      </div>
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
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import { callQueryEngine } from '../../services/LoadService'
import SummaryCard from './SummaryCard.vue'
import DataLoaderMixin from '../../mixins/DataLoaderMixin'

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
            data: this.data.map((item) => ({
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
    },
    async fetchData() {
      this.processing = true

      this.data = await callQueryEngine({
        measures: ['Sessions.count'],
        dimensions: ['Sessions.deviceCategory']
      }, this.filter)

      this.processing = false
    }
  }
}
</script>
