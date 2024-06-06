<template>
<!--  <DialogDemo/>-->
<!--  <PdfDemo/>-->
<!--  <PdfHeigh/>-->
<!--  <FileSplit/>-->
<!--  <DynamicForm/>-->
<!--  <Recursive/>-->
</template>

<script>
//封装弹窗
import DialogDemo from "./pages/DialogDemo.vue";
//pdf  传入的方式不是二进制流，比较模糊  参考掘金 https://juejin.cn/post/7105933034771185701
import PdfDemo from "./pages/PdfDemo.vue";
//pdf-vue3.0 体验良好
import PdfHeigh from "./pages/pdfHeigh.vue";
//文件分批上传
import FileSplit from "./pages/FileSplit.vue";
//动态表单代码,不引用框架心血来潮写一下，css就先不写
import DynamicForm from './pages/DynamicForm.vue'
//递归组件
import Recursive from "./pages/Recursive.vue";

export default {
  name: 'App',
  components: {DialogDemo, PdfDemo,PdfHeigh,FileSplit,DynamicForm,Recursive},
  setup(props) {

  }
}
</script>

<style>

</style>
