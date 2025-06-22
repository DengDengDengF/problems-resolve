<template>
  <div>data from page2: {{getCookie}}</div>
</template>

<script>
import {ref} from "vue";
export default {
  name: "page2",
  setup(){
    const getCookie=ref(document.cookie);
    return {getCookie};
  }
}
</script>

<style scoped>

</style>