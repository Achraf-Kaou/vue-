<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <Code class="w-5 h-5 mr-2 text-gray-700" />
          <span class="font-bold text-lg">CODE ANALYSIS</span>
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2"
            placeholder="Search findings..."
            v-model="searchQuery"
          />
        </div>
      </div>

      <div v-if="summary" class="grid grid-cols-5 gap-4 mb-6">
        <div class="border-r border-gray-200">
          <span :class="`font-medium ${getSeverityColor('high')}`">HIGH</span>
          <h5 class="text-2xl font-bold">{{ summary.high }}</h5>
        </div>
        <div class="border-r border-gray-200">
          <span :class="`font-medium ${getSeverityColor('warning')}`">WARNING</span>
          <h5 class="text-2xl font-bold">{{ summary.warning }}</h5>
        </div>
        <div class="border-r border-gray-200">
          <span :class="`font-medium ${getSeverityColor('info')}`">INFO</span>
          <h5 class="text-2xl font-bold">{{ summary.info }}</h5>
        </div>
        <div class="border-r border-gray-200">
          <span :class="`font-medium ${getSeverityColor('good')}`">SECURE</span>
          <h5 class="text-2xl font-bold">{{ summary.secure }}</h5>
        </div>
        <div>
          <span class="font-medium text-gray-500">SUPPRESSED</span>
          <h5 class="text-2xl font-bold">{{ summary.suppressed }}</h5>
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
                STANDARDS
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                FILES
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
              <td colspan="6" class="px-4 py-6 text-center text-gray-500">
                No findings found matching "{{ searchQuery }}"
              </td>
            </tr>
            <tr v-for="(item, index) in filteredFindings" :key="index" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ getDescription(item.rule) }}
              </td>
              <td class="px-4 py-3 text-sm">
                <span
                  :class="`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityBadgeClass(getSeverity(item))} text-white`"
                >
                  {{ getSeverityLabel(getSeverity(item)) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                <div v-if="item.metadata?.cvss > 0">
                  <strong>CVSS V2:</strong> {{ item.metadata.cvss }}
                  {{
                    item.metadata.cvss > 6
                      ? '(high)'
                      : item.metadata.cvss >= 4
                        ? '(medium)'
                        : item.metadata.cvss === 0
                          ? '(info)'
                          : '(low)'
                  }}
                </div>
                <div v-if="item.metadata?.cwe"><strong>CWE:</strong> {{ item.metadata.cwe }}</div>
                <div v-if="item.metadata?.['owasp-mobile']">
                  <strong>OWASP:</strong> {{ item.metadata['owasp-mobile'] }}
                </div>
                <div v-if="item.metadata?.masvs">
                  <strong>MASVS:</strong> {{ item.metadata.masvs }}
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                <template v-if="Object.keys(item.files || {}).length < 4">
                  <div
                    v-for="(lineNumbers, fileName) in item.files"
                    :key="fileName"
                    class="text-blue-600 hover:underline cursor-pointer"
                  >
                    {{ fileName }} ({{ lineNumbers }})
                  </div>
                </template>
                <div v-else>
                  <button
                    class="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                    @click="toggleShowFiles(index)"
                  >
                    {{ showFilesMap[index] ? 'Hide Files' : 'Show Files' }}
                  </button>
                  <div v-if="showFilesMap[index]">
                    <div
                      v-for="(lineNumbers, fileName) in item.files"
                      :key="fileName"
                      class="text-blue-600 hover:underline cursor-pointer mt-1"
                    >
                      {{ fileName }} ({{ lineNumbers }})
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm">
                <div class="relative inline-block text-left">
                  <button
                    class="bg-gray-200 text-gray-700 px-2 py-1 rounded flex items-center"
                    @click="openSuppressModal(item.rule)"
                  >
                    <EyeOff class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Suppress Modal -->
    <div
      v-if="showSuppressModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">Confirm Suppression</h3>
        <p class="mb-4">
          Are you sure you want to suppress all findings for rule:
          <span class="font-bold">{{ selectedRule }}</span
          >?
        </p>
        <div class="flex justify-end gap-2">
          <button class="px-4 py-2 bg-gray-200 rounded-lg" @click="showSuppressModal = false">
            Cancel
          </button>
          <button class="px-4 py-2 bg-red-600 text-white rounded-lg" @click="confirmSuppress">
            Suppress
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Code, EyeOff } from 'lucide-vue-next'
import staticAnalyzerService from '../../../../api/StaticAnalyzer'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

// State
const searchQuery = ref('')
const showSuppressModal = ref(false)
const selectedRule = ref('')
const showFilesMap = ref({})

// Computed properties
const codeAnalysis = computed(() => props.data.code_analysis || {})
const summary = computed(() => codeAnalysis.value.summary || {})

const findings = computed(() => {
  const result = []
  const findings = codeAnalysis.value.findings || {}

  for (const rule in findings) {
    if (Object.prototype.hasOwnProperty.call(findings, rule)) {
      const finding = findings[rule]
      result.push({
        rule,
        ...finding,
      })
    }
  }

  return result
})

const filteredFindings = computed(() => {
  return findings.value.filter((item) => {
    const description = getDescription(item.rule).toLowerCase()
    const severity = getSeverity(item).toLowerCase()
    const rule = item.rule.toLowerCase()
    const files = Object.keys(item.files || {})
      .join(' ')
      .toLowerCase()

    const query = searchQuery.value.toLowerCase()

    return (
      description.includes(query) ||
      severity.includes(query) ||
      rule.includes(query) ||
      files.includes(query)
    )
  })
})

// Methods
function getSeverityBadgeClass(severity) {
  switch (severity) {
    case 'high':
      return 'bg-red-600'
    case 'warning':
      return 'bg-yellow-500'
    case 'info':
      return 'bg-blue-500'
    case 'good':
      return 'bg-green-600'
    default:
      return 'bg-gray-500'
  }
}

function getSeverityColor(severity) {
  switch (severity) {
    case 'high':
      return 'text-red-600'
    case 'warning':
      return 'text-yellow-500'
    case 'info':
      return 'text-blue-500'
    case 'good':
      return 'text-green-600'
    default:
      return 'text-gray-500'
  }
}

function getSeverityLabel(severity) {
  if (severity === 'good') return 'SECURE'
  return severity.toUpperCase()
}

// Get severity based on CVSS score or default to info
function getSeverity(item) {
  if (!item || !item.metadata) return 'info'

  const cvss = item.metadata.cvss
  if (cvss > 6) return 'high'
  if (cvss >= 4) return 'warning'
  if (cvss === 0) return 'good'
  return 'info'
}

// Get a readable description from the rule name
function getDescription(rule) {
  if (!rule) return ''

  // Convert from snake_case to readable text
  return rule
    .replace(/android_/g, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

function toggleShowFiles(index) {
  showFilesMap.value = {
    ...showFilesMap.value,
    [index]: !showFilesMap.value[index],
  }
}

function openSuppressModal(rule) {
  selectedRule.value = rule
  showSuppressModal.value = true
}

async function confirmSuppress() {
  try {
    const fileHash = props.data.file_hash || ''
    const appType = props.data.app_type || ''

    await staticAnalyzerService.suppressByRule(fileHash, appType, selectedRule.value)

    // Close modal and optionally refresh the data
    showSuppressModal.value = false

    // Emit an event to notify parent about the suppression
    // If you need this functionality, add an emit definition
  } catch (error) {
    console.error('Error suppressing rule:', error)
  }
}

// Initialize the component
onMounted(() => {
  // Any initialization logic if needed
})
</script>
