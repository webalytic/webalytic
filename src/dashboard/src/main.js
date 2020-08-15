/* eslint-disable import/first */
import Vue from 'vue'
import ECharts from 'vue-echarts'
import VueApollo from 'vue-apollo'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import apolloClient from './apolloClient'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import useFilters from './filters'

import App from './App.vue'

useFilters(Vue)

Vue.component('v-chart', ECharts)
Vue.use(VueApollo)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

// eslint-disable-next-line no-new
new Vue({
  el: '#wrapper',
  render: (h) => h(App),
  apolloProvider: new VueApollo({
    defaultClient: apolloClient
  })
})
