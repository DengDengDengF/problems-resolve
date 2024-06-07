<template>
  <!--  <DialogDemo/>-->
  <!--  <PdfDemo/>-->
  <!--  <PdfHeigh/>-->
  <!--  <FileSplit/>-->
  <!--  <DynamicForm/>-->
  <!--  <Recursive/>-->
  <!--  <TreeShow/>-->
  <!--  <AsyncRequest/>-->
<!--  <StrategyLogin/>-->
<!--  <DragSort/>-->
<!--  <DragSortablejs/>-->

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
//树形控件
import TreeShow from "./pages/TreeShow.vue";
//并发请求
import AsyncRequest from "./pages/AsyncRequest.vue";
//策略模式-login
import StrategyLogin from "./pages/StrategyLogin.vue";
//拖拽排序、双列拖拽排序、以及调用现成的库
import DragSort from "./pages/DragSort.vue";
import DragSortablejs from "./pages/DragSortablejs.vue";
export default {
  name: 'App',
  components: {DialogDemo,
    PdfDemo,
    PdfHeigh,
    FileSplit,
    DynamicForm,
    Recursive,
    TreeShow,
    AsyncRequest,
    StrategyLogin,
    DragSort,
    DragSortablejs
  },

  setup(props) {

  }
}
</script>

<style>

</style>
