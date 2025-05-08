<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <file-search-icon class="w-5 h-5 mr-2 text-gray-700" />
          <span class="font-bold text-lg">MANIFEST ANALYSIS</span>
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <search-icon class="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2"
            placeholder="Search issues..."
            v-model="searchQuery"
          />
        </div>
      </div>

      <div v-if="manifestData.manifest_summary" class="grid grid-cols-4 gap-4 mb-6">
        <div class="border-r border-gray-200">
          <span :class="`font-medium ${getSeverityColor('high')}`">HIGH</span>
          <h5 class="text-2xl font-bold">{{ manifestData.manifest_summary.high }}</h5>
        </div>
        <div class="border-r border-gray-200">
          <span :class="`font-medium ${getSeverityColor('warning')}`">WARNING</span>
          <h5 class="text-2xl font-bold">{{ manifestData.manifest_summary.warning }}</h5>
        </div>
        <div class="border-r border-gray-200">
          <span :class="`font-medium ${getSeverityColor('info')}`">INFO</span>
          <h5 class="text-2xl font-bold">{{ manifestData.manifest_summary.info }}</h5>
        </div>
        <div>
          <span :class="`font-medium ${getSeverityColor('suppressed')}`">SUPPRESSED</span>
          <h5 class="text-2xl font-bold">{{ manifestData.manifest_summary.suppressed }}</h5>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gray-50">
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                NO
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ISSUE
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                SEVERITY
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                DESCRIPTION
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                OPTIONS
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredFindings.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500">
                No issues found matching "{{ searchQuery }}"
              </td>
            </tr>
            <tr v-for="(item, index) in filteredFindings" :key="index" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-700" v-html="item.title"></td>
              <td class="px-4 py-3 text-sm">
                <span
                  :class="`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityBadgeClass(item.severity)} text-white`"
                >
                  {{ item.severity }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ item.description }}
              </td>
              <td class="px-4 py-3 text-sm">
                <div class="relative inline-block text-left">
                  <div class="group">
                    <button
                      class="inline-flex items-center justify-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-xs"
                      @click="handleSuppress(item)"
                    >
                      suppress rule
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
  <transition name="fade">
    <div
      v-if="showConfirmModal"
      class="fixed backdrop-blur-md inset-0 z-50 flex items-center justify-center bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-lg font-bold mb-4">Confirm Suppression</h2>
        <p class="text-sm mb-6">
          Are you sure you want to suppress rule <b>{{ selectedItem?.rule }}</b> for package
          <b>{{ packageName }}</b
          >?
        </p>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400"
            @click="showConfirmModal = false"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            @click="confirmSuppression"
          >
            Suppress
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, FileSearch, EyeOff, ChevronDown } from 'lucide-vue-next'
import staticAnalyzerService from '../../../../api/StaticAnalyzer'

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

// Define interfaces for type safety
interface ManifestFinding {
  title: string
  severity: 'high' | 'warning' | 'info' | 'suppressed'
  description: string
  rule: string
  name?: string
  component?: any[]
}

interface ManifestSummary {
  high: number
  warning: number
  info: number
  suppressed: number
}

// Local state
const searchQuery = ref('')
const packageName = ref('com.example.app')
const showConfirmModal = ref(false)
const selectedItem = ref<ManifestFinding | null>(null)

// Computed property to access manifest data from props
const manifestData = computed(
  () =>
    props.data.manifest_analysis || {
      manifest_summary: { high: 0, warning: 0, info: 0, suppressed: 0 },
      manifest_findings: [],
    },
)

// Filter findings based on search query
const filteredFindings = computed(() => {
  return (
    manifestData.value.manifest_findings?.filter(
      (item: ManifestFinding) =>
        item.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.severity?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (item.rule && item.rule.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (item.name && item.name.toLowerCase().includes(searchQuery.value.toLowerCase())),
    ) || []
  )
})

// Severity styling helpers
const getSeverityBadgeClass = (severity: string): string => {
  switch (severity) {
    case 'high':
      return 'bg-red-600'
    case 'warning':
      return 'bg-yellow-500'
    case 'info':
      return 'bg-blue-500'
    case 'suppressed':
      return 'bg-gray-400'
    default:
      return 'bg-gray-500'
  }
}

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'high':
      return 'text-red-600'
    case 'warning':
      return 'text-yellow-500'
    case 'info':
      return 'text-blue-500'
    case 'suppressed':
      return 'text-gray-500'
    default:
      return 'text-gray-500'
  }
}

// Handle rule suppression
const handleSuppress = (item: ManifestFinding): void => {
  selectedItem.value = item
  showConfirmModal.value = true
}

const confirmSuppression = async () => {
  if (!selectedItem.value) return

  try {
    const fileHash = props.data.file_hash
    const appType = props.data.app_type
    const rule = selectedItem.value.rule

    await staticAnalyzerService.suppressByRule(fileHash, appType, rule)

    // Optionally: remove from list locally
    manifestData.value.manifest_findings = manifestData.value.manifest_findings.filter(
      (item: ManifestFinding) => item.rule !== rule,
    )

    showConfirmModal.value = false
    selectedItem.value = null
  } catch (error) {
    console.error('Suppression failed:', error)
  }
}
</script>
