<template>
  <div
      ref="containerTarget"
      :style="styles"
  >
    <div v-for="(item,index) in list" :key="index" style="height: 50px;display: flex;justify-content: center;align-items: center;
        border: 1px solid #e8e8e8;box-sizing: border-box;">
      Row:{{ index }}
    </div>
  </div>
</template>


<script>

import {ref, reactive} from "vue";
import {useTimeSlicing} from "../../utils/hooks/useTimeSlicing/useTimeSlicing.js";

export default {
  name: "TimeSlicing",
  setup() {
    const containerTarget = ref(null);//最外层容器
    const originalList = Array.from(Array(100000).keys()); //生成9999个demo
    const styles = reactive({
      'height': '90vh',
      'overflow': 'hidden',
      'border': '1px solid'
    })
    let list = ref([]);//截取后的数据

    useTimeSlicing(originalList, list, styles);

    return {
      containerTarget,
      originalList,
      list,
      styles
    }
  }
}
</script>


<style scoped>

</style>
