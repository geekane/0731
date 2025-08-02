<script setup lang="ts">
// App.vue - 应用根组件
import BottomNavbar from './components/BottomNavbar.vue'
</script>

<template>
  <view class="app-container">
    <!-- 应用内容将在这里渲染 -->
    <router-view />
    <!-- 全局底部导航栏 -->
    <BottomNavbar />
  </view>
</template>

<style lang="scss">
/* 全局样式 */
.app-container {
  background-color: #1a1a1a;
  min-height: 100vh;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

/* 全局样式重置 */
view,
text {
  box-sizing: border-box;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  display: none;
}
</style>