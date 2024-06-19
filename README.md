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

后台传递过来数据，根据后台的数据，前台实现逻辑
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

### 7.分批多线程请求、分批但是要求批次的顺序、不分批逐个上传

```js
1.分批多线程---不要求调用顺序----使用队列，

利用执行栈中的顺序，先同步后异步,维护并发队列的长度
出队列之前，队列长度--；
有回调结果后，队列长度++，进行下一个任务；
适用于，没有要求调用顺序的。文件分批上传只要，我们把哈希值、分割文件的index、传给后台即可。
但是如果要求调用顺序呢？
```

<img src="https://s2.loli.net/2024/06/06/6hqvsBK9MjkNSXL.png" alt="image.png" style="zoom: 67%;" />

```
2.分批多线程---不要求调用顺序----利用js的同步异步，虽然 队列的方式 也利用了同步异步
```

![image.png](https://s2.loli.net/2024/06/06/kIvrVEem549UYtH.png)

 

**其实算法思想都一样，都是用的队列，不过第二种含蓄点**



```js
3.分批，但是要求批次的顺序。
使用promise.all([....promise请求]).then((allData)=>{
       //递归调用,下一个批次请求
   }).catch((err)=>{
       //抛出错误,throwError(err)
   })
```

```js
4.逐个上传
callback(arr.shift()).then((result)=>{
    //递归调用,下一个请求
})
```



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

### 11.自定义hooks

```
调接口、计数器、布尔切换、窗口size
都是提取的公共逻辑，做的封装。
```

### 12.虚拟列表

```js
虚拟列表其实是按需显示的一种实现，即只对可见区域进行渲染，对非可见区域中的数据不渲染或部分渲染的技术，从而达到极高的渲染性能；
1.计算外层可视化容量：itemHeight静态Math.ceil(containerHeight / itemHeightRef)
                  itemHeight动态就从fromIndex累加
2.计算列表数据对于container的偏移数量（offset),同上
3.计算在container区域内可显示的数据个数（calculateRange）。start: offset - overscan；end: offset + visibleCount + overscan。overscan为可允许溢出container范围的最大个数；
4.计算wrapper所有item总体的高度；可以用计算属性
5.列表距container的高度（distanceTop）
6.设置wrapper的高度和偏移量.
7.设置wrapper展示dom；
8.监听scroll事件，动态计算显示区域个数、显示区域范围、已经滚动的高度、wrapper的高度以及mariginTop

虚拟列表适用于渲染大量数据项的长列表场景。
经过测试99*10^4个dom节点都不在话下
```

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ad0709233d94ab58eb9a7d5e7d095b1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?" alt="png" style="zoom:50%;" />

### 13.时间分片

```js
把长时间运行的任务，分成多个小任务，穿插在空闲时间(用requestIdleCallback)，以便让浏览器有时间进行渲染和响应用户输入。这种技术使得应用在执行繁重计算任务时，仍然能够保持界面的流畅性和响应性。
//第一种做法：固定eachRenderNum
1.计算时间片，一次性渲染多少个(eachRenderNum )，总数据(originalList)除以，得到总共渲染多少次(times)。
2.开始渲染数据，通过 index > times 判断渲染完成，如果没有渲染完成，那么通过 requestIdleCallback 浏览器空闲执行下一帧渲染
3.通过 renderList 把已经渲染的 element 缓存起来.

//第二种：动态eachRenderNum
1.空闲时间剩余 deadline.timeRemaining()
2.持续时间 performance.now() - startTime
3.若最大允许持续时间为16

在完成一帧中的输入处理、渲染和合成之后，线程会进入空闲时期（idle period），直到下一帧开始，或者队列中的任务被激活，又或者收到了用户新的输入。requestIdleCallback 定义的回调就是在这段空闲时期执行：
```

![png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a3201ed33ea4defa32b21f2ae31117c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 14.axios封装

```js
基础配置文件暴露 请求基础地址(baseURL)、是否开启token认证(useTokenAuthorization)

axios 请求拦截中
1.若开启token认证,headers['Authorization'] =localStorage.getItem("token")
2.若没有设置请求头(!config.headers["Content-Type"])，并且是post请求，
  则headers["Content-Type"] = "application/x-www-form-urlencoded";
    data = qs.stringify(config.data);//序列化
3.headers["Content-Type"]默认是 "application/json"; 

axios相应拦截，就是设定不同状态返回。
```

### 15.ref封装

```js
ref本质也用了proxy,
通过ref文件，可以完成数据的修改，均可被get、set监听到。

get中 if(activeWatcher){//有watcher
      dep.depend(activeWatcher)//收集依赖
}
set中就通知更新dep.notify()
```

