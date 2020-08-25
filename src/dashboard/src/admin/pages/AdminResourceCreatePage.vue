<template>
  <b-card title="Create resource">
    <b-overlay
      :show="processing"
      :opacity="0.4"
      rounded="sm"
    >
      <ValidationObserver v-slot="{ passes }">
        <resource-form v-model="model" />
        <b-btn
          variant="primary"
          @click="passes(resourceCreate)"
        >
          Save
        </b-btn>
      </ValidationObserver>
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
      model: { name: '', category: 0, defaultWebsiteUrl: '' },
      processing: false
    }
  },
  methods: {
    async resourceCreate() {
      this.processing = true
      const instance = await ConfigurationService.resourceCreate(this.model)
      this.processing = false
      this.$router.push({ name: 'dashboard', params: { resourceId: instance.id } })
    }
  }
}
</script>
