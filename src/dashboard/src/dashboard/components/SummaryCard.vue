<template>
  <div class="card-box">
    <small class="mt-0">
      <i
        v-if="icon"
        :class="`fa fa-${icon}`"
      /> {{ label }}
    </small>
    <h6
      v-if="value"
      class="text-primary"
    >
      {{ prefix }}<span data-plugin="counterup">{{ value }}</span>
    </h6>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: null
    },
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: false,
      default() {
        return ''
      }
    },
    prefix: {
      type: String,
      default: ''
    }
  }
}
</script>
