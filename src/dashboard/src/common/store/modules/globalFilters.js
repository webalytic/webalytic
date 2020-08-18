import moment from 'moment'
import ConfigurationService from '@/common/services/ConfigurationService'

function initState() {
  return {
    resources: {
      active: null,
      items: []
    },
    dateRange: {
      startDate: moment().subtract(30, 'days'),
      endDate: moment()
    }
  }
}

const mutations = {
  setDateRange(state, dateRange) {
    state.dateRange.startDate = moment(dateRange.startDate)
    state.dateRange.endDate = moment(dateRange.endDate)
  },
  setResources(state, resources) {
    state.resources.active = resources[0] || null
    state.resources.items = resources
  }
}

const actions = {
  async fetchResources({ commit }) {
    const resources = await ConfigurationService.resources()
    commit('setResources', resources)
  },

  async init(ctx) {
    await actions.fetchResources(ctx)
  }
}

export default {
  namespaced: true,
  state: initState(),
  mutations,
  actions,
  getters: {
    filter(state) {
      return {
        dateRange: {
          startDate: state.dateRange.startDate.format('YYYY-MM-DD'),
          endDate: state.dateRange.endDate.format('YYYY-MM-DD')
        }
      }
    }
  }
}
