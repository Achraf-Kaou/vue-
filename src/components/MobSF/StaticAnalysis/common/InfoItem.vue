<template>
  <div class="analysis-item">
    <component :is="icon" :size="16" class="text-slate-500" />
    <div class="flex flex-col">
      <span class="analysis-label">{{ label }}</span>
      <span class="analysis-value">{{ value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Package, Activity, Info } from 'lucide-vue-next'

defineProps<{
  icon: string
  label: string
  value: string | number
}>()
</script>
