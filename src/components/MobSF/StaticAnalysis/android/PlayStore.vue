<template>
  <div class="p-6">
    <!-- No Data Available -->
    <div
      v-if="!props.data || !props.data.playstore_details"
      class="bg-gray-50 rounded-lg p-6 text-center"
    >
      <Info :size="32" class="mx-auto mb-4 text-gray-400" />
      <h3 class="text-lg font-medium text-gray-600">
        No Play Store information available for this application
      </h3>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Main Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- App Details Section -->
        <div class="flex flex-col gap-3">
          <h2 class="text-lg font-medium flex items-center gap-2 text-gray-700 mb-2">
            <Package :size="18" /> App Details
          </h2>
          <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-3">
            <div class="w-16 h-16 bg-gray-200 mb-2 rounded-lg overflow-hidden">
              <img
                v-if="safeData.playstore.icon"
                :src="safeData.playstore.icon"
                alt="App Icon"
                class="w-full h-full object-cover"
              />
            </div>
            <RatingScore :score="safeData.playstore.score || 0" />
            <InstallsInfo :installs="safeData.playstore.installs || 'N/A'" />
            <ContentRatingInfo :rating="safeData.playstore.contentRating || 'N/A'" />
          </div>
        </div>

        <!-- App Information -->
        <div>
          <h2 class="text-lg font-medium flex items-center gap-2 text-gray-700 mb-2">
            <Info :size="18" /> App Information
          </h2>
          <div class="bg-gray-50 rounded-lg p-4">
            <InfoItem icon="Package" label="Package Name" :value="safeData.playstore.appId || ''" />
            <InfoItem icon="Calendar" label="Released" :value="safeData.playstore.released || ''" />
            <InfoItem
              icon="Calendar"
              label="Last Updated"
              :value="safeData.playstore.lastUpdatedOn || ''"
            />
            <InfoItem icon="Tag" label="Version" :value="safeData.playstore.version || ''" />
            <InfoItem
              icon="Smartphone"
              label="Android Version"
              :value="safeData.playstore.androidVersionText || 'All Versions'"
            />
            <div class="flex gap-4">
              <InfoItem
                icon="Dollar"
                label="Price"
                :value="safeData.playstore.price ? `$${safeData.playstore.price}` : 'Free'"
              />
              <InfoItem
                icon="Activity"
                label="Has Ads"
                :value="safeData.playstore.containsAds ? 'Yes' : 'No'"
              />
            </div>
            <InfoItem icon="Tag" label="Category" :value="safeData.playstore.genre || ''" />
          </div>
        </div>

        <!-- Developer Information -->
        <div>
          <h2 class="text-lg font-medium flex items-center gap-2 text-gray-700 mb-2">
            <Users :size="18" /> Developer Details
          </h2>
          <div class="bg-gray-50 rounded-lg p-4">
            <InfoItem icon="User" label="Developer" :value="safeData.playstore.developer || ''" />
            <InfoItem
              icon="Key"
              label="Developer ID"
              :value="safeData.playstore.developerId || ''"
            />
            <InfoItem
              icon="Mail"
              label="Email"
              :value="safeData.playstore.developerEmail || ''"
              :link="
                safeData.playstore.developerEmail
                  ? `mailto:${safeData.playstore.developerEmail}`
                  : ''
              "
            />
            <InfoItem
              icon="Link"
              label="Website"
              :value="safeData.playstore.developerWebsite || 'Not provided'"
              :link="safeData.playstore.developerWebsite"
            />
            <InfoItem
              icon="FileText"
              label="Privacy Policy"
              value="Privacy Policy"
              :link="safeData.playstore.privacyPolicy"
            />
            <InfoItem
              icon="MapPin"
              label="Address"
              :value="safeData.playstore.developerAddress || 'Not provided'"
            />
          </div>
        </div>
      </div>

      <!-- Description Section -->
      <div class="mt-6">
        <h2 class="text-lg font-medium flex items-center gap-2 text-gray-700 mb-2">
          <FileText :size="18" /> Description
        </h2>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-600">
            {{
              showFullDescription
                ? safeData.playstore.description || 'No description available.'
                : safeData.playstore.description
                  ? `${safeData.playstore.description.substring(0, 150)}${safeData.playstore.description.length > 150 ? '...' : ''}`
                  : 'No description available.'
            }}
          </p>
          <button
            v-if="safeData.playstore.description && safeData.playstore.description.length > 150"
            @click="showFullDescription = !showFullDescription"
            class="mt-2 text-blue-600 text-sm hover:underline"
          >
            {{ showFullDescription ? 'Show less' : 'Show more' }}
          </button>
        </div>
      </div>

      <!-- Screenshots Section -->
      <div
        v-if="
          safeData.playstore.screenshots &&
          Array.isArray(safeData.playstore.screenshots) &&
          safeData.playstore.screenshots.length > 0
        "
        class="mt-6"
      >
        <h2 class="text-lg font-medium flex items-center gap-2 text-gray-700 mb-2">
          <Image :size="18" /> Screenshots
        </h2>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="(screenshot, index) in safeData.playstore.screenshots.slice(0, 4)"
              :key="`screenshot-${index}`"
              class="h-40 bg-gray-200 rounded-lg overflow-hidden"
            >
              <img
                v-if="screenshot"
                :src="screenshot"
                alt="App Screenshot"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          <button
            v-if="safeData.playstore.screenshots.length > 4"
            @click="showAllScreenshots = !showAllScreenshots"
            class="mt-4 text-blue-600 text-sm hover:underline"
          >
            {{
              showAllScreenshots
                ? 'Show fewer screenshots'
                : `Show all ${safeData.playstore.screenshots.length} screenshots`
            }}
          </button>
          <div
            v-if="showAllScreenshots && safeData.playstore.screenshots.length > 4"
            class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"
          >
            <div
              v-for="(screenshot, index) in safeData.playstore.screenshots.slice(4)"
              :key="`screenshot-${index + 4}`"
              class="h-40 bg-gray-200 rounded-lg overflow-hidden"
            >
              <img
                v-if="screenshot"
                :src="screenshot"
                alt="App Screenshot"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Ad Warning Banner -->
      <div
        v-if="safeData.playstore.adSupported || safeData.playstore.containsAds"
        class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-6 rounded shadow-sm"
      >
        <div class="flex items-center">
          <AlertCircle :size="18" class="mr-2" />
          <p class="font-medium">
            This application contains advertisements which may collect user data for personalized ad
            targeting.
          </p>
        </div>
      </div>

      <!-- Components Section -->
      <ComponentsSection v-if="safeData.components" :data="safeData.components" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref } from 'vue'
import {
  FileText,
  Info,
  Package,
  AlertCircle,
  Star,
  Users,
  Link,
  Calendar,
  MapPin,
  Mail,
  Tag,
  Smartphone,
  User,
  Key,
  Image,
  Dollar,
  Activity,
} from 'lucide-vue-next'
import InfoItem from '../common/InfoItem.vue'
import ComponentsSection from '../common/ComponentsSection.vue'

// Define types
interface PlayStoreData {
  playstore_details?: {
    title: string
    score: number | null
    ratings: number | null
    reviews: number | null
    installs: string
    realInstalls: number
    price: number
    free: boolean
    currency: string
    androidVersionText: string
    genre: string
    appId: string
    url: string
    released: string
    lastUpdatedOn: string
    updated: number
    version: string
    contentRating: string
    contentRatingDescription: string | null
    privacyPolicy: string
    developer: string
    developerId: string
    developerAddress: string | null
    developerWebsite: string | null
    developerEmail: string
    description: string
    icon: string
    screenshots: string[]
    adSupported: boolean
    containsAds: boolean
  }
  activities?: string[]
  services?: string[]
  receivers?: string[]
  providers?: string[]
  libraries?: string[]
  sbom: {
    sbom_versioned: string[]
  }
  files: string[]
}

const props = defineProps<{
  data: PlayStoreData | null
}>()

// Create safe computed values to avoid undefined issues
const safeData = computed(() => ({
  playstore: {
    title: props.data?.playstore_details?.title || 'Unknown App',
    score: props.data?.playstore_details?.score || 0,
    ratings: props.data?.playstore_details?.ratings || 0,
    reviews: props.data?.playstore_details?.reviews || 0,
    installs: props.data?.playstore_details?.installs || 'N/A',
    realInstalls: props.data?.playstore_details?.realInstalls || 0,
    price: props.data?.playstore_details?.price || 0,
    free: props.data?.playstore_details?.free ?? true,
    currency: props.data?.playstore_details?.currency || 'USD',
    androidVersionText: props.data?.playstore_details?.androidVersionText || 'All Versions',
    genre: props.data?.playstore_details?.genre || '',
    appId: props.data?.playstore_details?.appId || '',
    url: props.data?.playstore_details?.url || '',
    released: props.data?.playstore_details?.released || '',
    lastUpdatedOn: props.data?.playstore_details?.lastUpdatedOn || '',
    updated: props.data?.playstore_details?.updated || 0,
    version: props.data?.playstore_details?.version || '',
    contentRating: props.data?.playstore_details?.contentRating || 'N/A',
    contentRatingDescription: props.data?.playstore_details?.contentRatingDescription || null,
    privacyPolicy: props.data?.playstore_details?.privacyPolicy || '',
    developer: props.data?.playstore_details?.developer || '',
    developerId: props.data?.playstore_details?.developerId || '',
    developerAddress: props.data?.playstore_details?.developerAddress || 'Not provided',
    developerWebsite: props.data?.playstore_details?.developerWebsite || '',
    developerEmail: props.data?.playstore_details?.developerEmail || '',
    description: props.data?.playstore_details?.description || '',
    icon: props.data?.playstore_details?.icon || '',
    screenshots: Array.isArray(props.data?.playstore_details?.screenshots)
      ? props.data.playstore_details.screenshots
      : [],
    adSupported: props.data?.playstore_details?.adSupported ?? false,
    containsAds: props.data?.playstore_details?.containsAds ?? false,
  },
  components: {
    activities: Array.isArray(props.data?.activities) ? props.data.activities : [],
    services: Array.isArray(props.data?.services) ? props.data.services : [],
    receivers: Array.isArray(props.data?.receivers) ? props.data.receivers : [],
    providers: Array.isArray(props.data?.providers) ? props.data.providers : [],
    libraries: Array.isArray(props.data?.libraries) ? props.data.libraries : [],
    sbom: props.data?.sbom ?? { sbom_versioned: [] },
    files: Array.isArray(props.data?.files) ? props.data.files : [],
  },
}))

// Reactive state for description and screenshots
const showFullDescription = ref(false)
const showAllScreenshots = ref(false)

// Define embedded components
const RatingScore = defineComponent({
  props: {
    score: {
      type: Number,
      required: true,
    },
  },
  setup() {
    return { Star }
  },
  template: `
    <div class="flex items-center gap-2">
      <div class="text-xs font-medium text-white px-2.5 py-0.5 rounded bg-blue-500">Rating</div>
      <div class="flex items-center">
        <Star :size="16" class="text-yellow-500" />
        <span class="font-bold ml-1">{{ score || 'N/A' }}</span>
      </div>
    </div>
  `,
})

const InstallsInfo = defineComponent({
  props: {
    installs: {
      type: String,
      required: true,
    },
  },
  template: `
    <div class="flex items-center gap-2">
      <div class="text-xs font-medium text-white px-2.5 py-0.5 rounded bg-green-500">Installs</div>
      <span class="font-bold">{{ installs }}</span>
    </div>
  `,
})

const ContentRatingInfo = defineComponent({
  props: {
    rating: {
      type: String,
      required: true,
    },
  },
  template: `
    <div class="flex items-center gap-2">
      <div class="text-xs font-medium text-white px-2.5 py-0.5 rounded bg-purple-500">Content Rating</div>
      <span class="font-bold">{{ rating }}</span>
    </div>
  `,
})
</script>
