<template>
  <view class="bottom-navbar">
    <view
      class="nav-item"
      v-for="(item, index) in navItems"
      :key="index"
      :class="{ 'active': activeIndex === index }"
      @click="handleNavClick(index)"
    >
      <image
        class="nav-icon"
        :src="getIconSrc(index)"
        mode="aspectFit"
      />
      <text class="nav-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 定义导航项接口
interface NavItem {
  icon: string
  activeIcon: string
  text: string
  path: string
}

// 导航项数组（严格规范格式，避免特殊字符）
const navItems: NavItem[] = [
  {
    icon: '/static/tabbar/store.png',
    activeIcon: '/static/tabbar/store-active.png',
    text: '门店',
    path: '/pages/index/index'
  },
  {
    icon: '/static/tabbar/search.png',
    activeIcon: '/static/tabbar/search-active.png',
    text: '查询',
    path: '/pages/search/search'
  },
  {
    icon: '/static/tabbar/profile.png',
    activeIcon: '/static/tabbar/profile-active.png',
    text: '我的',
    path: '/pages/profile/profile'
  }
]

// 当前激活索引
const activeIndex = ref<number>(0)

// 修复三元运算符（将错误字符替换为?）
const getIconSrc = (index: number): string => {
  return activeIndex.value === index ? navItems[index].activeIcon : navItems[index].icon
}

// 更新激活项
const updateActiveIndex = () => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    const currentRoute = `/${currentPage.route}`
    const index = navItems.findIndex(item => item.path === currentRoute)
    if (index !== -1) {
      activeIndex.value = index
    }
  }
}

// 页面加载时初始化
onLoad(() => {
  updateActiveIndex()
})

// 导航点击事件
const handleNavClick = (index: number) => {
  activeIndex.value = index
  uni.switchTab({
    url: navItems[index].path
  })
}
</script>

<style lang="scss" scoped>
.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #1a1a1a;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1rpx solid #ff0000;
  z-index: 999;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex: 1;
  transition: all 0.2s ease-in-out;

  &.active {
    .nav-text {
      color: #ff0000;
    }
  }
}

.nav-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 4rpx;
}

.nav-text {
  font-size: 24rpx;
  color: #cccccc;
}
</style>
