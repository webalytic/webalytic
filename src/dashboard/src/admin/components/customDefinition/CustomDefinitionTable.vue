<template>
  <b-table
    outlined
    borderless
    class="border-top-0 mb-0"
    :items="items"
    :fields="fields"
  >
    <template v-slot:cell(actions)="row">
      <b-button
        size="sm"
        variant="light"
        class="float-right"
        @click="$emit('edit', {...row.item})"
      >
        <i class="fas fa-sm fa-pen" />
      </b-button>
    </template>
  </b-table>
</template>

<script>

export default {
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'index', label: 'Index' },
        { key: 'scope', label: 'Scope' },
        { key: 'active', label: 'Active' },
        { key: 'actions', label: '' }
      ]
    }
  }
}
</script>
