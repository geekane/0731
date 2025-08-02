import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin } from '@/api/user'

// 用户信息接口
interface UserInfo {
  id: number | string
  name: string
  position?: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string | null>(null)
  const userInfo = ref<UserInfo | null>(null)

  // Getters (computed)
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  async function login(username: string, password: string) {
    try {
      // 调用登录API
      const response = await apiLogin({ username, password })

      if (response.success && response.user) {
        // 设置用户信息
        token.value = 'logged-in-token' // 简化处理，实际应该使用JWT token
        userInfo.value = {
          id: response.user.id,
          name: response.user.name,
          position: response.user.position || '门店经理'
        }
        return { success: true }
      } else {
        return { success: false, message: response.message || '登录失败' }
      }
    } catch (error) {
      console.error('登录请求失败:', error)
      return { success: false, message: '登录请求失败' }
    }
  }

  function logout() {
    token.value = null
    userInfo.value = null
  }

  return { token, userInfo, isLoggedIn, login, logout }
}, {
  // 添加持久化配置
  persist: true
})