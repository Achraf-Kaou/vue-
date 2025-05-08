<script setup lang="ts">
import { AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-vue-next'

// Define the props with TypeScript types
interface CertificateSummary {
  high: number
  warning: number
  info: number
}

interface CertificateAnalysis {
  certificate_findings?: Array<[string, string, string]>
  certificate_summary?: CertificateSummary
  certificate_info?: string
}

interface Props {
  data: {
    certificate_analysis: CertificateAnalysis
  }
}

const props = defineProps<Props>()
// Helper function to get the appropriate icon component based on severity
const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'high':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    case 'info':
      return Info
    case 'secure':
      return CheckCircle
    default:
      return Info
  }
}

// Helper function to get the appropriate color based on severity
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    case 'info':
      return 'text-blue-500'
    case 'secure':
      return 'text-green-500'
    default:
      return 'text-gray-500'
  }
}

// Helper function to get the appropriate background color based on severity
const getSeverityBgColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'info':
      return 'bg-blue-100 text-blue-800'
    case 'secure':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
  <section class="px-4 py-6">
    <div class="w-full bg-white rounded-lg shadow-md">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4 flex items-center">
          <AlertCircle class="mr-2" size="20" />
          CERTIFICATE ANALYSIS
        </h2>

        <div
          v-if="props.data.certificate_analysis?.certificate_summary"
          class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          <!-- High Issues -->
          <div class="flex flex-col items-center p-4 border-r border-gray-200">
            <span class="text-red-500 font-medium">HIGH</span>
            <h5 class="text-2xl font-bold">
              {{ props.data.certificate_analysis.certificate_summary.high }}
            </h5>
          </div>

          <!-- Warning Issues -->
          <div class="flex flex-col items-center p-4 border-r border-gray-200">
            <span class="text-yellow-500 font-medium">WARNING</span>
            <h5 class="text-2xl font-bold">
              {{ props.data.certificate_analysis.certificate_summary.warning }}
            </h5>
          </div>

          <!-- Info Issues -->
          <div class="flex flex-col items-center p-4">
            <span class="text-blue-500 font-medium">INFO</span>
            <h5 class="text-2xl font-bold">
              {{ props.data.certificate_analysis.certificate_summary.info }}
            </h5>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  TITLE
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SEVERITY
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  DESCRIPTION
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(finding, index) in props.data.certificate_analysis?.certificate_findings"
                :key="index"
              >
                <td class="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                  {{ finding[2] }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getSeverityBgColor(finding[0])"
                  >
                    <component
                      :is="getSeverityIcon(finding[0])"
                      class="mr-1"
                      :class="getSeverityColor(finding[0])"
                      size="14"
                    />
                    {{ finding[0] }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-normal text-sm text-gray-500">
                  {{ finding[1] }}
                </td>
              </tr>

              <!-- Empty state when no findings -->
              <tr
                v-if="
                  !props.data.certificate_analysis?.certificate_findings ||
                  props.data.certificate_analysis.certificate_findings.length === 0
                "
              >
                <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
                  No certificate findings available
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Certificate Info Section -->
        <div v-if="props.data.certificate_analysis?.certificate_info" class="mt-6">
          <h3 class="font-medium text-gray-700 mb-2">Certificate Details:</h3>
          <pre class="bg-gray-50 p-4 rounded text-xs overflow-x-auto whitespace-pre-wrap">{{
            props.data.certificate_analysis.certificate_info
          }}</pre>
        </div>
      </div>
    </div>
  </section>
</template>
