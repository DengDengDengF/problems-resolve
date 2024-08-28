<template>
  <div style="border: 1px solid black;height: 250px">
    <received :id="message" @reset="reset"/>
    <br>
    <br>
    <button style="margin:auto;display: block;" @click="message++">parent to child ++ ,message= {{ message }}</button>
  </div>
  <br/>
  <div style="border: 1px solid black;height: 100px">
    <received2/>
  </div>
  <br/>
  <div style="border: 1px solid black;height: 100px">
    <received3 v-model="res"/>
    {{res}}
  </div>
</template>

<script>
import received from '../../components/receivedValue/received.vue';
import received2 from "../../components/receivedValue/received2.vue";
import received3 from "../../components/receivedValue/received3.vue";
import {ref, provide} from "vue";



export default {
  name: "VueSend",
  components: {
    received, received2,received3
  },
  setup(props, context) {
    const message = ref(1);
    const data = ref('Hello World');
    const res=ref('res');
    //接受子传过来的值
    const reset = (val) => {
      message.value = val;
    };
    provide('data', data);
    return {
      message,
      reset,
      res,
    }
  }
}
</script>

<style scoped lang="less">

</style>