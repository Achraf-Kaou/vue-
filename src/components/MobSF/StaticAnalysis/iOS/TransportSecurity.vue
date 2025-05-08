<script setup lang="ts">
import { Shield, AlertTriangle, AlertCircle, Info, Check } from 'lucide-vue-next'

interface ATSFinding {
  issue: string
  severity: 'high' | 'warning' | 'info' | 'secure'
  description: string
}

interface ATSSummary {
  high: number
  warning: number
  info: number
  secure: number
}

interface ATSAnalysis {
  ats_summary?: ATSSummary
  ats_findings?: ATSFinding[]
}

interface Props {
  data: {
    ats_analysis?: ATSAnalysis
  }
}

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

// Helper function to get the appropriate icon based on severity
const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'high':
      return AlertTriangle
    case 'warning':
      return AlertCircle
    case 'info':
      return Info
    case 'secure':
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
    case 'secure':
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
</script>

<template>
  <div class="w-full">
    <a id="transport_security" class="anchor"></a>
    <section class="py-4">
      <div class="w-full">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div class="p-6">
            <div
              class="flex items-center space-x-2 font-semibold text-gray-900 dark:text-white mb-6"
            >
              <Shield class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span class="uppercase tracking-wider">App Transport Security (ATS)</span>
            </div>

            <!-- Stats Summary -->
            <div
              v-if="props.data.ats_analysis?.ats_summary"
              class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
            >
              <!-- High -->
              <div class="flex flex-col items-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                <span class="text-red-600 dark:text-red-400 font-medium">HIGH</span>
                <h5 class="text-2xl font-bold mt-1">
                  {{ props.data.ats_analysis.ats_summary.high }}
                </h5>
              </div>

              <!-- Warning -->
              <div
                class="flex flex-col items-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20"
              >
                <span class="text-amber-600 dark:text-amber-400 font-medium">WARNING</span>
                <h5 class="text-2xl font-bold mt-1">
                  {{ props.data.ats_analysis.ats_summary.warning }}
                </h5>
              </div>

              <!-- Info -->
              <div class="flex flex-col items-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <span class="text-blue-600 dark:text-blue-400 font-medium">INFO</span>
                <h5 class="text-2xl font-bold mt-1">
                  {{ props.data.ats_analysis.ats_summary.info }}
                </h5>
              </div>

              <!-- Secure -->
              <div
                class="flex flex-col items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20"
              >
                <span class="text-green-600 dark:text-green-400 font-medium">SECURE</span>
                <h5 class="text-2xl font-bold mt-1">
                  {{ props.data.ats_analysis.ats_summary.secure }}
                </h5>
              </div>
            </div>

            <!-- Findings Table -->
            <div class="overflow-x-auto">
              <table class="w-full border-collapse table-auto">
                <thead>
                  <tr class="bg-gray-100 dark:bg-gray-700">
                    <th
                      class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left w-16"
                    >
                      NO
                    </th>
                    <th class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left">
                      ISSUE
                    </th>
                    <th
                      class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left w-28"
                    >
                      SEVERITY
                    </th>
                    <th class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left">
                      DESCRIPTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template
                    v-if="
                      props.data.ats_analysis?.ats_findings &&
                      props.data.ats_analysis.ats_findings.length > 0
                    "
                  >
                    <tr
                      v-for="(finding, index) in props.data.ats_analysis.ats_findings"
                      :key="index"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                    >
                      <td
                        class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-center font-mono"
                      >
                        {{ index + 1 }}
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        {{ finding.issue }}
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center justify-center">
                          <span
                            :class="`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(finding.severity).badge}`"
                          >
                            <component
                              :is="getSeverityIcon(finding.severity)"
                              class="w-3 h-3 mr-1"
                            />
                            {{ finding.severity }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="whitespace-pre-wrap">{{ finding.description }}</div>
                      </td>
                    </tr>
                  </template>
                  <tr v-else class="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td
                      colspan="4"
                      class="border border-gray-200 dark:border-gray-600 px-4 py-4 text-center text-gray-500"
                    >
                      <div class="flex items-center justify-center space-x-2">
                        <Info class="w-5 h-5" />
                        <span>No ATS findings available.</span>
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
