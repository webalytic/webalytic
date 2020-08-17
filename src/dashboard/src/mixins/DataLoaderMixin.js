import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      filter: 'globalFilters/filter'
    })
  },
  watch: {
    filter() {
      this.fetchData()
    }
  },
  async created() {
    this.fetchData()
  }
}
