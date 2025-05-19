<template>
  <div class="p-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Score Section -->
      <div class="flex flex-col gap-3">
        <h2 class="text-lg font-medium flex items-center gap-2 text-gray-700 mb-2">
          <Shield :size="18" /> App Scores
        </h2>

        <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-3">
          <div class="w-16 h-16 bg-gray-200 mb-2">
            <img
              id="app_icon"
              :src="
                'http://localhost:8089/download/' +
                safeData.appInfo.icon_path?.replace('uploads/', '')
              "
            />
          </div>

          <CVSSScore :score="safeData.scores.average_cvss || 0" />
          <AppSecurityScore :score="safeData.scores.security_score || 0" />
          <TrackerScore
            :detected="safeData.scores.detected_trackers || 0"
            :total="safeData.scores.total_trackers || 0"
          />
        </div>
      </div>

      <!-- File Information -->
      <div>
        <h2 class="text-lg font-medium flex items-center gap-2 text-gray-700 mb-2">
          <FileText :size="18" /> File Information
        </h2>
        <div class="bg-gray-50 rounded-lg p-4">
          <InfoItem icon="FileText" label="File Name" :value="safeData.fileInfo.file_name || ''" />
          <InfoItem icon="FileText" label="size" :value="safeData.fileInfo.size || ''" />
          <InfoItem icon="FileText" label="MD5" :value="safeData.fileInfo.md5 || ''" />
          <InfoItem icon="FileText" label="SHA1" :value="safeData.fileInfo.sha1 || ''" />
          <InfoItem icon="FileText" label="SHA256" :value="safeData.fileInfo.sha256 || ''" />
        </div>
      </div>

      <!-- App Information -->
      <div>
        <h2 class="text-lg font-medium flex items-center gap-2 text-gray-700 mb-2">
          <Info :size="18" /> App Information
        </h2>
        <div class="bg-gray-50 rounded-lg p-4">
          <InfoItem icon="Package" label="App Name" :value="safeData.appInfo.app_name || ''" />
          <InfoItem
            icon="Package"
            label="Package Name"
            :value="safeData.appInfo.package_name || ''"
          />
          <InfoItem
            icon="Activity"
            label="Main Activity"
            :value="safeData.appInfo.main_activity || ''"
          />
          <div class="flex gap-4">
            <InfoItem icon="Info" label="Target SDK" :value="safeData.appInfo.target_sdk" />
            <InfoItem icon="Info" label="Min SDK" :value="safeData.appInfo.min_sdk" />
            <InfoItem icon="Info" label="Max SDK" :value="safeData.appInfo.max_sdk" />
          </div>
          <div class="flex gap-4">
            <InfoItem
              icon="Info"
              label="Version Name"
              :value="safeData.appInfo.version_name || ''"
            />
            <InfoItem
              icon="Info"
              label="Version Code"
              :value="safeData.appInfo.version_code || ''"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Security Alert Banner -->
    <div
      v-if="(safeData.scores.security_score || 100) < 40"
      class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6 rounded shadow-sm"
    >
      <div class="flex items-center">
        <AlertCircle :size="18" class="mr-2" />
        <p class="font-medium">
          Security Warning: This application has a low security score. Review the security issues
          carefully.
        </p>
      </div>
    </div>

    <!-- Components Section -->
    <ComponentsSection :data="safeData.components" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Shield, FileText, Info, AlertCircle } from 'lucide-vue-next'
import ComponentsSection from './ComponentsSection.vue'
import InfoItem from './InfoItem.vue'

// Define the prop using defineProps
interface SecurityData {
  appsec: {
    security_score: number
    trackers: number
    total_trackers: number
    average_cvss: string
  }
  file_name: string
  size: string
  md5: string
  sha1: string
  sha256: string
  app_name: string
  package_name: string
  main_activity: string
  target_sdk: string
  min_sdk: string
  max_sdk: string
  version_name: string
  version_code: string
  icon_path?: string
  hash?: string
  activities?: [string]
  services?: [string]
  receivers?: [string]
  providers?: [string]
  libraries?: [string]
  sbom: {
    sbom_versioned: [string]
  }
  files: [string]
}

const props = defineProps<{
  data: SecurityData
}>()

// Create safe computed values to avoid undefined issues
const safeData = computed(() => ({
  fileInfo: {
    file_name: props.data.file_name,
    size: props.data.size,
    md5: props.data.md5,
    sha1: props.data.sha1,
    sha256: props.data.sha256,
  },
  appInfo: {
    app_name: props.data.app_name,
    package_name: props.data.package_name,
    main_activity: props.data.main_activity,
    target_sdk: props.data.target_sdk,
    min_sdk: props.data.min_sdk,
    max_sdk: props.data.max_sdk,
    version_name: props.data.version_name,
    version_code: props.data.version_code,
    icon_path: props.data.icon_path,
  },
  scores: {
    security_score: props.data.appsec.security_score,
    detected_trackers: props.data.appsec.trackers,
    total_trackers: props.data.appsec.total_trackers,
    average_cvss: 0, // Assuming 0 as default if not provided in your data model
  },
  components: {
    activities: props.data.activities,
    services: props.data.services,
    receivers: props.data.receivers,
    providers: props.data.providers,
    libraries: props.data.libraries,
    sbom: props.data.sbom,
    files: props.data.files,
  },
}))

console.log('AppInfo safeData:', safeData.value)
</script>

<script lang="ts">
import { defineComponent } from 'vue'

// Embedded components
const CVSSScore = defineComponent({
  props: {
    score: {
      type: Number,
      required: true,
    },
  },
  template: `
    <div class="flex items-center gap-2">
      <div class="text-xs font-medium text-white px-2.5 py-0.5 rounded bg-blue-500">Average CVSS</div>
      <span class="font-bold">{{ score }}</span>
    </div>
  `,
})

const AppSecurityScore = defineComponent({
  props: {
    score: {
      type: Number,
      required: true,
    },
  },
  computed: {
    colorClass() {
      if (this.score === 100) return 'bg-green-500'
      else if (this.score >= 40) return 'bg-yellow-500'
      return 'bg-red-500'
    },
  },
  template: `
    <div class="flex items-center gap-2">
      <div :class="'text-xs font-medium text-white px-2.5 py-0.5 rounded ' + colorClass">
        Security Score
      </div>
      <span class="font-bold">{{ score }}/100</span>
    </div>
  `,
})

const TrackerScore = defineComponent({
  props: {
    detected: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  computed: {
    colorClass() {
      return this.detected > 0 ? 'bg-yellow-500' : 'bg-green-500'
    },
  },
  template: `
    <div class="flex items-center gap-2">
      <div :class="'text-xs font-medium text-white px-2.5 py-0.5 rounded ' + colorClass">
        Trackers Detection
      </div>
      <span class="font-bold">{{ detected }}/{{ total }}</span>
    </div>
  `,
})

export default {
  name: 'AppInfo',
  components: {
    CVSSScore,
    AppSecurityScore,
    TrackerScore,
  },
}
</script>
