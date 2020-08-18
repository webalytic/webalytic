<template>
  <b-nav
    class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
  >
    <side-bar-brand />

    <hr class="sidebar-divider my-0">

    <li class="nav-item">
      <router-link
        :to="{name: 'dashboard'}"
        class="nav-link"
      >
        <i class="fas fa-fw fa-tachometer-alt" />
        <span>Dashboard</span>
      </router-link>
    </li>

    <hr class="sidebar-divider">

    <div class="sidebar-heading">
      Management
    </div>

    <li class="nav-item">
      <router-link
        :to="{name: 'admin'}"
        class="nav-link"
      >
        <i class="fas fa-fw fa-wrench" />
        <span>Admin</span>
      </router-link>
    </li>

    <hr class="sidebar-divider d-none d-md-block">

    <div class="text-center d-none d-md-inline">
      <button
        id="sidebarToggle"
        class="rounded-circle border-0"
      />
    </div>
  </b-nav>
</template>

<script>
import SideBarBrand from './SideBarBrand.vue'

export default {
  components: {
    SideBarBrand
  }
}
</script>
