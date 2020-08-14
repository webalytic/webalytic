<template>
  <div id="wrapper">
    <side-bar />
    <div
      id="content-wrapper"
      class="d-flex flex-column"
    >
      <!-- Main Content -->
      <div id="content">
        <top-nav-bar />

        <!-- Begin Page Content -->
        <div class="container-fluid">
          <index-page />
        </div>
        <!-- /.container-fluid -->
      </div>
      <!-- End of Main Content -->

      <footer-bar />
    </div>
  </div>
</template>

<style lang="css">
  @import '../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
</style>

<style lang="scss">
  @import "../../../node_modules/bootstrap/scss/bootstrap.scss";
  @import "./assets/scss/sb-admin-2.scss";
</style>

<script>
import SideBar from './components/SideBar.vue'
import FooterBar from './components/FooterBar.vue'
import TopNavBar from './components/TopNavBar.vue'
import IndexPage from './pages/IndexPage.vue'

export default {
  name: 'App',
  components: {
    SideBar,
    TopNavBar,
    FooterBar,
    IndexPage
  }
}
</script>
