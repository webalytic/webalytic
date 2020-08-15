<template>
  <b-nav
    class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
  >
    <!-- Sidebar - Brand -->
    <side-bar-brand />

    <!-- Divider -->
    <hr class="sidebar-divider my-0">

    <!-- Nav Item - Dashboard -->
    <li class="nav-item">
      <a
        class="nav-link"
        href="index.html"
      >
        <i class="fas fa-fw fa-tachometer-alt" />
        <span>Dashboard</span></a>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider">

    <!-- Heading -->
    <div class="sidebar-heading">
      Management
    </div>

    <!-- Nav Item - Tables -->
    <li class="nav-item">
      <a
        class="nav-link"
        href="tables.html"
      >
        <i class="fas fa-fw fa-wrench" />
        <span>Settings</span></a>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider d-none d-md-block">

    <!-- Sidebar Toggler (Sidebar) -->
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
