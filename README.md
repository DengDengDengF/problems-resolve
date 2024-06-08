# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) and disable Vetur



```js
npm init vite-app <projectName>

cd <projectName>

npm i

npm run dev
```

### 1.弹窗封装

```js
vue文件:通过props传入参数，依据参数进行显示，编写css
js文件：调取vue文件，传入必要参数，利用vue的unmount去卸载组件
调取js文件传入参数，参数以props的形式流动
```

### 2.pdf封装

```js
想着不用二进制流的方式去传递 使用 vue-pdf-embed，可以显示但是有些模糊，想获取页面的最大page,可是费劲了。
于是，用了某大神封装的 pdf-vue3,和vue-pdf-embed相比就是一个天上一个地下。
在使用 pdf-vue3的基础下，我给加了个 监听ctrl+wheel的事件，可以放大缩小pdf
github地址：https://github.com/hymhub/pdf-vue3
特此感谢！
```

### 3.文件上传、断点续传

```js
按照指定大小对文件进行拆分，要求每片文件都有hash、name、uploaded(是否上传)等信息
上传每片文件、合并这些文件
断点续传，就是检查文件的uploaded,对未上传的进行上传，最后进行合并
```

### 4.动态表单

```js
只考虑功能实现，不考虑css。
不显示、显示1个、显示多个，显示n个，
设计成链表就可以。
0--->null
1---->a-b
2---->{
     1，
     c-d
}
.......
```

<img src="https://s2.loli.net/2024/06/05/WwUcOydQqgGNSls.png" alt="image.png" style="zoom:50%;" />

<img src="https://s2.loli.net/2024/06/05/SWmGw5jclX2hbfL.png" alt="image.png" style="zoom:50%;" />

<img src="https://s2.loli.net/2024/06/05/skR7P6femMB2T1h.png" alt="image.png" style="zoom:50%;" />

### 5.递归template

```js
自己调用自己，适用于高度耦合的对象，
```

### 6.树形控件

```js
以下两种情况都要递归调用，结合vue3.0语法
对每一个 父 打对勾，子要全部 打对勾。------>遍历当前父的每一个子
每一个子 都 打对勾，父要全部 打对勾 ------->遍历当前子的父/父兄，做判定，
```

<img src="https://s2.loli.net/2024/06/06/RlTv6oOS9JfcVxq.png" alt="image.png"  /><img src="https://s2.loli.net/2024/06/06/eDJpwrT24UWlCyx.png" alt="image.png"  /><img src="https://s2.loli.net/2024/06/06/yH9AKRonvumNW6h.png" alt="image.png"  />

### 7.分批多线程请求

```js
1.使用队列
```

<img src="https://s2.loli.net/2024/06/06/6hqvsBK9MjkNSXL.png" alt="image.png" style="zoom: 67%;" />

```
2.利用js的同步异步，虽然 队列的方式 也利用了同步异步
```

![image.png](https://s2.loli.net/2024/06/06/kIvrVEem549UYtH.png)

 

**其实算法思想都一样，都是用的队列，不过第二种含蓄点**

### 8.策略模式

```
封装策略，实现可复用、可扩展和可维护，并且避免大量复制粘贴的工作。
给了一个表单校验简单demo展示
```

### 9.拖拽排序封装

```js
用到了drag的api，实现拖拽排序
核心模块思路，删除原来位置，新位置之前插入，
当然还涉及到一些封装思路。
频繁的拖拽，还要写个防抖函数，略。
```

<img src="https://s2.loli.net/2024/06/07/8NcmhTS4bExiLJO.png" alt="image.png" style="zoom:50%;" />

### 10.内存泄露

```js
闭包、循环引用、dom引用等
```

