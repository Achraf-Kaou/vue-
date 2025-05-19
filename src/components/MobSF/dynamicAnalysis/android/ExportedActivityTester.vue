<template>
  <div class="w-full">
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4">
        <h3 class="text-black font-medium flex items-center">
          <i class="fas fa-shapes mr-3 text-xl"></i>
          Exported Activity Tester
        </h3>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div v-if="exportedActivities && Object.keys(exportedActivities).length > 0">
          <div class="mb-4 text-sm text-gray-500">
            <i class="fas fa-info-circle mr-1"></i>
            Displaying {{ Object.keys(exportedActivities).length }} exported activities that were successfully launched
          </div>

          <!-- Grid view toggle -->
          <div class="flex justify-end mb-4">
            <button
              @click="viewMode = 'grid'"
              :class="['px-3 py-2 rounded-l-md border border-gray-300', viewMode === 'grid' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-white text-gray-700']"
            >
              <i class="fas fa-th mr-1"></i> Grid
            </button>
            <button
              @click="viewMode = 'table'"
              :class="['px-3 py-2 rounded-r-md border border-gray-300 border-l-0', viewMode === 'table' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-white text-gray-700']"
            >
              <i class="fas fa-table mr-1"></i> Table
            </button>
          </div>

          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(desc, img) in exportedActivities" :key="img" class="bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div class="relative pb-[180%] overflow-hidden bg-gray-100">
                <img
                  :src="getImageUrl(img)"
                  :alt="desc"
                  class="absolute inset-0 w-full h-full object-contain"
                  @click="openLightbox(img)"
                />
                <div class="absolute bottom-0 right-0 m-2">
                  <button
                    @click="openLightbox(img)"
                    class="bg-white text-gray-800 p-1 rounded-full shadow-md hover:bg-blue-50"
                    title="View full size"
                  >
                    <i class="fas fa-search-plus"></i>
                  </button>
                </div>
              </div>
              <div class="p-4">
                <div class="font-medium text-gray-900 mb-1 line-clamp-1" :title="desc">{{ desc }}</div>
                <div class="text-xs text-gray-600 flex items-center">
                  <i class="fas fa-mobile-alt mr-1"></i>
                  <span class="truncate" :title="img">{{ img }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Table View -->
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="px-6 py-3.5 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-1/3">Screenshot</th>
                  <th class="px-6 py-3.5 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Activity</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="(desc, img) in exportedActivities" :key="img" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="relative w-32 h-56 mx-auto">
                      <img
                        :src="getImageUrl(img)"
                        :alt="desc"
                        class="h-full w-full object-contain rounded border border-gray-200"
                        @click="openLightbox(img)"
                      />
                      <button
                        @click="openLightbox(img)"
                        class="absolute bottom-2 right-2 bg-white text-gray-800 p-1 rounded-full shadow-md hover:bg-blue-50"
                        title="View full size"
                      >
                        <i class="fas fa-search-plus"></i>
                      </button>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <code class="bg-gray-100 p-2 rounded block whitespace-pre-wrap text-xs">{{ desc }}</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
            <i class="fas fa-shapes text-xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No exported activities found</h3>
          <p class="text-gray-500 max-w-md mx-auto">
            The analysis did not identify any exported activities that could be launched successfully.
          </p>
        </div>

        <!-- Lightbox -->
        <div v-if="lightbox.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" @click="closeLightbox">
          <div class="max-w-4xl max-h-screen p-4">
            <div class="relative">
              <img
                :src="lightbox.img ? getImageUrl(lightbox.img) : ''"
                class="max-w-full max-h-[90vh] object-contain"
                @click.stop
              />
              <button
                @click="closeLightbox"
                class="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-70"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExportedActivityTester',
  props: {
    // Object mapping screenshot filenames to activity descriptions
    exportedActivities: {
      type: Object,
      default: () => ({})
    },
    // Application hash for constructing URLs
    appHash: {
      type: String,
      required: true
    },
    // Base URL for downloads (could be configurable)
    baseDownloadUrl: {
      type: String,
      default: '/download/'
    }
  },
  data() {
    return {
      viewMode: 'grid', // 'grid' or 'table'
      lightbox: {
        visible: false,
        img: null
      }
    }
  },
  methods: {
    // Constructs the URL for the screenshot image
    getImageUrl(filename) {
      return `${this.baseDownloadUrl}${this.appHash}-screenshots-apk/${filename}`;
    },

    // Opens the lightbox with the selected image
    openLightbox(img) {
      this.lightbox = {
        visible: true,
        img: img
      };
      // Prevent scrolling when lightbox is open
      document.body.style.overflow = 'hidden';
    },

    // Closes the lightbox
    closeLightbox() {
      this.lightbox.visible = false;
      this.lightbox.img = null;
      // Re-enable scrolling
      document.body.style.overflow = '';
    }
  }
}
</script>

<style scoped>
/* Optional: Add this if you want line clamping for long activity names */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
