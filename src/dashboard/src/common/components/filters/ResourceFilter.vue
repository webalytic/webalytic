<template>
  <b-dropdown
    id="dropdown-aria"
    :text="active.name"
    variant="primary"
  >
    <b-dropdown-item
      v-for="resource of resources"
      :key="resource.id"
    >
      <router-link :to="{name: $route.name, params:{resourceId: resource.id }}">
        {{ resource.name }}
      </router-link>
    </b-dropdown-item>

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
