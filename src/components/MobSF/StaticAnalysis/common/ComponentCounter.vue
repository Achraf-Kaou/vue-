<template>
  <div class="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
      <component :is="iconComponent" size="20" class="text-blue-600" />
    </div>
    <div>
      <div class="text-sm font-medium text-gray-500">{{ label }}</div>
      <div class="text-lg font-semibold">{{ count }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

// Using proper typing for the icon prop that matches Lucide icon names
type LucideIconName = keyof typeof LucideIcons

const props = defineProps<{
  icon: LucideIconName
  label: string
  count: number
}>()

// Get the icon component from Lucide icons with proper typing
const iconComponent = computed(() => {
  return LucideIcons[props.icon] || LucideIcons.Box
})
</script>

<script lang="ts">
export default {
  name: 'ComponentCounter',
}
</script>
