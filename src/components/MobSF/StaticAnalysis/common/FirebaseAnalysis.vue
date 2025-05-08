<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <Database class="w-5 h-5 mr-2 text-gray-700" />
          <span class="font-bold text-lg">FIREBASE DATABASE ANALYSIS</span>
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2"
            placeholder="Search issues..."
            v-model="searchQuery"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gray-50">
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                TITLE
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                SEVERITY
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                DESCRIPTION
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredAnalysis.length === 0">
              <td colspan="3" class="px-4 py-6 text-center text-gray-500">
                No issues found matching "{{ searchQuery }}"
              </td>
            </tr>
            <template v-else>
              <tr v-for="item in displayedItems" :key="item.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-700 font-medium">
                  {{ item.title }}
                </td>
                <td class="px-4 py-3 text-sm">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                    :class="getSeverityBadgeClass(item.severity)"
                  >
                    {{ item.severity }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.description }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <div v-if="hasMoreItems" class="flex justify-center mt-4">
          <button
            @click="loadMore"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Load More
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Database } from 'lucide-vue-next'

interface FirebaseIssue {
  id: number
  title: string
  severity: 'high' | 'warning' | 'info' | 'secure'
  description: string
}

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

// Access the data from props
const firebaseUrls = computed<FirebaseIssue[]>(() => {
  if (!props.data || !props.data.firebase_urls) {
    // Fallback data if props.data is not available
    return [
      {
        id: 1,
        title: 'Insecure Firebase Database Rule',
        severity: 'high',
        description:
          "The Firebase database has '.read' and '.write' rules set to 'true', allowing public access without authentication.",
      },
      {
        id: 2,
        title: 'Firebase API Key Exposure',
        severity: 'high',
        description:
          'The Firebase API key is exposed in the client-side code without restrictions, allowing potential abuse.',
      },
    ]
  }

  // Map the firebase_urls data structure to match the FirebaseIssue interface
  return props.data.firebase_urls.map((item: any, index: number) => ({
    id: index + 1,
    title: item.title,
    severity: item.severity,
    description: item.description,
  }))
})

// Search functionality
const searchQuery = ref('')

const filteredAnalysis = computed(() => {
  return firebaseUrls.value.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.severity.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// Lazy loading implementation
const itemsPerPage = 10
const currentPage = ref(1)

const displayedItems = computed(() => {
  return filteredAnalysis.value.slice(0, currentPage.value * itemsPerPage)
})

const hasMoreItems = computed(() => {
  return displayedItems.value.length < filteredAnalysis.value.length
})

const loadMore = () => {
  currentPage.value++
}

// Severity badge styling
const getSeverityBadgeClass = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-600'
    case 'warning':
      return 'bg-yellow-500'
    case 'info':
      return 'bg-blue-500'
    case 'secure':
      return 'bg-green-600'
    default:
      return 'bg-gray-500'
  }
}
</script>
