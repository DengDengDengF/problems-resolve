<template>
  <div class="wrapper">
    <div class="container">
      <div class="card" v-for="item in num">{{item}}</div>
    </div>
  </div>

</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
let hash={1168:4,1376:5,1568:6,1910:7}
const calculateNum=()=> {
  for(let width in hash){
    if(window.innerWidth< width){
      num.value=3  * hash[width]
      return
    }
  }
  num.value=3 * 8
}
const num=ref(0)
calculateNum()
onMounted(()=>{
  window.addEventListener('resize',calculateNum)
})
onUnmounted(()=>{
   window.removeEventListener('resize',calculateNum)
})
</script>

<style scoped lang="less">

.wrapper{
  width: 100vw;
  display: flex;
  justify-content: center;
  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* 卡片间的间隙 */
    width: 86%;
    max-width: 2500px;
    min-width: 700px;
    justify-content: flex-start; /* 从左对齐 */
    border: 1px solid blue;
    .card {
      flex: 0 0 calc(12.5% - 10px); /* 默认每行8个卡片 */
      background-color: #3498db;
      border-radius: 12px;
      cursor: pointer;
      aspect-ratio: 1.38639778952; /* 强制保持宽高比例 */
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 16px;
      font-weight: bold;
    }
    /* 根据屏幕宽度调整每行卡片数量 */
    @media (max-width: 1910px) {
      .card {
        flex: 0 0 calc(14.2857% - 10px); /* 每行7个卡片 */
      }
    }

    @media (max-width: 1568px) {
      .card {
        flex: 0 0 calc(16.6667% - 10px); /* 每行6个卡片 */
      }
    }

    @media (max-width: 1376px) {
      .card {
        flex: 0 0 calc(20% - 10px); /* 每行5个卡片 */
      }
    }

    @media (max-width: 1168px) {
      .card {
        flex: 0 0 calc(25% - 10px); /* 每行4个卡片 */
      }
    }
  }
}

</style>