<template>
  <ValidationObserver v-slot="{ passes }">
    <b-modal
      id="custom-definition-modal"
      size="lg"
      :title="title"
    >
      <b-overlay
        :show="processing"
        :opacity="0.2"
        rounded="sm"
      >
        <custom-definition-form
          v-model="value"
          :is-new-record="isNewRecord"
        />
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
  computed: {
    isNewRecord() {
      return this.value && !this.value.id
    },
    title() {
      return this.isNewRecord
        ? 'Create definition'
        : 'Update definition'
    }
  },
  methods: {
    async submitCustomDefinitionForm() {
      this.processing = true

      if (this.isNewRecord) {
        await ConfigurationService.customDefinitionCreate(this.value)
      } else {
        await ConfigurationService.customDefinitionUpdate(this.value.id, {
          name: this.value.name,
          scope: this.value.scope,
          active: this.value.active
        })
      }

      this.processing = false
      this.$emit('submited')
    }
  }
}
</script>
