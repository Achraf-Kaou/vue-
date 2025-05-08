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
              <tr v-for="(item, index) in displayedItems" :key="index" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ index + 1 }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ item.issue }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  <div
                    v-for="(file, fileIndex) in item.files.slice(
                      0,
                      showMoreFiles[index] ? item.files.length : 3,
                    )"
                    :key="fileIndex"
                    class="text-blue-600 hover:underline cursor-pointer"
                    @click="viewFile(file.file_path, file.type, file.hash)"
                  >
                    {{ file.file_path }}
                  </div>
                  <button
                    v-if="item.files.length > 3"
                    @click="toggleShowMore(index)"
                    class="text-sm text-gray-500 hover:text-gray-700 mt-1"
                  >
                    {{ showMoreFiles[index] ? 'Show less' : `Show ${item.files.length - 3} more` }}
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

interface FileInfo {
  file_path: string
  type?: string
  hash?: string
}

interface AnalysisItem {
  issue: string
  files: FileInfo[]
}

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  appType: {
    type: String,
    default: '',
  },
})

// Access the data from props or use a default value
const fileAnalysis = computed<AnalysisItem[]>(() => {
  return props.data.file_analysis
})

// Search functionality
const searchQuery = ref('')

const filteredAnalysis = computed(() => {
  if (!searchQuery.value) {
    return fileAnalysis.value
  }

  const query = searchQuery.value.toLowerCase()
  return fileAnalysis.value.filter(
    (item) =>
      item.issue.toLowerCase().includes(query) ||
      item.files.some((file) => file.file_path.toLowerCase().includes(query)),
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

// Function to view file details
const viewFile = (filePath: string, fileType?: string, hash?: string) => {
  if (!fileType || !hash) return

  const url = `/view_file_ios?file=${encodeURIComponent(filePath)}&type=${fileType}&md5=${hash}`
  window.location.href = url
}
</script>
