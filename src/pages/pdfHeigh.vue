<template>
  <PDF src="/static/ldf-reset.pdf"   pdf-width="60%" :style="{ transform: `scale(${scale})` }"/>
  <!-- <PDF :src="BASE64" /> -->
  <!-- <PDF :src="Uint8Array" /> -->
</template>


<script setup>
import PDF from "pdf-vue3";
import {onUnmounted, ref} from 'vue';


const scale = ref(1);

// 监听键盘按下事件
document.addEventListener('keydown', handleKeyDown);

// 处理按键事件
function handleKeyDown(event) {
  document.removeEventListener('wheel', handleWheel);
  if (event.key === 'Control') {
    // 监听鼠标滚轮事件
    document.addEventListener('wheel', handleWheel);
    event.preventDefault(); // 防止浏览器默认行为
  }
}

// 处理鼠标滚轮事件
function handleWheel(event) {
  if (event.ctrlKey) {
    event.preventDefault(); // 防止浏览器默认行为
    // 调整缩放比例
    if (event.deltaY < 0) {
      scale.value += 0.1; // 放大
    } else {
      scale.value -= 0.1; // 缩小
    }

    // 确保缩放比例在合理范围内
    scale.value = Math.max(0.5, Math.min(scale.value, 2)); // 最小缩放为 0.5，最大缩放为 2

  } else {
    // 如果 Ctrl 键被释放，移除鼠标滚轮事件监听
    document.removeEventListener('wheel', handleWheel);
  }
}


onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('wheel', handleWheel);

})

</script>


<style scoped>

</style>
