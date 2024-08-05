<template>
  <div>
    <div>
      <button @click="testEcho">testEcho</button>
    </div>
    <br>
    <div>
      <button @click="testAdd">testAdd</button>
    </div>  <br>

    <div>
      <div id="message">{{ message }}</div>
      <button @click="changeMessage">test $nextTick</button>
    </div>  <br>
    <demoTest :message="message" @changeMessage="changeMessage"/>
  </div>
</template>


<script>
import {add, echo} from "../../http/api/test.js";
import {nextTick, ref} from "vue";
//父子传参 vue3.0
import demoTest from "../../components/demoTest.vue";
export default {
  name: "AxiosDemo",
  components:{demoTest},
  setup() {
    const message = ref('hello');
    const changeMessage = async () => {
      message.value += '!';
      console.log('数据更改，dom更新前', document.getElementById('message').innerText)
      await nextTick(() => {
        // alert('数据更改，dom更新后');
        console.log('数据更改，dom更新后', document.getElementById('message').innerText);
      });
      console.log('now dom is updated')
    }
    const testEcho = async () => {
      let str = {'fuck': '123'};
      let data = await echo(str);
      console.log(data)
    }
    const testAdd = async () => {
      let params = {a: 1, b: 2};
      let data = await add(params);
      console.log(data)
    }
    return {
      testEcho,
      testAdd,
      changeMessage,
      message,
    }
  }
}
</script>


<style scoped>

</style>
