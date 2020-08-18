<template>
  <b-row class="admin-page">
    <b-col lg="3">
      <b-list-group class="admin-page-menu">
        <b-list-group-item
          href="#some-link"
          active
        >
          <i class="fa fa-desktop fa-sm" />
          Resources
        </b-list-group-item>
        <b-list-group-item
          href="#"
          disabled
        >
          <i class="fa fa-laptop-code fa-sm" />
          Tracking info
          <b-badge variant="light">
            soon
          </b-badge>
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
    </b-col>
    <b-col lg="9">
      <router-view />
    </b-col>
  </b-row>
</template>

<style lang="css" scoped>
.admin-page-menu i {
  width: 32px;
}
</style>
