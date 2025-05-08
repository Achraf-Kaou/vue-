<template>
  <div class="tls-tester">
    <el-form :model="form" label-position="top">
      <el-form-item label="Target URL">
        <el-input v-model="form.url" placeholder="https://example.com" />
      </el-form-item>
      
      <el-form-item label="Test Options">
        <el-checkbox-group v-model="form.selectedTests">
          <el-checkbox label="ssl_version">SSL/TLS Version</el-checkbox>
          <el-checkbox label="cipher_suites">Cipher Suites</el-checkbox>
          <el-checkbox label="certificate">Certificate Analysis</el-checkbox>
          <el-checkbox label="vulnerabilities">Known Vulnerabilities</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="runTests" :loading="testing">
          Run Tests
        </el-button>
      </el-form-item>
    </el-form>

    <div v-if="results" class="test-results">
      <h3>Test Results</h3>
      
      <el-collapse v-model="activeResults">
        <el-collapse-item v-if="results.sslVersion" title="SSL/TLS Version" name="ssl_version">
          <div class="result-content">
            <p><strong>Version:</strong> {{ results.sslVersion.version }}</p>
            <p><strong>Status:</strong> 
              <el-tag :type="results.sslVersion.secure ? 'success' : 'danger'">
                {{ results.sslVersion.secure ? 'Secure' : 'Insecure' }}
              </el-tag>
            </p>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="results.cipherSuites" title="Cipher Suites" name="cipher_suites">
          <div class="result-content">
            <el-table :data="results.cipherSuites" style="width: 100%">
              <el-table-column prop="name" label="Cipher Suite" />
              <el-table-column prop="strength" label="Strength">
                <template #default="{ row }">
                  <el-tag :type="getStrengthType(row.strength)">
                    {{ row.strength }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="results.certificate" title="Certificate Analysis" name="certificate">
          <div class="result-content">
            <p><strong>Issuer:</strong> {{ results.certificate.issuer }}</p>
            <p><strong>Valid Until:</strong> {{ results.certificate.validUntil }}</p>
            <p><strong>Status:</strong>
              <el-tag :type="results.certificate.valid ? 'success' : 'danger'">
                {{ results.certificate.valid ? 'Valid' : 'Invalid' }}
              </el-tag>
            </p>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="results.vulnerabilities" title="Known Vulnerabilities" name="vulnerabilities">
          <div class="result-content">
            <el-table :data="results.vulnerabilities" style="width: 100%">
              <el-table-column prop="name" label="Vulnerability" />
              <el-table-column prop="severity" label="Severity">
                <template #default="{ row }">
                  <el-tag :type="getSeverityType(row.severity)">
                    {{ row.severity }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="Description" />
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useDynamicAnalyzerStore } from '@/stores/DynamicAnalyzer'

export default defineComponent({
  name: 'TlsTesterComponent',
  setup() {
    const store = useDynamicAnalyzerStore()
    const testing = ref(false)
    const results = ref(null)
    const activeResults = ref(['ssl_version'])

    const form = reactive({
      url: '',
      selectedTests: ['ssl_version', 'cipher_suites', 'certificate', 'vulnerabilities']
    })

    const getStrengthType = (strength: string) => {
      const types: Record<string, string> = {
        'Strong': 'success',
        'Medium': 'warning',
        'Weak': 'danger'
      }
      return types[strength] || 'info'
    }

    const getSeverityType = (severity: string) => {
      const types: Record<string, string> = {
        'Critical': 'danger',
        'High': 'danger',
        'Medium': 'warning',
        'Low': 'info'
      }
      return types[severity] || 'info'
    }

    const runTests = async () => {
      if (!form.url) {
        return
      }

      testing.value = true
      try {
        results.value = await store.runTLSTests(form.url, form.selectedTests)
      } catch (error) {
        console.error('Error running TLS tests:', error)
      } finally {
        testing.value = false
      }
    }

    return {
      form,
      testing,
      results,
      activeResults,
      getStrengthType,
      getSeverityType,
      runTests
    }
  }
})
</script>

<style scoped>
.tls-tester {
  padding: 20px;
}

.test-results {
  margin-top: 20px;
}

.result-content {
  padding: 10px;
}

:deep(.el-collapse-item__header) {
  font-weight: bold;
}

:deep(.el-table) {
  margin-top: 10px;
}
</style> 