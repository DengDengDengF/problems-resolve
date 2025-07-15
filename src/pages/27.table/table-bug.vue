<template>
  <div>
    <el-button @click="toggleSelection">全选 / 取消全选</el-button>

    <el-table
        ref="tableRef"
        :data="tableData"
        border
        style="width: 100%; margin-top: 20px"
        @selection-change="handleSelectionChange"
        @select="handleSelect"
        @select-all="handleSelectAll"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="姓名">
        <template #default="{row}">
           <span>{{row.name}} {{console.log('dfadfa')}}</span>
        </template>
      </el-table-column>>
      <el-table-column prop="age" label="年龄" />
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()
const selectedRows = ref([])

const tableData = ref([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
  { id: 3, name: '王五', age: 22 },
  { id: 4, name: '赵六', age: 28 }
])

// 原生事件：选中项变化
function handleSelectionChange(val) {
  selectedRows.value = val
  console.log('当前选中：', val)
}

// 原生事件：单个选中
function handleSelect(selection, row) {
  console.log('单行选中变化：', selection, row)
}

// 原生事件：全选/全不选
function handleSelectAll(selection) {
  console.log('全选变化：', selection)
}

// 切换全选/取消
function toggleSelection() {
  const table = tableRef.value
  if (selectedRows.value.length < tableData.value.length) {
    // 全选
    tableData.value.forEach(row => {
      table.toggleRowSelection(row, true)
    })
  } else {
    // 取消全选
    table.clearSelection()
  }
}
</script>

<style scoped>
.el-button {
  margin-bottom: 10px;
}
</style>
