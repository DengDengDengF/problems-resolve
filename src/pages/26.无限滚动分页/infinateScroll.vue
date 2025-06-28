<template>
  <div
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="disabled"
      :infinite-scroll-distance="10"
      class="scroll-container"
  >
    <div v-for="item in list" :key="item.id" class="item">
      {{ item.content }}
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="noMore" class="no-more">没有更多数据了</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 模拟数据
const mockFetchData = (page) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const data = Array.from({ length: 10 }, (_, i) => ({
        id: page * 10 + i,
        content: `项目 ${page * 10 + i + 1}`
      }));
      resolve(data);
    }, 1000);
  });
};

// 响应式数据
const list = ref([]);
const page = ref(1);
const loading = ref(false);
const noMore = ref(false);

// 计算属性
const disabled = computed(() => loading.value || noMore.value);

// 加载更多数据
const loadMore = async () => {
  if (disabled.value) return;

  loading.value = true;
  try {
    const newItems = await mockFetchData(page.value);
    if (newItems.length > 0) {
      //后续直接改成 所有数据
      list.value = [...list.value, ...newItems];
      page.value++;
    } else {
      //后续可以适配 page pageSize判断
      noMore.value = true;
    }
  } finally {
    loading.value = false;
  }
};

// 初始加载
loadMore();
</script>

<style scoped>
.scroll-container {
  height: 500px;
  overflow-y: auto;
  border: 1px solid #eee;
  padding: 10px;
}

.item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.loading, .no-more {
  padding: 10px;
  text-align: center;
  color: #999;
}
</style>