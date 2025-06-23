<template>
  <div
      @paste="onPaste"
      tabindex="0"
      style="border: 2px dashed #409EFF; padding: 20px; min-height: 100px;"
  >
    📋 粘贴图片到此区域（截图后 Ctrl + V 粘贴）
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

// 粘贴事件处理
const onPaste = (e) => {
  const items = e.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        uploadImage(file)
        return
      }
    }
  }

  ElMessage.warning('未检测到图片')
}

// 模拟上传逻辑（你可以换成真实接口）
const uploadImage = (file) => {
  const formData = new FormData()
  formData.append('file', file)

  // 示例模拟上传（这里你用 axios 或 fetch 提交）
  console.log('准备上传图片：', file)

  // 模拟上传逻辑
  setTimeout(() => {
    ElMessage.success(`模拟上传成功：${file.name}`)
  }, 1000)
}
</script>
