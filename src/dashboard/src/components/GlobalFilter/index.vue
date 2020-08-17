<template>
  <div>
    <resource-input />

    <date-range-input />
  </div>
</template>

<script>
import DateRangeInput from './inputs/DateRangeInput.vue'
import ResourceInput from './inputs/ResourceInput.vue'

export default {
  components: {
    DateRangeInput,
    ResourceInput
  }
}
</script>
