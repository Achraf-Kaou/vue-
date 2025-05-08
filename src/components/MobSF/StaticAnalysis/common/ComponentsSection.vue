<template>
  <div class="mt-8">
    <h2 class="text-lg font-medium flex items-center gap-2 text-gray-700 mb-2">
      <Component size="18" /> Application Components
    </h2>
    <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <ComponentCounter icon="Activity" label="Activities" :count="data.activities?.length || 0" />
      <ComponentCounter icon="Shield" label="Services" :count="data.services?.length || 0" />
      <ComponentCounter icon="Bell" label="Receivers" :count="data.receivers?.length || 0" />
      <ComponentCounter icon="Database" label="Providers" :count="data.providers?.length || 0" />
      <ComponentCounter
        icon="Library"
        label="Native Libraries"
        :count="data.libraries?.length || 0"
      />
      <ComponentCounter
        icon="Package"
        label="SBOM Components"
        :count="data.sbom?.sbom_versioned?.length || 0"
      />
      <ComponentCounter icon="File" label="Files" :count="data.files?.length || 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Component } from 'lucide-vue-next'
import ComponentCounter from './ComponentCounter.vue'
import { computed } from 'vue'

// Define the types for component data
interface ComponentsData {
  activities?: any[]
  services?: any[]
  receivers?: any[]
  providers?: any[]
  libraries?: any[]
  sbom?: {
    sbom_versioned: any[]
  }
  files?: any[]
}

// Props with proper typing
const props = withDefaults(
  defineProps<{
    data: ComponentsData
  }>(),
  {
    data: () => ({
      activities: [],
      services: [],
      receivers: [],
      providers: [],
      libraries: [],
      sbom: {
        sbom_versioned: [],
      },
      files: [],
    }),
  },
)

// Now using the data prop directly since the type is properly defined
</script>

<script lang="ts">
export default {
  name: 'ComponentsSection',
}
</script>
