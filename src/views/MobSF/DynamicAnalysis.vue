<template>
  <div class="max-w-auto mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold text-center mb-6">Analyse Dynamique Android</h1>

    <!-- Étape unifiée: sélection appareil, app et configuration -->
    <div v-if="step === 'setup'" class="bg-white rounded-lg shadow p-6">
      <!-- Sélection de l'appareil -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-4">Sélection de l'appareil</h2>
        <DeviceSelector @device-selected="selectedDevice = $event" />
      </div>

      <!-- Sélection de l'application -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-4">Sélection de l'application</h2>
        <AppSelector :device="selectedDevice" @app-selected="selectedApp = $event" />
      </div>

      <!-- Configuration d'analyse -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-4">Configuration d'analyse</h2>
        <div class="space-y-4">
          <!-- Les options réinstaller et installer sont commentées dans l'original -->
          <!-- <div class="flex items-center">
            <input
              type="checkbox"
              id="reinstall"
              v-model="config.reinstall"
              class="w-4 h-4 text-blue-600 rounded border-gray-300"
            >
            <label for="reinstall" class="ml-2 text-gray-700">Réinstaller l'application</label>
          </div>

          <div class="flex items-center">
            <input
              type="checkbox"
              id="install"
              v-model="config.install"
              class="w-4 h-4 text-blue-600 rounded border-gray-300"
            >
            <label for="install" class="ml-2 text-gray-700">Installer l'application</label>
          </div> -->

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Certificat Root CA</label>
            <div class="flex space-x-4">
              <div class="flex items-center">
                <input
                  type="radio"
                  id="rootca-install"
                  value="install"
                  v-model="config.rootCA"
                  class="w-4 h-4 text-blue-600 border-gray-300"
                >
                <label for="rootca-install" class="ml-2 text-gray-700">Installer</label>
              </div>
              <div class="flex items-center">
                <input
                  type="radio"
                  id="rootca-remove"
                  value="remove"
                  v-model="config.rootCA"
                  class="w-4 h-4 text-blue-600 border-gray-300"
                >
                <label for="rootca-remove" class="ml-2 text-gray-700">Supprimer</label>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Proxy Global</label>
            <div class="flex space-x-4">
              <div class="flex items-center">
                <input
                  type="radio"
                  id="proxy-set"
                  value="set"
                  v-model="config.globalProxy"
                  class="w-4 h-4 text-blue-600 border-gray-300"
                >
                <label for="proxy-set" class="ml-2 text-gray-700">Définir</label>
              </div>
              <div class="flex items-center">
                <input
                  type="radio"
                  id="proxy-unset"
                  value="unset"
                  v-model="config.globalProxy"
                  class="w-4 h-4 text-blue-600 border-gray-300"
                >
                <label for="proxy-unset" class="ml-2 text-gray-700">Retirer</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Résumé des sélections -->
      <div v-if="selectedDevice || selectedApp" class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 class="text-lg font-medium mb-2">Résumé de la sélection</h3>
        <div class="space-y-2">
          <div class="flex">
            <span class="font-medium w-32">Appareil:</span>
            <span v-if="selectedDevice" class="text-blue-600">{{ selectedDevice }}</span>
            <span v-else class="text-gray-400 italic">Non sélectionné</span>
          </div>
          <div class="flex">
            <span class="font-medium w-32">Application:</span>
            <div v-if="selectedApp" class="flex-1">
              <div class="text-blue-600">{{ selectedApp.APP_NAME }}</div>
              <div class="text-xs text-gray-500">{{ selectedApp.PACKAGE }}</div>
              <div class="text-xs text-gray-500">MD5: {{ selectedApp.MD5 }}</div>
            </div>
            <span v-else class="text-gray-400 italic">Non sélectionnée</span>
          </div>
        </div>
      </div>

      <!-- Bouton pour démarrer l'analyse -->
      <div class="mt-6" v-if="isSetupComplete">
        <button
          @click="startAnalysis"
          :disabled="!isSetupComplete"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <div v-if="selectedApp && selectedApp.DYNAMIC_REPORT_EXISTS">Voir Rapport</div>
          <div v-else>Démarrer l'analyse</div>
        </button>
      </div>
    </div>

    <!-- Étape de progression -->
    <AnalysisProgress
      v-if="step === 'progress'"
      :app="selectedApp"
      :device="selectedDevice"
      :config="config"
      @analysis-complete="onAnalysisComplete"
    />

    <!-- Étape de résultat -->
    <div v-if="step === 'result'" class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Rapport d'Analyse Dynamique</h2>
      <AndroidDynamicReport :reportData="analysisResult" :hash="selectedApp.MD5" />
      <div class="mt-6">
        <button
          @click="reset"
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Nouvelle analyse
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import DeviceSelector from '../../components/MobSF/dynamicAnalysis/android/DeviceSelector.vue'
import AppSelector from '../../components/MobSF/dynamicAnalysis/android/AppSelector.vue'
import AnalysisProgress from '../../components/MobSF/dynamicAnalysis/android/AnalysisProgress.vue'
import AndroidDynamicReport from '../../components/MobSF/general/report/dynamic/android/AndroidDynamicReport.vue'
import { dynamicAnalyzer } from '../../api/DynamicAnalyzer'

export default defineComponent({
  name: 'DynamicAnalysis',
  components: {
    DeviceSelector,
    AppSelector,
    AnalysisProgress,
    AndroidDynamicReport,
  },
  setup() {
    const step = ref<'setup' | 'progress' | 'result'>('setup')
    const selectedDevice = ref<string | null>(null)
    const selectedApp = ref<any>(null)
    const analysisResult = ref<any>(null)
    const config = ref({
      reinstall: true,
      install: true,
      rootCA: 'install',
      globalProxy: 'set',
      selectedFridaScripts: [] // Maintenu pour compatibilité, mais non utilisé dans l'interface
    })
    const service = dynamicAnalyzer

    const isSetupComplete = computed(() => {
      return selectedDevice.value && selectedApp.value;
    })

    async function startAnalysis() {
      if (!isSetupComplete.value) return;

      if (selectedApp.value.DYNAMIC_REPORT_EXISTS) {
        const report = await service.getReport(selectedApp.value.MD5)
        onAnalysisComplete(report)
      } else {
        step.value = 'progress'
      }
    }

    function onAnalysisComplete(result: any) {
      analysisResult.value = result
      step.value = 'result'
    }

    function reset() {
      step.value = 'setup'
      selectedDevice.value = null
      selectedApp.value = null
      analysisResult.value = null
      config.value = {
        reinstall: true,
        install: true,
        rootCA: 'install',
        globalProxy: 'set',
        selectedFridaScripts: []
      }
    }

    return {
      step,
      selectedDevice,
      selectedApp,
      analysisResult,
      config,
      isSetupComplete,
      startAnalysis,
      onAnalysisComplete,
      reset,
    }
  },
})
</script>

<style scoped>
/* Styles modernes */
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
</style>
