<template>
  <div class="bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="mb-6">
            <div class="flex items-center mb-4">
              <div class="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-800">Application Monitoring Tools</h3>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">

              <!-- Raw Logs Section -->
              <div>
                <h4 class="text-base font-medium text-gray-700 mb-3">Raw Logs</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <a v-if="droidmon"
                     :href="`http://localhost:8089/download/${hash}-x_logcat.txt`"
                     class="inline-flex items-center justify-center px-3 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
                     download>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Droidmon API Logs
                  </a>

                  <a v-if="apimon"
                     :href="`http://localhost:8089/download/${hash}-api_monitor.txt`"
                     class="inline-flex items-center justify-center px-3 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
                     download>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    API Monitor Logs
                  </a>

                  <a v-if="fridaLogs"
                     :href="`http://localhost:8089/download/${hash}-frida_out.txt`"
                     class="inline-flex items-center justify-center px-3 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
                     download>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Frida Logs
                  </a>

                  <a :href="`http://localhost:8089/download/${hash}-web_traffic.txt`"
                     class="inline-flex items-center justify-center px-3 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
                     download>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    HTTP(S) Traffic
                  </a>

                  <a :href="`http://localhost:8089/download/${hash}-logcat.txt`"
                     class="inline-flex items-center justify-center px-3 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
                     download>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Logcat Logs
                  </a>

                  <a :href="`http://localhost:8089/download/${hash}-dump.txt`"
                     class="inline-flex items-center justify-center px-3 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
                     download>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Dumpsys Logs
                  </a>

                  <a :href="`http://localhost:8089/download/${hash}-app_data.tar`"
                     class="inline-flex items-center justify-center px-3 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
                     download>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Application Data
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
  hash: {
    type: String,
    required: true
  },
  apimon: {
    type: Object as PropType<any>,
  },
  fridaLogs: {
    type: Object as PropType<any>,
  },
  droidmon: {
    type: Object as PropType<any>,
  }
});

// Destructure props for direct use in template
const { hash, apimon, fridaLogs, droidmon } = props;

console.log('Props:', props);
</script>
