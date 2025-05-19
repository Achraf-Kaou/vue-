<template>
  <div class="max-w p-4">

    <div class="space-y-6">
      <UploadApp
        v-if="currentStep === 'upload' || currentStep === 'analysis'"
        @file-uploaded="handleFileUploaded"
        @analysis-start="handleAnalysisStart"
      />

      <LogsTerminal
        v-if="currentStep === 'analysis'"
        :logs="logs"
        :is-analysis-complete="isAnalysisComplete"
        @analysis-complete="handleAnalysisComplete"
      />

      <div v-if="currentStep === 'report'">

        <AndroidStaticReport
          v-if="fileHash && analysisResults && isAndroidApp"
          :file-hash="fileHash"
          :report-data="analysisResults"
        />

        <iOSStaticReport
          v-if="fileHash && analysisResults && !isAndroidApp"
          :file-hash="fileHash"
          :report-data="analysisResults"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted, computed } from 'vue'
import UploadApp from '../../components/MobSF/general/upload/Upload.vue'
import LogsTerminal from '../../components/MobSF/base/Terminal.vue'
import staticAnalyzerService from '../../api/StaticAnalyzer'
import AndroidStaticReport from '../../components/MobSF/general/report/static/android/AndroidStaticReport.vue'
import iOSStaticReport from '../../components/MobSF/general/report/static/ios/iOSStaticReport.vue'

interface Log {
  message: string
  type: string
  prefix: string
}

export default defineComponent({
  name: 'MainAnalyzer',
  components: {
    UploadApp,
    LogsTerminal,
    AndroidStaticReport,
    iOSStaticReport,
  },
  setup() {
    const currentStep = ref('upload') // 'upload', 'analysis', 'report'
    const file = ref<File | null>(null)
    const logs = ref<Log[]>([])
    const isAnalysisComplete = ref(false)
    const fileHash = ref<string>('') // Changé de null à chaîne vide
    const analysisResults = ref<any>(null)
    const maxRetries = 50
    const retryTimeout = 20000 // 20 secondes
    let logInterval: number | null = null
    let consecutiveErrors = 0
    let isRetrying = false

    // Computed property pour déterminer si c'est une application Android
    const isAndroidApp = computed(() => {
      if (!file.value) return false

      const fileName = file.value.name.toLowerCase()
      return fileName.endsWith('.apk') || fileName.endsWith('.xapk')
    })

    const addLog = (message: string, type = 'info', prefix = '') => {
      logs.value.push({ message, type, prefix })
    }

    const handleFileUploaded = (uploadedFile: File) => {
      file.value = uploadedFile
    }

    const handleAnalysisStart = async () => {
      if (!file.value) return

      currentStep.value = 'analysis'
      logs.value = []
      isAnalysisComplete.value = false
      consecutiveErrors = 0
      fileHash.value = '' // Réinitialiser le hash
      analysisResults.value = null // Réinitialiser les résultats

      try {
        // ÉTAPE 1: Upload du fichier
        addLog("Démarrage de l'analyse de sécurité...", 'info', '[INFO] ')
        addLog("Téléchargement du fichier vers le serveur d'analyse...", 'info', '[INFO] ')

        const uploadResponse = await staticAnalyzerService.uploadFile(file.value)
        const hash = uploadResponse.data.hash
        if (hash) {
          fileHash.value = hash
          addLog('Fichier téléchargé avec succès!', 'success', '[SUCCÈS] ')

          // ÉTAPE 2: Lancement du scan
          addLog("Lancement de l'analyse statique...", 'info', '[INFO] ')
          await staticAnalyzerService.scanFile(hash)

          // ÉTAPE 3: Récupération des logs en temps réel
          let previousLogCount = 0

          // En Vue, nous devons utiliser window.setInterval au lieu de setInterval simple
          // pour pouvoir le nettoyer correctement après
          logInterval = window.setInterval(async () => {
            // Si nous sommes déjà en train de retenter, ne pas lancer une nouvelle tentative
            if (isRetrying) return

            try {
              if (!hash) {
                clearLogInterval()
                addLog('Erreur: Hash non défini', 'error', '[ERREUR] ')
                return
              }

              const logsResponse = await staticAnalyzerService.getScanLogs(hash)

              // Réinitialiser le compteur d'erreurs consécutives si la requête réussit
              consecutiveErrors = 0

              const scanLogs = logsResponse.data.logs || []

              // N'afficher que les nouveaux logs
              if (scanLogs.length > previousLogCount) {
                const newLogs = scanLogs.slice(previousLogCount)

                newLogs.forEach((logEntry) => {
                  processLogEntry(logEntry)
                })

                previousLogCount = scanLogs.length

                // Vérifier si l'analyse est terminée
                const isComplete = scanLogs.some((log) => {
                  if (typeof log === 'string') {
                    return log.includes('Saving to Database')
                  } else if (log && typeof log === 'object') {
                    const message = log.status || log.message || ''
                    return typeof message === 'string' && message.includes('Saving to Database')
                  }
                  return false
                })

                if (isComplete) {
                  handleAnalysisFinished(hash)
                }
              }
            } catch (error: any) {
              console.error('Erreur lors de la récupération des logs:', error)

              // Incrémenter le compteur d'erreurs consécutives
              consecutiveErrors++

              // Afficher l'erreur de façon plus concise
              const errorMessage =
                error.response?.data?.message || error.message || 'Erreur inconnue'
              addLog(
                `Erreur lors de la récupération des logs: ${errorMessage}`,
                'warning',
                '[ATTENTION] ',
              )

              // Si nous avons atteint trop d'erreurs consécutives, arrêter la vérification
              if (consecutiveErrors >= maxRetries) {
                clearLogInterval()

                // Tenter une dernière fois de récupérer le rapport
                if (hash) {
                  tryToGetFinalReport(hash)
                } else {
                  addLog(
                    "Impossible de continuer en raison d'erreurs réseau répétées.",
                    'error',
                    '[ERREUR] ',
                  )
                  isAnalysisComplete.value = true
                }
              } else {
                // Sinon, retenter dans un moment
                retryLogRetrieval(hash)
              }
            }
          }, 15000) // Vérifier toutes les 15 secondes
        } else {
          addLog('Erreur: Hash non reçu du serveur', 'error', '[ERREUR] ')
          isAnalysisComplete.value = true
        }
      } catch (error: any) {
        console.error("Erreur lors de l'analyse:", error)
        const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue'
        addLog(`Erreur lors de l'analyse: ${errorMessage}`, 'error', '[ERREUR] ')
        isAnalysisComplete.value = true // Marquer comme terminé même en cas d'erreur pour permettre à l'utilisateur de continuer
      }
    }

    const processLogEntry = (logEntry: any) => {
      // Vérifier que logEntry est bien un objet avec une propriété status
      if (logEntry && typeof logEntry === 'object') {
        console.log('Log Entry:', logEntry)

        const logMessage = logEntry.status || ''
        const logException = logEntry.exception ? `: ${logEntry.exception}` : ''
        const fullMessage = `${logEntry.timestamp || ''} ${logMessage}${logException}`.trim()

        // Déterminer le type de log en fonction du contenu
        let type = 'info'
        let prefix = '[INFO] '

        if (typeof fullMessage === 'string') {
          if (
            fullMessage.includes('ERROR') ||
            fullMessage.includes('VULNERABILITY') ||
            fullMessage.includes('ERREUR') ||
            fullMessage.includes('VULNÉRABILITÉ') ||
            logEntry.exception
          ) {
            type = 'error'
            prefix = '[ERREUR] '
          } else if (fullMessage.includes('WARNING') || fullMessage.includes('ATTENTION')) {
            type = 'warning'
            prefix = '[ATTENTION] '
          } else if (
            fullMessage.includes('SUCCESS') ||
            fullMessage.includes('COMPLETED') ||
            fullMessage.includes('SUCCÈS') ||
            fullMessage.includes('TERMINÉ')
          ) {
            type = 'success'
            prefix = '[SUCCÈS] '
          }

          addLog(fullMessage, type, prefix)
        }
      } else if (typeof logEntry === 'string') {
        // Gestion du cas où logEntry est une chaîne de caractères
        let type = 'info'
        let prefix = '[INFO] '

        if (
          logEntry.includes('ERROR') ||
          logEntry.includes('VULNERABILITY') ||
          logEntry.includes('ERREUR') ||
          logEntry.includes('VULNÉRABILITÉ')
        ) {
          type = 'error'
          prefix = '[ERREUR] '
        } else if (logEntry.includes('WARNING') || logEntry.includes('ATTENTION')) {
          type = 'warning'
          prefix = '[ATTENTION] '
        } else if (
          logEntry.includes('SUCCESS') ||
          logEntry.includes('COMPLETED') ||
          logEntry.includes('SUCCÈS') ||
          logEntry.includes('TERMINÉ')
        ) {
          type = 'success'
          prefix = '[SUCCÈS] '
        }

        addLog(logEntry, type, prefix)
      }
    }

    const retryLogRetrieval = (hash: string) => {
      if (!hash) return

      isRetrying = true
      addLog(
        `Erreur réseau, nouvelle tentative dans ${retryTimeout / 1000} secondes...`,
        'info',
        '[INFO] ',
      )

      setTimeout(async () => {
        try {
          const logsResponse = await staticAnalyzerService.getScanLogs(hash)
          consecutiveErrors = 0 // Réinitialiser le compteur

          // Traiter les logs si disponibles
          const scanLogs = logsResponse.data.logs || []
          scanLogs.forEach((logEntry) => {
            processLogEntry(logEntry)
          })

          // Vérifier si l'analyse est terminée
          const isComplete = scanLogs.some((log) => {
            if (typeof log === 'string') {
              return log.includes('Saving to Database')
            } else if (log && typeof log === 'object') {
              const message = log.status || log.message || ''
              return typeof message === 'string' && message.includes('Saving to Database')
            }
            return false
          })

          if (isComplete) {
            handleAnalysisFinished(hash)
          }
        } catch (error) {
          console.error('Erreur lors de la tentative de récupération:', error)
        } finally {
          isRetrying = false
        }
      }, retryTimeout)
    }

    const tryToGetFinalReport = async (hash: string) => {
      addLog('Tentative de récupération du rapport final...', 'info', '[INFO] ')

      try {
        // Attendre quelques secondes pour laisser le temps au serveur de terminer l'analyse
        setTimeout(async () => {
          try {
            const reportResponse = await staticAnalyzerService.getJsonReport(hash)
            if (reportResponse && reportResponse.data) {
              analysisResults.value = reportResponse.data
              console.log("Résultats de l'analyse:", reportResponse.data)
              addLog('Rapport récupéré avec succès!', 'success', '[SUCCÈS] ')
              isAnalysisComplete.value = true
              currentStep.value = 'report'
            } else {
              addLog('Rapport vide ou invalide reçu', 'warning', '[ATTENTION] ')
              isAnalysisComplete.value = true
            }
          } catch (finalError) {
            addLog(
              'Impossible de récupérer le rapport final. Veuillez réessayer plus tard.',
              'error',
              '[ERREUR] ',
            )
            isAnalysisComplete.value = true
          }
        }, 3000)
      } catch (error) {
        addLog(
          'Impossible de récupérer le rapport final. Veuillez réessayer plus tard.',
          'error',
          '[ERREUR] ',
        )
        isAnalysisComplete.value = true
      }
    }

    const handleAnalysisFinished = async (hash: string) => {
      clearLogInterval()
      addLog('Analyse terminée avec succès!', 'success', '[SUCCÈS] ')

      try {
        // Récupérer le rapport JSON
        const reportResponse = await staticAnalyzerService.getJsonReport(hash)
        if (reportResponse && reportResponse.data) {
          analysisResults.value = reportResponse.data
          console.log("Résultats de l'analyse:", reportResponse.data)
          isAnalysisComplete.value = true
          currentStep.value = 'report'
        } else {
          throw new Error('Réponse vide ou invalide')
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rapport:', error)
        addLog(
          'Erreur lors de la récupération du rapport. Tentative de récupération dans quelques secondes...',
          'warning',
          '[ATTENTION] ',
        )

        // Attendre quelques secondes avant de réessayer
        setTimeout(async () => {
          try {
            const reportResponse = await staticAnalyzerService.getJsonReport(hash)
            if (reportResponse && reportResponse.data) {
              analysisResults.value = reportResponse.data
              addLog('Rapport récupéré avec succès!', 'success', '[SUCCÈS] ')
              isAnalysisComplete.value = true
              currentStep.value = 'report'
            } else {
              throw new Error('Réponse vide ou invalide lors de la nouvelle tentative')
            }
          } catch (retryError) {
            addLog(
              "Impossible de récupérer le rapport. Veuillez consulter les résultats via l'interface MobSF.",
              'error',
              '[ERREUR] ',
            )
          } finally {
            isAnalysisComplete.value = true
            currentStep.value = 'report'
          }
        }, 3000)
      }
    }

    const clearLogInterval = () => {
      if (logInterval !== null) {
        clearInterval(logInterval)
        logInterval = null
      }
    }

    const handleAnalysisComplete = () => {
      console.log('Analyse terminée')
      isAnalysisComplete.value = true
      if (fileHash.value && analysisResults.value) {
        currentStep.value = 'report'
      } else {
        addLog("Impossible d'afficher le rapport: données manquantes", 'error', '[ERREUR] ')
      }
    }

    const handleBackToUpload = () => {
      currentStep.value = 'upload'
      file.value = null
      logs.value = []
      isAnalysisComplete.value = false
      fileHash.value = ''
      analysisResults.value = null
      consecutiveErrors = 0
    }

    // Nettoyage à la destruction du composant
    onUnmounted(() => {
      clearLogInterval()
    })

    return {
      currentStep,
      logs,
      isAnalysisComplete,
      fileHash,
      analysisResults,
      isAndroidApp,
      handleFileUploaded,
      handleAnalysisStart,
      handleAnalysisComplete,
      handleBackToUpload,
    }
  },
})
</script>

<style scoped>
/* Styles spécifiques au composant */
</style>
