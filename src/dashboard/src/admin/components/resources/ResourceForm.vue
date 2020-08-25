<template>
  <b-form>
    <resource-name-input v-model="value.name" />

    <!-- <resource-category-input v-model="value.category" /> -->

    <resource-url-input v-model="value.defaultWebsiteUrl" />
  </b-form>
</template>

<script>
import ResourceNameInput from './inputs/ResourceNameInput.vue'
// import ResourceCategoryInput from './inputs/ResourceCategoryInput.vue'
import ResourceUrlInput from './inputs/ResourceUrlInput.vue'

export default {
  components: {
    ResourceNameInput,
    // ResourceCategoryInput,
    ResourceUrlInput
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  }
}
</script>
