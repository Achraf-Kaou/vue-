<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  RefreshCw,
  Table,
  Eye,
  Code,
  List,
  Download,
  Settings,
  FileCode,
  Binary,
  Info,
} from 'lucide-vue-next'
import staticAnalyzerService from '../../../../api/StaticAnalyzer' // Adjust path as needed
import LogsTerminal from '../../base/Terminal.vue' // Assuming you have this component

// Props definition
const props = defineProps({
  fileHash: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
})

// Emits definition
const emit = defineEmits(['refresh-report'])

// Modal visibility states
const showLogs = ref(false)
const showSuppressions = ref(false)
const showRescan = ref(false)
const showInfoPlist = ref(false)

// Data states
const logs = ref<string | null>(null)
const logsError = ref<string | null>(null)
const suppressions = ref<any[] | null>(null)
const suppressionsError = ref<string | null>(null)
const infoPlistContent = ref<string | null>(null)
const infoPlistError = ref<string | null>(null)

// Control flags
const isRescanning = ref(false)
const isAnalysisComplete = ref(false)
const isRescanMode = ref(false)
const analysisResults = ref<any | null>(null)

// Get app type from data
const appType = computed(() => {
  return props.data?.app_type || 'apk'
})

// Determine if it's an iOS app
const isIosApp = computed(() => {
  const type = props.data?.app_type?.toLowerCase() || ''
  return ['ipa', 'dylib', 'a', 'swift'].includes(type)
})

// Determine if it's an Android app
const isAndroidApp = computed(() => {
  const type = props.data?.app_type?.toLowerCase() || ''
  return ['apk', 'aab', 'xapk'].includes(type)
})

// Determine iOS specific app type
const isIosDylib = computed(() => {
  return props.data?.app_type === 'Dylib'
})

const isIosALib = computed(() => {
  return props.data?.app_type === 'A'
})

// Function to add logs
const addLog = (message: string, type = 'info', prefix = '') => {
  const timestamp = new Date().toLocaleTimeString()
  const logEntry = `[${timestamp}] ${prefix}${message}`

  if (logs.value === null) {
    logs.value = logEntry
  } else {
    logs.value += '\n' + logEntry
  }
}

// Rescan functionality
const startRescan = async () => {
  const confirmMessage = isIosApp.value
    ? 'Are you sure you want to rescan this iOS application? This will delete the current scan results.'
    : 'Are you sure you want to rescan this Android application? This will delete the current scan results.'

  if (!confirm(confirmMessage)) {
    return
  }

  try {
    // First delete current scan
    addLog('Deleting current scan...', 'info', '[INFO] ')
    await staticAnalyzerService.deleteScan(props.fileHash)

    // Show rescan modal with terminal
    showRescan.value = true
    isRescanning.value = true
    isAnalysisComplete.value = false
    logs.value = ''

    // Start rescan
    addLog('Starting rescan process...', 'info', '[INFO] ')
    const response = await staticAnalyzerService.scanFile(props.fileHash, true)
    addLog(`Rescan initiated: ${response.data.status}`, 'success', '[SUCCESS] ')

    // Simulate logs for analysis progress (in a real app, you might use websockets or polling)
    simulateAnalysisProgress()
  } catch (error: any) {
    addLog(`Rescan failed: ${error.response?.data?.message || error.message}`, 'error', '[ERROR] ')
    isRescanning.value = false
  }
}

// Function to simulate analysis progress logs (in a real app, this would be replaced with actual logs)
const simulateAnalysisProgress = () => {
  let steps: string[]

  if (isIosApp.value) {
    steps = [
      'Extracting IPA...',
      'Analyzing Info.plist...',
      'Creating class dump...',
      'Checking permissions...',
      'Scanning for vulnerabilities...',
      'Processing components...',
      'Generating report...',
      'Analysis complete!',
    ]
  } else {
    steps = [
      'Extracting APK...',
      'Decompiling code...',
      'Analyzing manifest...',
      'Checking permissions...',
      'Scanning for vulnerabilities...',
      'Processing components...',
      'Generating report...',
      'Analysis complete!',
    ]
  }

  let currentStep = 0
  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      addLog(steps[currentStep], 'info', '[ANALYSIS] ')
      currentStep++
    } else {
      clearInterval(interval)
      isRescanning.value = false
      isAnalysisComplete.value = true
      analysisResults.value = { success: true }
    }
  }, 1500)
}

const cancelRescan = () => {
  if (isRescanning.value) {
    if (!confirm('Are you sure you want to cancel the rescan?')) {
      return
    }
  }

  showRescan.value = false
  isRescanning.value = false

  // If the analysis was complete, refresh the report
  if (isAnalysisComplete.value) {
    emit('refresh-report')
  }
}

const handleAnalysisComplete = () => {
  if (props.fileHash && analysisResults.value) {
    isRescanning.value = false
    addLog('Analysis completed successfully', 'success', '[SUCCESS] ')

    // Emit event to refresh report data in parent component
    emit('refresh-report')
  } else {
    addLog("Impossible d'afficher le rapport: données manquantes", 'error', '[ERROR] ')
  }
}

const openLogsModal = async () => {
  showLogs.value = true
  isRescanMode.value = false
  logs.value = null
  logsError.value = null
  try {
    const response = await staticAnalyzerService.getScanLogs(props.fileHash)
    logs.value = JSON.stringify(response.data, null, 2)
  } catch (error: any) {
    logsError.value = 'Error fetching logs: ' + (error.response?.data?.message || error.message)
  }
}

const openSuppressionsModal = async () => {
  showSuppressions.value = true
  suppressions.value = null
  suppressionsError.value = null
  try {
    const response = await staticAnalyzerService.listSuppressions(props.fileHash)
    suppressions.value = response.data.suppressions || []
  } catch (error: any) {
    suppressionsError.value =
      'Error fetching suppressions: ' + (error.response?.data?.message || error.message)
  }
}

const deleteSuppression = async (suppression: { type: string; rule: string; kind: string }) => {
  if (!confirm('Are you sure you want to delete this suppression?')) return
  try {
    await staticAnalyzerService.deleteSuppression(
      props.fileHash,
      suppression.type,
      suppression.rule,
      suppression.kind,
    )
    // Refresh suppressions list
    const response = await staticAnalyzerService.listSuppressions(props.fileHash)
    suppressions.value = response.data.suppressions || []
    addLog('Suppression deleted successfully', 'success', '[SUCCESS] ')
  } catch (error: any) {
    addLog(
      `Error deleting suppression: ${error.response?.data?.message || error.message}`,
      'error',
      '[ERROR] ',
    )
  }
}

// iOS specific methods
const openInfoPlistModal = async () => {
  showInfoPlist.value = true
  infoPlistContent.value = null
  infoPlistError.value = null

  try {
    const response = await staticAnalyzerService.getInfoPlist(props.fileHash)
    infoPlistContent.value = JSON.stringify(response.data, null, 2)
  } catch (error: any) {
    infoPlistError.value =
      'Error fetching Info.plist: ' + (error.response?.data?.message || error.message)
  }
}

const getDownloadLabel = computed(() => {
  if (isIosDylib.value) {
    return 'Download DYLIB'
  } else if (isIosALib.value) {
    return 'Download A'
  } else if (isIosApp.value) {
    return 'Download IPA'
  } else {
    return 'Download ZIP'
  }
})
</script>

<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-4 flex items-center">
        <Settings class="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
        <span class="font-bold text-lg">SCAN OPTIONS</span>
      </div>

      <div class="flex flex-wrap justify-center gap-2">
        <!-- Common buttons for both Android and iOS -->
        <button
          @click="openLogsModal"
          class="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
        >
          <List class="w-4 h-4 mr-2" />
          Scan Logs
        </button>

        <!-- Android specific buttons -->
        <template v-if="isAndroidApp">
          <a
            :href="`http://localhost:8089/manifest_view/${fileHash}/?type=${appType}`"
            target="_blank"
            class="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Eye class="w-4 h-4 mr-2" />
            View AndroidManifest.xml
          </a>

          <a
            :href="`http://localhost:8089/source_code/?md5=${fileHash}&type=java`"
            target="_blank"
            class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Code class="w-4 h-4 mr-2" />
            View Source
          </a>
        </template>

        <!-- iOS specific buttons -->
        <template v-if="isIosApp">
          <button
            v-if="!isIosDylib && !isIosALib"
            @click="openInfoPlistModal"
            class="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Info class="w-4 h-4 mr-2" />
            View Info.plist
          </button>

          <a
            v-if="!isIosDylib && !isIosALib"
            :href="`http://localhost:8089/view_file_ios/?file=classdump.txt&md5=${fileHash}&type=ios`"
            target="_blank"
            class="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
          >
            <Code class="w-4 h-4 mr-2" />
            View Class Dump
          </a>
        </template>

        <!-- Common download button with dynamic label -->
        <a
          :href="`http://localhost:8089/download_binary/${fileHash}/`"
          class="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
        >
          <Download class="w-4 h-4 mr-2" />
          {{ getDownloadLabel }}
        </a>
      </div>
    </div>

    <!-- Modal for Scan Logs -->
    <Teleport to="body">
      <div
        v-if="showLogs"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-xl p-6 w-3/4 max-h-3/4 overflow-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">Scan Logs</h3>
            <button @click="showLogs = false" class="text-gray-500 hover:text-gray-700">×</button>
          </div>
          <div class="border rounded p-3 bg-gray-50">
            <LogsTerminal
              v-if="isRescanMode"
              :logs="logs"
              :is-analysis-complete="isAnalysisComplete"
              @analysis-complete="handleAnalysisComplete"
            />
            <pre v-else-if="logs" class="text-sm">{{ logs }}</pre>
            <p v-else-if="logsError" class="text-red-500">{{ logsError }}</p>
            <p v-else class="text-gray-500">Loading logs...</p>
          </div>
          <div class="mt-4 text-right">
            <button
              @click="showLogs = false"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal for Suppressions -->
    <Teleport to="body">
      <div
        v-if="showSuppressions"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-xl p-6 w-3/4 max-h-3/4 overflow-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">Manage Suppressions</h3>
            <button @click="showSuppressions = false" class="text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
          <div class="border rounded p-3 bg-gray-50">
            <div v-if="suppressions && suppressions.length">
              <table class="w-full text-sm">
                <thead>
                  <tr>
                    <th class="text-left p-2">Type</th>
                    <th class="text-left p-2">Rule</th>
                    <th class="text-left p-2">Kind</th>
                    <th class="text-right p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="suppression in suppressions" :key="suppression.rule">
                    <td class="p-2">{{ suppression.type }}</td>
                    <td class="p-2">{{ suppression.rule }}</td>
                    <td class="p-2">{{ suppression.kind }}</td>
                    <td class="p-2 text-right">
                      <button
                        @click="deleteSuppression(suppression)"
                        class="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else-if="suppressionsError" class="text-red-500">{{ suppressionsError }}</p>
            <p v-else-if="suppressions && !suppressions.length" class="text-gray-500">
              No suppressions found.
            </p>
            <p v-else class="text-gray-500">Loading suppressions...</p>
          </div>
          <div class="mt-4 text-right">
            <button
              @click="showSuppressions = false"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal for Info.plist (iOS only) -->
    <Teleport to="body">
      <div
        v-if="showInfoPlist"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-xl p-6 w-3/4 max-h-3/4 overflow-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">Info.plist Contents</h3>
            <button @click="showInfoPlist = false" class="text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
          <div class="border rounded p-3 bg-gray-50">
            <pre v-if="infoPlistContent" class="text-sm">{{ infoPlistContent }}</pre>
            <p v-else-if="infoPlistError" class="text-red-500">{{ infoPlistError }}</p>
            <p v-else class="text-gray-500">Loading Info.plist...</p>
          </div>
          <div class="mt-4 text-right">
            <button
              @click="showInfoPlist = false"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>


  </section>
</template>
