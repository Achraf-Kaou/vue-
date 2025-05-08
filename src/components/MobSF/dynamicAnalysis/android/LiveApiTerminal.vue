<template>
  <LogsTerminal :logs="logs" :is-analysis-complete="false" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue'
import LogsTerminal from '../../base/Terminal.vue'
import { DynamicAnalyzerService } from '../../../../api/DynamicAnalyzer'

export default defineComponent({
  name: 'LiveApiTerminal',
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
        // Replace with actual API for live_api logs if available
        const result = await service.fridaAPIMonitor(props.hash)
        logs.value = Array.isArray(result)
          ? result.map((msg: any) => ({ message: msg, type: 'info', prefix: '' }))
          : [{ message: JSON.stringify(result), type: 'info', prefix: '' }]
      } catch (e) {
        logs.value = [{ message: 'Erreur lors du chargement des logs Live API', type: 'error', prefix: '' }]
      }
    }
    onMounted(fetchLogs)
    return { logs }
  }
})
</script>
