<template>
  <section class="bg-white rounded-lg shadow p-6 mb-6">
    <h2 class="text-xl font-semibold mb-4">
      <slot name="title">{{ title }}</slot>
    </h2>
    <div>
      <slot />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'ReportSection',
  props: {
    title: { type: String as PropType<string>, required: true },
  },
})
</script>

<style scoped>
section {
  border: 1px solid #e5e7eb;
}
</style>
