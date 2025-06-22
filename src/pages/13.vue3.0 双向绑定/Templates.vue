<template>
  <div id="main">

  </div>
  <div>
    <button @click="add"> ++</button>
  </div>
</template>


<script>
//https://segmentfault.com/a/1190000044769265
import {ref} from '../../utils/vue3/Observe.js';
export default {
  name: "templates",
  setup() {
    let count = ref(1000);

    const add = () => {
      count.value++;
    }
    return {
      add,
    }
  }
}
</script>


<style scoped>

</style>
