<template>
  <DialogDemo/>
<!--  <PdfDemo/>-->
  <PdfHeigh/>
</template>

<script>
//封装弹窗
import DialogDemo from "./pages/DialogDemo.vue";
//pdf  传入的方式不是二进制流，比较模糊  参考掘金 https://juejin.cn/post/7105933034771185701
import PdfDemo from "./pages/PdfDemo.vue";
//
import PdfHeigh from "./pages/pdfHeigh.vue";

export default {
  name: 'App',
  components: {DialogDemo, PdfDemo,PdfHeigh},
  setup(props) {

  }
}
</script>

<style>

</style>
