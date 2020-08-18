<template>
  <b-form>
    <b-form-group
      id="input-name-group"
      label="Name of resource:"
      label-for="input-name"
      description="We'll never share your name with anyone else."
    >
      <b-form-input
        id="input-name"
        v-model="value.name"
        required
        placeholder="Enter name"
        style="min-width: 260px"
      />
    </b-form-group>

    <b-form-group
      id="input-category-group"
      label="Category:"
      label-for="input-category"
      description="We'll never share your name with anyone else."
    >
      <b-form-select
        id="input-category"
        v-model="value.category"
        type="category"
        required
        placeholder="Select category"
      />
    </b-form-group>

    <b-form-group
      id="input-defaultWebsiteUrl-group"
      label="Website url:"
      label-for="input-defaultWebsiteUrl"
      description="We'll never share your name with anyone else."
    >
      <b-form-input
        id="input-defaultWebsiteUrl"
        v-model="value.defaultWebsiteUrl"
        required
        placeholder="Enter url"
      />
    </b-form-group>
  </b-form>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  }
}
</script>
