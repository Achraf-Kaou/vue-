<template>
  <div class="w-full p-4 bg-gray-50 rounded-lg shadow">
    <div class="flex flex-col items-center space-y-4">
      <div
        class="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
        @click="triggerFileInput"
      >
        <Upload :size="48" class="text-blue-500" />
        <p class="mt-2 text-sm text-gray-600 font-medium">
          Cliquez ou glissez-déposez un fichier mobile
        </p>
        <p class="text-xs text-gray-500">
          Formats supportés: APK, IPA, XAPK (max 1GB)
        </p>
        <input
          type="file"
          ref="inputRef"
          class="hidden"
          @change="handleFileSelect"
          accept=".apk,.ipa,.xapk"
        />
      </div>

      <div v-if="error" class="flex items-center text-red-500 text-sm w-full">
        <AlertCircle :size="16" class="mr-1" />
        <span>{{ error }}</span>
      </div>

      <div v-if="file && !uploading" class="flex items-center justify-between w-full bg-white p-3 rounded-md border border-gray-200">
        <div class="flex items-center">
          <File :size="20" class="text-blue-500 mr-2" />
          <div>
            <p class="text-sm font-medium truncate max-w-xs">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ (file.size / (1024 * 1024)).toFixed(2) }} MB</p>
          </div>
        </div>
        <button
          @click="handleUpload"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
        >
          <Upload :size="16" class="mr-1" />
          Analyser
        </button>
      </div>

      <div v-if="uploading" class="w-full">
        <div class="flex justify-between text-sm mb-1">
          <span class="text-blue-500 font-medium">Téléchargement...</span>
          <span>{{ Math.round(uploadProgress) }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${uploadProgress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { Upload, File, AlertCircle, CheckCircle, ChevronRight, Loader, XCircle } from 'lucide-vue-next';

export default defineComponent({
  name: 'UploadApp',
  components: {
    Upload,
    File,
    AlertCircle,
    CheckCircle,
    ChevronRight,
    Loader,
    XCircle
  },
  props: {
    onFileUploaded: {
      type: Function as PropType<(file: File) => void>,
      required: true
    },
    onAnalysisStart: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup(props) {
    const file = ref<File | null>(null);
    const uploading = ref(false);
    const uploadProgress = ref(0);
    const error = ref<string | null>(null);
    const inputRef = ref<HTMLInputElement | null>(null);

    const allowedTypes = [
      'application/vnd.android.package-archive', // APK
      'application/octet-stream', // IPA et autres
      'application/x-zip-compressed', // ZIP
      'application/zip' // ZIP alternative
    ];

    const triggerFileInput = () => {
      inputRef.value?.click();
    };

    const handleFileSelect = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const selectedFile = target.files?.[0];
      error.value = null;

      if (!selectedFile) return;

      // Vérification du type de fichier
      if (!allowedTypes.includes(selectedFile.type) &&
          !selectedFile.name.endsWith('.apk') &&
          !selectedFile.name.endsWith('.xapk') &&
          !selectedFile.name.endsWith('.ipa')) {
        error.value = "Format de fichier non supporté. Veuillez télécharger un fichier APK ou IPA.";
        return;
      }

      file.value = selectedFile;
      props.onFileUploaded(selectedFile);
    };

    const handleUpload = () => {
      if (!file.value) return;

      uploading.value = true;

      // Simuler la progression du téléchargement avant de lancer l'analyse réelle
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => {
            uploading.value = false;
            props.onAnalysisStart();
          }, 500);
        }
        uploadProgress.value = Math.min(progress, 100);
      }, 300);
    };

    return {
      file,
      uploading,
      uploadProgress,
      error,
      inputRef,
      triggerFileInput,
      handleFileSelect,
      handleUpload
    };
  }
});
</script>
