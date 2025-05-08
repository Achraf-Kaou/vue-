<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <shield-icon class="w-5 h-5 mr-2 text-gray-700" />
          <span class="font-bold text-lg">NIAP ANALYSIS v1.3</span>
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <search-icon class="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2"
            placeholder="Search requirements..."
            v-model="searchQuery"
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
                NO
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                IDENTIFIER
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                REQUIREMENT
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                FEATURE
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                DESCRIPTION
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredAnalysis.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500">
                No requirements found matching "{{ searchQuery }}"
              </td>
            </tr>
            <tr v-for="item in filteredAnalysis" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ item.id }}
              </td>
              <td class="px-4 py-3 text-sm">
                <span
                  :class="`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(item.status)} text-white`"
                >
                  {{ item.identifier }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ item.requirement }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ item.feature }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                {{ getStatusDescription(item.status) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Search, Shield } from 'lucide-vue-next'

interface NIAPItem {
  id: number
  identifier: string
  requirement: string
  feature: string
  description: string
  status: 'compliant' | 'warning' | 'not compliant'
}

export default defineComponent({
  name: 'NIAPAnalysis',
  components: {
    'search-icon': Search,
    'shield-icon': Shield,
  },
  setup() {
    const searchQuery = ref('')
    const niapAnalysis = ref<NIAPItem[]>([
      {
        id: 1,
        identifier: 'FDP_DAR_EXT.1.1',
        requirement: 'Encryption of Sensitive Data',
        feature: 'Data-at-Rest Protection',
        description:
          'The application employs FIPS 140-2 validated cryptographic methods to protect sensitive data.',
        status: 'compliant',
      },
      {
        id: 2,
        identifier: 'FCS_STO_EXT.1.1',
        requirement: 'Storage of Credentials',
        feature: 'Secure Storage',
        description: 'The application does not store credentials in plaintext format.',
        status: 'compliant',
      },
      {
        id: 3,
        identifier: 'FCS_CKM_EXT.1.1',
        requirement: 'Key Generation',
        feature: 'Cryptographic Key Management',
        description: 'The application uses the platform for key generation services.',
        status: 'compliant',
      },
      {
        id: 4,
        identifier: 'FDP_NET_EXT.1.1',
        requirement: 'Network Communications',
        feature: 'Network Protection',
        description: 'The application does not transmit sensitive data unencrypted.',
        status: 'not compliant',
      },
      {
        id: 5,
        identifier: 'FPT_API_EXT.1.1',
        requirement: 'Use of Platform APIs',
        feature: 'API Usage',
        description: 'The application uses only documented platform APIs.',
        status: 'warning',
      },
      {
        id: 6,
        identifier: 'FMT_MEC_EXT.1.1',
        requirement: 'Configuration Settings',
        feature: 'Settings Management',
        description:
          'The application does not store sensitive configuration settings in accordance with platform guidelines.',
        status: 'not compliant',
      },
      {
        id: 7,
        identifier: 'FPT_AEX_EXT.1.1',
        requirement: 'Anti-Exploitation',
        feature: 'Memory Protection',
        description: 'The application implements ASLR and other memory protection mechanisms.',
        status: 'warning',
      },
    ])

    const filteredAnalysis = computed(() => {
      return niapAnalysis.value.filter(
        (item) =>
          item.identifier.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.requirement.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.feature.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.status.toLowerCase().includes(searchQuery.value.toLowerCase()),
      )
    })

    const getStatusBadgeClass = (status: string): string => {
      switch (status) {
        case 'compliant':
          return 'bg-blue-500'
        case 'warning':
          return 'bg-yellow-500'
        case 'not compliant':
          return 'bg-red-600'
        default:
          return 'bg-gray-500'
      }
    }

    const getStatusDescription = (status: string): string => {
      switch (status) {
        case 'compliant':
          return 'The application implements this requirement correctly'
        case 'warning':
          return 'The application does not fully implement this requirement'
        case 'not compliant':
          return 'The application is not in accordance with this requirement'
        default:
          return status
      }
    }

    return {
      searchQuery,
      niapAnalysis,
      filteredAnalysis,
      getStatusBadgeClass,
      getStatusDescription,
    }
  },
})
</script>
