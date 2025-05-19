<template>
  <div class="container bg-white mx-auto px-4 py-6">
    <!-- Tabs -->
    <div class="mb-4 border-b border-gray-200">
      <ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
        <li class="mr-2" @click="activeTab = 'sqlite'">
          <button
            class="inline-flex items-center p-4 rounded-t-lg"
            :class="activeTab === 'sqlite' ? 'text-blue-600 border-b-2 border-blue-600 active' : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'"
          >
            <span class="mr-2">
              <i class="fas fa-database"></i>
            </span>
            SQLite Files
            <span v-if="sqlite && sqlite.length > 0" class="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">
              {{ sqlite.length }}
            </span>
          </button>
        </li>
        <li class="mr-2" @click="activeTab = 'xml'">
          <button
            class="inline-flex items-center p-4 rounded-t-lg"
            :class="activeTab === 'xml' ? 'text-blue-600 border-b-2 border-blue-600 active' : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'"
          >
            <span class="mr-2">
              <i class="fas fa-file-code"></i>
            </span>
            XML Files
            <span v-if="xml && xml.length > 0" class="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">
              {{ xml.length }}
            </span>
          </button>
        </li>
        <li class="mr-2" @click="activeTab = 'others'">
          <button
            class="inline-flex items-center p-4 rounded-t-lg"
            :class="activeTab === 'others' ? 'text-blue-600 border-b-2 border-blue-600 active' : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'"
          >
            <span class="mr-2">
              <i class="fas fa-file-contract"></i>
            </span>
            Other Files
            <span v-if="others && others.length > 0" class="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">
              {{ others.length }}
            </span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Tab Content -->
    <!-- SQLite Database Section -->
    <section id="sqlitedb" class="mb-8" v-if="activeTab === 'sqlite'">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4">
          <p class="font-bold flex items-center mb-4">
            <span class="mr-2">
              <i class="fas fa-database text-gray-700"></i>
            </span>
            SQLITE DATABASE
          </p>
          <div v-if="sqlite && sqlite.length > 0" class="overflow-x-auto">
            <table class="min-w-full border border-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 border-b text-left">FILES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(file, index) in sqlite" :key="'sqlite-' + index" class="hover:bg-gray-50">
                  <td class="px-4 py-2 border-b">
                    <a
                      :href="`${viewFileUrl}?file=${encodeURIComponent(file.file)}&hash=${hash}&type=${file.type}`"
                      class="text-blue-600 hover:underline"
                    >
                      {{ file.file }}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="p-4 text-center text-gray-500">
            No SQLite database files available
          </div>
        </div>
      </div>
    </section>

    <!-- XML Files Section -->
    <section id="xmlfiles" class="mb-8" v-if="activeTab === 'xml'">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4">
          <p class="font-bold flex items-center mb-4">
            <span class="mr-2">
              <i class="fas fa-file-code text-gray-700"></i>
            </span>
            XML FILES
          </p>
          <div v-if="xml && xml.length > 0" class="overflow-x-auto">
            <table class="min-w-full border border-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 border-b text-left">FILES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(file, index) in xml" :key="'xml-' + index" class="hover:bg-gray-50">
                  <td class="px-4 py-2 border-b">
                    <a
                      :href="`${viewFileUrl}?file=${encodeURIComponent(file.file)}&hash=${hash}&type=${file.type}`"
                      class="text-blue-600 hover:underline"
                    >
                      {{ file.file }}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="p-4 text-center text-gray-500">
            No XML files available
          </div>
        </div>
      </div>
    </section>

    <!-- Other Files Section -->
    <section id="other_files" class="mb-8" v-if="activeTab === 'others'">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4">
          <p class="font-bold flex items-center mb-4">
            <span class="mr-2">
              <i class="fas fa-file-contract text-gray-700"></i>
            </span>
            OTHER FILES
          </p>
          <div v-if="others && others.length > 0" class="overflow-x-auto">
            <table class="min-w-full border border-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 border-b text-left">FILES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(file, index) in others" :key="'other-' + index" class="hover:bg-gray-50">
                  <td class="px-4 py-2 border-b">
                    <a
                      :href="`${viewFileUrl}?file=${encodeURIComponent(file.file)}&hash=${hash}&type=${file.type}`"
                      class="text-blue-600 hover:underline"
                    >
                      {{ file.file }}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="p-4 text-center text-gray-500">
            No other files available
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'YTabFileBrowser',
  props: {
    sqlite: {
      type: Array,
      default: () => []
    },
    xml: {
      type: Array,
      default: () => []
    },
    others: {
      type: Array,
      default: () => []
    },
    hash: {
      type: String,
      default: ''
    },
    viewFileUrl: {
      type: String,
      default: '/dynamic_view_file'
    },
    defaultTab: {
      type: String,
      default: 'sqlite',
      validator: (value) => ['sqlite', 'xml', 'others'].includes(value)
    }
  },
  data() {
    return {
      activeTab: this.defaultTab
    }
  },
  watch: {
    defaultTab(newVal) {
      this.activeTab = newVal;
    }
  },
  computed: {
    hasFiles() {
      return (this.sqlite && this.sqlite.length > 0) ||
             (this.xml && this.xml.length > 0) ||
             (this.others && this.others.length > 0);
    }
  }
}
</script>
