<template>
  <view class="store-selector">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="请输入或选择门店名称..."
      class="search-input input"
      @input="onSearchInput"
      @focus="showDropdown = true"
      @blur="onBlur"
    />
    <view v-if="showDropdown && filteredStores.length > 0" class="dropdown card">
      <view
        v-for="store in filteredStores"
        :key="store.id"
        class="dropdown-item list-item"
        @click="selectStore(store)"
      >
        <text class="text-body">{{ store.name }}</text>
      </view>
      <view v-if="filteredStores.length === 0" class="no-results">
        <text class="text-caption text-tertiary">未找到相关门店</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { stores } from '@/search/mock-data/stores.js'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')
const showDropdown = ref(false)

const filteredStores = computed(() => {
  if (!searchQuery.value) {
    return stores
  }
  return stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const onSearchInput = () => {
  showDropdown.value = true
  // 实时搜索，无需额外处理
}

const onBlur = () => {
  // 延迟隐藏下拉菜单，以允许点击事件处理
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const selectStore = (store) => {
  emit('update:modelValue', store)
  searchQuery.value = store.name
  showDropdown.value = false
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';

.store-selector {
  position: relative;
  width: 100%;
  margin-bottom: $spacing-6;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border-top: none;
  border-radius: 0 0 $border-radius-md $border-radius-md;
  max-height: 400rpx;
  overflow-y: auto;
  z-index: 100;
  margin-top: $spacing-1;
  box-shadow: $shadow-md;
}

.dropdown-item {
  cursor: pointer;
  border-bottom: 1rpx solid $divider-color;
  transition: background-color $transition-normal $ease-in-out;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: $bg-tertiary;
  }
}

.no-results {
  padding: $spacing-4;
}

// 添加过渡动画
.dropdown {
  transition: all $transition-normal $ease-in-out;
}
</style>
