<template>
  <div class="page-wrapper">
    <!-- 页面滚动内容 -->
    <div style="height: 500px; border: 1px solid red; margin-bottom: 20px;"></div>

    <!-- 表格容器 -->
    <div ref="tableContainer" class="table-container" :class="{bar_bottom:showBar}">
      <el-table
          ref="table"
          :data="tableData"
          class="custom-table"
          style="width: 100%;"
          scrollbar-always-on
          :header-cell-style="{ background: '#fff' }"
      >
        <el-table-column fixed="left" prop="date" label="日期" width="180" />
        <el-table-column fixed="left" prop="date" label="日期" width="180" />
        <el-table-column fixed="left" prop="date" label="日期" width="180" />
        <el-table-column v-for="i in 12" :key="i" prop="name" label="姓名" width="180" />
        <el-table-column prop="address" label="地址" />
      </el-table>
    </div>
    <div style="height: 60px;width: 100%;border: 1px solid red">

    </div>
  </div>
</template>


<script setup>
import {ref, onMounted, nextTick} from 'vue'
const tableData = ref([
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  { date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄' },
  // ...你的其他数据...
])
const showBar=ref(true)
let ticking = false //防止同一帧内重复触发

const handleWindowScroll = () => {
  const scrollTop = window.scrollY || window.pageYOffset
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const distanceToBottom = documentHeight - (scrollTop + windowHeight)
  showBar.value=true
  if (distanceToBottom <= 60) {
    showBar.value=false
  }
}
const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(async() => {
      handleWindowScroll()
      await nextTick()
      ticking = false
    })
    ticking = true
  }
}
onMounted(()=>{
  window.addEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* 使表头在页面滚动时固定 */
:deep(.el-table__header-wrapper) {
  position: sticky;
  top: 0;
  z-index: 10;
}
/* 移除表格的固定高度限制 */
:deep(.el-table) {
  overflow: visible;
}
:deep(.el-table__body-wrapper) {
  overflow: visible;
}
.bar_bottom{
  :deep(.el-table__body-wrapper .el-scrollbar__bar){
    position: fixed;
    bottom: 4px;
  }
}
:deep(.el-scrollbar__thumb){
  background-color: black;
  opacity: 0.4;
  transition: none;
  &:hover{
    background-color: black;
    opacity: 0.6;
  }
}
:deep(.el-scrollbar__bar.is-horizontal){
  height: 8px;
}
</style>