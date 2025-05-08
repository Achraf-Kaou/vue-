<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6 flex items-center">
        <Shield class="w-5 h-5 mr-2 text-gray-700" />
        <span class="font-bold text-lg">ABUSED PERMISSIONS</span>
      </div>

      <div v-if="props.data && props.data.malware_permissions">
        <div class="bg-red-50 p-4 rounded-md mb-6">
          <div class="flex items-start">
            <AlertCircle class="w-5 h-5 text-red-600 mr-2 mt-0.5" />
            <p class="text-sm text-red-800">
              This application requests permissions commonly associated with malware behavior.
              Review carefully before installation.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Top Malware Permissions -->
          <div class="p-4 border border-red-200 rounded-lg bg-red-50">
            <div class="mb-3 flex justify-between items-center">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                <strong class="text-gray-800 font-semibold">Top Malware Permissions</strong>
              </div>
              <span class="text-sm font-medium bg-red-100 text-red-800 px-2 py-1 rounded">
                <b>{{ props.data.malware_permissions.top_malware_permissions.length }}</b
                >/
                {{ props.data.malware_permissions.total_malware_permissions }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                class="bg-red-600 h-3 rounded-full"
                :style="{ width: `${topMalwarePercentage}%` }"
                :aria-valuenow="props.data.malware_permissions.top_malware_permissions.length"
                aria-valuemin="0"
                :aria-valuemax="props.data.malware_permissions.total_malware_permissions"
              ></div>
            </div>
            <div class="mt-2">
              <span
                v-for="(permission, index) in props.data.malware_permissions
                  .top_malware_permissions"
                :key="index"
                class="inline-block bg-white text-red-800 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded border border-red-300"
              >
                {{ permission }}
              </span>
            </div>
          </div>

          <!-- Other Common Permissions -->
          <div class="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div class="mb-3 flex justify-between items-center">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <strong class="text-gray-800 font-semibold">Other Common Permissions</strong>
              </div>
              <span class="text-sm font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                <b>{{ props.data.malware_permissions.other_abused_permissions.length }}</b
                >/
                {{ props.data.malware_permissions.total_other_permissions }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                class="bg-yellow-500 h-3 rounded-full"
                :style="{ width: `${otherAbusedPercentage}%` }"
                :aria-valuenow="props.data.malware_permissions.other_abused_permissions.length"
                aria-valuemin="0"
                :aria-valuemax="props.data.malware_permissions.total_other_permissions"
              ></div>
            </div>
            <div class="mt-2">
              <span
                v-for="(permission, index) in props.data.malware_permissions
                  .other_abused_permissions"
                :key="index"
                class="inline-block bg-white text-yellow-800 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded border border-yellow-300"
              >
                {{ permission }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong class="text-red-600">Malware Permissions</strong>: These are the top
              permissions that are widely abused by known malware. Their presence indicates a higher
              risk profile.
            </div>
            <div>
              <strong class="text-yellow-600">Other Common Permissions</strong>: These permissions
              are commonly abused by known malware but may have legitimate uses in some
              applications.
            </div>
          </div>
        </div>
      </div>
      <div v-else class="py-4 text-center text-gray-500">No abused permissions data available.</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Shield, AlertCircle } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const topMalwarePercentage = computed(() => {
  if (!props.data?.malware_permissions) return 0
  return (
    (props.data.malware_permissions.top_malware_permissions.length /
      props.data.malware_permissions.total_malware_permissions) *
    100
  )
})

const otherAbusedPercentage = computed(() => {
  if (!props.data?.malware_permissions) return 0
  return (
    (props.data.malware_permissions.other_abused_permissions.length /
      props.data.malware_permissions.total_other_permissions) *
    100
  )
})

// Export the component name
defineOptions({
  name: 'AbusedPermissions',
})
</script>
