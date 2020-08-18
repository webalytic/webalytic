const AdminPage = () => import('../pages/AdminPage.vue')
const AdminPageResources = () => import('../pages/AdminPageResources.vue')

export default {
  name: 'admin',
  path: '/admin',
  component: AdminPage,
  redirect: {
    name: 'admin-resources'
  },
  children: [
    {

      name: 'admin-resources',
      path: 'resources',
      component: AdminPageResources,
      meta: {
        title: 'Admin: resources'
      }
    }
  ]
}
