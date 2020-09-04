<template>
  <b-card
    title="Management custom definitions"
    class="shadow"
  >
    <b-overlay
      :show="processing"
      :opacity="0.4"
      rounded="sm"
    >
      <b-btn
        size="sm"
        class="float-right"
        variant="primary"
        @click="openForm()"
      >
        <i class="fa fa-plus" /> Add custom definition
      </b-btn>

      <div class="clearfix" />
      <custom-definition-tabs
        :custom-definitions="customDefinitions"
        @edit="openForm"
      />
    </b-overlay>

    <custom-definition-form-modal
      v-model="model"
      @submited="onSubmited()"
    />
  </b-card>
</template>

<script>
import ConfigurationService from '@/common/services/ConfigurationService'
import { CustomDefinitionType, CustomDefinitionScope } from '@/common/services/ConfigurationService/customDefinition'

import CustomDefinitionFormModal from '../components/customDefinition/CustomDefinitionFormModal.vue'
import CustomDefinitionTabs from '../components/customDefinition/CustomDefinitionTabs.vue'

export default {
  components: {
    CustomDefinitionFormModal,
    CustomDefinitionTabs
  },
  data() {
    return {
      model: null,
      processing: false,
      customDefinitions: []
    }
  },
  computed: {
    resourceId() {
      return this.$store.state.globalFilters.resources.active.id
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.processing = true
      this.customDefinitions = await ConfigurationService.customDefinitions({
        limit: 400,
        offset: 0,
        filter: {
          resourceId: this.resourceId
        }
      })
      this.processing = false
    },
    async openForm(model) {
      this.model = model || this.getDefaultCustomDefinition()
      this.$bvModal.show('custom-definition-modal')
    },
    getDefaultCustomDefinition() {
      const type = {
        '#dimensions': CustomDefinitionType.DIMENSION,
        '#metrics': CustomDefinitionType.METRIC
      }[this.$route.hash || '#dimensions']

      return {
        resourceId: this.resourceId,
        name: '',
        type,
        scope: CustomDefinitionScope.HIT,
        active: true
      }
    },
    onSubmited() {
      this.$bvModal.hide('custom-definition-modal')
      this.fetchData()
    }
  }
}
</script>
