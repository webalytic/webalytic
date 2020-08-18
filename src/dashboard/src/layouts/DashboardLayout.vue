<template>
  <div id="wrapper">
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
import SideBar from '@/components/layout/SideBar.vue'
import TopNavBar from '@/components/layout/TopNavBar.vue'
import FooterBar from '@/components/layout/FooterBar.vue'

export default {
  components: {
    SideBar,
    TopNavBar,
    FooterBar
  }
}
</script>
