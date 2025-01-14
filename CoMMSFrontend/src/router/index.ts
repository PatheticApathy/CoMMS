import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home.vue')
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('../views/Welcome.vue')
    },
    {
        path: '/jobs',
        name: 'jobs',
        component: () => import('../views/Jobs.vue')
    },
    {
      path: '/navbar',
      name: 'navbar',
      component: () => import('../views/NavBar.vue')
    }
  ]
})

export default router
