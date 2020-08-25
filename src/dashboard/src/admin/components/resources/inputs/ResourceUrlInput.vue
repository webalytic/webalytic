<template>
  <ValidationProvider
    v-slot="{ valid, errors }"
    rules="required|url"
    name="Url"
  >
    <b-form-group
      id="input-defaultWebsiteUrl-group"
      label="Url:"
      label-for="input-defaultWebsiteUrl"
      :invalid-feedback="errors[0]"
      :state="errors[0] ? false : (valid ? true : null)"
    >
      <b-form-input
        id="input-defaultWebsiteUrl"
        :value="value"
        placeholder="Enter url"
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
