<template>
  <component
    :is="layout"
    v-if="ready"
  >
    <router-view />
  </component>
</template>

<script>

import DashboardLayout from '@/common/layouts/DashboardLayout'

export default {
  name: 'App',
  data() {
    return {
      ready: false
    }
  },
  computed: {
    layout() {
      // Add any logic for select layout
      return DashboardLayout
    }
  },
  async created() {
    await this.$store.dispatch('init')
    this.ready = true
  }
}
</script>

<style src="@fortawesome/fontawesome-free/css/all.min.css"></style>
<style src="vue2-daterange-picker/dist/vue2-daterange-picker.css"></style>

<style lang="scss">
  @import "./common/assets/scss/colors.scss";
  @import '../../../node_modules/bootstrap/scss/bootstrap.scss';
  @import "./common/assets/scss/sb-admin-2.scss";
</style>
