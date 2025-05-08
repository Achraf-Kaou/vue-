<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-4">Analyse en cours...</h2>

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

    <div class="mt-6">
      <button
        v-if="isAnalysisComplete"
        type="button"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        @click="$emit('analysis-complete')"
      >
        Voir les résultats
      </button>

      <div v-else class="flex items-center space-x-3">
        <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm text-gray-600">Analyse en cours, veuillez patienter...</span>
      </div>
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
