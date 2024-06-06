<template>
  <!--  <DialogDemo/>-->
  <!--  <PdfDemo/>-->
  <!--  <PdfHeigh/>-->
  <!--  <FileSplit/>-->
  <!--  <DynamicForm/>-->
  <!--  <Recursive/>-->
  <!--  <TreeShow/>-->
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
//并法请求，总共10个异步请求，一次并发5个以内.下面提供demo测试
import {concurrencyRequest, TaskQueue} from './utils/concurrencyRequest.js'

export default {
  name: 'App',
  components: {DialogDemo, PdfDemo, PdfHeigh, FileSplit, DynamicForm, Recursive, TreeShow},
  setup(props) {
    //测试队列的方式，解决并发
    function testTaskQueue() {
      function createTask(i) {
        return () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(i);
            }, 2000);
          });
        };
      }

      const taskQueue = new TaskQueue();
      for (let i = 0; i < 10; i++) {
        const task = createTask(i);
        taskQueue.addTask(task);//当所有任务添加到队列中后自动执行。
      }
    }

    //测试用同步异步的方式，解决并发
    function testConcurrencyRequest() {
      const urls = [];
      for (let i = 1; i <= 20; i++) {
        //把我ip给屏蔽了
        urls.push(`https://jsonplaceholder.typicode.com/todos/${i}`);
      }
      concurrencyRequest(urls, 3).then(res => {
        console.log(res);
      })

    }

    return {
      testTaskQueue,
      testConcurrencyRequest,
    }

  }
}
</script>

<style>

</style>
