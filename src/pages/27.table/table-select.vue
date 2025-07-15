<template>
  <div>
    <div style="margin-bottom: 12px;">
      <el-button @click="selectAll">全选</el-button>
      <el-button @click="clearAll">全不选</el-button>
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="选择" width="80">
        <template #header>
          <el-checkbox
              :model-value="isAllSelected"
              :indeterminate="isIndeterminate"
              @change="toggleSelectAll"
          />
        </template>
        <template #default="{ row }">
          <el-checkbox
              :model-value="isSelected(row.id)"
              @change="() => toggleRow(row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const tableData = ref([])
for(let i=0;i < 400;i++){
  tableData.value.push({ id: ++i, name: '张三', age: 20 },)
}

const selectedIds = ref(new Set())

// 判断某一行是否已选中
const isSelected = (id) => {
  return selectedIds.value.has(id)
}

// 切换某一行选中状态
const toggleRow = (id) => {
  const newSet = new Set(selectedIds.value)
  if (newSet.has(id)) {
    newSet.delete(id)
  } else {
    newSet.add(id)
  }
  selectedIds.value = newSet // 强制触发响应式
}

// 表头 checkbox：是否全选
const isAllSelected = computed(() => {
  return selectedIds.value.size === tableData.value.length && tableData.value.length > 0
})

// 表头 checkbox：是否半选
const isIndeterminate = computed(() => {
  return (
      selectedIds.value.size > 0 &&
      selectedIds.value.size < tableData.value.length
  )
})

// 点击表头 checkbox 触发全选/清空
const toggleSelectAll = (checked) => {
  if (checked) {
    selectedIds.value = new Set(tableData.value.map(row => row.id))
  } else {
    selectedIds.value.clear()
  }
}

// 手动按钮：全选
const selectAll = () => {
  selectedIds.value = new Set(tableData.value.map(row => row.id))
}

// 手动按钮：全不选
const clearAll = () => {
  selectedIds.value.clear()
}
</script>
