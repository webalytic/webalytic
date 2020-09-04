<template>
  <b-tabs
    v-model="activeTab"
    lazy
  >
    <b-tab
      title="Dimensions"
      @click="setHash('dimensions')"
    >
      <custom-definition-table
        :items="customDimensions"
        @edit="onEdit"
      />
    </b-tab>
    <b-tab
      title="Metrics"
      @click="setHash('metrics')"
    >
      <custom-definition-table
        :items="customMetrics"
        @edit="onEdit"
      />
    </b-tab>
  </b-tabs>
</template>

<script>
import CustomDefinitionTable from './CustomDefinitionTable.vue'

export default {
  components: {
    CustomDefinitionTable
  },
  props: {
    customDefinitions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    customDimensions() {
      return this.customDefinitions.filter((i) => i.type === 1)
    },
    customMetrics() {
      return this.customDefinitions.filter((i) => i.type === 2)
    },
    activeTab() {
      return {
        dimensions: 0,
        metrics: 1
      }[this.$route.hash.replace('#', '')] || 0
    }
  },
  methods: {
    onEdit(instance) {
      this.$emit('edit', instance)
    },
    setHash(hash) {
      this.$router.push({ name: this.$route.name, hash: `#${hash}` })
    }
  }
}
</script>
