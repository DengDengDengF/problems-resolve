<template>
  <div>
    <div style="border: 1px solid red;width: 100%;height: 200px"></div>
    <div class="container">
      <el-table
          :data="tableData"
          border
          stripe
          :row-style="{height: '100px'}"
          style="width: 100%"
          show-summary
      >
        <el-table-column prop="date" label="日期" min-width="180"  fixed="left"/>
        <el-table-column prop="name" label="姓名" min-width="180" />
        <el-table-column prop="address" label="地址" min-width="900" />
        <el-table-column prop="desc" label="备注" min-width="900" />
        <el-table-column prop="other" label="其他" min-width="900" />
      </el-table>
    </div>
  </div>

</template>

<script setup>
//TODO 在实际项目中，遇到了 外层容器 嵌套el-table 在某些比例下 滚动不流畅的问题
import { ref } from 'vue'

const tableData = ref(
    Array.from({ length: 40 }).map((_, i) => ({
      date: `2025-07-${(i + 1).toString().padStart(2, '0')}`,
      name: `张三 ${i}`,
      address: `某街道 ${i} 号`,
      desc: `这是备注信息 ${i}`,
      other: `额外信息 ${i}`,
    }))
)
</script>

<style scoped>
</style>