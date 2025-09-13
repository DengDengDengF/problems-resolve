<template>
  <el-button type="primary" @click="drawer = true">打开抽屉</el-button>

  <el-drawer v-model="drawer" title="虚拟列表示例" size="30%" @close="drawer=false">
      <div class="scroll-wrapper" ref="scrollWrapper">
        <div  style="width: 100%;height: 200px;background: red"></div>
        <div  style="width: 100%;height: 200px;background: blue"></div>
        <div  style="width: 100%;height: 200px;background: green"></div>
        <VirtualizedListUseBody v-if="scrollWrapper" :containerTarget="scrollWrapper" />
      </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VirtualizedListUseBody from "./VirtualizedListUseBody.vue";

const drawer = ref(false);
const scrollWrapper = ref<HTMLDivElement | null>(null);
</script>

<style scoped>
.scroll-wrapper {
  position: relative;
  overflow: auto; /* ✅ 必须有滚动条 */
  height: calc(100% - 300px);   /* ✅ 填满 drawer，才能滚动 */
  will-change: scroll-position;
}
</style>
