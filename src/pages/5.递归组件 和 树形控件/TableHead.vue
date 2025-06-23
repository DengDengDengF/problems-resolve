<template>
  <el-table
      :data="tableData"
      @filter-change="filterChange"
      @header-click="handleHeaderClick"
  >
    <el-table-column
        column-key="role"
        prop="users_role.title"
        label="角色"
        :filters="roleFilters"
        filter-placement="bottom"
        :filter-multiple="false"
        filter-class-name="role-filter-panel"
    />
    <el-table-column
        column-key="name"
        prop="name"
        label="姓名"
        :filters="nameFilters"
        filter-placement="bottom"
        :filter-multiple="false"
        filter-class-name="name-filter-panel"
    />
  </el-table>
  {{role}}
  {{name}}
</template>

<script setup>
import {nextTick, watch, ref, onMounted} from 'vue';
const role=ref("")
const name=ref("")

const tableData = [
  { users_role: { title: '新手' }, name: 'Alice' },
  { users_role: { title: '学徒' }, name: 'Bob' },
  { users_role: { title: '战士' }, name: 'Charlie' }
];

const roleFilters = ref([
  { text: '新手', value: 5 },
  { text: '学徒', value: 15 },
  { text: '战士', value: 35 },
  { text: '大师', value: 40 },
  { text: '宗师', value: 50 }
]);

const nameFilters = [
  { text: 'Alice', value: 'Alice' },
  { text: 'Bob', value: 'Bob' },
  { text: 'Charlie', value: 'Charlie' }
];

// 点击表头时触发过滤器面板
const handleHeaderClick = (column) => {
  nextTick(() => {
    // 获取所有列的头部
    const ths = document.querySelectorAll('.el-table__header-wrapper th');
    ths.forEach(th => {
      // 判断是"角色"列
      if (column.property === 'users_role.title' && th.innerText.includes('角色')) {
        const filterButton = th.querySelector('.el-table__column-filter-trigger');
        console.log(filterButton)
        toggleFilterPanel(filterButton, 'role-filter-panel');
        return; // 只处理当前点击的列，其他列忽略
      }
      // 判断是"姓名"列
      if (column.property === 'name' && th.innerText.includes('姓名')) {
        const filterButton = th.querySelector('.el-table__column-filter-trigger');
        toggleFilterPanel(filterButton, 'name-filter-panel');
        return; // 只处理当前点击的列，其他列忽略
      }
    });
  });
};

// 切换过滤器面板的显示状态
const toggleFilterPanel = (filterButton, filterClassName) => {
  // 根据filterClassName查找对应的filter面板
  const popper = document.querySelector(`.el-popper.${filterClassName}`);
  console.log(document.querySelector('.el-popper.role-filter-panel'))
  const isVisible = popper && window.getComputedStyle(popper).display !== 'none';

  // 如果当前过滤器面板是打开的并且是当前列，返回不做任何操作
  if (isVisible) {
    return;
  }

  // 如果过滤器面板未打开，模拟点击
  if (filterButton && typeof filterButton.click === 'function') {
    filterButton.click();
  }
};

const filterChange=(column)=>{
     if(column.hasOwnProperty("name")){
          name.value=column.name[0]
          // resetRoleFilter();
     }else if(column.hasOwnProperty("role")){
          role.value=column.role[0]
     }
}
//往下面想，如果只允许选中一个呢？那就好玩了
// const resetRoleFilter = () => {
//   nextTick(() => {
//     // 获取 role-filter-panel 的 DOM
//     const roleFilterPanel = document.querySelector('.el-popper.role-filter-panel');
//     if (roleFilterPanel) {
//       // 查找所有的 li 元素
//       const filterItems = roleFilterPanel.querySelectorAll('.el-table-filter__list-item');
//
//       // 移除所有 li 元素的 "is-active" 类
//       filterItems.forEach(item => {
//         item.classList.remove('is-active');
//       });
//
//       // 查找 "All" 选项并给它添加 "is-active" 类
//       const allOption = roleFilterPanel.querySelector('.el-table-filter__list-item');
//       if (allOption) {
//         allOption.classList.add('is-active');
//       }
//     }
//   });
// };
onMounted(() => {
  // nextTick(() => {
  //   // 延时等待面板渲染完成
  //   setTimeout(() => {
  //     const filterPanel = document.querySelector('.el-popper.role-filter-panel .el-table-filter__list');
  //     if (filterPanel) {
  //       filterPanel.style.maxHeight = '200px'; // 设置自定义高度
  //       filterPanel.style.overflowY = 'auto';   // 添加垂直滚动条
  //     } else {
  //       console.warn('Filter panel not found');
  //     }
  //   }, 100); // 调整时间以确保元素加载
  // });
});
</script>
<style scoped>

</style>
