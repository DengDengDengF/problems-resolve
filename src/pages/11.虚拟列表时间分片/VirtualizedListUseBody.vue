<template>

  <div>
    <div class="top_area" >
      <div class="top_item"/>
      <div class="top_item"/>
      <div class="top_item"/>
      <div class="top_item"/>
      <div class="top_item"/>
      <div class="top_item"/>
    </div>
    <div
        class="container"
    >
      <div  ref="wrapperArea" >
        <div ref="renderArea">
          <div  v-for="(item,index) in list" :key="index" :style="{height:constHeight + 'px'}" class="cycle">
            <div class="cycle_item"> Row:{{ item }}</div>
            <div class="cycle_item">视频</div>
            <div class="cycle_item">操作</div>
            <div class="cycle_item">状态</div>
            <div class="cycle_item">剪辑师</div>
          </div>
        </div>
        <!--底部留白是因为，我模拟数据，用的是动态高度，这里是静态-->å
      </div>
    </div>
    <div style="border: 1px solid red;height: 200px;width: 100%;box-sizing: border-box">
      fffff
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useVirtualList} from "../../utils/hooks/useVirtualList/useVirtualList.js";

const containerTarget = ref(document.documentElement);//最外层容器
const originalList = ref(Array.from(Array(200).keys())); //生成9999个demo
const overscan = 5;//可允许溢出container范围的最大个数；

const renderArea=ref()
const wrapperArea=ref()
const constHeight = 120
let list = ref([]);
// setTimeout(() => {
//   originalList.value = Array.from(Array(100).keys())
// }, 4000)
setTimeout(() => {
  originalList.value = Array.from(Array(800).keys())
}, 8000)
list = useVirtualList({
  renderArea,
  containerTarget,
  originalList,
  overscan,
  wrapperArea,
  whatHeightMode:constHeight
}).targetList
</script>
<style scoped lang="scss">
.top_area{
   .top_item{
     border: 1px solid red;width: 100%;height:200px;box-sizing: border-box
   }
}
.container{
  overflow: auto;
  border: 1px solid;
  width: 100%;
  .cycle{
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #e8e8e8;
    box-sizing: border-box;
    .cycle_item{
      width: 20%;height: 100%;border: 1px solid orange
    }
  }
}
</style>
