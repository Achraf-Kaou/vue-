<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold">Sélectionnez un appareil Android</h2>
    <div v-if="loading" class="text-gray-500">Chargement des appareils...</div>
    <div v-else>
      <ul class="space-y-2">
        <li v-for="device in devices" :key="device.identifier">
          <button class="w-full text-left bg-white border rounded px-4 py-2 hover:bg-blue-50" @click="$emit('device-selected', device.identifier)">
            {{ device.name || device.identifier }}
          </button>
        </li>
      </ul>
      <div v-if="devices.length === 0" class="text-gray-400">Aucun appareil détecté.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { DynamicAnalyzerService } from '../../../../api/DynamicAnalyzer'

export default defineComponent({
  name: 'DeviceSelector',
  setup(_, { emit }) {
    const devices = ref<any[]>([])
    const loading = ref(true)
    onMounted(async () => {
      loading.value = true
      try {
        // Replace with actual API call to list devices
        const service = new DynamicAnalyzerService()
        const resp = await service.getApps() // getApps returns available devices/apps
        devices.value = resp.devices || resp // adapt as needed
      } catch (e) {
        devices.value = []
      } finally {
        loading.value = false
      }
    })
    return { devices, loading }
  }
})
</script>
