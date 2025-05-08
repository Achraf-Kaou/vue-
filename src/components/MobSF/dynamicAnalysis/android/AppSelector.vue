<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold">Sélectionnez une application à analyser</h2>
    <div v-if="loading" class="text-gray-500">Chargement des applications...</div>
    <div v-else>
      <ul class="space-y-2">
        <li v-for="app in apps" :key="app.hash">
          <button class="w-full text-left bg-white border rounded px-4 py-2 hover:bg-blue-50" @click="$emit('app-selected', app)">
            {{ app.label || app.package || app.hash }}
          </button>
        </li>
      </ul>
      <div v-if="apps.length === 0" class="text-gray-400">Aucune application trouvée sur l'appareil.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue'
import { DynamicAnalyzerService } from '../../../../api/DynamicAnalyzer'

export default defineComponent({
  name: 'AppSelector',
  props: {
    device: {
      type: String as PropType<string>,
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
        const service = new DynamicAnalyzerService()
        const resp = await service.getApps() // adapt as needed for device
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
