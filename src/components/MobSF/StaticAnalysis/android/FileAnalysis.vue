<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <FileText class="w-5 h-5 mr-2 text-gray-700" />
          <span class="font-bold text-lg">FILE ANALYSIS</span>
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2"
            placeholder="Search issues or files..."
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
                NO
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ISSUE
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                FILES
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
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.id }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.finding }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  <div
                    v-for="(file, index) in item.files.slice(
                      0,
                      showMoreFiles[item.id] ? item.files.length : 3,
                    )"
                    :key="index"
                    class="text-blue-600 hover:underline cursor-pointer"
                  >
                    {{ file }}
                  </div>
                  <button
                    v-if="item.files.length > 3"
                    @click="toggleShowMore(item.id)"
                    class="text-sm text-gray-500 hover:text-gray-700 mt-1"
                  >
                    {{
                      showMoreFiles[item.id] ? 'Show less' : `Show ${item.files.length - 3} more`
                    }}
                  </button>
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
import { ref, computed, reactive } from 'vue'
import { Search, FileText } from 'lucide-vue-next'

interface AnalysisItem {
  id: number
  finding: string
  files: string[]
}

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})
console.log('FileAnalysis props:', props.data.file_analysis)
// Access the data from props
const fileAnalysis = computed<AnalysisItem[]>(() => {
  if (!props.data || !props.data.file_analysis) {
    // Fallback data if props.data is not available
    return [
      {
        id: 1,
        finding: 'Self-signed certificate found in application resources',
        files: ['assets/certs/debug.pem', 'res/raw/selfsigned.crt'],
      },
      {
        id: 2,
        finding: 'Hardcoded API keys detected in source code',
        files: [
          'src/main/java/com/example/app/Constants.java',
          'src/main/java/com/example/app/ApiClient.java',
          'src/main/java/com/example/app/NetworkUtils.java',
        ],
      },
      // Other fallback items...
    ]
  }

  // Map the file_analysis data structure to match the AnalysisItem interface
  return props.data.file_analysis.map((item: any, index: number) => ({
    id: index + 1,
    finding: item.finding,
    files: item.files || [],
  }))
})

// Search functionality
const searchQuery = ref('')

const filteredAnalysis = computed(() => {
  return fileAnalysis.value.filter(
    (item) =>
      item.finding?.toLowerCase().includes(searchQuery.value?.toLowerCase()) ||
      item.files.some(
        (file) =>
          typeof file === 'string' && file.toLowerCase().includes(searchQuery.value?.toLowerCase()),
      ),
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

// Show more files functionality
const showMoreFiles = reactive<Record<number, boolean>>({})

const toggleShowMore = (itemId: number) => {
  showMoreFiles[itemId] = !showMoreFiles[itemId]
}
</script>
