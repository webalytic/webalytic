<template>
  <b-table
    outlined
    borderless
    thead-class="text-center"
    tbody-tr-class="text-center"
    class="border-top-0 mb-0"
    show-empty
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

    <template v-slot:cell(scope)="row">
      {{ row.item.scope | scope }}
    </template>

    <template v-slot:cell(name)="row">
      <div class="text-left">
        {{ row.item.name }}
      </div>
    </template>

    <template v-slot:head(name)>
      <div class="text-left">
        Name
      </div>
    </template>

    <template
      v-slot:cell(active)="row"
    >
      <div class="text-center">
        <i
          class="fa"
          :class="{
            'fa-check text-success': row.item.active,
            'fa-ban text-danger': !row.item.active
          }"
        />
      </div>
    </template>

    <template v-slot:empty="scope">
      <h6>{{ scope.emptyText }}</h6>
    </template>
  </b-table>
</template>

<script>
import { CustomDefinitionScope } from '@/common/services/ConfigurationService/customDefinition'

export default {
  filters: {
    scope(value) {
      return {
        [CustomDefinitionScope.HIT]: 'Hit',
        [CustomDefinitionScope.SESSION]: 'Session'

      }[value]
    }
  },
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
        // { key: 'active', label: 'Active' },
        { key: 'actions', label: '' }
      ]
    }
  }
}
</script>
