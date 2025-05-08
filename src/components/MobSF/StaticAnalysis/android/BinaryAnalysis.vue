<script setup lang="ts">
import { Flag, Search, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-vue-next'

// Define interfaces for TypeScript types
interface SecurityFeature {
  severity: 'high' | 'warning' | 'info'
  description: string
}

interface NxFeature extends SecurityFeature {
  is_nx: string
}

interface PieFeature extends SecurityFeature {
  is_pie: string
}

interface StackCanaryFeature extends SecurityFeature {
  has_canary: string
}

interface RelroFeature extends SecurityFeature {
  relro: string
}

interface RpathFeature extends SecurityFeature {
  rpath: string
}

interface RunpathFeature extends SecurityFeature {
  runpath: string
}

interface FortifyFeature extends SecurityFeature {
  is_fortified: string
}

interface SymbolFeature extends SecurityFeature {
  is_stripped: string
}

interface SharedObject {
  name: string
  nx: NxFeature
  pie: PieFeature
  stack_canary: StackCanaryFeature
  relocation_readonly: RelroFeature
  rpath: RpathFeature
  runpath: RunpathFeature
  fortify: FortifyFeature
  symbol: SymbolFeature
}

interface BinaryAnalysisData {
  binary_analysis: SharedObject[]
  app_type?: string
  md5?: string
}

interface Props {
  data: BinaryAnalysisData
}

const props = defineProps<Props>()

// Helper function to get severity color classes
const getSeverityBgColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'info':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Helper function to get severity icon
const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'high':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    case 'info':
      return CheckCircle
    default:
      return CheckCircle
  }
}

// Helper function to get the path relative to the root
const getRelativePath = (path: string) => {
  // Simple implementation - in a real app, this might be more complex
  return path.split('/').pop() || path
}
</script>

<template>
  <section class="px-4 py-6">
    <div class="w-full bg-white rounded-lg shadow-md">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4 flex items-center">
          <Flag class="mr-2" size="20" />
          SHARED LIBRARY BINARY ANALYSIS
        </h2>

        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-if="props.data.app_type !== 'so'"
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  NO
                </th>
                <th
                  v-if="props.data.app_type !== 'so'"
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SHARED OBJECT
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  NX
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  PIE
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  STACK CANARY
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  RELRO
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  RPATH
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  RUNPATH
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  FORTIFY
                </th>
                <th
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SYMBOLS STRIPPED
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-if="props.data.binary_analysis && props.data.binary_analysis.length > 0">
                <tr v-for="(so, index) in props.data.binary_analysis" :key="index">
                  <td
                    v-if="props.data.app_type !== 'so'"
                    class="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ index + 1 }}
                  </td>
                  <td
                    v-if="props.data.app_type !== 'so'"
                    class="px-3 py-4 whitespace-normal text-sm font-medium text-gray-900"
                  >
                    {{ getRelativePath(so.name) }}
                    <br />
                    <button
                      class="inline-flex items-center px-2 py-1 mt-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Search class="mr-1" size="12" />
                      Analyze
                    </button>
                  </td>

                  <!-- NX -->
                  <td class="px-3 py-4 whitespace-normal text-sm">
                    <div class="font-bold">{{ so.nx.is_nx }}</div>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium"
                      :class="getSeverityBgColor(so.nx.severity)"
                    >
                      <component :is="getSeverityIcon(so.nx.severity)" class="mr-1" size="12" />
                      {{ so.nx.severity }}
                    </span>
                    <div class="mt-1 text-xs text-gray-500">{{ so.nx.description }}</div>
                  </td>

                  <!-- PIE -->
                  <td class="px-3 py-4 whitespace-normal text-sm">
                    <div class="font-bold">{{ so.pie.is_pie }}</div>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium"
                      :class="getSeverityBgColor(so.pie.severity)"
                    >
                      <component :is="getSeverityIcon(so.pie.severity)" class="mr-1" size="12" />
                      {{ so.pie.severity }}
                    </span>
                    <div class="mt-1 text-xs text-gray-500">{{ so.pie.description }}</div>
                  </td>

                  <!-- Stack Canary -->
                  <td class="px-3 py-4 whitespace-normal text-sm">
                    <div class="font-bold">{{ so.stack_canary.has_canary }}</div>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium"
                      :class="getSeverityBgColor(so.stack_canary.severity)"
                    >
                      <component
                        :is="getSeverityIcon(so.stack_canary.severity)"
                        class="mr-1"
                        size="12"
                      />
                      {{ so.stack_canary.severity }}
                    </span>
                    <div class="mt-1 text-xs text-gray-500">{{ so.stack_canary.description }}</div>
                  </td>

                  <!-- RELRO -->
                  <td class="px-3 py-4 whitespace-normal text-sm">
                    <div class="font-bold">{{ so.relocation_readonly.relro }}</div>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium"
                      :class="getSeverityBgColor(so.relocation_readonly.severity)"
                    >
                      <component
                        :is="getSeverityIcon(so.relocation_readonly.severity)"
                        class="mr-1"
                        size="12"
                      />
                      {{ so.relocation_readonly.severity }}
                    </span>
                    <div class="mt-1 text-xs text-gray-500">
                      {{ so.relocation_readonly.description }}
                    </div>
                  </td>

                  <!-- RPATH -->
                  <td class="px-3 py-4 whitespace-normal text-sm">
                    <div class="font-bold">{{ so.rpath.rpath }}</div>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium"
                      :class="getSeverityBgColor(so.rpath.severity)"
                    >
                      <component :is="getSeverityIcon(so.rpath.severity)" class="mr-1" size="12" />
                      {{ so.rpath.severity }}
                    </span>
                    <div class="mt-1 text-xs text-gray-500">{{ so.rpath.description }}</div>
                  </td>

                  <!-- RUNPATH -->
                  <td class="px-3 py-4 whitespace-normal text-sm">
                    <div class="font-bold">{{ so.runpath.runpath }}</div>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium"
                      :class="getSeverityBgColor(so.runpath.severity)"
                    >
                      <component
                        :is="getSeverityIcon(so.runpath.severity)"
                        class="mr-1"
                        size="12"
                      />
                      {{ so.runpath.severity }}
                    </span>
                    <div class="mt-1 text-xs text-gray-500">{{ so.runpath.description }}</div>
                  </td>

                  <!-- FORTIFY -->
                  <td class="px-3 py-4 whitespace-normal text-sm">
                    <div class="font-bold">{{ so.fortify.is_fortified }}</div>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium"
                      :class="getSeverityBgColor(so.fortify.severity)"
                    >
                      <component
                        :is="getSeverityIcon(so.fortify.severity)"
                        class="mr-1"
                        size="12"
                      />
                      {{ so.fortify.severity }}
                    </span>
                    <div class="mt-1 text-xs text-gray-500">{{ so.fortify.description }}</div>
                  </td>

                  <!-- SYMBOLS STRIPPED -->
                  <td class="px-3 py-4 whitespace-normal text-sm">
                    <div class="font-bold">{{ so.symbol.is_stripped }}</div>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium"
                      :class="getSeverityBgColor(so.symbol.severity)"
                    >
                      <component :is="getSeverityIcon(so.symbol.severity)" class="mr-1" size="12" />
                      {{ so.symbol.severity }}
                    </span>
                    <div class="mt-1 text-xs text-gray-500">{{ so.symbol.description }}</div>
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td
                  :colspan="props.data.app_type !== 'so' ? 10 : 8"
                  class="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No Shared Objects found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>
