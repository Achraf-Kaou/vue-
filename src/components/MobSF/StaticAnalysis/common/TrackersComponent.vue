<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6 flex items-center">
        <ShieldAlert class="w-5 h-5 mr-2 text-gray-700" />
        <span class="font-bold text-lg">TRACKERS</span>
        <span class="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-700">
          {{ props.data.trackers.detected_trackers }} / {{ props.data.trackers.total_trackers }}
        </span>
      </div>

      <div
        v-if="props.data.trackers.trackers && props.data.trackers.trackers.length > 0"
        class="overflow-x-auto"
      >
        <table class="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200">
          <thead>
            <tr class="bg-gray-50">
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
              >
                TRACKER NAME
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
              >
                CATEGORIES
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
              >
                URL
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(trk, index) in props.data.trackers.trackers"
              :key="index"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 text-sm text-gray-900">
                <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {{ trk.name }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                <span v-if="trk.categories" class="px-2 py-1 rounded bg-gray-100">
                  {{ trk.categories }}
                </span>
                <span v-else class="text-gray-400 italic">No category</span>
              </td>
              <td class="px-6 py-4 text-sm text-blue-600">
                <a
                  :href="trk.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center hover:text-blue-800"
                >
                  <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded break-all">
                    {{ trk.url }}
                  </span>
                  <ExternalLink
                    class="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 flex-shrink-0"
                  />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-else
        class="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200"
      >
        <ShieldAlert class="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p>No trackers found in this application.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ShieldAlert, ExternalLink } from 'lucide-vue-next'

interface Tracker {
  name: string
  categories: string
  url: string
}

interface Props {
  data: {
    trackers: {
      trackers: Tracker[]
      detected_trackers: number
      total_trackers: number
    }
  }
}

const props = defineProps<Props>()
</script>
