<template>
  <div>跨层级传输接受到数据 : {{data}}</div>
</template>

<script>
import {inject} from 'vue';

export default {
  name: "received2",
  setup() {
    const data = inject('data');
    return {data};
  }
}
</script>

<style scoped>

</style>