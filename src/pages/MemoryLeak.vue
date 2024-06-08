<template>
  <div>
    <button id="myButton">click</button>
  </div>
</template>


<script>
import {onMounted, onUnmounted} from "vue";

export default {
  name: "MemoryLeak",
  setup(props) {
    const buttonClick = () => {
      console.log('buttonClick')
    }

    // 解决内存泄漏-引用计数循环，循环引用是另一个常见的内存泄漏源。当两个或多个对象相互引用时，并且没有任何引用指向它们之中的任何一个时，它们将无法被垃圾回收。
    function createObjects() {
      const obj1 = {};
      const obj2 = {};
      obj1.ref = obj2;
      obj2.ref = obj1;
      // 不再需要 obj1 和 obj2 的引用时，将它们设为 null
      obj1.ref = null;
      obj2.ref = null;
    }

    createObjects();

    /**
     * 解决内存泄漏-闭包造成的内存泄漏
     * fn函数调用完毕之后，foo函数会自动销毁，但foo函数中的变量name和age不会被销毁，因为在bar函数内部进行了访问，并且根据垃圾回收机制，被另一个作用域引用的变量不会被回收。除非bar函数解除调用才能销毁。
     * 如果该函数使用的次数很少，不进行销毁的话就会变为闭包产生的内存泄漏。
     * 说了这么多解决办法是什么呢？只需将该函数赋值为null即可。
     * 示例代码如下(承接上一个代码片段)：
     * */
    function foo() {
      var name = 'foo'
      var age = 20

      function bar() {
        console.log(name)
        console.log(age)
      }

      return bar
    }

    var fn = foo()
    fn()
    fn = null;

    onMounted(() => {
      // 内存泄漏示例-未销毁的事件监听器
      document.getElementById('myButton').addEventListener('click', buttonClick);
    })
    onUnmounted(() => {
      // 在组件卸载或不再需要时，删除事件监听器
      document.getElementById('myButton').removeEventListener('click', buttonClick);
    })
  }
}
</script>


<style scoped>

</style>
