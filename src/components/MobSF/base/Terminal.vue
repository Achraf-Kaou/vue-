<template>
    <div
      class="bg-gray-900 rounded-md text-white p-4 h-80 overflow-y-auto font-mono text-sm"
      ref="terminalRef"
    >
      <div
        v-for="(log, index) in logs"
        :key="index"
        class="mb-1"
        :class="{
          'text-green-400': log.type === 'success',
          'text-yellow-400': log.type === 'warning',
          'text-red-400': log.type === 'error',
          'text-blue-400': log.type === 'info'
        }"
      >
        <span>{{ log.prefix }}</span>{{ log.message }}
      </div>

      <div v-if="logs.length === 0" class="text-gray-500">
        En attente des logs d'analyse...
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'

interface Log {
  message: string
  type: string
  prefix: string
}

export default defineComponent({
  name: 'LogsTerminal',
  props: {
    logs: {
      type: Array as PropType<Log[]>,
      required: true
    },
    isAnalysisComplete: {
      type: Boolean,
      default: false
    }
  },
  emits: ['analysis-complete'],
  setup(props) {
    const terminalRef = ref<HTMLDivElement | null>(null)

    // Scroll to bottom when logs update
    watch(() => props.logs.length, () => {
      setTimeout(() => {
        if (terminalRef.value) {
          terminalRef.value.scrollTop = terminalRef.value.scrollHeight
        }
      }, 50)
    })

    return {
      terminalRef
    }
  }
})
</script>

<style scoped>
/* Style pour le terminal avec une police monospace */
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>
