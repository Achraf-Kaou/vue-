<template>
  <div class="dynamic-analysis-progress">
    <h1>Dynamic Analysis Progress</h1>

    <div class="progress-container">
      <div class="status-section">
        <h2>Analysis Status</h2>
        <div class="status-grid">
          <div class="status-item" :class="{ 'status-success': rootCAStatus === 'installed' }">
            <h3>Root CA</h3>
            <p>{{ rootCAStatus || 'Pending' }}</p>
          </div>
          <div class="status-item" :class="{ 'status-success': proxyStatus === 'set' }">
            <h3>Global Proxy</h3>
            <p>{{ proxyStatus || 'Pending' }}</p>
          </div>
          <div class="status-item" :class="{ 'status-success': fridaStatus === 'running' }">
            <h3>Frida</h3>
            <p>{{ fridaStatus || 'Pending' }}</p>
          </div>
        </div>
      </div>

      <div class="terminal-section">
        <h2>Analysis Logs</h2>
        <Terminal :logs="terminalLogs" />
      </div>

      <div class="actions">
        <button @click="stopAnalysis" class="stop-button" :disabled="analysisComplete">
          Stop Analysis
        </button>
        <button v-if="analysisComplete" @click="viewReport" class="report-button">
          View Report
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dynamicAnalyzer } from '@/api/DynamicAnalyzer'
import Terminal from '@/components/base/Terminal.vue'

interface TerminalLog {
  type: 'info' | 'error' | 'success'
  message: string
  timestamp: Date
}

export default defineComponent({
  name: 'DynamicAnalysisProgress',
  components: {
    Terminal,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const hash = route.params.hash as string
    const packageName = route.params.package as string

    const rootCAStatus = ref('')
    const proxyStatus = ref('')
    const fridaStatus = ref('')
    const terminalLogs = ref<TerminalLog[]>([])
    const analysisComplete = ref(false)

    const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
      terminalLogs.value.push({
        type,
        message,
        timestamp: new Date(),
      })
    }

    const setupEnvironment = async () => {
      try {
        // Install Root CA
        await dynamicAnalyzer.rootCA('install')
        rootCAStatus.value = 'installed'
        addLog('Root CA installed successfully')

        // Configure global proxy
        await dynamicAnalyzer.globalProxy('set')
        proxyStatus.value = 'set'
        addLog('Global proxy configured successfully')

        // Start Frida instrumentation
        await dynamicAnalyzer.instrumentFrida({
          package_name: route.params.package as string,
          default_hooks: true,
          auxiliary_hooks: true,
          frida_code: '',
          class_name: '',
          class_method: '',
        })
        fridaStatus.value = 'running'
        addLog('Frida instrumentation started successfully')

        // Start monitoring logs
        startLogMonitoring()
      } catch (err) {
        const error = err as Error
        addLog(`Error: ${error.message}`, 'error')
        if (error.message.includes('Root CA')) rootCAStatus.value = 'error'
        if (error.message.includes('proxy')) proxyStatus.value = 'error'
        if (error.message.includes('Frida')) fridaStatus.value = 'error'
      }
    }

    const startLogMonitoring = () => {
      logInterval = setInterval(async () => {
        try {
          const response = await dynamicAnalyzer.getLogcat(route.params.package as string)
          if (response.logs) {
            addLog(response.logs)
          }
        } catch (err) {
          const error = err as Error
          addLog(`Error fetching logs: ${error.message}`, 'error')
        }
      }, 5000)
    }

    const stopAnalysis = async () => {
      try {
        await dynamicAnalyzer.stopAnalysis()
        addLog('Analysis stopped successfully')
        router.push({ name: 'DynamicAnalysis' })
      } catch (err) {
        const error = err as Error
        addLog(`Error stopping analysis: ${error.message}`, 'error')
      }
    }

    const viewReport = () => {
      router.push({
        name: 'DynamicAnalysisReport',
        params: { hash: route.params.hash },
      })
    }

    onMounted(() => {
      setupEnvironment()
    })

    return {
      rootCAStatus,
      proxyStatus,
      fridaStatus,
      terminalLogs,
      analysisComplete,
      stopAnalysis,
      viewReport,
    }
  },
})
</script>

<style scoped>
.dynamic-analysis-progress {
  padding: 20px;
}

.progress-container {
  max-width: 1200px;
  margin: 0 auto;
}

.status-section {
  margin-bottom: 30px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.status-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

.status-item h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.status-item p {
  margin: 0;
  color: #666;
}

.status-success {
  background-color: #e8f5e9;
  border-color: #4caf50;
}

.terminal-section {
  margin: 30px 0;
}

.actions {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.stop-button,
.report-button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s ease;
}

.stop-button {
  background-color: #f44336;
  color: white;
}

.stop-button:hover {
  background-color: #d32f2f;
}

.stop-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.report-button {
  background-color: #2196f3;
  color: white;
}

.report-button:hover {
  background-color: #1976d2;
}
</style>
