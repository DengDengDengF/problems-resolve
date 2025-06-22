<template>
  <div>
    <el-form :inline="true" :model="form" :rules="formRules" ref="formRef">
      <div v-for="(key, index) in Object.keys(form)" :key="key">
        <template v-for="(item, i) in form[key]" :key="i">
          <el-form-item :prop="`${key}[${i}]`" :label="`${key} ${i}`">
            <el-input v-model="form[key][i]" :placeholder="`Input ${i}`" />
          </el-form-item>
        </template>
      </div>
    </el-form>
    <el-button type="primary" @click="validateForm">提交</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const formRef = ref<any>();
const form = ref({
  arr: ['', '', ''],
  arr1: ['', '', ''],
  arr2: ['', '', ''],
  arr3: ['', '', ''],
});
const formRules = ref({});

// 动态生成校验规则
const createValidationRules = (prefix: string) => ({
  validator: (rule, value) => {
    if (value.trim() === '') {
      return Promise.reject(new Error(`${prefix} Input  不能为空`));
    }
    return Promise.resolve();
  },
  trigger: 'blur',
});

// 动态生成rules的key value
Object.keys(form.value).forEach((key) => {
  for (let i = 0; i < form.value[key].length; i++) {
    const ruleKey = `${key}[${i}]`;
    formRules.value[ruleKey] = createValidationRules(key);
  }
});

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
/* 这里可以添加自定义样式 */
</style>
