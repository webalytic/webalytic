/* eslint-disable global-require */
import Vue from 'vue'
import Router from 'vue-router'

import adminRoute from '@/admin/pages/routes'
import dashboardRoute from '@/dashboard/pages/routes'

const ErrorPage = () => import('./pages/ErrorPage.vue')
const IndexPage = () => import('./pages/IndexPage.vue')
const ResourceWrapper = () => import('./pages/ResourceWrapper.vue')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: IndexPage
    },
    {
      name: 'resource-wrapper',
      path: '/:resourceId',
      component: ResourceWrapper,
      children: [
        dashboardRoute,
        adminRoute
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
