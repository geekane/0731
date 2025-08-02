<template>
  <view v-if="show" class="query-options">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="请输入或选择查询事项..."
      class="search-input input"
      @input="onSearchInput"
      @focus="showDropdown = true"
      @blur="onBlur"
    />
    <view v-if="showDropdown && filteredQueries.length > 0" class="dropdown card">
      <view
        v-for="(query, index) in filteredQueries"
        :key="index"
        class="dropdown-item list-item"
        @click="selectQuery(query)"
      >
        <text class="text-body">{{ query }}</text>
      </view>
    </view>
    <view v-else-if="!showDropdown" class="query-options-grid">
      <view
        v-for="(query, index) in queries"
        :key="index"
        class="query-option"
        @click="selectQuery(query)"
      >
        <text class="text-body">{{ query }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { queries } from '@/search/mock-data/queries.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const searchQuery = ref('')
const showDropdown = ref(false)

const filteredQueries = computed(() => {
  if (!searchQuery.value) {
    return []
  }
  return queries.filter(query =>
    query.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const onSearchInput = () => {
  // 实时搜索，无需额外处理
}

const selectQuery = (query) => {
  emit('select', query)
  searchQuery.value = query
  showDropdown.value = false // 选择后隐藏下拉菜单
}

const onBlur = () => {
  // 延迟隐藏下拉菜单，确保点击选项时不会立即隐藏
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';

.query-options {
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
  margin-bottom: $spacing-4;
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

.query-options-grid {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-3;
}

.query-option {
  padding: $spacing-3 $spacing-4;
  background-color: $bg-tertiary;
  color: $text-secondary;
  border: 1rpx solid $border-color;
  border-radius: $border-radius-2xl;
  cursor: pointer;
  transition: all $transition-normal $ease-in-out;

  &:active {
    background-color: $bg-secondary;
    border-color: $primary-color;
    transform: scale(0.95);
  }
}

// 添加过渡动画
.dropdown {
  transition: all $transition-normal $ease-in-out;
}
</style>