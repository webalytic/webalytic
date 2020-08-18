<template>
  <div />
</template>

<script>
export default {
  created() {
    this.$router.push({
      name: 'dashboard',
      params: {
        resourceId: this.$store.state.globalFilters.resources.active.id
      }
    })
  }
}
</script>
