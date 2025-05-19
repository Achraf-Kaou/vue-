<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Tabs Navigation -->
      <div class="flex border-b border-gray-200">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 text-sm font-medium',
            activeTab === tab.id
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <i :class="['mr-1', tab.icon]"></i>
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-4">
        <!-- Clipboard Tab -->
        <div v-if="activeTab === 'clipboard'" class="space-y-2">
          <div class="flex items-center text-lg font-bold text-gray-800 mb-4">
            <i class="fas fa-paste mr-2"></i>
            <span>Clipboard Dump</span>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div v-if="clipboard.length" class="space-y-1">
              <div v-for="(item, index) in clipboard" :key="index" class="text-sm">
                {{ item }}
              </div>
            </div>
            <div v-else class="text-gray-500 italic">No clipboard data available</div>
          </div>
        </div>

        <!-- URLs Tab -->
        <div v-if="activeTab === 'urls'" class="space-y-2">
          <div class="flex items-center text-lg font-bold text-gray-800 mb-4">
            <i class="fas fa-globe mr-2"></i>
            <span>URLs</span>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div v-if="urls.length" class="space-y-1">
              <div v-for="(url, index) in urls" :key="index" class="text-sm break-all">
                <a :href="url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                  {{ url }}
                </a>
              </div>
            </div>
            <div v-else class="text-gray-500 italic">No URLs available</div>
          </div>
        </div>

        <!-- Emails Tab -->
        <div v-if="activeTab === 'emails'" class="space-y-2">
          <div class="flex items-center text-lg font-bold text-gray-800 mb-4">
            <i class="fas fa-envelope mr-2"></i>
            <span>Emails</span>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div v-if="emails.length" class="space-y-1">
              <div v-for="(email, index) in emails" :key="index" class="text-sm">
                <a :href="`mailto:${email}`" class="text-blue-600 hover:underline">
                  {{ email }}
                </a>
              </div>
            </div>
            <div v-else class="text-gray-500 italic">No emails available</div>
          </div>
        </div>

        <!-- Trackers Tab -->
        <div v-if="activeTab === 'trackers'" class="space-y-2">
          <div class="flex items-center text-lg font-bold text-gray-800 mb-4">
            <i class="fas fa-user-secret mr-2"></i>
            <span>Trackers</span>
          </div>
          <div class="overflow-x-auto">
            <table v-if="trackers.length" class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracker Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categories
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(tracker, index) in trackers" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ tracker.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ tracker.categories }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a :href="tracker.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                      {{ tracker.url }}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-gray-500 italic p-4">No trackers available</div>
          </div>
        </div>

        <!-- Base64 Tab -->
        <div v-if="activeTab === 'base64'" class="space-y-2">
          <div class="flex items-center text-lg font-bold text-gray-800 mb-4">
            <i class="fas fa-puzzle-piece mr-2"></i>
            <span>Base64 Strings Decoded</span>
          </div>
          <div class="overflow-x-auto">
            <table v-if="base64Strings.length" class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Called
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Decoded String
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(b64, index) in base64Strings" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ b64[0] }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 break-all">
                    {{ b64[1].slice(0, 500) }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-gray-500 italic p-4">No Base64 strings available</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reconnaissance',
  props: {
    clipboard: {
      type: Array,
      default: () => []
    },
    urls: {
      type: Array,
      default: () => []
    },
    emails: {
      type: Array,
      default: () => []
    },
    trackers: {
      type: Array,
      default: () => []
    },
    base64Strings: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeTab: 'clipboard',
      tabs: [
        { id: 'clipboard', label: 'Clipboard' },
        { id: 'urls', label: 'URLs' },
        { id: 'emails', label: 'Emails' },
        { id: 'trackers', label: 'Trackers' },
        { id: 'base64', label: 'Base64' }
      ],
    }
  },
  mounted() {
    console.log('Reconnaissance component mounted with props:', this.$props);
  }
}
</script>
