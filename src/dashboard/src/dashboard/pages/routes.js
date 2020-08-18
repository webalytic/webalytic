const DashboardPage = () => import('../pages/DashboardPage.vue')

export default {
  name: 'dashboard',
  path: '/dashboard',
  component: DashboardPage,
  meta: {
    title: 'Dashboard'
  }
}
