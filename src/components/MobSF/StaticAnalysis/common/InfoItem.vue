<template>
  <div class="flex items-start gap-2 mb-2">
    <div class="flex-shrink-0 mt-1">
      <component :is="icon" size="16" class="text-gray-600" />
    </div>
    <div class="flex flex-col">
      <span class="text-xs font-medium text-gray-500">{{ label }}</span>
      <a
        v-if="link"
        :href="link"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm text-blue-600 hover:underline"
      >
        {{ value }}
      </a>
      <span v-else class="text-sm font-medium">{{ value }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { LucideIcon } from 'lucide-vue-next'

export default defineComponent({
  name: 'InfoItem',
  props: {
    icon: {
      type: Object as PropType<any>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '',
    },
  },
})
</script>
