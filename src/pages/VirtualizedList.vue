<template>
  <div
      ref="containerTarget"
      style="height: 90vh;overflow: auto;border: 1px solid "
  >
    <div ref="wrapperTarget" :style="wrapperStyle">
      <!--底部留白是因为，我模拟数据，用的是动态高度，这里是静态-->
      <div v-for="(item,index) in targetList" :key="index" style="height: 50px;display: flex;justify-content: center;align-items: center;
        border: 1px solid #e8e8e8;box-sizing: border-box;">
        Row:{{ item }}
      </div>
    </div>
  </div>
</template>


<script>

import {onMounted, ref, computed, watch, reactive, onUnmounted} from "vue";
import {isNumber} from "../utils/hooks/useVirtualList/useNumber.js";
import {useSize} from "../utils/hooks/useVirtualList/useSize.js";
import {useLatest} from "../utils/hooks/useVirtualList/useLatest.js";

export default {
  name: "virtualized",
  setup() {
    const containerTarget = ref(null);//包裹容器
    const wrapperTarget = ref(null);//渲染容器
    const originalList = Array.from(Array(995).keys()); //生成9999个demo
    const overscan = 5;//可允许溢出container范围的最大个数；
    let targetList = ref([]);//截取后的数据
    const wrapperStyle = reactive({});//包裹容器的样式

    const itemHeight = (i) => (i % 2 === 0 ? 42 + 8 : 42 + 8);//动态高度,
    const itemHeightRef = useLatest(itemHeight);
    // 列表总体高度
    const totalHeight = computed(() => {
      if (isNumber(itemHeightRef)) {
        return originalList.length * itemHeightRef;
      }
      let sum = 0;
      for (let i = 0; i < originalList.length; i++) {
        sum += itemHeightRef(i);
      }
      return sum;
    });

    //修改包裹容器样式
    const setWrapperStyle = (height, marginTop) => {
      // console.log(height)
      wrapperStyle.height = height;
      wrapperStyle.marginTop = marginTop;
      wrapperStyle.border = '1px solid red'
    }
    //设置截取的数据
    const setTargetList = (arr) => {
      targetList.value = arr;
    }
    /**
     * 计算对于container偏移量
     * @param {number} scrollTop
     * @returns
     */
    const getOffset = (scrollTop) => {
      if (isNumber(itemHeightRef)) {
        return Math.floor(scrollTop / itemHeightRef);
      }
      let sum = 0;
      let offset = 0;
      for (let i = 0; i < originalList.length; i++) {
        const height = itemHeightRef(i, originalList[i]);
        sum += height;
        if (sum >= scrollTop) {
          offset = i;
          break;
        }
      }
      return offset + 1;
    };
    /**
     * 计算可视数量
     * @param {number} containerHeight
     * @param {number} fromIndex
     * @returns
     */
    const getVisibleCount = (containerHeight, fromIndex) => {
      if (isNumber(itemHeightRef)) {
        return Math.ceil(containerHeight / itemHeightRef);
      }

      let sum = 0;
      let endIndex = 0;
      for (let i = fromIndex; i < originalList.length; i++) {
        const height = itemHeightRef(i, originalList[i]);
        sum += height;
        endIndex = i;
        if (sum >= containerHeight) {
          break;
        }
      }
      return endIndex - fromIndex;
    };

    /**
     * 获取距离顶部距离
     * @param {number} index
     * @returns
     */
    const getDistanceTop = (index) => {
      if (isNumber(itemHeightRef)) {
        const height = index * itemHeightRef;
        return height;
      }
      const height = originalList
          .slice(0, index)
          .reduce((sum, _, i) => sum + itemHeightRef(i, originalList[i]), 0);
      return height;
    };


    const calculateRange = () => {
      // 获取外部容器
      const container = containerTarget.value;
      if (container) {
        const {scrollTop, clientHeight} = container;
        const offset = getOffset(scrollTop);
        const visibleCount = getVisibleCount(clientHeight, offset);
        const start = Math.max(0, offset - overscan);
        const end = Math.min(originalList.length, offset + visibleCount + overscan);
        const offsetTop = getDistanceTop(start);

        // 设置wrapper的高度和偏移量
        setWrapperStyle(totalHeight.value - offsetTop + "px", offsetTop + "px");


        // 设置wrapper展示dom
        setTargetList(
            originalList.slice(start, end).map((ele, index) => ({
              data: ele,
              index: index + start,
            }))
        );
      }
    };

    const resize = (e) => {
      e.preventDefault();
      // alert('1')
      calculateRange();
    };
    watch(() => originalList, () => {
      resize();
    })
    onMounted(() => {
      const {width, height} = useSize(containerTarget.value);
      if (containerTarget && originalList.length > 0 && width > 0 && height > 0) {
        calculateRange();
        containerTarget.value.addEventListener("scroll", resize);
        window.addEventListener('resize', resize)
      }
    })
    onUnmounted(() => {
      if (containerTarget.value) {
        containerTarget.value.removeEventListener("scroll", resize)
      }
      window.removeEventListener("resize", resize);
    })
    return {
      containerTarget,
      wrapperTarget,
      originalList,
      targetList,
      wrapperStyle,
    }
  }
}
</script>


<style scoped>

</style>
