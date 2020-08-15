<template>
  <b-card
    no-body
    class="border-0"
  >
    <div class="d-flex flex-row">
      <div class="pr-3 pl-3">
        <summary-card
          label="Bounce Rate"
          :value="32.3 | percent"
        />
      </div>
    </div>
  </b-card>
</template>

<script>
import SummaryCard from './SummaryCard.vue'

export default {
  components: {
    SummaryCard
  }

}
</script>
