<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold">Analyse en cours...</h2>
    <div class="bg-gray-100 rounded p-4 h-48 overflow-y-auto mb-2">
      <div v-for="(log, idx) in logs" :key="idx" class="text-xs text-gray-700 whitespace-pre-line">{{ log }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue'
import { dynamicAnalyzer } from '../../../../api/DynamicAnalyzer'
export default defineComponent({
  name: 'AnalysisProgress',
  props: {
    app: { type: Object as PropType<any>, required: true },
    device: { type: String as PropType<string>, required: true },
    config: {
      type: Object as PropType<{
        reinstall: boolean,
        install: boolean,
        rootCA: 'install' | 'remove',
        globalProxy: 'set' | 'unset',
        selectedFridaScripts: string[]
      }>,
      default: () => ({
        reinstall: true,
        install: true,
        rootCA: 'install',
        globalProxy: 'set',
        selectedFridaScripts: []
      })
    }
  },
  setup(props, { emit }) {
    const logs = ref<string[]>([])
    const running = ref(true)
    const fridaScripts = ref<string[]>([])
    const fridaScriptsContent = ref<string>('')

    async function runAnalysis() {
      logs.value.push('Initialisation de l\'environnement...')
      console.log('Device:', props.device)
      console.log('Application:', props.app)
      console.log('Configuration:', props.config)

      const service = dynamicAnalyzer
      const hash = props.app.MD5

      try {
        // Étape 1: Vérifier la connectivité de l'émulateur avec MobSFy
        logs.value.push('Vérification de la connectivité avec l\'émulateur...')
        const mobsfyResult = await service.mobsfy(props.device)

        if (mobsfyResult.status === 'ok') {
          logs.value.push(`Connecté à l'émulateur (Android ${mobsfyResult.android_version})`)
        } else {
          throw new Error('Échec de connexion à l\'émulateur')
        }

        // Étape 2: Configuration de l'environnement
        logs.value.push('Configuration de l\'environnement...')

        // Installer le certificat Root CA (si configuré)
        if (props.config.rootCA === 'install') {
          logs.value.push('Installation du certificat Root CA...')
          await service.rootCA('install')
          logs.value.push('Certificat Root CA installé avec succès')
        }

        // Configurer le proxy global (si configuré)
        if (props.config.globalProxy === 'set') {
          logs.value.push('Configuration du proxy global...')
          await service.globalProxy('set')
          logs.value.push('Proxy global configuré avec succès')
        }

        // Étape 3: Démarrer l'analyse
        logs.value.push('Lancement de l\'analyse dynamique...')
        await service.startAnalysis(
          hash,
          props.config.reinstall ? 1 : 0,
          props.config.install ? 1 : 0
        )
        logs.value.push('Analyse démarrée avec succès')

        // Étape 4: Exécuter les tests d'activité
        logs.value.push('Exécution des tests d\'activité...')
        await service.runActivityTest(hash, 'exported')
        logs.value.push('Tests des activités exportées terminés')

        await service.runActivityTest(hash, 'activity')
        logs.value.push('Tests des activités terminés')

        // Étape 5: Exécuter les tests TLS
        logs.value.push('Exécution des tests TLS/SSL...')
        await service.runTLSTests(hash)
        logs.value.push('Tests TLS/SSL terminés')

        // Étape 6: Lister les scripts Frida disponibles
        logs.value.push('Récupération des scripts Frida disponibles...')
        const fridaScriptsResult = await service.listFridaScripts('android')

        if (fridaScriptsResult.status === 'ok') {
          fridaScripts.value = fridaScriptsResult.files
          logs.value.push(`${fridaScripts.value.length} scripts Frida disponibles`)
        } else {
          throw new Error('Échec de récupération des scripts Frida')
        }

        // Étape 7: Charger le contenu des scripts Frida sélectionnés
        logs.value.push('Chargement des scripts Frida...')
        console.log(fridaScripts)
        // Charger les scripts par défaut
        for (const script of fridaScripts.value) {
          const scriptContent = await service.getFridaScript(script, 'android')
          if (scriptContent.status === 'ok') {
            fridaScriptsContent.value = fridaScriptsContent.value + scriptContent.content
            logs.value.push(`Script Frida '${script}' chargé`)
          }
        }

        // Étape 8: Instrumenter avec Frida
        logs.value.push('Instrumentation avec Frida...')
        console.log(fridaScriptsContent)
        // Paramètres d'instrumentation
        const instrumentationParams = {
          hash: hash,
          defaultHooks: ['api_monitor', 'ssl_pinning_bypass', 'root_bypass', 'debugger_check_bypass'],
          auxiliaryHooks: ['enum_class', 'string_catch', 'string_compare'],
          fridaCode: fridaScriptsContent.value
        }

        await service.instrumentFrida(instrumentationParams)
        logs.value.push('Instrumentation Frida appliquée')

        // Étape 9: Collecter les dépendances d'exécution
        logs.value.push('Collecte des dépendances d\'exécution...')
        await service.getFridaRuntimeDependencies(hash)
        logs.value.push('Dépendances d\'exécution collectées')

        // Étape 10: Afficher les logs Frida en continu
        logs.value.push('Récupération des logs Frida...')
        const fridaLogs = await service.getFridaLogs(hash)
        console.log(fridaLogs)
        if (fridaLogs && fridaLogs.length > 0) {
          logs.value.push('--- Logs Frida ---')
          fridaLogs.forEach((log: string) => {
            logs.value.push(log)
          })
        }
        /*
        const fridaAPIMonitorLogs = await service.getFridaAPIMonitor(hash)
        console.log(fridaAPIMonitorLogs)
         if (fridaAPIMonitorLogs && fridaAPIMonitorLogs.length > 0) {
          logs.value.push('--- Logs API Monitor ---')
          fridaAPIMonitorLogs.forEach((log: string) => {
            logs.value.push(log)
          })
        }  */

        // Étape 11: Arrêter l'analyse
        logs.value.push('Arrêt de l\'analyse...')
        await service.stopAnalysis(hash)
        logs.value.push('Analyse arrêtée avec succès')

        // Étape 12: Récupérer le rapport
        logs.value.push('Génération du rapport final...')
        const report = await service.getReport(hash)
        logs.value.push('Rapport généré avec succès')
        running.value = false
        // Notifier que l'analyse est terminée
        emit('analysis-complete', report)
        logs.value.push('Analyse terminée.')

      } catch (e: any) {
        logs.value.push('Erreur: ' + (e?.message || JSON.stringify(e)))
        emit('analysis-error', e)
        running.value = false
      }
    }

    onMounted(runAnalysis)

    return { logs, running }
  }
})
</script>
