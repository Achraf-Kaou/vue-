<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6 flex items-center">
        <Key class="w-5 h-5 mr-2 text-gray-700" />
        <span class="font-bold text-lg">POSSIBLE HARDCODED SECRETS</span>
      </div>
      <ul v-if="processedSecrets.length > 0" class="space-y-4">
        <li
          v-for="(secret, index) in processedSecrets"
          :key="index"
          class="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:bg-gray-100 transition-colors"
        >
          <div class="text-sm text-gray-800 font-mono break-all">
            <span class="text-red-600 font-semibold">Secret:</span> {{ secret.value }}
          </div>
          <div class="text-xs text-gray-600 mt-1">
            <span class="font-semibold">Type:</span> {{ secret.type }}
          </div>
        </li>
      </ul>
      <div
        v-else
        class="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200"
      >
        <Key class="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p>No hardcoded secrets found in this application.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Key } from 'lucide-vue-next'

// Define props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

// Process the secrets to create a consistent format
const processedSecrets = computed(() => {
  if (!props.data || !props.data.secrets) return []

  return props.data.secrets.map((secret, index) => {
    // Clean the string if it has quotes
    const cleanValue = secret.replace(/^"(.+(?="$))"$/, '$1')

    // Detect type of secret
    let type = 'Unknown'
    if (cleanValue.includes('api_key') || cleanValue.includes('ApiKey')) {
      type = 'API Key'
    } else if (cleanValue.match(/^AIza[0-9A-Za-z-_]{35}$/)) {
      type = 'Google API Key'
    } else if (cleanValue.match(/^[A-Za-z0-9+/=]{44}$/)) {
      type = 'Base64 Encoded String'
    } else if (cleanValue.match(/^[0-9a-f]{32}$/)) {
      type = 'MD5 Hash'
    } else if (cleanValue.match(/^[0-9a-f]{64}$/)) {
      type = 'SHA-256 Hash'
    } else if (cleanValue.startsWith('30820')) {
      type = 'Certificate/Key Data'
    } else if (cleanValue.match(/^[0-9a-f-]{36}$/)) {
      type = 'UUID'
    } else if (cleanValue.startsWith('aHR0')) {
      type = 'Base64 URL'
    } else if (cleanValue.length > 100) {
      type = 'Long String (Possibly Encrypted)'
    }

    return {
      value: cleanValue,
      type: type,
    }
  })
})
</script>
