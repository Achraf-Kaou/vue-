<template>
  <LogsTerminal :logs="logs" :is-analysis-complete="false" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue'
import LogsTerminal from '../../base/Terminal.vue'
import { DynamicAnalyzerService } from '../../../../api/DynamicAnalyzer'

export default defineComponent({
  name: 'LogcatTerminal',
  components: { LogsTerminal },
  props: {
    hash: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {
    const logs = ref<any[]>([])
    async function fetchLogs() {
      const service = new DynamicAnalyzerService()
      try {
        // Replace with actual API for logcat logs if available
        // If not available, display a placeholder
        logs.value = [{ message: 'Logcat non disponible via API', type: 'warning', prefix: '' }]
      } catch (e) {
        logs.value = [{ message: 'Erreur lors du chargement des logs Logcat', type: 'error', prefix: '' }]
      }
    }
    onMounted(fetchLogs)
    return { logs }
  }
})
</script>
