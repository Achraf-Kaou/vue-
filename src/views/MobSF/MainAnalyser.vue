<template>
  <div class="p-6">
    <!-- Main content -->
    <div v-if="!showReport">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">Main Analyzer</h1>
        <button
          class="btn btn-primary flex items-center gap-2"
          @click="navigateTo('/static-analysis')"
        >
          <Upload class="w-5 h-5" />
          Upload New App
        </button>
        <button
          class="btn btn-primary w-full flex items-center justify-center gap-2"
          @click="navigateTo('/dynamic-analysis')"
        >
          <Play class="w-5 h-5" />
          Dynamic Analysis
        </button>
        <button
          class="btn btn-primary w-full flex items-center justify-center gap-2"
          @click="navigateTo('/list-scans')"
        >
          <FileText class="w-5 h-5" />
          View Reports
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-8">
        <Loader class="w-8 h-8 text-blue-500 animate-spin" />
        <span class="ml-2 text-gray-600">Loading...</span>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 rounded-lg">
        <div class="flex items-center">
          <AlertCircle class="w-5 h-5 text-red-400 mr-2" />
          <span class="text-red-700">{{ error }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold">Recent Analysis</h2>
              <button
                class="text-primary-600 hover:text-primary-800"
                @click="navigateTo('/list-scans')"
              >
                View All
              </button>
            </div>

            <div v-if="loading" class="flex justify-center py-8">
              <Loader class="w-8 h-8 text-blue-500 animate-spin" />
              <span class="ml-2 text-gray-600">Loading...</span>
            </div>

            <div v-else-if="error" class="p-4 bg-red-50 rounded-lg">
              <div class="flex items-center">
                <AlertCircle class="w-5 h-5 text-red-400 mr-2" />
                <span class="text-red-700">{{ error }}</span>
              </div>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Application Name
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Analysis Type
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Platform
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Analysis Date
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="scan in scans" :key="scan.MD5" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ scan.APP_NAME || scan.FILE_NAME }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          getTypeClass(scan.ANALYZER),
                        ]"
                      >
                        {{
                          scan.ANALYZER?.includes('static') ? 'Static Analysis' : 'Dynamic Analysis'
                        }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          getAppTypeClass(scan.SCAN_TYPE),
                        ]"
                      >
                        {{
                          scan.SCAN_TYPE === 'apk' || scan.SCAN_TYPE === 'xapk' ? 'Android' : 'iOS'
                        }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(scan.TIMESTAMP) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          getStatusClass(
                            scan.SCAN_LOGS?.includes('Saving to Database')
                              ? 'Completed'
                              : 'In Progress'
                          ),
                        ]"
                      >
                        {{
                          scan.SCAN_LOGS?.includes('Saving to Database')
                            ? 'Completed'
                            : 'In Progress'
                        }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button
                        class="text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="viewReport(scan)"
                        :disabled="scan.SCAN_LOGS?.includes('Saving to Database') === false"
                      >
                        <FileText class="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold">Analysis Statistics</h2>
            </div>

            <div v-if="loadingStats">
              <div class="flex justify-center py-8">
                <Loader class="w-8 h-8 text-blue-500 animate-spin" />
                <span class="ml-2 text-gray-600">Loading...</span>
              </div>
            </div>

            <div v-else>
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-50 rounded-lg p-4 text-center">
                  <h3 class="text-sm font-medium text-gray-600">Total Scans</h3>
                  <div class="text-2xl font-bold mt-2">{{ stats.totalScans }}</div>
                </div>
                <div class="bg-blue-50 rounded-lg p-4 text-center">
                  <h3 class="text-sm font-medium text-blue-600">Average Security Score</h3>
                  <div class="text-2xl font-bold text-blue-600 mt-2">
                    {{ stats.avgSecurityScore.toFixed(1) }}
                  </div>
                </div>
                <div class="bg-green-50 rounded-lg p-4 text-center group relative">
                  <h3 class="text-sm font-medium text-green-600">Max Score</h3>
                  <div class="text-2xl font-bold text-green-600 mt-2">
                    {{ stats.maxSecurityScore }}
                  </div>
                  <div
                    v-if="maxScoreAppNames.length"
                    class="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-white border border-gray-200 rounded shadow-lg px-3 py-2 text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10"
                  >
                    {{ maxScoreAppNames.join(', ') }}
                  </div>
                </div>
                <div class="bg-red-50 rounded-lg p-4 text-center group relative">
                  <h3 class="text-sm font-medium text-red-600">Min Score</h3>
                  <div class="text-2xl font-bold text-red-600 mt-2">
                    {{ stats.minSecurityScore }}
                  </div>
                  <div
                    v-if="minScoreAppNames.length"
                    class="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-white border border-gray-200 rounded shadow-lg px-3 py-2 text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10"
                  >
                    {{ minScoreAppNames.join(', ') }}
                  </div>
                </div>

                <div class="bg-blue-50 rounded-lg p-4 text-center">
                  <h3 class="text-sm font-medium text-blue-600">Platform Distribution</h3>
                  <div class="h-32">
                    <Doughnut :data="platformDistributionData" :options="chartOptions" />
                  </div>
                </div>
              </div>

              <div class="bg-red-50 rounded-lg p-4 mb-4">
                <h3 class="text-sm font-medium text-red-600 mb-2">Risk Distribution</h3>
                <div class="h-48">
                  <Doughnut :data="riskDistributionData" :options="chartOptions" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Analysis Trends</h2>
            <div class="flex gap-2">
              <button
                v-for="range in ['week', 'month', 'year']"
                :key="range"
                :class="[
                  'px-3 py-1 text-sm rounded-md',
                  trendTimeRange === range
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                ]"
                @click="trendTimeRange = range"
              >
                {{ range.charAt(0).toUpperCase() + range.slice(1) }}
              </button>
            </div>
          </div>

          <div class="h-[400px]">
            <Line :data="trendData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>

    <!-- Report View -->
    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <button
          @click="closeReport"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ChevronLeft class="w-4 h-4 mr-2" />
          Back to Analysis
        </button>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div v-if="loading" class="flex justify-center py-12">
          <Loader class="w-8 h-8 text-blue-500 animate-spin" />
          <span class="ml-2 text-gray-600">Loading report...</span>
        </div>
        <div v-else-if="error" class="p-4 text-red-600">
          {{ error }}
        </div>
        <div v-else>
          <div v-if="!reportData" class="p-4 text-gray-600">No report data available</div>
          <template v-else>
            <AndroidStaticReport
              v-if="
                reportData &&
                (reportData.SCAN_TYPE === 'apk' ||
                  reportData.SCAN_TYPE === 'xapk' ||
                  reportData.app_type === 'apk' ||
                  reportData.app_type === 'xapk')
              "
              :reportData="reportData"
              :fileHash="selectedFileHash"
            />
            <iOSStaticReport
              v-else-if="
                reportData && (reportData.SCAN_TYPE === 'ipa' || reportData.app_type === 'ipa')
              "
              :reportData="reportData"
              :fileHash="selectedFileHash"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import StaticAnalyzerService from '../../api/StaticAnalyzer'
import {
  Upload,
  Play,
  FileText,
  Loader,
  AlertCircle,
  FileSearch,
  ListTodo,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Clock,
  FileType,
  Tag,
  User,
  AlertOctagon,
  FileScan,
  CheckCircle,
  Timer,
  Hash,
  Smartphone,
  Package,
  Globe,
  Trash2,
  Search,
  Activity,
  Zap,
  X,
  List,
} from 'lucide-vue-next'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import AndroidStaticReport from '../../components/MobSF/general/report/static/android/AndroidStaticReport.vue'
import iOSStaticReport from '../../components/MobSF/general/report/static/ios/iOSStaticReport.vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface Scan {
  ANALYZER: string
  SCAN_TYPE: string
  FILE_NAME: string
  APP_NAME: string
  PACKAGE_NAME: string
  VERSION_NAME: string
  MD5: string
  TIMESTAMP: string
  SCAN_LOGS: string
  type?: string
  status?: string
}

interface Task {
  id: number
  file_name: string
  description: string
  type: string
  status: string
  progress: number
  timestamp: string
  requested_by: string
}

interface Filters {
  type: string
  status: string
  dateRange: [string, string]
}

export default defineComponent({
  name: 'MainAnalyser',
  components: {
    Upload,
    Play,
    FileText,
    Loader,
    AlertCircle,
    FileSearch,
    ListTodo,
    ChevronRight,
    ChevronLeft,
    RefreshCw,
    Clock,
    FileType,
    Tag,
    User,
    AlertOctagon,
    FileScan,
    CheckCircle,
    Timer,
    Hash,
    Smartphone,
    Package,
    Globe,
    Trash2,
    Search,
    Activity,
    Zap,
    X,
    List,
    AndroidStaticReport,
    iOSStaticReport,
    Line,
    Bar,
    Doughnut,
  },
  setup() {
    const router = useRouter()
    const trendTimeRange = ref('week')
    const loading = ref(true)
    const error = ref<string | null>(null)
    const scans = ref<Scan[]>([])
    const tasks = ref<Task[]>([])
    const currentPage = ref(1)
    const pageSize = ref(5) // Keep 5 for recent analysis
    const total = ref(0)
    const filters = ref<Filters>({
      type: '',
      status: '',
      dateRange: ['', ''],
    })
    const reportData = ref<any>(null)
    const showReport = ref(false)
    const selectedFileHash = ref('')
    const scansInRange = ref<any[]>([])
    const loadingStats = ref(true)
    const loadingRisk = ref(true)
    const loadingPlatform = ref(true)
    const loadingTrend = ref(true)

    // Real data from API
    const stats = reactive({
      totalScans: 0,
      highRiskIssues: 0,
      mediumRiskIssues: 0,
      lowRiskIssues: 0,
      avgSecurityScore: 0,
      minSecurityScore: 0,
      maxSecurityScore: 0,
    })

    // Chart data as reactive objects
    // Define trendData using ref
    const trendData = ref({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Static Analysis',
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Dynamic Analysis',
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
        },
      ],
    })

    const riskDistributionData = ref({
      labels: ['High Risk (0-40)', 'Medium Risk (41-70)', 'Low Risk (71-100)'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
          borderWidth: 0,
        },
      ],
    })

    const platformDistributionData = ref({
      labels: ['Android', 'iOS'],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: ['#10B981', '#3B82F6'],
          borderWidth: 0,
        },
      ],
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            usePointStyle: true,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              return `${context.dataset.label || context.label}: ${context.raw}`
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    }

    const maxScoreAppNames = computed(() => {
      if (!stats.maxSecurityScore || !Array.isArray(scansInRange.value)) return []
      return scansInRange.value
        .filter((scan: any) => scan._score === stats.maxSecurityScore)
        .map((scan: any) => scan.APP_NAME || scan.FILE_NAME || scan.MD5)
    })

    const minScoreAppNames = computed(() => {
      if (!stats.minSecurityScore || !Array.isArray(scansInRange.value)) return []
      return scansInRange.value
        .filter((scan: any) => scan._score === stats.minSecurityScore)
        .map((scan: any) => scan.APP_NAME || scan.FILE_NAME || scan.MD5)
    })

    const fetchRecentAnalysis = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await StaticAnalyzerService.getRecentScans(
          currentPage.value,
          pageSize.value
        )
        scans.value = response.data.content
        total.value = response.data.count
        // Apply filters if any
        if (filters.value.type) {
          scans.value = scans.value.filter((scan: any) => scan.type === filters.value.type)
        }
        if (filters.value.status) {
          scans.value = scans.value.filter((scan: any) => scan.status === filters.value.status)
        }
        if (filters.value.dateRange[0] && filters.value.dateRange[1]) {
          const startDate = new Date(filters.value.dateRange[0])
          const endDate = new Date(filters.value.dateRange[1])
          scans.value = scans.value.filter((scan: any) => {
            const scanDate = new Date(scan.TIMESTAMP)
            return scanDate >= startDate && scanDate <= endDate
          })
        }
      } catch (err) {
        console.error('Error fetching recent analysis:', err)
        error.value = 'Failed to fetch recent analysis'
      } finally {
        loading.value = false
      }
    }

    const fetchStats = async () => {
      loadingStats.value = true
      try {
        const response = await StaticAnalyzerService.getRecentScans(1, 1000)
        const allScans = response.data.content
        stats.totalScans = allScans.length
        // ... scores, min, max, avg
      } finally {
        loadingStats.value = false
      }
    }

    const fetchRiskDistribution = async () => {
      loadingRisk.value = true
      try {
        // fetch scans, scores, puis calculez la distribution
      } finally {
        loadingRisk.value = false
      }
    }

    const fetchPlatformDistribution = async () => {
      loadingPlatform.value = true
      try {
        // fetch scans, puis calculez la distribution
      } finally {
        loadingPlatform.value = false
      }
    }

    const fetchTrendData = async () => {
      loadingTrend.value = true
      try {
        // fetch scans, puis calculez les datasets pour le graphique
      } finally {
        loadingTrend.value = false
      }
    }

    const getDateRange = (range: string) => {
      const today = new Date()
      if (range === 'year') {
        const months = []
        for (let i = 11; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
          months.push(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0])
        }
        return months
      }
      let days = 7
      if (range === 'month') days = 30
      const dates = Array(days)
        .fill(0)
        .map((_, i) => {
          const date = new Date()
          date.setDate(today.getDate() - (days - 1 - i))
          return date.toISOString().split('T')[0]
        })
      return dates
    }

    watch(trendTimeRange, () => {
      fetchTrendData()
      fetchStats()
      fetchRiskDistribution()
      fetchPlatformDistribution()
    })

    const getStatusClass = (status: string) => {
      switch (status) {
        case 'Completed':
          return 'bg-green-100 text-green-800'
        case 'In Progress':
          return 'bg-yellow-100 text-yellow-800'
        case 'Failed':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const getAppTypeClass = (type: string | undefined) => {
      if (!type) return 'bg-gray-600'
      switch (type.toLowerCase()) {
        case 'apk':
        case 'xapk':
          return 'bg-green-600'
        case 'ipa':
          return 'bg-blue-600'
        case 'static':
          return 'bg-blue-600'
        case 'dynamic':
          return 'bg-green-600'
        default:
          return 'bg-gray-600'
      }
    }

    const getAppTypeIcon = (type: string | undefined) => {
      if (!type) return Package
      switch (type.toLowerCase()) {
        case 'apk':
        case 'xapk':
          return Smartphone
        case 'ipa':
          return Smartphone
        case 'static':
          return FileSearch
        case 'dynamic':
          return Smartphone
        default:
          return Package
      }
    }

    const getTypeClass = (type: string | undefined) => {
      if (!type) return 'bg-gray-100 text-gray-800'
      switch (type.toLowerCase()) {
        case 'apk':
        case 'xapk':
          return 'bg-green-100 text-green-800'
        case 'ipa':
          return 'bg-blue-100 text-blue-800'
        case 'static':
          return 'bg-blue-100 text-blue-800'
        case 'dynamic':
          return 'bg-green-100 text-green-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const navigateTo = (path: string) => {
      router.push(path)
    }

    const viewReport = async (scan: Scan) => {
      try {
        loading.value = true
        error.value = null
        console.log('Fetching report for scan:', scan)
        const response = await StaticAnalyzerService.getJsonReport(scan.MD5)
        console.log('Report response:', response.data)
        reportData.value = response.data
        selectedFileHash.value = scan.MD5
        showReport.value = true
      } catch (err) {
        console.error('Error fetching report:', err)
        error.value = err instanceof Error ? err.message : 'Failed to fetch report'
      } finally {
        loading.value = false
      }
    }

    const closeReport = () => {
      showReport.value = false
      reportData.value = null
      selectedFileHash.value = ''
      error.value = null
    }

    const formatDate = (timestamp: string) => {
      if (!timestamp) return 'N/A'
      const date = new Date(timestamp)
      return date.toLocaleDateString()
    }

    onMounted(() => {
      fetchRecentAnalysis()
      fetchStats()
      fetchRiskDistribution()
      fetchPlatformDistribution()
      fetchTrendData()
    })

    return {
      scans,
      stats,
      trendTimeRange,
      loading,
      error,
      getStatusClass,
      getAppTypeClass,
      getAppTypeIcon,
      getTypeClass,
      navigateTo,
      viewReport,
      formatDate,
      staticCount: computed(
        () => scans.value.filter((scan: any) => scan.ANALYZER?.includes('static')).length
      ),
      dynamicCount: computed(
        () => scans.value.filter((scan: any) => !scan.ANALYZER?.includes('static')).length
      ),
      androidCount: computed(
        () =>
          scans.value.filter((scan: any) => scan.SCAN_TYPE === 'apk' || scan.SCAN_TYPE === 'xapk')
            .length
      ),
      iosCount: computed(() => scans.value.filter((scan: any) => scan.SCAN_TYPE === 'ipa').length),
      reportData,
      showReport,
      selectedFileHash,
      closeReport,
      trendData,
      riskDistributionData,
      platformDistributionData,
      chartOptions,
      maxScoreAppNames,
      minScoreAppNames,
    }
  },
})
</script>

<style scoped>
.main-analyzer {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.analysis-card,
.stats-card,
.quick-actions-card,
.trends-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
}

.stat-value.high-risk {
  color: var(--el-color-danger);
}

.stat-value.medium-risk {
  color: var(--el-color-warning);
}

.stat-value.low-risk {
  color: var(--el-color-success);
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-actions .el-button {
  width: 100%;
}

.trends-chart {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mt-4 {
  margin-top: 20px;
}
</style>
