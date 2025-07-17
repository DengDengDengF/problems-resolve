<template>
  <el-date-picker
      v-model="dateRange"
      type="daterange"
      unlink-panels
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :disabledDate="disabledDate"
      @calendar-change="onCalendarChange"
      @visible-change="onVisibleChange"
      :clearable="false"
      style="width: 320px"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**
 * 当前选中的日期范围 [开始日期, 结束日期]
 */
const dateRange = ref<[Date, Date]>([new Date(), new Date()])

/**
 * 当前选中的开始日期（用于动态控制结束时间范围）
 */
const limitStartDate = ref<Date | null>(null)

/**
 * 日历面板变化时记录开始时间
 */
function onCalendarChange(dates: Date[]) {
  if (Array.isArray(dates) && dates.length > 0) {
    limitStartDate.value = dates[0]
  } else {
    limitStartDate.value = null
  }
}

/**
 * 弹窗关闭时清空限制状态
 */
function onVisibleChange(visible: boolean) {
  if (!visible) {
    limitStartDate.value = null
  }
}

/**
 * 日期禁用规则
 */
function disabledDate(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const current = new Date(date)
  current.setHours(0, 0, 0, 0)

  if (!limitStartDate.value) {
    // 还没选开始时间，禁用今天之后的日期
    return current > today
  }

  const start = new Date(limitStartDate.value)
  start.setHours(0, 0, 0, 0)

  const startYear = start.getFullYear()
  const startMonth = start.getMonth()

  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()

  const isStartInThisMonth =
      startYear === todayYear && startMonth === todayMonth

  if (isStartInThisMonth) {
    // ✅ 本月内：可选范围是 [上个月今天, 今天]
    const lastMonthToday = new Date(today)
    lastMonthToday.setMonth(todayMonth - 1)
    lastMonthToday.setDate(today.getDate())
    lastMonthToday.setHours(0, 0, 0, 0)

    return current < lastMonthToday || current > today
  } else {
    // ✅ 上个月或更早：可选范围是 [当月1号, 当月最后一天]
    const monthStart = new Date(startYear, startMonth, 1)
    const monthEnd = new Date(startYear, startMonth + 1, 0)

    return current < monthStart || current > monthEnd
  }
}
</script>
