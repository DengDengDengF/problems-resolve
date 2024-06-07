<template>
  <div>
    asyncRequest 自行debugger测试demo
  </div>
</template>


<script>
import {concurrencyRequest, TaskQueue} from '../utils/concurrencyRequest.js'
//10个请求，1次并发5个, 模式在我写的READEME.md中有详细过程。
export default {
  name: "AsyncRequest",
  setup(props) {
    //测试队列的方式，解决并发
    function testTaskQueue() {
      debugger

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
      debugger
      const urls = [];
      for (let i = 1; i <= 20; i++) {
        //把我ip给屏蔽了,建议自己用python写一个接口
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


<style scoped>

</style>
