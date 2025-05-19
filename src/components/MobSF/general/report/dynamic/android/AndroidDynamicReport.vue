<script setup lang="ts">
import { ref, defineProps, PropType } from 'vue'
import {
  Info,
  Lock,
  Search,
  Activity,
  Database,
  Bug,
  Grid,
  Globe,
  FileText,
  Printer,
  Camera,
  Package,
  Layers,
  AlertCircle,
} from 'lucide-vue-next'

// Import all the content components
import Information from '../../../../dynamicAnalysis/android/Information.vue'
import LiveApi from '../../../../dynamicAnalysis/android/LiveApi.vue'
import LiveDroid from '../../../../dynamicAnalysis/android/LiveDroid.vue'
import TLS_SSL from '../../../../dynamicAnalysis/android/TLS_SSL.vue'
import ExportedActivityTester from '../../../../dynamicAnalysis/android/ExportedActivityTester.vue'
import ActivityTester from '../../../../dynamicAnalysis/android/ActivityTester.vue'
import Screenshots from '../../../../dynamicAnalysis/android/Screenshots.vue'
import RuntimeDependencies from '../../../../dynamicAnalysis/android/RuntimeDependencies.vue'
import ServerLocation from '../../../../dynamicAnalysis/android/ServerLocation.vue'
import DomainMalwareCheck from '../../../../dynamicAnalysis/android/DomainMalwareCheck.vue'
import Reconnaissance from '../../../../dynamicAnalysis/android/Reconnaissance.vue'
import FileAnalysis from '../../../../dynamicAnalysis/android/FileAnalysis.vue'

// Define component props
const props = defineProps({
  reportData: {
    type: Object as PropType<any>,
    required: true,
  },
  fileHash: {
    type: String,
    required: true,
  },
})
console.log(props.reportData)
console.log(props.fileHash)

// Component state
const activeSection = ref('information')
const reconActiveTab = ref('clipboard')
const fileActiveTab = ref('sqlite')
const error = ref(null)

// Set active section
const setActiveSection = (section: string) => {
  activeSection.value = section
}

// Set active recon tab
const setReconActiveTab = (tab: string) => {
  reconActiveTab.value = tab
}

// Set active file analysis tab
const setFileActiveTab = (tab: string) => {
  fileActiveTab.value = tab
}

// Check if a section is active
const isActive = (section: string) => activeSection.value === section

// Define emits
const emit = defineEmits(['download-pdf'])

const exportPdf = () => {
  if (props.reportData && props.fileHash) {
    window.location.href = `http://localhost:8089/pdf/${props.fileHash}`;
  }
};
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-64 h-full bg-gray-900 text-white flex flex-col shadow-lg">
      <!-- Header -->
      <div class="px-6 py-4 bg-gray-800 border-b border-gray-700">
        <h2 class="text-xl font-bold flex items-center">
          <Activity class="mr-2 text-green-400" :size="20" />
          Dynamic Analyzer
        </h2>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1 px-3">
          <!-- Basic Information -->
          <li>
            <a
              @click="setActiveSection('information')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('information') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('information') ? 'text-green-400' : 'text-gray-400'"
              >
                <Info :size="18" />
              </span>
              <span :class="isActive('information') ? 'text-green-400' : ''">Information</span>
            </a>
          </li>

          <!-- Live API Monitoring -->
          <li>
            <a
              @click="setActiveSection('live_api')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('live_api') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('live_api') ? 'text-green-400' : 'text-gray-400'"
              >
                <Activity :size="18" />
              </span>
              <span :class="isActive('live_api') ? 'text-green-400' : ''">Live API Monitoring</span>
            </a>
          </li>

          <!-- Live Droid Monitoring -->
          <li>
            <a
              @click="setActiveSection('live_droid')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('live_droid') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('live_droid') ? 'text-green-400' : 'text-gray-400'"
              >
                <Bug :size="18" />
              </span>
              <span :class="isActive('live_droid') ? 'text-green-400' : ''">Live Droid Monitoring</span>
            </a>
          </li>

          <!-- Security Testing -->
          <li>
            <a
              @click="setActiveSection('tls_ssl')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('tls_ssl') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('tls_ssl') ? 'text-green-400' : 'text-gray-400'"
              >
                <Lock :size="18" />
              </span>
              <span :class="isActive('tls_ssl') ? 'text-green-400' : ''">TLS/SSL Testing</span>
            </a>
          </li>

          <!-- Activity Testing -->
          <li>
            <a
              @click="setActiveSection('exported_activities')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('exported_activities') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('exported_activities') ? 'text-green-400' : 'text-gray-400'"
              >
                <Layers :size="18" />
              </span>
              <span :class="isActive('exported_activities') ? 'text-green-400' : ''">Exported Activities</span>
            </a>
          </li>

          <li>
            <a
              @click="setActiveSection('activity_tester')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('activity_tester') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('activity_tester') ? 'text-green-400' : 'text-gray-400'"
              >
                <Grid :size="18" />
              </span>
              <span :class="isActive('activity_tester') ? 'text-green-400' : ''">Activity Tester</span>
            </a>
          </li>

          <!-- Visual Analysis -->
          <li>
            <a
              @click="setActiveSection('screenshots')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('screenshots') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('screenshots') ? 'text-green-400' : 'text-gray-400'"
              >
                <Camera :size="18" />
              </span>
              <span :class="isActive('screenshots') ? 'text-green-400' : ''">Screenshots</span>
            </a>
          </li>

          <!-- Runtime Analysis -->
          <li>
            <a
              @click="setActiveSection('runtime_dependencies')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('runtime_dependencies') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('runtime_dependencies') ? 'text-green-400' : 'text-gray-400'"
              >
                <Package :size="18" />
              </span>
              <span :class="isActive('runtime_dependencies') ? 'text-green-400' : ''">Runtime Dependencies</span>
            </a>
          </li>

          <!-- Network Analysis -->
          <li>
            <a
              @click="setActiveSection('server_location')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('server_location') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('server_location') ? 'text-green-400' : 'text-gray-400'"
              >
                <Globe :size="18" />
              </span>
              <span :class="isActive('server_location') ? 'text-green-400' : ''">Server Locations</span>
            </a>
          </li>

          <li>
            <a
              @click="setActiveSection('domain_malware')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('domain_malware') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('domain_malware') ? 'text-green-400' : 'text-gray-400'"
              >
                <AlertCircle :size="18" />
              </span>
              <span :class="isActive('domain_malware') ? 'text-green-400' : ''">Domain Malware Check</span>
            </a>
          </li>

          <!-- Reconnaissance -->
          <li>
            <a
              @click="setActiveSection('reconnaissance')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('reconnaissance') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('reconnaissance') ? 'text-green-400' : 'text-gray-400'"
              >
                <Search :size="18" />
              </span>
              <span :class="isActive('reconnaissance') ? 'text-green-400' : ''">Reconnaissance</span>
            </a>
          </li>

          <!-- File Analysis -->
          <li>
            <a
              @click="setActiveSection('file_analysis')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('file_analysis') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('file_analysis') ? 'text-green-400' : 'text-gray-400'"
              >
                <Database :size="18" />
              </span>
              <span :class="isActive('file_analysis') ? 'text-green-400' : ''">File Analysis</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white border-b shadow-sm">
        <div class="px-6 py-3 flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-800">
            {{ activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace(/_/g, ' ') }}
          </h1>
          <div class="flex items-center space-x-4">
            <button class="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <Search :size="18" />
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <!-- Error State -->
        <div v-if="error" class="flex items-center justify-center h-full">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{{ error }}</p>
          </div>
        </div>

        <!-- No Data State -->
        <div v-else-if="!reportData" class="flex items-center justify-center h-full">
          <div class="text-center">
            <Activity class="mx-auto text-gray-400" :size="48" />
            <p class="mt-4 text-gray-600">
              No dynamic analysis data available. Please run a dynamic analysis session first.
            </p>
          </div>
        </div>

        <!-- Content based on active section -->
        <template v-else>
          <!-- Information Section -->
          <div v-if="activeSection === 'information'" class="bg-white p-6 rounded-lg shadow-md">
            <Information
              :hash="fileHash"
              :apimon="reportData.apimon"
              :fridaLogs="reportData.frida_logs"
              :droidmon="reportData.droidmon"
            />
          </div>

          <!-- Live API Monitoring Section -->
          <div v-else-if="activeSection === 'live_api'" class="bg-white p-6 rounded-lg shadow-md">
            <div v-if="reportData.apimon">
              <LiveApi
                :apiData="reportData.apimon"
              />
            </div>
            <div v-else class="flex items-center justify-center p-8">
              <div class="text-center">
                <Activity class="mx-auto text-gray-400" :size="36" />
                <p class="mt-4 text-gray-600">No API monitoring data available.</p>
              </div>
            </div>
          </div>

          <!-- Live Droid Monitoring Section -->
          <div v-else-if="activeSection === 'live_droid'" class="bg-white p-6 rounded-lg shadow-md">
            <div v-if="reportData.droidmon">
              <LiveDroid
                :droidmonData="reportData.droidmon"
              />
            </div>
            <div v-else class="flex items-center justify-center p-8">
              <div class="text-center">
                <Bug class="mx-auto text-gray-400" :size="36" />
                <p class="mt-4 text-gray-600">No Droidmon data available.</p>
              </div>
            </div>
          </div>

          <!-- TLS/SSL Testing Section -->
          <div v-else-if="activeSection === 'tls_ssl'" class="bg-white p-6 rounded-lg shadow-md">
            <TLS_SSL
              :tlsTests="reportData.tls_tests"
            />
          </div>

          <!-- Exported Activities Section -->
          <div v-else-if="activeSection === 'exported_activities'" class="bg-white p-6 rounded-lg shadow-md">
            <ExportedActivityTester
              :exportedActivities="reportData.exported_activity_tester"
              :appHash="fileHash"
            />
          </div>

          <!-- Activity Tester Section -->
          <div v-else-if="activeSection === 'activity_tester'" class="bg-white p-6 rounded-lg shadow-md">
            <ActivityTester
              :activityTests="reportData.activity_tester"
              :appHash="fileHash"
            />
          </div>

          <!-- Screenshots Section -->
          <div v-else-if="activeSection === 'screenshots'" class="bg-white p-6 rounded-lg shadow-md">
            <Screenshots
              :screenshots="reportData.screenshots"
              :appHash="fileHash"
            />
          </div>

          <!-- Runtime Dependencies Section -->
          <div v-else-if="activeSection === 'runtime_dependencies'" class="bg-white p-6 rounded-lg shadow-md">
            <RuntimeDependencies
              :runtimeDependencies="reportData.runtime_dependencies"
              :appHash="fileHash"
            />
          </div>

          <!-- Server Location Section -->
          <div v-else-if="activeSection === 'server_location'" class="bg-white p-6 rounded-lg shadow-md">
            <ServerLocation
              :domains="reportData.domains"
              :appHash="fileHash"
            />
          </div>

          <!-- Domain Malware Check Section -->
          <div v-else-if="activeSection === 'domain_malware'" class="bg-white p-6 rounded-lg shadow-md">
            <DomainMalwareCheck
              :domains="reportData.domains"
              :appHash="fileHash"
            />
          </div>

          <!-- Reconnaissance Section -->
          <div v-else-if="activeSection === 'reconnaissance'" class="bg-white p-6 rounded-lg shadow-md">
            <Reconnaissance
              :clipboard="reportData.clipboard"
              :urls="reportData.urls"
              :emails="reportData.emails"
              :trackers="reportData.trackers.trackers"
              :base64Strings="reportData.base64_strings"
            />
          </div>

          <!-- File Analysis Section -->
          <div v-else-if="activeSection === 'file_analysis'">
             <FileAnalysis
                :sqlite="reportData.sqlite"
                :xml="reportData.xml"
                :others="reportData.others"
                :appHash="fileHash"
              />
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AndroidDynamicReport',
}
</script>
