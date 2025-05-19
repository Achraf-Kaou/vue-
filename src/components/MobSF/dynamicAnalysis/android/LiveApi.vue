<template>
  <div v-if="Object.keys(apiData).length > 0" class="w-full">
    <!-- Tabs Navigation -->
    <div class="border-b border-gray-200">
      <nav class="flex -mb-px">
        <button
          v-for="(apiGroup, apiName) in apiData"
          :key="apiName"
          @click="activeTab = apiName"
          :class="[
            'px-4 py-2 mr-2 text-sm font-medium transition-colors duration-200',
            activeTab === apiName
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ apiName.toUpperCase() }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="mt-4">
      <div v-for="(apiGroup, apiName) in apiData" :key="`content-${apiName}`" v-show="activeTab === apiName">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <i :class="getIcon(apiGroup)"></i>
              <span class="ml-2">{{ apiName.toUpperCase() }}</span>
            </h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CLASS
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    METHOD
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(call, index) in apiGroup" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ call.class }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 max-w-md">
                    <div class="font-bold text-gray-900">{{ call.method }}</div>

                    <div class="mt-2">
                      <p class="font-semibold text-gray-700">Arguments:</p>
                      <p class="text-gray-600">{{ call.arguments }}</p>
                    </div>

                    <div v-if="call.result" class="mt-2">
                      <p class="font-semibold text-gray-700">Result:</p>
                      <p class="text-gray-600">{{ call.result }}</p>
                    </div>

                    <div v-if="call.returnValue" class="mt-2">
                      <p class="font-semibold text-gray-700">Return Value:</p>
                      <p class="text-gray-600">{{ call.returnValue }}</p>
                    </div>

                    <div v-if="call.decoded" class="mt-2">
                      <p class="font-semibold text-gray-700">Decoded String:</p>
                      <p class="text-gray-600">{{ call.decoded }}</p>
                    </div>

                    <div class="mt-2">
                      <p class="font-semibold text-gray-700">Called From:</p>
                      <p class="text-gray-600">{{ call.calledFrom }}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="w-full">
    <p class="text-center text-gray-500">No API data available.</p>
  </div>
</template>

<script>
export default {
  name: 'LiveApi',
  props: {
    apiData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeTab: Object.keys(this.apiData)[0] || '' // Set first tab as active by default
    }
  },
  methods: {
    getIcon(apiGroup) {
      // Extract icon from the first item in the group if available
      return apiGroup[0]?.icon || 'fas fa-code' // Default icon
    }
  }
}
</script>
