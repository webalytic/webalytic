<template>
  <b-form-group
    id="input-category-group"
    label="Category:"
    label-for="input-category"
  >
    <b-form-select
      id="input-category"
      :value="value"
      type="category"
      required
      placeholder="Select category"
      @input="val => $emit('input', val)"
    />
  </b-form-group>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  }
}
</script>
