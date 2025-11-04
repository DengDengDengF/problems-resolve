<template>
  <div class="upload-container">
    <h3>多区域上传示例 - 每个区域独立粘贴</h3>
    <div
        v-for="(uploader, index) in uploaders"
        :key="index"
        class="upload-wrapper"
        @paste="(e) => onPaste(e, index)"
        @keydown="(e) => onKeyDown(e, index)"
        tabindex="0"
        :style="`border: 2px solid ${uploader.borderColor}; padding: 20px; width: 400px; position: relative; outline: none; margin-bottom: 20px;`"
    >
      <div class="upload-header">
        <h4>{{ uploader.title }}</h4>
      </div>
      
      <el-upload
          :action="uploader.action"
          :auto-upload="true"
          v-model:file-list="uploader.fileList"
          :before-upload="(file) => beforeUpload(file, index)"
          drag
          :class="`upload-area upload-area-${index}`"
      >
        <div class="upload-content">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
            <br>
            <small>也支持 Ctrl+V 或右键粘贴文件</small>
          </div>
        </div>
      </el-upload>
      
      <!-- 隐藏的 contenteditable 层，确保右键菜单显示粘贴选项 -->
      <div 
        class="paste-layer" 
        contenteditable="true" 
        @click="(e) => handlePasteLayerClick(e, index)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { ElMessage } from 'element-plus'

// 定义2个上传器配置
const uploaders = ref([
  {
    title: '图片上传区域',
    action: '/api/upload/images',
    borderColor: '#409eff',
    fileList: []
  },
  {
    title: '文档上传区域',
    action: '/api/upload/documents', 
    borderColor: '#67c23a',
    fileList: []
  }
])

// before-upload 钩子函数 - 支持不同区域的验证
const beforeUpload = (file: File, uploaderIndex: number) => {
  console.log(`👉 区域${uploaderIndex + 1} before-upload 触发:`, file)
  
  const uploader = uploaders.value[uploaderIndex]
  console.log(`📁 上传到: ${uploader.title}`)
  
  // 可以根据不同区域设置不同的验证规则
  if (uploaderIndex === 0) {
    // 图片区域验证
    if (!file.type.startsWith('image/')) {
      ElMessage.error('图片区域只能上传图片文件')
      return false
    }
  } else if (uploaderIndex === 1) {
    // 文档区域验证
    const docTypes = ['application/pdf', 'text/plain', 'application/msword']
    if (!docTypes.some(type => file.type.includes(type))) {
      ElMessage.error('文档区域只能上传PDF、Word或文本文件')
      return false
    }
  }
  
  return true
}

// 处理粘贴层点击事件 - 转发给对应的 el-upload
const handlePasteLayerClick = (e: MouseEvent, uploaderIndex: number) => {
  e.stopPropagation()
  // 通过事件目标就近查找对应的 el-upload 元素
  const wrapper = (e.target as HTMLElement).closest('.upload-wrapper')
  const uploadElement = wrapper?.querySelector('.el-upload')
  if (uploadElement) {
    (uploadElement as HTMLElement).click()
  }
  console.log(`🖱️ 点击区域${uploaderIndex + 1}`)
}

// 手动触发指定区域的文件上传 - 优化版本，支持文件追加
const triggerFileUpload = (file: File, uploaderIndex: number) => {
  // 方案2: 如果需要通过 DOM 操作（备用方案）
  const uploadInput = document.querySelector(`.upload-area-${uploaderIndex} input[type="file"]`) as HTMLInputElement
  if (uploadInput) {
    const dataTransfer = new DataTransfer()

    // 先添加现有的文件
    if (uploadInput.files) {
      for (let i = 0; i < uploadInput.files.length; i++) {
        dataTransfer.items.add(uploadInput.files[i])
      }
    }

    // 再添加新文件
    dataTransfer.items.add(file)
    uploadInput.files = dataTransfer.files
    uploadInput.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

// 方式1: 键盘事件 + Clipboard API (现代浏览器)
const onKeyDown = async (event: KeyboardEvent, uploaderIndex: number) => {
  if (event.ctrlKey && event.key.toLowerCase() === 'v') {
    console.log(`⌨️ 方式1: 键盘事件检测到 Ctrl+V`)
    event.preventDefault()
    
    try {
      // 使用现代 Clipboard API
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read()
        
        for (const item of clipboardItems) {
          for (const type of item.types) {
            if (type.startsWith('image/') || type.startsWith('application/')) {
              const blob = await item.getType(type)
              const file = new File([blob], `clipboard-${Date.now()}.${type.split('/')[1]}`, { type })
              console.log(`📁 Clipboard API 获取文件:`, file)
              triggerFileUpload(file, uploaderIndex)
              return
            }
          }
        }
        ElMessage.warning('剪贴板中没有支持的文件')
      } else {
        // 方式2: 降级到传统方法
        await handleCtrlVFallback(uploaderIndex)
      }
    } catch (error) {
      console.error('Clipboard API 失败:', error)
      ElMessage.warning('无法访问剪贴板，请尝试右键粘贴')
    }
  }
}

// 方式2: 降级方案 - 创建隐藏的 textarea 来捕获粘贴
const handleCtrlVFallback = (uploaderIndex: number): Promise<void> => {
  return new Promise((resolve) => {
    console.log(`⌨️ 方式2: 使用降级方案处理 Ctrl+V`)
    
    // 创建隐藏的 textarea
    const textarea = document.createElement('textarea')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    
    // 聚焦到 textarea
    textarea.focus()
    
    // 监听粘贴事件
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault()
      console.log(`📋 降级方案捕获到粘贴事件`)
      
      const items = e.clipboardData?.items
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          if (item.kind === 'file') {
            const file = item.getAsFile()
            if (file) {
              console.log(`📁 降级方案获取文件:`, file)
              triggerFileUpload(file, uploaderIndex)
            }
          }
        }
      }
      
      // 清理
      textarea.removeEventListener('paste', handlePaste)
      document.body.removeChild(textarea)
      resolve()
    }
    
    textarea.addEventListener('paste', handlePaste)
    
    // 触发粘贴操作
    setTimeout(() => {
      document.execCommand('paste')
    }, 10)
  })
}

// 方式3: 全局监听 (可选)
const setupGlobalCtrlV = () => {
  document.addEventListener('keydown', async (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'v') {
      // 检查当前聚焦的元素是否是上传区域
      const activeElement = document.activeElement
      const uploadWrapper = activeElement?.closest('.upload-wrapper')
      
      if (uploadWrapper) {
        const index = Array.from(document.querySelectorAll('.upload-wrapper')).indexOf(uploadWrapper)
        if (index >= 0) {
          console.log(`⌨️ 方式3: 全局监听检测到 Ctrl+V，区域 ${index + 1}`)
          event.preventDefault()
          
          try {
            if (navigator.clipboard?.read) {
              const items = await navigator.clipboard.read()
              // 处理文件...
              for (const item of items) {
                for (const type of item.types) {
                  if (type.startsWith('image/') || type.startsWith('application/')) {
                    const blob = await item.getType(type)
                    const file = new File([blob], `global-clipboard-${Date.now()}.${type.split('/')[1]}`, { type })
                    triggerFileUpload(file, index)
                    return
                  }
                }
              }
            }
          } catch (error) {
            console.error('全局 Ctrl+V 处理失败:', error)
          }
        }
      }
    }
  })
}

// 方式4: 使用 Vue 生命周期管理全局监听
let globalKeydownHandler: ((event: KeyboardEvent) => void) | null = null

onMounted(() => {
  // 可以选择启用全局监听
  // globalKeydownHandler = setupGlobalCtrlV()
  console.log('🎯 上传组件已挂载，支持多种 Ctrl+V 方式')
})

onUnmounted(() => {
  // 清理全局监听器
  if (globalKeydownHandler) {
    document.removeEventListener('keydown', globalKeydownHandler)
  }
})

// 粘贴事件处理 - 支持指定区域
const onPaste = (event: ClipboardEvent, uploaderIndex: number) => {
  console.log(`📋 在区域${uploaderIndex + 1}检测到粘贴事件`)
  
  // 阻止默认粘贴行为
  event.preventDefault()
  event.stopPropagation()
  
  const items = event.clipboardData?.items
  if (!items) {
    console.log("❌ 剪贴板中没有内容")
    return
  }
  
  let hasFile = false
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.kind === "file") {
      const file = item.getAsFile()
      if (file) {
        hasFile = true
        console.log(`📋 在区域${uploaderIndex + 1}检测到粘贴文件:`, file.name, file.type, file.size)
        // 使用就近获取的方式触发对应区域的上传
        triggerFileUpload(file, uploaderIndex)
      }
    }
  }
  
  if (!hasFile) {
    ElMessage.warning('剪贴板中没有文件')
  }
}
</script>

<style scoped>
.upload-container {
  padding: 20px;
}

.upload-container h3 {
  color: #303133;
  margin-bottom: 30px;
  text-align: center;
  font-size: 18px;
}

.upload-wrapper {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.upload-wrapper:focus-within {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  transform: translateY(-2px);
}

.upload-header {
  margin-bottom: 15px;
}

.upload-header h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.upload-area {
  width: 100%;
}

.upload-content {
  padding: 40px 20px;
  text-align: center;
}

.upload-content i {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 16px;
  display: block;
}

.el-upload__text {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.el-upload__text em {
  color: #409eff;
  font-style: normal;
}

.el-upload__text small {
  color: #909399;
  font-size: 12px;
}

.paste-layer {
  position: absolute;
  inset: 20px; /* 与 padding 保持一致 */
  opacity: 0; /* 完全透明 */
  z-index: 1; /* 在最上层接收右键事件 */
  cursor: pointer;
  border-radius: 4px;
}

/* 拖拽状态样式优化 */
.upload-wrapper:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.upload-wrapper:focus {
  outline: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .upload-wrapper {
    width: 100% !important;
    margin-bottom: 15px;
  }
  
  .upload-content {
    padding: 30px 15px;
  }
}
</style>
