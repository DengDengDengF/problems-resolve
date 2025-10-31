<template>
  <div>
    <div v-for="btn in buttons" :key="btn.name" style="margin: 8px">
      <button @click="handleClick(btn)">{{ btn.label }}</button>
    </div>
    <div style="margin-top: 16px;">当前路由: {{ routeIndex }}</div>

    <!-- 弹框示例 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <p>这是弹框!</p>
        <button @click="closeModal">关闭</button>
      </div>
    </div>
    <el-scrollbar style="width: 900px; height: 670px;" wrap-style="overflow: auto;">>
      <div style="width: 1200px;height: 200px;border: 1px solid red"/>
      <div style="width: 1200px;height: 200px;border: 1px solid orange"/>
      <div style="width: 1200px;height: 200px;border: 1px solid blue"/>
      <div style="width: 1200px;height: 200px;border: 1px solid green"/>
      <div style="width: 1200px;height: 200px;border: 1px solid purple"/>
      <div style="width: 1200px;height: 200px;border: 1px solid yellow"/>
      <div style="width: 1200px;height: 200px;border: 1px solid red"/>
      <div style="width: 1200px;height: 200px;border: 1px solid orange"/>
      <div style="width: 1200px;height: 200px;border: 1px solid blue"/>
      <div style="width: 1200px;height: 200px;border: 1px solid green"/>
      <div style="width: 1200px;height: 200px;border: 1px solid purple"/>
      <div style="width: 1200px;height: 200px;border: 1px solid yellow"/>
      <div style="width: 1200px;height: 200px;border: 1px solid red"/>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 按钮配置数组
const buttons = [
  { name: 'a', label: 'A', action: 'jump' },
  { name: 'b', label: 'B', action: 'modal' },
  { name: 'c', label: 'C', action: 'back' },
]

const routeIndex = ref(0)
const showModal = ref(false)

// 主点击处理函数
function handleClick(btn) {
  switch (btn.action) {
    case 'jump':
      routeIndex.value++
      history.pushState({ index: routeIndex.value }, '', '') // 正常前进
      break
    case 'modal':
      showModal.value = true
      routeIndex.value++
      history.pushState({ index: routeIndex.value }, '', '') // 弹框也算路由+1
      break
    case 'back':
      routeIndex.value--
      // 不留痕迹，用 replaceState 回退
      history.replaceState({ index: routeIndex.value }, '', '')
      break
  }
}

// 关闭弹框
function closeModal() {
  showModal.value = false
  // 可以选择不修改路由或路由-1
  routeIndex.value--
  history.replaceState({ index: routeIndex.value }, '', '')
}

// 监听浏览器前进/后退（可选，保持同步）
window.addEventListener('popstate', (e) => {
  if (e.state && typeof e.state.index === 'number') {
    routeIndex.value = e.state.index
  }
})
</script>

<style>
.modal {
  position: fixed;
  top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 16px;
  border-radius: 8px;
}
</style>
