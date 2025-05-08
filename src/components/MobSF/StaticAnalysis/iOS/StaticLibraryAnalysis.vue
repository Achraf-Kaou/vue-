<script setup lang="ts">
import { Shield, Info, AlertTriangle, AlertCircle, Check, X } from 'lucide-vue-next'

interface SecurityItem {
  severity: string
  description: string
}

// MachO Binary Item
interface MachOBinaryItem {
  name: string
  nx: SecurityItem & { has_nx: boolean }
  stack_canary: SecurityItem & { has_canary: boolean }
  arc: SecurityItem & { has_arc: boolean }
  rpath: SecurityItem & { has_rpath: boolean }
  symbol: SecurityItem & { is_stripped: boolean }
}

// ELF Binary Item
interface ELFBinaryItem {
  name: string
  nx: SecurityItem & { is_nx: boolean }
  stack_canary: SecurityItem & { has_canary: boolean }
  rpath: SecurityItem & { rpath: string }
  runpath: SecurityItem & { runpath: string }
  fortify: SecurityItem & { is_fortified: boolean }
  symbol: SecurityItem & { is_stripped: boolean }
}

interface Props {
  data: {
    dylib_analysis: Array<MachOBinaryItem | ELFBinaryItem>
    binary_info: {
      arch: string
    }
  }
}

const props = defineProps<Props>()

const isMachO = () => props.data.binary_info?.arch === 'MachO'

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

const getStatusIcon = (status: boolean | string) => {
  if (typeof status === 'boolean') {
    return status ? Check : X
  }
  // For cases like rpath/runpath where the value is a string
  return status && status !== 'False' ? Check : X
}

const getStatusColor = (status: boolean | string) => {
  if (typeof status === 'boolean') {
    return status ? 'text-green-500' : 'text-red-500'
  }
  // For cases like rpath/runpath where the value is a string
  return status && status !== 'False' ? 'text-green-500' : 'text-red-500'
}

const getLibraryName = (path: string) => {
  return path.split('/').pop() || path
}

const getLibraryPath = (path: string) => {
  const parts = path.split('/')
  return parts.length > 1 ? parts.slice(0, parts.length - 1).join('/') : ''
}

const hasPath = (path: string) => {
  return path.includes('/')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg">
    <div class="bg-gradient-to-r from-purple-600 to-purple-800 p-4 rounded-t-lg">
      <div class="flex items-center text-white">
        <Shield class="mr-2" />
        <h2 class="text-xl font-bold">Static Library Binary Analysis</h2>
      </div>
    </div>

    <div class="p-4">
      <div
        v-if="!props.data.dylib_analysis || props.data.dylib_analysis.length === 0"
        class="text-center py-8 text-gray-500"
      >
        No Static Objects found.
      </div>

      <div v-else>
        <div class="mb-4">
          <div
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
          >
            {{ props.data.dylib_analysis.length }} Static
            {{ isMachO() ? 'Objects' : 'Shared Objects' }} Found
          </div>
          <div
            class="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
          >
            Architecture: {{ props.data.binary_info?.arch || 'Unknown' }}
          </div>
        </div>

        <!-- MachO Static Objects -->
        <div v-if="isMachO()" class="space-y-6">
          <div
            v-for="(lib, index) in props.data.dylib_analysis"
            :key="index"
            class="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div class="bg-gray-50 p-4 border-b border-gray-200">
              <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h3 class="font-bold text-lg text-purple-800">
                    {{ hasPath(lib.name) ? getLibraryName(lib.name) : lib.name }}
                  </h3>
                  <p v-if="hasPath(lib.name)" class="text-gray-500 text-sm">
                    {{ getLibraryPath(lib.name) }}
                  </p>
                </div>
                <div class="mt-2 md:mt-0 text-sm text-gray-500">#{{ index + 1 }}</div>
              </div>
            </div>

            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- NX -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">NX</span>
                    <span :class="getStatusColor((lib as MachOBinaryItem).nx.has_nx)">
                      <component
                        :is="getStatusIcon((lib as MachOBinaryItem).nx.has_nx)"
                        class="w-5 h-5"
                      />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon((lib as MachOBinaryItem).nx.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${(lib as MachOBinaryItem).nx.severity === 'high' ? 'red' : (lib as MachOBinaryItem).nx.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor((lib as MachOBinaryItem).nx.severity)}`"
                      >
                        {{ (lib as MachOBinaryItem).nx.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ (lib as MachOBinaryItem).nx.description }}
                    </p>
                  </div>
                </div>

                <!-- Stack Canary -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">Stack Canary</span>
                    <span :class="getStatusColor((lib as MachOBinaryItem).stack_canary.has_canary)">
                      <component
                        :is="getStatusIcon((lib as MachOBinaryItem).stack_canary.has_canary)"
                        class="w-5 h-5"
                      />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon((lib as MachOBinaryItem).stack_canary.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${(lib as MachOBinaryItem).stack_canary.severity === 'high' ? 'red' : (lib as MachOBinaryItem).stack_canary.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor((lib as MachOBinaryItem).stack_canary.severity)}`"
                      >
                        {{ (lib as MachOBinaryItem).stack_canary.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ (lib as MachOBinaryItem).stack_canary.description }}
                    </p>
                  </div>
                </div>

                <!-- ARC -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">ARC</span>
                    <span :class="getStatusColor((lib as MachOBinaryItem).arc.has_arc)">
                      <component
                        :is="getStatusIcon((lib as MachOBinaryItem).arc.has_arc)"
                        class="w-5 h-5"
                      />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon((lib as MachOBinaryItem).arc.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${(lib as MachOBinaryItem).arc.severity === 'high' ? 'red' : (lib as MachOBinaryItem).arc.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor((lib as MachOBinaryItem).arc.severity)}`"
                      >
                        {{ (lib as MachOBinaryItem).arc.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ (lib as MachOBinaryItem).arc.description }}
                    </p>
                  </div>
                </div>

                <!-- RPATH -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">RPATH</span>
                    <span :class="getStatusColor((lib as MachOBinaryItem).rpath.has_rpath)">
                      <component
                        :is="getStatusIcon((lib as MachOBinaryItem).rpath.has_rpath)"
                        class="w-5 h-5"
                      />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon((lib as MachOBinaryItem).rpath.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${(lib as MachOBinaryItem).rpath.severity === 'high' ? 'red' : (lib as MachOBinaryItem).rpath.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor((lib as MachOBinaryItem).rpath.severity)}`"
                      >
                        {{ (lib as MachOBinaryItem).rpath.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ (lib as MachOBinaryItem).rpath.description }}
                    </p>
                  </div>
                </div>

                <!-- Symbols Stripped -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">Symbols Stripped</span>
                    <span :class="getStatusColor((lib as MachOBinaryItem).symbol.is_stripped)">
                      <component
                        :is="getStatusIcon((lib as MachOBinaryItem).symbol.is_stripped)"
                        class="w-5 h-5"
                      />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon((lib as MachOBinaryItem).symbol.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${(lib as MachOBinaryItem).symbol.severity === 'high' ? 'red' : (lib as MachOBinaryItem).symbol.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor((lib as MachOBinaryItem).symbol.severity)}`"
                      >
                        {{ (lib as MachOBinaryItem).symbol.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ (lib as MachOBinaryItem).symbol.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ELF Shared Objects -->
        <div v-else class="space-y-6">
          <div
            v-for="(lib, index) in props.data.dylib_analysis"
            :key="index"
            class="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div class="bg-gray-50 p-4 border-b border-gray-200">
              <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h3 class="font-bold text-lg text-purple-800">
                    {{ hasPath(lib.name) ? getLibraryName(lib.name) : lib.name }}
                  </h3>
                  <p v-if="hasPath(lib.name)" class="text-gray-500 text-sm">
                    {{ getLibraryPath(lib.name) }}
                  </p>
                </div>
                <div class="mt-2 md:mt-0 text-sm text-gray-500">#{{ index + 1 }}</div>
              </div>
            </div>

            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- NX -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">NX</span>
                    <span :class="getStatusColor((lib as ELFBinaryItem).nx.is_nx)">
                      <component
                        :is="getStatusIcon((lib as ELFBinaryItem).nx.is_nx)"
                        class="w-5 h-5"
                      />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon((lib as ELFBinaryItem).nx.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${(lib as ELFBinaryItem).nx.severity === 'high' ? 'red' : (lib as ELFBinaryItem).nx.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor((lib as ELFBinaryItem).nx.severity)}`"
                      >
                        {{ (lib as ELFBinaryItem).nx.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ (lib as ELFBinaryItem).nx.description }}</p>
                  </div>
                </div>

                <!-- Stack Canary -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">Stack Canary</span>
                    <span :class="getStatusColor((lib as ELFBinaryItem).stack_canary.has_canary)">
                      <component
                        :is="getStatusIcon((lib as ELFBinaryItem).stack_canary.has_canary)"
                        class="w-5 h-5"
                      />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon((lib as ELFBinaryItem).stack_canary.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${(lib as ELFBinaryItem).stack_canary.severity === 'high' ? 'red' : (lib as ELFBinaryItem).stack_canary.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor((lib as ELFBinaryItem).stack_canary.severity)}`"
                      >
                        {{ (lib as ELFBinaryItem).stack_canary.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ (lib as ELFBinaryItem).stack_canary.description }}
                    </p>
                  </div>
                </div>

                <!-- RPATH -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">RPATH</span>
                    <span :class="getStatusColor((lib as ELFBinaryItem).rpath.rpath)">
                      <component
                        :is="getStatusIcon((lib as ELFBinaryItem).rpath.rpath)"
                        class="w-5 h-5"
                      />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon((lib as ELFBinaryItem).rpath.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${(lib as ELFBinaryItem).rpath.severity === 'high' ? 'red' : (lib as ELFBinaryItem).rpath.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor((lib as ELFBinaryItem).rpath.severity)}`"
                      >
                        {{ (lib as ELFBinaryItem).rpath.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ (lib as ELFBinaryItem).rpath.description }}
                    </p>
                  </div>
                </div>

                <!-- RUNPATH -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">RUNPATH</span>
                    <span :class="getStatusColor((lib as ELFBinaryItem).runpath.runpath)">
                      <component
                        :is="getStatusIcon((lib as ELFBinaryItem).runpath.runpath)"
                        class="w-5 h-5"
                      />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon((lib as ELFBinaryItem).runpath.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${(lib as ELFBinaryItem).runpath.severity === 'high' ? 'red' : (lib as ELFBinaryItem).runpath.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor((lib as ELFBinaryItem).runpath.severity)}`"
                      >
                        {{ (lib as ELFBinaryItem).runpath.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ (lib as ELFBinaryItem).runpath.description }}
                    </p>
                  </div>
                </div>

                <!-- FORTIFY -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">FORTIFY</span>
                    <span :class="getStatusColor((lib as ELFBinaryItem).fortify.is_fortified)">
                      <component
                        :is="getStatusIcon((lib as ELFBinaryItem).fortify.is_fortified)"
                        class="w-5 h-5"
                      />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon((lib as ELFBinaryItem).fortify.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${(lib as ELFBinaryItem).fortify.severity === 'high' ? 'red' : (lib as ELFBinaryItem).fortify.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor((lib as ELFBinaryItem).fortify.severity)}`"
                      >
                        {{ (lib as ELFBinaryItem).fortify.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ (lib as ELFBinaryItem).fortify.description }}
                    </p>
                  </div>
                </div>

                <!-- Symbols Stripped -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-2 border-b flex justify-between items-center">
                    <span class="font-medium">Symbols Stripped</span>
                    <span :class="getStatusColor((lib as ELFBinaryItem).symbol.is_stripped)">
                      <component
                        :is="getStatusIcon((lib as ELFBinaryItem).symbol.is_stripped)"
                        class="w-5 h-5"
                      />
                    </span>
                  </div>
                  <div class="p-3">
                    <div class="flex items-center mb-2">
                      <component
                        :is="getSeverityIcon((lib as ELFBinaryItem).symbol.severity)"
                        class="w-4 h-4 mr-1"
                        :class="`text-${(lib as ELFBinaryItem).symbol.severity === 'high' ? 'red' : (lib as ELFBinaryItem).symbol.severity === 'warning' ? 'amber' : 'blue'}-500`"
                      />
                      <span
                        :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor((lib as ELFBinaryItem).symbol.severity)}`"
                      >
                        {{ (lib as ELFBinaryItem).symbol.severity }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      {{ (lib as ELFBinaryItem).symbol.description }}
                    </p>
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
