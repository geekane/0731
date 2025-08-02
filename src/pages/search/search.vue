<template>
  <view class="search-page">
    <view class="page-header">
      <view class="header-icon">
        <i class="i-carbon-search text-primary"></i>
      </view>
      <text class="page-title">智能分析助手</text>
    </view>
    
    <view class="section-card">
      <StoreSelector
        v-model="selectedStore"
        @update:modelValue="onStoreSelected"
      />
    </view>
    
    <view class="section-card">
      <QueryOptions
        @select="onQuerySelect"
      />
    </view>
    
    <button
      class="query-button"
      @click="handleQuery"
    >
      <i class="i-carbon-data-check"></i>
      <text class="button-text">查询</text>
    </button>
    
    <view class="chat-container">
      <ChatDisplay :messages="messages" />
    </view>
    
    <button
      v-if="showResetButton"
      class="reset-button"
      @click="resetChat"
    >
      <i class="i-carbon-reset"></i>
      <text class="button-text">开始新的查询</text>
    </button>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import StoreSelector from '@/search/components/StoreSelector.vue'
import QueryOptions from '@/search/components/QueryOptions.vue'
import ChatDisplay from '@/search/components/ChatDisplay.vue'
import { responses } from '@/search/mock-data/responses.js'

// 状态管理
const selectedStore = ref(null)
const selectedQuery = ref('')
const messages = ref([])
const showResetButton = computed(() => messages.value.length > 0)

// 门店选择处理
const onStoreSelected = (store) => {
  selectedStore.value = store
  // 清空之前的消息
  messages.value = []
}

// 查询选择处理
const onQuerySelect = (query) => {
  selectedQuery.value = query
}

// 查询处理
const handleQuery = () => {
  if (!selectedStore.value || !selectedQuery.value) return
  
  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: `分析 '${selectedStore.value.name}' 的 '${selectedQuery.value}'`
  })
  
  // 添加AI加载消息
  const loadingIndex = messages.value.length
  messages.value.push({
    type: 'ai',
    loading: true,
    content: ''
  })
  
  // 模拟API请求延迟
  setTimeout(() => {
    // 获取模拟响应
    const storeResponses = responses[selectedStore.value.id] || {}
    const responseContent = storeResponses[selectedQuery.value] || '# 未找到相关分析\n\n请尝试其他查询问题。'
    
    // 更新AI消息
    messages.value[loadingIndex] = {
      type: 'ai',
      loading: false,
      content: responseContent
    }
  }, 1500)
}

// 重置聊天
const resetChat = () => {
  selectedStore.value = null
  selectedQuery.value = ''
  messages.value = []
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';

.search-page {
  padding: $spacing-5;
  min-height: 100vh;
  background-color: $bg-primary;
  color: $text-secondary;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-10;
  padding: $spacing-6;
  background-color: rgba($primary-color, 0.1);
  border-radius: 0;
  border-left: 6rpx solid $primary-color;
}

.header-icon {
  margin-right: $spacing-4;
  font-size: 48rpx;
}

.page-title {
  font-size: $font-size-h1;
  font-weight: $font-weight-bold;
  letter-spacing: $letter-spacing-wide;
  color: #ffffff;
}

.section-card {
  margin-bottom: $spacing-6;
  border-radius: $border-radius-2xl;
  overflow: hidden;
  background-color: $bg-secondary;
  padding: $spacing-6;
  box-shadow: $shadow-sm;
  transition: all $transition-normal $ease-in-out;

  &:active {
    transform: translateY(2rpx);
    box-shadow: $shadow-md;
  }
}

.query-button, .reset-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 96rpx;
  margin-bottom: $spacing-6;
  border-radius: $border-radius-2xl;
  background-color: rgba($primary-color, 0.2);
  color: #ffffff;
  font-weight: $font-weight-semibold;
  letter-spacing: $letter-spacing-wide;
  transition: all $transition-normal $ease-in-out;
  box-shadow: $shadow-sm;

  &:active {
    background-color: rgba($primary-color, 0.3);
    transform: scale(0.98);
    box-shadow: $shadow-md;
  }
}

.button-text {
  margin-left: $spacing-2;
  font-size: $font-size-button;
}

.chat-container {
  margin-bottom: $spacing-6;
  border-radius: $border-radius-2xl;
  overflow: hidden;
  background-color: $bg-secondary;
  box-shadow: $shadow-sm;
}

// 添加过渡动画
.query-button, .reset-button, .section-card {
  transition: all $transition-normal $ease-in-out;
}
</style>