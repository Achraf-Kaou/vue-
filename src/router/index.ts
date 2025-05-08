import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/MobSF/MainAnalyser.vue'
import StaticAnalysis from '../views/MobSF/StaticAnalysis.vue'
import DynamicAnalysis from '../views/DynamicAnalysis.vue'
import DynamicAnalysisProgress from '../views/DynamicAnalysisProgress.vue'
import DynamicAnalysisReport from '../views/DynamicAnalysisReport.vue'

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
      component: () => import('../views/DynamicAnalysis.vue'),
      props: true,
    },
    {
      path: '/static-analysis',
      name: 'static-analysis',
      component: StaticAnalysis,
    },
    {
      path: '/static-analysis/report',
      name: 'static-analysis-report',
      component: () => import('../views/MobSF/StaticAnalysisReport.vue'),
    },
    {
      path: '/dynamic-analysis/progress/:hash/:package',
      name: 'DynamicAnalysisProgress',
      component: DynamicAnalysisProgress,
    },
    {
      path: '/dynamic-analysis/report',
      name: 'DynamicAnalysisReport',
      component: DynamicAnalysisReport,
    },
  ],
})

export default router
