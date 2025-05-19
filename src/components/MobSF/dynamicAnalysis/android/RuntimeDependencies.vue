<template>
  <section class="py-6">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="h-10 w-10 flex items-center justify-center bg-blue-500 rounded-full text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <h2 class="ml-3 text-xl font-bold text-black-800">Runtime Dependencies</h2>
          </div>

          <div v-if="dependencies.length > 0" class="mt-4">
            <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <li
                v-for="(dependency, index) in dependencies"
                :key="index"
                class="bg-gray-50 p-3 rounded-md border border-gray-200 flex items-center"
              >
                <div class="h-8 w-8 flex items-center justify-center bg-blue-100 rounded-md text-blue-500 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span class="text-gray-700 text-sm">{{ dependency }}</span>
              </li>
            </ul>
          </div>

          <div v-else class="mt-4 p-6 bg-gray-50 rounded-md text-center">
            <p class="text-gray-600">No runtime dependencies found</p>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-200">
            <p class="text-xs text-gray-500">
              Updated at {{ formattedDate }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'RuntimeDependencies',
  props: {
    runtime_dependencies: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    dependencies() {
      return this.runtime_dependencies || [];
    },
    formattedDate() {
      const now = new Date();
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(now);
    }
  }
}
</script>
