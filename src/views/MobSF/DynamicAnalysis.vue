<template>
  <div class="max-w-4xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold text-center mb-6">Analyse Dynamique Android</h1>
    <DeviceSelector v-if="step === 'device'" @device-selected="onDeviceSelected" />
    <AppSelector v-if="step === 'app'" :device="selectedDevice" @app-selected="onAppSelected" />
    <AnalysisProgress
      v-if="step === 'progress'"
      :app="selectedApp"
      :device="selectedDevice"
      @analysis-complete="onAnalysisComplete"
    />
    <div v-if="step === 'result'">
      <h2 class="text-xl font-semibold mb-4">Rapport Dynamique</h2>
      <pre class="bg-gray-100 p-4 rounded">{{ JSON.stringify(analysisResult, null, 2) }}</pre>
      <button
        class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        @click="reset"
      >
        Nouvelle Analyse
      </button>
      <FridaLogsTerminal :hash="selectedApp.hash" v-if="selectedApp" />
      <LiveApiTerminal :hash="selectedApp.hash" v-if="selectedApp" />
      <LogcatTerminal :hash="selectedApp.hash" v-if="selectedApp" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import DeviceSelector from '../../components/MobSF/dynamicAnalysis/android/DeviceSelector.vue'
import AppSelector from '../../components/MobSF/dynamicAnalysis/android/AppSelector.vue'
import AnalysisProgress from '../../components/MobSF/dynamicAnalysis/android/AnalysisProgress.vue'
import FridaLogsTerminal from '../../components/MobSF/dynamicAnalysis/android/FridaLogsTerminal.vue'
import LiveApiTerminal from '../../components/MobSF/dynamicAnalysis/android/LiveApiTerminal.vue'
import LogcatTerminal from '../../components/MobSF/dynamicAnalysis/android/LogcatTerminal.vue'

export default defineComponent({
  name: 'DynamicAnalysis',
  components: {
    DeviceSelector,
    AppSelector,
    AnalysisProgress,
    FridaLogsTerminal,
    LiveApiTerminal,
    LogcatTerminal,
  },
  setup() {
    const step = ref<'device' | 'app' | 'progress' | 'result'>('result')
    const selectedDevice = ref<string | null>(null)
    const selectedApp = ref<any>(null)
    const analysisResult = ref<any>(null)

    function onDeviceSelected(device: string) {
      selectedDevice.value = device
      step.value = 'app'
    }
    function onAppSelected(app: any) {
      selectedApp.value = app
      step.value = 'progress'
    }
    function onAnalysisComplete(result: any) {
      analysisResult.value = result
      step.value = 'result'
    }
    function reset() {
      step.value = 'device'
      selectedDevice.value = null
      selectedApp.value = null
      analysisResult.value = null
    }
    return {
      step,
      selectedDevice,
      selectedApp,
      analysisResult,
      onDeviceSelected,
      onAppSelected,
      onAnalysisComplete,
      reset,
    }
  },
})
</script>

<style scoped>
/* Add modern styles as needed */
</style>
