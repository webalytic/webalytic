<template>
  <b-dropdown
    id="dropdown-aria"
    :text="active.name"
    variant="primary"
  >
    <b-dropdown-item-button
      v-for="resource of resources"
      :key="resource.id"
    >
      {{ resource.name }}
    </b-dropdown-item-button>

    <b-dropdown-divider />

    <b-dropdown-item>
      <router-link
        :to="{name: 'admin-resource-create'}"
        tag="span"
      >
        Add resource
        <i class="fa fa-plus" />
      </router-link>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      resources: (state) => state.globalFilters.resources.items,
      active: (state) => state.globalFilters.resources.active
    })
  }
}
</script>
