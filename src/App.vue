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
  <!--    <DragSort/>-->
  <!--  <DragSortablejs/>-->
  <!--  <MemoryLeak/>-->
  <!--   <HooksDemo/>-->
  <!--  <Virtualized/>-->
  <!--  <TimeSlicing/>-->
  <!--    <AxiosDemo/>-->
  <!--  <Templates/>-->
  <!--    <PicLazy/>-->
  <!--  <FormElementUI/>-->
  <!--  <PageDemo/>-->
  <!--  <StyleDemo/>-->
  <!--  <SSE/>-->
  <!--  <WebSocket/>-->
  <!--    <Live/>-->
  <!--     <Live2/>-->
  <!--  <RouterDemo/>-->
  <SingleSignOn/>
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
//内存泄漏
import MemoryLeak from "./pages/MemoryLeak.vue";
//vue3.0自定义hooks
import HooksDemo from "./pages/HooksDemo.vue";
//虚拟列表
import Virtualized from "./pages/VirtualizedList.vue";
//时间分片
import TimeSlicing from "./pages/TimeSlicing.vue";
//axios封装
import AxiosDemo from "./pages/AxiosDemo.vue";
//vue3.0 简易版双向绑定
import Templates from "./pages/Templates.vue";
//图片懒加载
import PicLazy from "./pages/PicLazy.vue";
//表单封装
import FormElementUI from "./pages/FormElementUI.vue";
//分页组件
import PageDemo from "./pages/PageDemo.vue";
//css预处理器使用
import StyleDemo from './pages/StyleDemo.vue';
//chatgpt 流传输 一个字一个字蹦出来
import SSE from './pages/SSE.vue';
//websocket
import WebSocket from "./pages/WebSocket.vue";
//在线播放
import Live from './pages/Live.vue';
//在线直播
import Live2 from "./pages/Live2.vue";
//路由实现
import RouterDemo from "./pages/RouterDemo.vue";
//单点登录
import SingleSignOn from "./pages/SingleSignOn.vue";

export default {
  name: 'App',
  components: {
    DialogDemo,
    PdfDemo,
    PdfHeigh,
    FileSplit,
    DynamicForm,
    Recursive,
    TreeShow,
    AsyncRequest,
    StrategyLogin,
    DragSort,
    DragSortablejs,
    MemoryLeak,
    HooksDemo,
    Virtualized,
    TimeSlicing,
    AxiosDemo,
    Templates,
    PicLazy,
    FormElementUI,
    PageDemo,
    StyleDemo,
    SSE,
    WebSocket,
    Live,
    Live2,
    RouterDemo,
    SingleSignOn,
  },
  setup(props) {

  }
}
</script>

<style>

</style>
