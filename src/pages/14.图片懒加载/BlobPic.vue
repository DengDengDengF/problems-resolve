<template>
  <div>
    <el-image
        v-for="item in 10"
        :src="bigPic"
        style="width: 200px; height: 200px; margin-right: 10px"
    >
      <template #loading>
        <div class="image-slot">Loading...</div>
      </template>
    </el-image>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const bigPic="https://w.wallhaven.cc/full/rr/wallhaven-rr886m.jpg"
</script>

<style scoped>
</style>
