<!-- components/BigComponent.vue -->
<template>
  <div class="big">
    <h3>Big Component {{ index }}</h3>
    <p v-for="i in randomLines" :key="i">这是第 {{ i }} 行内容</p>
  </div>
</template>

<script setup>
defineProps({
  index: Number
})

const randomLines = Math.floor(Math.random() * 6 + 3) // 随机 3~8 行
</script>

<style scoped>
.big {
  padding: 12px;
  margin: 8px;
  background: #eef;
  border: 1px solid #aac;
  border-radius: 4px;
}
</style>
