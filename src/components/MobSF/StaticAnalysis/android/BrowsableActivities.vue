<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 mr-2 text-gray-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
          <span class="font-bold text-lg">BROWSABLE ACTIVITIES</span>
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2"
            placeholder="Search activities..."
            v-model="searchQuery"
            @input="handleSearchChange"
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
                ACTIVITY
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                INTENT
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredActivities.length === 0">
              <td colspan="2" class="px-4 py-6 text-center text-gray-500">
                No activities found matching "{{ searchQuery }}"
              </td>
            </tr>
            <tr
              v-else
              v-for="(activity, index) in filteredActivities"
              :key="index"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ activity.name }}
              </td>
              <td class="px-4 py-3 text-sm">
                <button
                  @click="toggleCollapse(activity.name)"
                  class="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs"
                >
                  Show Details
                  <ChevronUp v-if="expandedItems[activity.name]" class="w-3 h-3 ml-1" />
                  <ChevronDown v-else class="w-3 h-3 ml-1" />
                </button>

                <div
                  v-if="expandedItems[activity.name]"
                  class="mt-2 border-l-2 border-gray-300 pl-3 space-y-1"
                >
                  <div
                    v-if="activity.details.schemes && activity.details.schemes.length > 0"
                    class="text-xs"
                  >
                    <span class="font-semibold">Schemes: </span>
                    {{ activity.details.schemes.join(', ') }}
                  </div>
                  <div
                    v-if="activity.details.hosts && activity.details.hosts.length > 0"
                    class="text-xs"
                  >
                    <span class="font-semibold">Hosts: </span>
                    {{ activity.details.hosts.join(', ') }}
                  </div>
                  <div
                    v-if="activity.details.ports && activity.details.ports.length > 0"
                    class="text-xs"
                  >
                    <span class="font-semibold">Ports: </span>
                    {{ activity.details.ports.join(', ') }}
                  </div>
                  <div
                    v-if="activity.details.mime_types && activity.details.mime_types.length > 0"
                    class="text-xs"
                  >
                    <span class="font-semibold">Mime Types: </span>
                    {{ activity.details.mime_types.join(', ') }}
                  </div>
                  <div
                    v-if="activity.details.paths && activity.details.paths.length > 0"
                    class="text-xs"
                  >
                    <span class="font-semibold">Paths: </span>
                    {{ activity.details.paths.join(', ') }}
                  </div>
                  <div
                    v-if="activity.details.path_prefixs && activity.details.path_prefixs.length > 0"
                    class="text-xs"
                  >
                    <span class="font-semibold">Path Prefixes: </span>
                    {{ activity.details.path_prefixs.join(', ') }}
                  </div>
                  <div
                    v-if="
                      activity.details.path_patterns && activity.details.path_patterns.length > 0
                    "
                    class="text-xs"
                  >
                    <span class="font-semibold">Path Patterns: </span>
                    {{ activity.details.path_patterns.join(', ') }}
                  </div>
                  <div v-if="activity.details.browsable" class="text-xs">
                    <span class="font-semibold">Browsable: </span>
                    {{ activity.details.browsable }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, ChevronUp, Search } from 'lucide-vue-next'

// Define props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

// Search functionality
const searchQuery = ref('')
const expandedItems = ref<Record<string, boolean>>({})

// Process activities from props
const filteredActivities = computed(() => {
  if (!props.data) return []

  const activities = Object.entries(props.data.browsable_activities).map(([name, details]) => ({
    name,
    details,
  }))

  if (!searchQuery.value.trim()) {
    return activities
  }

  const query = searchQuery.value.toLowerCase()
  return activities.filter((activity) => activity.name.toLowerCase().includes(query))
})

const toggleCollapse = (activity: string) => {
  expandedItems.value = {
    ...expandedItems.value,
    [activity]: !expandedItems.value[activity],
  }
}

const handleSearchChange = () => {
  // Vue automatically updates the model with v-model
  // Keeping this handler for potential future extensions
}
</script>
