<template>
  <div
      ref="containerTarget"
      style="height: 90vh;overflow: auto;border: 1px solid"
  >
    <div :style="wrapperStyle">
      <!--底部留白是因为，我模拟数据，用的是动态高度，这里是静态-->
      <div v-for="(item,index) in list" :key="index" style="height: 50px;display: flex;justify-content: center;align-items: center;
        border: 1px solid #e8e8e8;box-sizing: border-box;">
        Row:{{ item }}
      </div>
    </div>
  </div>
</template>


<script>

import {ref, reactive} from "vue";
import {useVirtualList} from "../../utils/hooks/useVirtualList/useVirtualList.js";

export default {
  name: "virtualized",
  setup() {
    const containerTarget = ref(null);//最外层容器
    const originalList = Array.from(Array(900000).keys()); //生成9999个demo
    const overscan = 5;//可允许溢出container范围的最大个数；
    let list = ref([]);//截取后的数据
    const wrapperStyle = reactive({
        // 'max-height':'1000000px',
        // 'overflow':'hidden'
    });//包裹容器的样式;

    list = useVirtualList({containerTarget, originalList, overscan, wrapperStyle}).targetList;

    return {
      containerTarget,
      originalList,
      list,
      wrapperStyle,
    }
  }
}
</script>


<style scoped>

</style>
