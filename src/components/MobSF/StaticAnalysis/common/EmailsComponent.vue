<template>
  <section class="p-4 w-full">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6 flex items-center">
        <Mail class="w-5 h-5 mr-2 text-gray-700" />
        <span class="font-bold text-lg">EMAILS</span>
      </div>

      <div v-if="props.data.emails && props.data.emails.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200">
          <thead>
            <tr class="bg-gray-50">
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
              >
                EMAIL
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
              >
                FILE
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(emailDict, index) in props.data.emails"
              :key="index"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 text-sm text-gray-900">
                <div class="space-y-1">
                  <div
                    v-for="(email, emailIndex) in emailDict.emails"
                    :key="emailIndex"
                    class="flex items-center"
                  >
                    <span class="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                    <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {{ email }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a
                  :href="`/view_source?file=${emailDict.path}&md5=${props.data.md5}&type=${props.data.appType}`"
                  class="group flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FileText class="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-800" />
                  <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {{ emailDict.path }}
                  </span>
                  <ExternalLink class="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100" />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-else
        class="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200"
      >
        <Mail class="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p>No emails found in this application.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Mail, FileText, ExternalLink } from 'lucide-vue-next'

interface EmailData {
  emails: string[]
  path: string
}

interface Props {
  data: {
    emails: EmailData[]
    md5: string
    appType: string
  }
}

const props = defineProps<Props>()
</script>
