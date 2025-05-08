<script setup lang="ts">
import { Braces, AlertTriangle, AlertCircle, Info, Check, X } from 'lucide-vue-next'

interface ProtectionDetail {
  severity: 'high' | 'warning' | 'info'
  description: string
}

interface MachoAnalysis {
  nx: ProtectionDetail & { has_nx: string }
  pie: ProtectionDetail & { has_pie: string }
  stack_canary: ProtectionDetail & { has_canary: string }
  arc: ProtectionDetail & { has_arc: string }
  rpath: ProtectionDetail & { has_rpath: string }
  code_signature: ProtectionDetail & { has_code_signature: string }
  encrypted: ProtectionDetail & { is_encrypted: string }
  symbol: ProtectionDetail & { is_stripped: string }
}

interface Props {
  data: {
    macho_analysis?: MachoAnalysis
    app_type?: string
  }
}

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

// Helper function to get the appropriate icon based on status
const getStatusIcon = (status: string) => {
  // Assuming 'YES' means protection is enabled, 'NO' means it's not
  if (status === 'yes') {
    return Check
  } else {
    return X
  }
}

// Helper function to get the status color for text and background
const getStatusColor = (status: string) => {
  if (status === 'yes') {
    return 'text-green-600 dark:text-green-400'
  } else {
    return 'text-red-600 dark:text-red-400'
  }
}

// Helper function to get the severity icon
const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'high':
      return AlertTriangle
    case 'warning':
      return AlertCircle
    case 'info':
      return Info
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
    default:
      return {
        text: 'text-gray-600',
        bg: 'bg-gray-100',
        badge: 'bg-gray-500',
      }
  }
}

// Protection types with their full names and descriptions
const protectionInfo = {
  nx: {
    name: 'NX (No Execute)',
    description: 'Prevents code execution from data segments',
  },
  pie: {
    name: 'PIE (Position Independent Executable)',
    description: 'Allows ASLR (Address Space Layout Randomization)',
  },
  stack_canary: {
    name: 'Stack Canary',
    description: 'Guards against stack overflow attacks',
  },
  arc: {
    name: 'ARC (Automatic Reference Counting)',
    description: 'Memory management feature in Objective-C',
  },
  rpath: {
    name: 'RPATH',
    description: 'Controls dynamic library loading paths',
  },
  code_signature: {
    name: 'Code Signature',
    description: 'Ensures code integrity and authenticity',
  },
  encrypted: {
    name: 'Encrypted',
    description: 'Binary encryption for protection against analysis',
  },
  symbol: {
    name: 'Symbols Stripped',
    description: 'Removal of debug symbols for reverse engineering protection',
  },
}
</script>

<template>
  <div class="w-full">
    <a id="binary_analysis" class="anchor"></a>
    <section class="py-4">
      <div class="w-full">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div class="p-6">
            <div
              class="flex items-center space-x-2 font-semibold text-gray-900 dark:text-white mb-6"
            >
              <Braces class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span class="uppercase tracking-wider">
                <template v-if="props.data.app_type && !props.data.app_type.includes('Dylib,A')"
                  >IPA
                </template>
                BINARY ANALYSIS
              </span>
            </div>

            <!-- Analysis Table -->
            <div class="overflow-x-auto">
              <table class="w-full border-collapse table-auto">
                <thead>
                  <tr class="bg-gray-100 dark:bg-gray-700">
                    <th class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left">
                      PROTECTION
                    </th>
                    <th
                      class="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left w-28"
                    >
                      STATUS
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
                  <template v-if="props.data.macho_analysis">
                    <!-- NX Protection -->
                    <tr
                      class="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                    >
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="font-medium">{{ protectionInfo.nx.name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ protectionInfo.nx.description }}
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center">
                          <component
                            :is="getStatusIcon(props.data.macho_analysis.nx.has_nx)"
                            :class="`w-5 h-5 mr-2 ${getStatusColor(props.data.macho_analysis.nx.has_nx)}`"
                          />
                          <span :class="getStatusColor(props.data.macho_analysis.nx.has_nx)">
                            {{ props.data.macho_analysis.nx.has_nx }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center justify-center">
                          <span
                            :class="`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(props.data.macho_analysis.nx.severity).badge}`"
                          >
                            <component
                              :is="getSeverityIcon(props.data.macho_analysis.nx.severity)"
                              class="w-3 h-3 mr-1"
                            />
                            {{ props.data.macho_analysis.nx.severity }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="whitespace-pre-wrap">
                          {{ props.data.macho_analysis.nx.description }}
                        </div>
                      </td>
                    </tr>

                    <!-- PIE Protection -->
                    <tr
                      class="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                    >
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="font-medium">{{ protectionInfo.pie.name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ protectionInfo.pie.description }}
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center">
                          <component
                            :is="getStatusIcon(props.data.macho_analysis.pie.has_pie)"
                            :class="`w-5 h-5 mr-2 ${getStatusColor(props.data.macho_analysis.pie.has_pie)}`"
                          />
                          <span :class="getStatusColor(props.data.macho_analysis.pie.has_pie)">
                            {{ props.data.macho_analysis.pie.has_pie }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center justify-center">
                          <span
                            :class="`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(props.data.macho_analysis.pie.severity).badge}`"
                          >
                            <component
                              :is="getSeverityIcon(props.data.macho_analysis.pie.severity)"
                              class="w-3 h-3 mr-1"
                            />
                            {{ props.data.macho_analysis.pie.severity }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="whitespace-pre-wrap">
                          {{ props.data.macho_analysis.pie.description }}
                        </div>
                      </td>
                    </tr>

                    <!-- Stack Canary Protection -->
                    <tr
                      class="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                    >
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="font-medium">{{ protectionInfo.stack_canary.name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ protectionInfo.stack_canary.description }}
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center">
                          <component
                            :is="getStatusIcon(props.data.macho_analysis.stack_canary.has_canary)"
                            :class="`w-5 h-5 mr-2 ${getStatusColor(props.data.macho_analysis.stack_canary.has_canary)}`"
                          />
                          <span
                            :class="
                              getStatusColor(props.data.macho_analysis.stack_canary.has_canary)
                            "
                          >
                            {{ props.data.macho_analysis.stack_canary.has_canary }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center justify-center">
                          <span
                            :class="`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(props.data.macho_analysis.stack_canary.severity).badge}`"
                          >
                            <component
                              :is="getSeverityIcon(props.data.macho_analysis.stack_canary.severity)"
                              class="w-3 h-3 mr-1"
                            />
                            {{ props.data.macho_analysis.stack_canary.severity }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="whitespace-pre-wrap">
                          {{ props.data.macho_analysis.stack_canary.description }}
                        </div>
                      </td>
                    </tr>

                    <!-- ARC Protection -->
                    <tr
                      class="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                    >
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="font-medium">{{ protectionInfo.arc.name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ protectionInfo.arc.description }}
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center">
                          <component
                            :is="getStatusIcon(props.data.macho_analysis.arc.has_arc)"
                            :class="`w-5 h-5 mr-2 ${getStatusColor(props.data.macho_analysis.arc.has_arc)}`"
                          />
                          <span :class="getStatusColor(props.data.macho_analysis.arc.has_arc)">
                            {{ props.data.macho_analysis.arc.has_arc }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center justify-center">
                          <span
                            :class="`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(props.data.macho_analysis.arc.severity).badge}`"
                          >
                            <component
                              :is="getSeverityIcon(props.data.macho_analysis.arc.severity)"
                              class="w-3 h-3 mr-1"
                            />
                            {{ props.data.macho_analysis.arc.severity }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="whitespace-pre-wrap">
                          {{ props.data.macho_analysis.arc.description }}
                        </div>
                      </td>
                    </tr>

                    <!-- RPATH Analysis -->
                    <tr
                      class="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                    >
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="font-medium">{{ protectionInfo.rpath.name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ protectionInfo.rpath.description }}
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center">
                          <component
                            :is="getStatusIcon(props.data.macho_analysis.rpath.has_rpath)"
                            :class="`w-5 h-5 mr-2 ${getStatusColor(props.data.macho_analysis.rpath.has_rpath)}`"
                          />
                          <span :class="getStatusColor(props.data.macho_analysis.rpath.has_rpath)">
                            {{ props.data.macho_analysis.rpath.has_rpath }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center justify-center">
                          <span
                            :class="`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(props.data.macho_analysis.rpath.severity).badge}`"
                          >
                            <component
                              :is="getSeverityIcon(props.data.macho_analysis.rpath.severity)"
                              class="w-3 h-3 mr-1"
                            />
                            {{ props.data.macho_analysis.rpath.severity }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="whitespace-pre-wrap">
                          {{ props.data.macho_analysis.rpath.description }}
                        </div>
                      </td>
                    </tr>

                    <!-- Code Signature -->
                    <tr
                      class="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                    >
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="font-medium">{{ protectionInfo.code_signature.name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ protectionInfo.code_signature.description }}
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center">
                          <component
                            :is="
                              getStatusIcon(
                                props.data.macho_analysis.code_signature.has_code_signature,
                              )
                            "
                            :class="`w-5 h-5 mr-2 ${getStatusColor(props.data.macho_analysis.code_signature.has_code_signature)}`"
                          />
                          <span
                            :class="
                              getStatusColor(
                                props.data.macho_analysis.code_signature.has_code_signature,
                              )
                            "
                          >
                            {{ props.data.macho_analysis.code_signature.has_code_signature }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center justify-center">
                          <span
                            :class="`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(props.data.macho_analysis.code_signature.severity).badge}`"
                          >
                            <component
                              :is="
                                getSeverityIcon(props.data.macho_analysis.code_signature.severity)
                              "
                              class="w-3 h-3 mr-1"
                            />
                            {{ props.data.macho_analysis.code_signature.severity }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="whitespace-pre-wrap">
                          {{ props.data.macho_analysis.code_signature.description }}
                        </div>
                      </td>
                    </tr>

                    <!-- Encrypted -->
                    <tr
                      class="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                    >
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="font-medium">{{ protectionInfo.encrypted.name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ protectionInfo.encrypted.description }}
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center">
                          <component
                            :is="getStatusIcon(props.data.macho_analysis.encrypted.is_encrypted)"
                            :class="`w-5 h-5 mr-2 ${getStatusColor(props.data.macho_analysis.encrypted.is_encrypted)}`"
                          />
                          <span
                            :class="
                              getStatusColor(props.data.macho_analysis.encrypted.is_encrypted)
                            "
                          >
                            {{ props.data.macho_analysis.encrypted.is_encrypted }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center justify-center">
                          <span
                            :class="`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(props.data.macho_analysis.encrypted.severity).badge}`"
                          >
                            <component
                              :is="getSeverityIcon(props.data.macho_analysis.encrypted.severity)"
                              class="w-3 h-3 mr-1"
                            />
                            {{ props.data.macho_analysis.encrypted.severity }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="whitespace-pre-wrap">
                          {{ props.data.macho_analysis.encrypted.description }}
                        </div>
                      </td>
                    </tr>

                    <!-- Symbols Stripped -->
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="font-medium">{{ protectionInfo.symbol.name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ protectionInfo.symbol.description }}
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center">
                          <component
                            :is="getStatusIcon(props.data.macho_analysis.symbol.is_stripped)"
                            :class="`w-5 h-5 mr-2 ${getStatusColor(props.data.macho_analysis.symbol.is_stripped)}`"
                          />
                          <span
                            :class="getStatusColor(props.data.macho_analysis.symbol.is_stripped)"
                          >
                            {{ props.data.macho_analysis.symbol.is_stripped }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="flex items-center justify-center">
                          <span
                            :class="`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(props.data.macho_analysis.symbol.severity).badge}`"
                          >
                            <component
                              :is="getSeverityIcon(props.data.macho_analysis.symbol.severity)"
                              class="w-3 h-3 mr-1"
                            />
                            {{ props.data.macho_analysis.symbol.severity }}
                          </span>
                        </div>
                      </td>
                      <td class="border border-gray-200 dark:border-gray-600 px-4 py-3">
                        <div class="whitespace-pre-wrap">
                          {{ props.data.macho_analysis.symbol.description }}
                        </div>
                      </td>
                    </tr>
                  </template>
                  <tr v-else class="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td
                      colspan="4"
                      class="border border-gray-200 dark:border-gray-600 px-4 py-4 text-center text-gray-500"
                    >
                      <div class="flex items-center justify-center space-x-2">
                        <AlertCircle class="w-5 h-5" />
                        <span>Binary Analysis Failed.</span>
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
