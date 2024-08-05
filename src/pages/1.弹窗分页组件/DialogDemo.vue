<script>
import Dialog from '../../utils/Dialog.js';
export default {
  name: "DialogDemo",
  setup(props) {
    const comeAlert = () => {
      Dialog('500 服务器错误，稍后再试!', {title: '提示'});
    }
    return {
      comeAlert,
    }
  }
}
</script>

<template>
  <div>
    <button @click="comeAlert">alert</button>
  </div>
</template>

<style scoped>

</style>
