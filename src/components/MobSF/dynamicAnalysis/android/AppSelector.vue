<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold">Sélectionnez une application à analyser</h2>
    <div v-if="loading" class="text-gray-500">Chargement des applications...</div>
    <div v-else class="apps-section">
      <div class="apps-grid">
        <div
          v-for="app in apps"
          :key="app.MD5"
          class="app-card"
          @click="$emit('app-selected', app)"
        >
          <div class="flex items-center space-x-3">
            <img
              :src="`http://localhost:8089/download/${app.ICON_PATH}`"
              alt="App Icon"
              class="w-10 h-10 object-contain"
            />
            <h3 class="text-lg font-semibold truncate">{{ app.APP_NAME }}</h3>
          </div>
          <p class="text-sm text-gray-600 truncate">Package: {{ app.PACKAGE_NAME }}</p>
          <p class="text-sm text-gray-600">Version: {{ app.VERSION_NAME }}</p>
          <p class="text-sm mt-1">
            Rapport existant :
            <span :class="app.DYNAMIC_REPORT_EXISTS ? 'text-green-600' : 'text-red-600'">
              {{ app.DYNAMIC_REPORT_EXISTS ? 'Oui' : 'Non' }}
            </span>
          </p>
        </div>
      </div>
      <div v-if="apps.length === 0" class="text-gray-400">Aucune application trouvée sur l'appareil.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue'
import { dynamicAnalyzer } from '../../../../api/DynamicAnalyzer'

export default defineComponent({
  name: 'AppSelector',
  props: {
    device: {
      type: String as PropType<string|null>,
      required: true
    }
  },
  setup(props) {
    const apps = ref<any[]>([])
    const loading = ref(true)
    onMounted(async () => {
      loading.value = true
      try {
        // Replace with actual API call to list apps for the device
        const service = dynamicAnalyzer
        const resp = await service.getApps() // adapt as needed for device
        console.log(resp)
        apps.value = resp.apps || resp // adapt as needed
      } catch (e) {
        apps.value = []
      } finally {
        loading.value = false
      }
    })
    return { apps, loading }
  }
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