/* eslint-disable import/first */
import Vue from 'vue'
import VueApollo from 'vue-apollo'

import './common/plugins'
import './common/filters'
import apolloClient from './common/apolloClient'
import store from './common/store'
import router from './common/router'

import App from './App.vue'

Vue.use(VueApollo)

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
