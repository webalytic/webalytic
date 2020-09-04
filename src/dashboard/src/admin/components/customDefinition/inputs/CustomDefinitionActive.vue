<template>
  <b-form-group
    id="input-active-group"
    label-for="input-active"
  >
    <b-form-checkbox
      v-model="value"
      switch
      name="active"
      :value="true"
      :unchecked-value="false"
      @input="val => $emit('input', val)"
    >
      Active
    </b-form-checkbox>
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
