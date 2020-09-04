<template>
  <ValidationObserver v-slot="{ passes }">
    <b-modal
      id="custom-definition-modal"
      size="lg"
      title="Create dimension"
    >
      <b-overlay
        :show="processing"
        :opacity="0.2"
        rounded="sm"
      >
        <custom-definition-form v-model="value" />
      </b-overlay>

      <template v-slot:modal-footer>
        <b-btn
          :disabled="processing"
          variant="primary"
          @click="passes(submitCustomDefinitionForm)"
        >
          Save
        </b-btn>
      </template>
    </b-modal>
  </ValidationObserver>
</template>

<script>
import ConfigurationService from '@/common/services/ConfigurationService'
import CustomDefinitionForm from './CustomDefinitionForm.vue'

export default {
  components: {
    CustomDefinitionForm
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      processing: false
    }
  },
  methods: {
    async submitCustomDefinitionForm() {
      this.processing = true

      const { id, ...data } = this.value
      const isNewRecord = !id
      if (isNewRecord) {
        await ConfigurationService.customDefinitionCreate(data)
      } else {
        await ConfigurationService.customDefinitionUpdate(id, {
          name: data.name,
          scope: data.scope,
          active: data.active
        })
      }

      this.processing = false
      this.$emit('submited')
    }
  }
}
</script>
