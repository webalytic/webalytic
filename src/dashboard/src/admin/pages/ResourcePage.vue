<template>
  <b-card
    title="Management resource"
    class="shadow"
  >
    <b-overlay
      :show="processing"
      :opacity="0.4"
      rounded="sm"
    >
      <resource-form v-model="model" />
      <b-btn
        size="sm"
        variant="primary"
        @click="resourceUpdate"
      >
        Save
      </b-btn>
    </b-overlay>
  </b-card>
</template>

<script>
import ConfigurationService from '@/common/services/ConfigurationService'
import ResourceForm from '../components/resources/ResourceForm.vue'

export default {
  components: {
    ResourceForm
  },
  data() {
    return {
      id: null,
      model: null,
      processing: false
    }
  },
  created() {
    const {
      id, name, category, defaultWebsiteUrl
    } = this.$store.state.globalFilters.resources.active

    this.id = id
    this.model = { name, category, defaultWebsiteUrl }
  },
  methods: {
    async resourceUpdate() {
      this.processing = true
      await ConfigurationService.resourceUpdate(this.id, this.model)
      this.processing = false
    }
  }
}
</script>
