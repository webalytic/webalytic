import Vue from 'vue'
import Vuex from 'vuex'

import globalFiltersModule from './modules/globalFilters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    globalFilters: globalFiltersModule
  },
  strict: process.env.NODE_ENV !== 'production',
  actions: {
    async init() {
      await this.dispatch('globalFilters/init')
    }
  }
})
