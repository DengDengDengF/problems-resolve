<template>
  <div>
    <button @click="testEcho">testEcho</button>
    <button @click="testAdd">testAdd</button>
  </div>
</template>


<script>
import  {add,echo} from "../http/api/test.js";

export default {
  name: "AxiosDemo",
  setup() {
    const testEcho = async() => {
      let str={'fuck':'123'};
      let data=await echo(str);
      console.log(data)
    }
     const testAdd = async() => {
         let params={a:1,b:2};
         let data=await add(params);
         console.log(data)
    }
    return {
      testEcho,
      testAdd
    }
  }
}
</script>


<style scoped>

</style>
