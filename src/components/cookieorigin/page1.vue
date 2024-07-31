<template>
<div>data from page1: {{getCookie}}</div>
</template>

<script>
import {ref} from "vue";

export default {
  name: "page1",
  setup(){
      const getCookie=ref(document.cookie);
      return {getCookie};
  }
}
</script>

<style scoped>

</style>