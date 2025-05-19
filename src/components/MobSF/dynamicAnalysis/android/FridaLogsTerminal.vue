<template>
  <Terminal :logs="logs" :is-analysis-complete="isAnaysisComplete" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue'
import Terminal from '../../base/Terminal.vue'
import { dynamicAnalyzer } from '../../../../api/DynamicAnalyzer'

export default defineComponent({
  name: 'FridaLogsTerminal',
  components: { Terminal },
  props: {
    hash: {
      type: String as PropType<string>,
      required: true
    },
    isAnaysisComplete: {
      type: Boolean as PropType<boolean>,
        required: true
    }
  },
  setup(props) {
    const logs = ref<any[]>([])
    async function fetchLogs() {
      const service = dynamicAnalyzer
      try {
        const result = await service.getFridaLogs(props.hash)
        const x = result.message
        // Adapt log formatting if needed
        logs.value = Array.isArray(x)
          ? x.map((msg: any) => ({ message: msg, type: 'info', prefix: '' }))
          : [{ message: JSON.stringify(x), type: 'info', prefix: '' }]
      } catch (e) {
        logs.value = [{ message: 'Erreur lors du chargement des logs Frida', type: 'error', prefix: '' }]
      }
    }
    onMounted(fetchLogs)
    return { logs }
  }
})
</script>
