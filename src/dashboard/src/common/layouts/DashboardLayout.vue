<template>
  <div
    v-if="ready"
    id="wrapper"
  >
    <side-bar />

    <div
      id="content-wrapper"
      class="d-flex flex-column"
    >
      <div id="content">
        <top-nav-bar />

        <div class="container-fluid">
          <router-view />
        </div>
      </div>

      <footer-bar />
    </div>
  </div>
</template>

<script>
import SideBar from '../components/layout/SideBar.vue'
import TopNavBar from '../components/layout/TopNavBar.vue'
import FooterBar from '../components/layout/FooterBar.vue'

export default {
  components: {
    SideBar,
    TopNavBar,
    FooterBar
  },
  data() {
    return {
      ready: false
    }
  },
  watch: {
    // eslint-disable-next-line func-names
    '$route.params.resourceId': function () {
      this.init()
    }
  },
  async created() {
    this.init()
  },
  methods: {
    async init() {
      // Todo: implement logic UI if resource not created yet
      // Todo: implement redirect to 404 if resourceId not exits
      // Todo: use window.location.pathname - not good solution
      this.ready = false
      const resourceId = window.location.pathname.split('/')[1]
      await this.$store.dispatch('init', { resourceId })
      this.ready = true
    }
  }
}
</script>
