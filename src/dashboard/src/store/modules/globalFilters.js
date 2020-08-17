import moment from 'moment'

function initState() {
  return {
    resourcesList: {

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
  }
}

const actions = {
  fetchResources() {
    // Todo: implement call api service
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
