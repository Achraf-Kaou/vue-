<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back button when viewing report -->
      <div v-if="showReport" class="mb-6">
        <button
          @click="closeReport"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ChevronLeft class="w-4 h-4 mr-2" />
          Back to Scan List
        </button>
      </div>

      <!-- Main content -->
      <div v-if="!showReport">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">MobSF Scan History</h1>
            <p class="mt-2 text-sm text-gray-500">
              View your recent security scans and analysis results
            </p>
          </div>
          <button
            @click="navigateTo('/')"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload class="w-4 h-4 mr-2" />
            New Scan
          </button>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <FileScan class="h-6 w-6 text-white" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Scans</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ total }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <Activity class="h-6 w-6 text-white" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Static Analysis</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ staticCount }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <Zap class="h-6 w-6 text-white" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Dynamic Analysis</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ dynamicCount }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-600 rounded-md p-3">
                  <Smartphone class="h-6 w-6 text-white" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Android/iOS</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ androidCount }}/{{ iosCount }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="mb-6 border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="setActiveTab('scans')"
              :class="[
                'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'scans'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              <FileSearch class="w-5 h-5 inline mr-2" />
              Recent Scans
            </button>
            <button
              @click="setActiveTab('tasks')"
              :class="[
                'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              <ListTodo class="w-5 h-5 inline mr-2" />
              Scan Tasks
            </button>
          </nav>
        </div>

        <!-- Filters -->
        <div
          v-if="activeTab === 'scans'"
          class="bg-white shadow overflow-hidden sm:rounded-lg mb-6"
        >
          <div class="px-4 py-5 sm:p-6">
            <form class="flex flex-wrap gap-4">
              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-700 mb-1">Scan Type</label>
                <select
                  v-model="filters.type"
                  class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Types</option>
                  <option value="static">Static Analysis</option>
                  <option value="dynamic">Dynamic Analysis</option>
                </select>
              </div>

              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div class="flex gap-2">
                  <input
                    type="date"
                    v-model="filters.dateRange[0]"
                    class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    v-model="filters.dateRange[1]"
                    class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    placeholder="End date"
                  />
                </div>
              </div>

              <div class="flex items-end gap-2">
                <button
                  type="button"
                  @click="applyFilters"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Search class="w-4 h-4 mr-2" />
                  Search
                </button>
                <button
                  type="button"
                  @click="resetFilters"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <RefreshCw class="w-4 h-4 mr-2" />
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <Loader class="w-8 h-8 text-blue-500 animate-spin" />
          <span class="ml-2 text-gray-600">Loading...</span>
        </div>

        <!-- Error State -->
        <div v-if="error" class="bg-red-50 p-4 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <AlertOctagon class="h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error loading data</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ error }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Scans Tab -->
        <div
          v-if="!loading && !error && activeTab === 'scans'"
          class="bg-white shadow overflow-hidden sm:rounded-md"
        >
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Scans</h3>
              <p class="mt-1 text-sm text-gray-500">List of recently analyzed applications</p>
            </div>
            <button
              @click="refreshScans"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw class="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>

          <ul v-if="scans.length > 0" class="divide-y divide-gray-200">
            <li
              v-for="(scan, index) in scans"
              :key="index"
              class="px-4 py-4 sm:px-6 hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div :class="['p-2 rounded-md', getAppTypeClass(scan.SCAN_TYPE || scan.type)]">
                      <component
                        :is="getAppTypeIcon(scan.SCAN_TYPE || scan.type)"
                        class="h-6 w-6 text-white"
                      />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ scan.APP_NAME || 'Unnamed App' }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ scan.PACKAGE_NAME || scan.FILE_NAME || 'No package name' }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <span :class="['px-2 py-1 text-xs rounded-full', getTypeClass(scan.SCAN_TYPE)]">
                    {{ scan.SCAN_TYPE }}
                  </span>
                  <div class="ml-4 flex">
                    <button
                      @click="viewReport(scan)"
                      :disabled="scan.status === 'In Progress'"
                      class="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
                      title="View Report"
                    >
                      <FileSearch class="w-5 h-5" />
                    </button>
                    <button
                      @click="deleteScan(scan)"
                      :disabled="scan.status === 'In Progress'"
                      class="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete Scan"
                    >
                      <Trash2 class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-500">
                <div>
                  <Clock class="h-4 w-4 inline mr-1" />
                  {{ formatDate(scan.TIMESTAMP) }}
                </div>
                <div>
                  <FileType class="h-4 w-4 inline mr-1" />
                  {{ scan.ANALYZER }}
                </div>
                <div>
                  <Tag class="h-4 w-4 inline mr-1" />
                  v{{ scan.VERSION_NAME }}
                </div>
                <div>
                  <User class="h-4 w-4 inline mr-1" />
                  {{ scan.MD5 }}
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="px-4 py-12 text-center text-gray-500">
            <FileSearch class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No scans found</h3>
            <p class="mt-1 text-sm text-gray-500">
              Get started by uploading an application to scan.
            </p>
            <div class="mt-6">
              <button
                @click="navigateTo('/static-analysis')"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload class="w-4 h-4 mr-2" />
                New Scan
              </button>
            </div>
          </div>
        </div>

        <!-- Scan Tasks Tab -->
        <div
          v-if="!loading && !error && activeTab === 'tasks'"
          class="bg-white shadow overflow-hidden sm:rounded-md"
        >
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">Scan Tasks</h3>
              <p class="mt-1 text-sm text-gray-500">List of ongoing and scheduled scan tasks</p>
            </div>
            <button
              @click="refreshTasks"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw class="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>

          <ul v-if="tasks.length > 0" class="divide-y divide-gray-200">
            <li
              v-for="(task, index) in tasks"
              :key="index"
              class="px-4 py-4 sm:px-6 hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div :class="['p-2 rounded-md', getTaskStatusClass(task.status)]">
                      <component :is="getTaskStatusIcon(task.status)" class="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ task.file_name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ task.description }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full',
                      getTaskStatusBadgeClass(task.status),
                    ]"
                  >
                    {{ task.status }}
                  </span>
                </div>
              </div>
              <div class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-500">
                <div>
                  <Clock class="h-4 w-4 inline mr-1" />
                  {{ formatDate(task.timestamp) }}
                </div>
                <div>
                  <User class="h-4 w-4 inline mr-1" />
                  {{ task.requested_by }}
                </div>
                <div>
                  <FileType class="h-4 w-4 inline mr-1" />
                  {{ task.type }}
                </div>
                <div>
                  <Activity class="h-4 w-4 inline mr-1" />
                  Progress: {{ task.progress }}%
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="px-4 py-12 text-center text-gray-500">
            <ListTodo class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p class="mt-1 text-sm text-gray-500">
              No scan tasks are currently running or scheduled.
            </p>
          </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <div
          v-if="deleteDialogVisible"
          class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
        >
          <div class="bg-white rounded-lg p-6 max-w-sm w-full">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <AlertCircle class="h-6 w-6 text-red-600" />
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-medium text-gray-900">Delete Scan</h3>
                <p class="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete this scan? This action cannot be undone.
                </p>
              </div>
            </div>
            <div class="mt-4 flex justify-end space-x-3">
              <button
                @click="setDeleteDialogVisible(false)"
                class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                @click="confirmDelete"
                class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Report View -->
      <div v-else class="bg-white rounded-lg shadow">
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
              v-else="
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
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StaticAnalyzerService from '../../api/StaticAnalyzer'
import AndroidStaticReport from '../../components/MobSF/general/report/static/android/AndroidStaticReport.vue'
import iOSStaticReport from '../../components/MobSF/general/report/static/ios/iOSStaticReport.vue'
import {
  FileSearch,
  ListTodo,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Upload,
  Clock,
  FileType,
  Tag,
  User,
  AlertOctagon,
  FileScan,
  AlertCircle,
  CheckCircle,
  Loader,
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
  name: 'ScanHistory',
  components: {
    FileSearch,
    ListTodo,
    ChevronRight,
    ChevronLeft,
    RefreshCw,
    Upload,
    Clock,
    FileType,
    Tag,
    User,
    AlertOctagon,
    FileScan,
    AlertCircle,
    CheckCircle,
    Loader,
    Timer,
    Hash,
    Smartphone,
    Package,
    Globe,
    Trash2,
    Search,
    Activity,
    Zap,
    AndroidStaticReport,
    iOSStaticReport,
    X,
    List,
  },
  setup() {
    const activeTab = ref('scans')
    const scans = ref<Scan[]>([])
    const tasks = ref<Task[]>([])
    const loading = ref(true)
    const error = ref<string | null>(null)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const deleteDialogVisible = ref(false)
    const selectedScan = ref<Scan | null>(null)
    const filters = ref<Filters>({
      type: '',
      status: '',
      dateRange: ['', ''],
    })
    const router = useRouter()
    const reportData = ref<any>(null)
    const showReport = ref(false)
    const selectedFileHash = ref('')

    // Methods
    const fetchScans = async () => {
      loading.value = true
      error.value = null

      try {
        const response = await StaticAnalyzerService.getRecentScans(
          currentPage.value,
          pageSize.value
        )
        scans.value = response.data.content
        total.value = response.data.count

        if (filters.value.type) {
          scans.value = scans.value.filter((scan) => scan.type === filters.value.type)
        }

        if (filters.value.status) {
          scans.value = scans.value.filter((scan) => scan.status === filters.value.status)
        }

        if (filters.value.dateRange[0] && filters.value.dateRange[1]) {
          const startDate = new Date(filters.value.dateRange[0])
          const endDate = new Date(filters.value.dateRange[1])
          scans.value = scans.value.filter((scan) => {
            const scanDate = new Date(scan.TIMESTAMP)
            return scanDate >= startDate && scanDate <= endDate
          })
        }
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch scans'
      } finally {
        loading.value = false
      }
    }

    const fetchTasks = async () => {
      loading.value = true
      error.value = null

      try {
        const response = await StaticAnalyzerService.getScanTasks()
        tasks.value = response.data
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch tasks'
      } finally {
        loading.value = false
      }
    }

    const refreshScans = () => {
      fetchScans()
    }

    const refreshTasks = () => {
      fetchTasks()
    }

    const navigateTo = (path: string) => {
      router.push({ path })
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

    const deleteScan = (scan: Scan) => {
      selectedScan.value = scan
      deleteDialogVisible.value = true
    }

    const confirmDelete = () => {
      if (selectedScan.value) {
        scans.value = scans.value.filter((scan) => scan.MD5 !== selectedScan.value!.MD5)
        total.value--
        deleteDialogVisible.value = false
      }
    }

    const applyFilters = () => {
      currentPage.value = 1
      fetchScans()
    }

    const resetFilters = () => {
      filters.value = {
        type: '',
        status: '',
        dateRange: ['', ''],
      }
      currentPage.value = 1
      fetchScans()
    }

    const setActiveTab = (tab: string) => {
      activeTab.value = tab
    }

    const setDeleteDialogVisible = (visible: boolean) => {
      deleteDialogVisible.value = visible
    }

    const closeReport = () => {
      showReport.value = false
      reportData.value = null
      selectedFileHash.value = ''
      error.value = null
    }

    // Utility functions
    const formatDate = (timestamp: string) => {
      if (!timestamp) return 'N/A'
      const date = new Date(timestamp)
      return date.toLocaleDateString()
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

    const getRiskClass = (risk: string) => {
      switch (risk?.toLowerCase()) {
        case 'high':
          return 'bg-red-100 text-red-800'
        case 'medium':
          return 'bg-yellow-100 text-yellow-800'
        case 'low':
          return 'bg-green-100 text-green-800'
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

    const getTaskStatusClass = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'completed':
          return 'bg-green-600'
        case 'in_progress':
          return 'bg-blue-600'
        case 'pending':
          return 'bg-yellow-600'
        case 'failed':
          return 'bg-red-600'
        default:
          return 'bg-gray-600'
      }
    }

    const getTaskStatusIcon = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'completed':
          return CheckCircle
        case 'in_progress':
          return Loader
        case 'pending':
          return Clock
        case 'failed':
          return AlertOctagon
        default:
          return Timer
      }
    }

    const getTaskStatusBadgeClass = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'completed':
          return 'bg-green-100 text-green-800'
        case 'in_progress':
          return 'bg-blue-100 text-blue-800'
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'failed':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    onMounted(() => {
      fetchScans()
      fetchTasks()
    })

    return {
      activeTab,
      scans,
      tasks,
      loading,
      error,
      currentPage,
      pageSize,
      total,
      deleteDialogVisible,
      selectedScan,
      filters,
      staticCount: computed(
        () => scans.value.filter((scan) => scan.ANALYZER?.includes('static')).length
      ),
      dynamicCount: computed(
        () => scans.value.filter((scan) => !scan.ANALYZER?.includes('static')).length
      ),
      androidCount: computed(
        () =>
          scans.value.filter((scan) => scan.SCAN_TYPE === 'apk' || scan.SCAN_TYPE === 'xapk').length
      ),
      iosCount: computed(() => scans.value.filter((scan) => scan.SCAN_TYPE === 'ipa').length),
      hasNextPage: computed(() => currentPage.value * pageSize.value < total.value),
      fetchScans,
      fetchTasks,
      refreshScans,
      refreshTasks,
      navigateTo,
      viewReport,
      deleteScan,
      confirmDelete,
      applyFilters,
      resetFilters,
      setActiveTab,
      setDeleteDialogVisible,
      formatDate,
      getStatusClass,
      getRiskClass,
      getAppTypeClass,
      getAppTypeIcon,
      getTypeClass,
      getTaskStatusClass,
      getTaskStatusIcon,
      getTaskStatusBadgeClass,
      reportData,
      showReport,
      selectedFileHash,
      closeReport,
    }
  },
})
</script>
