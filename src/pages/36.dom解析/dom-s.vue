<template>
  <div>
    <button @click="insertVideoLog">插入视频批注</button>
    <button @click="getHtml">html</button>
    <button @click="toEnd">到末尾</button>
    <Editor
        v-model="html"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
        style="border:1px solid #ccc; min-height:200px; padding:8px"
    />
  </div>
</template>

<script setup>
import {ref, onBeforeUnmount, nextTick} from 'vue'
import {Editor} from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import dayjs from 'dayjs'


// ----------------------
// 注册 Module
// ----------------------
// Boot.registerModule(videoLogModule)

// ----------------------
// 数据 & 配置
// ----------------------
const editorRef = ref(null)
const html = ref(' ') // 初始化段落

const userName = ref('张三')
const currentVideoPlayTime = ref('12:30')

const editorConfig = {
  // 全局注册后，不需要写 renderElems / elemsToHtml / parseElems
}

// ----------------------
// 创建 editor
// ----------------------
const handleCreated = (editor) => {
  editorRef.value = editor
  // ✅ 不需要再调用 videoLogModule.editorPlugin
  // 调试：检查编辑器是否识别了你的插件
  const isRegistered = editor.getMenuConfig('video-log') || editor.isVoid({type: 'video-log'})
  console.log('节点是否被识别为 Void:', editor.isVoid({type: 'video-log'}))
}
const toEnd = async () => {
  const editor = editorRef.value
  if (!editor) return

  // 1. 找到最后一个顶级节点（通常是最后一个 <p>）
  const lastIndex = editor.children.length - 1
  const lastNode = editor.children[lastIndex]

  // 2. 找到该节点下最后一个子节点（文本节点）的长度
  // 如果最后一行是空的，length 就是 0
  const lastChildIndex = lastNode.children.length - 1
  const lastTextNode = lastNode.children[lastChildIndex]
  const offset = lastTextNode.text ? lastTextNode.text.length : 0

  // 3. 强制选中这个位置
  editor.select({
    anchor: {path: [lastIndex, lastChildIndex], offset: offset},
    focus: {path: [lastIndex, lastChildIndex], offset: offset}
  })
  await nextTick()
  editor.focus()
}
const toLast=async()=>{
  const editor = editorRef.value
  if (!editor) return

  // 1. 强制在 Void 节点后面补一个空格或零宽字符
  // 这是为了给光标创造一个“物理位置”，否则 Void 节点后面无法落位
  editor.insertText(' ')

  // 2. 将光标向后移动 1 个步长
  // 在 Inline + Void 模式下，move(1) 会跨过刚才插入的块，停在空格处
  editor.move(1)

  // 3. 确保聚焦
  await nextTick()
  editor.focus()
}
// ----------------------
// 插入 video-log 节点
// ----------------------
const insertVideoLog = async () => {
  const editor = editorRef.value
  if (!editor) return
  await toEnd()
  //如果啥也没填写，就不要换行
  if(html.value !== '<p> </p>' && html.value !== '<p><br></p>')editor.insertBreak()
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  editor.insertNode({
    type: 'video-log',
    children: [{text: ''}],
    data: {time: currentTime, user: userName.value, videoTime: currentVideoPlayTime.value}
  })
  await toLast()
}
const getHtml = () => {
  console.log(editorRef.value.getHtml())
}

// ----------------------
// 卸载销毁
// ----------------------
onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy()
    editorRef.value = null
  }
})
</script>