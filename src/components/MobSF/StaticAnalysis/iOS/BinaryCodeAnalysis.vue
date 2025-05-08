<script setup lang="ts">
import { Code, AlertTriangle, AlertCircle, Info, Check, EyeOff, ChevronDown } from 'lucide-vue-next'
import { ref } from 'vue'

interface BinaryFindingDetails {
  severity: 'high' | 'warning' | 'info' | 'good'
  cvss?: number
  cwe?: string
  'owasp-mobile'?: string
  masvs?: string
  detailed_desc: string
}

interface BinarySummary {
  high: number
  warning: number
  info: number
  secure: number
  suppressed: number
}

interface BinaryAnalysis {
  summary?: BinarySummary
  findings?: Record<string, BinaryFindingDetails>
}

interface Props {
  data: {
    binary_analysis?: BinaryAnalysis
    app_type?: string
    bundle_id?: string
  }
}

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const dropdownOpen = ref<Record<number, boolean>>({})

const toggleDropdown = (index: number) => {
  dropdownOpen.value = {
    ...dropdownOpen.value,
    [index]: !dropdownOpen.value[index],
  }
}

// Helper function to get the appropriate icon based on severity
const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'high':
      return AlertTriangle
    case 'warning':
      return AlertCircle
    case 'info':
      return Info
    case 'good':
      return Check
    default:
      return Info
  }
}

// Helper function to get the severity color for text and background
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return {
        text: 'text-red-600',
        bg: 'bg-red-100',
        badge: 'bg-red-500',
      }
    case 'warning':
      return {
        text: 'text-amber-600',
        bg: 'bg-amber-100',
        badge: 'bg-amber-500',
      }
    case 'info':
      return {
        text: 'text-blue-600',
        bg: 'bg-blue-100',
        badge: 'bg-blue-500',
      }
    case 'good':
      return {
        text: 'text-green-600',
        bg: 'bg-green-100',
        badge: 'bg-green-500',
      }
    default:
      return {
        text: 'text-gray-600',
        bg: 'bg-gray-100',
        badge: 'bg-gray-500',
      }
  }
}

// Helper function to get CVSS severity
const getCvssSeverity = (cvss: number) => {
  if (cvss > 6) return { text: 'high', color: 'text-red-600' }
  if (cvss >= 4) return { text: 'medium', color: 'text-amber-600' }
  if (cvss < 4 && cvss > 0) return { text: 'low', color: 'text-blue-600' }
  return { text: 'info', color: 'text-gray-600' }
}

// Function to suppress a rule (this is just a placeholder)
const suppressRule = (issue: string, bundleId: string) => {
  console.log(`Suppressing rule ${issue} for ${bundleId}`)
  // In a real application, this would call an API to suppress the rule
  alert(`Rule ${issue} would be suppressed for ${bundleId}`)
}
</script>
<script lang="ts">
export default {
  name: 'BinaryCodeAnalysis',
}
</script>

<template>
  <div class="w-full">
    <a id="binary_code_analysis" class="anchor"></a>
    <section class="py-4">
      <div class="w-full">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div class="p-6">
            <div
              class="flex items-center space-x-2 font-semibold text-gray-900 dark:text-white mb-6"
            >
              <Code class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span class="uppercase tracking-wider">
                <template v-if="props.data.app_type && !props.data.app_type.includes('Dylib,A')"
                  >IPA
                </template>
                BINARY CODE ANALYSIS
              </span>
            </div>

            <!-- Stats Summary -->
            <div
              v-if="props.data.binary_analysis?.summary"
              class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
            >
              <!-- High -->
              <div class="flex flex-col items-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                <span class="text-red-600 dark:text-red-400 font-medium">HIGH</span>
                <h5 class="text-2xl font-bold mt-1">
                  {{ props.data.binary_analysis.summary.high }}
                </h5>
              </div>

              <!-- Warning -->
              <div
                class="flex flex-col items-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20"
              >
                <span class="text-amber-600 dark:text-amber-400 font-medium">WARNING</span>
                <h5 class="text-2xl font-bold mt-1">
                  {{ props.data.binary_analysis.summary.warning }}
                </h5>
              </div>

              <!-- Info -->
              <div class="flex flex-col items-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <span class="text-blue-600 dark:text-blue-400 font-medium">INFO</span>
                <h5 class="text-2xl font-bold mt-1">
                  {{ props.data.binary_analysis.summary.info }}
                </h5>
              </div>

              <!-- Secure -->
              <div
                class="flex flex-col items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20"
              >
                <span class="text-green-600 dark:text-green-400 font-medium">SECURE</span>
                <h5 class="text-2xl font-bold mt-1">
                  {{ props.data.binary_analysis.summary.secure }}
                </h5>
              </div>

              <!-- Suppressed -->
              <div class="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/20">
                <span class="text-gray-600 dark:text-gray-400 font-medium">SUPPRESSED</span>
                <h5 class="text-2xl font-bold mt-1">
                  {{ props.data.binary_analysis.summary.suppressed }}
                </h5>
              </div>
            </div>

            <!-- Findings Table -->
            <div class="overflow-x-auto">
              <table id="table_code" class="w-full border-collapse table-auto">
                <thead>
                  <tr class="bg-gray-100 dark:bg-gray-700">
                    <th
                      class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left w-12"
                    >
                      NO
                    </th>
                    <th class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left">
                      ISSUE
                    </th>
                    <th
                      class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left w-24"
                    >
                      SEVERITY
                    </th>
                    <th
                      class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left w-48"
                    >
                      STANDARDS
                    </th>
                    <th class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left">
                      DESCRIPTION
                    </th>
                    <th
                      class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left w-24"
                    >
                      OPTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template
                    v-if="
                      props.data.binary_analysis?.findings &&
                      Object.keys(props.data.binary_analysis.findings).length > 0
                    "
                  >
                    <tr
                      v-for="(details, issue, index) in props.data.binary_analysis.findings"
                      :key="issue"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                    >
                      <td
                        class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-center font-mono"
                      >
                        {{ index + 1 }}
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3 font-medium">
                        {{ issue }}
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center justify-center">
                          <span
                            :class="`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(details.severity).badge}`"
                          >
                            <component
                              :is="getSeverityIcon(details.severity)"
                              class="w-3 h-3 mr-1"
                            />
                            {{ details.severity === 'good' ? 'secure' : details.severity }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm">
                        <div v-if="details.cvss" class="mb-1">
                          <strong>CVSS V2:</strong>
                          {{ details.cvss }}
                          <span :class="`ml-1 ${getCvssSeverity(details.cvss).color}`">
                            ({{ getCvssSeverity(details.cvss).text }})
                          </span>
                        </div>
                        <div v-if="details.cwe" class="mb-1">
                          <strong>CWE:</strong> {{ details.cwe }}
                        </div>
                        <div v-if="details['owasp-mobile']" class="mb-1">
                          <strong>OWASP Top 10:</strong> {{ details['owasp-mobile'] }}
                        </div>
                        <div v-if="details.masvs">
                          <strong>OWASP MASVS:</strong> {{ details.masvs }}
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="whitespace-pre-wrap">{{ details.detailed_desc }}</div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="relative">
                          <button
                            @click="toggleDropdown(index)"
                            class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                          >
                            <EyeOff class="w-4 h-4 mr-2" />
                            <ChevronDown class="w-4 h-4" />
                          </button>
                          <div
                            v-if="dropdownOpen[index]"
                            class="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-600 focus:outline-none z-10"
                          >
                            <div class="py-1">
                              <a
                                @click="suppressRule(issue, props.data.bundle_id || '')"
                                class="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                              >
                                Suppress the rule <strong class="mx-1">{{ issue }}</strong> in
                                <strong class="ml-1">{{ props.data.bundle_id }}</strong>
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                  <tr v-else class="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td
                      colspan="6"
                      class="border border-gray-200 dark:border-gray-600 px-4 py-4 text-center text-gray-500"
                    >
                      <div class="flex items-center justify-center space-x-2">
                        <Info class="w-5 h-5" />
                        <span>No binary code analysis findings available.</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
