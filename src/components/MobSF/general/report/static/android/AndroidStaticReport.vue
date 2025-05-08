<script setup lang="ts">
import { ref, onMounted, defineProps, PropType } from 'vue'
import {
  Info,
  Settings,
  List,
  Code,
  Layers,
  Lock,
  Shield,
  Search,
  FileCode,
  File,
  Database,
  Bug,
  Network,
  Grid,
  Globe,
  Mail,
  UserX,
  Key,
  Type,
  Activity,
  Cog,
  Radio,
  HardDrive,
  Package,
  Archive,
  Copy,
  FileText,
  Printer,
  ShoppingBag,
  Star,
  Calendar,
  Users,
  Link,
  MapPin,
  AlertCircle,
  BarChart,
  ChevronDown,
} from 'lucide-vue-next'

// Import all the content components
// Note: These imports should match your actual file structure
import AbusedPermissions from '../../../../StaticAnalysis/android/AbusedPermissions.vue'
import AndroidAPI from '../../../../StaticAnalysis/android/APIAndroid.vue'
import AppInfo from '../../../../StaticAnalysis/common/AppInfo.vue'
import ApplicationPermissions from '../../../../StaticAnalysis/common/ApplicationPermissions.vue'
import BehaviourAnalysis from '../../../../StaticAnalysis/android/BehaviourAnalysis.vue'
import BrowsableActivities from '../../../../StaticAnalysis/android/BrowsableActivities.vue'
import CodeAnalysis from '../../../../StaticAnalysis/android/CodeAnalysis.vue'
import DomainMalwareCheck from '../../../../StaticAnalysis/common/DomainMalwareCheck.vue'
import EmailsComponent from '../../../../StaticAnalysis/common/EmailsComponent.vue'
import FileAnalysis from '../../../../StaticAnalysis/android/FileAnalysis.vue'
import FirebaseAnalysis from '../../../../StaticAnalysis/common/FirebaseAnalysis.vue'
import ManifestAnalysis from '../../../../StaticAnalysis/android/ManifestAnalysis.vue'
import NetworkSecurity from '../../../../StaticAnalysis/android/NetworkSecurity.vue'
import NIAPAnalysis from '../../../../StaticAnalysis/android/NIAPAnalysis.vue'
import PlayStore from '../../../../StaticAnalysis/android/PlayStore.vue'
import ScanOptions from '../../../../StaticAnalysis/common/ScanOptions.vue'
import SecretsComponent from '../../../../StaticAnalysis/common/SecretsComponent.vue'
import ServerLocations from '../../../../StaticAnalysis/common/ServerLocations.vue'
import StringsComponent from '../../../../StaticAnalysis/android/StringsComponent.vue'
import TrackersComponent from '../../../../StaticAnalysis/common/TrackersComponent.vue'
import UrlsComponent from '../../../../StaticAnalysis/common/UrlsComponent.vue'
import SecurityScoreboard from '../../../../StaticAnalysis/common/SecurityScoreboard.vue'
import CertificateAnalysis from '../../../../StaticAnalysis/android/CertificateAnalysis.vue'
import BinaryAnalysis from '../../../../StaticAnalysis/android/BinaryAnalysis.vue'
import MalwareLookup from '../../../../StaticAnalysis/common/MalwareLookup.vue'
import APKiDAnalysis from '../../../../StaticAnalysis/android/APKiDAnalysis.vue'
// Define component props
const props = defineProps({
  reportData: {
    type: Object,
    required: true,
  },
  fileHash: {
    type: String,
    required: true,
  },
})

// Component state
const activeSection = ref('information')
const activeTab = ref('security')
const securityActiveTab = ref('network_security')
const malwareActiveTab = ref('behaviour')
const reconActiveTab = ref('urls')
const componentsActiveTab = ref('activities')
const error = ref(null)

// Set active section
const setActiveSection = (section: string) => {
  activeSection.value = section
}

// Set active tab
const setActiveTab = (tab: string) => {
  activeTab.value = tab
}

// Set active security tab
const setSecurityActiveTab = (tab: string) => {
  securityActiveTab.value = tab
}

// Set active malware tab
const setMalwareActiveTab = (tab: string) => {
  malwareActiveTab.value = tab
}

// Set active recon tab
const setReconActiveTab = (tab: string) => {
  reconActiveTab.value = tab
}

// Set active components tab
const setComponentsActiveTab = (tab: string) => {
  componentsActiveTab.value = tab
}

// Check if a section is active
const isActive = (section: string) => activeSection.value === section

// Download PDF report
const downloadPdfReport = async (hash: string) => {
  try {
    // Emit an event to the parent component to handle the PDF download
    emit('download-pdf', hash)
  } catch (err) {
    console.error('Error downloading PDF:', err)
    error.value = 'Failed to download PDF report. Please try again.'
  }
}

// Define emits
const emit = defineEmits(['download-pdf'])
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-64 h-full bg-gray-900 text-white flex flex-col shadow-lg">
      <!-- Header -->
      <div class="px-6 py-4 bg-gray-800 border-b border-gray-700">
        <h2 class="text-xl font-bold flex items-center">
          <Shield class="mr-2 text-blue-400" :size="20" />
          Static Analyzer
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
                :class="isActive('information') ? 'text-blue-400' : 'text-gray-400'"
              >
                <Info :size="18" />
              </span>
              <span :class="isActive('information') ? 'text-blue-400' : ''">Information</span>
            </a>
          </li>
          <li>
            <a
              @click="setActiveSection('scan_options')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('scan_options') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('scan_options') ? 'text-blue-400' : 'text-gray-400'"
              >
                <Settings :size="18" />
              </span>
              <span :class="isActive('scan_options') ? 'text-blue-400' : ''">Scan Options</span>
            </a>
          </li>
          <li>
            <a
              @click="setActiveSection('permissions')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('permissions') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('permissions') ? 'text-blue-400' : 'text-gray-400'"
              >
                <List :size="18" />
              </span>
              <span :class="isActive('permissions') ? 'text-blue-400' : ''">Permissions</span>
            </a>
          </li>
          <li>
            <a
              @click="setActiveSection('android_api')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('android_api') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('android_api') ? 'text-blue-400' : 'text-gray-400'"
              >
                <FileCode :size="18" />
              </span>
              <span :class="isActive('android_api') ? 'text-blue-400' : ''">Android API</span>
            </a>
          </li>
          <li>
            <a
              @click="setActiveSection('browsable')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('browsable') ? 'bg-gray-700' : ''"
            >
              <span class="mr-3" :class="isActive('browsable') ? 'text-blue-400' : 'text-gray-400'">
                <Layers :size="18" />
              </span>
              <span :class="isActive('browsable') ? 'text-blue-400' : ''"
                >Browsable Activities</span
              >
            </a>
          </li>

          <!-- Security Analysis -->
          <li>
            <a
              @click="setActiveSection('security_analysis')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('security_analysis') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('security_analysis') ? 'text-blue-400' : 'text-gray-400'"
              >
                <Shield :size="18" />
              </span>
              <span :class="isActive('security_analysis') ? 'text-blue-400' : ''"
                >Security Analysis</span
              >
            </a>
          </li>

          <!-- Malware Analysis -->
          <li>
            <a
              @click="setActiveSection('malware_analysis')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('malware_analysis') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('malware_analysis') ? 'text-blue-400' : 'text-gray-400'"
              >
                <Bug :size="18" />
              </span>
              <span :class="isActive('malware_analysis') ? 'text-blue-400' : ''"
                >Malware Analysis</span
              >
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
                :class="isActive('reconnaissance') ? 'text-blue-400' : 'text-gray-400'"
              >
                <Search :size="18" />
              </span>
              <span :class="isActive('reconnaissance') ? 'text-blue-400' : ''">Reconnaissance</span>
            </a>
          </li>

          <!-- Components -->
          <li>
            <a
              @click="setActiveSection('components')"
              class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              :class="isActive('components') ? 'bg-gray-700' : ''"
            >
              <span
                class="mr-3"
                :class="isActive('components') ? 'text-blue-400' : 'text-gray-400'"
              >
                <Grid :size="18" />
              </span>
              <span :class="isActive('components') ? 'text-blue-400' : ''">Components</span>
            </a>
          </li>

          <!-- Export Options -->
          <div class="pt-4 mt-4 border-t border-gray-700">
            <li>
              <a
                @click="
                  () => {
                    if (reportData && reportData.fileInfo && reportData.fileInfo.md5)
                      downloadPdfReport(reportData.fileInfo.md5)
                  }
                "
                class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <span class="mr-3 text-gray-400">
                  <FileText :size="18" />
                </span>
                <span>PDF Report</span>
              </a>
            </li>
            <li>
              <a
                @click="window.print()"
                class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <span class="mr-3 text-gray-400">
                  <Printer :size="18" />
                </span>
                <span>Print Report</span>
              </a>
            </li>
          </div>
        </ul>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white border-b shadow-sm">
        <div class="px-6 py-3 flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-800">
            {{ activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('_', ' ') }}
          </h1>
          <div class="flex items-center space-x-4">
            <button class="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <Search :size="18" />
            </button>
            <button class="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <Settings :size="18" />
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
            <Shield class="mx-auto text-gray-400" :size="48" />
            <p class="mt-4 text-gray-600">
              No analysis data available. Please select an application to analyze.
            </p>
          </div>
        </div>

        <!-- Content based on active section -->
        <template v-else>
          <!-- Information Section -->
          <div v-if="activeSection === 'information'">
            <!-- Tabs navigation -->
            <div class="bg-white shadow-sm border-b">
              <div class="container flex overflow-x-auto">
                <button
                  @click="setActiveTab('security')"
                  class="px-4 py-3 flex items-center font-medium text-sm transition-colors duration-150"
                  :class="
                    activeTab === 'security'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  "
                >
                  <Shield :size="18" class="mr-2" />
                  Security Scorecard
                </button>
                <button
                  @click="setActiveTab('app-info')"
                  class="px-4 py-3 flex items-center font-medium text-sm transition-colors duration-150"
                  :class="
                    activeTab === 'app-info'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  "
                >
                  <Package :size="18" class="mr-2" />
                  App Info
                </button>
                <button
                  @click="setActiveTab('playstore')"
                  class="px-4 py-3 flex items-center font-medium text-sm transition-colors duration-150"
                  :class="
                    activeTab === 'playstore'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  "
                >
                  <ShoppingBag :size="18" class="mr-2" />
                  Play Store
                </button>
              </div>
            </div>

            <!-- Tab Content -->
            <div class="bg-white shadow-md rounded-lg my-6">
              <SecurityScoreboard v-if="activeTab === 'security'" :data="reportData" />
              <AppInfo v-if="activeTab === 'app-info'" :data="reportData" />
              <PlayStore v-if="activeTab === 'playstore'" :data="reportData" />
            </div>
          </div>

          <!-- Scan Options Section -->
          <div v-else-if="activeSection === 'scan_options'">
            <ScanOptions :file-hash="fileHash" :data="reportData" />
          </div>

          <!-- Permissions Section -->
          <div v-else-if="activeSection === 'permissions'">
            <ApplicationPermissions :data="reportData" />
          </div>

          <!-- Android API Section -->
          <div v-else-if="activeSection === 'android_api'">
            <AndroidAPI :data="reportData" />
          </div>

          <!-- Browsable Activities Section -->
          <div v-else-if="activeSection === 'browsable'">
            <BrowsableActivities :data="reportData" />
          </div>

          <!-- Security Analysis Section -->
          <div v-else-if="activeSection === 'security_analysis'">
            <!-- Tabs navigation -->
            <div class="bg-white shadow-sm border-b">
              <div class="container flex overflow-x-auto">
                <button
                  v-for="tab in [
                    { id: 'network_security', label: 'Network Security', icon: Lock },
                    { id: 'certificate_analysis', label: 'Certificate Analysis', icon: Lock },
                    { id: 'manifest', label: 'Manifest Analysis', icon: Search },
                    { id: 'code_analysis', label: 'Code Analysis', icon: Code },
                    { id: 'binary_analysis', label: 'Binary Analysis', icon: Code },
                    { id: 'niap_analysis', label: 'NIAP Analysis', icon: FileCode },
                    { id: 'file_analysis', label: 'File Analysis', icon: File },
                    { id: 'firebase', label: 'Firebase Analysis', icon: Database },
                  ]"
                  :key="tab.id"
                  @click="setSecurityActiveTab(tab.id)"
                  class="px-4 py-3 flex items-center font-medium text-sm transition-colors duration-150"
                  :class="
                    securityActiveTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  "
                >
                  <component :is="tab.icon" :size="18" class="mr-2" />
                  {{ tab.label }}
                </button>
              </div>
            </div>

            <!-- Tab Content -->
            <div class="mt-6">
              <NetworkSecurity v-if="securityActiveTab === 'network_security'" :data="reportData" />
              <CertificateAnalysis
                v-if="securityActiveTab === 'certificate_analysis'"
                :data="reportData"
              />
              <ManifestAnalysis
                v-if="securityActiveTab === 'manifest'"
                :file-hash="fileHash"
                :data="reportData"
              />
              <CodeAnalysis v-if="securityActiveTab === 'code_analysis'" :data="reportData" />
              <BinaryAnalysis v-if="securityActiveTab === 'binary_analysis'" :data="reportData" />
              <NIAPAnalysis v-if="securityActiveTab === 'niap_analysis'" :data="reportData" />
              <FileAnalysis v-if="securityActiveTab === 'file_analysis'" :data="reportData" />
              <FirebaseAnalysis v-if="securityActiveTab === 'firebase'" :data="reportData" />
            </div>
          </div>

          <!-- Malware Analysis Section -->
          <div v-else-if="activeSection === 'malware_analysis'">
            <!-- Tabs navigation -->
            <div class="bg-white shadow-sm border-b">
              <div class="container flex overflow-x-auto">
                <button
                  v-for="tab in [
                    { id: 'malware_lookup', label: 'Malware Lookup', icon: Network },
                    { id: 'APKiD_Analysis', label: 'APKiD Analysis', icon: Network },
                    { id: 'behaviour', label: 'Behaviour Analysis', icon: Network },
                    { id: 'malware_permissions', label: 'Abused Permissions', icon: Grid },
                    { id: 'serverlocations', label: 'Server Locations', icon: Globe },
                    { id: 'malware_check', label: 'Domain Malware Check', icon: Search },
                  ]"
                  :key="tab.id"
                  @click="setMalwareActiveTab(tab.id)"
                  class="px-4 py-3 flex items-center font-medium text-sm transition-colors duration-150"
                  :class="
                    malwareActiveTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  "
                >
                  <component :is="tab.icon" :size="18" class="mr-2" />
                  {{ tab.label }}
                </button>
              </div>
            </div>

            <!-- Tab Content -->
            <div class="mt-6">
              <MalwareLookup v-if="malwareActiveTab === 'malware_lookup'" :data="reportData" />
              <APKiDAnalysis v-if="malwareActiveTab === 'APKiD_Analysis'" :data="reportData" />
              <BehaviourAnalysis v-if="malwareActiveTab === 'behaviour'" :data="reportData" />
              <AbusedPermissions
                v-if="malwareActiveTab === 'malware_permissions'"
                :data="reportData"
              />
              <ServerLocations v-if="malwareActiveTab === 'serverlocations'" :data="reportData" />
              <DomainMalwareCheck v-if="malwareActiveTab === 'malware_check'" :data="reportData" />
            </div>
          </div>

          <!-- Reconnaissance Section -->
          <div v-else-if="activeSection === 'reconnaissance'">
            <!-- Tabs navigation -->
            <div class="bg-white shadow-sm border-b">
              <div class="container flex overflow-x-auto">
                <button
                  v-for="tab in [
                    { id: 'urls', label: 'URLs', icon: Globe },
                    { id: 'emails', label: 'Emails', icon: Mail },
                    { id: 'trackers', label: 'Trackers', icon: UserX },
                    { id: 'secrets', label: 'Hardcoded Secrets', icon: Key },
                    { id: 'strings', label: 'Strings', icon: Type },
                  ]"
                  :key="tab.id"
                  @click="setReconActiveTab(tab.id)"
                  class="px-4 py-3 flex items-center font-medium text-sm transition-colors duration-150"
                  :class="
                    reconActiveTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  "
                >
                  <component :is="tab.icon" :size="18" class="mr-2" />
                  {{ tab.label }}
                </button>
              </div>
            </div>

            <!-- Tab Content -->
            <div class="mt-6">
              <UrlsComponent v-if="reconActiveTab === 'urls'" :data="reportData" />
              <EmailsComponent v-if="reconActiveTab === 'emails'" :data="reportData" />
              <TrackersComponent v-if="reconActiveTab === 'trackers'" :data="reportData" />
              <SecretsComponent v-if="reconActiveTab === 'secrets'" :data="reportData" />
              <StringsComponent v-if="reconActiveTab === 'strings'" :data="reportData" />
            </div>
          </div>

          <!-- Components Section -->
          <div v-else-if="activeSection === 'components'">
            <!-- Tabs navigation -->
            <div class="bg-white shadow-sm border-b">
              <div class="container flex overflow-x-auto">
                <button
                  v-for="tab in [
                    { id: 'activities', label: 'ACTIVITIES', icon: Activity },
                    { id: 'services', label: 'SERVICES', icon: Cog },
                    { id: 'receivers', label: 'RECEIVERS', icon: Radio },
                    { id: 'providers', label: 'PROVIDERS', icon: HardDrive },
                    { id: 'libraries', label: 'LIBRARIES', icon: Package },
                    { id: 'sbom', label: 'SBOM', icon: Archive },
                    { id: 'files', label: 'FILES', icon: Copy },
                  ]"
                  :key="tab.id"
                  @click="setComponentsActiveTab(tab.id)"
                  class="px-4 py-3 flex items-center font-medium text-sm transition-colors duration-150"
                  :class="
                    componentsActiveTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-600 hover:text-blue-500'
                  "
                >
                  <component :is="tab.icon" :size="18" class="mr-2" />
                  {{ tab.label }}
                </button>
              </div>
            </div>

            <!-- Tab Content -->
            <div class="mt-6 bg-white shadow-md rounded-lg p-4">
              <!-- Activities content -->
              <div v-if="componentsActiveTab === 'activities'">
                <div
                  v-for="(item, idx) in reportData.activities"
                  :key="idx"
                  class="border-b py-2 last:border-b-0"
                >
                  {{ item }}
                </div>
              </div>

              <!-- Services content -->
              <div v-if="componentsActiveTab === 'services'">
                <div
                  v-for="(item, idx) in reportData.services"
                  :key="idx"
                  class="border-b py-2 last:border-b-0"
                >
                  {{ item }}
                </div>
              </div>

              <!-- Receivers content -->
              <div v-if="componentsActiveTab === 'receivers'">
                <div
                  v-for="(item, idx) in reportData.receivers"
                  :key="idx"
                  class="border-b py-2 last:border-b-0"
                >
                  {{ item }}
                </div>
              </div>

              <!-- Providers content -->
              <div v-if="componentsActiveTab === 'providers'">
                <div
                  v-for="(item, idx) in reportData.providers"
                  :key="idx"
                  class="border-b py-2 last:border-b-0"
                >
                  {{ item }}
                </div>
              </div>

              <!-- Libraries content -->
              <div v-if="componentsActiveTab === 'libraries'">
                <div
                  v-for="(item, idx) in reportData.libraries"
                  :key="idx"
                  class="border-b py-2 last:border-b-0"
                >
                  {{ item }}
                </div>
              </div>

              <!-- SBOM content -->
              <div v-if="componentsActiveTab === 'sbom'" class="space-y-4">
                <div
                  v-for="(item, idx) in reportData.sbom"
                  :key="idx"
                  class="border-b py-2 last:border-b-0"
                >
                  {{ item }}
                </div>
              </div>

              <!-- Files content -->
              <div v-if="componentsActiveTab === 'files'" class="space-y-4">
                <div
                  v-for="(item, idx) in reportData.files"
                  :key="idx"
                  class="border-b py-2 last:border-b-0"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AndroidStaticReport',
}
</script>
