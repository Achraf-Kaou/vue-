<template>
  <div v-if="Object.keys(droidmonData).length > 0" class="w-full">
    <!-- Tab Navigation -->
    <div class="flex flex-wrap border-b border-gray-200 mb-4">
      <template v-for="(details, api, index) in droidmonData" :key="api">
        <button
          @click="activeTab = api"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200',
            activeTab === api
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          :style="{ marginRight: '2px' }"
        >
          <i :class="details.icon" class="mr-2"></i>
          {{ details.name }}
          <span class="ml-2 px-2 py-0.5 bg-gray-700 text-white text-xs rounded-full">
            {{ details.calls.length }}
          </span>
        </button>
      </template>
    </div>

    <!-- Tab Content -->
    <div class="bg-white rounded-lg shadow-md">
      <template v-for="(details, api) in droidmonData" :key="api">
        <div v-show="activeTab === api" class="p-4">
          <div class="mb-4">
            <h3 class="text-lg font-bold flex items-center">
              <i :class="details.icon" class="mr-2 text-blue-500"></i>
              {{ details.name }}
            </h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full table-auto border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="px-4 py-2 text-left text-gray-600 font-medium">CLASS</th>
                  <th class="px-4 py-2 text-left text-gray-600 font-medium">METHOD</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(call, callIndex) in details.calls"
                  :key="callIndex"
                  class="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td class="px-4 py-3 align-top text-sm">
                    <code class="font-mono text-xs bg-gray-100 p-1 rounded">{{ call.class }}</code>
                  </td>
                  <td class="px-4 py-3 align-top text-sm">
                    <div class="font-mono text-xs break-words">
                      <code class="font-bold bg-blue-100 p-1 rounded">{{ call.method }}</code>

                      <div v-if="call.args" class="mt-2">
                        <div class="font-semibold text-gray-600 mb-1">Arguments:</div>
                        <code class="bg-gray-100 p-1 rounded block whitespace-pre-wrap">{{ call.args }}</code>
                      </div>

                      <div v-if="call.decoded" class="mt-2">
                        <div class="font-semibold text-gray-600 mb-1">Decoded String:</div>
                        <code class="bg-gray-100 p-1 rounded block whitespace-pre-wrap">{{ call.decoded }}</code>
                      </div>

                      <div v-if="call.return" class="mt-2">
                        <div class="font-semibold text-gray-600 mb-1">Return:</div>
                        <code class="bg-gray-100 p-1 rounded block whitespace-pre-wrap">{{ call.return }}</code>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty state -->
          <div v-if="details.calls.length === 0" class="text-center py-8 text-gray-500">
            No API calls recorded for this category.
          </div>
        </div>
      </template>
    </div>
  </div>
  <div v-else class="text-center py-8 text-gray-500">
    No droidmon data available.
  </div>
</template>

<script>
export default {
  name: 'DroidmonTabs',
  props: {
    // The droidmon data passed from parent component
    droidmonData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // The currently active tab, defaults to first tab
      activeTab: Object.keys(this.droidmonData)[0] || ''
    }
  },
  mounted() {
    // Initialize the first tab if data exists
    if (Object.keys(this.droidmonData).length > 0) {
      this.activeTab = Object.keys(this.droidmonData)[0];
    }
  },
  methods: {
    // Method to format complex arguments if needed
    formatData(data) {
      if (typeof data === 'object') {
        return JSON.stringify(data, null, 2);
      }
      return data;
    }
  }
}
</script>
