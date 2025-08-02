<template>
  <view class="chat-display card">
    <view v-if="messages.length === 0" class="welcome-message">
      <text class="text-subtitle text-secondary">欢迎使用智能分析助手！请选择门店和分析问题。</text>
    </view>

    <view v-for="(message, index) in messages" :key="index" class="message-wrapper">
      <view :class="getMessageClass(message)">
        <view v-if="message.type === 'user'" class="message-content user-content">
          <text class="text-body">{{ message.content }}</text>
        </view>
        <view v-else class="message-content ai-content">
          <view v-if="message.loading" class="loading">
            <view class="loading-dot"></view>
            <view class="loading-dot"></view>
            <view class="loading-dot"></view>
          </view>
          <view v-else v-html="renderMarkdown(message.content)"></view>
        </view>
      </view>
    </view>
  </view>
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

const getMessageClass = (message) => {
  let messageTypeClass = 'ai-message'
  if (message.type === 'user') {
    messageTypeClass = 'user-message'
  }
  return [
    'message',
    messageTypeClass
  ]
}

const renderMarkdown = (content) => {
  if (!content) return ''
  return marked(content)
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';

.chat-display {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-5;
  margin-top: $spacing-6;
}

.welcome-message {
  text-align: center;
  padding: $spacing-10 $spacing-5;
}

// 消息样式
.message-wrapper {
  margin-bottom: $spacing-6;
}

.message {
  display: flex;
  margin-bottom: $spacing-4;
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: $spacing-4;
  border-radius: $border-radius-md;
  word-wrap: break-word;
}

.user-content {
  background-color: $primary-color;
  color: $text-primary;
  border-bottom-right-radius: $border-radius-sm;
}

.ai-content {
  background-color: $bg-secondary;
  color: $text-primary;
  border-bottom-left-radius: $border-radius-sm;
}

// 加载动画
.loading {
  display: flex;
  align-items: center;
  gap: $spacing-2;
}

.loading-dot {
  width: 8rpx;
  height: 8rpx;
  background-color: $text-secondary;
  border-radius: 50%;
  animation: loading 1.4s infinite ease-in-out both;
  
  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
}

@keyframes loading {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

// Markdown渲染样式
:deep(h1), :deep(h2), :deep(h3) {
  color: $text-primary;
  margin-top: $spacing-4;
  margin-bottom: $spacing-3;
}

:deep(p) {
  margin-bottom: $spacing-3;
  line-height: $line-height-relaxed;
}

:deep(code) {
  background-color: $bg-tertiary;
  color: $accent-color;
  padding: $spacing-1 $spacing-2;
  border-radius: $border-radius-sm;
  font-family: monospace;
}

:deep(pre) {
  background-color: $bg-tertiary;
  padding: $spacing-4;
  border-radius: $border-radius-md;
  overflow-x: auto;
  margin-bottom: $spacing-4;
}

:deep(ul), :deep(ol) {
  margin-bottom: $spacing-4;
  padding-left: $spacing-8;
}

:deep(li) {
  margin-bottom: $spacing-2;
}

:deep(a) {
  color: $accent-color;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

:deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: $spacing-4;
}

:deep(th), :deep(td) {
  border: 1rpx solid $border-color;
  padding: $spacing-3;
  text-align: left;
}

:deep(th) {
  background-color: $bg-tertiary;
  font-weight: $font-weight-semibold;
}

:deep(blockquote) {
  border-left: 4rpx solid $primary-color;
  padding-left: $spacing-4;
  margin: $spacing-4 0;
  color: $text-secondary;
}

// 添加过渡动画
.message-content {
  transition: all $transition-normal $ease-in-out;
}
</style>