<template>
  <div>
    <el-form :model="form" :rules="formRules" ref="formRef">
      <draggable v-model="formItems" @end="onDragEnd" handle=".drag-handle" animation="300" item-key="key">
        <template #item="{ element, index }">
          <div :key="element.key">
            <el-form-item :prop="element.key">
              <span class="drag-handle" style="cursor: grab;">&#x2630;</span>
              <el-input v-model="form[element.key]" style="width: 240px;padding: 10px" placeholder="Please input" />
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
  const key = `prop${uniqueId++}`;
  formItems.value.push({ key });
  form.value[key] = '';
  formRules.value[key] = [{ required: true, message: `字段 ${key} 不能为空`, trigger: 'blur' }];
};

// 移除表单项
const removeFormItem = (index: number) => {
  const key = formItems.value[index].key;
  formItems.value.splice(index, 1);
  delete form.value[key];
  delete formRules.value[key];
  updateFormRules(); // 更新校验规则
};

// 拖动结束后触发的事件
const onDragEnd = () => {
  // console.log('拖动结束，当前顺序：', formItems.value);
  updateFormRules(); // 更新校验规则
};

// 更新校验规则
const updateFormRules = () => {
  const newRules: Record<string, any> = {};
  formItems.value.forEach(item => {
    newRules[item.key] = [{ required: true, message: `字段 ${item.key} 不能为空`, trigger: 'blur' }];
  });
  formRules.value = newRules;
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
