<template>
  <div style="width: 50%;border: 1px solid red;margin:auto">
    <h1>This is child page</h1>
    received id = {{ id }}
    <button style="margin:auto;display: block;" @click="reset">child to parent reset</button>
  </div>
</template>

<script>
export default {
  name: "received",
  //接受父传过来的值
  props: {
    id: {
      type: Number,
      required: true,
    }
  },
  setup(props, context) {
    const reset = () => {
      //向父传值
      context.emit('reset', 1);
    }
    return {reset,};
  }
}
</script>

<style scoped lang="less">

</style>