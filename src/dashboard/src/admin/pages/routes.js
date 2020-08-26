const AdminPage = () => import('../pages/AdminPage.vue')
const AdminResourcePage = () => import('../pages/AdminResourcePage.vue')
const AdminResourceCreatePage = () => import('../pages/AdminResourceCreatePage.vue')
const AdminTrackingInfoPage = () => import('../pages/AdminTrackingInfoPage.vue')

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
    }
  ]
}
