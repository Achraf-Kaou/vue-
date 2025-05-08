<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center">
          <span class="ml-2 font-semibold">
            {{ data.appsec.app_name || data.appsec.file_name || 'Unknown App' }}
            {{ data.appsec.version_name || '' }}
          </span>
        </div>
      </div>

      <!-- Score Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Security Score -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <Star class="text-yellow-500 mr-2" />
            <h3 class="text-lg font-semibold">Security Score</h3>
          </div>
          <div class="flex justify-center">
            <div
              :class="`w-32 h-32 rounded-full flex items-center justify-center ${getRiskColor()} text-white`"
            >
              <span class="text-3xl font-bold">{{ data.appsec.security_score ?? 'NA' }}</span>
            </div>
          </div>
          <div class="text-center mt-4">
            <p class="text-gray-700 font-medium">
              Security Score {{ data.appsec.security_score ?? 'NA' }}/100
            </p>
          </div>
        </div>

        <!-- Risk Rating -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <TrendingUp class="text-blue-500 mr-2" />
            <h3 class="text-lg font-semibold">Risk Rating</h3>
          </div>
          <div class="flex justify-center mb-4">
            <div
              class="w-32 h-10 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded-md relative"
            >
              <div
                v-if="data.appsec.security_score != null"
                class="absolute w-2 h-6 bg-black"
                :style="{
                  left: `${getScorePosition(data.appsec.security_score)}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }"
              ></div>
            </div>
          </div>
          <div class="text-center">
            <p class="font-medium">Grade</p>
            <div class="flex justify-center gap-2 mt-2">
              <div
                :class="`w-8 h-8 rounded flex items-center justify-center ${getGradeClass('A')}`"
              >
                A
              </div>
              <div
                :class="`w-8 h-8 rounded flex items-center justify-center ${getGradeClass('B')}`"
              >
                B
              </div>
              <div
                :class="`w-8 h-8 rounded flex items-center justify-center ${getGradeClass('C')}`"
              >
                C
              </div>
              <div
                :class="`w-8 h-8 rounded flex items-center justify-center ${getGradeClass('F')}`"
              >
                F
              </div>
            </div>
          </div>
        </div>

        <!-- Severity Distribution -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <PieChart class="text-purple-500 mr-2" />
            <h3 class="text-lg font-semibold">Severity Distribution</h3>
          </div>
          <div class="flex justify-center">
            <PieChartSVG :data="pieChartData" />
          </div>
          <div class="grid grid-cols-2 gap-2 mt-4 text-sm">
            <div v-for="(slice, i) in pieChartData" :key="i" class="flex items-center">
              <div class="w-3 h-3 rounded-sm mr-1" :style="{ backgroundColor: slice.color }"></div>
              <span> {{ slice.label }}: {{ slice.value }}% </span>
            </div>
          </div>
        </div>

        <!-- Privacy Risk -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <UserX class="text-red-500 mr-2" />
            <h3 class="text-lg font-semibold">Privacy Risk</h3>
          </div>
          <div class="flex justify-center">
            <div
              :class="`w-32 h-32 rounded-full flex items-center justify-center ${getPrivacyColor()} text-white`"
            >
              <span class="text-3xl font-bold">{{
                data.appsec.total_trackers != null ? data.appsec.trackers : 'NA'
              }}</span>
            </div>
          </div>
          <div class="text-center mt-4">
            <p class="text-gray-700 font-medium">
              {{ data.appsec.total_trackers != null ? 'User/Device Trackers' : 'Not Scanned' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Findings Summary -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex items-center mb-6">
          <FileText class="text-gray-700 mr-2" />
          <h2 class="text-xl font-bold">Findings</h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div class="bg-gray-50 rounded-lg p-4 flex items-center">
            <div class="bg-red-500 rounded-full p-2 mr-3">
              <BugPlay class="text-white" :size="20" />
            </div>
            <div>
              <p class="text-sm text-gray-600">High</p>
              <p class="text-xl font-semibold">{{ data.appsec.high?.length ?? 0 }}</p>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4 flex items-center">
            <div class="bg-yellow-500 rounded-full p-2 mr-3">
              <AlertTriangle class="text-white" :size="20" />
            </div>
            <div>
              <p class="text-sm text-gray-600">Medium</p>
              <p class="text-xl font-semibold">{{ data.appsec.warning?.length ?? 0 }}</p>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4 flex items-center">
            <div class="bg-blue-500 rounded-full p-2 mr-3">
              <Info class="text-white" :size="20" />
            </div>
            <div>
              <p class="text-sm text-gray-600">Info</p>
              <p class="text-xl font-semibold">{{ data.appsec.info?.length ?? 0 }}</p>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4 flex items-center">
            <div class="bg-green-500 rounded-full p-2 mr-3">
              <Check class="text-white" :size="20" />
            </div>
            <div>
              <p class="text-sm text-gray-600">Secure</p>
              <p class="text-xl font-semibold">{{ data.appsec.secure?.length ?? 0 }}</p>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4 flex items-center">
            <div class="bg-gray-500 rounded-full p-2 mr-3">
              <Search class="text-white" :size="20" />
            </div>
            <div>
              <p class="text-sm text-gray-600">Hotspot</p>
              <p class="text-xl font-semibold">{{ data.appsec.hotspot?.length ?? 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Findings Details -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-bold mb-6">Finding Details</h2>

        <!-- High Issues -->
        <div
          v-for="(item, index) in data.appsec.high"
          :key="`high-${index}`"
          class="mb-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg"
        >
          <div
            class="p-4 cursor-pointer flex justify-between items-center"
            @click="toggleItem('high', index)"
          >
            <div class="flex items-center">
              <span class="bg-red-500 text-white text-xs px-2 py-1 rounded mr-2">high</span>
              <h3 class="font-semibold">{{ item.title }}</h3>
            </div>
            <span class="text-gray-500 uppercase text-sm">{{ item.section }}</span>
          </div>
          <div v-if="expandedItems[`high-${index}`]" class="p-4 pt-0 bg-white">
            <pre class="whitespace-pre-wrap text-sm">{{ item.description }}</pre>
          </div>
        </div>

        <!-- Medium Issues -->
        <div
          v-for="(item, index) in data.appsec.warning"
          :key="`warning-${index}`"
          class="mb-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg"
        >
          <div
            class="p-4 cursor-pointer flex justify-between items-center"
            @click="toggleItem('warning', index)"
          >
            <div class="flex items-center">
              <span class="bg-yellow-500 text-white text-xs px-2 py-1 rounded mr-2">medium</span>
              <h3 class="font-semibold">{{ item.title }}</h3>
            </div>
            <span class="text-gray-500 uppercase text-sm">{{ item.section }}</span>
          </div>
          <div v-if="expandedItems[`warning-${index}`]" class="p-4 pt-0 bg-white">
            <pre class="whitespace-pre-wrap text-sm">{{ item.description }}</pre>
          </div>
        </div>

        <!-- Info Issues -->
        <div
          v-for="(item, index) in data.appsec.info"
          :key="`info-${index}`"
          class="mb-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg"
        >
          <div
            class="p-4 cursor-pointer flex justify-between items-center"
            @click="toggleItem('info', index)"
          >
            <div class="flex items-center">
              <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-2">info</span>
              <h3 class="font-semibold">{{ item.title }}</h3>
            </div>
            <span class="text-gray-500 uppercase text-sm">{{ item.section }}</span>
          </div>
          <div v-if="expandedItems[`info-${index}`]" class="p-4 pt-0 bg-white">
            <pre class="whitespace-pre-wrap text-sm">{{ item.description }}</pre>
          </div>
        </div>

        <!-- Secure Issues -->
        <div
          v-for="(item, index) in data.appsec.secure"
          :key="`secure-${index}`"
          class="mb-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg"
        >
          <div
            class="p-4 cursor-pointer flex justify-between items-center"
            @click="toggleItem('secure', index)"
          >
            <div class="flex items-center">
              <span class="bg-green-500 text-white text-xs px-2 py-1 rounded mr-2">secure</span>
              <h3 class="font-semibold">{{ item.title }}</h3>
            </div>
            <span class="text-gray-500 uppercase text-sm">{{ item.section }}</span>
          </div>
          <div v-if="expandedItems[`secure-${index}`]" class="p-4 pt-0 bg-white">
            <pre class="whitespace-pre-wrap text-sm">{{ item.description }}</pre>
          </div>
        </div>

        <!-- Hotspot Issues -->
        <div
          v-for="(item, index) in data.appsec.hotspot"
          :key="`hotspot-${index}`"
          class="mb-4 border-l-4 border-gray-500 bg-gray-50 rounded-r-lg"
        >
          <div
            class="p-4 cursor-pointer flex justify-between items-center"
            @click="toggleItem('hotspot', index)"
          >
            <div class="flex items-center">
              <span class="bg-gray-500 text-white text-xs px-2 py-1 rounded mr-2">hotspot</span>
              <h3 class="font-semibold">{{ item.title }}</h3>
            </div>
            <span class="text-gray-500 uppercase text-sm">{{ item.section }}</span>
          </div>
          <div v-if="expandedItems[`hotspot-${index}`]" class="p-4 pt-0 bg-white">
            <pre class="whitespace-pre-wrap text-sm">{{ item.description }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div
      v-if="isLoading"
      class="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50"
    >
      <div
        class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, type PropType } from 'vue'
import {
  BugPlay,
  AlertTriangle,
  Info,
  Check,
  Search,
  FileText,
  Star,
  PieChart,
  TrendingUp,
  UserX,
} from 'lucide-vue-next'

// Define interfaces for the data structure
interface FindingItem {
  title: string
  description: string
  section: string
}

interface SecurityData {
  appsec: {
    app_name: string
    version_name: string
    file_name: string
    security_score: number
    high: FindingItem[]
    warning: FindingItem[]
    info: FindingItem[]
    secure: FindingItem[]
    hotspot: FindingItem[]
    trackers: number
    total_trackers: number
    hash?: string
  } // Optional hash field from example data
}

interface PieChartDataItem {
  label: string
  value: number
  color: string
}

// PieChart SVG Component
const PieChartSVG = defineComponent({
  name: 'PieChartSVG',
  props: {
    data: {
      type: Array as PropType<PieChartDataItem[]>,
      required: true,
    },
  },
  setup(props) {
    const radius = 50
    const cx = 60
    const cy = 60

    const getCoordinatesForPercent = (percent: number): [number, number] => {
      const x = Math.cos(2 * Math.PI * percent) * radius + cx
      const y = Math.sin(2 * Math.PI * percent) * radius + cy
      return [x, y]
    }

    const pathsData = computed(() => {
      const total = props.data.reduce((sum, d) => sum + d.value, 0) || 100
      let cumulativePercent = 0
      const paths = []

      for (let i = 0; i < props.data.length; i++) {
        const slice = props.data[i]
        const slicePercent = slice.value / total

        // Skip slices with zero value to avoid drawing errors
        if (slicePercent === 0) continue

        const [startX, startY] = getCoordinatesForPercent(cumulativePercent)
        const nextPercent = cumulativePercent + slicePercent
        const [endX, endY] = getCoordinatesForPercent(nextPercent)

        const largeArcFlag = slicePercent > 0.5 ? 1 : 0

        const pathData = `
          M ${cx} ${cy}
          L ${startX} ${startY}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
          Z
        `

        paths.push({
          pathData,
          fill: slice.color,
          key: i,
        })

        cumulativePercent = nextPercent
      }

      return paths
    })

    return { pathsData }
  },
  template: `
    <svg width="120" height="120" viewBox="0 0 120 120">
      <path v-for="path in pathsData"
            :key="path.key"
            :d="path.pathData"
            :fill="path.fill"
            stroke="#fff"
            stroke-width="0.5" />
    </svg>
  `,
})

export default defineComponent({
  name: 'SecurityScorecard',
  components: {
    BugPlay,
    AlertTriangle,
    Info,
    Check,
    Search,
    FileText,
    Star,
    PieChart,
    TrendingUp,
    UserX,
    PieChartSVG,
  },
  props: {
    data: {
      type: Object as PropType<SecurityData>,
      required: true,
      default: () => ({
        appsec: {
          app_name: '',
          version_name: '',
          file_name: '',
          security_score: 0,
          high: [],
          warning: [],
          info: [],
          secure: [],
          hotspot: [],
          trackers: 0,
          total_trackers: 0,
        },
      }),
    },
  },
  setup(props) {
    const expandedItems = ref<Record<string, boolean>>({})
    const isLoading = ref<boolean>(false)

    // Toggle expanded items
    const toggleItem = (category: string, index: number) => {
      const key = `${category}-${index}`
      expandedItems.value[key] = !expandedItems.value[key]
    }

    // Get score position for risk rating slider
    const getScorePosition = (score: number) => {
      if (score >= 80) return 12.5 // A grade position
      if (score >= 60) return 37.5 // B grade position
      if (score >= 40) return 62.5 // C grade position
      return 87.5 // F grade position
    }

    // Get risk color based on security score
    const getRiskColor = () => {
      if (props.data.appsec.security_score == null) return 'bg-gray-500'
      if (props.data.appsec.security_score >= 80) return 'bg-green-500' // A
      if (props.data.appsec.security_score >= 60) return 'bg-green-500' // B
      if (props.data.appsec.security_score >= 40) return 'bg-yellow-500' // C
      return 'bg-red-500' // F
    }

    // Get grade class based on security score
    const getGradeClass = (grade: string) => {
      if (props.data.appsec.security_score == null) return 'bg-gray-100 text-gray-500'

      if (grade === 'A') {
        return props.data.appsec.security_score >= 80
          ? 'bg-green-500 text-white outline-2 outline outline-black font-bold'
          : 'bg-green-500 text-white'
      }

      if (grade === 'B') {
        return props.data.appsec.security_score >= 60 && props.data.appsec.security_score < 80
          ? 'bg-yellow-400 text-black outline-2 outline outline-black font-bold'
          : 'bg-yellow-400 text-black'
      }

      if (grade === 'C') {
        return props.data.appsec.security_score >= 40 && props.data.appsec.security_score < 60
          ? 'bg-orange-400 text-black outline-2 outline outline-black font-bold'
          : 'bg-orange-400 text-black'
      }

      if (grade === 'F') {
        return props.data.appsec.security_score < 40
          ? 'bg-red-500 text-white outline-2 outline outline-black font-bold'
          : 'bg-red-500 text-white'
      }

      return ''
    }

    // Get privacy color based on trackers
    const getPrivacyColor = () => {
      if (props.data.appsec.total_trackers == null) return 'bg-gray-500'
      if (props.data.appsec.trackers === 0) return 'bg-green-600'
      if (props.data.appsec.trackers > 4) return 'bg-red-600'
      return 'bg-yellow-500' // Show yellow for 1-4 trackers
    }

    // Calculate pie chart data
    const pieChartData = computed(() => {
      const highCount = props.data.appsec.high?.length || 0
      const mediumCount = props.data.appsec.warning?.length || 0
      const infoCount = props.data.appsec.info?.length || 0
      const secureCount = props.data.appsec.secure?.length || 0

      const total = Math.max(1, highCount + mediumCount + infoCount + secureCount)

      const highPercent = Math.round((highCount / total) * 100)
      const mediumPercent = Math.round((mediumCount / total) * 100)
      const infoPercent = Math.round((infoCount / total) * 100)
      const securePercent = Math.round((secureCount / total) * 100)

      // Adjust percentages to ensure they sum to 100
      const sum = highPercent + mediumPercent + infoPercent + securePercent
      let adjustedSecurePercent = securePercent

      if (sum !== 100 && sum !== 0) {
        adjustedSecurePercent += 100 - sum
      }

      return [
        { label: 'High', value: highPercent, color: '#ef4444' }, // red-500
        { label: 'Medium', value: mediumPercent, color: '#eab308' }, // yellow-500
        { label: 'Info', value: infoPercent, color: '#3b82f6' }, // blue-500
        { label: 'Secure', value: adjustedSecurePercent, color: '#22c55e' }, // green-500
      ]
    })

    // Function to generate PDF export
    const generatePrintPDF = () => {
      window.print()
    }

    // Load data on component mount
    onMounted(async () => {
      // If data.hash is available, fetch data
      if (props.data.appsec.hash) {
        isLoading.value = true
        try {
          // This is a placeholder - in a real app you'd implement fetchSecurityData
          // const fetchedData = await fetchSecurityData(props.data.hash)
          console.log('Would fetch data for hash:', props.data.appsec.hash)
        } catch (error) {
          console.error('Failed to fetch security data:', error)
        } finally {
          isLoading.value = false
        }
      }
    })

    return {
      expandedItems,
      isLoading,
      toggleItem,
      getRiskColor,
      getGradeClass,
      getPrivacyColor,
      getScorePosition,
      pieChartData,
      generatePrintPDF,
    }
  },
})
</script>

<style scoped>
@media print {
  .container {
    width: 100%;
    max-width: 100%;
  }

  button {
    display: none;
  }
}

.spinner-border {
  border-right-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
