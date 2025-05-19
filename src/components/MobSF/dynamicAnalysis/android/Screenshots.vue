<template>
  <div class="w-full">
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4">
        <h3 class="text-black font-medium flex items-center">
          <i class="fas fa-images mr-3 text-xl"></i>
          Screenshots
        </h3>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div v-if="screenshots && screenshots.length > 0">
          <div class="mb-6 flex flex-wrap items-center justify-between">
            <div class="text-sm text-gray-500 mb-2 md:mb-0">
              <i class="fas fa-info-circle mr-1"></i>
              Displaying {{ screenshots.length }} screenshots captured during analysis
            </div>

            <!-- View controls -->
            <div class="flex items-center space-x-4">
              <!-- Layout options -->
              <div class="flex rounded-md shadow-sm">
                <button
                  @click="viewMode = 'grid'"
                  :class="['px-3 py-2 rounded-l-md border border-gray-300', viewMode === 'grid' ? 'bg-orange-100 text-orange-800 border-orange-300' : 'bg-white text-gray-700']"
                >
                  <i class="fas fa-th-large mr-1"></i> Grid
                </button>
                <button
                  @click="viewMode = 'masonry'"
                  :class="['px-3 py-2 border-t border-b border-r border-gray-300', viewMode === 'masonry' ? 'bg-orange-100 text-orange-800 border-orange-300' : 'bg-white text-gray-700']"
                >
                  <i class="fas fa-columns mr-1"></i> Masonry
                </button>
                <button
                  @click="viewMode = 'carousel'"
                  :class="['px-3 py-2 rounded-r-md border-t border-b border-r border-gray-300', viewMode === 'carousel' ? 'bg-orange-100 text-orange-800 border-orange-300' : 'bg-white text-gray-700']"
                >
                  <i class="fas fa-film mr-1"></i> Carousel
                </button>
              </div>

              <!-- Size control -->
              <div class="hidden md:flex items-center space-x-2">
                <span class="text-xs text-gray-500">Size:</span>
                <input
                  type="range"
                  min="100"
                  max="300"
                  v-model="thumbnailSize"
                  class="w-24"
                />
              </div>
            </div>
          </div>

          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid gap-4" :style="gridStyle">
            <div
              v-for="(screenshot, index) in screenshots"
              :key="index"
              class="bg-gray-50 rounded overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div class="relative overflow-hidden" :style="`height: ${thumbnailSize}px`">
                <img
                  :src="getImageUrl(screenshot)"
                  :alt="`Screenshot ${index + 1}`"
                  class="w-full h-full object-cover"
                  @click="openLightbox(index)"
                />
                <div class="absolute bottom-0 right-0 m-2">
                  <button
                    @click="openLightbox(index)"
                    class="bg-white text-gray-800 p-1 rounded-full shadow-md hover:bg-orange-50"
                    title="View full size"
                  >
                    <i class="fas fa-search-plus"></i>
                  </button>
                </div>
              </div>
              <div class="p-2 text-center text-xs text-gray-500 truncate" :title="screenshot">
                {{ screenshot }}
              </div>
            </div>
          </div>

          <!-- Masonry View -->
          <div v-else-if="viewMode === 'masonry'" class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            <div
              v-for="(screenshot, index) in screenshots"
              :key="index"
              class="break-inside-avoid bg-gray-50 rounded overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div class="relative overflow-hidden">
                <img
                  :src="getImageUrl(screenshot)"
                  :alt="`Screenshot ${index + 1}`"
                  class="w-full h-auto"
                  @click="openLightbox(index)"
                />
                <div class="absolute bottom-0 right-0 m-2">
                  <button
                    @click="openLightbox(index)"
                    class="bg-white text-gray-800 p-1 rounded-full shadow-md hover:bg-orange-50"
                    title="View full size"
                  >
                    <i class="fas fa-search-plus"></i>
                  </button>
                </div>
              </div>
              <div class="p-2 text-center text-xs text-gray-500 truncate" :title="screenshot">
                {{ screenshot }}
              </div>
            </div>
          </div>

          <!-- Carousel View -->
          <div v-else class="relative">
            <!-- Main carousel image -->
            <div class="relative bg-gray-100 rounded-lg overflow-hidden shadow-md mx-auto" style="height: 70vh; max-height: 600px;">
              <img
                :src="getImageUrl(screenshots[currentCarouselIndex])"
                :alt="`Screenshot ${currentCarouselIndex + 1}`"
                class="w-full h-full object-contain"
                @click="openLightbox(currentCarouselIndex)"
              />

              <!-- Navigation arrows -->
              <button
                @click="prevImage"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-10 h-10 rounded-full flex items-center justify-center"
                :disabled="currentCarouselIndex === 0"
                :class="{ 'opacity-50 cursor-not-allowed': currentCarouselIndex === 0 }"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                @click="nextImage"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-10 h-10 rounded-full flex items-center justify-center"
                :disabled="currentCarouselIndex === screenshots.length - 1"
                :class="{ 'opacity-50 cursor-not-allowed': currentCarouselIndex === screenshots.length - 1 }"
              >
                <i class="fas fa-chevron-right"></i>
              </button>

              <!-- Image counter -->
              <div class="absolute bottom-4 left-0 right-0 text-center">
                <div class="inline-block bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm">
                  {{ currentCarouselIndex + 1 }} / {{ screenshots.length }}
                </div>
              </div>
            </div>

            <!-- Thumbnails -->
            <div class="mt-4 overflow-x-auto pb-4">
              <div class="flex space-x-2 min-w-max">
                <div
                  v-for="(screenshot, index) in screenshots"
                  :key="index"
                  @click="currentCarouselIndex = index"
                  class="flex-shrink-0 cursor-pointer rounded border-2 overflow-hidden transition-all"
                  :class="currentCarouselIndex === index ? 'border-orange-500 ring-2 ring-orange-300' : 'border-transparent opacity-70 hover:opacity-100'"
                  style="width: 80px; height: 80px;"
                >
                  <img
                    :src="getImageUrl(screenshot)"
                    :alt="`Thumbnail ${index + 1}`"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
            <i class="fas fa-images text-xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No screenshots available</h3>
          <p class="text-gray-500 max-w-md mx-auto">
            No screenshots were captured during the application analysis.
          </p>
        </div>

        <!-- Lightbox -->
        <div v-if="lightbox.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" @click="closeLightbox">
          <div class="max-w-6xl max-h-screen p-4 w-full relative">
            <!-- Main image -->
            <img
              :src="lightbox.index !== null ? getImageUrl(screenshots[lightbox.index]) : ''"
              class="max-w-full max-h-[85vh] object-contain mx-auto"
              @click.stop
            />

            <!-- Close button -->
            <button
              @click="closeLightbox"
              class="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-70"
            >
              <i class="fas fa-times"></i>
            </button>

            <!-- Navigation arrows -->
            <button
              v-if="lightbox.index > 0"
              @click.stop="navigateLightbox(-1)"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-12 h-12 rounded-full flex items-center justify-center"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button
              v-if="lightbox.index < screenshots.length - 1"
              @click.stop="navigateLightbox(1)"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-12 h-12 rounded-full flex items-center justify-center"
            >
              <i class="fas fa-chevron-right"></i>
            </button>

            <!-- Image details -->
            <div class="absolute bottom-4 left-0 right-0 text-center">
              <div class="inline-block bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm max-w-md truncate">
                {{ lightbox.index !== null ? screenshots[lightbox.index] : '' }}
                <span class="ml-2 text-gray-300">({{ lightbox.index + 1 }} / {{ screenshots.length }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppScreenshots',
  props: {
    // Array of screenshot filenames
    screenshots: {
      type: Array,
      default: () => []
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
      viewMode: 'grid', // 'grid', 'masonry', or 'carousel'
      thumbnailSize: 200, // size for thumbnails in grid view
      currentCarouselIndex: 0, // current index for carousel view
      lightbox: {
        visible: false,
        index: null
      }
    }
  },
  computed: {
    gridStyle() {
      // Calculate columns based on thumbnail size
      const columns = Math.max(1, Math.min(6, Math.floor(1200 / this.thumbnailSize)));
      return {
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
      };
    }
  },
  methods: {
    // Constructs the URL for a screenshot image
    getImageUrl(filename) {
      return `${this.baseDownloadUrl}${this.appHash}-screenshots-apk/${filename}`;
    },

    // Opens the lightbox with the selected image
    openLightbox(index) {
      this.lightbox = {
        visible: true,
        index: index
      };
      // Prevent scrolling when lightbox is open
      document.body.style.overflow = 'hidden';
    },

    // Closes the lightbox
    closeLightbox() {
      this.lightbox.visible = false;
      this.lightbox.index = null;
      // Re-enable scrolling
      document.body.style.overflow = '';
    },

    // Navigate through images in the lightbox
    navigateLightbox(direction) {
      if (this.lightbox.index === null) return;

      const newIndex = this.lightbox.index + direction;
      if (newIndex >= 0 && newIndex < this.screenshots.length) {
        this.lightbox.index = newIndex;
      }
    },

    // Navigate to the next image in carousel view
    nextImage() {
      if (this.currentCarouselIndex < this.screenshots.length - 1) {
        this.currentCarouselIndex++;
      }
    },

    // Navigate to the previous image in carousel view
    prevImage() {
      if (this.currentCarouselIndex > 0) {
        this.currentCarouselIndex--;
      }
    },

    // Handle keyboard navigation
    handleKeyDown(event) {
      // Only handle keyboard events when lightbox or carousel is active
      if (this.lightbox.visible) {
        if (event.key === 'ArrowLeft') {
          this.navigateLightbox(-1);
        } else if (event.key === 'ArrowRight') {
          this.navigateLightbox(1);
        } else if (event.key === 'Escape') {
          this.closeLightbox();
        }
      } else if (this.viewMode === 'carousel') {
        if (event.key === 'ArrowLeft') {
          this.prevImage();
        } else if (event.key === 'ArrowRight') {
          this.nextImage();
        }
      }
    }
  },
  mounted() {
    // Add keyboard event listener
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    // Remove keyboard event listener
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
</script>

<style scoped>
/* For masonry layout in modern browsers */
@media (min-width: 640px) {
  .break-inside-avoid {
    break-inside: avoid;
  }
}
</style>
