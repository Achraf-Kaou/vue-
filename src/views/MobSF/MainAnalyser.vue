<template>
  <div class="max-w-auto mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
    <!-- Main content -->
    <div v-if="!showReport" class="space-y-8">
      <!-- Header with navigation buttons -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
        <h1 class="text-3xl font-bold text-slate-800">Mobile Security</h1>

        <div class="flex flex-wrap gap-3">
        <button
            class="btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          @click="navigateTo('/static-analysis')"
        >
          <Upload class="w-5 h-5" />
            <span>Upload App</span>
        </button>

        <button
            class="btn bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          @click="navigateTo('/dynamic-analysis')"
        >
          <Play class="w-5 h-5" />
            <span>Run Dynamic Analysis</span>
        </button>

        <button
            class="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          @click="navigateTo('/list-scans')"
        >
          <FileText class="w-5 h-5" />
            <span>View Reports</span>
        </button>
        </div>
      </div>

      <!-- Loading and error states -->
      <div v-if="loading" class="flex justify-center py-10">
        <div class="flex flex-col items-center">
          <Loader class="w-10 h-10 text-indigo-500 animate-spin" />
          <span class="mt-3 text-slate-600">Loading data...</span>
        </div>
      </div>

      <div v-else-if="error" class="p-5 bg-red-50 rounded-xl border border-red-200">
        <div class="flex items-center">
          <AlertCircle class="w-6 h-6 text-red-500 mr-3" />
          <span class="text-red-700 font-medium">{{ error }}</span>
        </div>
      </div>

      <!-- Main dashboard grid -->
      <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Recent Analysis Table - Takes 3/4 of space on large screens -->
        <div class="lg:col-span-3 bg-white rounded-xl shadow-md overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 class="text-xl font-bold text-slate-800">Recent Analysis</h2>
              <button
              class="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                @click="navigateTo('/list-scans')"
              >
                View All
              <ChevronRight class="w-4 h-4 ml-1" />
              </button>
            </div>

          <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Application
                    </th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                    </th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                    </th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="scan in scans" :key="scan.MD5" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-medium text-gray-900">{{ scan.APP_NAME || scan.FILE_NAME }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Static Analysis
                      </span>
                      <span
                        v-if="scan.hasDynamicAnalysis"
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          'bg-green-100 text-green-800'
                        ]"
                      >
                        Dynamic Analysis
                      </span>
                      <span v-else class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        No Dynamic Analysis
                      </span>
                    </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                        scan.SCAN_TYPE === 'apk' || scan.SCAN_TYPE === 'xapk'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800',
                        ]"
                      >
                      {{ scan.SCAN_TYPE === 'apk' || scan.SCAN_TYPE === 'xapk' ? 'Android' : 'iOS' }}
                      </span>
                    </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(scan.TIMESTAMP) }}
                  </td>
                   <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        (scan.status || (scan.SCAN_LOGS?.includes('Saving to Database') ? 'Completed' : 'In Progress')) === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      ]"
                    >
                      {{ scan.status || (scan.SCAN_LOGS?.includes('Saving to Database') ? 'Completed' : 'In Progress') }}
                    </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <button
                        class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        @click="viewStaticReport(scan)"
                        :disabled="!scan.SCAN_LOGS?.includes('Saving to Database')"
                      >
                        <FileText class="w-4 h-4 mr-1" />
                        Static
                      </button>

                      <button
                        v-if="scan.hasDynamicAnalysis"
                        class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                        @click="viewDynamicReport(scan)"
                      >
                        <Activity class="w-4 h-4 mr-1" />
                        Dynamic
                      </button>
                    </div>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
        </div>

        <!-- Statistics Cards - Takes 1/4 of space on large screens -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="p-5 border-b border-gray-100">
              <h2 class="text-xl font-bold text-slate-800">Analysis Stats</h2>
            </div>

            <div v-if="loadingStats" class="flex justify-center py-10">
              <div class="flex flex-col items-center">
                <Loader class="w-8 h-8 text-indigo-500 animate-spin" />
                <span class="mt-3 text-slate-600">Loading stats...</span>
              </div>
            </div>

            <div v-else class="p-5 space-y-4">
              <!-- Stats Grid -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-slate-50 rounded-lg p-4 text-center transition-all hover:shadow-md">
                  <h3 class="text-sm font-medium text-slate-600">Total Scans</h3>
                  <div class="text-2xl font-bold text-slate-800 mt-2">{{ stats.totalScans }}</div>
                </div>

                <div class="bg-blue-50 rounded-lg p-4 text-center transition-all hover:shadow-md">
                  <h3 class="text-sm font-medium text-blue-700">Avg Security</h3>
                  <div class="text-2xl font-bold text-blue-700 mt-2">
                    {{ stats.avgSecurityScore.toFixed(1) }}
                  </div>
                </div>

                <div class="bg-green-50 rounded-lg p-4 text-center group relative transition-all hover:shadow-md">
                  <h3 class="text-sm font-medium text-green-700">Max Score</h3>
                  <div class="text-2xl font-bold text-green-700 mt-2">
                    {{ stats.maxSecurityScore }}
                  </div>
                  <div
                    v-if="maxScoreAppNames.length"
                    class="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max max-w-[200px] bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition z-10"
                  >
                    {{ maxScoreAppNames.join(', ') }}
                  </div>
                </div>

                <div class="bg-red-50 rounded-lg p-4 text-center group relative transition-all hover:shadow-md">
                  <h3 class="text-sm font-medium text-red-700">Min Score</h3>
                  <div class="text-2xl font-bold text-red-700 mt-2">
                    {{ stats.minSecurityScore }}
                  </div>
                  <div
                    v-if="minScoreAppNames.length"
                    class="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max max-w-[200px] bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition z-10"
                  >
                    {{ minScoreAppNames.join(', ') }}
                  </div>
                  </div>
                </div>

              <!-- Platform Distribution Chart -->
              <div class="bg-white rounded-lg p-4 border border-gray-100">
                <h3 class="text-sm font-medium text-slate-600 mb-3">Platform Distribution</h3>
                <div class="h-40">
                    <Doughnut :data="platformDistributionData" :options="chartOptions" />
                </div>
              </div>

              <!-- Risk Distribution Chart -->
              <div class="bg-white rounded-lg p-4 border border-gray-100">
                <h3 class="text-sm font-medium text-slate-600 mb-3">Risk Distribution</h3>
                <div class="h-44">
                  <Doughnut :data="riskDistributionData" :options="chartOptions" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analysis Trends Chart -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100">
          <h2 class="text-xl font-bold text-slate-800 mb-3 sm:mb-0">Analysis Trends</h2>
          <div class="inline-flex rounded-md shadow-sm">
              <button
                v-for="range in ['week', 'month', 'year']"
                :key="range"
                :class="[
                'px-4 py-2 text-sm font-medium border',
                  trendTimeRange === range
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300',
                range === 'week' ? 'rounded-l-md' : '',
                range === 'year' ? 'rounded-r-md' : '',
                ]"
                @click="trendTimeRange = range"
              >
                {{ range.charAt(0).toUpperCase() + range.slice(1) }}
              </button>
            </div>
          </div>

        <div class="p-5">
          <div class="h-[400px]">
            <Line :data="trendData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>

    <!-- Report View -->
    <div v-else class="space-y-6">

      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div v-if="loading" class="flex justify-center py-16">
          <div class="flex flex-col items-center">
            <Loader class="w-10 h-10 text-indigo-500 animate-spin" />
            <span class="mt-3 text-slate-600">Loading report...</span>
        </div>
        </div>

        <div v-else-if="error" class="p-6 text-red-600 flex items-center">
          <AlertCircle class="w-6 h-6 mr-2" />
          {{ error }}
        </div>

        <div v-else>
          <div v-if="!reportData" class="p-6 text-gray-600 flex items-center justify-center">
            <FileX class="w-6 h-6 mr-2" />
            No report data available
          </div>

          <template v-else>
            <AndroidDynamicReport
              v-if="
                reportData && reportData.isDynamicReport
              "
              :reportData="reportData"
              :fileHash="selectedFileHash"
            />
            <AndroidStaticReport
              v-else-if="
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
import { defineComponent, ref, computed, onMounted, reactive, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import StaticAnalyzerService from '../../api/StaticAnalyzer'
import { dynamicAnalyzer } from '../../api/DynamicAnalyzer'
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
import AndroidDynamicReport from '../../components/MobSF/general/report/dynamic/android/AndroidDynamicReport.vue'

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
  hasDynamicAnalysis?: boolean
}

interface Filters {
  type: string
  status: string
  dateRange: [string, string]
}

interface DynamicApp {
  ICON_PATH: string;
  MD5: string;
  APP_NAME: string;
  VERSION_NAME: string;
  FILE_NAME: string;
  PACKAGE_NAME: string;
  DYNAMIC_REPORT_EXISTS: boolean;
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
    AndroidDynamicReport,
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
    const currentPage = ref(1)
    const pageSize = ref(8)
    const total = ref(0)
    let isComponentMounted = false
    const reportData = ref<any>(null)
    const showReport = ref(false)
    const selectedFileHash = ref('')
    const scansInRange = ref<any[]>([])
    const loadingStats = ref(true)
    const loadingRisk = ref(true)
    const loadingPlatform = ref(true)
    const loadingTrend = ref(true)
    const service = dynamicAnalyzer
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

    // Watch for route changes to refresh data
    watch(
      () => router.currentRoute.value.path,
      (newPath) => {
        if (newPath === '/main-analyser' && isComponentMounted) {
          fetchRecentAnalysis()
          fetchStats()
          fetchRiskDistribution()
          fetchPlatformDistribution()
          fetchTrendData()
        }
      }
    )

    // Clean up function for async operations
    const cleanup = () => {
      isComponentMounted = false
      loading.value = false
      loadingStats.value = false
      loadingRisk.value = false
      loadingPlatform.value = false
      loadingTrend.value = false
    }

    onMounted(() => {
      isComponentMounted = true
      fetchRecentAnalysis()
      fetchStats()
      fetchRiskDistribution()
      fetchPlatformDistribution()
      fetchTrendData()
    })

    onUnmounted(() => {
      cleanup()
    })

    // Update fetchRecentAnalysis to check component mount status
const fetchRecentAnalysis = async () => {
      if (!isComponentMounted) return

      try {
        loading.value = true
        error.value = null

        const [staticResponse, dynamicResponse] = await Promise.all([
          StaticAnalyzerService.getRecentScans(currentPage.value, pageSize.value),
          service.getApps()
        ])

        if (!isComponentMounted) return

        const staticScans = staticResponse.data.content;
        const dynamicApps = (dynamicResponse?.apps || []) as DynamicApp[];

        // Create a map of dynamic analysis status
        const dynamicStatusMap = new Map(
          dynamicApps.map(app => [app.MD5, app.DYNAMIC_REPORT_EXISTS])
        );
        console.log('Dynamic Status Map:', dynamicStatusMap);
        // Process static scans and add dynamic info
        scans.value = staticScans.map(scan => {
      // Check if scan has completed successfully
      const scanLogs = scan.SCAN_LOGS || '';
      const isSaved = typeof scanLogs === 'string' && scanLogs.includes('Saving to Database');

          // Get dynamic status
          const hasDynamicAnalysis = dynamicStatusMap.get(scan.MD5) || false;

      // Determine scan status based on string content
      let status = 'In Progress';
      if (isSaved) {
        status = 'Completed';
      } else if (typeof scanLogs === 'string') {
        if (
          scanLogs.includes('exception') ||
          scanLogs.includes('error') ||
          scanLogs.includes('failed') ||
          scanLogs.includes('failure')
        ) {
          status = 'Failed';
        }
      }

      return {
        ...scan,
            status,
            hasDynamicAnalysis,
            ANALYZER: hasDynamicAnalysis ? 'dynamic_analyzer' : 'static_analyzer'
      };
    });


        // Combine and sort by timestamp
        scans.value = [...scans.value]
          .sort((a, b) => new Date(b.TIMESTAMP).getTime() - new Date(a.TIMESTAMP).getTime())
          .slice(0, pageSize.value);

        total.value = staticResponse.data.count;

        // Store scores in scansInRange for maxScoreAppNames and minScoreAppNames computed properties
        scansInRange.value = scans.value.map((scan, index) => ({
          ...scan,
          _score: index < scans.value.length ? index : 0
        }));

  } catch (err) {
        if (!isComponentMounted) return
        console.error('Error fetching recent analysis:', err)
        error.value = 'Failed to fetch recent analysis'
  } finally {
        if (isComponentMounted) {
          loading.value = false
  }
}
    };

    const fetchStats = async () => {
      if (!isComponentMounted) return

      try {
      loadingStats.value = true
        const response = await StaticAnalyzerService.getRecentScans(1, 1000);
        const allScans = response.data.content;
        stats.totalScans = allScans.length;

        // Fetch scorecards in batches of 10 to avoid overwhelming the server
        const batchSize = 10;
        const batches = [];
        for (let i = 0; i < allScans.length; i += batchSize) {
          const batch = allScans.slice(i, i + batchSize);
          batches.push(batch);
        }

        let validScores: number[] = [];
        for (const batch of batches) {
          const batchScores = await Promise.all(
            batch.map(async (scan) => {
              try {
                const scorecard = await StaticAnalyzerService.getScorecard(scan.MD5);
                return scorecard?.data?.security_score;
              } catch (error) {
                console.warn(`Failed to fetch scorecard for ${scan.MD5}:`, error);
                return null;
              }
            })
          );
          validScores = validScores.concat(batchScores.filter(score =>
            score !== null && !isNaN(score) && score >= 0 && score <= 100
          ) as number[]);
        }

        if (validScores.length > 0) {
          stats.avgSecurityScore = Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1));
          stats.maxSecurityScore = Math.max(...validScores);
          stats.minSecurityScore = Math.min(...validScores);
        } else {
          stats.avgSecurityScore = 0;
          stats.maxSecurityScore = 0;
          stats.minSecurityScore = 0;
        }

        // Store scores in scansInRange for maxScoreAppNames and minScoreAppNames computed properties
        scansInRange.value = allScans.map((scan, index) => ({
          ...scan,
          _score: validScores[index] || 0
        }));

      } catch (err) {
        console.error('Error fetching stats:', err);
        stats.avgSecurityScore = 0;
        stats.maxSecurityScore = 0;
        stats.minSecurityScore = 0;
      } finally {
        if (isComponentMounted) {
        loadingStats.value = false
      }
    }
    };

    const fetchRiskDistribution = async () => {
      if (!isComponentMounted) return

      try {
      loadingRisk.value = true
        const response = await StaticAnalyzerService.getRecentScans(1, 1000);
        const allScans = response.data.content;

        // Fetch scorecards in batches of 10
        const batchSize = 10;
        const batches = [];
        for (let i = 0; i < allScans.length; i += batchSize) {
          const batch = allScans.slice(i, i + batchSize);
          batches.push(batch);
        }

        const riskCounts = {
          high: 0,    // 0-40
          medium: 0,  // 41-70
          low: 0      // 71-100
        };

        for (const batch of batches) {
          const scorecards = await Promise.all(
            batch.map(async (scan) => {
              try {
                const scorecard = await StaticAnalyzerService.getScorecard(scan.MD5);
                return scorecard?.data?.security_score;
              } catch (error) {
                console.warn(`Failed to fetch scorecard for ${scan.MD5}:`, error);
                return null;
              }
            })
          );

          // Count risk levels
          scorecards.forEach(score => {
            if (score === null || isNaN(score)) return;

            if (score <= 40) riskCounts.high++;
            else if (score <= 70) riskCounts.medium++;
            else if (score <= 100) riskCounts.low++;
          });
        }

        // Update chart data with percentages
        const total = riskCounts.high + riskCounts.medium + riskCounts.low;
        const getPercentage = (count: number) => total > 0 ? Math.round((count / total) * 100) : 0;

        riskDistributionData.value = {
          labels: [
            `High Risk (0-40) ${getPercentage(riskCounts.high)}%`,
            `Medium Risk (41-70) ${getPercentage(riskCounts.medium)}%`,
            `Low Risk (71-100) ${getPercentage(riskCounts.low)}%`
          ],
          datasets: [{
            data: [riskCounts.high, riskCounts.medium, riskCounts.low],
            backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
            borderWidth: 0
          }]
        };
      } catch (err) {
        console.error('Error fetching risk distribution:', err);
        // Set default empty data
        riskDistributionData.value = {
          labels: ['High Risk (0-40)', 'Medium Risk (41-70)', 'Low Risk (71-100)'],
          datasets: [{
            data: [0, 0, 0],
            backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
            borderWidth: 0
          }]
        };
      } finally {
        if (isComponentMounted) {
        loadingRisk.value = false
      }
    }
    };

    const fetchPlatformDistribution = async () => {
      if (!isComponentMounted) return

      try {
        loadingPlatform.value = true
        const response = await StaticAnalyzerService.getRecentScans(1, 1000);
        const allScans = response.data.content;

        // Calculate platform distribution
        const platforms = {
          android: allScans.filter(scan =>
            scan.SCAN_TYPE === 'apk' || scan.SCAN_TYPE === 'xapk'
          ).length,
          ios: allScans.filter(scan =>
            scan.SCAN_TYPE === 'ipa'
          ).length
        };

        // Update chart data
        platformDistributionData.value = {
          labels: ['Android', 'iOS'],
          datasets: [{
            data: [platforms.android, platforms.ios],
            backgroundColor: ['#10B981', '#3B82F6'],
            borderWidth: 0
          }]
        };
      } catch (err) {
        console.error('Error fetching platform distribution:', err);
      } finally {
        if (isComponentMounted) {
        loadingPlatform.value = false
      }
    }
    };

    const fetchTrendData = async () => {
      if (!isComponentMounted) return

      try {
        loadingTrend.value = true
        const [staticResponse, dynamicResponse] = await Promise.all([
          StaticAnalyzerService.getRecentScans(1, 1000),
          service.getApps()
        ]);

        const staticScans = staticResponse.data.content;
        const dynamicApps = (dynamicResponse?.apps || []) as DynamicApp[];

        const dates = getDateRange(trendTimeRange.value);

        const trendsData = dates.map(date => ({
          date,
          static: 0,
          dynamic: 0
        }));

        // Process static analysis data
        staticScans.forEach(scan => {
          const scanDate = new Date(scan.TIMESTAMP).toISOString().split('T')[0];
          const dateIndex = trendsData.findIndex(d => d.date === scanDate);
          if (dateIndex !== -1) {
            trendsData[dateIndex].static++;
          }
        });

        // Process dynamic analysis data
        dynamicApps.forEach(app => {
          if (app.DYNAMIC_REPORT_EXISTS) {
            const matchingStaticScan = staticScans.find(scan => scan.MD5 === app.MD5);
            if (matchingStaticScan) {
              const scanDate = new Date(matchingStaticScan.TIMESTAMP).toISOString().split('T')[0];
              const dateIndex = trendsData.findIndex(d => d.date === scanDate);
              if (dateIndex !== -1) {
                trendsData[dateIndex].dynamic++;
              }
            }
          }
        });

        // Update chart data
        trendData.value = {
          labels: dates.map(date => {
            const d = new Date(date);
            return trendTimeRange.value === 'year'
              ? d.toLocaleString('default', { month: 'short' })
              : d.toLocaleString('default', { weekday: 'short' });
          }),
          datasets: [
            {
              label: 'Static Analysis',
              data: trendsData.map(d => d.static),
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4
            },
            {
              label: 'Dynamic Analysis',
              data: trendsData.map(d => d.dynamic),
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4
            }
          ]
        };
      } catch (err) {
        console.error('Error fetching trend data:', err);
        trendData.value = {
          labels: [],
          datasets: [
            {
              label: 'Static Analysis',
              data: [],
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4
            },
            {
              label: 'Dynamic Analysis',
              data: [],
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4
            }
          ]
        };
      } finally {
        if (isComponentMounted) {
        loadingTrend.value = false
      }
    }
    };

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
      if (!type) return 'bg-gray-100 text-gray-800';
      switch (type.toLowerCase()) {
        case 'static_analyzer':
          return 'bg-blue-100 text-blue-800';
        case 'dynamic_analyzer':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }

    const navigateTo = (path: string) => {
      router.push(path)
    }

    const viewReport = async (scan: Scan) => {
      try {
        loading.value = true;
        error.value = null;

        // Check if dynamic report exists
        const dynamicApps = await service.getApps();
        const dynamicApp = dynamicApps.apps?.find(app => app.MD5 === scan.MD5);

        if (dynamicApp?.DYNAMIC_REPORT_EXISTS) {
          router.push(`/dynamic-analysis/report/${scan.MD5}`);
          return;
        }

        // Fetch static report if no dynamic report exists
        const response = await StaticAnalyzerService.getJsonReport(scan.MD5);
        reportData.value = response.data;
        selectedFileHash.value = scan.MD5;
        showReport.value = true;
      } catch (err) {
        console.error('Error fetching report:', err);
        error.value = err instanceof Error ? err.message : 'Failed to fetch report';
      } finally {
        loading.value = false;
      }
    };

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

    // Add computed property for dynamic analysis status
    const getDynamicStatus = async (scan: Scan) => {
      try {
        const dynamicApps = await service.getApps();
        const dynamicApp = dynamicApps.apps?.find(app => app.MD5 === scan.MD5);
        return dynamicApp?.DYNAMIC_REPORT_EXISTS ? 'Completed' : 'Not Available';
      } catch (error) {
        console.error('Error getting dynamic status:', error);
        return 'Error';
      }
    };

    const getAnalysisTypeDisplay = (scan: Scan) => {
      return 'Static Analysis';
    };

    const getDynamicStatusClass = (hasDynamicAnalysis: boolean | undefined) => {
      if (hasDynamicAnalysis) {
        return 'bg-green-100 text-green-800';
      }
      return 'bg-yellow-100 text-yellow-800';
    };

    const getDynamicStatusText = (hasDynamicAnalysis: boolean | undefined) => {
      return hasDynamicAnalysis ? 'Dynamic Analysis Available' : 'No Dynamic Analysis';
    };

    const viewStaticReport = async (scan: Scan) => {
      try {
        loading.value = true;
        error.value = null;

        const response = await StaticAnalyzerService.getJsonReport(scan.MD5);
        reportData.value = response.data;
        selectedFileHash.value = scan.MD5;
        showReport.value = true;
      } catch (err) {
        console.error('Error fetching static report:', err);
        error.value = err instanceof Error ? err.message : 'Failed to fetch static report';
      } finally {
        loading.value = false;
      }
    };

    const viewDynamicReport = async (scan: Scan) => {
      try {
        loading.value = true;
        error.value = null;
        console.log('Fetching dynamic report for MD5:', scan.MD5);
        const response = await service.getReport(scan.MD5);
        if (response) {
          reportData.value = {
            ...response.data,
            isDynamicReport: true
          };
          console.log('Dynamic report data:', reportData.value);
          selectedFileHash.value = scan.MD5;
          showReport.value = true;
        } else {
          error.value = 'Dynamic report not available';
        }
      } catch (err) {
        console.error('Error fetching dynamic report:', err);
        error.value = err instanceof Error ? err.message : 'Failed to fetch dynamic report';
      } finally {
        loading.value = false;
      }
    };

    return {
      scans,
      stats,
      trendTimeRange,
      loading,
      loadingStats,
      loadingRisk,
      loadingPlatform,
      loadingTrend,
      error,
      getStatusClass,
      getAppTypeClass,
      getAppTypeIcon,
      getTypeClass,
      navigateTo,
      viewReport,
      formatDate,
      staticCount: computed(
        () => scans.value.filter((scan: any) => scan.ANALYZER === 'static_analyzer').length
      ),
      dynamicCount: computed(
        () => scans.value.filter((scan: any) => scan.ANALYZER === 'dynamic_analyzer').length
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
      getDynamicStatus,
      getAnalysisTypeDisplay,
      getDynamicStatusClass,
      getDynamicStatusText,
      viewStaticReport,
      viewDynamicReport
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
