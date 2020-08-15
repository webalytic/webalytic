<template>
  <div class="card-box">
    <span class="mt-0">
      <i
        v-if="icon"
        :class="`fa fa-${icon}`"
      /> {{ label }}
    </span>
    <h5 class="text-primary">
      {{ prefix }}<span data-plugin="counterup">{{ value }}</span>
    </h5>
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
      required: true
    },
    prefix: {
      type: String,
      default: ''
    }
  }
}
</script>
