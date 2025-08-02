import { defineConfig } from 'vite'
import Uni from '@uni-helper/plugin-uni'
import Components from '@uni-helper/vite-plugin-uni-components'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import * as UniManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
import Optimization from '@uni-ku/bundle-optimizer'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { presetUni } from '@uni-helper/unocss-preset-uni'
import { presetLegacyCompat } from '@unocss/preset-legacy-compat'
import ViteRestart from 'vite-plugin-restart'
import path from 'node:path'

export default defineConfig({
  // 设置正确的公共基础路径，确保资源路径正确
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    // Auto restart server when config files change
    ViteRestart({
      // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
      restart: ['vite.config.js'],
    }),
    // Uni Platform
    UniPlatform(),
    // Uni Manifest
    UniManifest.VitePluginUniManifest(),
    // Uni Pages
    UniPages({
      exclude: ['**/components/**/**.*'],
      // homePage 通过 vue 文件的 route-block 的 type="home" 来设置
      // pages 目录为 src/pages，分包目录不能配置在 pages 目录下
      subPackages: ['src/pages-sub'], // 是个数组，可以配置多个，但是不能为 pages 里面的目录
      dts: 'src/types/uni-pages.d.ts',
    }),
    // Uni Layouts
    UniLayouts(),
    // Auto import APIs
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
      ],
      imports: [
        'vue',
        'uni-app',
        'pinia',
      ],
      dts: 'src/types/auto-imports.d.ts',
      dirs: [
        'src/stores',
      ],
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    // Auto import Components
    Components({
      dts: 'src/types/components.d.ts',
      dirs: [
        'src/components',
      ],
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
      ],
      exclude: [
        /[\\/]node_modules[\\/]/,
        /[\\/]\.git[\\/]/,
        /[\\/]\.nuxt[\\/]/,
      ],
    }),
    // UniApp
    Uni(),
    // Unocss
    UnoCSS({
      presets: [
        presetUni(),
      ],
    }),
    // Bundle Optimizer
    Optimization(),
    // Visualizer
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    // Proxy for API requests
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        // 不重写路径，保持 /api 前缀
      },
    },
  },
  build: {
    // 移除Vue的外部依赖配置，确保Vue被打包到应用中
    rollupOptions: {
      // 不再需要将Vue标记为外部依赖
      output: {
        // 确保资源文件名包含哈希值，避免缓存问题
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
    // 确保资源路径正确配置
    assetsDir: 'assets',
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 生成sourcemap
    sourcemap: true, // 启用sourcemap，便于调试
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // 保留console日志，便于调试
        drop_debugger: true,
      },
    },
    // 构建报告
    reportCompressedSize: false,
    // 分块策略
    chunkSizeWarningLimit: 1000,
  },
})