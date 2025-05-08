<template>
  <AndroidStaticReport :reportData="reportData" :fileHash="'sdfdg'" />
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import AndroidStaticReport from '../../components/MobSF/general/report/static/android/AndroidStaticReport.vue'

export default defineComponent({
  name: 'StaticAnalysisReport',
  setup() {
    const activeTab = ref('overview')
    const activeManifestItems = ref(['permissions'])
    const activeCodeItems = ref(['security'])
    const activeNetworkItems = ref(['config'])

    // Mock data - replace with actual API data
    const reportData = reactive({
      appName: 'Sample App',
      packageName: 'com.example.app',
      version: '1.0.0',
      analysisDate: new Date().toLocaleDateString(),
      risks: {
        high: 3,
        medium: 5,
        low: 8,
      },
      manifest: {
        permissions: [
          {
            name: 'android.permission.INTERNET',
            level: 'normal',
            description: 'Allows app to access the internet',
            risk: 'Low',
          },
          {
            name: 'android.permission.READ_EXTERNAL_STORAGE',
            level: 'dangerous',
            description: 'Allows app to read external storage',
            risk: 'Medium',
          },
        ],
        activities: [
          {
            name: 'com.example.app.MainActivity',
            exported: true,
            permission: 'android.permission.INTERNET',
          },
        ],
      },
      code: {
        securityIssues: [
          {
            type: 'Hardcoded Credentials',
            description: 'Found hardcoded API key in source code',
            location: 'MainActivity.java:42',
            risk: 'High',
          },
        ],
        cryptoIssues: [
          {
            type: 'Weak Encryption',
            description: 'Using deprecated encryption algorithm',
            location: 'CryptoUtils.java:15',
            risk: 'Medium',
          },
        ],
      },
      network: {
        configurations: [
          {
            type: 'Network Security Config',
            description: 'Cleartext traffic allowed',
            risk: 'Medium',
          },
        ],
        endpoints: [
          {
            url: 'https://api.example.com/data',
            method: 'GET',
            security: 'Secure',
          },
          {
            url: 'http://api.example.com/legacy',
            method: 'POST',
            security: 'Insecure',
          },
        ],
      },
    })

    const getRiskType = (risk: string) => {
      switch (risk.toLowerCase()) {
        case 'high':
          return 'danger'
        case 'medium':
          return 'warning'
        case 'low':
          return 'info'
        default:
          return 'info'
      }
    }

    return {
      activeTab,
      activeManifestItems,
      activeCodeItems,
      activeNetworkItems,
      reportData,
      getRiskType,
    }
  },
})
</script>

<style scoped>
.static-analysis-report {
  padding: 20px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
}

.report-tabs {
  margin-top: 20px;
}

.overview-card {
  margin-bottom: 20px;
}

.risk-summary {
  margin-top: 20px;
}

.risk-card {
  text-align: center;
  padding: 20px;
}

.risk-card.high {
  border-top: 4px solid #f56c6c;
}

.risk-card.medium {
  border-top: 4px solid #e6a23c;
}

.risk-card.low {
  border-top: 4px solid #67c23a;
}

.risk-count {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: bold;
}
</style>
