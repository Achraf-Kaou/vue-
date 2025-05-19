<template>
  <div class="w-full">
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4">
        <h3 class="text-black font-medium flex items-center">
          <i class="fas fa-lock mr-3 text-xl"></i>
          TLS/SSL Security Tester
        </h3>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="mb-4 flex justify-between items-center">
          <div class="text-sm text-gray-600">
            <span class="inline-flex items-center">
              <span class="w-3 h-3 rounded-full bg-green-500 mr-1"></span> Pass
            </span>
            <span class="inline-flex items-center ml-4">
              <span class="w-3 h-3 rounded-full bg-red-500 mr-1"></span> Fail
            </span>
          </div>
          <div v-if="!tlsTests" class="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            Tests not yet executed
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="px-6 py-3.5 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Test</th>
                <th class="px-6 py-3.5 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">Result</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- TLS Misconfiguration Test -->
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  <div class="flex items-center">
                    <i class="fas fa-shield-alt mr-2 text-blue-500"></i>
                    TLS Misconfiguration Test
                    <span class="ml-2 cursor-pointer text-gray-400 hover:text-blue-500" title="Tests for insecure SSL/TLS configurations">
                      <i class="fas fa-info-circle"></i>
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="!tlsTests" class="text-gray-400 text-sm">Not Tested</div>
                  <div v-else-if="tlsTests.tls_misconfigured" class="flex items-center text-red-500">
                    <i class="fas fa-times-circle text-xl mr-2"></i>
                    <span>Failed</span>
                  </div>
                  <div v-else class="flex items-center text-green-500">
                    <i class="fas fa-check-circle text-xl mr-2"></i>
                    <span>Passed</span>
                  </div>
                </td>
              </tr>

              <!-- TLS Pinning/Certificate Transparency Test -->
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  <div class="flex items-center">
                    <i class="fas fa-certificate mr-2 text-blue-500"></i>
                    TLS Pinning/Certificate Transparency Test
                    <span class="ml-2 cursor-pointer text-gray-400 hover:text-blue-500" title="Tests for certificate pinning implementation">
                      <i class="fas fa-info-circle"></i>
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="!tlsTests" class="text-gray-400 text-sm">Not Tested</div>
                  <div v-else-if="tlsTests.no_tls_pin_or_transparency" class="flex items-center text-red-500">
                    <i class="fas fa-times-circle text-xl mr-2"></i>
                    <span>Failed</span>
                  </div>
                  <div v-else class="flex items-center text-green-500">
                    <i class="fas fa-check-circle text-xl mr-2"></i>
                    <span>Passed</span>
                  </div>
                </td>
              </tr>

              <!-- TLS Pinning/Certificate Transparency Bypass Test -->
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  <div class="flex items-center">
                    <i class="fas fa-unlock mr-2 text-blue-500"></i>
                    TLS Pinning/Certificate Transparency Bypass Test
                    <span class="ml-2 cursor-pointer text-gray-400 hover:text-blue-500" title="Tests if pinning can be bypassed">
                      <i class="fas fa-info-circle"></i>
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="!tlsTests" class="text-gray-400 text-sm">Not Tested</div>
                  <div v-else-if="tlsTests.pin_or_transparency_bypassed" class="flex items-center text-red-500">
                    <i class="fas fa-times-circle text-xl mr-2"></i>
                    <span>Failed</span>
                  </div>
                  <div v-else class="flex items-center text-green-500">
                    <i class="fas fa-check-circle text-xl mr-2"></i>
                    <span>Passed</span>
                  </div>
                </td>
              </tr>

              <!-- Cleartext Traffic Test -->
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  <div class="flex items-center">
                    <i class="fas fa-eye mr-2 text-blue-500"></i>
                    Cleartext Traffic Test
                    <span class="ml-2 cursor-pointer text-gray-400 hover:text-blue-500" title="Tests for unencrypted traffic">
                      <i class="fas fa-info-circle"></i>
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="!tlsTests" class="text-gray-400 text-sm">Not Tested</div>
                  <div v-else-if="tlsTests.has_cleartext" class="flex items-center text-red-500">
                    <i class="fas fa-times-circle text-xl mr-2"></i>
                    <span>Failed</span>
                  </div>
                  <div v-else class="flex items-center text-green-500">
                    <i class="fas fa-check-circle text-xl mr-2"></i>
                    <span>Passed</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Overall Status -->
        <div v-if="tlsTests" class="mt-6 pt-4 border-t border-gray-200">
          <div class="flex items-center">
            <div class="mr-4 font-medium text-gray-700">Overall Security Status:</div>
            <div v-if="hasFailedTests" class="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
              <i class="fas fa-exclamation-triangle mr-2"></i>Security Issues Detected
            </div>
            <div v-else class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <i class="fas fa-shield-alt mr-2"></i>All Tests Passed
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TlsSecurityTester',
  props: {
    // TLS tests data passed from parent component
    tlsTests: {
      type: Object,
      default: null
    }
  },
  computed: {
    hasFailedTests() {
      if (!this.tlsTests) return false;

      return this.tlsTests.tls_misconfigured ||
             this.tlsTests.no_tls_pin_or_transparency ||
             this.tlsTests.pin_or_transparency_bypassed ||
             this.tlsTests.has_cleartext;
    }
  }
}
</script>
