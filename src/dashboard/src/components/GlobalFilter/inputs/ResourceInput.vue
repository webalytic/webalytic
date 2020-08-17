<template>
  <b-dropdown
    id="dropdown-aria"
    text="first.site.com"
    variant="primary"
  >
    <b-dropdown-item-button aria-describedby="dropdown-header-1">
      first.site.com
    </b-dropdown-item-button>
    <b-dropdown-item-button aria-describedby="dropdown-header-1">
      second.site.com
    </b-dropdown-item-button>

    <b-dropdown-divider />

    <b-dropdown-item-button>
      Add resource
      <i class="fa fa-plus" />
    </b-dropdown-item-button>
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState()
  }
}
</script>
