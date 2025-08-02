<template>
  <view class="profile-container">
    <!-- 登录表单 -->
    <view v-if="!isLoggedIn" class="login-form">
      <view class="login-header">
        <view class="header-icon">
          <i class="i-carbon-user-certification text-primary"></i>
        </view>
        <text class="login-title">用户登录</text>
      </view>
      <view class="form-group">
        <view class="input-wrapper">
          <i class="i-carbon-user input-icon"></i>
          <input
            class="form-input"
            type="text"
            placeholder="请输入用户名"
            v-model="loginForm.username"
          />
        </view>
      </view>
      <view class="form-group">
        <view class="input-wrapper">
          <i class="i-carbon-password input-icon"></i>
          <input
            class="form-input"
            type="password"
            placeholder="请输入密码"
            v-model="loginForm.password"
          />
        </view>
      </view>
      <button class="login-btn" @click="handleLogin">
        <i class="i-carbon-login"></i>
        <text class="button-text">登录</text>
      </button>
      <view v-if="loginError" class="error-message">{{ loginError }}</view>
    </view>

    <!-- 已登录内容 -->
    <view v-else>
      <!-- 个人信息区域 -->
      <view class="profile-header card">
        <view class="avatar-container">
          <image class="avatar" src="/static/avatar.jpg" mode="aspectFill" />
        </view>
        <view class="user-info">
          <text class="username title-h2" style="color: #ffffff;">{{ userInfo.name }}</text>
          <text class="position text-subtitle" style="color: #f0f0f0;">{{ userInfo.position }}</text>
        </view>
      </view>


      <!-- 功能列表 -->
      <view class="function-list card">
        <view class="list-item" v-for="(item, index) in functionList" :key="index" @click="handleFunctionClick(index)">
          <view class="item-icon status-primary">
            <i :class="item.icon"></i>
          </view>
          <text class="item-text text-body" style="color: #ffffff;">{{ item.text }}</text>
          <view class="arrow">
            <i class="i-carbon-chevron-right" style="color: #f0f0f0;"></i>
          </view>
        </view>
      </view>

      <!-- 退出登录按钮 -->
      <button class="exit-btn btn-primary" @click="handleExit">退出登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { login as apiLogin } from '@/api/user'

// 使用用户状态管理
const userStore = useUserStore()

// 计算属性：是否已登录
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 计算属性：用户信息
const userInfo = computed(() => ({
  name: userStore.userInfo?.name || '未知用户',
  position: userStore.userInfo?.position || '门店经理'
}))

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 登录错误信息
const loginError = ref('')

// 功能列表
const functionList = [
  { icon: 'i-carbon-settings', text: '门店设置' },
  { icon: 'i-carbon-user-multiple', text: '员工管理' },
  { icon: 'i-carbon-notification', text: '消息中心' },
  { icon: 'i-carbon-password', text: '修改密码' },
  { icon: 'i-carbon-information', text: '关于我们' }
]

// 处理登录事件
const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    loginError.value = '请输入用户名和密码'
    return
  }

  try {
    // 调用登录API
    const result = await userStore.login(loginForm.username, loginForm.password)

    if (!result.success) {
      loginError.value = result.message || '登录失败，请检查用户名和密码'
    } else {
      // 清除错误信息
      loginError.value = ''
    }
  } catch (error) {
    console.error('登录失败:', error)
    loginError.value = '登录失败，请检查用户名和密码'
  }
}

// 处理功能项点击事件
const handleFunctionClick = (index: number) => {
  console.log(`点击了功能项: ${functionList[index].text}`)
  // 这里可以添加具体的功能逻辑
}

// 处理退出登录事件
const handleExit = () => {
  console.log('点击了退出登录按钮')
  // 添加动画效果
  const exitBtn = document.querySelector('.exit-btn') as HTMLElement;
  if (exitBtn) {
    exitBtn.classList.add('exit-animation');
    // 动画结束后执行退出逻辑
    setTimeout(() => {
      // 执行退出登录操作
      userStore.logout()
      console.log('执行退出登录操作');
    }, 200);
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';

.profile-container {
  min-height: 100vh;
  background-color: $bg-primary;
  padding: $spacing-4;
  padding-bottom: 140rpx; // 为底部导航栏留出空间
}

// 登录表单样式
.login-form {
  margin-top: $spacing-10;
  border-radius: $border-radius-2xl;
  overflow: hidden;
  background-color: $bg-secondary;
  padding: $spacing-8;
  box-shadow: $shadow-md;
}

.login-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-10;
  padding: $spacing-6;
  background-color: rgba($primary-color, 0.1);
  border-radius: $border-radius-2xl;
  border-left: 6rpx solid $primary-color;
}

.header-icon {
  margin-right: $spacing-4;
  font-size: 48rpx;
}

.login-title {
  font-size: $font-size-h1;
  font-weight: $font-weight-bold;
  letter-spacing: $letter-spacing-wide;
  color: #ffffff;
}

.form-group {
  margin-bottom: $spacing-8;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: $bg-tertiary;
  border-radius: $border-radius-2xl;
  padding: $spacing-4 $spacing-6;
  transition: all $transition-normal $ease-in-out;

  &:focus-within {
    background-color: lighten($bg-tertiary, 5%);
    box-shadow: 0 0 0 2rpx rgba($primary-color, 0.3);
  }
}

.input-icon {
  margin-right: $spacing-4;
  font-size: 32rpx;
  color: $primary-color;
}

.form-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: $font-size-body;
  outline: none;

  &::placeholder {
    color: #f0f0f0; /* 使用更亮的颜色 */
  }
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 96rpx;
  margin-top: $spacing-8;
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

.error-message {
  text-align: center;
  margin-top: $spacing-6;
  color: $error-color;
  font-size: $font-size-caption;
  padding: $spacing-2;
  background-color: rgba($error-color, 0.1);
  border-radius: $border-radius-md;
}

// 个人信息区域
.profile-header {
  margin-bottom: $spacing-8;
  position: relative;
  overflow: hidden;
  padding: $spacing-8;
  border-radius: $border-radius-2xl;
  display: flex;
  align-items: center;

  // 碳纤维纹理背景效果
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.05) 75%),
      linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.05) 75%);
    background-size: 20rpx 20rpx;
    background-position: 0 0, 10rpx 10rpx;
    opacity: 0.3;
  }
}

.avatar-container {
  position: relative;
  margin-right: $spacing-8;
  z-index: 1;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 4rpx solid $primary-color;
  box-shadow: $shadow-lg;
}

.user-info {
  display: flex;
  flex-direction: column;
  z-index: 1;
  flex: 1;
}

.username {
  margin-bottom: $spacing-3;
  font-size: $font-size-h1;
  font-weight: $font-weight-bold;
}

.position {
  font-size: $font-size-subtitle;
  opacity: 0.9;
}

// 门店关联信息卡片
.store-card {
  margin-bottom: $spacing-6;
}

.card-title {
  margin-bottom: $spacing-6;
}

.info-item {
  display: flex;
  margin-bottom: $spacing-4;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-value {
  &.connected {
    color: $success-color;
  }
}

// 功能列表
.function-list {
  margin-bottom: $spacing-8;
  border-radius: $border-radius-2xl;
  overflow: hidden;
}

.list-item {
  display: flex;
  align-items: center;
  height: 120rpx;
  padding: 0 $spacing-8;
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

.item-icon {
  font-size: 40rpx;
  margin-right: $spacing-6;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($primary-color, 0.2);
  border-radius: 50%;
}

.arrow {
  font-size: 32rpx;
  transition: transform $transition-normal $ease-in-out;
}

.list-item:active .arrow {
  transform: translateX(4rpx);
}

// 退出登录按钮
.exit-btn {
  margin-top: $spacing-10;
  border-radius: $border-radius-2xl;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: $font-weight-semibold;
  letter-spacing: $letter-spacing-wide;
  
  // 添加渐变消失动画
  &.exit-animation {
    animation: fadeOut $transition-normal $ease-in-out forwards;
  }
}

// 添加动画关键帧
@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

// 为页面元素添加过渡动画
.profile-header, .store-card, .function-list, .exit-btn {
  transition: all $transition-slow $ease-in-out;
}

// 优化交互反馈效果
.list-item {
  transition: background-color $transition-normal $ease-in-out;
}
</style>
