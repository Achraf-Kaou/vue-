<template>
  <div class="dynamic-analysis-report">
    <h1>Dynamic Analysis Report</h1>

    <div v-if="loading" class="loading">Loading report...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="report-container">
      <div class="report-section">
        <h2>Analysis Report</h2>
        <div class="json-viewer">
          <pre>{{ JSON.stringify(report, null, 2) }}</pre>
        </div>
      </div>

      <div class="source-files-section">
        <h2>Source Files</h2>
        <div class="file-list">
          <div v-for="file in sourceFiles" :key="file.path" class="file-item">
            <div class="file-header" @click="toggleFile(file)">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-type">{{ file.type }}</span>
            </div>
            <div v-if="file.isOpen" class="file-content">
              <pre>{{ file.content }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { dynamicAnalyzer } from '@/api/DynamicAnalyzer'

interface SourceFile {
  path: string
  name: string
  type: 'xml' | 'db' | 'others'
  content: string
  isOpen: boolean
}

export default defineComponent({
  name: 'DynamicAnalysisReport',
  setup() {
    const route = useRoute()
    const hash = route.params.hash as string
    const loading = ref(true)
    const error = ref('')
    const report = ref(null)
    const sourceFiles = ref<SourceFile[]>([])

    const fetchReport = async () => {
      try {
        const response = await dynamicAnalyzer.getReport(route.params.hash as string)
        report.value = response
        sourceFiles.value = response.source_files || []
      } catch (err) {
        const error = err as Error
        error.value = `Failed to fetch report: ${error.message}`
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const toggleFile = async (file: SourceFile) => {
      if (!file.content) {
        try {
          const content = await dynamicAnalyzer.viewSource(
            route.params.hash as string,
            file.path,
            file.type
          )
          file.content = content
        } catch (err) {
          console.error('Error fetching file content:', err)
          return
        }
      }
      file.isOpen = !file.isOpen
    }

    onMounted(fetchReport)

    return {
      loading,
      error,
      report,
      sourceFiles,
      toggleFile,
    }
  },
})
</script>

<style scoped>
.dynamic-analysis-report {
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

.report-container {
  max-width: 1200px;
  margin: 0 auto;
}

.report-section,
.source-files-section {
  margin-bottom: 40px;
}

.json-viewer {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  overflow-x: auto;
}

.json-viewer pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.file-header:hover {
  background-color: #e0e0e0;
}

.file-name {
  font-weight: 500;
}

.file-type {
  color: #666;
  font-size: 0.9em;
  text-transform: uppercase;
}

.file-content {
  padding: 15px;
  background-color: #fff;
  border-top: 1px solid #ddd;
}

.file-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  font-size: 0.9em;
  line-height: 1.4;
}
</style>
