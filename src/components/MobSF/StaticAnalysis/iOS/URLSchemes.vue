<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'

interface URLScheme {
  CFBundleTypeRole?: string
  CFBundleURLName?: string
  CFBundleURLSchemes?: string[]
}

interface Props {
  data: {
    bundle_url_types: URLScheme[]
  }
}

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="w-full">
    <a id="url_schemes" class="anchor"></a>
    <section class="py-4">
      <div class="w-full">
        <div class="w-full">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div class="p-6">
              <div
                class="flex items-center space-x-2 font-semibold text-gray-900 dark:text-white mb-4"
              >
                <span class="text-blue-600 dark:text-blue-400">
                  <i class="fas fa-hashtag"></i>
                </span>
                <span class="uppercase tracking-wider">Custom URL Schemes</span>
              </div>

              <div v-if="props.data.bundle_url_types && props.data.bundle_url_types.length > 0">
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse table-auto">
                    <thead>
                      <tr class="bg-gray-100 dark:bg-gray-700">
                        <th class="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left">
                          URL NAME
                        </th>
                        <th class="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left">
                          SCHEMES
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(scheme, index) in props.data.bundle_url_types"
                        :key="index"
                        class="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                      >
                        <td class="border border-gray-200 dark:border-gray-600 px-4 py-2">
                          <div v-if="scheme.CFBundleURLName">{{ scheme.CFBundleURLName }}</div>
                          <div
                            v-if="scheme.CFBundleTypeRole"
                            class="text-sm text-gray-600 dark:text-gray-300 mt-1"
                          >
                            {{ scheme.CFBundleTypeRole }}
                          </div>
                        </td>
                        <td class="border border-gray-200 dark:border-gray-600 px-4 py-2">
                          <div
                            v-if="scheme.CFBundleURLSchemes && scheme.CFBundleURLSchemes.length > 0"
                          >
                            <div
                              v-for="(url, urlIndex) in scheme.CFBundleURLSchemes"
                              :key="urlIndex"
                              class="py-1"
                            >
                              <code
                                class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm"
                                >{{ url }}</code
                              >
                            </div>
                          </div>
                          <div v-else class="text-gray-500 italic">No schemes defined</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-else class="py-4 text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                <AlertCircle class="w-5 h-5" />
                <span>No URL Schemes found.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
