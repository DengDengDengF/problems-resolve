<template>
  <el-table
      :data="tableData"
      @sort-change="handleSortChange"
      style="width: 100%;"
  >
    <el-table-column
        prop="id"
        label="ID"
        sortable
    ></el-table-column>
    <el-table-column
        prop="name"
        label="Name"
        sortable
    ></el-table-column>
    <el-table-column
        prop="create_time"
        label="Create Time"
        sortable
    ></el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const tableData = ref([]);  // 表格数据

// 排序变化处理函数
const handleSortChange = ({ column, prop, order }) => {
  const sortField = prop;  // 排序字段（id, name, create_time）
  const sortOrder = order === 'ascending' ? 'asc' : 'desc';  // 排序方式（asc 或 desc）

  // 调用接口获取排序后的数据
  fetchData(sortField, sortOrder);
};

// 调用接口的函数
const fetchData = async (sortField, sortOrder) => {
  console.log('sortBy = ' + sortField + "      order = " + sortOrder);
};

</script>
