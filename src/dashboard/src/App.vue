<template>
  <component
    :is="layout"
  />
</template>

<script>

import DashboardLayout from '@/common/layouts/DashboardLayout'

export default {
  name: 'App',
  computed: {
    layout() {
      // Add any logic for select layout
      return DashboardLayout
    }
  }
}
</script>

<style src="@fortawesome/fontawesome-free/css/all.min.css"></style>
<style src="vue2-daterange-picker/dist/vue2-daterange-picker.css"></style>

<style lang="scss">
  @import "./common/assets/scss/colors.scss";
  @import '~bootstrap/scss/bootstrap.scss';
  @import "./common/assets/scss/sb-admin-2.scss";
</style>
