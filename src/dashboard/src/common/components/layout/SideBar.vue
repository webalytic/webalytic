<template>
  <b-nav
    class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
  >
    <side-bar-brand />

    <hr class="sidebar-divider my-0">

    <router-link
      :to="{name: 'dashboard'}"
      class="nav-item"
      tag="li"
    >
      <a
        href=""
        class="nav-link"
      >
        <i class="fas fa-fw fa-tachometer-alt" />
        <span>Dashboard</span>
      </a>
    </router-link>

    <hr class="sidebar-divider">

    <div class="sidebar-heading">
      Management
    </div>

    <router-link
      :to="{name: 'admin'}"
      class="nav-item"
      tag="li"
    >
      <a
        href=""
        class="nav-link"
      >
        <i class="fas fa-fw fa-wrench" />
        <span>Admin</span>
      </a>
    </router-link>

    <hr class="sidebar-divider d-none d-md-block">

    <div class="text-center d-none d-md-inline">
      <button
        id="sidebarToggle"
        class="rounded-circle border-0"
        @click="toggle"
      />
    </div>
  </b-nav>
</template>

<script>
import SideBarBrand from './SideBarBrand.vue'

export default {
  components: {
    SideBarBrand
  },
  methods: {
    toggle() {
      document.body.classList.toggle('sidebar-toggled')
      document.querySelector('.sidebar').classList.toggle('toggled')
    }
  }
}
</script>
