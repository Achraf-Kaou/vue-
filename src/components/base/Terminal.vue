<template>
  <div class="terminal">
    <div class="terminal-header">
      <div class="terminal-title">Terminal</div>
      <div class="terminal-controls">
        <button @click="clearLogs" class="clear-button">Clear</button>
      </div>
    </div>
    <div class="terminal-content" ref="terminalContent">
      <div v-for="(log, index) in logs" :key="index" :class="['log-line', log.type]">
        <span class="timestamp">{{ formatTimestamp(log.timestamp) }}</span>
        <span class="message">{{ log.message }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from 'vue'

interface Log {
  type: 'info' | 'error' | 'success'
  message: string
  timestamp: Date
}

export default defineComponent({
  name: 'Terminal',
  props: {
    logs: {
      type: Array as () => Log[],
      required: true,
    },
  },
  setup(props, { emit }) {
    const terminalContent = ref<HTMLElement | null>(null)

    const formatTimestamp = (timestamp: Date): string => {
      return timestamp.toLocaleTimeString()
    }

    const clearLogs = () => {
      emit('clear')
    }

    // Auto-scroll to bottom when new logs are added
    watch(
      () => props.logs.length,
      async () => {
        await nextTick()
        if (terminalContent.value) {
          terminalContent.value.scrollTop = terminalContent.value.scrollHeight
        }
      }
    )

    return {
      terminalContent,
      formatTimestamp,
      clearLogs,
    }
  },
})
</script>

<style scoped>
.terminal {
  background-color: #1e1e1e;
  border-radius: 6px;
  overflow: hidden;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.terminal-header {
  background-color: #2d2d2d;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #3d3d3d;
}

.terminal-title {
  color: #fff;
  font-size: 0.9em;
  font-weight: 500;
}

.terminal-controls {
  display: flex;
  gap: 8px;
}

.clear-button {
  background-color: #3d3d3d;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8em;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clear-button:hover {
  background-color: #4d4d4d;
}

.terminal-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9em;
  line-height: 1.4;
}

.log-line {
  margin: 2px 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.timestamp {
  color: #888;
  margin-right: 8px;
}

.message {
  color: #fff;
}

.log-line.info .message {
  color: #fff;
}

.log-line.error .message {
  color: #ff6b6b;
}

.log-line.success .message {
  color: #69db7c;
}

/* Scrollbar styling */
.terminal-content::-webkit-scrollbar {
  width: 8px;
}

.terminal-content::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.terminal-content::-webkit-scrollbar-thumb {
  background: #4d4d4d;
  border-radius: 4px;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
  background: #5d5d5d;
}
</style>
