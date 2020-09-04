<template>
  <b-form>
    <custom-definition-type
      v-model="value.type"
      :disabled="!isNewRecord"
    />
    <custom-definition-name v-model="value.name" />

    <custom-definition-scope v-model="value.scope" />

    <!-- <custom-definition-active v-model="value.active" /> -->
  </b-form>
</template>

<script>
import CustomDefinitionName from './inputs/CustomDefinitionName.vue'
import CustomDefinitionType from './inputs/CustomDefinitionType.vue'
import CustomDefinitionScope from './inputs/CustomDefinitionScope.vue'
// import CustomDefinitionActive from './inputs/CustomDefinitionActive.vue'

export default {
  components: {
    CustomDefinitionType,
    CustomDefinitionName,
    CustomDefinitionScope
    // CustomDefinitionActive
  },
  props: {
    isNewRecord: {
      type: Boolean,
      required: true
    },
    value: {
      type: Object,
      required: true
    }
  }
}
</script>
