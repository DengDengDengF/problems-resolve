<template>
<!--    <DialogDemo/>-->
<!--    <PdfDemo/>-->
<!--    <PdfHeigh/>-->
  <!--  <FileSplit/>-->
  <!--  <DynamicForm/>-->
<!--    <Recursive/>-->
<!--    <TreeShow/>-->
  <!--  <AsyncRequest/>-->
  <!--  <StrategyLogin/>-->
  <!--  <DragSort/>-->
  <!--  <DragSortablejs/>-->
  <!--  <MemoryLeak/>-->
  <!--  <HooksDemo/>-->
  <!--  <Virtualized/>-->
  <!--  <TimeSlicing/>-->
  <!--  <AxiosDemo/>-->
  <!--  <Templates/>-->
  <!--  <PicLazy/>-->
  <!--  <FormElementUI/>-->
  <!--  <PageDemo/>-->
  <!--  <StyleDemo/>-->
  <!--  <SSE/>-->
  <!--  <WebSocket/>-->
  <!--  <Live/>-->
  <!--  <Live2/>-->
  <!--  <RouterDemo/>-->
  <!--  <SingleSignOn/>-->
  <!--  <VueSend/>-->
<!--  <FormDrag/>-->
<!--  <ElCas/>-->
<!--  <ElTree/>-->
<!--  <ElTreeEdit/>-->
<!--  <CascaderComplex/>-->
<!--  <MultiFormCheck/>-->
<!--  <videoScript/>-->
<!--  <CheckAll/>-->
<!--  <TableHead/>-->
<!--  <uploadDemo/>-->
<!--  <columnDemo/>-->
<!--<BlobPic/>-->
<!--  <ScriptExportWord/>-->
<!--  <Clip/>-->
<!--  <BestDownload/>-->
<!--  <WebScene/>-->
<!--  <ElCascaderSingleMulti/>-->
<!--  <FuckElCascader/>-->
<!--  <TableSort/>-->
<!--  <uploadFiles/>-->
<!--  <BestMultityUpload/>-->
<!--  <InfinateScroll/>-->
<!--  <TableOuterScroll/>-->
  <TableBar/>
</template>

<script setup>
//封装弹窗
import DialogDemo from "./pages/1.弹窗分页组件/DialogDemo.vue";
//pdf  传入的方式不是二进制流，比较模糊  参考掘金 https://juejin.cn/post/7105933034771185701
import PdfDemo from "./pages/2.pdf/PdfDemo.vue";
//pdf-vue3.0 体验良好
import PdfHeigh from "./pages/2.pdf/pdfHeigh.vue";
//文件分批上传
import FileSplit from "./pages/3.文件分批上传/FileSplit.vue";
//动态表单代码,不引用框架心血来潮写一下，css就先不写
import DynamicForm from './pages/4.动态表单以及表单封装/DynamicForm.vue'
//递归组件
import Recursive from "./pages/5.递归组件 和 树形控件/Recursive.vue";
//树形控件
import TreeShow from "./pages/5.递归组件 和 树形控件/TreeShow.vue";
//并发请求
import AsyncRequest from "./pages/6.并发请求/AsyncRequest.vue";
//策略模式-login
import StrategyLogin from "./pages/7.策略模式/StrategyLogin.vue";
//拖拽排序、双列拖拽排序、以及调用现成的库
import DragSort from "./pages/8.拖拽排序/DragSort.vue";
import DragSortablejs from "./pages/8.拖拽排序/DragSortablejs.vue";
//内存泄漏
import MemoryLeak from "./pages/9.内存泄漏/MemoryLeak.vue";
//vue3.0自定义hooks
import HooksDemo from "./pages/10.hooks案例/HooksDemo.vue";
//虚拟列表
import Virtualized from "./pages/11.虚拟列表时间分片/VirtualizedList.vue";
//时间分片
import TimeSlicing from "./pages/11.虚拟列表时间分片/TimeSlicing.vue";
//axios封装
import AxiosDemo from "./pages/12.axios封装/AxiosDemo.vue";
//vue3.0 简易版双向绑定
import Templates from "./pages/13.vue3.0 双向绑定/Templates.vue";
//图片懒加载
import PicLazy from "./pages/14.图片懒加载/PicLazy.vue";
//表单封装
import FormElementUI from "./pages/4.动态表单以及表单封装/FormElementUI.vue";
//锚点
import AnchorForm from "./pages/4.动态表单以及表单封装/AnchorForm.vue"
//分页组件
import PageDemo from "./pages/1.弹窗分页组件/PageDemo.vue";
//css预处理器使用
import StyleDemo from './pages/15.css预处理器/StyleDemo.vue';
//媒体查询
import MediaDemo from "./pages/15.css预处理器/mediaDemo.vue";
//chatgpt 流传输 一个字一个字蹦出来
import SSE from './pages/16.SSE 和 websocket/SSE.vue';
//websocket
import WebSocket from "./pages/16.SSE 和 websocket/WebSocket.vue";
//在线播放
import Live from './pages/17.直播/Live.vue';
//在线直播
import Live2 from "./pages/17.直播/Live2.vue";
//路由实现
import RouterDemo from "./pages/18.路由原理以及动态路由/RouterDemo.vue";
//单点登录
import SingleSignOn from "./pages/19.单点登录/SingleSignOn.vue";
//动态路由demo
import {res} from "./utils/RouteTest.js";
//vue3.0 组件传值
import VueSend from "./pages/20.vue3组件传值/VueSend.vue";
//前端场景题
import WebScene from "./pages/21.场景题/WebScene.vue";
//form拖拽
import FormDrag from "./pages/8.拖拽排序/FormDrag.vue"
//cascader
import ElCas from "./pages/5.递归组件 和 树形控件/ElCascader.vue"
//cascader 第一层单选后续多选
import ElCascaderSingleMulti from "./pages/5.递归组件 和 树形控件/el-cascader-single-multi.vue";
//傻逼
import FuckElCascader from "./pages/5.递归组件 和 树形控件/fuck-el-cascader.vue";
//抽象树
import ElTree from "./pages/5.递归组件 和 树形控件/El-Tree-Add.vue"
import ElTreeEdit from "./pages/5.递归组件 和 树形控件/EL-Tree-Edit.vue"
import CascaderComplex from "./pages/5.递归组件 和 树形控件/Cascader-complex.vue";
//form表单 复杂校验
import MultiFormCheck from "./pages/5.递归组件 和 树形控件/MutilFormCheck.vue"
//脚本模板
import videoScript from "./pages/5.递归组件 和 树形控件/video-script/video-script.vue"
import CheckAll from "./pages/4.动态表单以及表单封装/CheckAll.vue"
import TableHead from "./pages/5.递归组件 和 树形控件/TableHead.vue"
import TableSort from "./pages/5.递归组件 和 树形控件/TableSort.vue";
import uploadFiles from "./pages/3.文件分批上传/uploadFiles.vue"
import uploadDemo from "./pages/5.递归组件 和 树形控件/uploadDemo.vue"
import columnDemo from "./pages/5.递归组件 和 树形控件/columnDemo.vue"
//上传
import BestMultityUpload from "./pages/22.多文件上传以及并发/BestMultityUpload.vue";
//下载
import BestDownload from "./pages/23.大文件下载/BestDownload.vue";
//脚本导出word
import ScriptExportWord from "./pages/24.脚本导出word/ScriptExportWord.vue";
//blob图片
import BlobPic from "./pages/14.图片懒加载/BlobPic.vue";
//剪切板
import Clip from "./pages/25.读取剪切板/clip.vue";
//无限滚动
import InfinateScroll from "./pages/26.无限滚动分页/infinateScroll.vue";
import TableOuterScroll from "./pages/5.递归组件 和 树形控件/table-outer-scroll.vue";
//tabel吸顶底部
import TableBar from "./pages/27.table/table-bar.vue";
</script>

<style>

</style>
