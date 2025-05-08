<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center">
          <CaseSensitive class="w-5 h-5 mr-2 text-gray-700" />
          <span class="font-bold text-lg">STRINGS</span>
        </div>
        <div class="flex space-x-2">
          <select
            v-model="currentCategory"
            class="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="all">All Strings</option>
            <option value="potential_secrets">Potential Secrets</option>
            <option value="api_keys">API Keys</option>
            <option value="urls">URLs</option>
            <option value="hashes">Hashes</option>
          </select>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search strings..."
            class="px-3 py-1 border border-gray-300 rounded text-sm w-40"
          />
        </div>
      </div>

      <div v-if="filteredStrings.length > 0" class="space-y-6">
        <p class="font-semibold text-gray-700">
          {{ categoryLabel }}
          <span class="text-sm font-normal text-gray-500">
            (showing {{ displayedStrings.length }} of {{ filteredStrings.length }})
          </span>
        </p>

        <ul class="space-y-4">
          <li
            v-for="(str, index) in displayedStrings"
            :key="index"
            class="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:bg-gray-100 transition-colors"
          >
            <div class="flex justify-between items-start mb-2">
              <span class="text-xs text-gray-500 px-2 py-0.5 bg-gray-200 rounded-full">
                {{ getStringType(str) }}
              </span>
              <button
                @click="copyToClipboard(str)"
                class="text-blue-600 hover:text-blue-800"
                title="Copy to clipboard"
              >
                <Copy class="w-4 h-4" />
              </button>
            </div>
            <pre class="text-sm text-gray-800 font-mono whitespace-pre-wrap break-words mt-1">{{
              isExpanded(index) || !isTruncated(str) ? str : truncateString(str)
            }}</pre>
            <div class="flex justify-between items-center mt-2">
              <button
                v-if="isTruncated(str)"
                @click="toggleExpand(index)"
                class="text-blue-600 text-xs hover:underline"
              >
                {{ isExpanded(index) ? 'Show less' : 'Show more' }}
              </button>
              <span class="text-xs text-gray-500"> Length: {{ str.length }} characters </span>
            </div>
          </li>
        </ul>

        <div v-if="visibleCount < filteredStrings.length" class="text-center mt-6">
          <button
            @click="handleLoadMore"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Load more ({{ visibleCount }}/{{ filteredStrings.length }})
          </button>
        </div>
      </div>

      <div
        v-else
        class="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200"
      >
        <CaseSensitive class="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p>
          {{
            searchTerm ? 'No strings matching your search.' : 'No strings found in this category.'
          }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CaseSensitive, Copy } from 'lucide-vue-next'

// Constants
const MAX_LENGTH = 200
const PAGE_SIZE = 50

// Props definition
const props = defineProps<{
  data: {
    strings: string[]
  }
}>()

// State
const visibleCount = ref(PAGE_SIZE)
const expandedIndices = ref<Set<number>>(new Set())
const searchTerm = ref('')
const currentCategory = ref('all')
const copySuccess = ref(false)

// Computed properties
const filteredStrings = computed(() => {
  let result = [...props.data.strings]

  // Filter by category
  if (currentCategory.value !== 'all') {
    switch (currentCategory.value) {
      case 'potential_secrets':
        result = result.filter(isPotentialSecret)
        break
      case 'api_keys':
        result = result.filter(
          (str) =>
            str.includes('api_key') || str.includes('ApiKey') || str.match(/AIza[0-9A-Za-z-_]{35}/),
        )
        break
      case 'urls':
        result = result.filter((str) => str.startsWith('http'))
        break
      case 'hashes':
        result = result.filter(
          (str) =>
            str.match(/^[0-9a-f]{32}$/) ||
            str.match(/^[0-9a-f]{40}$/) ||
            str.match(/^[0-9a-f]{64}$/),
        )
        break
    }
  }

  // Filter by search term
  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter((str) => str.toLowerCase().includes(term))
  }

  return result
})

const displayedStrings = computed(() => {
  return filteredStrings.value.slice(0, visibleCount.value)
})

const categoryLabel = computed(() => {
  switch (currentCategory.value) {
    case 'potential_secrets':
      return 'Potential Secrets'
    case 'api_keys':
      return 'API Keys'
    case 'urls':
      return 'URLs'
    case 'hashes':
      return 'Hashes'
    default:
      return 'All Strings'
  }
})

// Functions
function isPotentialSecret(str: string): boolean {
  // Check for API keys
  if (str.includes('api_key') || str.includes('ApiKey')) return true

  // Check for Google API keys pattern
  if (str.match(/AIza[0-9A-Za-z-_]{35}/)) return true

  // Check for base64 encoded data
  if (str.match(/^[A-Za-z0-9+/=]{44}$/)) return true

  // Check for URLs with potential credentials
  if (
    str.includes('http') &&
    (str.includes('password') || str.includes('token') || str.includes('secret'))
  )
    return true

  // Check for private keys
  if (str.includes('PRIVATE KEY')) return true

  // Check for hashes
  if (str.match(/^[0-9a-f]{32}$/) || str.match(/^[0-9a-f]{40}$/) || str.match(/^[0-9a-f]{64}$/))
    return true

  return false
}

function getStringType(str: string): string {
  if (str.match(/AIza[0-9A-Za-z-_]{35}/)) return 'Google API Key'
  if (str.includes('api_key')) return 'API Key'
  if (str.match(/^[A-Za-z0-9+/=]{44}$/)) return 'Base64'
  if (str.match(/^[0-9a-f]{32}$/)) return 'MD5 Hash'
  if (str.match(/^[0-9a-f]{40}$/)) return 'SHA-1 Hash'
  if (str.match(/^[0-9a-f]{64}$/)) return 'SHA-256 Hash'
  if (str.startsWith('http')) return 'URL'
  if (str.includes('PRIVATE KEY')) return 'Private Key'
  if (str.includes('password') || str.includes('Password')) return 'Password'

  return 'String'
}

function isExpanded(index: number): boolean {
  return expandedIndices.value.has(index)
}

function isTruncated(str: string): boolean {
  return str.length > MAX_LENGTH
}

function truncateString(str: string): string {
  return `${str.slice(0, MAX_LENGTH)}...`
}

function toggleExpand(index: number): void {
  if (expandedIndices.value.has(index)) {
    expandedIndices.value.delete(index)
  } else {
    expandedIndices.value.add(index)
  }
}

function handleLoadMore(): void {
  visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, filteredStrings.value.length)
}

function copyToClipboard(text: string): void {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      copySuccess.value = true
      setTimeout(() => {
        copySuccess.value = false
      }, 2000)
    })
    .catch((err) => {
      console.error('Failed to copy text: ', err)
    })
}
</script>
