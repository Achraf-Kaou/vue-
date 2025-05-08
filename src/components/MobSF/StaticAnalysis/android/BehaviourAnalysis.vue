<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <Network class="w-5 h-5 mr-2 text-gray-700" />
          <span class="font-bold text-lg">BEHAVIOUR ANALYSIS</span>
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2"
            placeholder="Search behaviours..."
            v-model="searchQuery"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gray-50">
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                RULE ID
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                BEHAVIOUR
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                LABEL
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                SEVERITY
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                FILES
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredBehaviours.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500">
                No behaviors found matching "{{ searchQuery }}"
              </td>
            </tr>
            <tr v-else v-for="(item, id) in filteredBehaviours" :key="id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-700 font-medium">
                {{ id }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ item.metadata.description }}
              </td>
              <td class="px-4 py-3 text-sm">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(label, index) in item.metadata.label"
                    :key="index"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white"
                  >
                    {{ label }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="{
                    'bg-red-500 text-white': item.metadata.severity === 'critical',
                    'bg-orange-500 text-white': item.metadata.severity === 'warning',
                    'bg-blue-500 text-white': item.metadata.severity === 'info',
                  }"
                >
                  {{ item.metadata.severity }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm">
                <button
                  class="flex items-center px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  @click="openFilesModal(id, item)"
                >
                  Show Files ({{ getFileEntries(item).length }})
                </button>
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
            <FileText class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0" />
            <h3 class="text-base sm:text-lg font-medium text-gray-900 truncate">
              Files for Behaviour
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
            <p class="font-medium text-gray-700 text-sm sm:text-base">Rule ID:</p>
            <div class="flex items-center mt-1 flex-wrap">
              <span class="text-gray-900 text-sm sm:text-base truncate font-semibold">
                {{ selectedRuleId }}
              </span>
              <span
                v-if="selectedBehaviour?.metadata?.severity"
                :class="{
                  'bg-red-500 text-white': selectedBehaviour.metadata.severity === 'critical',
                  'bg-orange-500 text-white': selectedBehaviour.metadata.severity === 'warning',
                  'bg-blue-500 text-white': selectedBehaviour.metadata.severity === 'info',
                }"
                class="ml-2 px-2 py-1 rounded-md text-xs font-medium"
              >
                {{ selectedBehaviour.metadata.severity }}
              </span>
            </div>
            <p class="text-gray-600 mt-2 text-xs sm:text-sm">
              {{ selectedBehaviour?.metadata?.description || 'No description available' }}
            </p>

            <div class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="(label, index) in selectedBehaviour?.metadata?.label"
                :key="index"
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white"
              >
                {{ label }}
              </span>
            </div>
          </div>

          <div class="mt-4 sm:mt-6">
            <p class="font-medium text-gray-700 mb-2 text-sm sm:text-base">Associated Files:</p>
            <div class="bg-gray-50 border border-gray-200 rounded-md">
              <ul class="divide-y divide-gray-200">
                <li
                  v-for="(lines, filePath, index) in selectedBehaviour?.files"
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
            class="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
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
            <Code class="w-5 h-5 mr-2 text-blue-600" />
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
            <p class="font-medium text-gray-700">Rule ID:</p>
            <p class="text-gray-900 bg-gray-100 p-2 rounded mt-1">
              {{ selectedRuleId }}
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
              {{ selectedLineNumbers }}
            </p>
          </div>

          <!-- File content preview -->
          <div class="mt-6 bg-gray-50 border border-gray-200 rounded-md p-4">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-medium text-gray-700">File Content</h4>
              <div class="text-xs text-gray-500">Lines: {{ selectedLineNumbers }}</div>
            </div>
            <div class="bg-gray-900 p-4 rounded text-green-400 font-mono text-sm overflow-x-auto">
              <p class="text-gray-400">// File content would be loaded here</p>
              <p class="text-gray-400">// With syntax highlighting</p>
              <p class="mt-2">
                public class {{ selectedFilePath?.split('/').pop()?.split('.')[0] }} {
              </p>
              <p class="ml-4">
                // Methods and properties related to behaviour {{ selectedRuleId }}
              </p>
              <p class="ml-4">// Lines referenced: {{ selectedLineNumbers }}</p>
              <p class="ml-4">// You can view the full source in your code editor</p>
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
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
import { Search, Network, X, FileText, Code, ChevronRight, ArrowLeft } from 'lucide-vue-next'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const searchQuery = ref('')

// Modal states
const isFilesModalOpen = ref(false)
const isFileDetailsModalOpen = ref(false)
const selectedRuleId = ref(null)
const selectedBehaviour = ref(null)
const selectedFilePath = ref(null)
const selectedLineNumbers = ref(null)

const filteredBehaviours = computed(() => {
  if (!props.data || !props.data.behaviour) return []

  const behaviours = props.data.behaviour

  if (!searchQuery.value) return behaviours

  const query = searchQuery.value.toLowerCase()

  return Object.entries(behaviours).reduce((filtered, [id, data]) => {
    const matchesId = id.toLowerCase().includes(query)
    const matchesDescription = data.metadata?.description?.toLowerCase().includes(query) || false
    const matchesLabels =
      data.metadata?.label?.some((label) => label.toLowerCase().includes(query)) || false
    const matchesFiles = Object.keys(data.files || {}).some((file) =>
      file.toLowerCase().includes(query),
    )

    if (matchesId || matchesDescription || matchesLabels || matchesFiles) {
      filtered[id] = data
    }

    return filtered
  }, {})
})

const getFileEntries = (item) => {
  return Object.entries(item.files || {})
}

// Open files modal
const openFilesModal = (id, item) => {
  selectedRuleId.value = id
  selectedBehaviour.value = item
  isFilesModalOpen.value = true
}

// Close files modal
const closeFilesModal = () => {
  isFilesModalOpen.value = false
  selectedRuleId.value = null
  selectedBehaviour.value = null
}

// Open file details modal
const openFileDetailsModal = (filePath, lines) => {
  selectedFilePath.value = filePath
  selectedLineNumbers.value = lines
  isFilesModalOpen.value = false
  isFileDetailsModalOpen.value = true
}

// Return to files list
const returnToFilesList = () => {
  isFileDetailsModalOpen.value = false
  isFilesModalOpen.value = true
  selectedFilePath.value = null
  selectedLineNumbers.value = null
}

// Close all modals
const closeAllModals = () => {
  isFilesModalOpen.value = false
  isFileDetailsModalOpen.value = false
  selectedRuleId.value = null
  selectedBehaviour.value = null
  selectedFilePath.value = null
  selectedLineNumbers.value = null
}
</script>
<script lang="ts">
export default {
  name: 'BehaviourAnalysis',
}
</script>
