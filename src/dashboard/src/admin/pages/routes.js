const AdminPage = () => import('../pages/AdminPage.vue')
const AdminResourcePage = () => import('../pages/ResourcePage.vue')
const AdminResourceCreatePage = () => import('../pages/ResourceCreatePage.vue')
const AdminTrackingInfoPage = () => import('../pages/TrackingInfoPage.vue')
const AdminCustomDefinitionPage = () => import('../pages/CustomDefinitionPage.vue')

export default {
  name: 'admin',
  path: 'admin',
  component: AdminPage,
  redirect: {
    name: 'admin-resource'
  },
  children: [
    {

      name: 'admin-resource',
      path: 'resource',
      component: AdminResourcePage,
      meta: {
        title: 'Admin: resource'
      }
    },
    {

      name: 'admin-resource-create',
      path: 'resource/create',
      component: AdminResourceCreatePage,
      meta: {
        title: 'Admin: create resource'
      }
    },
    {

      name: 'admin-tracking-info',
      path: 'tracking-info',
      component: AdminTrackingInfoPage,
      meta: {
        title: 'Admin: tracking info'
      }
    },
    {

      name: 'admin-custom-definition',
      path: 'custom-definition',
      component: AdminCustomDefinitionPage,
      meta: {
        title: 'Admin: custom definition'
      }
    }
  ]
}
