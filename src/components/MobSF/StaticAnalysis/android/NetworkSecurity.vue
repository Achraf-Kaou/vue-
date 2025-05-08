<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <LockIcon class="w-5 h-5 mr-2 text-gray-700" />
          <span class="font-bold text-lg">NETWORK SECURITY</span>
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon class="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2"
            placeholder="Search findings..."
            v-model="searchQuery"
          />
        </div>
      </div>

      <div v-if="data.network_security.network_summary" class="grid grid-cols-4 gap-4 mb-6">
        <div class="border-r border-gray-200">
          <span :class="`font-medium ${getSeverityColor('high')}`">HIGH</span>
          <h5 class="text-2xl font-bold">{{ data.network_security.network_summary.high }}</h5>
        </div>
        <div class="border-r border-gray-200">
          <span :class="`font-medium ${getSeverityColor('warning')}`">WARNING</span>
          <h5 class="text-2xl font-bold">{{ data.network_security.network_summary.warning }}</h5>
        </div>
        <div class="border-r border-gray-200">
          <span :class="`font-medium ${getSeverityColor('info')}`">INFO</span>
          <h5 class="text-2xl font-bold">{{ data.network_security.network_summary.info }}</h5>
        </div>
        <div>
          <span :class="`font-medium ${getSeverityColor('secure')}`">SECURE</span>
          <h5 class="text-2xl font-bold">{{ data.network_security.network_summary.secure }}</h5>
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
                SCOPE
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
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredFindings.length === 0">
              <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                No findings found matching "{{ searchQuery }}"
              </td>
            </tr>
            <tr v-for="(item, index) in filteredFindings" :key="index" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                <div v-for="(url, urlIndex) in item.scope" :key="urlIndex">{{ url }}</div>
              </td>
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search as SearchIcon, Lock as LockIcon } from 'lucide-vue-next'

interface NetworkFinding {
  scope: string[]
  severity: 'high' | 'warning' | 'info' | 'secure'
  description: string
}

interface NetworkSummary {
  high: number
  warning: number
  info: number
  secure: number
}

interface NetworkSecurityData {
  network_security: {
    network_summary: NetworkSummary
    network_findings: NetworkFinding[]
  }
}

const props = defineProps<{
  data: NetworkSecurityData
}>()

const searchQuery = ref('')

const filteredFindings = computed(() => {
  return props.data.network_security.network_findings.filter(
    (item) =>
      item.scope.some((url) => url.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.severity.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const getSeverityBadgeClass = (severity: string): string => {
  switch (severity) {
    case 'high':
      return 'bg-red-600'
    case 'warning':
      return 'bg-yellow-500'
    case 'info':
      return 'bg-blue-500'
    case 'secure':
      return 'bg-green-600'
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
    case 'secure':
      return 'text-green-600'
    default:
      return 'text-gray-500'
  }
}
</script>
