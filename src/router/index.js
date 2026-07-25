import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: { name: 'overview' },
  },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('@/pages/OverviewPage.vue'),
    meta: { title: 'Overview' },
  },
  {
    path: '/audits',
    name: 'audits',
    component: () => import('@/pages/ActiveAuditsPage.vue'),
    meta: { title: 'Active Audits' },
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/pages/HistoryPage.vue'),
    meta: { title: 'History' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/SettingsPage.vue'),
    meta: { title: 'Settings' },
  },
  {
    // Catch-all: send unknown paths back to Overview.
    path: '/:pathMatch(.*)*',
    redirect: '/overview',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = 'UX Heuristics Audit Tool'
  document.title = to.meta?.title ? `${to.meta.title} · ${base}` : base
})

export default router
