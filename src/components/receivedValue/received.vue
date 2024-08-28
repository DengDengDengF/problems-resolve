<template>
  <div style="width: 50%;border: 1px solid red;margin:auto">
    <h1>This is child page</h1>
    received id = {{ id }}
    <button style="margin:auto;display: block;" @click="reset">child to parent reset</button>
  </div>
</template>

<script>
import {getCurrentInstance} from "vue";

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
    // 获取当前组件实例
    const instance = getCurrentInstance();
    // 获取当前组件的上下文，下面两种方式都能获取到组件的上下文。
    const { ctx }  = getCurrentInstance();  //  方式一，这种方式只能在开发环境下使用，生产环境下的ctx将访问不到
    const { proxy }  = getCurrentInstance();  //  方式二，此方法在开发环境以及生产环境下都能放到组件上下文对象（推荐）
    //context 是一个包含组件上下文信息的对象。ctx 属性就是 setup 函数中的 context，所以 getCurrentInstance() 实际上是包含了 context 中的所有内容
    const reset = () => {
      //向父传值
      // context.emit('reset', 1);
      instance.proxy.$emit('reset',100);
    }
    return {reset,};
  }
}
</script>

<style scoped lang="less">

</style>