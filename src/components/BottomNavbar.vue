<template>
  <view class="bottom-navbar">
    <view
      class="nav-item"
      v-for="(item, index) in navItems"
      :key="index"
      :class="{ 'active': activeIndex === index }"
      @click="handleNavClick(index)"
    >
      <view class="nav-icon-wrapper">
        <view class="nav-icon" :class="getIconClass(index)"></view>
      </view>
      <text class="nav-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

interface NavItem {
  icon: string;
  activeIcon: string;
  text: string;
  path: string;
}

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
];

const activeIndex = ref<number>(0);

const getIconSrc = (index: number): string => {
  if (activeIndex.value === index) {
    return navItems[index].activeIcon;
  }
  return navItems[index].icon;
};

const getIconClass = (index: number): string => {
  if (activeIndex.value === index) {
    switch (index) {
      case 0:
        return 'i-carbon-store';
      case 1:
        return 'i-carbon-search';
      case 2:
        return 'i-carbon-user';
      default:
        return '';
    }
  } else {
    switch (index) {
      case 0:
        return 'i-carbon-store';
      case 1:
        return 'i-carbon-search';
      case 2:
        return 'i-carbon-user';
      default:
        return '';
    }
  }
};

const updateActiveIndex = (): void => {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    const currentRoute = `/${currentPage.route}`;
    const idx = navItems.findIndex(item => item.path === currentRoute);
    if (idx !== -1) {
      activeIndex.value = idx;
    }
  }
};

onLoad(() => {
  updateActiveIndex();
});

const handleNavClick = (index: number): void => {
  activeIndex.value = index;
  uni.switchTab({
    url: navItems[index].path
  });
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';

.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background-color: $bg-primary;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1rpx solid $border-color;
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex: 1;
  transition: all $transition-normal $ease-in-out;
  position: relative;
  padding: $spacing-2 0;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 40rpx;
    height: 4rpx;
    background-color: $primary-color;
    border-radius: 0 0 $border-radius-full $border-radius-full;
    transition: transform $transition-normal $ease-out;
  }

  &.active {
    .nav-text {
      color: $primary-color;
      font-weight: $font-weight-medium;
    }

    &::after {
      transform: translateX(-50%) scaleX(1);
    }
  }

  &:active {
    transform: scale(0.95);
  }
}

.nav-icon-wrapper {
  margin-bottom: $spacing-1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  transition: all $transition-normal $ease-out;
}

.nav-item.active .nav-icon-wrapper {
  background-color: rgba($primary-color, 0.2);
}

.nav-icon {
  font-size: 36rpx;
  color: $text-tertiary;
  transition: all $transition-normal $ease-out;
}

.nav-item.active .nav-icon {
  color: $primary-color;
}

.nav-item:active .nav-icon-wrapper {
  transform: scale(0.9);
}

.nav-text {
  font-size: $font-size-caption;
  color: $text-secondary;
  transition: color $transition-normal $ease-out, font-weight $transition-normal $ease-out;
  line-height: 1;
}
</style>
