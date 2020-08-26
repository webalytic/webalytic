<template>
  <b-row class="admin-page mb-4">
    <b-col lg="3 mb-4">
      <side-bar-menu />
    </b-col>
    <b-col lg="9">
      <router-view />
    </b-col>
  </b-row>
</template>

<script>
import SideBarMenu from '../components/SideBarMenu.vue'

export default {
  components: {
    SideBarMenu
  }
}
</script>
