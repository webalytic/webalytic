<template>
  <ValidationProvider
    v-slot="{ valid, errors }"
    rules="required"
    name="Name"
  >
    <b-form-group
      id="input-name-group"
      label="Name:"
      label-for="input-name"
      :invalid-feedback="errors[0]"
      :state="errors[0] ? false : (valid ? true : null)"
    >
      <b-form-input
        id="input-name"
        autofocus
        :value="value"
        placeholder="Enter name"
        style="min-width: 260px"
        @input="val => $emit('input', val)"
      />
    </b-form-group>
  </ValidationProvider>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>
