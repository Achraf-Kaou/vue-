<script setup lang="ts">
import { Shield, Info, AlertTriangle, AlertCircle, Check, X } from 'lucide-vue-next'

interface SecurityItem {
  severity: string
  description: string
}

interface DylibItem {
  name: string
  nx: SecurityItem & { has_nx: boolean }
  stack_canary: SecurityItem & { has_canary: boolean }
  arc: SecurityItem & { has_arc: boolean }
  rpath: SecurityItem & { has_rpath: boolean }
  code_signature: SecurityItem & { has_code_signature: boolean }
  encrypted: SecurityItem & { is_encrypted: boolean }
  symbol: SecurityItem & { is_stripped: boolean }
  pie?: SecurityItem & { has_pie: boolean }
}

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'warning':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'info':
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200'
  }
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'high':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    case 'info':
    default:
      return Info
  }
}

const getStatusIcon = (status: boolean) => {
  return status ? Check : X
}

const getStatusColor = (status: boolean) => {
  return status ? 'text-green-500' : 'text-red-500'
}

const getLibraryName = (path: string) => {
  return path.split('/').pop()
}

const getLibraryPath = (path: string) => {
  const parts = path.split('/')
  return parts.slice(0, parts.length - 1).join('/')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg">
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-t-lg">
      <div class="flex items-center text-white">
        <Shield class="mr-2" />
        <h2 class="text-xl font-bold">Dynamic Library & Framework Binary Analysis</h2>
      </div>
    </div>

    <div class="p-4">
      <div
        v-if="!props.data.dylib_analysis || props.data.dylib_analysis.length === 0"
        class="text-center py-8 text-gray-500"
      >
        No Dylibs/Frameworks found.
      </div>

      <div v-else>
        <div class="mb-4">
          <div
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            {{ props.data.dylib_analysis.length }} Libraries Found
          </div>
        </div>

        <div class="space-y-6">
          <div
            v-for="(lib, index) in props.data.dylib_analysis"
            :key="index"
            class="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div class="bg-gray-50 p-4 border-b border-gray-200">
              <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h3 class="font-bold text-lg text-blue-800">{{ getLibraryName(lib.name) }}</h3>
                  <p class="text-gray-500 text-sm">{{ getLibraryPath(lib.name) }}</p>
                </div>
                <button
                  class="mt-2 md:mt-0 inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  Analyze
                </button>
              </div>
            </div>

            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- NX -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">NX</span>
                    <span :class="getStatusColor(lib.nx.has_nx)">
                      <component :is="getStatusIcon(lib.nx.has_nx)" class="w-5 h-5" />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon(lib.nx.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${lib.nx.severity === 'high' ? 'red' : lib.nx.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(lib.nx.severity)}`"
                      >
                        {{ lib.nx.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ lib.nx.description }}</p>
                  </div>
                </div>

                <!-- Stack Canary -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">Stack Canary</span>
                    <span :class="getStatusColor(lib.stack_canary.has_canary)">
                      <component :is="getStatusIcon(lib.stack_canary.has_canary)" class="w-5 h-5" />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon(lib.stack_canary.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${lib.stack_canary.severity === 'high' ? 'red' : lib.stack_canary.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(lib.stack_canary.severity)}`"
                      >
                        {{ lib.stack_canary.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ lib.stack_canary.description }}</p>
                  </div>
                </div>

                <!-- ARC -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">ARC</span>
                    <span :class="getStatusColor(lib.arc.has_arc)">
                      <component :is="getStatusIcon(lib.arc.has_arc)" class="w-5 h-5" />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon(lib.arc.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${lib.arc.severity === 'high' ? 'red' : lib.arc.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(lib.arc.severity)}`"
                      >
                        {{ lib.arc.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ lib.arc.description }}</p>
                  </div>
                </div>

                <!-- RPATH -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">RPATH</span>
                    <span :class="getStatusColor(lib.rpath.has_rpath)">
                      <component :is="getStatusIcon(lib.rpath.has_rpath)" class="w-5 h-5" />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon(lib.rpath.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${lib.rpath.severity === 'high' ? 'red' : lib.rpath.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(lib.rpath.severity)}`"
                      >
                        {{ lib.rpath.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ lib.rpath.description }}</p>
                  </div>
                </div>

                <!-- Code Signature -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">Code Signature</span>
                    <span :class="getStatusColor(lib.code_signature.has_code_signature)">
                      <component
                        :is="getStatusIcon(lib.code_signature.has_code_signature)"
                        class="w-5 h-5"
                      />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon(lib.code_signature.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${lib.code_signature.severity === 'high' ? 'red' : lib.code_signature.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(lib.code_signature.severity)}`"
                      >
                        {{ lib.code_signature.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ lib.code_signature.description }}</p>
                  </div>
                </div>

                <!-- Encrypted -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">Encrypted</span>
                    <span :class="getStatusColor(lib.encrypted.is_encrypted)">
                      <component :is="getStatusIcon(lib.encrypted.is_encrypted)" class="w-5 h-5" />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon(lib.encrypted.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${lib.encrypted.severity === 'high' ? 'red' : lib.encrypted.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(lib.encrypted.severity)}`"
                      >
                        {{ lib.encrypted.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ lib.encrypted.description }}</p>
                  </div>
                </div>

                <!-- Symbols Stripped -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">Symbols Stripped</span>
                    <span :class="getStatusColor(lib.symbol.is_stripped)">
                      <component :is="getStatusIcon(lib.symbol.is_stripped)" class="w-5 h-5" />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon(lib.symbol.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${lib.symbol.severity === 'high' ? 'red' : lib.symbol.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(lib.symbol.severity)}`"
                      >
                        {{ lib.symbol.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ lib.symbol.description }}</p>
                  </div>
                </div>

                <!-- PIE (if available) -->
                <div v-if="lib.pie" class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">PIE</span>
                    <span :class="getStatusColor(lib.pie.has_pie)">
                      <component :is="getStatusIcon(lib.pie.has_pie)" class="w-5 h-5" />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon(lib.pie.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${lib.pie.severity === 'high' ? 'red' : lib.pie.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(lib.pie.severity)}`"
                      >
                        {{ lib.pie.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ lib.pie.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
