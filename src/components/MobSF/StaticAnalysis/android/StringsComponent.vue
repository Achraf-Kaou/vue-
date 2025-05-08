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
            <option value="all">All Categories</option>
            <option value="apk_res">APK Resources</option>
            <option value="code">Code</option>
            <option value="strings_so">SO</option>
            <option value="potential_secrets">Potential Secrets</option>
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
                @click="copyToClipboard(getCleanString(str))"
                class="text-blue-600 hover:text-blue-800"
                title="Copy to clipboard"
              >
                <Copy class="w-4 h-4" />
              </button>
            </div>
            <pre class="text-sm text-gray-800 font-mono whitespace-pre-wrap break-words mt-1">{{
              isExpanded(index) || !isTruncated(str)
                ? getCleanString(str)
                : truncateString(getCleanString(str))
            }}</pre>
            <div class="flex justify-between items-center mt-2">
              <button
                v-if="isTruncated(str)"
                @click="toggleExpand(index)"
                class="text-blue-600 text-xs hover:underline"
              >
                {{ isExpanded(index) ? 'Show less' : 'Show more' }}
              </button>
              <span class="text-xs text-gray-500">
                Length: {{ getCleanString(str).length }} characters
              </span>
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

// Types
interface StringItem {
  text: string
  category: string
}

interface StringsData {
  strings: {
    strings_apk_res?: string[]
    strings_code?: string[]
    strings_so?: string[]
  }
}

// Constants
const MAX_LENGTH = 200
const PAGE_SIZE = 50

// Props definition
const props = defineProps<{
  data: StringsData
}>()

// State
const visibleCount = ref(PAGE_SIZE)
const expandedIndices = ref<Set<number>>(new Set())
const searchTerm = ref('')
const currentCategory = ref('all')
const copySuccess = ref(false)

// Computed properties
const allStrings = computed<StringItem[]>(() => {
  const result: StringItem[] = []

  // APK Resources
  if (props.data?.strings?.strings_apk_res) {
    for (const str of props.data.strings.strings_apk_res) {
      result.push({ text: str, category: 'apk_res' })
    }
  }

  // Code strings
  if (props.data?.strings?.strings_code) {
    for (const str of props.data.strings.strings_code) {
      result.push({ text: str, category: 'code' })
    }
  }

  // SO strings
  if (props.data?.strings?.strings_so) {
    for (const str of props.data.strings.strings_so) {
      result.push({ text: str, category: 'strings_so' })
    }
  }

  // Detect potential secrets
  const secrets: StringItem[] = []
  if (
    props.data?.strings?.strings_apk_res ||
    props.data?.strings?.strings_code ||
    props.data?.strings?.strings_so
  ) {
    const allRawStrings = [
      ...(props.data.strings.strings_apk_res || []),
      ...(props.data.strings.strings_code || []),
      ...(props.data.strings.strings_so || []),
    ]
    for (const str of allRawStrings) {
      if (isPotentialSecret(str)) {
        secrets.push({ text: str, category: 'potential_secrets' })
      }
    }
  }

  return [...result, ...secrets]
})

const filteredStrings = computed(() => {
  let result = allStrings.value

  // Filter by category
  if (currentCategory.value !== 'all') {
    result = result.filter((item) => item.category === currentCategory.value)
  }

  // Filter by search term
  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter((item) => getCleanString(item.text).toLowerCase().includes(term))
  }

  return result
})

const displayedStrings = computed(() => {
  return filteredStrings.value.slice(0, visibleCount.value).map((item) => item.text)
})

const categoryLabel = computed(() => {
  switch (currentCategory.value) {
    case 'apk_res':
      return 'From APK Resources'
    case 'code':
      return 'From Code'
    case 'strings_so':
      return 'From SO'
    case 'potential_secrets':
      return 'Potential Secrets'
    default:
      return 'All Strings'
  }
})

// Functions
function isPotentialSecret(str: string): boolean {
  const cleanStr = getCleanString(str)
  // Check for API keys
  if (cleanStr.includes('api_key') || cleanStr.includes('ApiKey')) return true

  // Check for Google API keys pattern
  if (cleanStr.match(/AIza[0-9A-Za-z-_]{35}/)) return true

  // Check for base64 encoded data
  if (cleanStr.match(/^[A-Za-z0-9+/=]{44}$/)) return true

  // Check for URLs with potential credentials
  if (
    cleanStr.includes('http') &&
    (cleanStr.includes('password') || cleanStr.includes('token') || cleanStr.includes('secret'))
  )
    return true

  // Check for private keys
  if (cleanStr.includes('PRIVATE KEY')) return true

  // Check for hashes
  if (
    cleanStr.match(/^[0-9a-f]{32}$/) ||
    cleanStr.match(/^[0-9a-f]{40}$/) ||
    cleanStr.match(/^[0-9a-f]{64}$/)
  )
    return true

  return false
}

function getStringType(str: string): string {
  const cleanStr = getCleanString(str)

  if (cleanStr.match(/AIza[0-9A-Za-z-_]{35}/)) return 'Google API Key'
  if (cleanStr.includes('api_key')) return 'API Key'
  if (cleanStr.match(/^[A-Za-z0-9+/=]{44}$/)) return 'Base64'
  if (cleanStr.match(/^[0-9a-f]{32}$/)) return 'MD5 Hash'
  if (cleanStr.match(/^[0-9a-f]{40}$/)) return 'SHA-1 Hash'
  if (cleanStr.match(/^[0-9a-f]{64}$/)) return 'SHA-256 Hash'
  if (cleanStr.startsWith('http')) return 'URL'
  if (cleanStr.includes('PRIVATE KEY')) return 'Private Key'
  if (cleanStr.includes('password') || cleanStr.includes('Password')) return 'Password'

  return 'String'
}

function getCleanString(str: string): string {
  // Remove quotes and escaped quotes from JSON representation
  return str.replace(/^"(.+(?="$))"$/, '$1').replace(/\\"/g, '"')
}

function isExpanded(index: number): boolean {
  return expandedIndices.value.has(index)
}

function isTruncated(str: string): boolean {
  return getCleanString(str).length > MAX_LENGTH
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
