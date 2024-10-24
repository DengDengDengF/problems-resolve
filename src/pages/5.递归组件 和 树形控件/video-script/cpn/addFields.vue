<template>
  <el-dialog
    :before-close="handleCancel"
    v-model="props.addFormVisible"
    :show-close="false"
    width="650"
    style="padding: 0; border-radius: 10px"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="card-header">
        <span>新增字段</span>
        <el-icon class="close" @click="handleCancel">
          <Close />
        </el-icon>
      </div>
    </template>
    <el-form :model="form" ref="formRef" :rules="rules" style="margin-top: 20px">
      <el-form-item label="模板标题" :label-width="formLabelWidth" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入标题名称"
          autocomplete="off"
          style="width: 300px"
          size="large"
        />
      </el-form-item>
      <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
        <el-select
          size="large"
          v-model="form.type"
          placeholder="请选择字段类型"
          style="width: 300px"
        >
          <el-option label="单选" :value="0" />
          <el-option label="多选" :value="1" />
          <el-option label="文本" :value="2" />
          <el-option label="图片" :value="3" />
          <el-option label="附件" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.type == 0 || form.type == 1"
        v-for="(item, index) in formItems"
        :key="item.key"
        :label-width="formLabelWidth"
        :prop="item.key"
      >
        <el-input
          v-model="form[item.key]"
          autocomplete="off"
          style="width: 25%; min-width: 300px"
          size="large"
          placeholder="请输入选项名称"
        />
        <el-link
          :icon="Delete"
          v-if="formItems.length !== 1"
          style="margin-left: 10px"
          :underline="false"
          @click="removeOption(index)"
        ></el-link>
      </el-form-item>
      <div
        :style="{ marginLeft: formLabelWidth, paddingBottom: '20px' }"
        v-if="form.type == 0 || form.type == 1"
      >
        <el-link :icon="Plus" style="color: #409eff; font-size: 0.7em" :underline="false">
          <span style="padding-left: 4px; font-size: 12px" @click="addOption"
            >点击添加</span
          ></el-link
        >
      </div>
      <el-form-item
        v-if="form.type != 3 && form.type !== 4"
        label="提示语"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.tips"
          placeholder="在填写脚本的时候展示，引导填写"
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
const emit = defineEmits(['add', 'update:addFormVisible'])
const props = defineProps({
  addFormVisible: Boolean
})

const formRef = ref<FormInstance>()
const formLabelWidth = '200px'

const form = ref<Record<string, string>>({
  title: '',
  type: 2,
  tips: ''
})
const formItems = ref<Array<{ key: string }>>([])
const rules = ref<Record<string, any>>({
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '字段类型不能为空', trigger: 'blur' }]
})

//递增的唯一id
let uniqueId = 1
//添加选项
const addOption = () => {
  const key = `prop${uniqueId++}` // 使用自增变量生成唯一的 key
  formItems.value.push({ key })
  form.value[key] = '' // 初始化该字段的值
  rules.value[key] = [{ required: true, message: `字段不能为空`, trigger: 'blur' }] // 添加校验规则
}
addOption()
//删除选项
const removeOption = (index) => {
  const key = formItems.value[index].key
  formItems.value.splice(index, 1)
  delete form.value[key] // 删除对应的值
  delete rules.value[key] // 删除对应的校验规则
}

//取消
const handleCancel = () => {
  emit('update:addFormVisible', false) // 触发父组件更新 addFormVisible 为 false
}
//提交
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const forms = {
        title: form.value.title,
        type: form.value.type,
        tips: form.value.tips,
        options: []
      }
      if (form.value.type == 3 || form.value.type == 4) {
        forms.tips = ''
      }
      if (form.value.type == 0 || form.value.type == 1) {
        for (let key in form.value) {
          if (key == 'title' || key == 'type' || key == 'tips') continue
          forms.options.push(form.value[key])
        }
      }
      emit('add', forms)
      emit('update:addFormVisible', false)
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
