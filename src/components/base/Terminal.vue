<template>
  <div class="terminal" :style="{ height: height }">
    <div class="terminal-header" :style="{ backgroundColor: headerBgColor }">
      <div class="terminal-title">{{ title }}</div>
      <div class="terminal-controls">
        <slot name="controls">
          <button v-if="showClearButton" @click="handleClear" class="clear-button">{{ clearButtonText }}</button>
        </slot>
      </div>
    </div>
    <div class="terminal-content" ref="terminalContent" :style="{ backgroundColor: contentBgColor }">
      <slot>
        <div v-for="(log, index) in logs" :key="index" :class="['log-line', log.type || 'info']">
          <span v-if="showTimestamps" class="timestamp">{{ formatTimestamp(log.timestamp) }}</span>
          <span class="message" :style="getLogStyle(log.type)">{{ log.message }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick, PropType } from 'vue'

export interface TerminalLog {
  type?: 'info' | 'error' | 'success' | 'warning' | string
  message: string
  timestamp: Date
}

export default defineComponent({
  name: 'Terminal',
  props: {
    logs: {
      type: Array as PropType<TerminalLog[]>,
      default: () => [],
    },
    title: {
      type: String,
      default: 'Terminal',
    },
    height: {
      type: String,
      default: '400px',
    },
    showTimestamps: {
      type: Boolean,
      default: true,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    showClearButton: {
      type: Boolean,
      default: true,
    },
    clearButtonText: {
      type: String,
      default: 'Clear',
    },
    headerBgColor: {
      type: String,
      default: '#2d2d2d',
    },
    contentBgColor: {
      type: String,
      default: '#1e1e1e',
    },
    logColors: {
      type: Object as PropType<Record<string, string>>,
      default: () => ({
        info: '#fff',
        error: '#ff6b6b',
        success: '#69db7c',
        warning: '#ffd43b',
      }),
    },
    timestampFormat: {
      type: String,
      default: 'time', // 'time', 'datetime', 'custom'
    },
    customTimestampFormatter: {
      type: Function as PropType<(date: Date) => string>,
      default: null,
    },
  },
  emits: ['clear'],
  setup(props, { emit }) {
    const terminalContent = ref<HTMLElement | null>(null)

    const formatTimestamp = (timestamp: Date): string => {
      if (props.customTimestampFormatter) {
        return props.customTimestampFormatter(timestamp)
      }

      switch (props.timestampFormat) {
        case 'datetime':
          return timestamp.toLocaleString()
        case 'time':
        default:
          return timestamp.toLocaleTimeString()
      }
    }

    const handleClear = () => {
      emit('clear')
    }

    const getLogStyle = (type?: string) => {
      if (!type || !props.logColors[type]) {
        return { color: props.logColors.info }
      }
      return { color: props.logColors[type] }
    }

    // Auto-scroll to bottom when new logs are added
    watch(
      () => props.logs.length,
      async () => {
        if (props.autoScroll) {
          await nextTick()
          if (terminalContent.value) {
            terminalContent.value.scrollTop = terminalContent.value.scrollHeight
          }
        }
      }
    )

    return {
      terminalContent,
      formatTimestamp,
      handleClear,
      getLogStyle,
    }
  },
})
</script>

<style scoped>
.terminal {
  background-color: v-bind('contentBgColor');
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #3d3d3d;
}

.terminal-header {
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
  font-size: 0.85em;
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