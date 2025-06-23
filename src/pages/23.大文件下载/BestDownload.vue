<template>

</template>

<script setup>
import * as XLSX from 'xlsx';

const exportExcel = () => {
  const data = [
    {
      "user_id": 1,
      "script_id": 4910,
      "resource_id": 4924,
      "script_name": "dddddddss",
      "resource_name": "2月22日(5)",
      "max_totl_cost": "87.73",
      "user_name": "testceo"
    },
    {
      "user_id": 1,
      "script_id": 4923,
      "resource_id": 4924,
      "script_name": "fffffh",
      "resource_name": "2月22日(5)",
      "max_totl_cost": "87.73",
      "user_name": "testceo"
    },
    {
      "user_id": 1,
      "script_id": 4931,
      "resource_id": 4924,
      "script_name": "测试王长安脚sff4444",
      "resource_name": "2月22日(5)",
      "max_totl_cost": "87.73",
      "user_name": "testceo"
    }
  ];

  // 定义中文表头映射
  const headers = {
    "user_id": "用户ID",
    "script_id": "脚本ID",
    "resource_id": "资源ID",
    "script_name": "脚本名称",
    "resource_name": "资源名称",
    "max_totl_cost": "最大成本",
    "user_name": "用户名"
  };

  // 转换数据为带中文表头的格式
  const dataWithCNHeaders = data.map(item => {
    const newItem = {};
    Object.keys(item).forEach(key => {
      newItem[headers[key] || key] = item[key];
    });
    return newItem;
  });

  const worksheet = XLSX.utils.json_to_sheet(dataWithCNHeaders);
  worksheet['!cols'] = [
    { wch: 12 }, // 用户ID
    { wch: 15 }, // 脚本ID
    { wch: 15 }, // 资源ID
    { wch: 30 }, // 脚本名称（加宽）
    { wch: 20 }, // 资源名称
    { wch: 10 }, // 最大成本
    { wch: 12 }  // 用户名
  ]
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "用户数据");
  XLSX.writeFile(workbook, "用户数据报表.xlsx");
};
exportExcel()
</script>

<style scoped>

</style>