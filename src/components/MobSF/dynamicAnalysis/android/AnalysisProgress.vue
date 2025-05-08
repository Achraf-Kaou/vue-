<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold">Analyse en cours...</h2>
    <div class="bg-gray-100 rounded p-4 h-48 overflow-y-auto mb-2">
      <div v-for="(log, idx) in logs" :key="idx" class="text-xs text-gray-700 whitespace-pre-line">{{ log }}</div>
    </div>
    <div v-if="!running" class="text-green-600 font-semibold">Analyse terminée !</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue'
import { DynamicAnalyzerService } from '../../../../api/DynamicAnalyzer'

export default defineComponent({
  name: 'AnalysisProgress',
  props: {
    app: { type: Object as PropType<any>, required: true },
    device: { type: String as PropType<string>, required: true }
  },
  emits: ['analysis-complete'],
  setup(props, { emit }) {
    const logs = ref<string[]>([])
    const running = ref(true)
    async function runAnalysis() {
      logs.value.push('Initialisation de l\'environnement...')
      const service = new DynamicAnalyzerService()
      try {
        logs.value.push('MobSFy de l\'environnement...')
        await service.mobsfy(props.device)
        logs.value.push('Lancement de l\'analyse dynamique...')
        // Automate all analysis steps/scripts
        await service.runTLSTests(props.app.hash)
        logs.value.push('Tests TLS/SSL terminés.')
        await service.fridaGetDependencies(props.app.hash)
        logs.value.push('Dépendances Frida collectées.')
        await service.fridaListScripts('android')
        logs.value.push('Scripts Frida listés.')
        await service.getDynamicReport(props.app.hash)
        logs.value.push('Rapport dynamique généré.')
        const report = await service.getDynamicReport(props.app.hash)
        logs.value.push('Analyse terminée.')
        emit('analysis-complete', report)
      } catch (e: any) {
        logs.value.push('Erreur: ' + (e?.message || e))
        emit('analysis-complete', null)
      } finally {
        running.value = false
      }
    }
    onMounted(runAnalysis)
    return { logs, running }
  }
})
</script>
