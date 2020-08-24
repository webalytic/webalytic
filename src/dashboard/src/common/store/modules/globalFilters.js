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
    state.resources.items = resources
  },
  setActiveResources(state, resource) {
    state.resources.active = resource || state.resources.items[0] || null
  }
}

const actions = {
  async fetchResources({ commit }) {
    const resources = await ConfigurationService.resources()
    commit('setResources', resources)
  },

  async init(ctx, params) {
    await actions.fetchResources(ctx)
    ctx.commit('setActiveResources', ctx.state.resources.items.find((i) => i.id === params.resourceId))
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
        resource: state.resources.active,
        dateRange: {
          startDate: state.dateRange.startDate.format('YYYY-MM-DD'),
          endDate: state.dateRange.endDate.format('YYYY-MM-DD')
        }
      }
    }
  }
}
