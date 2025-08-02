/**
 * 用户相关API
 */

import { un } from '@uni-helper/uni-network'
import type { UnConfig as RequestConfig } from '@uni-helper/uni-network'

// 用户信息类型
export interface UserInfo {
  id: number
  name: string
  avatar: string
  email: string
  position?: string
}

// 登录请求参数
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应数据
export interface LoginResponse {
  success: boolean
  user?: UserInfo
  message?: string
}

/**
 * 用户登录
 * @param data 登录参数
 * @returns 登录响应
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    // 调用后端登录API
    const response = await un<LoginResponse>({
      url: '/api/auth/login',
      method: 'POST',
      data: {
        username: data.username,
        password: data.password
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // 检查响应数据是否存在
    if (response.data) {
      return response.data
    } else {
      return {
        success: false,
        message: '登录请求失败，无响应数据'
      }
    }
  } catch (error) {
    console.error('登录请求失败:', error)
    return {
      success: false,
      message: '登录请求失败'
    }
  }
}

/**
 * 获取用户信息
 * @param config 请求配置
 * @returns 用户信息
 */
export async function getUserInfo(config?: RequestConfig): Promise<UserInfo> {
  // 模拟API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: 'Admin',
        avatar: '/static/avatar.jpg',
        email: 'admin@example.com',
        position: '门店经理'
      })
    }, 500)
  })
}

/**
 * 退出登录
 * @param config 请求配置
 * @returns 退出结果
 */
export async function logout(config?: RequestConfig): Promise<boolean> {
  // 模拟API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}