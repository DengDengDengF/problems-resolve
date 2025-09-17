<template>
  <el-button type="primary" @click="show = true;console.log('32141')">打开弹窗</el-button>

  <el-dialog
      v-model="show"
      class="edge-dialog"
      :close-on-click-modal="true"
      :append-to-body="true"
  >
    <div style="min-width: 1000px;height: 1200px;border: 1px solid red">

    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref} from 'vue'

const show = ref(false)
</script>

<style>
/* 弹窗固定在屏幕四周，距离 40px */
.edge-dialog {
  position: fixed !important;
  top: 40px !important;
  left: 40px !important;
  right: 40px !important;
  bottom: 40px !important;
  width: calc(100vw - 80px) !important;
  height: calc(100vh - 80px) !important;
  margin-left: 0 !important;
  margin-top: 0 !important;
  display: flex !important;
  flex-direction: column !important;
}

/* 弹窗头部 */
.edge-dialog .el-dialog__header {
  padding: 20px;
  margin: 0;
  flex-shrink: 0;
  border-bottom: 1px solid #ebeef5;
}

/* 弹窗主体内容区域 */
.edge-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;
  min-height: 0; /* 重要：允许flex子项收缩 */
}

/* 弹窗底部 */
.edge-dialog .el-dialog__footer {
  padding: 20px;
  margin: 0;
  flex-shrink: 0;
  border-top: 1px solid #ebeef5;
}

/* 确保内容不会超出 */
.edge-dialog .el-dialog__body > * {
  max-width: 100%;
  box-sizing: border-box;
}
</style>
