<script setup lang="ts">
import { Cpu, Binary, Shuffle, ArrowLeftRight } from 'lucide-vue-next'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

// Get background color based on architecture
const getArchColor = (arch: string) => {
  switch (arch) {
    case 'ARM':
      return 'bg-blue-600'
    case 'x86':
      return 'bg-green-600'
    case 'x86_64':
      return 'bg-purple-600'
    default:
      return 'bg-gray-600'
  }
}
</script>

<template>
  <div class="rounded-lg bg-gray-100 dark:bg-gray-800 p-4 shadow-md">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold flex items-center gap-2">
        <Cpu class="w-5 h-5" />
        Binary Information
      </h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <!-- Architecture -->
      <div class="flex items-center space-x-2">
        <div :class="[getArchColor(props.data.binary_info.arch), 'p-2 rounded-md']">
          <Cpu class="w-5 h-5 text-white" />
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Architecture</p>
          <p class="font-medium">{{ props.data.binary_info.arch }}</p>
        </div>
      </div>

      <!-- Sub Architecture -->
      <div class="flex items-center space-x-2">
        <div class="bg-indigo-600 p-2 rounded-md">
          <Cpu class="w-5 h-5 text-white" />
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Sub Architecture</p>
          <p class="font-medium">{{ props.data.binary_info.subarch }}</p>
        </div>
      </div>

      <!-- Bit -->
      <div class="flex items-center space-x-2">
        <div class="bg-amber-600 p-2 rounded-md">
          <Binary class="w-5 h-5 text-white" />
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Bit</p>
          <p class="font-medium">{{ props.data.binary_info.bit }}</p>
        </div>
      </div>

      <!-- Endian -->
      <div class="flex items-center space-x-2">
        <div class="bg-emerald-600 p-2 rounded-md">
          <ArrowLeftRight class="w-5 h-5 text-white" />
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Endian</p>
          <p class="font-medium">{{ props.data.binary_info.endian }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
