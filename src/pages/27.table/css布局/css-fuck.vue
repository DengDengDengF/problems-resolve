<template>
  <div style="width: 100%; height: 400px; border: 1px solid olivedrab; overflow-x: auto; overflow-y: hidden;">
    <div style="
    display: flex;
    min-width: max-content;
    height: 100%;
    box-sizing: border-box;
  ">
      <!-- 固定宽度项 -->
      <div style="width: 300px; height: 100%; border: 1px solid red;"></div>
      <div style="width: 300px; height: 100%; border: 1px solid blue;"></div>

      <!-- 自适应项：有 min-width 和 flex，撑不下就滚动 -->
      <div style="min-width: 200px; flex: 1; border: 1px solid orangered;"></div>
      <div style="min-width: 200px; flex: 1; border: 1px solid saddlebrown;"></div>
      <div style="min-width: 200px; flex: 1; border: 1px solid green;background: red"></div>
    </div>
  </div>

</template>

<script setup lang="ts">

</script>

<style scoped>

</style>