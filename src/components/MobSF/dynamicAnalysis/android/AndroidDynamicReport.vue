<template>
  <div class="space-y-8">
    <ReportSection title="Information">
      <DynamicReportInfo :report="report" />
    </ReportSection>
    <ReportSection v-if="report.apimon" title="Frida API Monitor">
      <DynamicReportApiMonitor :apimon="report.apimon" />
    </ReportSection>
    <ReportSection v-if="report.droidmon" title="Xposed API Monitor">
      <DynamicReportDroidmon :droidmon="report.droidmon" />
    </ReportSection>
    <ReportSection title="TLS/SSL Security Tester">
      <DynamicReportTls :tlsTests="report.tls_tests" />
    </ReportSection>
    <ReportSection title="Exported Activity Tester">
      <DynamicReportExportedActivities :exportedActivities="report.exported_activity_tester" :hash="report.hash" />
    </ReportSection>
    <ReportSection title="Activity Tester">
      <DynamicReportActivities :activities="report.activity_tester" :hash="report.hash" />
    </ReportSection>
    <ReportSection title="Screenshots">
      <DynamicReportScreenshots :screenshots="report.screenshots" :hash="report.hash" />
    </ReportSection>
    <ReportSection title="Runtime Dependencies">
      <DynamicReportDependencies :dependencies="report.runtime_dependencies" />
    </ReportSection>
    <ReportSection title="Server Locations">
      <DynamicReportServerLocations :domains="report.domains" />
    </ReportSection>
    <ReportSection title="Domain Malware Check">
      <DynamicReportMalware :domains="report.domains" />
    </ReportSection>
    <ReportSection title="Clipboard Dump">
      <DynamicReportClipboard :clipboard="report.clipboard" />
    </ReportSection>
    <ReportSection title="URLs">
      <DynamicReportUrls :urls="report.urls" />
    </ReportSection>
    <ReportSection title="Emails">
      <DynamicReportEmails :emails="report.emails" />
    </ReportSection>
    <ReportSection title="Trackers">
      <DynamicReportTrackers :trackers="report.trackers" />
    </ReportSection>
    <ReportSection title="Base64 Strings Decoded">
      <DynamicReportBase64 :base64Strings="report.base64_strings" />
    </ReportSection>
    <ReportSection title="SQLite Database">
      <DynamicReportSqlite :sqlite="report.sqlite" :hash="report.hash" />
    </ReportSection>
    <ReportSection title="XML Files">
      <DynamicReportXmlFiles :xml="report.xml" :hash="report.hash" />
    </ReportSection>
    <ReportSection title="Other Files">
      <DynamicReportOtherFiles :others="report.others" :hash="report.hash" />
    </ReportSection>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ReportSection from './ReportSection.vue'
import DynamicReportInfo from './sections/DynamicReportInfo.vue'
import DynamicReportApiMonitor from './sections/DynamicReportApiMonitor.vue'
import DynamicReportDroidmon from './sections/DynamicReportDroidmon.vue'
import DynamicReportTls from './sections/DynamicReportTls.vue'
import DynamicReportExportedActivities from './sections/DynamicReportExportedActivities.vue'
import DynamicReportActivities from './sections/DynamicReportActivities.vue'
import DynamicReportScreenshots from './sections/DynamicReportScreenshots.vue'
import DynamicReportDependencies from './sections/DynamicReportDependencies.vue'
import DynamicReportServerLocations from './sections/DynamicReportServerLocations.vue'
import DynamicReportMalware from './sections/DynamicReportMalware.vue'
import DynamicReportClipboard from './sections/DynamicReportClipboard.vue'
import DynamicReportUrls from './sections/DynamicReportUrls.vue'
import DynamicReportEmails from './sections/DynamicReportEmails.vue'
import DynamicReportTrackers from './sections/DynamicReportTrackers.vue'
import DynamicReportBase64 from './sections/DynamicReportBase64.vue'
import DynamicReportSqlite from './sections/DynamicReportSqlite.vue'
import DynamicReportXmlFiles from './sections/DynamicReportXmlFiles.vue'
import DynamicReportOtherFiles from './sections/DynamicReportOtherFiles.vue'

export default defineComponent({
  name: 'AndroidDynamicReport',
  components: {
    ReportSection,
    DynamicReportInfo,
    DynamicReportApiMonitor,
    DynamicReportDroidmon,
    DynamicReportTls,
    DynamicReportExportedActivities,
    DynamicReportActivities,
    DynamicReportScreenshots,
    DynamicReportDependencies,
    DynamicReportServerLocations,
    DynamicReportMalware,
    DynamicReportClipboard,
    DynamicReportUrls,
    DynamicReportEmails,
    DynamicReportTrackers,
    DynamicReportBase64,
    DynamicReportSqlite,
    DynamicReportXmlFiles,
    DynamicReportOtherFiles,
  },
  props: {
    report: {
      type: Object as PropType<any>,
      required: true,
    },
  },
})
</script>

<style scoped>
/* Modern section spacing and card style */
.space-y-8 > * + * {
  margin-top: 2rem;
}
</style>
