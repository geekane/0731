<route lang="json">
{
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "门店"
  }
}
</route>

<template>
  <view class="page-container">
    <view class="header">
      <text class="title title-h1">门店</text>
    </view>

    <!-- 需要关注的门店提醒模块 -->
    <view v-if="poorStores.length > 0" class="poor-stores-section">
      <view class="section-header">
        <view class="section-icon">
          <i class="i-carbon-warning-alt text-primary"></i>
        </view>
        <text class="section-title-text" style="color: #ffffff;">需要关注的门店</text>
      </view>
      <view class="stores-list card">
        <view
          v-for="(store, index) in poorStores"
          :key="index"
          class="store-item"
        >
          <view class="store-info">
            <text class="store-name" style="color: #ffffff;">{{ store.storeName }}</text>
            <view class="store-metrics">
              <view class="metric-item">
                <i class="i-carbon-shopping-bag metric-icon"></i>
                <text class="metric-text" style="color: #f0f0f0;">核销变化: {{ store.sales }}</text>
              </view>
              <view class="metric-item">
                <i class="i-carbon-chart-line metric-icon"></i>
                <text class="metric-text" style="color: #f0f0f0;">经营分变化: {{ store.visits }}</text>
              </view>
            </view>
          </view>
          <view class="action-button">
            <text class="button-text" style="color: #ffffff;">查看详情</text>
            <i class="i-carbon-chevron-right arrow-icon"></i>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 定义门店数据结构
interface Store {
  storeName: string
  sales: number
  visits: number
}

// 响应式数据
const poorStores = ref<Store[]>([])
const isLoading = ref<boolean>(false)

// 获取表现较差的门店数据
const fetchPoorStores = async () => {
  try {
    // 显示加载状态
    isLoading.value = true

    // 使用相对路径或者处理跨域问题
    const response = await uni.request({
      url: '/api/stats/poor-stores',
      method: 'GET',
      data: {
        threshold: -5000
      }
    })

    isLoading.value = false

    if (response.statusCode === 200) {
      // 处理从后端API返回的数据结构
      const rawData = response.data as any[]
      console.log('从后端获取的原始数据:', rawData)

      // 直接使用后端处理后的数据，适配后端返回的数据结构
      poorStores.value = rawData.map(item => ({
        storeName: item.storeName,
        sales: item.sales || 0,
        visits: item.visits || 0  // 如果后端没有返回visits字段，则设为0
      })).filter(item => item.storeName && item.storeName !== '未知门店') // 过滤掉未知门店

      console.log('处理后的门店数据:', poorStores.value)
    } else {
      console.error('API返回错误状态码:', response.statusCode)
      uni.showToast({
        title: '数据获取失败',
        icon: 'error'
      })
    }
  } catch (error) {
    isLoading.value = false
    console.error('获取门店数据失败:', error)
    uni.showToast({
      title: '网络请求失败',
      icon: 'error'
    })
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchPoorStores()
})
</script>

<style scoped lang="scss">
@import '@/styles/vars.scss';

.page-container {
  min-height: 100vh;
  background-color: $bg-primary;
  padding: $spacing-4;
}

.header {
  padding: $spacing-5 0;
  text-align: center;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: $spacing-10;
}


/* 需要关注的门店提醒模块样式 */
.poor-stores-section {
  margin: $spacing-6;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-8;
  padding: $spacing-6;
  background-color: rgba($primary-color, 0.1);
  border-radius: 0;
  border-left: 6rpx solid $primary-color;
}

.section-icon {
  margin-right: $spacing-4;
  font-size: 48rpx;
}

.section-title-text {
  font-size: $font-size-h1;
  font-weight: $font-weight-bold;
  letter-spacing: $letter-spacing-wide;
}

.stores-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-6;
  border-radius: $border-radius-2xl;
  overflow: hidden;
}

.store-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-6;
  background-color: $bg-secondary;
  border-bottom: 1rpx solid $divider-color;
  transition: all $transition-normal $ease-in-out;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: $bg-tertiary;
    transform: translateX(4rpx);
  }
}

.store-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.store-name {
  font-size: $font-size-h3;
  font-weight: $font-weight-semibold;
  margin-bottom: $spacing-4;
}

.store-metrics {
  display: flex;
  gap: $spacing-8;
}

.metric-item {
  display: flex;
  align-items: center;
}

.metric-icon {
  margin-right: $spacing-2;
  font-size: 24rpx;
  color: $primary-color;
}

.metric-text {
  font-size: $font-size-caption;
}

.action-button {
  display: flex;
  align-items: center;
  padding: $spacing-3 $spacing-6;
  background-color: rgba($primary-color, 0.2);
  border-radius: $border-radius-full;
  transition: all $transition-normal $ease-in-out;

  &:active {
    background-color: rgba($primary-color, 0.3);
    transform: scale(0.95);
  }
}

.button-text {
  font-size: $font-size-caption;
  font-weight: $font-weight-medium;
  margin-right: $spacing-2;
}

.arrow-icon {
  font-size: 24rpx;
  transition: transform $transition-normal $ease-in-out;
}

.store-item:active .arrow-icon {
  transform: translateX(4rpx);
}

// 添加过渡动画
.store-item {
  transition: all $transition-normal $ease-in-out;
  
  &:active {
    transform: scale(0.98);
    background-color: $bg-tertiary;
  }
}

.action-button {
  transition: all $transition-normal $ease-in-out;
  
  &:active {
    transform: scale(0.95);
  }
}
</style>

