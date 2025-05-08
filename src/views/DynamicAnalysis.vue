<template>
  <div class="dynamic-analysis">
    <h1>Dynamic Analysis</h1>

    <div v-if="loading" class="loading">Loading available apps...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="apps-container">
      <div class="emulator-section">
        <h2>Select Emulator</h2>
        <select v-model="selectedEmulator" class="emulator-select">
          <option
            v-for="emulator in emulators"
            :key="emulator.identifier"
            :value="emulator.identifier"
          >
            {{ emulator.identifier }}
          </option>
        </select>
      </div>

      <div class="apps-section">
        <h2>Available Apps</h2>
        <div class="apps-grid">
          <div v-for="app in apps" :key="app.MD5" class="app-card" @click="selectApp(app)">
            <h3>{{ app.APP_NAME }}</h3>
            <p>Package: {{ app.PACKAGE_NAME }}</p>
            <p>Version: {{ app.VERSION_NAME }}</p>
          </div>
        </div>
      </div>

      <div v-if="selectedApp" class="selected-app">
        <h2>Selected App</h2>
        <div class="app-details">
          <p><strong>Name:</strong> {{ selectedApp.APP_NAME }}</p>
          <p><strong>Package:</strong> {{ selectedApp.PACKAGE_NAME }}</p>
          <p><strong>Version:</strong> {{ selectedApp.VERSION_NAME }}</p>
          <p><strong>MD5:</strong> {{ selectedApp.MD5 }}</p>
        </div>
        <button @click="startAnalysis" class="start-button" :disabled="!selectedEmulator">
          Start Analysis
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { dynamicAnalyzer } from '../api/DynamicAnalyzer'

export default defineComponent({
  name: 'DynamicAnalysis',
  setup() {
    const router = useRouter()
    const loading = ref(true)
    const error = ref('')
    const apps = ref([])
    const emulators = ref([])
    const selectedEmulator = ref('')
    const selectedApp = ref(null)

    const fetchApps = async () => {
      try {
        const response = await dynamicAnalyzer.getApps()
        apps.value = response.apps
        console.log(response)
        emulators.value = [{ identifier: response.identifier }]
        selectedEmulator.value = response.identifier
      } catch (err) {
        error.value = 'Failed to fetch available apps'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const selectApp = (app) => {
      selectedApp.value = app
    }

    const startAnalysis = async () => {
      if (!selectedApp.value || !selectedEmulator.value) return

      try {
        // Start the analysis
        await dynamicAnalyzer.startAnalysis(selectedApp.value.MD5)

        // Navigate to the analysis progress view
        router.push({
          name: 'DynamicAnalysisProgress',
          params: {
            hash: selectedApp.value.MD5,
            package: selectedApp.value.PACKAGE_NAME,
          },
        })
      } catch (err) {
        error.value = 'Failed to start analysis'
        console.error(err)
      }
    }

    onMounted(fetchApps)

    return {
      loading,
      error,
      apps,
      emulators,
      selectedEmulator,
      selectedApp,
      selectApp,
      startAnalysis,
    }
  },
})
</script>

<style scoped>
.dynamic-analysis {
  padding: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}

.error {
  color: red;
}

.apps-container {
  max-width: 1200px;
  margin: 0 auto;
}

.emulator-section {
  margin-bottom: 30px;
}

.emulator-select {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  font-size: 1.1em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.app-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.app-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.app-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.app-card p {
  margin: 5px 0;
  color: #666;
}

.selected-app {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.app-details {
  margin-bottom: 20px;
}

.app-details p {
  margin: 5px 0;
}

.start-button {
  background-color: #4caf50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s ease;
}

.start-button:hover {
  background-color: #45a049;
}

.start-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
