<script setup lang="ts">
import { Fingerprint } from 'lucide-vue-next'

// Define the data structure for APKiD analysis
interface ApkidFindings {
  [detail: string]: string[]
}

interface ApkidData {
  [file: string]: ApkidFindings
}

interface Props {
  data: {
    apkid?: ApkidData
    app_type?: string
  }
}

const props = defineProps<Props>()

// Function to determine if APKiD analysis should be displayed
const shouldShowApkid = (): boolean => {
  return (
    props.data.apkid !== undefined &&
    Object.keys(props.data.apkid).length > 0 &&
    props.data.app_type !== 'jar' &&
    props.data.app_type !== 'aar' &&
    props.data.app_type !== 'so'
  )
}

// Function to get badge styling based on finding type
const getBadgeClass = (detectionType: string): string => {
  switch (detectionType) {
    case 'anti_vm':
    case 'anti_disassembly':
    case 'anti_debug':
    case 'abnormal':
    case 'obfuscator':
    case 'manipulator':
      return 'bg-yellow-100 text-yellow-800'
    case 'compiler':
    case 'protector':
      return 'bg-blue-100 text-blue-800'
    case 'packer':
    case 'dropper':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

// Function to get friendly name for detection type
const getDetectionLabel = (detectionType: string): string => {
  switch (detectionType) {
    case 'anti_vm':
      return 'Anti-VM Code'
    case 'anti_disassembly':
      return 'Anti Disassembly Code'
    case 'anti_debug':
      return 'Anti Debug Code'
    case 'compiler':
      return 'Compiler'
    case 'abnormal':
      return 'Abnormal Code'
    case 'obfuscator':
      return 'Obfuscator'
    case 'protector':
      return 'Protector'
    case 'packer':
      return 'Packer Found'
    case 'dropper':
      return 'Dropper Found'
    case 'manipulator':
      return 'Manipulator Found'
    default:
      return detectionType
  }
}
</script>

<template>
  <section v-if="props.data.app_type !== 'so'" class="px-4 py-6">
    <div class="w-full bg-white rounded-lg shadow-md">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4 flex items-center">
          <Fingerprint class="mr-2" size="20" />
          APKiD ANALYSIS
        </h2>

        <div class="overflow-x-auto">
          <table v-if="shouldShowApkid()" class="min-w-full border border-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  DEX
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  DETECTIONS
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(details, file) in props.data.apkid" :key="file">
                <td class="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                  {{ file }}
                </td>
                <td class="px-6 py-4">
                  <table class="min-w-full border border-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          FINDINGS
                        </th>
                        <th
                          class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          DETAILS
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="(idens, detail) in details" :key="detail">
                        <td class="px-4 py-2 whitespace-nowrap">
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="getBadgeClass(detail)"
                          >
                            {{ getDetectionLabel(detail) }}
                          </span>
                        </td>
                        <td class="px-4 py-2 whitespace-normal text-sm text-gray-500">
                          <div v-for="(idn, index) in idens" :key="index" class="mb-1">
                            {{ idn }}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-else class="text-center py-8 text-gray-500 font-medium">
            <p>APKiD not enabled.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
