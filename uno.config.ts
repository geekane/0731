import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import presetApplet from '@unocss-applet/preset-applet'
import presetIcons from '@unocss/preset-icons'
import presetLegacyCompat from '@unocss/preset-legacy-compat'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  presets: [
    presetUno(),
    presetApplet(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetLegacyCompat(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      // 主色系
      'primary': '#e53935',
      'primary-light': '#ffccbc',
      'primary-dark': '#ac1900',
      
      // 辅助色系
      'secondary': '#424242',
      'secondary-light': '#6d6d6d',
      'secondary-dark': '#1b1b1b',
      
      // 点缀色系
      'accent': '#ffc107',
      'accent-light': '#fff350',
      'accent-dark': '#c79100',
      
      // 背景色系
      'bg-primary': '#121212',
      'bg-secondary': '#1e1e1e',
      'bg-tertiary': '#2a2a2a',
      
      // 文字色系
      'text-primary': '#ffffff',
      'text-secondary': '#f0f0f0',
      'text-tertiary': '#d0d0d0',
      'text-disabled': '#a0a0a0',
      
      // 状态色系
      'success': '#4caf50',
      'warning': '#ff9800',
      'error': '#f44336',
      'info': '#2196f3',
      
      // 边框和分割线
      'border-color': '#333333',
      'divider-color': '#424242',
      
      // 兼容旧变量名
      'dark-bg': '#121212',
      'primary-red': '#e53935',
      'secondary-gray': '#f0f0f0',
      'card-bg': '#2a2a2a',
      'list-item-bg': '#1e1e1e',
      'text-white': '#ffffff',
      'text-gray': '#f0f0f0',
      'text-dark-gray': '#d0d0d0',
    },
    fontSize: {
      'h1': '48rpx',
      'h2': '40rpx',
      'h3': '36rpx',
      'body': '30rpx',
      'subtitle': '28rpx',
      'caption': '24rpx',
      'button': '30rpx',
      // 兼容旧变量名
      'large': '48rpx',
      'medium': '30rpx',
      'small': '24rpx',
    },
    fontWeight: {
      'light': '300',
      'regular': '400',
      'medium': '500',
      'semibold': '600',
      'bold': '700',
    },
    lineHeight: {
      'tight': '1.2',
      'snug': '1.375',
      'normal': '1.5',
      'relaxed': '1.625',
    },
    spacing: {
      '0': '0',
      '1': '4rpx',
      '2': '8rpx',
      '3': '12rpx',
      '4': '16rpx',
      '5': '20rpx',
      '6': '24rpx',
      '8': '32rpx',
      '10': '40rpx',
      '12': '48rpx',
      '16': '64rpx',
    },
    borderRadius: {
      'none': '0',
      'sm': '4rpx',
      'md': '8rpx',
      'lg': '12rpx',
      'xl': '16rpx',
      '2xl': '20rpx',
      'full': '9999rpx',
      // 兼容旧变量名
      'small': '4rpx',
      'medium': '8rpx',
    },
    boxShadow: {
      'sm': '0 1rpx 2rpx 0 rgba(0, 0, 0, 0.05)',
      'md': '0 4rpx 6rpx -1rpx rgba(0, 0, 0, 0.1), 0 2rpx 4rpx -1rpx rgba(0, 0, 0, 0.06)',
      'lg': '0 10rpx 15rpx -3rpx rgba(0, 0, 0, 0.1), 0 4rpx 6rpx -2rpx rgba(0, 0, 0, 0.05)',
      'xl': '0 20rpx 25rpx -5rpx rgba(0, 0, 0, 0.1), 0 10rpx 10rpx -5rpx rgba(0, 0, 0, 0.04)',
    },
    transitionDuration: {
      'fast': '150ms',
      'normal': '200ms',
      'slow': '300ms',
    },
    transitionTimingFunction: {
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'out': 'cubic-bezier(0, 0, 0.2, 1)',
      'in': 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
  shortcuts: {
    // 按钮样式
    'btn': 'px-4 py-2 rounded-md transition-all duration-normal ease-in-out',
    'btn-primary': 'btn bg-primary text-text-primary hover:bg-primary-dark active:scale-95 shadow-sm hover:shadow-md',
    'btn-secondary': 'btn bg-secondary text-text-primary hover:bg-secondary-dark active:scale-95 shadow-sm hover:shadow-md',
    'btn-accent': 'btn bg-accent text-text-primary hover:bg-accent-dark active:scale-95 shadow-sm hover:shadow-md',
    'btn-ghost': 'btn bg-transparent text-text-primary hover:bg-tertiary active:scale-95',
    'btn-disabled': 'btn bg-disabled text-text-disabled cursor-not-allowed',
    
    // 卡片样式
    'card': 'bg-tertiary rounded-lg shadow-md overflow-hidden',
    'card-interactive': 'card hover:shadow-lg transition-shadow duration-normal cursor-pointer',
    
    // 输入框样式
    'input': 'w-full px-4 py-2 bg-secondary text-text-primary rounded-md border border-border-color focus:border-primary focus:outline-none transition-colors duration-normal',
    
    // 列表项样式
    'list-item': 'flex items-center px-4 py-3 bg-secondary hover:bg-tertiary transition-colors duration-normal',
    
    // 标题样式
    'title-h1': 'text-h1 font-bold leading-tight text-text-primary',
    'title-h2': 'text-h2 font-semibold leading-snug text-text-primary',
    'title-h3': 'text-h3 font-semibold leading-normal text-text-primary',
    
    // 文本样式
    'text-body': 'text-body font-normal leading-relaxed text-text-primary',
    'text-subtitle': 'text-subtitle font-normal leading-normal text-text-secondary',
    'text-caption': 'text-caption font-normal leading-normal text-text-tertiary',
    'text-button': 'text-button font-medium leading-tight',
    
    // 状态样式
    'status-success': 'text-success',
    'status-warning': 'text-warning',
    'status-error': 'text-error',
    'status-info': 'text-info',
    
    // 布局样式
    'container': 'px-4 py-6 max-w-7xl mx-auto',
    'section': 'mb-8',
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col': 'flex flex-col',
    'gap-2': 'gap-2',
    'gap-4': 'gap-4',
    'gap-6': 'gap-6',
    
    // 兼容旧样式
    'profile-container': 'min-h-screen bg-primary p-4',
    'profile-header': 'flex items-center mb-6 p-4 rounded-md bg-tertiary border-1 border-border-color',
    'function-list': 'mb-6 bg-tertiary rounded-md border-1 border-border-color overflow-hidden',
    'exit-btn': 'w-full h-12 bg-primary text-text-primary text-lg font-bold rounded-md active:scale-95 transition-all duration-normal',
  },
})