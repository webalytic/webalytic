<template>
  <div>
    <!-- Page Heading -->
    <h1 class="h3 mb-4 text-gray-800">
      Blank Page
    </h1>

    <summary-widget />
    <br>
    <dynamic-chart />
  </div>
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
