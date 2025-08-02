<template>
  <div class="chat-display">
    <div v-if="messages.length === 0" class="welcome-message">
      <p>欢迎使用智能分析助手！请选择门店和分析问题。</p>
    </div>

    <div v-for="(message, index) in messages" :key="index" class="message-wrapper">
      <div
        :class="message.type === 'user' ? 'message user-message' : 'message ai-message'"
      >
        <div v-if="message.type === 'user'" class="message-content user-content">
          {{ message.content }}
        </div>
        <div v-else class="message-content ai-content">
          <div v-if="message.loading" class="loading">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
          <div v-else v-html="renderMarkdown(message.content)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  }
})

const renderMarkdown = (content) => {
  if (!content) return ''
  return marked(content)
}
</script>

<style scoped>
.chat-display {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #1a1a1a;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  margin-top: 20px;
}

.welcome-message {
  text-align: center;
  color: #cccccc;
  padding: 40px 20px;
}

.message-wrapper {
  margin-bottom: 20px;
}

.message {
  display: flex;
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
}

.user-content {
  background-color: #ff0000;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.ai-content {
  background-color: #2a2a2a;
  color: #cccccc;
  border-bottom-left-radius: 4px;
}

.loading {
  display: flex;
  align-items: center;
}

.loading-dot {
  width: 8px;
  height: 8px;
  background-color: #cccccc;
  border-radius: 50%;
  margin: 0 4px;
  animation: loading 1.4s infinite ease-in-out both;
}

.loading-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>