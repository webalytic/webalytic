<template>
  <b-container class="bv-example-row">
    <b-navbar
      variant="faded"
      type="light"
    >
      <b-navbar-brand href="#">
        <b>WebAlytic</b>
      </b-navbar-brand>
    </b-navbar>

    <summary-widget />
    <br>
    <dynamic-chart />
  </b-container>
</template>

<script>
import SummaryWidget from '../components/SummaryWidget.vue'
import DynamicChart from '../components/DynamicChart.vue'

export default {
  name: 'IndexPage',
  components: {
    SummaryWidget,
    DynamicChart
  }
}
</script>
