<template>
  <div>
    <!-- 全选/全消复选框 -->
    <div>
      <el-button type="primary" style="margin-right: 10px" @click="()=>{fuck=!fuck}">操作</el-button>
      <el-checkbox
          v-model="isAllChecked"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
      >
        全选/全消
      </el-checkbox>
      <el-button type="danger" :disabled="!fuck" style="margin-left: 10px" @click="()=>{ElMessage.success('可以删除')}"> 批量删除</el-button>
    </div>

    <div style="display: flex;">
      <div v-for="item in items"
           style="width:100px;height: 100px;border:1px solid black;text-align: center;line-height: 100px;">
        <div v-if="fuck">
          <!-- 列表项复选框 -->
          <el-checkbox
              :key="item.id"
              v-model="checkedItems[item.id]"
              @change="updateIndeterminate"
          >
            {{ item.name }}
          </el-checkbox>
        </div>
      </div>
    </div>
  </div>
  {{checkedItems}}
</template>

<script setup lang="ts">
//假如有多页数据，当前页批量删除后，调接口重新构建
import {ref} from 'vue';
import {ElMessage} from "element-plus";

const fuck = ref(false)
// 数据项，包含 id 和名称
const items = ref([
  {id: 1, name: '选项1'},
  {id: 2, name: '选项2'},
  {id: 3, name: '选项3'},
  {id: 4, name: '选项4'}
]);

// 控制全选的状态
const isAllChecked = ref(false);

// 存储选中的项目
const checkedItems = ref({}); // 使用对象来存储每个复选框的状态

// 三态复选框状态
const isIndeterminate = ref(false);

// 处理全选/全消的变化
const handleCheckAllChange = () => {
  fuck.value = true
  if (isAllChecked.value) {
    items.value.forEach(item => {
      checkedItems.value[item.id] = true; // 全选
    });
  } else {
    items.value.forEach(item => {
      checkedItems.value[item.id] = false; // 全消
    });
  }
  isIndeterminate.value = false; // 确保状态更新为全消
};

// 更新部分选中状态
const updateIndeterminate = () => {
  const checkedCount = Object.values(checkedItems.value).filter(Boolean).length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < items.value.length;
  isAllChecked.value = checkedCount === items.value.length; // 更新全选状态
};

</script>
