<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6 flex items-center">
        <Globe class="w-5 h-5 mr-2 text-gray-700" />
        <span class="font-bold text-lg">SERVER LOCATIONS</span>
      </div>

      <div class="mb-6 relative">
        <div
          v-if="error"
          class="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10"
        >
          <div class="bg-white p-4 rounded-md shadow-md">
            <p class="text-red-600 font-medium">Error loading map: {{ error }}</p>
            <button
              class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              @click="retryMap"
            >
              Retry
            </button>
          </div>
        </div>

        <div
          ref="chartRef"
          id="chartdiv"
          class="w-full h-[500px] overflow-hidden bg-gray-50 border border-gray-200 rounded-lg"
          style="min-height: 500px"
        ></div>
      </div>

      <div v-if="ofacDomains.length > 0" class="mt-6">
        <div class="bg-red-50 p-4 rounded-md mb-4">
          <p class="text-red-800 font-medium">
            This app may communicate with the following OFAC sanctioned list of countries.
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  DOMAIN
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  COUNTRY/REGION
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="([domain, details], index) in ofacDomains"
                :key="index"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ domain }}</td>
                <td class="px-4 py-3 text-sm">
                  <div class="space-y-1" v-if="details.geolocation">
                    <div>
                      <strong class="text-gray-700">IP: </strong>{{ details.geolocation.ip }}
                    </div>
                    <div>
                      <strong class="text-gray-700">Country: </strong
                      >{{ details.geolocation.country_long }}
                    </div>
                    <div>
                      <strong class="text-gray-700">Region: </strong
                      >{{ details.geolocation.region }}
                    </div>
                    <div>
                      <strong class="text-gray-700">City: </strong>{{ details.geolocation.city }}
                    </div>
                  </div>
                  <div v-else class="text-gray-500 italic">Geolocation data unavailable</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { Globe } from 'lucide-vue-next'

interface Geolocation {
  ip: string
  country_long: string
  region: string
  city: string
  latitude: number
  longitude: number
  countryCode?: string
  country_short?: string
}

interface DomainDetails {
  ofac: boolean
  geolocation: Geolocation | null
  bad?: string
}

interface Domains {
  [domain: string]: DomainDetails
}

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

// For TypeScript to recognize the global amCharts objects
declare global {
  interface Window {
    am4core: any
    am4maps: any
    am4geodata_worldLow: any
  }
}

const chartRef = ref<HTMLElement | null>(null)
const chartInstance = ref<any>(null)
const amChartsLoaded = ref(false)
const error = ref<string | null>(null)

// Compute OFAC domains
const ofacDomains = computed(() => {
  if (!props.data?.domains) return []
  return Object.entries(props.data.domains).filter(([_, details]) => details.ofac === true)
})
console.log('OFAC Domains:', ofacDomains.value)
// Load amCharts scripts
const loadAmChartsScripts = () => {
  const scripts = [
    'https://cdn.amcharts.com/lib/4/core.js',
    'https://cdn.amcharts.com/lib/4/maps.js',
    'https://cdn.amcharts.com/lib/4/geodata/worldLow.js',
  ]

  let loadedCount = 0

  scripts.forEach((src) => {
    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      loadedCount++
      if (loadedCount === scripts.length) {
        amChartsLoaded.value = true
      }
      return
    }

    // Create a new script element
    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.defer = false
    script.onload = () => {
      loadedCount++
      if (loadedCount === scripts.length) {
        amChartsLoaded.value = true
      }
    }
    script.onerror = () => {
      error.value = `Failed to load ${src}`
    }

    document.head.appendChild(script)
  })
}

// Initialize the map when amCharts is loaded
const initializeMap = () => {
  // Check that necessary libraries are loaded
  if (!window.am4core || !window.am4maps || !window.am4geodata_worldLow) {
    error.value = 'amCharts libraries not fully loaded'
    return
  }

  try {
    // Get objects from global space
    const am4core = window.am4core
    const am4maps = window.am4maps
    const am4geodata_worldLow = window.am4geodata_worldLow

    // Dispose of existing chart if necessary
    if (chartInstance.value) {
      chartInstance.value.dispose()
    }

    // Make sure container is empty
    if (!chartRef.value) {
      console.error('Chart container not found')
      return
    }
    chartRef.value.innerHTML = ''

    // Create the map
    const chart = am4core.create(chartRef.value, am4maps.MapChart)
    console.log('Chart created:', chart)
    chartInstance.value = chart

    // Configure the map
    chart.geodata = am4geodata_worldLow
    chart.projection = new am4maps.projections.Miller()
    chart.paddingBottom = 40 // Space for legend
    chart.paddingLeft = 20
    chart.paddingRight = 20

    // Series for countries
    const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries())
    polygonSeries.useGeodata = true
    polygonSeries.exclude = ['AQ'] // Exclude Antarctica

    // Configure country appearance
    const polygonTemplate = polygonSeries.mapPolygons.template
    polygonTemplate.tooltipText = '{name}'
    polygonTemplate.fill = am4core.color('#e9ecef')
    polygonTemplate.stroke = am4core.color('#ced4da')
    polygonTemplate.strokeWidth = 0.5

    // Create hover state and set alternative fill color
    const hs = polygonTemplate.states.create('hover')
    hs.properties.fill = am4core.color('#d1e7dd')

    // Alternative approach to color OFAC countries
    try {
      // Collect OFAC country codes
      const ofacCountryCodes = []

      if (props.data?.domains) {
        Object.values(props.data.domains).forEach((domain: DomainDetails) => {
          if (domain.ofac && domain.geolocation?.country_short) {
            ofacCountryCodes.push(domain.geolocation.country_short)
          }
        })
      }

      // Use event listener to color countries after loading
      polygonSeries.events.on('inited', function () {
        polygonSeries.mapPolygons.each(function (polygon: any) {
          if (ofacCountryCodes.includes(polygon.dataItem.dataContext.id)) {
            polygon.fill = am4core.color('#ff000025')
            polygon.stroke = am4core.color('#ff0000')
          }
        })
      })
    } catch (e) {
      console.log('OFAC country highlighting failed, skipping:', e)
    }

    // Series of markers for server locations
    const imageSeries = chart.series.push(new am4maps.MapImageSeries())

    // Configure marker template
    const imageTemplate = imageSeries.mapImages.template
    imageTemplate.propertyFields.longitude = 'longitude'
    imageTemplate.propertyFields.latitude = 'latitude'
    imageTemplate.nonScaling = true
    imageTemplate.tooltipHTML = `
      <div style="text-align:center; padding: 5px;">
        <b>{title}</b><br/>
        IP: {ip}<br/>
        Country: {country}<br/>
        Region: {region}<br/>
        City: {city}
      </div>
    `

    // Create a circle for each marker
    const circle = imageTemplate.createChild(am4core.Circle)
    circle.radius = 6
    circle.propertyFields.fill = 'color'
    circle.stroke = am4core.color('#FFFFFF')
    circle.strokeWidth = 2

    // Add hover effect if supported
    try {
      const hoverState = circle.states.create('hover')
      hoverState.properties.scale = 1.2
    } catch (e) {
      console.log('Hover state not supported, skipping')
    }

    // Prepare marker data
    const markerData = []

    if (props.data?.domains) {
      Object.entries(props.data.domains).forEach(([domain, details]) => {
        if (details.geolocation && details.geolocation.latitude && details.geolocation.longitude) {
          markerData.push({
            title: domain,
            longitude: details.geolocation.longitude,
            latitude: details.geolocation.latitude,
            color: details.ofac ? am4core.color('#dc2626') : am4core.color('#2563eb'),
            ip: details.geolocation.ip,
            country: details.geolocation.country_long,
            region: details.geolocation.region,
            city: details.geolocation.city,
          })
        }
      })
    }
    imageSeries.data = markerData

    // Create legend BEFORE trying to use it
    try {
      const legend = new am4maps.Legend()
      chart.legend = legend
      legend.position = 'bottom'
      legend.contentAlign = 'left'

      // Simplified marker configuration
      legend.useDefaultMarker = true

      // Add items to the legend
      legend.data = [
        {
          name: 'OFAC Sanctioned Countries',
          fill: am4core.color('#dc2626'),
        },
        {
          name: 'Other Countries',
          fill: am4core.color('#2563eb'),
        },
      ]
    } catch (e) {
      console.log('Legend creation failed, skipping:', e)
    }

    // Make sure the map is visible
    chart.events.once('appeared', function () {
      chart.zoomToGeoPoint(
        {
          longitude: 0,
          latitude: 25,
        },
        1.5,
      )
    })

    // Add zoom controls if supported
    try {
      chart.zoomControl = new am4maps.ZoomControl()
      chart.zoomControl.align = 'right'
      chart.zoomControl.marginRight = 15
      chart.zoomControl.valign = 'middle'
    } catch (e) {
      console.log('Zoom control not supported, skipping:', e)
    }

    // Force resize to ensure everything is displayed correctly
    setTimeout(() => {
      if (typeof chart.invalidate === 'function') {
        chart.invalidate()
      } else {
        console.warn('invalidate is not a function on chart object', chart)
      }
    }, 100)
  } catch (e) {
    error.value = `Error in map initialization: ${e.message}`
    console.error('Map initialization error:', e)
  }
}

// Function to retry loading the map
const retryMap = () => {
  error.value = null
  amChartsLoaded.value = false
  setTimeout(() => {
    loadAmChartsScripts()
  }, 100)
}

// Lifecycle hooks
onMounted(() => {
  loadAmChartsScripts()
})

// Watch for amCharts loaded state
const initMapWhenReady = async () => {
  if (amChartsLoaded.value && chartRef.value) {
    try {
      // Wait for DOM to be fully ready
      await nextTick()
      setTimeout(() => {
        initializeMap()
      }, 1000)
    } catch (e) {
      error.value = `Error initializing map: ${e.message}`
      console.error('Error initializing map:', e)
    }
  }
}

// Watch for amCharts loaded state
watch(amChartsLoaded, (newValue) => {
  if (newValue) {
    initMapWhenReady()
  }
})

// Cleanup on component unmount
onUnmounted(() => {
  // Cleanup chart if it exists
  if (chartInstance.value) {
    try {
      chartInstance.value.dispose()
    } catch (e) {
      console.error('Error disposing chart:', e)
    }
  }
})

// Export the component name
defineOptions({
  name: 'ServerLocations',
})
</script>
