<template>
  <div class="p-4">
    <el-select 
          ref="selectRef"
      v-model="selectedValue" 
      placeholder="请选择用户"
          @visible-change="onVisibleChange"
    >
      <el-option 
        v-for="(item, index) in userOptions" 
        :key="index"
        :value="item.value" 
        :label="item.label"
        :disabled="item.disabled"
      />
    </el-select>
    
    <div class="mt-4">
      <p>已加载: {{ userList.length }} 条，当前页: {{ pageIndex }}，总数: {{ userTotal }}</p>
        <el-button @click="resetData">重置数据</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// 类型定义
interface User {
  id: number
  name: string
}

interface SelectOption {
  label: string
  value: number | string
  disabled?: boolean
}

// 响应式数据
const selectRef = ref()
const selectedValue = ref('')
const userList = ref<User[]>([])
const userOptions = ref<SelectOption[]>([])
const pageIndex = ref(1)
const pageSize = ref(10)
const userTotal = ref(0)
const isLoading = ref(false)

// 监听器管理
let currentScrollWrapper: HTMLElement | null = null
let currentScrollHandler: ((this: HTMLElement, event: Event) => void) | null = null

// 生成模拟用户数据
const generateMockUsers = (start: number, count: number) => {
  const users = []
  for (let i = start; i < start + count; i++) {
    users.push({
      id: i,
      name: `用户${i}`,
    })
  }
  return users
}

// 模拟API请求
const mockGetUserList = async (pageNum: number, pageSizeParam: number) => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const totalUsers = 85
  const startIndex = (pageNum - 1) * pageSizeParam
  const users = generateMockUsers(startIndex, pageSizeParam)
    .filter(user => user.id <= totalUsers)
  
  return {
        data: {
      records: users,
      total: totalUsers,
          current: pageNum,
      size: pageSizeParam
    }
  }
}

// 更新选项列表
const updateOptions = () => {
  const baseOptions = userList.value.map(user => ({
    label: user.name,
    value: user.id,
    disabled: false
  }))
  
  // 如果正在加载且还有更多数据，添加加载中选项
  if (isLoading.value && userList.value.length < userTotal.value) {
    baseOptions.push({
      label: '⏳ 加载中...',
      value: 'loading',
      disabled: true
    })
  }
  
  // 如果没有更多数据了，添加到底了提示
  if (!isLoading.value && userList.value.length > 0 && userList.value.length >= userTotal.value) {
    baseOptions.push({
      label: '✅ 已加载全部数据',
      value: 'no-more',
      disabled: true
    })
  }
  
  // 使用splice保持数组引用不变
  userOptions.value.splice(0, userOptions.value.length, ...baseOptions)
}

// 获取用户列表
const getUserList = async (pageNum = 1, pageSizeParam = pageSize.value) => {
  // 如果已经加载完所有数据，且不是第一页，直接返回
  if (userList.value.length === userTotal.value && pageNum !== 1) {
    console.log('所有数据已加载完成')
    return
  }

  console.log('开始加载用户数据, 页码:', pageNum)
  pageIndex.value = pageNum
  
  // 设置加载状态
  isLoading.value = true
  updateOptions()

  try {
    const response: any = await mockGetUserList(pageNum, pageSizeParam)

    if (pageNum === 1) {
      // 第一页：重置数据
      userList.value = response.data.records
    } else {
      // 后续页：追加数据
      userList.value = userList.value.concat(response.data.records)
    }

    userTotal.value = response.data.total

    console.log('数据加载完成:', {
      当前页: pageNum,
      本次加载: response.data.records.length,
      总已加载: userList.value.length,
      总数据量: userTotal.value
    })

  } catch (error) {
    console.error('加载用户数据失败:', error)
  } finally {
    // 等待DOM更新后再更新加载状态
    await nextTick()
    isLoading.value = false
    updateOptions()
  }
}

// 触底加载更多
const loadMore = () => {
  if (!isLoading.value && userList.value.length < userTotal.value) {
    console.log('🎯 触底触发加载更多')
    getUserList(pageIndex.value + 1)
  }
}

// 清理滚动监听器
const cleanupScrollListener = () => {
  if (currentScrollWrapper && currentScrollHandler) {
    currentScrollWrapper.removeEventListener('scroll', currentScrollHandler)
    currentScrollWrapper.removeEventListener('mousewheel', currentScrollHandler)
    console.log('🧹 清理滚动监听器')
    currentScrollWrapper = null
    currentScrollHandler = null
  }
}

// 设置滚动监听
const setupScrollListener = async () => {
  // 先清理之前的监听器
  cleanupScrollListener()
  
  // 等待下拉框DOM渲染完成
  await nextTick()
  
  // 使用你提供的方式查找滚动容器
  const dropdownElements = document.querySelectorAll(".el-select-dropdown")
  
  if (dropdownElements.length > 0) {
    const scrollWrapper = dropdownElements[0].querySelector('.el-scrollbar__wrap') as HTMLElement
    
    if (scrollWrapper) {
      console.log('✅ 找到滚动容器')
      
      // 滚动事件处理函数
      const scrollHandler = function(this: HTMLElement) {
        const { scrollTop, clientHeight, scrollHeight } = this
        
        // 检查是否滚动到底部
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          console.log("触底加载!")
          loadMore()
        }
      }
      
      // 添加滚动监听
      scrollWrapper.addEventListener('scroll', scrollHandler, { passive: true })
      scrollWrapper.addEventListener('mousewheel', scrollHandler, { passive: true })
      
      // 存储引用用于清理
      currentScrollWrapper = scrollWrapper
      currentScrollHandler = scrollHandler
      
      console.log('✅ 滚动监听器已设置')
    } else {
      console.warn('⚠️ 未找到 .el-scrollbar__wrap 元素')
    }
  } else {
    console.warn('⚠️ 未找到 .el-select-dropdown 元素')
  }
}

// 下拉框显示状态变化
const onVisibleChange = async (visible: boolean) => {
  console.log('下拉框状态变化:', visible)
  
  if (visible) {
    // 下拉框打开时设置滚动监听
    await setupScrollListener()
    
    // 如果没有数据，加载第一页
    if (userList.value.length === 0) {
      await getUserList(1)
    }
  } else {
    // 下拉框关闭时清理监听器
    cleanupScrollListener()
  }
}

// 重置数据
const resetData = async () => {
  pageIndex.value = 1
  userTotal.value = 0
  selectedValue.value = ''
  isLoading.value = false
  
  // 清空数据但保持数组引用
  userList.value.splice(0, userList.value.length)
  userOptions.value.splice(0, userOptions.value.length)
  
  // 等待DOM更新后再加载数据
  await nextTick()
  await getUserList(1)
}

// 组件挂载后的初始化
onMounted(async () => {
  console.log('🚀 组件已挂载')
  // 等待DOM更新后初始加载第一页数据
  await nextTick()
  await getUserList(1)
})

// 组件卸载时清理
onUnmounted(() => {
  console.log('🧹 组件卸载，清理监听器')
  cleanupScrollListener()
})
</script>

<style>
/* 可以添加一些样式美化加载状态选项 */
.el-select-dropdown__item.is-disabled {
  color: #999 !important;
  font-style: italic;
  text-align: center;
}
</style>