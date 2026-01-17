<template>
  <div
      style="background: #f5f9ff; padding: 10px; border-radius: 6px; display: flex; align-items: center; gap: 8px;"
  >
    <span style="color: #409eff;">视频时长：</span>

    <!-- 左侧 -->
    <el-popover
        v-model:visible="startVisible"
        placement="bottom-start"
        width="120px"
        trigger="manual"
    >
      <template #reference>
        <el-input
            v-model="start_duration"
            placeholder="开始（分钟）"
            style="width: 130px;"
            @blur="handleStartBlur"
            @click="tryOpenStart"
            clearable
            @clear="clearDurations"
        />
      </template>

      <div class="dropdown-list">
        <div
            v-for="item in filteredStartList"
            :key="item.value"
            class="dropdown-item"
            :class="{ active: !isEmpty(start_duration) && Number(start_duration) === item.value }"
            @click="selectStart(item.value)"
        >
          {{ item.label }}
        </div>
      </div>
    </el-popover>

    <span>~</span>

    <!-- 右侧 -->
    <el-popover
        v-model:visible="endVisible"
        placement="bottom-start"
        width="120px"
        trigger="manual"
    >
      <template #reference>
        <el-input
            v-model="end_duration"
            placeholder="结束（分钟）"
            style="width: 130px;"
            @blur="handleEndBlur"
            @click="tryOpenEnd"
            clearable
            @clear="clearDurations"
        />
      </template>

      <div class="dropdown-list">
        <div
            v-for="item in filteredEndList"
            :key="item.value"
            class="dropdown-item"
            :class="{ active: !isEmpty(end_duration) && Number(end_duration) === item.value }"
            @click="selectEnd(item.value)"
        >
          {{ item.label }}
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'

interface DurationOption {
  label: string
  value: number
}

const durationList: DurationOption[] = [
  {label: '0分钟', value: 0},
  {label: '1分钟', value: 1},
  {label: '3分钟', value: 3},
  {label: '5分钟', value: 5},
  {label: '10分钟', value: 10},
  {label: '15分钟', value: 15},
  {label: '30分钟', value: 30},
  {label: '45分钟', value: 45},
  {label: '60分钟', value: 60}
]

// 数据
const start_duration = ref<string>('')
const end_duration = ref<string>('')

// Popover 显示状态
const startVisible = ref(false)
const endVisible = ref(false)

const isEmpty = (v: string | number | null | undefined): boolean =>
    v === '' || v === undefined || v === null

// 左侧下拉列表过滤
const filteredStartList = computed(() => {
  if (isEmpty(end_duration.value)) return durationList
  const endVal = Number(end_duration.value)
  const list = durationList.filter(item => item.value <= endVal)
  return list.length ? list : []
})

// 右侧下拉列表过滤
const filteredEndList = computed(() => {
  if (isEmpty(start_duration.value)) return durationList
  const startVal = Number(start_duration.value)
  const list = durationList.filter(item => item.value >= startVal)
  return list.length ? list : []
})

// blur 时处理输入，保留数字
const handleStartBlur = () => {
  if (start_duration.value === '') return
  const cleaned = start_duration.value.replace(/\D/g, '')
  start_duration.value = cleaned === '' ? '' : Number(cleaned).toString()
  if (!isEmpty(end_duration.value) && Number(start_duration.value) > Number(end_duration.value)) {
    end_duration.value = start_duration.value
  }
  startVisible.value = false
}

const handleEndBlur = () => {
  if (end_duration.value === '') return
  const cleaned = end_duration.value.replace(/\D/g, '')
  end_duration.value = cleaned === '' ? '' : Number(cleaned).toString()
  if (!isEmpty(start_duration.value) && Number(end_duration.value) < Number(start_duration.value)) {
    start_duration.value = end_duration.value
  }
  endVisible.value = false
}

// 点击下拉选择
const selectStart = (val: number) => {
  start_duration.value = val.toString()
  handleStartBlur()
}

const selectEnd = (val: number) => {
  end_duration.value = val.toString()
  handleEndBlur()
}

// 手动控制 Popover 打开（仅当过滤列表不为空）
const tryOpenStart = () => {
  startVisible.value = filteredStartList.value.length > 0
}

const tryOpenEnd = () => {
  endVisible.value = filteredEndList.value.length > 0
}

// 统一清空
const clearDurations = () => {
  start_duration.value = ''
  end_duration.value = ''
  startVisible.value = false
  endVisible.value = false
}
</script>

<style scoped>
.dropdown-list {
  display: flex;
  flex-direction: column;
  max-height: 180px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.dropdown-item:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

/* 高亮当前选中项 */
.dropdown-item.active {
  background-color: #409eff;
  color: white;
  font-weight: 500;
}
</style>
