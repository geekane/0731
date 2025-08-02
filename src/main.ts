import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 创建应用实例
export function createApp() {
  const app = createSSRApp(App)
  
  // 使用 Pinia
  app.use(pinia)
  
  return {
    app
  }
}