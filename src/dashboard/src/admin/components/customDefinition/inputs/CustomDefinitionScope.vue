<template>
  <ValidationProvider
    v-slot="{ valid, errors }"
    rules="required"
    name="Scope"
  >
    <b-form-group
      id="input-scope-group"
      label="Scope:"
      label-for="input-scope"
      :invalid-feedback="errors[0]"
      :state="errors[0] ? false : (valid ? true : null)"
    >
      <b-form-select
        id="input-scope"
        :value="value"
        :options="options"
        placeholder="Select scope"
        @input="val => $emit('input', val)"
      />
    </b-form-group>
  </ValidationProvider>
</template>

<script>
import { CustomDefinitionScope } from '@/common/services/ConfigurationService/customDefinition'

export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  computed: {
    options() {
      return [
        { value: CustomDefinitionScope.HIT, text: 'Hit' },
        { value: CustomDefinitionScope.SESSION, text: 'Session' }
      ]
    }
  }
}
</script>
