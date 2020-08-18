<template>
  <date-range-picker
    v-model="dateRange"
    class="pull-right"
    opens="left"
  />
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker'

export default {
  components: {
    DateRangePicker
  },
  computed: {
    dateRange: {
      get() {
        const { dateRange } = this.$store.state.globalFilters
        return {
          endDate: dateRange.endDate.clone(),
          startDate: dateRange.startDate.clone()
        }
      },
      set(dateRange) {
        this.$store.commit('globalFilters/setDateRange', dateRange)
      }
    }
  }
}
</script>
