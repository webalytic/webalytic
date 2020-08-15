<template>
  <div class="card-box">
    <span class="mt-0">
      {{ label }}
    </span>
    <h4 class="text-primary">
      {{ prefix }}<span data-plugin="counterup">{{ value }}</span>
    </h4>
  </div>
</template>

<script>
export default {
  props: {
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
