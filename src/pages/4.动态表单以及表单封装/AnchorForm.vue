<template>
  <div>
    <el-row>
      <el-col :span="2">
        <el-anchor
            class="anchor"
            :container="containerRef"
            direction="vertical"
            type="default"
            :offset="30"
        >
          <div>
            <span>aaaaaa</span>
            <el-anchor-link style="margin-left: 30px;font-size: 16px" href="#part1" title="part1" />
          </div>
          <div>
            <span>bbbbbb</span>
            <el-anchor-link style="margin-left: 30px" href="#part2" title="part2" />
          </div>
          <div>
            <span>cccccc</span>
            <el-anchor-link style="margin-left: 30px" href="#part3" title="part3" />
          </div>
        </el-anchor>
      </el-col>
      <el-col :span="22">
        <div class="content" ref="containerRef" >
          <div
              id="part1"
              style="
              height: 300px;
              background: rgba(255, 0, 0, 0.02);
              margin-top: 0px;
            "
          >
            part1
          </div>
          <div
              id="part2"
              style="
              height: 300px;
              background: rgba(0, 255, 0, 0.02);
              margin-top: 30px;
            "
          >
            part2
          </div>
          <div
              id="part3"
              style="
              height: 300px;
              background: rgba(0, 0, 255, 0.02);
              margin-top: 30px;
            "
          >
            part3
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const containerRef = ref<HTMLElement | null>(null);
</script>
<style scoped lang="scss">
.anchor{
  background:#F5F7FA;
  height:100%;
  ::v-deep  .el-anchor__marker{
    left:30px !important;
    transition: none !important;

  }
  ::v-deep .el-anchor__link{
    font-size: 20px !important;
  }
}

.content {
  height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #DDDEE0;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #C7C9CC;
    cursor: pointer;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>