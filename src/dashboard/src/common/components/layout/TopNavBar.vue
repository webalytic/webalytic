<template>
  <!-- Topbar -->
  <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
    <!-- Sidebar Toggle (Topbar) -->
    <button
      id="sidebarToggleTop"
      class="btn btn-link d-md-none rounded-circle mr-3"
    >
      <i class="fa fa-bars" />
    </button>

    <resource-filter />

    <!-- Topbar Navbar -->
    <ul class="navbar-nav ml-auto">
      <!-- Nav Item - Search Dropdown (Visible Only XS) -->
      <li class="nav-item dropdown no-arrow d-sm-none">
        <a
          class="nav-link dropdown-toggle"
          href="#"
        >
          <i class="fas fa-search fa-fw" />
        </a>
        <!-- Dropdown - Messages -->
        <div
          class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
          aria-labelledby="searchDropdown"
        >
          <form class="form-inline mr-auto w-100 navbar-search">
            <div class="input-group">
              <input
                type="text"
                class="form-control bg-light border-0 small"
                placeholder="Search for..."
              >
              <div class="input-group-append">
                <button
                  class="btn btn-primary"
                  type="button"
                >
                  <i class="fas fa-search fa-sm" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </li>

      <!-- Nav Item - Alerts -->
      <li class="nav-item dropdown no-arrow mx-1">
        <a
          id="alertsDropdown"
          class="nav-link dropdown-toggle"
          href="#"
        >
          <i class="fas fa-bell fa-fw" />
        </a>
      </li>

      <!-- Nav Item - Messages -->
      <li class="nav-item dropdown no-arrow mx-1">
        <a
          id="messagesDropdown"
          class="nav-link dropdown-toggle"
          href="#"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i class="fas fa-envelope fa-fw" />
        </a>
      </li>

      <div class="topbar-divider d-none d-sm-block" />

      <!-- Nav Item - User Information -->
      <li class="nav-item dropdown no-arrow">
        <a
          id="userDropdown"
          class="nav-link dropdown-toggle"
          href="#"
        >
          <span class="mr-2 d-none d-lg-inline text-gray-600 small">Admin</span>
          <img
            class="img-profile rounded-circle"
            src="/images/logo-user.png"
          >
        </a>
      </li>
    </ul>
  </nav>
  <!-- End of Topbar -->
</template>

<script>
import ResourceFilter from '../filters/ResourceFilter.vue'

export default {
  components: {
    ResourceFilter
  }
}
</script>
