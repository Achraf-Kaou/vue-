<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <List class="w-5 h-5 mr-2 text-gray-700" />
          <span class="font-bold text-lg">APPLICATION PERMISSIONS</span>
        </div>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search permissions..."
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
                Permission
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Info
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Code Mappings
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="([perm, desc], index) in filteredPermissions"
              :key="index"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{{ perm }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  :class="getStatusBadgeClasses(desc?.status)"
                  class="px-2 py-1 rounded-lg text-xs font-medium"
                >
                  {{ desc?.status || 'unknown' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ desc?.info || '' }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ desc?.description || '' }}</td>
              <td class="px-3 py-3 text-sm">
                <div v-if="permissionMapping && permissionMapping[perm]">
                  <button
                    @click="openFilesModal(perm)"
                    class="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs"
                  >
                    Show Files
                  </button>
                </div>
              </td>
            </tr>
            <!-- Show empty state when no results found -->
            <tr v-if="filteredPermissions.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500">
                No permissions found matching your search.
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
              Files using this permission
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
            <p class="font-medium text-gray-700 text-sm sm:text-base">Permission:</p>
            <div class="flex items-center mt-1 flex-wrap">
              <span class="text-gray-900 text-sm sm:text-base truncate">
                {{ selectedPermission }}
              </span>
              <span
                v-if="permissions[selectedPermission || '']?.status"
                :class="getStatusBadgeClasses(permissions[selectedPermission || '']?.status)"
                class="ml-2 px-2 py-1 rounded-md text-xs font-medium"
              >
                {{ permissions[selectedPermission || '']?.status }}
              </span>
            </div>
            <p class="text-gray-600 mt-2 text-xs sm:text-sm">
              {{ permissions[selectedPermission || '']?.description }}
            </p>
          </div>

          <div class="mt-4 sm:mt-6">
            <p class="font-medium text-gray-700 mb-2 text-sm sm:text-base">Associated Files:</p>
            <div class="bg-gray-50 border border-gray-200 rounded-md">
              <ul class="divide-y divide-gray-200">
                <li
                  v-for="([filePath, lines], index) in selectedPermissionFiles"
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
            <p class="font-medium text-gray-700">Permission:</p>
            <p class="text-gray-900 bg-gray-100 p-2 rounded mt-1">{{ selectedPermission }}</p>
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

          <!-- If we had actual file content, we would show it here -->
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
              <p class="ml-4">// Methods and properties related to {{ selectedPermission }}</p>
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
import { List, ChevronDown, ChevronUp, Search, X, Code, FileText, ArrowLeft } from 'lucide-vue-next'

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
const selectedPermission = ref<string | null>(null)
const selectedFilePath = ref<string | null>(null)
const selectedLines = ref<string | null>(null)

// Get data from props.data
const permissions = computed(() => props.data?.permissions || {})
const permissionMapping = computed(() => props.data?.permission_mapping || {})
const md5 = computed(() => props.data?.md5 || '')
const appType = computed(() => props.data?.appType || '')

// Filtered permissions based on search
const filteredPermissions = computed(() => {
  if (!searchQuery.value.trim()) {
    return Object.entries(permissions.value)
  }

  const query = searchQuery.value.toLowerCase()
  return Object.entries(permissions.value).filter(([perm, desc]) => {
    return (
      perm.toLowerCase().includes(query) ||
      desc?.status?.toLowerCase().includes(query) ||
      desc?.info?.toLowerCase().includes(query) ||
      desc?.description?.toLowerCase().includes(query)
    )
  })
})

// Selected permission files
const selectedPermissionFiles = computed(() => {
  if (!selectedPermission.value || !permissionMapping.value[selectedPermission.value]) {
    return []
  }
  return Object.entries(permissionMapping.value[selectedPermission.value])
})

const getStatusBadgeClasses = (status?: string) => {
  const baseClasses = 'bg-gray-500 text-white' // Default (unknown)

  if (!status) return baseClasses

  const statusMap: Record<string, string> = {
    dangerous: 'bg-red-500 text-white',
    normal: 'bg-blue-400 text-white',
    signatureOrSystem: 'bg-amber-500 text-white',
    signature: 'bg-green-500 text-white',
  }

  return statusMap[status] || baseClasses
}

// Open files modal
const openFilesModal = (permission: string) => {
  selectedPermission.value = permission
  isFilesModalOpen.value = true
}

// Close files modal
const closeFilesModal = () => {
  isFilesModalOpen.value = false
  selectedPermission.value = null
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
  selectedPermission.value = null
  selectedFilePath.value = null
  selectedLines.value = null
}
</script>
