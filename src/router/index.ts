import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/MobSF/MainAnalyser.vue'
import StaticAnalysis from '../views/MobSF/StaticAnalysis.vue'
import DynamicAnalysis from '../views/MobSF/DynamicAnalysis.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/list-scans',
      name: 'list-scans',
      component: () => import('../views/MobSF/ListScans.vue'),
    },
    {
      path: '/main-analyzer',
      name: 'main-analyzer',
      component: () => import('../views/MobSF/MainAnalyser.vue'),
    },
    {
      path: '/dynamic-analysis',
      name: 'dynamic-analysis',
      component: DynamicAnalysis,
    },
    {
      path: '/dynamic-analysis/:hash',
      name: 'dynamic-analysis-hash',
      component: () => import('../views/MobSF/DynamicAnalysis.vue'),
      props: true,
    },
    {
      path: '/static-analysis',
      name: 'static-analysis',
      component: StaticAnalysis,
    },
  ],
})

export default router
