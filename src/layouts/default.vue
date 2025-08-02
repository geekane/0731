<template>
  <view class="layout-default">
    <!-- 页面内容 -->
    <slot />
    
    <!-- 底部导航栏 -->
    <BottomNavbar />
  </view>
</template>

<script setup lang="ts">
// 这里可以添加布局相关的逻辑
</script>

<style lang="scss" scoped>
.layout-default {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>