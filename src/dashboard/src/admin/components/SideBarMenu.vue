<template>
  <b-list-group class="admin-page-menu shadow">
    <b-list-group-item
      :to="{name: 'admin-resource'}"
    >
      <i class="fa fa-desktop fa-sm" />
      Resource
    </b-list-group-item>
    <b-list-group-item :to="{name: 'admin-tracking-info'}">
      <i class="fa fa-laptop-code fa-sm" />
      Tracking info
    </b-list-group-item>
    <b-list-group-item :to="{name: 'admin-custom-definition'}">
      <i class="fa fa-stream fa-sm" />
      Custom definition
    </b-list-group-item>

    <b-list-group-item
      href="#"
      disabled
    >
      <i class="far fa-dot-circle fa-sm" />
      Goals
      <b-badge variant="light">
        soon
      </b-badge>
    </b-list-group-item>
    <b-list-group-item
      href="#"
      disabled
    >
      <i class="fa fa-layer-group " />
      Grouping channels
      <b-badge variant="light">
        soon
      </b-badge>
    </b-list-group-item>
  </b-list-group>
</template>

<style lang="css" scoped>
.admin-page-menu i {
  width: 32px;
}
</style>
