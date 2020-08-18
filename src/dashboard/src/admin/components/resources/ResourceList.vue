<template>
  <div>
    <b-card
      v-for="resource in resources"
      :key="resource.id"
      no-body
    >
      <div class="p-2 d-flex justify-content-between">
        <div>
          <b-card-title>{{ resource.name }}</b-card-title>
          <b-card-subtitle>
            <small>{{ resource.id }}</small>
          </b-card-subtitle>
        </div>
        <div>
          <b-btn
            size="sm"
            variant="light"
          >
            Edit
          </b-btn>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import ConfigurationService from '@/common/services/ConfigurationService'

export default {
  data() {
    return {
      resources: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.resources = await ConfigurationService.resources()
    }
  }
}
</script>
