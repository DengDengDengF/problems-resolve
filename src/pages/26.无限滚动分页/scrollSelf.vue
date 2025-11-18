<template>
  <div class="page">
    <!-- 内容区 -->
    <div ref="contentWrapper" class="content-wrapper" style="border: 1px solid blue">
      <div ref="scrollContent" class="scroll-content" style="border: 1px solid red">
        <div class="item" v-for="i in 50" :key="i">Item {{ i }}</div>
      </div>
    </div>

    <!-- 固定在屏幕底部的横向滚动条 -->
    <div ref="fixedScrollbar" class="fixed-scrollbar" style="border: 1px solid red" @scroll="syncScroll">
      <div :style="{ width: contentWidth + 'px', height: '1px' }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const scrollContent = ref(null)
const fixedScrollbar = ref(null)
const contentWidth = ref(0)

// 底部滚动条 -> 内容同步
const syncScroll = () => {
  if (scrollContent.value && fixedScrollbar.value) {
    scrollContent.value.scrollLeft = fixedScrollbar.value.scrollLeft
  }
}

// 内容滚动 -> 底部同步
const syncFromContent = () => {
  if (scrollContent.value && fixedScrollbar.value) {
    fixedScrollbar.value.scrollLeft = scrollContent.value.scrollLeft
  }
}

// 更新宽度
const handleResize = () => {
  if (scrollContent.value) {
    contentWidth.value = scrollContent.value.scrollWidth
  }
}

onMounted(() => {
  nextTick(handleResize)
  scrollContent.value.addEventListener('scroll', syncFromContent)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  scrollContent.value.removeEventListener('scroll', syncFromContent)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.page {
  height: 100vh;
  overflow-y: auto;
  position: relative;
  background: #fafafa;
}

/* 内容区 */
.content-wrapper {
  padding-bottom: 24px; /* 给底部滚动条留空间 */
  overflow: hidden; /* 隐藏横向滚动条 */
}

.scroll-content {
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;

  /* 隐藏横向滚动条（不同浏览器兼容写法） */
  scrollbar-width: none; /* Firefox */
}
.scroll-content::-webkit-scrollbar {
  display: none; /* Chrome / Safari */
}

.item {
  flex-shrink: 0;
  width: 200px;
  height: 120px;
  margin: 10px;
  background: #e8e8e8;
  border: 1px solid #ccc;
  text-align: center;
  line-height: 120px;
  font-weight: 500;
}

/* 固定底部的横向滚动条 */
.fixed-scrollbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  background: #fff;
  border-top: 1px solid #ddd;
  z-index: 100;
}
</style>
