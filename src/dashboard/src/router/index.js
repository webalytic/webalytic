import Vue from 'vue'
import Router from 'vue-router'

const DashboardPage = () => import('@/pages/DashboardPage.vue')
const AdminPage = () => import('@/pages/AdminPage/AdminPage.vue')
const AdminPageResources = () => import('@/pages/AdminPage/AdminPageResources.vue')

const ErrorPage = () => import('@/pages/ErrorPage.vue')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: {
        name: 'dashboard'
      }
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      component: DashboardPage,
      meta: {
        title: 'Dashboard'
      }
    },
    {
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
    },
    {
      path: '*',
      name: 'notFound',
      component: ErrorPage,
      props: {
        error: 404
      },
      meta: {
        title: 'Page not found'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || ''
  next()
})

export default router
