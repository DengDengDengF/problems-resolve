<template>
  <div>
    asyncRequest 自行debugger测试demo
    <br>
    <button @click="testTaskQueue">不要求异步调用顺序----->测试队列的方式，解决并发，</button>
    <br>
    <button @click="testConcurrencyRequest">不要求异步调用顺序----->测试用同步异步的方式，解决并发</button>
    <br>
    <button @click="testSortRequest">要求异步调用顺序------->解决并发，分批调用,要求批次顺序</button>
    <br>
    <button @click="testByRequest">要求异步调用顺序-------->请求逐个上传，要求顺序</button>
  </div>
</template>


<script>
import {concurrencyRequest, TaskQueue, sortRequest, byRequest} from '../../utils/concurrencyRequest.js'
//10个请求，1次并发5个, 模式在我写的READEME.md中有详细过程。
export default {
  name: "AsyncRequest",
  setup(props) {
    //不要求异步调用顺序----->测试队列的方式，解决并发，
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

      //确保执行栈执行顺序，等到同步代码执行完毕，先执行TaskQueue中的run()方法
      const taskQueue = new TaskQueue();
      for (let i = 0; i < 10; i++) {
        //执行TaskQueue中的run()方法，再执行createTask
        const task = createTask(i);
        taskQueue.addTask(task);//当所有任务添加到队列中后自动执行。
      }
    }

    //不要求异步调用顺序----->测试用同步异步的方式，解决并发
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

    //要求异步调用顺序------->解决并发，分批调用,要求批次顺序
    function testSortRequest() {
      let maxRequestLength = 5;
      let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

      //请求模拟
      function getInfo(item, minRequestLength) {
        return new Promise((resolve, reject) => {
          // 使用settimeout模拟请求
          const ms = 1000 * Math.ceil(Math.random() * minRequestLength);
          setTimeout(() => {
            resolve(item);
          }, ms);
          console.log(`${item} time: ${ms}`);
        });
      }

      sortRequest(arr, maxRequestLength, getInfo);
    }

    //要求异步调用顺序-------->请求逐个上传，要求顺序
    function testByRequest() {
      let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      //请求模拟
      function getInfo(item) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(item);
          }, 1000);
          console.log(`请求模拟-->${item}`);
        });
      }
      byRequest(arr, getInfo);
    }


    return {
      testTaskQueue,
      testConcurrencyRequest,
      testSortRequest,
      testByRequest,
    }
  }
}
</script>


<style scoped>

</style>
