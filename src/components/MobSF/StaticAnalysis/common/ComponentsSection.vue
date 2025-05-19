<template>
  <div class="analysis-section mt-6">
    <h2 class="analysis-title flex items-center gap-2">
      <List :size="18" /> Components
    </h2>

    <div class="analysis-grid">
      <!-- Activities -->
      <div class="analysis-card">
        <h3 class="analysis-label mb-2">Activities</h3>
        <div class="space-y-2">
          <div v-for="activity in data.activities" :key="activity" class="analysis-item">
            <Activity :size="16" class="text-slate-500" />
            <span class="analysis-value">{{ activity }}</span>
          </div>
          <div v-if="!data.activities?.length" class="analysis-value text-slate-400">
            No activities found
          </div>
        </div>
      </div>

      <!-- Services -->
      <div class="analysis-card">
        <h3 class="analysis-label mb-2">Services</h3>
        <div class="space-y-2">
          <div v-for="service in data.services" :key="service" class="analysis-item">
            <Activity :size="16" class="text-slate-500" />
            <span class="analysis-value">{{ service }}</span>
          </div>
          <div v-if="!data.services?.length" class="analysis-value text-slate-400">
            No services found
          </div>
        </div>
      </div>

      <!-- Receivers -->
      <div class="analysis-card">
        <h3 class="analysis-label mb-2">Receivers</h3>
        <div class="space-y-2">
          <div v-for="receiver in data.receivers" :key="receiver" class="analysis-item">
            <Activity :size="16" class="text-slate-500" />
            <span class="analysis-value">{{ receiver }}</span>
          </div>
          <div v-if="!data.receivers?.length" class="analysis-value text-slate-400">
            No receivers found
          </div>
        </div>
      </div>

      <!-- Providers -->
      <div class="analysis-card">
        <h3 class="analysis-label mb-2">Providers</h3>
        <div class="space-y-2">
          <div v-for="provider in data.providers" :key="provider" class="analysis-item">
            <Activity :size="16" class="text-slate-500" />
            <span class="analysis-value">{{ provider }}</span>
          </div>
          <div v-if="!data.providers?.length" class="analysis-value text-slate-400">
            No providers found
          </div>
        </div>
      </div>

      <!-- Libraries -->
      <div class="analysis-card">
        <h3 class="analysis-label mb-2">Libraries</h3>
        <div class="space-y-2">
          <div v-for="library in data.libraries" :key="library" class="analysis-item">
            <Package :size="16" class="text-slate-500" />
            <span class="analysis-value">{{ library }}</span>
          </div>
          <div v-if="!data.libraries?.length" class="analysis-value text-slate-400">
            No libraries found
          </div>
        </div>
      </div>

      <!-- SBOM -->
      <div class="analysis-card">
        <h3 class="analysis-label mb-2">SBOM</h3>
        <div class="space-y-2">
          <div v-for="item in data.sbom?.sbom_versioned" :key="item" class="analysis-item">
            <Package :size="16" class="text-slate-500" />
            <span class="analysis-value">{{ item }}</span>
          </div>
          <div v-if="!data.sbom?.sbom_versioned?.length" class="analysis-value text-slate-400">
            No SBOM data found
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { List, Activity, Package } from 'lucide-vue-next'

interface ComponentsData {
  activities?: string[]
  services?: string[]
  receivers?: string[]
  providers?: string[]
  libraries?: string[]
  sbom?: {
    sbom_versioned: string[]
  }
}

defineProps<{
  data: ComponentsData
}>()
</script>

<script lang="ts">
export default {
  name: 'ComponentsSection',
}
</script>
