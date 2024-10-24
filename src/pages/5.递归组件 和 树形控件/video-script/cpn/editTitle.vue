<template>
  <el-dialog
    :before-close="handleCancel"
    v-model="props.dialogFormVisible"
    :show-close="false"
    width="650"
    style="padding: 0; border-radius: 10px"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="card-header">
        <span>编辑字段</span>
        <el-icon class="close" @click="handleCancel">
          <Close />
        </el-icon>
      </div>
    </template>
    <el-form :model="form" ref="formRef" :rules="rules" style="margin-top: 20px">
      <el-form-item label="模板标题" :label-width="formLabelWidth" prop="coreName">
        <el-input
          v-model="form.coreName"
          placeholder="请输入标题名称"
          autocomplete="off"
          style="width: 300px"
          size="large"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer" style="">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submit(formRef)"> 确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, defineEmits, defineProps } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

import { Delete, Plus } from '@element-plus/icons-vue'

const emit = defineEmits(['update:dialogFormVisible', 'edit'])

const props = defineProps({
  dialogFormVisible: Boolean,
  rowDetail: Object
})

const formRef = ref<FormInstance>()
const formLabelWidth = '200px'

const form = ref<Record<string, string>>({
  coreName: props.rowDetail.coreName
})

const formItems = ref<Array<{ key: string }>>([])
const rules = ref<Record<string, any>>({
  coreName: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
})

//取消
const handleCancel = () => {
  emit('update:dialogFormVisible', false) // 触发父组件更新 addFormVisible 为 false
}
//提交
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit('edit', form.value)
      emit('update:dialogFormVisible', false) // 提交后关闭对话框
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
<style scoped lang="scss">
//form 表单label加粗
::v-deep .el-form-item__label {
  font-weight: bold;
}

.card-header::before {
  content: '|';
  margin-right: 6px;
  font-weight: bold;
  font-size: 22px;
  color: #409eff;
}

.card-header {
  //border: 1px solid red;
  height: 60px;
  display: flex;
  border-radius: 10px;
  align-items: center;
  padding-left: 20px;
  position: relative;
  background: rgb(249, 248, 250);

  .close {
    position: absolute;
    right: 0;
    padding-right: 10px;
    cursor: pointer;
    color: gray;
    font-size: 18px;

    &:hover {
      color: #409eff;
    }
  }

  span {
    color: black;
    font-size: 18px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.06);
}
</style>
