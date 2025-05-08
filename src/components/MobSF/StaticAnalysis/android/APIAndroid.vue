<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <Code class="w-5 h-5 mr-2 text-gray-700" />
          <span class="font-bold text-lg">ANDROID API</span>
        </div>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search APIs..."
            class="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search class="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gray-50">
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                API
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Files
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(api, index) in filteredApis" :key="index" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {{ formatApiName(api.name) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ api.details?.metadata?.description || 'No description available' }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  :class="getStatusBadgeClasses(api.details?.metadata?.severity)"
                  class="px-2 py-1 rounded-lg text-xs font-medium"
                >
                  {{ api.details?.metadata?.severity || 'unknown' }}
                </span>
              </td>
              <td class="px-3 py-3 text-sm">
                <button
                  @click="openFilesModal(api.name, api.details)"
                  class="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs"
                >
                  Show Files
                </button>
              </td>
            </tr>
            <!-- Show empty state when no results found -->
            <tr v-if="filteredApis.length === 0">
              <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                No APIs found matching your search.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Files Modal -->
    <div
      v-if="isFilesModalOpen"
      class="fixed backdrop-blur-md inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-[90vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 flex justify-between items-center"
        >
          <div class="flex items-center">
            <FileText class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600 flex-shrink-0" />
            <h3 class="text-base sm:text-lg font-medium text-gray-900 truncate">
              Files using this API
            </h3>
          </div>
          <button
            @click="closeFilesModal"
            class="text-gray-400 hover:text-gray-500 p-2 rounded-full"
          >
            <X class="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div class="px-4 py-3 sm:px-6 sm:py-4">
          <div class="mb-4">
            <p class="font-medium text-gray-700 text-sm sm:text-base">API:</p>
            <div class="flex items-center mt-1 flex-wrap">
              <span class="text-gray-900 text-sm sm:text-base truncate">
                {{ formatApiName(selectedApi) }}
              </span>
              <span
                v-if="selectedApiDetails?.metadata?.severity"
                :class="getStatusBadgeClasses(selectedApiDetails?.metadata?.severity)"
                class="ml-2 px-2 py-1 rounded-md text-xs font-medium"
              >
                {{ selectedApiDetails?.metadata?.severity }}
              </span>
            </div>
            <p class="text-gray-600 mt-2 text-xs sm:text-sm">
              {{ selectedApiDetails?.metadata?.description || 'No description available' }}
            </p>
          </div>

          <div class="mt-4 sm:mt-6">
            <p class="font-medium text-gray-700 mb-2 text-sm sm:text-base">Associated Files:</p>
            <div class="bg-gray-50 border border-gray-200 rounded-md">
              <ul class="divide-y divide-gray-200">
                <li
                  v-for="(lines, filePath, index) in selectedApiDetails?.files"
                  :key="index"
                  class="hover:bg-gray-100"
                >
                  <button
                    @click="openFileDetailsModal(filePath, lines)"
                    class="w-full px-3 py-2 sm:px-4 sm:py-3 text-left flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Code class="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                    <span class="text-xs sm:text-sm font-mono truncate">
                      {{ filePath }}
                    </span>
                    <ChevronRight class="w-3 h-3 sm:w-4 sm:h-4 ml-auto flex-shrink-0" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            @click="closeFilesModal"
            class="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- File Details Modal -->
    <div
      v-if="isFileDetailsModalOpen"
      class="fixed backdrop-blur-md inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div class="flex items-center">
            <button @click="returnToFilesList" class="mr-2 p-1 rounded-full hover:bg-gray-100">
              <ArrowLeft class="w-5 h-5 text-gray-600" />
            </button>
            <Code class="w-5 h-5 mr-2 text-indigo-600" />
            <h3 class="text-lg font-medium text-gray-900 truncate max-w-lg">
              {{ selectedFilePath }}
            </h3>
          </div>
          <button @click="closeAllModals" class="text-gray-400 hover:text-gray-500">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="mb-4">
            <p class="font-medium text-gray-700">API:</p>
            <p class="text-gray-900 bg-gray-100 p-2 rounded mt-1">
              {{ formatApiName(selectedApi) }}
            </p>
          </div>
          <div class="mb-4">
            <p class="font-medium text-gray-700">File Path:</p>
            <p class="text-gray-900 bg-gray-100 p-2 rounded mt-1 font-mono text-sm">
              {{ selectedFilePath }}
            </p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Referenced Lines:</p>
            <p class="text-gray-900 bg-gray-100 p-2 rounded mt-1 font-mono text-sm">
              {{ selectedLines }}
            </p>
          </div>

          <!-- File content preview -->
          <div class="mt-6 bg-gray-50 border border-gray-200 rounded-md p-4">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-medium text-gray-700">File Content</h4>
              <div class="text-xs text-gray-500">Lines: {{ selectedLines }}</div>
            </div>
            <div class="bg-gray-900 p-4 rounded text-green-400 font-mono text-sm overflow-x-auto">
              <p class="text-gray-400">// File content would be loaded here</p>
              <p class="text-gray-400">// With syntax highlighting</p>
              <p class="mt-2">
                public class {{ selectedFilePath?.split('/').pop()?.split('.')[0] }} {
              </p>
              <p class="ml-4">
                // Methods and properties related to {{ formatApiName(selectedApi) }}
              </p>
              <p class="ml-4">// You can view the full source at:</p>
              <p class="ml-4">
                // /view_source?file={{ selectedFilePath }}&md5={{ md5 }}&type={{
                  appType
                }}&lines={{ selectedLines }}
              </p>
              <p>}</p>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            @click="returnToFilesList"
            class="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
          >
            <ArrowLeft class="w-4 h-4 mr-1" />
            Back to Files
          </button>
          <button
            @click="closeAllModals"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Code, Search, X, FileText, ChevronRight } from 'lucide-vue-next'

interface ApiMetadata {
  description?: string
  risk?: string
}

interface ApiDetails {
  metadata?: ApiMetadata
  files?: Record<string, string>
}

// Define props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

// Search functionality
const searchQuery = ref('')

// Modal states
const isFilesModalOpen = ref(false)
const isFileDetailsModalOpen = ref(false)
const selectedApi = ref<string | null>(null)
const selectedApiDetails = ref<ApiDetails | null>(null)
const selectedFilePath = ref<string | null>(null)
const selectedLines = ref<string | null>(null)

// Format API name for display (remove api_ prefix and replace underscores with spaces)
const formatApiName = (apiName: string | null): string => {
  if (!apiName) return ''
  return apiName.replace('api_', '').replace(/_/g, ' ').toUpperCase()
}
console.log('API Name:', props.data.android_api)
// Get data from props.data
const androidApi = computed(() => props.data?.android_api || {})
const md5 = computed(() => props.data?.md5 || '')
const appType = computed(() => props.data?.appType || '')

// Filtered APIs based on search
const filteredApis = computed(() => {
  const apis = Object.entries(androidApi.value || {}).map(([name, details]) => ({
    name,
    details,
  }))

  if (!searchQuery.value.trim()) {
    return apis
  }

  const query = searchQuery.value.toLowerCase()
  return apis.filter((api) => {
    return (
      api.name.toLowerCase().includes(query) ||
      (api.details?.metadata?.description || '').toLowerCase().includes(query) ||
      (api.details?.metadata?.severity || '').toLowerCase().includes(query)
    )
  })
})

const getStatusBadgeClasses = (risk?: string) => {
  if (!risk) return 'bg-gray-500 text-white' // Default (unknown)

  const riskMap: Record<string, string> = {
    high: 'bg-red-500 text-white',
    medium: 'bg-amber-500 text-white',
    low: 'bg-blue-400 text-white',
    safe: 'bg-green-500 text-white',
  }

  return riskMap[risk.toLowerCase()] || 'bg-gray-500 text-white'
}

// Open files modal
const openFilesModal = (apiName: string, apiDetails: ApiDetails) => {
  selectedApi.value = apiName
  selectedApiDetails.value = apiDetails
  isFilesModalOpen.value = true
}

// Close files modal
const closeFilesModal = () => {
  isFilesModalOpen.value = false
  selectedApi.value = null
  selectedApiDetails.value = null
}

// Open file details modal
const openFileDetailsModal = (filePath: string, lines: string) => {
  selectedFilePath.value = filePath
  selectedLines.value = lines
  isFilesModalOpen.value = false
  isFileDetailsModalOpen.value = true
}

// Return to files list
const returnToFilesList = () => {
  isFileDetailsModalOpen.value = false
  isFilesModalOpen.value = true
  selectedFilePath.value = null
  selectedLines.value = null
}

// Close all modals
const closeAllModals = () => {
  isFilesModalOpen.value = false
  isFileDetailsModalOpen.value = false
  selectedApi.value = null
  selectedApiDetails.value = null
  selectedFilePath.value = null
  selectedLines.value = null
}
</script>
