<template>
  <div class="page-wrapper">
    <!-- 顶部动态内容 -->
    <div class="header-block">
      <BigComponent v-for="n in 3" :key="n" :index="n" />
    </div>

    <!-- 虚拟列表绑定到页面滚动条 -->
    <RecycleScroller
        :items="items"
        :item-size="rowHeight"
        key-field="id"
        :page-mode="true"
        class="virtual-list"
    >
      <template #default="{ item }">
        <div class="table-row">
          ID: {{ item.id }} - Name: {{ item.name }}
        </div>
      </template>
    </RecycleScroller>
  </div>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import BigComponent from './BigComponent.vue'

const rowHeight = 40
const items = Array.from({ length: 500000 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))
</script>

<style scoped>
.page-wrapper {
  padding: 0;
  margin: 0;
}

.header-block {
  padding: 16px;
  background: #f0f8ff;
}

.virtual-list {
  background: #fff;
  border: 1px solid red;
}

.table-row {
  height: 40px;
  line-height: 40px;
  padding: 0 12px;
  border-bottom: 1px solid #eee;
}
</style>
