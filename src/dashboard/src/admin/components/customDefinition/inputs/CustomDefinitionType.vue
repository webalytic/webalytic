<template>
  <ValidationProvider
    v-slot="{ valid, errors }"
    rules="required"
    name="Type"
  >
    <b-form-group
      id="input-type-group"
      label="Type:"
      label-for="input-type"
      :invalid-feedback="errors[0]"
      :state="errors[0] ? false : (valid ? true : null)"
    >
      <b-form-select
        id="input-type"
        :value="value"
        :options="options"
        :disabled="disabled"
        placeholder="Select type"
        @input="val => $emit('input', val)"
      />
    </b-form-group>
  </ValidationProvider>
</template>

<script>
import { CustomDefinitionType } from '@/common/services/ConfigurationService/customDefinition'

export default {
  props: {
    disabled: {
      type: Boolean,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  computed: {
    options() {
      return [
        { value: CustomDefinitionType.DIMENSION, text: 'Dimension' },
        { value: CustomDefinitionType.METRIC, text: 'Metric' }
      ]
    }
  }
}
</script>
