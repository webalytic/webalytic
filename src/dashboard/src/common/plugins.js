import Vue from 'vue'
import ECharts from 'vue-echarts'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.component('v-chart', ECharts)

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
Object.keys(rules).forEach((rule) => extend(rule, rules[rule]))

extend('url', {
  validate(value) {
    if (value) {
      // eslint-disable-next-line no-useless-escape
      return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(value)
    }

    return false
  },
  message: 'This value must be a valid URL'
})

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
