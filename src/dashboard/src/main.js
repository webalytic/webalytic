/* eslint-disable import/first */
import Vue from 'vue'
import ECharts from 'vue-echarts'
import VueApollo from 'vue-apollo'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { ValidationProvider, extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import apolloClient from './common/apolloClient'
import useFilters from './common/filters'
import store from './common/store'
import router from './common/router'

import App from './App.vue'

useFilters(Vue)

Vue.component('ValidationProvider', ValidationProvider)
Object.keys(rules).forEach((rule) => extend(rule, rules[rule]))

Vue.component('v-chart', ECharts)
Vue.use(VueApollo)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

// eslint-disable-next-line no-new
new Vue({
  el: '#wrapper',
  render: (h) => h(App),
  store,
  router,
  apolloProvider: new VueApollo({
    defaultClient: apolloClient
  })
})
