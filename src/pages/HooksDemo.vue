<template>
  <button @click="useFetchTest">useCounter测试</button>
  <button @click="useCounterTest(1)">useCounter + 测试</button>
  <button @click="useCounterTest(0)">useCounter - 测试</button>
  <button @click="useToggleTest">useToggle 测试</button>
</template>


<script>
import {onMounted, onUnmounted, ref} from "vue";
//调接口
import {useFetch} from "../utils/hooks/useFetch.js";
//计数器
import {useCounter} from "../utils/hooks/useCounter.js";
//布尔切换
import {useToggle} from "../utils/hooks/useToggle.js";
//改变窗口size
import {useWindowSize} from "../utils/hooks/useWindowSize.js";

export default {
  name: "HooksDemo",
  setup() {
    let count = ref(0); //测试计数器
    let flag = ref(false);

    async function useFetchTest() {
      //我自己随手写的一个python接口，用的flask库写的接口，flask_cors解决的跨域
      let res = await useFetch('http://127.0.0.1:5000/api/add?a=1&b=2')
      console.log(res.value)
    }

    function useCounterTest(flag) {
      count.value = useCounter(count.value, flag);
      console.log(count.value);
    }

    function useToggleTest() {
      flag.value = useToggle(flag.value);
    }

    onMounted(() => {
      window.addEventListener('resize', useWindowSize);
    })
    onUnmounted(() => {
      window.removeEventListener('resize', useWindowSize);
    })
    return {useFetchTest, useCounterTest, useToggleTest}
  }
}
</script>


<style scoped>

</style>
