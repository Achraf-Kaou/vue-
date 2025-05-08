<script lang="ts">
import { defineComponent } from 'vue'
import { Home, FileText, Monitor, List } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link
              to="/"
              class="flex items-center px-4 py-2 text-gray-700 hover:text-primary-600"
            >
              <Home class="w-5 h-5 mr-2" />
              Home
            </router-link>
            <router-link
              to="/static-analysis"
              class="flex items-center px-4 py-2 text-gray-700 hover:text-primary-600"
            >
              <FileText class="w-5 h-5 mr-2" />
              Static Analysis
            </router-link>
            <router-link
              to="/dynamic-analysis"
              class="flex items-center px-4 py-2 text-gray-700 hover:text-primary-600"
            >
              <Monitor class="w-5 h-5 mr-2" />
              Dynamic Analysis
            </router-link>
            <router-link
              to="/list-scans"
              class="flex items-center px-4 py-2 text-gray-700 hover:text-primary-600"
            >
              <List class="w-5 h-5 mr-2" />
              Scans
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-grow bg-gray-50 p-6">
      <router-view />
    </main>

    <footer class="bg-white border-t border-gray-200 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-600">Mobile Security Framework - Powered by MobSF</p>
      </div>
    </footer>
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
}

.el-header {
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-menu {
  height: 60px;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}

.el-footer {
  text-align: center;
  color: #666;
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
}
</style>
