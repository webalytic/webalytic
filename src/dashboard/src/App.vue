<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import DashboardLayout from '@/layouts/DashboardLayout'

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

<style lang="css">
  @import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
  @import '../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css';
</style>

<style lang="scss">
  @import "./assets/scss/colors.scss";
  @import "../node_modules/bootstrap/scss/bootstrap.scss";
  @import "./assets/scss/sb-admin-2.scss";
</style>
