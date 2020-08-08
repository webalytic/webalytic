<template>
  <div class="card-box">
    <i class="fa fa-info-circle text-muted float-right" />
    <h4 class="mt-0 font-16">
      {{ label }}
    </h4>
    <h2 class="text-primary my-3 text-center">
      {{ prefix }}<span data-plugin="counterup">{{ value }}</span>
    </h2>
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
