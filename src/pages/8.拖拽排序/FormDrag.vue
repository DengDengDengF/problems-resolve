<template>

  <div>
    <el-form :model="form" :rules="formRules" ref="formRef">
      <!-- 使用 draggable 包裹表单项实现拖动 -->
      <draggable v-model="formItems" @end="onDragEnd" handle=".drag-handle">
        <template #item="{ element, index }">
          <div :key="element.key">
            <el-form-item  :prop="element.key">
              <!-- 拖动句柄 -->
              <span class="drag-handle" style="cursor: grab;">&#x2630;</span>
              <el-input v-model="form[element.key]"   style="width: 240px;padding: 10px" placeholder="Please input"/>
              <el-button type="danger" @click="removeFormItem(index)">移除</el-button>
            </el-form-item>

          </div>
        </template>
      </draggable>

      <el-button type="primary" @click="addFormItem">添加字段</el-button>
      <el-button type="primary" @click="validateForm">提交</el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
//npm i -S vuedraggable@next
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import draggable from 'vuedraggable';

const form = ref<Record<string, string>>({});
const formRules = ref<Record<string, any>>({});
const formItems = ref<Array<{ key: string }>>([]);

// 递增的唯一 ID
let uniqueId = 1;

// 添加表单项
const addFormItem = () => {
  const key = `prop${uniqueId++}`; // 使用自增变量生成唯一的 key
  formItems.value.push({ key });
  form.value[key] = ''; // 初始化该字段的值
  formRules.value[key] = [{ required: true, message: `字段 ${key} 不能为空`, trigger: 'blur' }]; // 添加校验规则
};

// 移除表单项
const removeFormItem = (index: number) => {
  const key = formItems.value[index].key;
  formItems.value.splice(index, 1);
  delete form.value[key]; // 删除对应的值
  delete formRules.value[key]; // 删除对应的校验规则
};

// 拖动结束后触发的事件（可选）
const onDragEnd = () => {
  console.log('拖动结束，当前顺序：', formItems.value);
};
const formRef = ref<any>();
// 校验表单
const validateForm = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success('表单校验通过');
    } else {
      ElMessage.error('表单校验失败');
    }
  });
};
</script>

<style scoped>
.drag-handle {
  padding-left: 8px;
  font-size: 1.5em;
  cursor: grab;
}
</style>
